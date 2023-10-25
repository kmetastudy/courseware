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

## Think

진도/결과는, 지금 내 database에는 없다.
있더라도 학생(사용자)의 id가 있어야되는데..
아니면, 가장 처음에 context에서, 임의의 student id랑 course id를 받아왔다고 가정하고,
진행해도 괜찮지않을까

사용자의 모델(mStudent 등) 현재 tc app에 있다. courseware에서는 tc가 필요없을거같다.
그러면 음.. app을 새로 만들던지 할까? 이름은 뭐가 좋을까? user? usr? account?

그럼 전체 로직

1. landingpage에서 사용자 로그인?(안해도 됨)
2. 코스를 클릭
3. 코스의 description page가 나옴
4. 체험하기 버튼? 을 누름 -> st시작
5. jwt로 request를 받을때, courseid/userid/demo가 있어야된다.
   5.1 그게 아니라, 만약 체험하기를 누른거라면, 그 값을 준다. 그러면 userid가 없어도 된다?
   만약 로그인 안함 -> 무조건 체험
   로그인함/체험하기 -> userid&courseid
   로그인안함/체험하기 -> courseid (request.demo=True)
   결과는 web storage에 보관한다. 체험판이니 session storage에 보관할거같다.
6. courseid와 userid를 가지고, mapper를 간다. 가서 해당 user의 id가 있는지 확인한다?
   유효한 경우, course의 데이터를 cp로부터 받아온다.
   체험의 경우, 그냥 coursebook에서 데이터를 받아온다.
7. 이게 고민되는데, 현재는 branch 중 일부만 tabultor에 있다. 그러면 챕터는 볼 수 없는데..
   7.1 Tabulator에는 Nested Data Trees라는 설정이 있긴하다.
8. 브랜치를 클릭->testum/lesson 등의 정보를 모두 받아온다.
9. 해당 정보를 가지고 mtm-student-builder에서 내용을 띄워준다.
10. 끝나면 result를 update해야된는데, 이건 어떻게 하는게 좋을까 모르겠다.

URL?
일단 부사장님 로직을 보자.

1. getassignedcourseinfo
   course_ids를 받는다.
   mCourseN이나 mCourseBook(demo)에서, 다음을 받아온다.

   ```python
   # class id 는 필요없다.
   content_list = [{'class_id': str(class_id), 'course_id':coursebook.id, 'title':coursebook.title}]
   result = {
      'student_name': student_name,
      'student_id': student_id,
      'content_list' : content_list,
      }


   ```

2. 하나도 없는 경우, 코스없음 집어넣음
   아니면, 일단, 가장 위에 기본값(모든 코스) 집어넣는다.
   그리고, course_list는 content_list의 복사본
   coursetitle_list는 content_list의 title들
   코스가 하나인 경우에는, 바로 코스의 정보(branch들인가?)를 불러온다.

   그게 아니면, 기다린다.

   /// 내 경우는?

3. `getcoursecontentinfo` -> `_vfn_st_get_coursecontentinfo`
   코스를 누르면-> chapter/branch데이터를 가져와야된다.
   이해가 안되는게, 코스를 누르면, 그거 뒤에것들도 다 불러오는거같은데..
   그리고, demo가 false인 경우, 항상 pass
   그리고, 왜 demoDb에서만 가져오지? (`mDemoClassContentAssignN`)
   demo가 false인 겨우, 그냥 빈 객체 ret_data = {}를 전달.
   아니면, ret_data = {
   'study_list': []
   'clinic_list': []
   }

   아무튼 condition이라는 jsondata에서, 해당 스케줄의 데이터인 `scheduler_list`를 전달
   또, results는, mDemoStduyResultN에서, properties(결과들)을 가져옴.

   또 clinic이라는 개념이 잇는데, 이건 개별학생에 따라서 조정되는 개념?

4. 받아온 데이터를 가지고, tabulator에 데이터 부여.

5. branch를 누르면 builder로 가는데.. 다음과 같다.

units까지 데이터를, `mDemoClassContentAssignN.condition.scheduler_list`에서 받아왔다.

일단, courseid, contentid, contenttype을 가지고, `/st/getcontentinfo/`
->`_vfn_st_get_contentinfo`
content_type == CP_TYPE_LESSON? -> `\_v2st_get_lessoninfo`
content_type == CP_TYPE_TESTUM or CP_TYPE_EXAM? -> `\_v2st_get_testuminfo`

content_list에 모든 정보를 전달.

`_studyLesson` / `_studyTestum`
