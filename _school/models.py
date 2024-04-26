import uuid

from django.db import models

from _cm.models import courseDetail
from core.models import BaseModel

# Create your models here.


class mSchool(BaseModel):
    """
    학교 생성
    """

    NO_INSTITUTION = 0
    ELEMENTARY_SCHOOL = 1
    MIDDLE_SCHOOL = 2
    HIGH_SCHOOL = 3
    EXTRA_INSTITUTION = 4
    INSTITUTION_TYPE_CHOICES = [
        (NO_INSTITUTION, "NA"),
        (ELEMENTARY_SCHOOL, "ElementarySchool"),
        (MIDDLE_SCHOOL, "MiddleSchool"),
        (HIGH_SCHOOL, "HighSchool"),
        (EXTRA_INSTITUTION, "Extra"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=64, blank=True)
    institution_type = models.IntegerField(
        choices=INSTITUTION_TYPE_CHOICES, default=NO_INSTITUTION
    )
    img_logo = models.TextField(null=True, blank=True)
    img_banner = models.TextField(null=True, blank=True)
    active = models.BooleanField(default=True, verbose_name="활성화 여부")

    def __str__(self):
        return self.title


class mSchoolSection(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_school = models.ForeignKey(
        mSchool, on_delete=models.CASCADE, related_name="school", null=True, blank=True
    )
    title = models.CharField(max_length=64, blank=True)
    img_background = models.TextField(null=True, blank=True)
    active = models.BooleanField(default=True, verbose_name="활성화 여부")

    def __str__(self):
        return self.id_school.title + " " + self.title


class mSchoolCourse(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_section = models.ForeignKey(
        mSchoolSection,
        on_delete=models.CASCADE,
        related_name="courses",
        null=True,
        blank=True,
    )
    course = models.ForeignKey(
        courseDetail,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    active = models.BooleanField(default=True, verbose_name="활성화 여부")

    def __str__(self):
        return (
            self.id_section.id_school.title
            + " "
            + self.id_section.title
            + " "
            + self.course.courseTitle
        )


class mSchoolNotice(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_school = models.ForeignKey(
        mSchool, on_delete=models.CASCADE, null=True, blank=True
    )
    title = models.CharField(max_length=64, blank=True)
    date = models.CharField(max_length=64, blank=True)
    url = models.TextField(null=True, blank=True)
