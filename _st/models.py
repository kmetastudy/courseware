from .nmodels import *
from django.db import models
import uuid
import django.utils.timezone

# Create your models here.


class mTestumResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 학습자 uuid
    student_id = models.UUIDField(null=True, blank=True)
    # 클래스 uuid
    class_id = models.UUIDField(null=True, blank=True)
    # 코스 uuid
    course_id = models.UUIDField(null=True, blank=True)
    # 테스텀 uuid
    testum_id = models.UUIDField(null=True, blank=True)

    # (추가) 테스트 회수
    # 이 테스트를 몇번 째 했는가 ?
    # 테스텀을 진행할 수록 계속 증가.
    try_count = models.IntegerField(default=0)

    # 이 테스트의 몇번 째 테스트인가 ? (본,쌍,세,네)
    # 본 문제       : 0
    # 쌍둥이 문제   : 1
    # 세쌍둥이 문제 : 2
    try_index = models.IntegerField(default=0)

    # (추가) 오답 하기 횟수
    # 오답 하기 횟수
    wrong_count = models.IntegerField(default=0)
    # 반복 횟수
    # 1,0,0,0,...
    # 2,0,0,0,...
    # 2,1,0,0,...
    repeat_count = models.TextField(blank=True, null=True)
    # (추가) Action Request
    # 0 : no action
    # 1 : action 채점
    # 2 : action 나가기
    action_request = models.IntegerField(default=0)

    # ??? 순수 결과 (O,X,O,O,X) or (-,X,-,O,-)
    # : "-" 는 해당 사항없음 "O" 맞음,"X" 틀림
    # : "-" 는 현재 기록되지 않음
    question_results = models.TextField(blank=True, null=True)

    # ??? 문제 풀이 (O,X,O,O,X) or (-,X,-,O,-) : "-" 는 해당 사항없음 문제는 풀었는가?
    # 답안 제출
    question_answers = models.TextField(blank=True, null=True)
    # (추가) 테스트 시 발생하는 Action Log
    action_logs = models.TextField(null=True, blank=True)
    # (추가) 전체 소요 시간
    total_time = models.IntegerField(default=0)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}-{}".format(self.student_id, self.testum_id)

# mTestumFinalResult (+)
# 위의 mTestumResult 의 마지막 Record 를 저장
# 위의 mTestumResult 는 마치 Log 처럼 사용
# mTestumProgress 와 mTestumFinalResult 를 합칠 수도 있다.


class mTestumFinalResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 학습자 uuid
    student_id = models.UUIDField(null=True, blank=True)
    # 클래스 uuid
    class_id = models.UUIDField(null=True, blank=True)
    # 코스 uuid
    course_id = models.UUIDField(null=True, blank=True)
    # 테스텀 uuid
    testum_id = models.UUIDField(null=True, blank=True)

    # (추가) 테스트 회수
    # 이 테스트를 몇번 째 했는가 ?
    # 테스텀을 진행할 수록 계속 증가.
    try_count = models.IntegerField(default=0)

    # 이 테스트의 몇번 째 테스트인가 ? (본,쌍,세,네)
    # 본 문제       : 0
    # 쌍둥이 문제   : 1
    # 세쌍둥이 문제 : 2
    try_index = models.IntegerField(default=0)

    # (추가) 오답 하기 횟수
    # 오답 하기 횟수
    wrong_count = models.IntegerField(default=0)
    # 반복 횟수
    # 1,0,0,0,...
    # 2,0,0,0,...
    # 2,1,0,0,...
    repeat_count = models.TextField(blank=True, null=True)
    # (추가) Action Request
    # 0 : no action
    # 1 : action 채점
    # 2 : action 나가기
    action_request = models.IntegerField(default=0)

    # ??? 순수 결과 (O,X,O,O,X) or (-,X,-,O,-)
    # : "-" 는 해당 사항없음 "O" 맞음,"X" 틀림
    # : "-" 는 현재 기록되지 않음
    question_results = models.TextField(blank=True, null=True)

    # ??? 문제 풀이 (O,X,O,O,X) or (-,X,-,O,-) : "-" 는 해당 사항없음 문제는 풀었는가?
    # 답안 제출
    question_answers = models.TextField(blank=True, null=True)
    # (추가) 테스트 시 발생하는 Action Log
    action_logs = models.TextField(null=True, blank=True)
    # (추가) 전체 소요 시간
    total_time = models.IntegerField(default=0)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    # def __str__(self):
    #     return "{}-{}".format(self.student_id,self.testum_id)


