from django.db import models
import uuid
from _cp.models import mCourseN
from django.utils import timezone


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
    courseId = models.UUIDField(null=True, blank=True)  # UUID 필드로 바꾸기
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

    created_date = models.DateTimeField(db_index=True, default=timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.courseTitle


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


class Notice(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField(null=True, blank=True)
    author = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    view_count = models.IntegerField(default=0)
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default="Active")
    attachment = models.FileField(upload_to="attachments/", blank=True, null=True)
    is_pinned = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class FAQCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class FAQ(models.Model):
    category = models.ForeignKey(
        FAQCategory, on_delete=models.CASCADE, related_name="faqs"
    )
    question = models.CharField(max_length=255)
    answer = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.question


class Post(models.Model):
    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField(null=True, blank=True)
    author = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    view_count = models.IntegerField(default=0)
    status = models.CharField(max_length=8, choices=STATUS_CHOICES, default="Active")
    attachment = models.FileField(upload_to="attachments/", blank=True, null=True)

    def __str__(self):
        return self.title
