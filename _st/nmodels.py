from django.db import models
import uuid
import django.utils.timezone


class mStudyLogN(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    type = models.IntegerField(default=0)
    subtype = models.IntegerField(default=0)
    title = models.CharField(max_length=300, null=True, blank=True)

    order = models.IntegerField(default=0)
    index = models.IntegerField(default=0)

    # 속성 - 각종 o,x, try_count...,
    properties = models.TextField(null=True, blank=True)

    id_student = models.UUIDField(null=True, blank=True)
    # 클래스 uuid
    id_class = models.UUIDField(null=True, blank=True)
    # 코스 uuid
    id_course = models.UUIDField(null=True, blank=True)
    # 컨텐츠 uuid
    id_content = models.UUIDField(null=True, blank=True)

    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)
    version = models.IntegerField(default=0)

    class Meta:
        db_table = '__mStudyLogN'
    pass


class mDemoStudyResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    type = models.IntegerField(default=0)
    subtype = models.IntegerField(default=0)
    title = models.CharField(max_length=300, null=True, blank=True)

    order = models.IntegerField(default=0)
    index = models.IntegerField(default=0)

    progress = models.IntegerField(default=0)
    point = models.IntegerField(default=0)

    # 속성 - 각종 o,x, try_count...,
    # 속성
    # ----------------------------------------------------------------
    # try_count = squence number
    # try_index = unit_index (0,1,2)
    # repeat_count = (1,1,2,0) : 0 은 한번 안함, 1 = 한번함, 2 두번함
    # result = (O,X,-,?) : O 맞음, X 틀림, - 아직 안봄, ? 정답 미기입
    # ----------------------------------------------------------------
    # exam = answer | start_time
    # answer = {"answer":["1","2",]} - 기입한 정답
    # start_time = 시작 시간.
    # ----------------------------------------------------------------
    # {
    #       property :
    #       [
    #           {
    #               content_id : , type: , on_date : , show_off, title : , progress : , point : ,
    #               units : [
    #                           {contents : [], types : []},
    #                           {contents : [], types : []},
    #                           {contents : [], types : []},
    #                       ],
    #               result : [
    #                            {count : , index : , type:, repeat : , result : , answer : , strt_time,} ,
    #                            {count : , index : , type:, repeat : , result : , answer : , strt_time,} ,
    #                            {count : , index : , type:, repeat : , result : , answer : , strt_time,} ,
    #                        ],
    #           },
    #           {
    #               content_id : , title : , progress : , point : ,
    #               units : [
    #                           {contents : [], types : []},
    #                           {contents : [], types : []},
    #                           {contents : [], types : []},
    #                       ],
    #               result : [
    #                            {count : , index : , type:, repeat : , result : , answer : , strt_time,} ,
    #                            {count : , index : , type:, repeat : , result : , answer : , strt_time,} ,
    #                            {count : , index : , type:, repeat : , result : , answer : , strt_time,} ,
    #                        ],
    #           },
    #       ]
    # }
    properties = models.TextField(null=True, blank=True)
    # 위의 properties 가 아래의 json_data 로 대체
    json_data = models.TextField(null=True, blank=True)

    id_student = models.UUIDField(null=True, blank=True)
    # 클래스 uuid
    id_class = models.UUIDField(null=True, blank=True)
    # 코스 uuid
    id_course = models.UUIDField(null=True, blank=True)
    # 컨텐츠 uuid
    id_content = models.UUIDField(null=True, blank=True)

    # 추가
    id_base_course = models.UUIDField(null=True, blank=True)
    id_ref_course = models.UUIDField(null=True, blank=True)
    id_clinic_course = models.UUIDField(null=True, blank=True)

    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)
    version = models.IntegerField(default=0)
    pass


class mDemoStudyLogN(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    type = models.IntegerField(default=0)
    subtype = models.IntegerField(default=0)
    title = models.CharField(max_length=300, null=True, blank=True)
    order = models.IntegerField(default=0)
    index = models.IntegerField(default=0)

    # 속성
    properties = models.TextField(null=True, blank=True)

    id_student = models.UUIDField(null=True, blank=True)
    # 클래스 uuid
    id_class = models.UUIDField(null=True, blank=True)
    # 코스 uuid
    id_course = models.UUIDField(null=True, blank=True)
    # 컨텐츠 uuid
    id_content = models.UUIDField(null=True, blank=True)

    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)
    version = models.IntegerField(default=0)

    class Meta:
        db_table = '___mDemoStudyLogN'
    pass
