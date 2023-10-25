## Courseware

### 작업환경 설정

가상환경 생성

```cmd
python -m venv myvenv
cd courseware
pip install -r requirements.txt
```

노드 모듈 설치

```cmd
npm install
```

### 프로젝트 실행

```cmd
python3 manage.py runserver
```

```cmd
npm run dev
```

### 코스 불러오기

API사용하는 방법에 대한 간단한 예제코드입니다.

> "30f29a71-f0ff-47d8-94f2-9fae580bd93f"

js: [`test.js`](./_user/static/js/test.js)

Html: [`test.html`](./_user/templates/_user/test.html)

link: `http://localhost:8000/user/test/`

사용할일이 더 없으시면, url, views.py, test.js, test.html 등 관련된걸 지워주세요.

### 기타

API 파일
`static/js/core/api/api-cp.js`
