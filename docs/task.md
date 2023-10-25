2023-03-28

1. folder

   <!-- * theme을 root variable 로 처리(크로스브라우징 체크) -->

   <!-- * hover 시 색깔 변경 -->

   <!-- * select 시 색깔 변경 -->

   <!-- * jconfirm 다른걸 쓰고 있음, 변경 --> //done, context menu로 삭제시, 삭제가 완료돼도 context메뉴가 안사라짐.

- create될때, 제목이 적용이 안되는 버그가 있음. 이를 수정
- header도 따로 module로 만들기
- 전체적인 네이밍 및 refactoring
- drag&drop 공부하기

<!-- 2. Question Editor
* ckeditor를 클래식버전으로, build해보기 https://ckeditor.com/ckeditor-5/online-builder/
* 로칼에다 빌드(컴파일?)한 후, npm build를 해서 사용해보기(일단은 Latex와 같은 플러그인은 적용X) -->

3. Layout

- 전체적인 Layout은 만들면서 천천히 잡아보기

2023-03-29

<!-- 1. Ck Editor
* ~~build는 완료된 것으로 보인다.~~
* ~~다만 import가 안된다~~

2. folder
* ~~selectedIds가 작동이 이상하게 된다. 전체적으로 다시 한번 봐보자.~~
* ~~위 작업이 완료되면, select 시 색깔을 변경해보자.~~
* font-awsome 아이콘 집어넣기 -->

2023-03-30

<!-- 1. Ck Editor
* CK Editor에 CRUD를 추가해보자
* module은 따로 빼서 모아두고, 거기 환경에서 테스트 등을 한다.
* 우리 로컬에서는 그 테스트 등을 한 뒤의 최종 버전만을 사용한다. -->

<!-- 2. Plyr
* Plyr도 마찬가지로 빌드를 해보자. -->

3. Folder

   <!-- * Folder에 선택 시 색깔이 바뀌는거 -->

   <!-- * 아이콘(fontawsome 등의 svg)을 item에 넣어보자. -->

- 내가 사용한 document.documentElement.setProperty 의 전체적인 흐름, 맥락 등을 공부해보자

4. Etc

- 어떤 것을 공부할 때, 전체적인 흐름/맥락을 같이 공부를 하는게 좋다
- npm을 빌드하는것도 한번 공부해보자. 어렵다.
- minify도 시간이 나면 찾아보자. (uglyfy도)
- Webpack을 시간날 때 다시 한번 공부해보자.

2023-04-04

1. KL
   kl 도 마찬가지로 book 개념이 있다.
   KL root, KL leafs 가 있다.
   db를 어떻게 관리하는게 좋을까? 고민해보자
   기출문제 사이트를 만들것이다.(mathmedic.kr 과 비슷한)
   기출문제를 풀고, 틀린 문제와 유사한 문제를 추천해주면 사이트이 유입이 늘지않을까? 선호도가 늘지 않을까?
   기출문제를 풀어보고, 틀린 문제를 추천해주기 위해서는 kl의 ui가 필요하다.
   따라서 kl에 대해 고민을 해보자.

<!-- 2. build
* local에 저장을 해둔다-> build
* build된 최종 파일을 로컬 프로젝트에 담아둔다(ex. dist폴더)
* 해당 루트를 cdn으로 html파일에 담아둔다. {static}
* 해당 방법으로 기존의 라이브러리(sortablejs, jconfirm, plyr, ckeditor...)를 사용해보자. -->

<!-- 3. animation
* 애니메이션은 css로 혹은 javascript로 핸들이 가능하다
* 필요한(사용자가 편할) 애니메이션이 있나 생각을 해보고, 없다면 hide버튼이라도 적용을 해보자. -->

4. ChatBot (문제 풀어주기)

- katex-> latex-> chatgpt
- 문제를 한글파일로 집어넣으면 그것의 해답을 알려주는 일종의 chatbot을 만들어보자.

2023-04-06

1. Build

   - 패키지 모두 local에서 빌드 완료

2. Folder

   - hide 애니메이션 추가 완료

   - 선택 시 색깔 변경 완료

   - 아이콘 대입 완료(fontello)

3. Question Editor

   - 전체적인 틀 잡기

   - CRUD

4. Video Editor

   - 전체적인 틀 잡기

   - CRUD
     engine x,

2023-04-07

1. 전체적인 레이아웃 잡아놓기
2. crud 기능을 비롯한 기능들 추가하기
3. setdata, getdata 활용해보기(ckeditor5)

