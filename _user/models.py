import uuid

from django.db import models
import django.utils.timezone
# Create your models here.


class mUser(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    username = models.CharField(
        max_length=64, null=True, blank=True)  # id of user
    password = models.CharField(max_length=256, null=True, blank=True)
    type = models.IntegerField(default=0)

    full_name = models.TextField(null=True, blank=True)  # name of user
    email = models.CharField(max_length=256, null=True, blank=True)
    year = models.IntegerField(default=0)
    grade = models.CharField(max_length=16, null=True, blank=True)
    gender = models.CharField(max_length=4, null=True, blank=True)
    json_data = models.TextField(null=True, blank=True)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name if self.name else ''
