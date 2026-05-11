---
layout: post-detail
title: "리눅스 기반 시스템 탐색 및 데이터 분석"
date: 2026-05-11
category: "blog"
---

# OverTheWire Bandit 워게임 풀이 — WSL & Linux 기초 명령어

## 미션 목표

WSL 환경에서 리눅스 기본 명령어를 활용하여 파일 시스템을 탐색하고, 숨김 파일 및 특수 파일을 식별하며 인코딩된 데이터를 해석하는 능력을 습득하기

\+ CLI(Command Line Interface) 환경에 익숙해지고, 보안 및 시스템 분석의 기초 역량을 기르는 것!

---

## WSL 설치

> **WSL(Windows Subsystem for Linux)** 이란?  
> 윈도우 10 이상에서 리눅스 배포판(Ubuntu, Debian 등)을 네이티브에 가깝게 실행할 수 있도록 해주는 마이크로소프트의 공식 기능

---

## Level 0

Ubuntu 터미널에서 원격 서버에 접속하는 것이 목표!

**사용 명령어:** `ssh`

포트번호, 서버주소, 사용자ID, 사용자Password가 제공되므로 다음과 같이 입력한다.

```bash
ssh -p 2220 bandit0@bandit.labs.overthewire.org
```

---

## Level 0 → 1

**명령어:** `ls`, `cd`, `cat`, `file`, `du`, `find`

### 기본 명령어 정리

#### `ls` — 디렉토리 내용 보기

```bash
ls              # 현재 디렉토리 목록
ls -l           # 상세 정보 (권한, 크기, 날짜)
ls -a           # 숨김 파일 포함
ls -lh          # 파일 크기를 읽기 쉽게 (KB, MB)
ls -lt          # 수정 시간순 정렬
ls -R           # 하위 디렉토리까지 재귀적으로
ls /etc         # 특정 경로 목록
```

#### `cd` — 디렉토리 이동

```bash
cd /home/user   # 절대 경로로 이동
cd Documents    # 상대 경로로 이동
cd ..           # 상위 디렉토리로
cd ~            # 홈 디렉토리로
cd -            # 이전 디렉토리로
cd /            # 루트 디렉토리로
```

#### `cat` — 파일 내용 출력

```bash
cat file.txt            # 파일 내용 출력
cat -n file.txt         # 줄 번호 표시
cat file1 file2         # 여러 파일 연결 출력
cat file1 file2 > out   # 파일 합치기
cat > newfile.txt       # 새 파일 작성 (Ctrl+D로 종료)
cat -A file.txt         # 특수문자(탭, 줄끝) 표시
```

#### `file` — 파일 형식 확인

```bash
file image.png          # 파일 타입 판별
file *                  # 현재 디렉토리 모든 파일
file -i doc.pdf         # MIME 타입 출력
file -z archive.gz      # 압축 파일 내부 타입 확인
file /bin/bash          # 실행 파일 정보
```

#### `du` — 디스크 사용량 확인

```bash
du                      # 현재 디렉토리 사용량 (블록 단위)
du -h                   # 읽기 쉬운 단위 (KB, MB, GB)
du -s /home/user        # 총합만 표시
du -sh *                # 각 항목별 크기 요약
du -a                   # 파일 단위로 모두 표시
du --max-depth=1        # 1단계 하위까지만
du -h | sort -h         # 크기순 정렬
```

#### `find` — 파일 검색

```bash
# 이름으로 검색
find . -name "*.txt"            # 현재 위치에서 .txt 파일
find /home -name "report.pdf"   # 특정 경로에서 검색
find . -iname "*.PDF"           # 대소문자 무시

# 타입으로 검색
find . -type f          # 파일만
find . -type d          # 디렉토리만

# 시간 기준
find . -mtime -7        # 7일 이내 수정된 파일
find . -newer file.txt  # file.txt보다 최근 파일

# 크기 기준
find . -size +100M      # 100MB 초과 파일
find . -size -1k        # 1KB 미만 파일

# 검색 후 실행
find . -name "*.log" -delete              # 찾은 파일 삭제
find . -name "*.sh" -exec chmod +x {} \;  # 권한 변경
```

---

## Level 1 → 2

