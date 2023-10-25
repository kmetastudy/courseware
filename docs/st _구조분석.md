## Table

### mTestumResult

repeat_count

- TextField
- 각 문제 당, 반복 횟수
- "1,1,0,1,2"

question_results

- TextField
- "-"는 해당 사항없음 "O" 맞음, "X" 틀림
- "-"는 현재 기록되지 않음
- "X,-,-,-,-,-"

### mTestumFinalResult

위의 `mTestumResult`의 마지막 Record를 저장
사실상, 이게 진짜 Result
위의 `mTestumResult`는, 그냥 Log처럼 사용
`mTestumProgress`와 `mTestumFinalResult`를 합칠 수도 있다.
현재는, 사용하지 않는것으로 보인다.

### mTestumProgress

progress

- IntegerField(default=0)
- 진행정도
- 0~100?

point

- IntegerField(default=0)
- 점수 정도
- 0~100?

### mLessonResult

total_time

- models.IntegerField(default=0)
- 전체 소요 시간
- 현재는 비어있는듯

total_video_time

- models.IntegerField(default=0)
- 전체 비디오 소요 시간
- 현재는 비어있는듯

part_video_time

- models.TextField(blank=True, null=True)
- 부분 비디오 소요시간 (10:20:40:0:0:0)
- 현재는 비어있는듯

### 그 외

```
mTestumQuestionResults
mTestumProgress
mLessonResult
mLessonFinalResult
mLessonQuestionResults
mLessonProgress
```

## ID

id, student_id, class_id, course_id, testum_id, lesson_id
애초에 학생 정보가 tc의 `mStudent`에 있다.
Mapping정보는 tc의 `mStudentDetail`에 있다.
그럼 tc도 봐야되나..?

## Database 설계

일단, 비정규화와 정규화를 잘 선택하자.
비정규화의 경우, 빠른 데이터 조회가 장점이다.
또한, 데이터 조회 쿼리가 간단하다.

다만, 데이터 갱신이나 삽입 비용이 높다.
데이터의 무결성 해친다.
데이터 중복저장으로 인한 추가 저장공간 확보 필요가 있다.
