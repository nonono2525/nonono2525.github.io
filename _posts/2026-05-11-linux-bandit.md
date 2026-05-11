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
<img width="1228" height="415" alt="스크린샷 2026-05-09 170451" src="https://github.com/user-attachments/assets/e92ee418-3f53-4d05-82fd-e47e5b362af2" />

exit을 통해 서버에서 나가고

ssh -p 2220 bandit1@bandit.labs.overthewire.org 으로 레벨 1 서버에 접속한 다음 방금 얻은 비밀번호를 입력하면 된다

---

## Level 1 → 2

다음 레벨의 비밀번호는 홈 디렉터리에 있는 '-' 라는 파일에 저장되어 있다고 한다.

보통 dash(-)는 명령어의 옵션과 arguments로 사용되기 때문에 "-" 파일을 열기위해서는 더 많은 주의가 필요하다.

-으로 시작하는 경우엔 ./-file.txt 라고 적거나 또는 -- -file.txt 를 이용한다

cat의 경우에는 cat < - 

이런 식으로 리다이렉션을 이용하여 출력할 수 있다
<img width="491" height="123" alt="스크린샷 2026-05-09 173525" src="https://github.com/user-attachments/assets/4460e32d-1ad3-4628-b001-0c55f0ef107c" />


---

## Level 2 → 3

이번 문제에는 파일 이름에 공백이 포함되어 있다
<img width="795" height="167" alt="스크린샷 2026-05-09 174556" src="https://github.com/user-attachments/assets/bd83e28a-2cf0-4c96-8b1e-45642ac27498" />

파일 이름에 공백이 포함되어 있는 경우에는

"my file.txt" 또는 my\ file.txt 처럼 따옴표나 이스케이프 문자를 쓰면 된다



---

## Level 3 → 4

이번 문제에선 비밀번호가 inhere디렉토리의 숨김 파일 안에 있다고 한다. 

```bash
ls -a    # 숨김 파일 포함
ls -A    # . 과 .. 제외하고 숨김 파일만
```

<img width="719" height="293" alt="스크린샷 2026-05-09 175632" src="https://github.com/user-attachments/assets/f41c0388-e41f-40d8-9591-0738e4fb3f8a" />

> `.` 은 현재 디렉토리, `..` 은 상위 디렉토리를 의미한다.

---

## Level 4 → 5

**human-readable 파일**에 비밀번호가 있다.

말그대로 사람이 읽을 수 있는 파일!

- human-readable: `.txt`, `.csv`, `.py`, `.html`, `.json` 등
- non-readable: `.exe`, `.jpg`, `.mp3` 등 이진 데이터

파일 이름이 `-`로 시작하기 때문에 `./`를 붙여서 `file` 명령어를 사용한다.

<img width="1272" height="820" alt="스크린샷 2026-05-09 180802" src="https://github.com/user-attachments/assets/03e12aa2-3086-40a1-b2d9-dec8687da78e" />

-file07만 ASCII text(human-readable)


---

## Level 5 → 6

조건: `human-readable` / `1033 bytes` / `not executable`

`inhere` 디렉토리 안에 디렉토리가 20개나 있으므로 `find` 명령어를 활용한다.

```bash
find . -type f          # 파일만
find . -size +100M      # 100MB 초과 파일

find . -type f -size 1033c
```
<img width="1442" height="398" alt="스크린샷 2026-05-09 183244" src="https://github.com/user-attachments/assets/729835a0-4006-4897-85d6-1bf812dad71e" />

파일이 하나 나왔고, `file` 명령어로 확인하니 ASCII text였다.

---

## Level 6 → 7

조건: `owned by user bandit7` / `owned by group bandit6` / `33 bytes`

```bash
find / -type f -user bandit7 -group bandit6 -size 33c
```
find . -type f -user bandit7 -group bandit6

라고 입력했을 때 아무것도 나오지 않았다. 그래서 전체 시스템에서 찾아봤다

