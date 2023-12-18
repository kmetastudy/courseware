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

> 학습 통계
> - 수업 진도율
> - 영상 문제 정답률
> - 테스트 정답률
> - progress bar?

> 전체 정답률

> 총 학습 시간?

> 오답노트?

> 단원별 성취도
> - 표로 나타내기
> - 그래프로 나타내기(성취도 + 정답률)

> 취약한 부분
> 추천?
> 틀린 문제 모아보기?
