from django.db import models
import uuid
from _cp.models import mCourseN


class courseDetail(models.Model):
    # school E:초등 M:중등 H:고등
    # grade 0:공통 1:1학년 2:2학년 3:3학년
    # semester 0:전학기 1:1학기 2:2학기
    # subject kor,eng,math,soc,sci,info,korhist
    # publisher 비상,능률,씨마스,천재,미래엔
    # difficulty 0:하 1:중 2:상
    # isTest True:형성평가 False:코스
    # producer
    # duration 0:무제한, 값
    # price 0:무료, 값
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    courseId = models.UUIDField(
        editable=False, null=True, blank=True
    )  # UUID 필드로 바꾸기
    courseTitle = models.TextField(null=True, blank=True)
    courseSummary = models.TextField(null=True, blank=True)
    desc = models.TextField(null=True, blank=True)
    thumnail = models.TextField(null=True, blank=True)

    year = models.IntegerField(default=0)
    school = models.TextField(null=True, blank=True)
    grade = models.IntegerField(default=0)
    semester = models.IntegerField(default=0)
    subject = models.TextField(null=True, blank=True)
    publisher = models.TextField(null=True, blank=True)
    isTest = models.BooleanField(default=False)
    difficulty = models.IntegerField(null=True, blank=True)
    producer = models.TextField(null=True, blank=True)
    duration = models.IntegerField(default=0)
    price = models.IntegerField(default=0)
    deliver = models.TextField(null=True, blank=True)


class CourseReset(models.Model):
    # school E:초등 M:중등 H:고등
    # grade 0:공통 1:1학년 2:2학년 3:3학년
    # semester 0:전학기 1:1학기 2:2학기
    # subject kor,eng,math,soc,sci,info,korhist
    # publisher 비상,능률,씨마스,천재,미래엔
    # difficulty 0:하 1:중 2:상
    # isTest True:형성평가 False:코스
    # producer
    # duration 0:무제한, 값
    # price 0:무료, 값
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_course = models.UUIDField(
        editable=False, null=True, blank=True
    )  # UUID 필드로 바꾸기
    course_title = models.TextField(null=True, blank=True)
    course_summary = models.TextField(null=True, blank=True)
    descript = models.TextField(null=True, blank=True)
    thumnail = models.TextField(null=True, blank=True)

    year = models.IntegerField(default=0)
    school = models.TextField(null=True, blank=True)
    grade = models.IntegerField(default=0)
    semester = models.IntegerField(default=0)
    subject = models.TextField(null=True, blank=True)
    publisher = models.TextField(null=True, blank=True)
    is_test = models.BooleanField(default=False)
    difficulty = models.IntegerField(null=True, blank=True)
    producer = models.TextField(null=True, blank=True)
    duration = models.IntegerField(default=0)
    price = models.IntegerField(default=0)
    deliver = models.TextField(null=True, blank=True)


class courseLanding(models.Model):
    id_course = models.UUIDField(null=False)
    subject = models.TextField(null=True, blank=True)
    id_page = models.TextField(null=True, blank=True)
