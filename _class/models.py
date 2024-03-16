import uuid
import secrets
import string

from django.utils import timezone
from django.db import models

from core.models import BaseModel
from _cp.models import mCourseN

# Create your models here.


class mClass(BaseModel):
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
    id_owner = models.UUIDField(null=True, blank=True)
    title = models.CharField(max_length=64, blank=True)
    description = models.TextField(blank=True)
    institution = models.CharField(max_length=64, blank=True)
    institution_type = models.IntegerField(
        choices=INSTITUTION_TYPE_CHOICES, default=NO_INSTITUTION
    )
    active = models.BooleanField(default=True, verbose_name="활성화 여부")

    def __str__(self) -> str:
        return self.title if self.title else "mClass"

    def display_institution_type(self):
        return self.get_institution_type_display()


class SingleCourseClassManager(models.Manager):
    def create_class(self, id_owner: uuid.uuid4, id_course: uuid.uuid4, **extra_fields):
        if not id_owner:
            raise ValueError("mSingleCourseClass must have id_owner")
        if not id_course:
            raise ValueError("mSingleCourseClass must have id_course")

        single_course_class = self.model(
            id_owner=id_owner, id_cousre=id_course, **extra_fields
        )

        single_course_class.full_clean()
        single_course_class.save()

        return single_course_class

    def list_class(self):
        query = self.model.objects.all()

        return query

    def retrieve_class(self, id: uuid.uuid4):
        if not id:
            raise ValueError("mSingleCourseClass must have id")
        query = self.model.filter(id=id)

        return query.first() if query.exists() else None


class mSingleCourseClass(BaseModel):
    """
    NOTE:
    이것은 하나의 코스만 가지고 있는 클래스이다.
    학생들이 코스를 구매하고 난 후, 해당 코스에 대한 클래스 목록을 볼 수 있다.
    그 후, 해당 클래스에 대해 수강신청을 할 수 있다.
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
    id_owner = models.UUIDField(null=True, blank=True)
    id_course = models.UUIDField(null=True, blank=True)
    title = models.CharField(max_length=64, blank=True)
    description = models.TextField(blank=True)
    institution = models.CharField(max_length=64, blank=True)
    institution_type = models.IntegerField(
        choices=INSTITUTION_TYPE_CHOICES, default=NO_INSTITUTION
    )
    active = models.BooleanField(default=True, verbose_name="활성화 여부")
    max_member = models.IntegerField(blank=True, null=True)

    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)

    def __str__(self) -> str:
        return self.title if self.title else "mSingleCourseClass"

    def display_institution_type(self):
        return self.get_institution_type_display()

    def has_max_member(self):
        return type(self.max_member) == int


class ClassMemberManager(models.Manager):
    def create_member(self, id_user: uuid.uuid4, id_class: uuid.uuid4, type):
        if not id_user:
            raise ValueError("mClassMember must have id_user")
        if not id_class:
            raise ValueError("mClassMemeber must have id_class")
        if not type:
            type = self.TYPE_ANNONYMOUS

        queryset = self.get_queryset()

        is_already_exists = queryset.filter(
            id_user=id_user, id_class=id_class, type=type
        ).exists()

        if is_already_exists:
            raise ValueError("This member already exists")

        query = self.model(id_user=id_user, id_class=id_class, type=type)

        query.full_clean()
        query.save()

        return query


class mClassMember(BaseModel):
    TYPE_ANNONYMOUS = 0
    TYPE_ADMIN = 1  # aa
    TYPE_OPERATOR = 2  # op
    TYPE_PRODUCER = 4  # cp
    TYPE_TEACHER = 8  # tc
    TYPE_STUDENT = 16  # NNNNNNNN (8 digit)
    TYPE_PARENT = 32  # NNNNNNNNp (8 digit + p)
    TYPE_USER = 64  # Default
    TYPE_MANAGER = 128  # rm

    MEMBER_TYPES = [
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
    id_user = models.UUIDField(null=True, blank=True)
    id_class = models.UUIDField(null=True, blank=True)
    type = models.IntegerField(choices=MEMBER_TYPES, default=TYPE_ANNONYMOUS)

    custom_objects = ClassMemberManager()

    @property
    def display_type(self):
        return self.get_type_display()


class mClassPost(BaseModel):
    TYPE_GENERAL = 1
    TYPE_NOTICE = 2
    TYPE_CHOICES = [(TYPE_GENERAL, "General"), (TYPE_NOTICE, "Notice")]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_author = models.UUIDField(null=True, blank=True)
    id_class = models.UUIDField(null=True, blank=True)
    title = models.CharField(max_length=124, blank=True)
    content = models.TextField(blank=True)
    pinned = models.BooleanField(default=False)

    type = models.IntegerField(choices=TYPE_CHOICES, default=TYPE_GENERAL)

    def display_type(self):
        return self.get_type_display()


class mReaction(BaseModel):
    """
    id_user : reaction을 누른 사람
    id_content: reaction에 해당하는 콘텐츠(글, 비디오, ...)
    type: 0: 싫어요, 1: 좋아요?
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_user = models.UUIDField(null=True, blank=True)
    id_content = models.UUIDField(null=True, blank=True)
    type = models.IntegerField(default=1)


