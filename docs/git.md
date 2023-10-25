# Git을 통한 배포

2023.09.06

## 계기

기존의 배포의 경우, 직접 배포환경에 copy & paste 하는 식이였다.
이 경우 몇 가지 문제가 있다.

> 시간이 매우 오래 걸린다. <br/>
> 백업을 위해 용량이 큰 폴더들을 저장해둔다. <br/>
> 빠른 수정 등이 필요한 경우, 배포가 오래 걸려 불편하다.
> 원격 환경에서 진행이 되다보니, 불안정한 부분이 있다.

## 전략

Git flow, TBD 등이 있다. 현재 프로젝트의 크기가 그렇게 크지 않다는점, 또한 1인개발을 진행중이라는 점 등을 고려할 때, TBD에 가깝게 진행을 하기로 결정했다.

개발을 위한 "dev" branch와 배포를 위한 "master" branch를 둔다.
또한 "dev" branch의 경우, 다른 local 환경에서도 작업이 가능해야 된다.

> **Note** </br>
> CI/CD 등의 경우, 아직 도입할 단계는 아니라 생각한다. 따라서 간단히 git으로 pull 정도만 돼도 불편한 부분들을 다수 개선이 가능해보인다.

## 단계

개발환경에서, 다음과 같은 폴더구조를 가진다 가정해보자.

```bash
ROOT
├── dataset
├── document
├── module
├── project
└── venv
```

그렇다면, 어떤 폴더들을 remote repository에 올려야 될까?
위의 폴더들은 다음과 같이 분류가 가능하다.

1. 배포를 위한 폴더 및 파일들 -> `master` branch
2. 개발에 필요하며, remote repository에 올릴 폴더 및 파일들 -> `dev` branch
3. 개발에 필요하지만, remote repository에 올리면 안되는 폴더 및 파일들 -> `.gitignore`

</br>
각 케이스 별로 해당하는 폴더는 다음과 같다.  
  
1 -> project  
2 -> project, document  
3 -> venv, module, dataset

## 적용

#### 1. Initialize

```bash
cd ROOT
git init
```

#### 2. `.gitignore` 파일 생성

위 케이스에서, 3번에 해당하는 폴더 및 파일들을 적어주자.

```bash
# .gitignore
venv/
module/
dataset/
```

**주의사항**  
만약, 폴더에 아무 파일이 없는 경우, 깃은 무시한다.
따라서, 아무 파일이나 넣어주자. 보통은 다음과 같이 `.gitkeep`파일을 넣어준다.

```bash
touch project/.gitkeep document/.gitkeep module/.gitkeep dataset/.gitkeep  dataset/.gitkeep
```

#### 3. dev

먼저, `dev`에서 commit을 해주자

```bash
git checkout -b dev
git add .
git commit -m "First commit for dev branch"
```

#### 4. master

# key chain

깃허브에 push를 하려할 때, 다음과 같은 에러가 나왔다.

> Missing or invalid credentials

이는, github token을 새로 발급받아서 해결 가능하다.

## 1. Personal Access Token 발급

깃허브 설정-> developer settings -> Tokens(classic)
토큰을 발급
(Workflow, gist 허용했다.)

**해당 키는 발급받고 바로 저장해두어야된다. 다른 곳으로 이동하는 경우 바로 사라진다.**

## 2. credential.helper사용

다음을 command에 입력해준다.

```zsh
git config --global credential.helper osxkeychain
```

정상적으로 적용된 경우, 다음커맨드를 입력시 `osxkeychain`이 출력되어야된다.

```zsh
git config --global credential.helper
```

## 3. 키체인에 token 추가

### 일반적인 접근법

1. Mac의 키체인 접근에서 `github`를 입력한다.
2. 결과들 중, 접근 제어-> 접근 허용 리스트에 `git-credential-osxkeychain` 항목이 있는지 확인한다.
3. 해당 항목의 속성에서 비밀번호를 입력하는 칸에 token값을 입력해준다.

### 나의 방법

나의 경우, keychain 항목에 github항목이 없었다. 따라서 다음과 같이 진행했다.

1. private repository를 clone한다. 이 경우 id와 pw를 입력하라 나온다.
2. id에는 깃허브의 id를 적어준다.
3. pw에는 깃허브의 비밀번호가 아닌, **`token`** 을 붙여넣기해준다.

그 후 다시 키체인 접근을 보면 정상적으로 키체인이 생성된걸 확인할 수 있고, 마찬가지로 깃도 작동을 잘 한다.

# git feature branch

feature branch를 사용해서 개발한다.

branch는 다음과 같다.

> main, dev

### dev branch 깨끗하게 만들기

먼저, dev branch에 stage가 안된게 있나 확인하고, 있는 경우, commit이나 stash를 진행해준다.즉, dev branch를 깨끗하게 만들어준다.

commit은 다음과 같다.

```cmd
git status
git add .
git commit -m "stage"
```

stash의 경우, 임시로 파일의 변경 내용을 기록해두는 영역이다. commit을 하기엔 애매한 경우 사용하면 좋다.
다른 작업들을 처리하고, 해당 내용을 다시 불러와 작업을 이어서 할 수 있다.

```cmd
git status
# stash changes
git stash
# Apply the latest stash
git stash apply
```

### create new branch

feature branch를 생성하고, 작업을 진행한다. 단, 이름은 `feature/featurename`과 같이 한다.
추후에, 사용자명이나, 이슈 추척이 필요한 경우, `feature/username-issuenum-featurename`식으로 진행한다.

```cmd
git checkout -b feature/my-feature
```

### merge

작업이 끝난 경우, 병합을 진행한다. 먼저 feature branch에서 add/commit이 안된게 있으면, add/commit 해주자.

```cmd
git add .
git commit -m "feature done"
```

그 후, dev branch로 가서 병합을 진행한다. 이제 feature작업이 끝났으므로 해당 branch는 삭제한다.

```cmd
git checkout dev
git merge --no-ff feature/my-feature
git branch -d feature/my-feature
```

마지막으로, remote repository에 올려준다.

```cmd
git push -u origin dev
```
