import uuid

from django.db import models
import django.utils.timezone

from core.models import BaseModel
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import BaseUserManager as BUM
from django.contrib.auth.models import PermissionsMixin

# Create your models here.


class BaseUserManager(BUM):
    def create_user(
        self, email, is_active=True, is_admin=False, password=None, **extra_fields
    ):
        if not email:
            raise ValueError("Users must have an email address")

        user = self.model(
            email=self.normalize_email(email.lower()),
            is_active=is_active,
            is_admin=is_admin,
            **extra_fields
        )

        if password is not None:
            user.set_password(password)
        else:
            user.set_unusable_password()

        user.full_clean()
        user.save()

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        user = self.create_user(
            email=email,
            is_active=True,
            is_admin=True,
            password=password,
            **extra_fields
        )

        user.is_superuser = True
        user.save()

        return user


class mUser(BaseModel, AbstractBaseUser, PermissionsMixin):
    TYPE_ANNONYMOUS = 0
    TYPE_ADMIN = 1  # aa
    TYPE_OPERATOR = 2  # op
    TYPE_PRODUCER = 4  # cp
    TYPE_TEACHER = 8  # tc
    TYPE_STUDENT = 16  # NNNNNNNN (8 digit)
    TYPE_PARENT = 32  # NNNNNNNNp (8 digit + p)
    TYPE_USER = 64  # Default
    TYPE_MANAGER = 128  # rm

    USER_TYPES = [
        (TYPE_ANNONYMOUS, "Annonymous"),
        (TYPE_ADMIN, "Admin"),
        (TYPE_OPERATOR, "Operator"),
        (TYPE_PRODUCER, "Producer"),
        (TYPE_TEACHER, "Teacher"),
        (TYPE_STUDENT, "Student"),
        (TYPE_PARENT, "Parent"),
        (TYPE_USER, "User"),
        (TYPE_MANAGER, "Manager"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(verbose_name="email address", max_length=255, unique=True)

    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = "email"

    # profiles
    full_name = models.CharField(max_length=256, null=True, blank=True)  # name of user
    nickname = models.CharField(max_length=256, null=True, blank=True)
    type = models.IntegerField(choices=USER_TYPES, default=TYPE_USER)
    grade = models.CharField(max_length=16, null=True, blank=True)
    gender = models.CharField(max_length=4, null=True, blank=True)

    json_data = models.TextField(null=True, blank=True)

    objects = BaseUserManager()

    def __str__(self):
        return self.email

    def is_staff(self):
        return self.is_admin

    def is_teacher(self):
        return self.type == self.TYPE_TEACHER

    def is_student(self):
        return self.type == self.TYPE_STUDENT


class mCoursePurchases(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_course = models.UUIDField(null=True, blank=True)
    id_user = models.UUIDField(null=True, blank=True)
    active = models.BooleanField(default=True, verbose_name="활성화 여부")
    purchase_date = models.DateTimeField(default=django.utils.timezone.now)
    expiration_date = models.DateTimeField(null=True, blank=True)

    def is_expired(self):
        return (
            False
            if not self.expiration_date
            else django.utils.timezone.now() >= self.expiration_date
        )