2023-04-11

video awesome cp studio question awesome
sweet alert 2

1. question awesome, video awesome, course studio(cp studio)
   핵심: sidebar에는 kl(카테고리)
   카테고리 별로 문제를 한눈에 많이 볼 수 있어야 된다.
   이를 위해서 이미지를 sample로 가져다가 테스트해본다(잘 보이는지)
   awesome창에서 문제/비디오를 ctrl+c 하고, course studio(다른 브라우저 창)에서 ctrl+v를 하면 붙여넣어질 수 있게 만든다->코스를 만들 때 편하다
   또 문제에 정보들(평점, 난이도, 정답률 등)도 표시가 되어야 한다.

2. sweet alert 1/2 사용해보기

3. question-editor
   문제 탭에 kl 있을 필요 없음
   버튼이랑 selectscroll을 아래로 빼기(일단 디자인은 신경X)
   전체적인 레이아웃 잡기

### 2023-04-12

1. Question-Editor
   모듈 세분화
   기존 question-editor-container이 너무 많은 기능(불필요한)을 가지고 있다 생각하여, 나누어 세분화했음
   UI 위치 조정
   UI들의 위치 수정완료
   Answer, Tag 제작 예정
   문제 해설, 문제 해설영상, 본문 제작 예정

2. Video-Editor
   video-editor 제작 예정

### 2023-04-13

1. question-editor
   select scroll 수정
   answer 추가

2. video-editor
   url 기능 추가 예정
   time area css 변경 예정
   start, end 기능 추가 예정

### 2023-04-14

1. overlay scrollbars
   demo 사용해보기

2. 전체적인 layout 잡아보기
   course create contents 사이트 기반으로 제작해보기

3. inputselectsscroll css 봐보기

### 2023-04-17

1. overlay scrollbars
   사용이 제대로 안된다. 수정 예정

2. cp-course 페이지 제작중

3. contents-card-box/contents-card 제작 완료

### 2023-04-18

1. toggle Button
   width, height 적용이 어려움.
   다른 toggle reference 찾아보기

2. 전체적인 layout
   toggle에 따른 display 변경

3. sidebar
   sidebar 추가해야됨

### 2023-04-20

1. contents-box
   sortable로 드래그 and drop 적용됨
   다만 드래그 후 오른쪽에 두면 화면이 쭉 오른쪽으로 가면 좋겠다.

2. Folder item clicked(last folder index)
   1. Add Cards
3. Card click
   1. Give data to question/video editor
   2. 해당 카드가 들어있는 문제/비디오 경로를 클릭해줘야되나…? 모르겠네
4. 저장하기 버튼
   1.

### 2023-04-21

1. inputSelectScroll 선택 시 색깔 변경
   -> 일단은 해두긴 했는데, 좀 이상함. 다시 할것
2. sortableFolder -> sortable의 autoScroll, ghostClass 사용해야됨
<!-- 3. toggle Button 은 확장성이 없기 때문에, 정말 명확한(ex. on/off) 경우에만 사용한다. input type checkbox를 사용하는게 특이점. -->

### 2023-04-25

Done

1. 전체 UI 변경 완료

ToDo

<!-- 1. 컨텐츠 Mapping -> Drag&Drop 공부하기 -->

2. 폴더구조의 장점 찾아보기
3. 상세 design 조금씩 수정
4. Handler 추가
5. 세로 구조도 조금씩 생각해보기
6. Component들 Detail 수정하기

### 2023-04-27

1. 카드를 클릭할 시 editor에 세팅하는 것을 시도하고 있다.
   코드가 복잡해(특히 question editor과 question answer) 수정하는 것이 필요해보인다.

2. pubsub을 활용해보고 있다.

### 2023-04-28

1. KL을 editArea tab에 추가하고, UI 완성하기(KlEditor?)
2. simplebar build & use
3. 왼쪽 컨텐츠 선택 -> 오른쪽 컨텐츠선택 disabled
4. UI 손보기

## 2023-05-08

1. add button에, question / video confirm 추가하기 (아니면 그냥 문제추가하기, 비디오 추가하기 버튼이 나을거같음)
2. sortable container 변형해서 만들어보기
3. display > contents > question 박스 모양 추가하기(grid?flex?)
4.

## 2023-05-09

<!-- 1. setCardData를 두번 해야 카드에 적용이 된다. 버그 fix -->

