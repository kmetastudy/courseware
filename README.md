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

## 학생화면 보여주기

`_courseware/_st/static/js/st.js`

**[`_st`](./_st/static/js/st.js)의 구조**

간략하게만

- StManager
  - StudyCourseContainer : coursebook/coursebranch데이터를 가져온다.(수정 필요)
    - ApiCp
  - StudyCourseBuilder
    - ApiCp
    - TestumPlayer
    - LessonPlayer

**StudyCourseBuilder**만 사용하시면 됩니다.

## 준비

#### HTML

`_st.html`을 사용하시면 됩니다. `sweetalert`의 경우 빌드한 파일이 아니라, 테스트용으로 cdn에서 가져왔습니다

#### `Django`

##### Models

사용하는 모델은, `_cp`앱에 있는 `mCourse`와 `mElement`입니다. 다른 모델은 사용하지 않으셔도 됩니다.

##### View

> **`get-content`**

Branch 의 id를 가지고, unit, element등의 데이터를 가져옵니다.

`content_type`, `course_id`, `content_id`를 header에 보내주세요.
성공적으로 처리되면, 결과는 다음과 같습니다.

```python
results = {
	   "content_list": [],
	   "units": [],
	   "content_type": 11
}
```

## 실행

`StudyCourseBuilder`에 있는, `onChangeCourseContentHandler` 함수를 실행하시면 됩니다. `index.js`라는 파일에서 실행한다 가정하면, 다음과 같습니다.

```js
// index.js
import { StudyCourseBuilder } from "../path/to/study-course-builder.js";

export const Index = function () {
  this.clCourse = new StudyCourseBuilder();
  document.body.appendChild(this.clCourse.elThis);

  this.clCourse.onChangeCourseContentHandler({
    course_id: "",
    title: "",
    content_id: "",
    content_type: 11,
  });
};
```

결과는, `study-course-builder` 에 있는 `this.elThis` 에 나타납니다. 모달 등, 원하는 곳에 붙이면 됩니다.

```js
// index.js
// this.clCourse = new StudyCourseBuilder();
//.. your code

Index.prototype.activateModal = async function(data) {
	try{
		await this.clCourse.onChangeCourseContentHandler(data)
		Swal.fire({
html: this.clCourse.elThis,
showCloseButton: true, // 우측 상단 X버튼
showConfirmButton: false, // Confirm 버튼 안보이게하기
allowOutsideClick: false, // 모달 밖을 눌러도 모달 안닫히기
});
}
	}
}
```

## 주의

개발 환경이 다르다 보니, 코드가 일부 다를 수도 있습니다. 유의해주세요.

코드가 다소 복잡하지만, `study-course-builder`에 있는 `onChangeCourseContentHandler` 함수만 신경쓰시면 됩니다.
(원래 pubsub으로 작동해서 handler로 이름이 돼있는데, 그냥 activate 등 다른 이름으로 바꾸셔도 됩니다.)

#### CSS

Modal로 하는 경우, 다음 값들을 변경해야될 수도 있습니다.(확실한 건 아닙니다.)

Testum의 채점 버튼의 위치가 고정돼있습니다.
[`testum-player.js`](./static/js/pages/st/testum/testum-player.js) 의 `_createButton`함수에서, `this.elGradingButton`의 style을 변경하시면 됩니다.

또, Modal로 하는 경우 Tesutm카드의 크기가 큰데, 이것은 [`mtm-player-testum-viwer.js`](./static/js/pages/st/testum/mtm-player-testum-viewer.js)의 `_initInformation`함수에서, `elSwiperInformation`의 style을 변경하면 됩니다.
