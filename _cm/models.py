from django.db import models
import uuid


class courseDetail(models.Model):
    # grade 1:1학년 2:2학년 3:3학년
    # semester 0:전학기 1:1학기 2:2학기
    # difficulty 1:하 2:중 3:상
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    courseId = models.TextField(editable=False, null=True, blank=True)
    courseTitle = models.TextField(null=True, blank=True)
    courseSummary = models.TextField(null=True, blank=True)
    desc = models.TextField(null=True, blank=True)
    thumnail = models.TextField(null=True, blank=True)

    year = models.IntegerField(default=0)
    school = models.TextField(null=True, blank=True)
    grade = models.IntegerField(default=0)
    semester = models.IntegerField(default=0)  # 1:1학기 2:2학기 0:전학기
    subject = models.TextField(null=True, blank=True)
    publisher = models.TextField(null=True, blank=True)
    isTest = models.BooleanField(default=False)
    difficulty = models.IntegerField(null=True, blank=True)
    producer = models.TextField(null=True, blank=True)
    duration = models.IntegerField(default=0)
    price = models.IntegerField(default=0)
