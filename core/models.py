from django.db import models
from django.utils import timezone
# Create your models here.


class BaseModel(models.Model):
    created_date = models.DateTimeField(db_index=True, default=timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    objects = models.Manager()

    class Meta:
        abstract = True
        default_manager_name = 'objects'