다음 레벨의 비밀번호는 홈 디렉터리에 있는 `-` 라는 파일에 저장되어 있다.

보통 대시(`-`)는 명령어의 옵션과 인수로 사용되기 때문에, `-` 파일을 열기 위해서는 더 많은 주의가 필요하다.

```bash
cat ./-          # ./ 접두사 사용
cat -- -         # -- 뒤에 입력
cat < -          # 리다이렉션 이용
```

---

## Level 2 → 3

파일 이름에 **공백**이 포함된 경우 따옴표 또는 이스케이프 문자를 사용한다.

```bash
cat "my file.txt"
cat my\ file.txt
```

---

## Level 3 → 4

비밀번호가 `inhere` 디렉토리의 **숨김 파일** 안에 있다.

```bash
ls -a    # 숨김 파일 포함
ls -A    # . 과 .. 제외하고 숨김 파일만
```

> `.` 은 현재 디렉토리, `..` 은 상위 디렉토리를 의미한다.

---

## Level 4 → 5

**human-readable 파일**에 비밀번호가 있다.

- human-readable: `.txt`, `.csv`, `.py`, `.html`, `.json` 등
- non-readable: `.exe`, `.jpg`, `.mp3` 등 이진 데이터

파일 이름이 `-`로 시작하기 때문에 `./`를 붙여서 `file` 명령어를 사용한다.

```bash
file ./-file07   # -file07만 ASCII text(human-readable)
```

---

## Level 5 → 6

조건: `human-readable` / `1033 bytes` / `not executable`

`inhere` 디렉토리 안에 디렉토리가 20개나 있으므로 `find` 명령어를 활용한다.

```bash
find . -type f -size 1033c
```

파일이 하나 나왔고, `file` 명령어로 확인하니 ASCII text였다.

---

## Level 6 → 7

조건: `owned by user bandit7` / `owned by group bandit6` / `33 bytes`

```bash
find / -type f -user bandit7 -group bandit6 -size 33c
```

전체 시스템에서 검색하면 Permission denied가 아닌 파일을 찾을 수 있다.

---

## Level 7 → 8

`data.txt` 파일에서 `millionth` 단어 옆에 비밀번호가 있다.

#### `grep` — 패턴 검색

```bash
grep "hello" file.txt          # 파일에서 "hello" 포함 줄 출력
grep -i "error" file.txt       # 대소문자 무시
grep -n "error" file.txt       # 줄 번호 표시
grep -v "error" file.txt       # 반전 (불일치)
grep -r "error" .              # 재귀 검색
grep -E "cat|dog" file.txt     # OR 검색
ps aux | grep "python"         # 파이프 활용
```

```bash
grep "millionth" data.txt
```

---

## Level 8 → 9

`data.txt`에서 **딱 한 번만 등장하는 줄**이 비밀번호다.

#### `sort` — 정렬

```bash
sort file.txt          # 알파벳 오름차순
sort -r file.txt       # 내림차순
sort -n file.txt       # 숫자 기준 정렬
sort -u file.txt       # 정렬 + 중복 제거
```

#### `uniq` — 중복 제거 (반드시 정렬된 상태에서 사용)

```bash
uniq file.txt          # 중복된 인접 줄 제거
uniq -c file.txt       # 중복 횟수 표시
uniq -d file.txt       # 중복된 줄만 출력
uniq -u file.txt       # 중복 없는 줄만 출력
```

```bash
sort data.txt | uniq -u
```

---

## Level 9 → 10

`data.txt`에서 `=` 문자가 앞에 붙은 human-readable 문자열이 비밀번호다.

#### `strings` — 바이너리에서 문자열 추출

```bash
strings binary_file              # 기본 추출 (4글자 이상)
strings binary_file | grep "password"
```

```bash
strings data.txt | grep "="
```

> `grep`을 먼저 적용하면 `binary file matches` 오류가 발생하므로 순서에 주의!

---

## Level 10 → 11

`data.txt`는 **Base64로 인코딩**된 데이터다.

#### `base64` — 인코딩/디코딩

```bash
base64 file.txt                   # 인코딩
echo "hello" | base64             # 문자열 인코딩
base64 -d encoded.txt             # 디코딩
echo "aGVsbG8K" | base64 -d      # 문자열 디코딩
```