되게 많은 파일들 중에서 Permission denied가 아닌 파일을 찾았다
<img width="680" height="426" alt="스크린샷 2026-05-09 192318" src="https://github.com/user-attachments/assets/f5823fc9-5b62-42b2-b46e-19bfe8f62897" />
<img width="847" height="70" alt="스크린샷 2026-05-09 192334" src="https://github.com/user-attachments/assets/b0d54e4a-2030-4a30-a54a-15a71f072af8" />

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

<img width="745" height="53" alt="스크린샷 2026-05-09 193331" src="https://github.com/user-attachments/assets/6c6cfe74-ac64-415f-8c01-ff2948cf4a97" />

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

**Redirection** = 이 스트림의 방향을 바꾸는 것 (파일로, 파일에서)
```bash
stdout → 파일로 (>, >>)
ls > output.txt          # ls 결과를 파일에 저장 (덮어쓰기)
ls >> output.txt         # ls 결과를 파일에 추가 (이어쓰기)

echo "hello" > file.txt  # "hello"를 파일에 저장
echo "world" >> file.txt # "world"를 파일에 추가

 
파일 → stdin으로 (<)
sort < file.txt          # file.txt 내용을 sort의 입력으로
grep "error" < log.txt   # log.txt를 grep의 입력으로

 
stderr 처리 (2>)
ls /없는경로 2> error.txt        # 에러만 파일로
ls /없는경로 2>> error.txt       # 에러를 파일에 추가
ls /없는경로 2> /dev/null        # 에러 무시 (버리기)
```

**Piping** = 한 프로그램의 stdout을 다른 프로그램의 stdin으로 연결

```bash
ls | grep "txt"           # ls 출력에서 txt 포함 줄만 필터
cat log.txt | sort        # 파일 내용을 정렬
```
 (처음 풀었을 때 정렬된 상태로 해야하는 걸 몰라서 헤맸다)
 <img width="623" height="62" alt="스크린샷 2026-05-09 225054" src="https://github.com/user-attachments/assets/4ae65864-0995-4100-85b8-a736747c86ca" />


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
<img width="843" height="475" alt="스크린샷 2026-05-09 230847" src="https://github.com/user-attachments/assets/cc087509-ca2b-4894-94ef-de46b4757286" />

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

<img width="881" height="70" alt="스크린샷 2026-05-09 234708" src="https://github.com/user-attachments/assets/0f1916ff-eea1-4bb5-8d95-6a8dfdb9b547" />

형식: tr '원래세트' '바꿀세트' 이므로

'A-Za-z' 'N-ZA-Mn-za-m'  요런 식으로 적어두 된다

처음에 그걸 몰랐어서... 바보 코드를 썼다

---

## Level 12 → 13

`data.txt`는 **여러 번 압축된 파일의 16진수 덤프**다.

작업용 임시 디렉토리를 먼저 만든다.

```bash
mktemp -d          # 임시 디렉토리 생성
cp data.txt /tmp/작업폴더/
```

1. `file [파일명]` — 파일 형식 확인
2. `mv [파일명] [파일명.확장자]` — 확장자 맞게 이름 변경
3. 압축 해제 명령어 실행 (`tar`, `gzip`, `bzip2` 등)
4. `ls -l` 로 새로 생긴 파일 확인 (실제로 풀때는 -l 옵션을 안 넣어서.. 조금 오래걸렸다)
5. 위 과정 반복

<img width="1887" height="900" alt="스크린샷 2026-05-10 005342" src="https://github.com/user-attachments/assets/3781b075-1510-46d1-a0ce-3a9907a83f97" />


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

이번 문제가 나는 조금 까다롭게 느껴졌다. 이래저래 오류도 많았고.. 

최종적으로 어떻게 풀었냐면

ls 했을 때 파일 두 개가 나왔는데, 하나는 HINT 다른 하나는 sshkey.private 이라는 파일이었다

아까 ssh 명령어 정리하는 과정에서 ssh -i ~/.ssh/id_rsa user@host  라는 명령어가 있었던 게 생각이 났고,