2. 전체적인 그림을 생각해보자.
3. 구조화 및 네이밍을 고려하자
4. arkit같이 architecture analysis tool 고려해보자
5. 코딩하는데 급급해하지 말고, 전체적으로 생각을 해보고 코드를 짜자.

bonobo(보노보) id pw
admin
Muhan5337%

muroa1224
muroa1224

## 2023-05-10

1. section-display-area > 코스 > 유닛 추가는 어떻게 해야될까?

## 2023-05-12

1. 기존 sortable-container를 살리고, 대신 데이터를 converting하는 방법으로 접근해보자
2. handler의 경우 해야할 일을 작성해주자. (O: onShowHandler) (X: onShowBtnClickHandler)
3. fontawseome의 경우, 새로운걸 추가하면 빌드해서 바로 쓸 수 있게(webpack처럼) 만들자.(fontawesome optimize)
4. Naming Convnetion 추가

## 2023-05-16

1. folder 구조가 너무 flat하다. 또한 section display에서 너무 많은 것을 한다.
   각 영역들을 조각별로 나누고, 가기에서 url 등을 처리하자(예. section-course-folder)
2. UI-Components들을 만들어두자. 이게 내 재산이 될 것이다.
3.

## 2023-05-17

1 level, 데이터 줘 2. (데이터, isEnd); 3. 클릭이벤트 전달 -> level==2가 클릭 -> 유닛 생성

Create
create됐다고 알림 -> folder전달 -> api호출

Delete
delete됐다고 알림 -> folder전달 -> api호출

Update
update됐다고 알림 -> folder전달 -> api호출

Read?

## 2023-05-24

<!-- 1. selected 버그 수정(0번째가 선택이 안됨) -->
<!-- 2. create하는 경우 -> parent 의 branch ids 도 업데이트 되어야 함 -->

3. delete하는 경우 -> parent 의 branch ids 도 업데이트 되어야 함
   book delete -> chapter, branch, lesson/testum/unit 모두 삭제 되어야함..
   삭제는 하지 말고, invalid를 True로 바꾸자.
   만약 삭제가 필요하면 나중에 invalid=True 인 데이터를 지우면 된다.
   <!-- 4. branch를 클릭하면, 해당(lesson/unit)의 unit ids를 이용해 unit을 보여줘야됨. -->
   <!-- 5. 레슨/테스트를 만들고, 선택하고 새 유닛 만들기를 하면 바로 유닛이 나와야 됨     -->

## 2023-05-25

1. 문제 및 비디오를 제작해서 코스(유닛)과 database에 넣기
2. 유닛 에디터(사이즈가 큰) 만들기?
3. excel import / export 기능 구현하기
   chapter, course, branch까지만 import / export는 전부 다 (atom까지)
   전부 다 export할 수도 있어야됨(sheet로 관리하는게 편해보임)
4. branch create의 hanlder를 지워야됨(jconfirm으로만 되게)
5. 유닛의 카드 클릭 -> 다른 카드들 선택 해제

// 코스 유닛에 데이터 넣기

1. section unit에서 unit select(this.state.clSelectedUnit)
2. 카드를 선택(add card/ 직접 선택) (this.state.clSelectedCard?)
3. 해당 카드의 isEmpty를 통해 editType를 questionEditor / VideoEditor에 전달해준다
4. 문제입력 -> 저장하기 버튼 클릭
   -> editType이 create -> 선택한 데이터가 atom에 저장(create)->return atom's data
   -> editType이 modify -> 선택한 데이터가 atom에 업데이트 -> return atom's data
5. 만약 현재 display에서 코스의 유닛이 선택되있다? -> unit에 문제 넣기
   만약 display에서 컨텐츠의 문제가 선택됐다? -> questionbookbranch에 문제 넣기
6. return 된 atomData->questioncontainer->cpedit->app->sectiondisplay->sectionfolder->sectionunit
7. 카드의 index를 고려해 선택된 unit의 content_ids에 id 집어넣음 (순서 중요)
8. 해당 atom의 content를 card에 집어넣음

// question editor의 save button 클릭

1. 코스인가 컨텐츠인가? -> tab의 상태를 보면 알 수 있따.
   새로 만드는건가? 아니면 저장하는건가? -> 선택된 카드의 상태를 보면 알 수 있다?
1. 카드가 선택됨 -> 카드의 정보가 이미 있는가?

// 코스 유닛에 카드 set -> 코드 완료했지만 검증 안해봄