class mTestumQuestionResults(models.Model):
    # uuid
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # mTestumResult uuid
    testum_result_id = models.UUIDField(null=True, blank=True)
    # 학습자 uuid
    student_id = models.UUIDField(null=True, blank=True)
    # 클래스 uuid
    class_id = models.UUIDField(null=True, blank=True)
    # 코스 uuid
    course_id = models.UUIDField(null=True, blank=True)
    # 테스텀 uuid
    testum_id = models.UUIDField(null=True, blank=True)

    # (추가) 이 테스트를 몇번 째 했는가 ?
    try_count = models.IntegerField(default=0)

    # 문제 코드
    question_id = models.UUIDField(null=True, blank=True)
    # (추가) 문제 번호(number order)
    question_no = models.IntegerField(default=0)

    answer = models.CharField(max_length=300, default='')

    # jstar add
    choice = models.CharField(max_length=10, default='')
    long_answer = models.TextField(default='')
    # 문제 유형 - 객관식, 단답식, 서술
    style = models.CharField(max_length=10)
    # 문제 점수
    point = models.IntegerField(default=1)
    # 채점 결과 맞았나? 틀렸나?
    result = models.BooleanField(default=False)
    # 채점 결과 점수
    result_point = models.IntegerField(default=0)
    # 문제 푼 시간
    result_time = models.IntegerField(default=0)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}-{}-{}".format(self.student_id, self.testum_id, self.question_id)


class mTestumProgress(models.Model):
    # uuid
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 학습자 uuid
    student_id = models.UUIDField(null=True, blank=True)
    # 클래스 uuid
    class_id = models.UUIDField(null=True, blank=True)
    # 코스 uuid
    course_id = models.UUIDField(null=True, blank=True)
    # 테스텀 uuid
    testum_id = models.UUIDField(null=True, blank=True)

    # 진행 정도
    progress = models.IntegerField(default=0)
    # 점수 정도
    point = models.IntegerField(default=0)

    # 시도 횟수
    try_count = models.IntegerField(default=0)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}-{}-{}".format(self.student_id, self.testum_id)


class mLessonResult(models.Model):
    # uuid
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 학습자 코드
    student_id = models.CharField(max_length=100)
    # 클래스 uuid
    class_id = models.UUIDField(null=True, blank=True)
    # 코스 uuid
    course_id = models.UUIDField(null=True, blank=True)
    # 레슨 uuid
    lesson_id = models.UUIDField(null=True, blank=True)

    # (추가) 레슨 회수
    # 이 레슨 몇번 째 했는가 ?
    try_count = models.IntegerField(default=0)
    # 이 레슨의 몇번 째 Unit 인가?
    try_index = models.IntegerField(default=0)
    # (추가) 오답 하기를 끝냈는가? 끝낸 횟수
    wrong_count = models.IntegerField(default=0)

    # (추가) Action Request
    # 0 : no action
    # 1 : action 채점
    # 2 : action 나가기
    action_request = models.IntegerField(default=0)

    # 반복 횟수
    # 1,0,0,0,...
    # 2,0,0,0,...
    # 2,1,0,0,...
    repeat_count = models.TextField(blank=True, null=True)
    # ??? 순수 결과 (O,X,O,O,X) or (-,X,-,O,-)
    # : "-" 는 해당 사항없음 "O" 맞음,"X" 틀림
    question_results = models.TextField(blank=True, null=True)
    # ??? 문제 풀이 (O,X,O,O,X) or (-,X,-,O,-) : "-" 는 해당 사항없음 문제는 풀었는가?
    question_answers = models.TextField(blank=True, null=True)
    # (추가) 테스트 시 발생하는 Action Log
    action_logs = models.TextField(null=True, blank=True)
    # (추가) 전체 소요 시간
    total_time = models.IntegerField(default=0)
    # (추가) 전체 비디오 소요 시간
    total_video_time = models.IntegerField(default=0)
    # (추가) 부분 비디오 소요 시간 (10:20:40:0:0:0)
    part_video_time = models.TextField(blank=True, null=True)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}-{}".format(self.student_id, self.lesson_id)