class mComment(BaseModel):
    """
    id_commenter : 댓글 작성자
    id_content: 댓글이 달린 콘텐츠(글, 비디오, ...)
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_commenter = models.UUIDField(null=True, blank=True)
    id_content = models.UUIDField(null=True, blank=True)
    title = models.CharField(max_length=124, blank=True)
    comment = models.TextField(blank=True)
    pinned = models.BooleanField(default=False)


class mClassContentAssign(BaseModel):
    # uuid
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.IntegerField(default=0)
    id_class = models.UUIDField(null=True, blank=True)
    id_course = models.UUIDField(null=True, blank=True)
    id_teacher = models.UUIDField(null=True, blank=True)  # unused
    id_student = models.UUIDField(null=True, blank=True)  # unused

    json_data = models.TextField(blank=True)
    show_off = models.BooleanField(default=False)


class ClassInvitationQuerySet(models.QuerySet):
    def code(self, code):
        return self.filter(code=code)

    def user(self, id_user):
        return self.filter(id_user=id_user)

    def user_code(self, code, id_user):
        return self.filter(code=code, id_user=id_user)


UPPERCASE_LETTERS = string.ascii_uppercase
DEV_DOMAIN = "http://localhost:8000"


class ClassInvitationManager(models.Manager):
    def get_queryset(self):
        return ClassInvitationQuerySet(self.model, using=self._db)

    def code(self, code):
        return self.get_queryset().code(code)

    def user(self, id_user):
        return self.get_queryset().user(id_user)

    def user_code(self, code, id_user):
        return self.get_queryset().user_code(code, id_user)

    def is_code_exists(self, code):
        return self.code(code).exists()

    def generate_unique_code(self, max_attempts=40):
        for _ in range(max_attempts):
            code = "".join(secrets.choice(UPPERCASE_LETTERS) for _ in range(8))
            if not self.is_code_exists(code):
                return code
        return None

    def refresh_code(self, prev_code):
        if self.is_code_exists(prev_code):
            new_code = self.generate_unique_code()
            instance = self.code(code=prev_code)
            instance.code = new_code
            instance.save()
            return instance

    def generate_invitation_uri(self, code):
        domain = "http://localhost:8000"
        return (
            f"{domain}/class/invitation/{code}" if self.is_unique_code(code) else None
        )


class mClassInvitation(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_class = models.UUIDField(null=True, blank=True)
    code = models.CharField(max_length=8, blank=True)
    expiration_date = models.DateTimeField(null=True, blank=True)

    custom_objects = ClassInvitationManager()

    def is_expired(self):
        return self.expiration_date < timezone.now()

    def generate_invitation_uri(self, code):
        return f"{DEV_DOMAIN}/class/invitation/{code}"

    def refresh_code(self, code):
        self.code = code
        self.save()


class mClassCourse(BaseModel):
    """
    This is class course mapper.
    So in class, when you need to list class data, use this model.
    NOTE: 2024-02-22
    This model is temporary, and can be changed.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_class = models.UUIDField(null=True, blank=True)
    id_course = models.UUIDField(null=True, blank=True)
    expiration_date = models.DateTimeField(null=True, blank=True)

    def is_expired(self):
        return self.expiration_date < timezone.now() if self.expiration_date else False
