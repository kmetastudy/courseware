## 2023/11/10

progress, result

progress, result도 Units 개념을 사용한다.
따라서, 이것을 해결해야됨

updatestudyresultinfo

LessonPlayer
Result가 Fix돼있다 (영상, 예제1, 예제2, 예제3)

TestumPlayer
ResultTable에서 문제를 클릭해도 해당으로 넘어가지 않는다.(항상 1번으로 간다)
제출해도 시간이 계속 흐른다..

## 2023/11/13

### UI

tree
tabs
checkbox
(contextMenu)
(dropdown)

### 체험하기(미리보기)

1. 로그인 & 체험하기
   데모 table에 결과 등을 저장.
2. 비로그인(게스트) & 체험하기
   2.1 익명의 사용자 생성  
   GuestUser Table을 따로 만듬 -> 데이터 생성
   사용자의 id를 가지고, jwt token생성
   2.2 sessionkey를 사용자의 id처럼 사용  
   JWT 생성X, GuestUser Table 생성X

이게 좀 까다롭다.

## 2023/12/18

### Dashboard

#### 1. 전체 대쉬보드

> 최근 학습 강의
> - 최근에 학습한 강의를 3개 정도 나타낸다.

> 주간학습
> - 주단위로 학습 목록 보여주기?

> 연간학습
> - 연단위로 학습 목록 보여주기?
> - 필요할지는 의문

#### 2. 코스별 대쉬보드
---------
학습 통계
- 수업 진도율
- 테스트 정답률
---------
총 학습 시간?
---------
오답노트?
---------
단원별 성취도
- 표로 나타내기
- 그래프로 나타내기(성취도 + 정답률)
---------
약한 부분
추천?
틀린 문제 모아보기?

---------
주간 진행율?
예를 들어, 월~금이라고 두면
월요일에 완료한 강의 개수, 등등?
막대 그래프
---------
약점 보완하기
정답률이 제일 낮은 유형들을 몇 개 보여주는건 어떨까?
그리고, 이것들을 클릭하면, 해당을 복습하러 갈 수 있게?
혹은, 해당에 대한 다른 수업이나 문제를 추천해주는건?

혹은, 반복을 많이 한 문제들을 보여주는건 의미가 있을까?


study result properties에 date 항목 추가해야됨


### TODO?
학생들의 스케줄 관리를 위한 캘린더
달력에다가, 원하는 코스를 부여할 수 있다
또, 그냥 일반 일정표처럼 사용할 수도 있게하면 좋지 않을까
근데, 우선순위는 좀 떨어진다.
---------
틀린 문제 한번에 다시 풀어보기?(아니면 아예 그 유형을 다시 수강하기)
틀린 문제들을 한번에 풀어볼 수 있게 하는건 어떨까?
예를 들어 시험 직전에는, 새로운 문제보다 틀린 문제들을 한번에 쭉 훝어보고 싶어할 수도 있다.
그러면, 각 항목들에 대해 틀린 이유들을 기록해두면, 나중에 편할거같다.
예를 들어, 특정 유형 부분에서 계산 실수가 많으니, 조심할 수 있겠다?

또, 기출문제 등, 해당 유형들을 좀 더 풀어보고싶어하지 않을까?
---------
학생 회원가입->추가로 필요한 정보들
학년 나이 학교 지역? 사용자 유형?(선생님/학생)
---------
ST에서, 틀린 이유 기록해두기?
오답을 할때 틀린 이유를 기록해두면, 편하지 않을까?
예를 들어, 계산 실수같은 경우 나중에 다시 다시 푸는 중요도가 떨어진다.
---------
코스에 대한 통계 데이터
지금은 result데이터가 있고, 이것은 각 학생 별로 해당한다.
근데, 나중에는 코스를 이용하는 전체 사용자들에 대한 통계가 있어야될 것 같다.
학생별 데이터를 모두 취합해서, 이것을 다 불러올 수는 없다.
mStudyResult를 업데이트 할 때, 해당 코스에 대한 통계데이터도 업데이트하는건 어떨까?
예를 들어, 학생들 사이에서 정답률이 낮은 문제
그게 아니고, 단순히 통계들을 보여줄 수도 있다.(학생들의 평균 점수가 70인데, 사용자가 80이다 등?)

---------
차트 디자인하기

---------
이메일 인증

# 2023/12/19
## FIXME:
비공개영상으로 바뀐 영상들이 있다.
이런것들은 어떻게 처리해야될까?

> 예시:  23_L1_중1-2 > 1. 기본도형 > 1. 기본도형(N2~N4) 첫번쨰 영상

제목: [EBS 수학의 답] 기본 도형 - 1. 직선, 반직선, 선분

url: https://www.youtube.com/watch?v=_jsM2HBMfsA

uuid: a9c220f4-418c-4252-ac7a-57de8bafb0ca

해당 동영상이 들어가있는 모든 코스, result, demo result를 수정해야되나?

> 체험판에 있는 코스들은, 비교적 구데이터기에 외부에서 끌어온 영상들이 있다.
> 현재 학생들에게 실제로 서비스하는 데이터는, 자체제작 영상으로 바꾸었다.
> 

## FIXME:

오답하기를 할 떄, 오답 문제를 누르면, 다른 문제가 나오는 경우가 있다.
> 예시:  23_L1_중1-2 > 2. 위치관계 TEST1 (N1~N4)> 
문제 5번 고치려하는데, 3번이 나옴

> 버그가 아니라, 원래 그런건가..? 오답의 값이 X, ?, ?인 값들이 나온다.**
> Lesson은 클릭한 문제가 나오고, 테스트는 그게 아닌걸 보니, 의도하신것 같다.