비밀번호는 모르지만 저 private키를 이용하면 되지 않을까 싶었다.

맨처음에 exit을 안한 bandit13서버 상태에서 했을 땐 당연히 안됐다

그래서 key를 메모장에 복사해놓고 exit을 한 뒤 내 리눅스 홈 디렉토리에서

nano ~/bandit14.key 리눅스 편집기로 새 파일을 만들고 아까 복사했던 key를 붙여넣은 뒤 저장했다

그 다음 chmod 600 ~/bandit14.key 으로 권한을 수정해주고 (처음에 window에 저장하고 권한 수정 안했더니 안됐음..)

ssh -i ~/bandit14.key bandit14@bandit.labs.overthewire.org -p 2220 을 통해 문제를 풀 수 있었다 어휴

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

<img width="992" height="92" alt="스크린샷 2026-05-11 003141" src="https://github.com/user-attachments/assets/b97fdbb8-caa4-42dd-b28b-e660a1c9add9" />

```bash
echo "현재레비밀번호" | nc localhost 30000
```

---

## Level 15 → 16

이번에는 **SSL/TLS 보안 연결**을 통해 비밀번호를 전송해야 한다.

#### `openssl s_client` — SSL/TLS 연결 테스트

```bash
echo "현재비밀번호" | openssl s_client -connect localhost:30001 -quiet
```


nc를 사용해 생(Plain) 데이터를 보냈다면, 이번에는 보안 연결(SSL/TLS)을 통해 비밀번호를 보내야 한다. 

이번 레벨 비밀번호를 입력했더니 다음 레벨의 비밀번호를 수신받았다

<img width="952" height="82" alt="스크린샷 2026-05-11 011038" src="https://github.com/user-attachments/assets/fd57a6b3-c5c9-4781-90a9-b8d5c97fa94c" />
<img width="500" height="168" alt="스크린샷 2026-05-11 011030" src="https://github.com/user-attachments/assets/da8d694c-0438-4ad6-9aa0-758e2a0724c5" />


---

## Level 16 → 17

`localhost`의 **31000~32000번 포트** 중 SSL을 지원하며 올바른 응답을 주는 포트를 찾아야 한다.

#### `nmap` — 네트워크 스캐너

```bash
nmap -sV -p 31000-32000 localhost
```

<img width="1138" height="368" alt="스크린샷 2026-05-11 020101" src="https://github.com/user-attachments/assets/b2ec7cf3-d117-4cd1-8e9a-6660b1ff47ce" />

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
<img width="807" height="204" alt="스크린샷 2026-05-11 021438" src="https://github.com/user-attachments/assets/ac49fc0b-5212-4271-9581-23e02bd6d9a9" />


---

## Level 18 → 19

`.bashrc`가 수정되어 SSH 로그인 시 즉시 로그아웃된다.

ssh의 역할이 뭐였는지 상기해보면 금방 풀 수 있을 것 같다

SSH의 **원격 명령어 실행** 기능을 활용한다.

<img width="1307" height="413" alt="스크린샷 2026-05-11 022408" src="https://github.com/user-attachments/assets/90d8f944-a874-4ed8-9c03-0b75826ac882" />

```bash
ssh -p 2220 bandit18@bandit.labs.overthewire.org "cat readme"
```

ssh는  특정 명령어만 실행하고 연결을 종료하는 기능도 제공한다. 이 경우 .bashrc가 실행되기 전에 명령어가 실행되거나, 실행되더라도 우리가 원하는 결과를 먼저 얻을 수 있다.

---

## Level 19 → 20

홈 디렉토리의 **SetUID 바이너리**를 이용해야 한다.

이번 문제에서는 setuid에 대한 개념이 필요하다

> **SetUID:** 파일을 실행할 때 실행한 사람의 권한이 아니라 파일 소유자의 권한으로 실행되게 하는 특수 권한  
> `rws r-x r-x` 형태로 표시됨

<img width="958" height="259" alt="스크린샷 2026-05-11 023328" src="https://github.com/user-attachments/assets/9a8376c3-915a-4407-b8a0-ec9c9caea325" />