1. setTestumUnit / setLessonUnit -> testumUnitData / lessonUnitData
2. data의 content_ids을 for문을 돌리고, 해당 atom_id에 맞는 atom의 data를 question/video에서 가져온다.(무조건 둘 다 찾아봐야되네?, atom 순서 지키려면 setTimeout 해야될듯)
3. ajax success -> atom data를 사용해 card를 만든다. (is empty=false로 설정)

// question editor / video editor의 modify 구현하기
// atom delete 구현하기

## 2023.05.30

CP 개발 계획 및 예상 소요 날짜
05.30(화) - 06.02(금)

1. course Folder, unit-box, unit-box-card 에서 요소들의 shift 기능 적용

- 각 요소들의 위치를 shift할 때, 바뀐 index 정보가 database에 저장되도록 코드 작성
- unit_ids, content_ids에 담긴 순서를 기반으로 수정
- 약 하루(수) 소요 예상

2. 유닛 에디터 추가 고려 및 레이아웃 수정

- 현재 문제 및 비디오를 보여주는 카드의 사이즈가 너무 작아 가독성이 안 좋은 문제가 있음
- 실제 사이즈를 나타내는 유닛 에디터 추가 혹은 기존 카드 사이즈 확대 예정
- 화면의 오른쪽 영역인 section-edit의 크기를 줄이고, 왼쪽 영역인 section-display의 크기를 키울 예정
- 약 1.5일 소요 예상(목~금)

  06.02(금) - 06.07(수) (06.06(화)는 공휴일이라 수요일로 기간을 잡았습니다)

1. Course excel import/export

- 코스의 정보가 담긴 엑셀 파일을 import 하여 데이터베이스에 저장하는 기능 추가
- 기존 코스의 정보가 담긴 엑셀 파일로 export 하는 기능 추가
- 약 2일 소요 예상(금~수)

## 개발 일정

<!-- course-sortable-folder, unit -> shift item 적용하기 -->

sortablefolder에 jconfirm 적용이 안됨 -> 수정하기
section-cp-question-edit->해설달기, 해설영상, 본문 제작하기
비디오 에디터(time) 수정하기

<!-- 카드클릭->탭 안바뀌는 버그 수정하기 -->

이름 바꾸기
컨텐츠 folder & box 구현하기
컨텐츠 -> 문제 제작 및 비디오 제작 구현하기
컨텐츠 -> 코스에 문제/비디오 넣기 구현하기
KL ->

## 2023.06.02

KL, 해설을 우선적으로 제작하자
위의 일정표는 엑셀로 만들어주자.

Exam

## 2023.06.07

엑셀/다른 tool 사용해서 제작
usb 허브 사기
isbn(고유번호)에 대해 알아보자
KL의 UI작업하기

## 2023.06.12

mQuestionBook-> type===1 : KL
branch에는 따로 구별을 하지 않는다.
KL UI에서, box가 필요할것 같지는 않다.(있어도 후순위)중요한 것은 카드에서 KL을 보여주는 것이다.
CARD에서 해당 KL에 매핑이 되어있는지를 볼 수 있어야하고, 매핑을 할 수있어야된다(왼쪽에서)
delete도 마찬가지로 왼쪽 카드에서 할 수 있어야함.
한번에 선택해서 매핑하는 기능도 있으면 좋을 것 같다.

어디까지 mapping을 했는지 보여주는 것도 필요하다.

유닛 에디터를 따로 만들지 말고, 일단은 UI를 유지하자.
다만 카드의 UI를 다시 한 번 생각을 해볼 필요가 있다.

엑셀(노션)등으로 일정 정리하기

**CRUD는 매우 중요함. 어떤 일을 할 때, CRUD는 어느정도 마무리를 하고 넘어가는 것이 좋다.**

## 2023.06.13

<!-- **jconfirm이 인식이 안된다.** -->
<!-- html에 same id를 가진 element가 있는 경우 -->
<!-- https://stackoverflow.com/questions/8498579/how-does-jquery-work-when-there-are-multiple-elements-with-the-same-id-value -->

카드 DELETE 기능을 추가, UI도 새로
video -> time ui 수정 및, 저장이 제대로 안되는 부분 수정
문제입력-> 문제 유형을 선택 안하고 객관식을 클릭, 저장시 save가 안됨
스크롤이 기본으로 가장 오른쪽으로 간다.
문제입력 -> 저장하기 버튼을 언제 able해야할까?

맥에서 윈도우 서버 접속
컴퓨터 이름 : Administrator

사용자이름: megaclass.co.kr
비밀번호: Muhan5337%