# 위의 mLessonResult 의 마지막 Record 를 저장
# 위의 mLessonResult 는 마치 Log 처럼 사용
# mLessonProgress 와 mLessonFinalResult 를 합칠 수도 있다.


class mLessonFinalResult(models.Model):
    # uuid
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 학습자 코드
    student_id = models.CharField(max_length=100)
    # 클래스 uuid
    class_id = models.UUIDField(null=True, blank=True)
    # 코스 uuid
    course_id = models.UUIDField(null=True, blank=True)
    # 레슨 uuid
    lesson_id = models.UUIDField(null=True, blank=True)

    # (추가) 레슨 회수
    # 이 레슨 몇번 째 했는가 ?
    try_count = models.IntegerField(default=0)
    # 이 레슨의 몇번 째 Unit 인가?
    try_index = models.IntegerField(default=0)
    # (추가) 오답 하기를 끝냈는가? 끝낸 횟수
    wrong_count = models.IntegerField(default=0)

    # (추가) Action Request
    # 0 : no action
    # 1 : action 채점
    # 2 : action 나가기
    action_request = models.IntegerField(default=0)

    # 반복 횟수
    # 1,0,0,0,...
    # 2,0,0,0,...
    # 2,1,0,0,...
    repeat_count = models.TextField(blank=True, null=True)
    # ??? 순수 결과 (O,X,O,O,X) or (-,X,-,O,-)
    # : "-" 는 해당 사항없음 "O" 맞음,"X" 틀림
    question_results = models.TextField(blank=True, null=True)
    # ??? 문제 풀이 (O,X,O,O,X) or (-,X,-,O,-) : "-" 는 해당 사항없음 문제는 풀었는가?
    question_answers = models.TextField(blank=True, null=True)
    # (추가) 테스트 시 발생하는 Action Log
    action_logs = models.TextField(null=True, blank=True)
    # (추가) 전체 소요 시간
    total_time = models.IntegerField(default=0)
    # (추가) 전체 비디오 소요 시간
    total_video_time = models.IntegerField(default=0)
    # (추가) 부분 비디오 소요 시간 (10:20:40:0:0:0)
    part_video_time = models.TextField(blank=True, null=True)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    # def __str__(self):
    #     return "{}-{}".format(self.student_id,self.lesson_id)


class mLessonQuestionResults(models.Model):
    # uuid
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # mLessonResult uuid
    lesson_result_id = models.UUIDField(null=True, blank=True)
    # 학습자 코드
    student_id = models.UUIDField(null=True, blank=True)
    # 클래스 uuid
    class_id = models.UUIDField(null=True, blank=True)
    # 코스 uuid
    course_id = models.UUIDField(null=True, blank=True)
    # 레슨 uuid
    lesson_id = models.UUIDField(null=True, blank=True)

    # (추가) 이 테스트를 몇번 째 했는가 ?
    try_count = models.IntegerField(default=0)

    # 문제 코드
    question_id = models.UUIDField(null=True, blank=True)
    # (추가) 문제 번호(number order)
    question_no = models.IntegerField(default=0)

    answer = models.CharField(max_length=300, default='')
    # jstar add
    choice = models.CharField(max_length=10, default='')
    long_answer = models.TextField(default='')
    # 문제 유형 - 객관식, 단답식, 서술
    style = models.CharField(max_length=10)
    # 문제 점수
    point = models.IntegerField(default=1)
    # 채점 결과 맞았나? 틀렸나?
    result = models.BooleanField(default=False)
    # 채점 결과 점수
    result_point = models.IntegerField(default=0)
    # 문제 푼 시간
    result_time = models.IntegerField(default=0)

    created = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}-{}-{}".format(self.student_id, self.lesson_id, self.question_id)


class mLessonProgress(models.Model):
    # uuid
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 학습자 uuid
    student_id = models.UUIDField(null=True, blank=True)
    # 클래스 uuid
    class_id = models.UUIDField(null=True, blank=True)
    # 코스 uuid
    course_id = models.UUIDField(null=True, blank=True)
    # 레슨 uuid
    lesson_id = models.UUIDField(null=True, blank=True)

    # 진행 정도
    progress = models.IntegerField(default=0)
    # 점수 정도
    point = models.IntegerField(default=0)

    # 시도 횟수
    try_count = models.IntegerField(default=0)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "{}-{}-{}".format(self.student_id, self.lesson_id)