위에 보이는 바와 같이 bandit20-do 파일은 SetUID설정이 되어있는 파일이고

단순히 실행했을 때 ./bandit20-do whoami 와 같이 사용하라고 되어있다

그래서 cat 해줬다

---

## Level 20 → 21

setuid 바이너리가 지정한 포트의 localhost에 연결하여 bandit20 비밀번호를 확인하고, 맞으면 bandit21 비밀번호를 전송한다.

이번 문제는 우리가 클라이언트와 서버 역할을 모두 수행해야한다. 


바이너리가 포트의 localhos에 연결한 다음 텍스트 한 줄을 읽어온다고 하는 점에서 클라이언트라는  결론을 냈다.

근데 지금 서버 역할을 하는 게 아무것도 없으므로 내가 서버를 열어야 하고, nc를 쓰면 될 것이다.


서버 역할, 클라이언트 역할을 할 터미널을 각각 한 개씩 열어서 총 두개의 터미널을 사용하는 방법이 쉽긴 하지만, 문제의 필요한 명령어 부분에서 작업 제어에 대한 언급이 있으므로 이를 이용해보겠다.


**작업 제어(Job Control)**
```bash
포그라운드 (Foreground) = 터미널을 점유하며 실행
백그라운드 (Background) = 터미널 뒤에서 조용히 실행

& — 백그라운드 실행
sleep 100 &             # 처음부터 백그라운드로 실행
python server.py &      # 서버를 백그라운드에서 실행

Ctrl+Z — 포그라운드 → 일시정지
jobs — 작업 목록 확인
bg — 백그라운드에서 재개 (Ctrl+Z로 멈춘 작업을 백그라운드에서 계속 실행)
fg — 백그라운드 → 포그라운드
```
<img width="1473" height="167" alt="스크린샷 2026-05-11 120349" src="https://github.com/user-attachments/assets/321ffa86-44eb-43ac-9555-46aed3fdd75b" />

echo "bandit20 비밀번호" | nc -lp 1234 & sleep 2 && ./suconnect 1234

(nc | echo 순서로 적으면 nc에서 입력 받은 데이터를 echo에게 전달하라는 의미가 되버림!)

echo "bandit20 비밀번호" | nc -lp 1234 &  => 백그라운드에서 실행

sleep 2 && ./suconnect 1234 => 2초 쉰 다음 바이너리 실행해서 방금 만든 서버로 접속

---

## Level 21 → 22

**cron**으로 정기 실행되는 스크립트를 분석한다.

#### `cron` — 시간 기반 작업 스케줄러

```bash
crontab -l    # 목록 보기
crontab -e    # 편집
crontab -r    # 삭제 (주의: 전체 삭제!)
```
먼저 /etc/cron.d/ 디렉토리 안에 어떤 파일이 있는지 확인해보자
<img width="939" height="511" alt="스크린샷 2026-05-11 125955" src="https://github.com/user-attachments/assets/1f0ef973-b20b-40ce-926a-389867af7e36" />
우리가 읽을 수 있는 파일이 6개가 있는데 (-------r-- 형태) 그 중에서 누가봐도 수상한 cronjob_bandit22 의 내용을 출력보면

* * * * * bandit22 /usr/bin/cronjob_bandit22.sh &> /dev/null

매분마다 bandit22의 권한으로 /usr/bin/cronjob_bandit22.sh 를 실행시키고 있다

<img width="1005" height="170" alt="스크린샷 2026-05-11 131351" src="https://github.com/user-attachments/assets/226b1e32-e007-47d0-953d-f87d8eb83ea4" />
/usr/bin/cronjob_bandit22.sh 의 내용을 출력해보자

/tmp/t706~~ 의 파일의 권한을 644로 하고 변경하고

bandit22의 비밀번호를 읽어서 /tmp/t706~~ 파일 안에 넣었다.

따라서 이걸 출력하면 끄읏.

---

## Level 22 → 23