mod_wsgi, apache
리눅스가 아닌 윈도우에서, 장고로 서비스(서버)하는 방법 찾아보기.

## 2023.07.05

cp가 메인이 되어야한다.
내년 하반기 쯤 부터는, 내 껄 사용하는걸 목표로 하자.
그러려면 준비해야 되는 것들이 뭐가 있을까?
일단, 먼저 사람들에게 테스트를 해보라고 해야함

megaclass.co.kr 포트
5500 부사장님
80 윤영씨
8080 나

내가 cp를 진심으로 좋아하고, 재밌어해야한다.
엑셀같은것도, 내가 만약 많이 써봤으면 우선순위가 높다는 걸 알았을 것이다.

## 2023.07.17

수학/영어/정보 세 과목을 AI 코스웨어로 서비스해야된다.
일단 CP쪽에서 필요로 하는 기능이 더 있나 생각해보자.
각 기능에 대해 중요도 및 구현시간을 생각해서 어떤 것을 추가/변경할지 생각해보자.
예를 들면 영어의 지문, 듣기, 등등

주로 중2나 고1

jwt를 공부하고, CP쪽에 어떤 id가 들어와야할까?

7월 말까지는, 작업 마무리하고, 8월부터 test/bug fix등등+새로운기능 추가

lms좀 찾아보자.

## 2023.08.18

1. Lesson 고정하기
   먼저, LessonUnit의 경우, 무조건 첫번째에 영상이 나오게 한다.
   그리고, 영상은 순서를 바꿀 수 없다.

Lesson/Testum Unit에 따라, 어떤 아이를 넣어야되는지 정해져있다.
먼저 Testum의 경우, 무조건 문제만 넣을 수 있다.
Lesson의 경우, index==0인 경우 무조건 비디오만, index>1인 경우 무조건 문제만 넣을 수 있다.

음 그러면, 이렇게 하자.
1.1 card에서, atomType, boxType이 있다.

그러면, index를 기반으로, tab을 disable.

## 2023.08.23

TODO
unit에다가 혹은 question folder에다가 생성된 atom data 전달해주자
만약 course unit이나 questionbox가 있는 경우 전달해서 카드를 새로 만든다.
그리고, editor에게는 setData해주자.(id만 하면 되긴 하다.)
그리고, setSelectedCard같은건 필요 없다. 그리고, atomType은 어떻게 해야되나?
Editor에 주지 말고, app-cp나 sectoin-cp-edit까지만 주자.
그리고, editType도 필요 없다.
Box에서 add button 없애자.
savebutton의 경우, 활성화됐는지 확인하자.
shouldUpdateQuestion이라는 함수? 아니면 isButtonActivated?(css랑 맞추자.)
그리고, save버튼을 누르면 업데이트하고 onQuestionUpdated
또, 새로만들기 버튼을 누르면, savebutton 이 활성화된지 확인하고, 그런 경우 confirm?

만약 부모에게 줘야되는게 있으면 뭘까?

1. isCourse/content? <- select 코스/콘텐츠 tab
2. onQuestionCreated(questiondata) <- create question in question editor
3. onVideoCreated(videodata) <- create video in video editor.
4. onCardClickCallbacks -> activate 문제제작/비디오제작 -> set Data.

에디터 있잖아. 새로 만들기랑, 저장하기를 disable해두자.
폴더 아이템 클릭 -> 만약 depth가 2? -> 유닛등장
유닛등장 -> 박스 선택 안돼있어.
만약 박스를 클릭 -> testum의 경우, videoEditor을 막는다..?
만약 박스를 클릭 -> Lesson인 경우, 생성해야되는게 뭘까?

1. video -> 비디오로 탭 전환, able 새로만들기.
   새로 만들기 클릭 -> video생성 -> addCard

레슨이고, 카드가 아무것도 없어. or, 비디오 클릭 -> videoEditor
나머지? -> question Editor

오른쪽에 에디터 영역

새로만들기 -> 부모에게 데이터줌 -> 만약

## 2023/08/28

<!-- 1. lesson/testum의 아이디가, branch와 같지 않음. -->
<!-- 2. unit의 content_ids가 업데이트 안됨. -->
<!-- 3. 애초에 content가 안만들어짐, 확인. -->

## 2023/08/29

selected 다루기
윤형씨의 평가시스템에 문제를 어떻게 줄지 고민하기
또, 문제를 주려면 거기에 대한 UI가 필요한데, 이걸 어떻게 해야될지
jwt 등 인증 문제는?
