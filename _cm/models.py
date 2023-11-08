from django.db import models
import uuid
# Create your models here.


class courseDetail(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.TextField(null=True, blank=True)
    summary = models.TextField(null=True, blank=True)
    desc = models.TextField(null=True, blank=True)

    year = models.IntegerField(default=0)
    school = models.TextField(null=True, blank=True)
    grade = models.IntegerField(default=0)
    semester = models.IntegerField(default=0)  # 1:1학기 2:2학기 0:전학기
    subject = models.TextField(null=True, blank=True)
    publisher = models.TextField(null=True, blank=True)
    difficulty = models.TextField(null=True, blank=True)
    duration = models.IntegerField(default=0)
    cost = models.IntegerField(default=0)