이전 레벨과 동일한 접근으로 `cronjob_bandit23.sh`을 분석한다.
<img width="1063" height="682" alt="스크린샷 2026-05-11 133603" src="https://github.com/user-attachments/assets/7e69c4b6-c8db-40a0-be90-7871e8d75a19" />


스크립트는 `echo I am user bandit23 | md5sum | cut -d ' ' -f 1` 의 결과를 파일명으로 사용하여 `/tmp/$mytarget`에 비밀번호를 저장한다.

따라서 이 파일명을 알아낸 뒤 비밀번호를 알아내면 끄읏

<img width="1066" height="123" alt="스크린샷 2026-05-11 140732" src="https://github.com/user-attachments/assets/484d35fb-0990-402e-9f9f-ebfef5226457" />


---

## Level 23 → 24

<img width="995" height="568" alt="스크린샷 2026-05-11 141730" src="https://github.com/user-attachments/assets/61dbbd8d-0638-493f-b2d4-b5990d1da4cd" />

결론적으로 얘기하자면, 현재 $myname은 bandit23이고,

/var/spool/bandit23/foo 로 이동하여 소유자가 bandit23인 일반 파일인 경우에 실행하고, 실행 여부와 상관없이 모든 파일을 삭제한다

 
여기서 우리는 bandit24의 비밀번호가 궁금한데, 그것은 bandit24의 권한이다.

근데 이 파일은 bandit24의 권한으로 실행되고 있고, 소유자가 bandit23인 파일을 대신 실행해주는 거다

따라서, bandit24의 비밀번호를 읽어와 다른 곳에 저장하는 스크립트의 파일을  /var/spool/bandit23/foo에 저장한다면!

이 파일을 실행시켜 우리는 비밀번호를 얻어낼 수 있을 거다


/tmp/adoifjasoi/scripts.sh 파일에 cat /etc/bandit_pass/bandit24 > /tmp/adoifjasoi/pw 라고 적고 (권한 꼭 실행할 수 있게 변경!)

이를 /var/spool/bandit23/foo 디렉토리 안에 복사하는 방식을 선택했다

<img width="1050" height="200" alt="스크린샷 2026-05-11 210208" src="https://github.com/user-attachments/assets/3b9e31af-0160-4736-b2d9-fdfb1b6e005c" />

위와 같이 pw 파일이 생긴 걸 볼 수 있다!

이걸 읽어주면 끄읏!

---

## Level 24 → 25

**bandit24 비밀번호 + 4자리 PIN**을 30002번 포트로 전송하면 bandit25 비밀번호를 받을 수 있다.  
PIN은 0000~9999까지 **브루트포스**로 찾아야 한다.

<img width="1703" height="715" alt="스크린샷 2026-05-11 220923" src="https://github.com/user-attachments/assets/e894cee0-d567-4392-b718-1588588e84a9" />


```bash
# /tmp/fjdafiodoijfd/bforce.sh
PASSWORD="bandit24비밀번호"
for pin in {0000..9999}
do
    echo "$PASSWORD $pin"
done | nc localhost 30002 > /tmp/fjdafiodoijfd/result.txt

```
PASSWORD라는 변수를 설정한 뒤에, bandit24 비밀번호를 저장하고

pin이라는 변수에 0000부터 9999까지 하나씩 대입하며 루프를 돌렸다

이때 매번, 비밀번호+pin 형태의 문자열이 만들어지는데 이를 30002번 포트에서 돌아가는 서버로 보냈다

그리고 돌아오는 응답을 result.txt 파일에 모두 저장했다


```bash
chmod +x /tmp/fjdafiodoijfd/bforce.sh
/tmp/fjdafiodoijfd//bforce.sh
grep -v "Wrong" /tmp/fjdafiodoijfd/result.txt
```
만든 스크립트 파일의 권한을 변경한 뒤 실행해주었다

실행한 결과로 얻은 파일을 grep을 이용하여 정답만 필터링 하였다. ( "Wrong"이라는 글자가 포함되지 않은 줄만 보이도록)

---