```bash
base64 -d data.txt
```

> 폴더가 읽기 전용이면 `/tmp/` 디렉토리를 활용하면 된다.

---

## Level 11 → 12

모든 소문자(a-z)와 대문자(A-Z)가 **13자리씩 이동(ROT13)** 되어 있다.

#### `tr` — 문자 치환/삭제

```bash
echo "hello" | tr 'a-z' 'A-Z'         # 소→대문자
echo "h-e-l-l-o" | tr '-' ' '         # - 를 공백으로 치환
echo "hello 123" | tr -d '0-9'        # 숫자 삭제
echo "heeello" | tr -s 'e'            # 연속된 같은 문자 압축
```

```bash
cat data.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'
```

---

## Level 12 → 13

`data.txt`는 **여러 번 압축된 파일의 16진수 덤프**다.

작업용 임시 디렉토리를 먼저 만든다.

```bash
mktemp -d          # 임시 디렉토리 생성
cp data.txt /tmp/작업폴더/
```

풀이 절차:

1. `file [파일명]` — 파일 형식 확인
2. `mv [파일명] [파일명.확장자]` — 확장자 맞게 이름 변경
3. 압축 해제 명령어 실행 (`tar`, `gzip`, `bzip2` 등)
4. `ls -l` 로 새로 생긴 파일 확인
5. 위 과정 반복

---

## Level 13 → 14

비밀번호 대신 **SSH 개인키**가 제공된다. `/etc/bandit_pass/bandit14`는 bandit14 사용자만 읽을 수 있다.

#### `ssh` — 원격 서버 접속

```bash
ssh user@hostname
ssh -p 2222 user@hostname            # 포트 지정
ssh -i ~/.ssh/id_rsa user@host       # 키 파일 지정
ssh user@host "ls -la"               # 명령어 원격 실행
```

#### `chmod` — 파일 권한 변경

```bash
# 숫자 방식 (r=4, w=2, x=1)
chmod 755 file   # rwxr-xr-x
chmod 644 file   # rw-r--r--
chmod 600 file   # rw-------

# 문자 방식
chmod u+x file   # 소유자에게 실행 권한 추가
chmod g-w file   # 그룹의 쓰기 권한 제거
```

풀이:

```bash
nano ~/bandit14.key          # 키 내용 붙여넣기
chmod 600 ~/bandit14.key     # 권한 변경 (필수!)
ssh -i ~/bandit14.key bandit14@bandit.labs.overthewire.org -p 2220
```

---

## Level 14 → 15

현재 레벨 비밀번호를 `localhost`의 **30000번 포트**로 전송하면 다음 비밀번호를 받을 수 있다.

#### `nc` (netcat) — 네트워크 통신 도구

```bash
nc -l 1234              # 서버 모드 (listen)
nc host 1234            # 클라이언트 모드
nc -zv host 20-80       # 포트 스캔
```

```bash
echo "현재비밀번호" | nc localhost 30000
```

---

## Level 15 → 16

이번에는 **SSL/TLS 보안 연결**을 통해 비밀번호를 전송해야 한다.

#### `openssl s_client` — SSL/TLS 연결 테스트

```bash
echo "현재비밀번호" | openssl s_client -connect localhost:30001 -quiet
```

---

## Level 16 → 17

`localhost`의 **31000~32000번 포트** 중 SSL을 지원하며 올바른 응답을 주는 포트를 찾아야 한다.

#### `nmap` — 네트워크 스캐너

```bash
nmap -sV -p 31000-32000 localhost
```

`-sV` 옵션으로 각 포트가 echo 서버인지 SSL 서버인지 파악한다. SSL이 적용된 포트 중 비밀번호를 입력했을 때 그대로 반환하지 않는 포트가 정답이다.

결과로 **RSA PRIVATE KEY**가 주어지며, Level 13 → 14와 동일한 방식으로 활용한다.

---

## Level 17 → 18

`passwords.old`와 `passwords.new` 중 **변경된 유일한 줄**이 비밀번호다.

#### `diff` — 두 파일의 차이점 출력

```bash
diff passwords.old passwords.new
```

출력 예시:

```
2c2
< 바나나    ← passwords.old 내용
---
> 딸기      ← passwords.new 내용
```

---

## Level 18 → 19

`.bashrc`가 수정되어 SSH 로그인 시 즉시 로그아웃된다.

SSH의 **원격 명령어 실행** 기능을 활용한다.

```bash
ssh -p 2220 bandit18@bandit.labs.overthewire.org "cat readme"
```

`.bashrc`가 실행되기 전에 명령어를 먼저 실행하여 결과를 얻을 수 있다.

---

## Level 19 → 20

홈 디렉토리의 **SetUID 바이너리**를 이용해야 한다.

> **SetUID:** 파일을 실행할 때 실행한 사람의 권한이 아니라 파일 소유자의 권한으로 실행되게 하는 특수 권한  
> `rws r-x r-x` 형태로 표시됨

```bash
./bandit20-do cat /etc/bandit_pass/bandit20
```

---

## Level 20 → 21

setuid 바이너리가 지정한 포트의 localhost에 연결하여 bandit20 비밀번호를 확인하고, 맞으면 bandit21 비밀번호를 전송한다.

**작업 제어(Job Control)** 를 활용해 터미널 하나로 클라이언트·서버 역할을 동시에 수행한다.

| 명령어 | 설명 |
|--------|------|
| `명령어 &` | 백그라운드 실행 |
| `Ctrl+Z` | 포그라운드 → 일시정지 |
| `jobs` | 작업 목록 확인 |
| `bg` | 백그라운드에서 재개 |
| `fg` | 포그라운드로 전환 |

```bash
echo "bandit20비밀번호" | nc -lp 1234 & sleep 2 && ./suconnect 1234
```

---

## Level 21 → 22

**cron**으로 정기 실행되는 스크립트를 분석한다.

#### `cron` — 시간 기반 작업 스케줄러

```bash
crontab -l    # 목록 보기
crontab -e    # 편집
crontab -r    # 삭제 (주의: 전체 삭제!)
```

```bash
cat /etc/cron.d/cronjob_bandit22
cat /usr/bin/cronjob_bandit22.sh
```

스크립트가 `/tmp/t706~~` 파일에 bandit22 비밀번호를 저장하고 있으므로 해당 파일을 읽으면 된다.

---

## Level 22 → 23

이전 레벨과 동일한 접근으로 `cronjob_bandit23.sh`을 분석한다.

```bash
cat /usr/bin/cronjob_bandit23.sh
```

스크립트는 `echo I am user bandit23 | md5sum | cut -d ' ' -f 1` 의 결과를 파일명으로 사용하여 `/tmp/$mytarget`에 비밀번호를 저장한다.

```bash
echo I am user bandit23 | md5sum | cut -d ' ' -f 1
# 위 결과값을 mytarget으로 사용
cat /tmp/[위에서 나온 값]
```

---

## Level 23 → 24

`cronjob_bandit24.sh`는 `/var/spool/bandit23/foo` 안에서 **소유자가 bandit23인 파일을 실행한 뒤 삭제**한다.

bandit24 권한으로 실행되는 점을 이용해, 비밀번호를 읽어오는 스크립트를 작성하여 해당 디렉토리에 복사한다.

```bash
# /tmp/작업폴더/script.sh 내용
cat /etc/bandit_pass/bandit24 > /tmp/작업폴더/pw
```

```bash
chmod +x /tmp/작업폴더/script.sh
cp /tmp/작업폴더/script.sh /var/spool/bandit23/foo/
# 잠시 후
cat /tmp/작업폴더/pw
```

---

## Level 24 → 25

**bandit24 비밀번호 + 4자리 PIN**을 30002번 포트로 전송하면 bandit25 비밀번호를 받을 수 있다.  
PIN은 0000~9999까지 **브루트포스**로 찾아야 한다.

```bash
# /tmp/작업폴더/brute.sh
PASSWORD="bandit24비밀번호"
for pin in $(seq -w 0 9999); do
    echo "$PASSWORD $pin"
done | nc localhost 30002 > result.txt
```

```bash
chmod +x brute.sh
./brute.sh
grep -v "Wrong" result.txt
```

---

*작성자 본인의 OverTheWire Bandit 워게임 풀이 기록*
