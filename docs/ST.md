## JWT Token

개발시에는 다음을 사용
jwtlogin_st_decorator0
make_context0

배포시에는 다음을 사용
jwtlogin_st_decorator
make_context

## windows.location.href

ST 의 몇 코드에 다음 사항이 있다.

```js
///
error: function() {
  windows.location.href = "/";
}

해당 코드는, 특정 주소로 이동시키는 코드이다.
jwt 등에서 에러가 나오면, 기본 주소(localhost:8000)으로 이동시킨다.
현재는 jwt를 사용하지 않으니, 일단은 해당 코드 `windows.location.href = "/"`는 모두 주석처리하자.
배포 시, 혹은 jwt를 사용하게 된다면, 해당 주석을 제거한다.
```

## mtm-study-container

Init
`_urlGetAssignedCourseInfo`: assign된 코스 정보 불러오기
`_aurlGetAssignedCourseInfo`: 코스 스크롤 설정, set `this.course_list`
->만약 코스가 하나면 `_urlGetCourseContentInfo`

스크롤에서 코스 클릭
`onCourseSelectHandler` : edata : {student_id, course_type, course_list}
`_urlGetCourseContentInfo`
`_aurlGetCourseContentInfo`: this.study_list/this.clinic_list 설정
-> `clListTableCourseContentNormal.setStudyResultListInfo`

## mtm-list-table-course-content

setStudyResultListInfo: `this.tabuldator.setData`
data형식: [{index, content_id, title, type, date, point, percent}]

테이블(기본)에서 testum/unit클릭
`onClickCourseContentHandler`: 코스 아이템 클릭 -> edata 설정 -> emit "OnChangeCourseContent"
이 때 mtm-study-builder로 이동

## mtm-study-builder

`onChangeCourseContentHandler`
