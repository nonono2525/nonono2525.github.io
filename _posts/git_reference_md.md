# Git 명령어 정리

---

## 기본 개념

### commit
디렉토리/프로젝트의 스냅샷. 매우 가볍고 커밋 간 전환도 빠름.

### branch
커밋에 대한 포인터(참조). 하나의 커밋과 그 부모 커밋들을 포함하는 작업 내역.

```bash
git branch feature        # feature 브랜치 생성
git checkout feature      # feature 브랜치로 이동 (HEAD 변경)
git checkout -b feature   # 생성 + 이동 한번에
```

### HEAD
현재 작업 중인 커밋을 가리키는 포인터. 항상 작업 트리의 가장 최신 커밋을 가리킴.

**HEAD 분리(Detached HEAD)** = HEAD를 브랜치 대신 특정 커밋에 직접 붙이는 것.

```bash
git checkout abc1234   # 커밋 해시로 직접 이동 → HEAD 분리됨
```

---

## 브랜치 합치기

### git merge [브랜치명]
두 브랜치를 합침. 두 브랜치의 공통 조상을 기준으로 합쳐 **새 Merge 커밋**을 생성.

```bash
git checkout main
git merge feature   # feature를 main에 병합
```

### git rebase [브랜치명]
커밋들을 복사해서 다른 곳에 순서대로 이어 붙임. merge와 달리 **히스토리가 선형**으로 깔끔해짐.

```bash
git checkout feature
git rebase main     # feature 커밋들을 main 끝으로 이어 붙임
```

---

## 상대 참조

### ^ 캐럿 연산자
한 번에 한 커밋씩 거슬러 올라감. 여러 개 이어붙이면 그만큼 올라감.

```bash
git checkout HEAD^    # 한 커밋 위로
git checkout HEAD^^^  # 세 커밋 위로
```

### ~숫자 틸드 연산자
한 번에 여러 커밋 위로 이동.

```bash
git checkout HEAD~3          # 세 커밋 위로
git branch -f main HEAD~3    # main 브랜치를 강제로 3커밋 위로 이동
```

---

## 작업 되돌리기

### git reset
브랜치를 이전 커밋으로 되돌림. 애초에 커밋하지 않은 것처럼 만듦.

> ⚠️ 로컬에서만 사용. 이미 push한 커밋에 쓰면 원격과 히스토리가 어긋남.

```bash
git reset HEAD~1
```

### git revert
되돌린 내용을 **새 커밋**으로 만들어 저장. 이전 커밋의 반대 변경사항이 새 커밋에 담김.

> ✅ 원격 저장소에 push된 커밋을 되돌릴 때 사용. 다른 사람과 함께 작업하는 브랜치라면 항상 revert.

```bash
git revert HEAD
```

---

## 원하는 커밋만 고르기

### git cherry-pick \<커밋1\> \<커밋2\> ...
지정한 커밋들의 복사본을 현재 HEAD 아래에 만들어 붙임.
커밋 해시를 알 때 사용. 특정 브랜치의 버그 수정 커밋 하나만 가져올 때 유용.

```bash
git cherry-pick abc123 def456   # 두 커밋을 현재 위치에 복사
```

### git rebase -i HEAD~4
인터랙티브 리베이스. 커밋 해시를 몰라도 됨. UI로 커밋 순서 변경, 삭제, 스쿼시(합치기) 가능.

디버그용 print 코드가 섞인 커밋을 제거하거나 순서를 바꿔 main에 깔끔하게 합칠 때 유용.

```bash
# 에디터에서 아래 항목 수정 가능:
pick abc123  기능 추가
pick def456  버그 수정   # 순서 바꾸거나
drop ghi789  디버그 코드  # drop으로 제거
```

---

## 태그 & 위치 확인

### git tag
영구적인 이정표. 브랜치와 달리 절대 이동하지 않음. 커밋을 지정하지 않으면 HEAD에 태그 생성.

```bash
git tag v1.0 abc123   # 특정 커밋에 태그
git tag v1.0          # HEAD에 태그
```

### git describe [ref]
가장 가까운 태그 기준으로 현재 위치를 설명해줌.

출력 형식: `<태그명>-<N커밋수>-g<커밋해시>`

```bash
git describe HEAD
# 예시 출력: v1.0-3-gabc123
# → v1.0 태그에서 3커밋 앞, 현재 해시 abc123
```

---

## 원격 저장소

### git clone
원격 저장소 전체를 로컬에 복사.

```bash
git clone https://github.com/user/repo.git
```

### git fetch
원격에 있는 새 커밋을 다운로드해서 `origin/브랜치`를 업데이트함. **로컬 브랜치나 파일은 건드리지 않음.**

```bash
git fetch                      # 전체 fetch
git fetch origin foo           # origin의 foo 브랜치만 가져와 o/foo에 반영
git fetch origin src:dest      # src를 가져와 로컬 dest 브랜치에 저장
git fetch origin :newbranch    # source 없이 → 로컬에 빈 브랜치 생성
```

### git pull
`git fetch` 후 `git merge`를 한 번에 실행한 것.

```bash
git pull            # fetch + merge
git pull --rebase   # fetch + rebase (히스토리 선형 유지)
```

### git push
로컬 커밋을 원격에 업로드. 어떤 브랜치에 있든 지정한 브랜치를 push.

```bash
git push origin main         # 현재 위치 무관, main을 push
git push origin src:dest     # 로컬 src → 원격 dest로
git push origin :foo         # 원격 foo 브랜치 삭제 (없음을 push)
```

### 원격 추적 설정
로컬 브랜치가 특정 원격 브랜치를 추적하도록 연결함. push/pull 시 자동으로 해당 원격 브랜치와 동기화.

```bash
git checkout -b myBranch o/main   # 생성과 동시에 o/main 추적
git branch -u o/main foo          # 기존 foo 브랜치가 o/main 추적하도록 설정
```
