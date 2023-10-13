import uuid
from django.db import models
import django.utils.timezone

# Create your models here.
# Question Related Model


class mQuestionBook(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 수식 지원
    title = models.TextField(null=True, blank=True)
    # branch order
    branch_ids = models.TextField(null=True, blank=True)
    # --------------- detail -------------------------------
    author_id = models.UUIDField(null=True, blank=True)
    academy_id = models.UUIDField(null=True, blank=True)

    # question == 0, course == 1
    type = models.IntegerField(default=0)
    code = models.TextField(null=True, blank=True)
    depth = models.IntegerField(default=0)
    content_num = models.IntegerField(default=0)
    # --------------- detail -------------------------------

    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else ''


class mQuestionBookDetail(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # author_id = models.UUIDField(null=True, blank=True)
    # academy_id = models.UUIDField(null=True, blank=True)

    category_year = models.IntegerField(default=0)
    category_grade = models.IntegerField(default=0)
    category_publisher_id = models.UUIDField(null=True, blank=True)

    # question == 0, course == 1
    # type = models.IntegerField(default=0)
    # code = models.TextField(null=True, blank=True)
    # depth = models.IntegerField(default=0)
    # content_num = models.IntegerField(default=0)
    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else ''


class mQuestionBookBranch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 수식 지원
    title = models.TextField(null=True, blank=True)
    # branch order
    branch_ids = models.TextField(null=True, blank=True)
    # parent id
    parent_id = models.UUIDField(null=True, blank=True)

    # --------------- detail -------------------------------
    # branch == 0, content == 1
    type = models.IntegerField(default=0)
    level = models.IntegerField(default=0)
    code = models.TextField(null=True, blank=True)
    content_num = models.IntegerField(default=0)
    # --------------- detail -------------------------------

    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else ''


class mQuestionAtom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # parent uuid
    parent_id = models.UUIDField(null=True, blank=True)
    parent_ids = models.TextField(default='')
    # 별로 안쓰나? uuid
    qcode_id = models.UUIDField(null=True, blank=True)
    # question body uuid
    qb_id = models.UUIDField(null=True, blank=True)

    # 선다형 보기 uuids
    choice_text_ids = models.TextField(null=True, blank=True)

    # 해설 uuids (현재는 이 field 대신 solution_text 사용, 추후 변경 가능?)
    solution_text_ids = models.TextField(null=True, blank=True)
    # 영상 해설 uuids (현재는 이 field 대신 solution_video 사용, 추후 변경 가능?)
    solution_video_ids = models.TextField(null=True, blank=True)

    # for compatible issue
    # 해설
    solution_text = models.TextField(null=True, blank=True)
    # 영상 해설
    solution_video = models.TextField(null=True, blank=True)

    # 문제 자체
    content = models.TextField(null=True, blank=True)
    # or
    # 문제 항목 uuid
    content_id = models.UUIDField(null=True, blank=True)

    answer = models.TextField(null=True, blank=True)

    level = models.CharField(max_length=10, default='0')
    style = models.CharField(max_length=10, default='0')

    tag = models.TextField(default='')
    # 제작자 uuid
    author_id = models.UUIDField(null=True, blank=True)

    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id) if self.id else ''


class mQuestionDetail(models.Model):
    # same as mQuestionAtom.id
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # years
    category_year = models.IntegerField(default=0)
    # author id
    author_id = models.UUIDField(null=True, blank=True)
    # origin
    origin_img = models.TextField(null=True, blank=True)

    # solution text
    st_ids = models.TextField(null=True, blank=True)
    # solution video
    sv_ids = models.TextField(null=True, blank=True)

    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else ''


class mQuestionRelation(models.Model):
    # same as mQuestion.id , mQuestionAtom.id
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    twin_id = models.UUIDField(null=True, blank=True)
    proto_id = models.UUIDField(null=True, blank=True)


class mQuestionProto(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # 문제 자체 (include svg)
    content = models.TextField(null=True, blank=True)
    # or
    # 문제 항목 uuid
    content_id = models.UUIDField(null=True, blank=True)

    # 문제 parameter
    parameters = models.TextField(null=True, blank=True)

    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    # 제작자 uuid
    author_id = models.UUIDField(null=True, blank=True)
    # years
    category_year = models.IntegerField(default=0)
    # keywords
    keywords = models.TextField(null=True, blank=True)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)


class mSolutionText(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.TextField(default='')
    q_id = models.UUIDField(null=True, blank=True)
    content = models.TextField(default='')
    author_id = models.UUIDField(null=True, blank=True)
    invalid = models.BooleanField(default=False)
    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

# ///////////////////// Video Related Models //////////////////////////////
# mVideo


class mVideoAtom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # parent uuids
    parent_id = models.UUIDField(null=True, blank=True)
    parent_ids = models.TextField(default='')
    author_id = models.UUIDField(null=True, blank=True)

    title = models.TextField(default='')
    q_id = models.UUIDField(null=True, blank=True)

    # channelType
    # 1 == youtbe
    # 2 == vimeo
    code = models.IntegerField(default=0)
    url = models.TextField(default='')
    v_id = models.TextField(default='')
    # [00:00:00-00:00:00]
    time = models.TextField(default='')

    # 소속
    belongto = models.BooleanField(default=False)

    # representative screen shot = base64 image
    rss = models.TextField(null=True, blank=True)
    description = models.TextField(default='')
    tag = models.TextField(default='')

    # 유효
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else ''

# Course Related Model
# CourseBook = [CourseBookBranch,...] =


class mCourseBook(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 수식 지원
    title = models.TextField(null=True, blank=True)
    # branch order
    branch_ids = models.TextField(null=True, blank=True)
    # --------------- detail -------------------------------
    author_id = models.UUIDField(null=True, blank=True)
    academy_id = models.UUIDField(null=True, blank=True)

    # question == 0, course == 1
    type = models.IntegerField(default=0)
    code = models.TextField(null=True, blank=True)
    depth = models.IntegerField(default=0)
    content_num = models.IntegerField(default=0)
    # --------------- detail -------------------------------
    detail = models.JSONField(null=True)
    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else ''


class mCourseBookDetail(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author_id = models.UUIDField(null=True, blank=True)
    academy_id = models.UUIDField(null=True, blank=True)

    # question == 0, course == 1
    type = models.IntegerField(default=0)
    code = models.TextField(null=True, blank=True)
    depth = models.IntegerField(default=0)
    content_num = models.IntegerField(default=0)
    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else ''


class mCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.TextField(null=True, blank=True)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name if self.name else ""


class mCategoryMapper(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    category_id = models.UUIDField(null=True, blank=True)
    course_id = models.UUIDField(null=True, blank=True)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)


class mMapper(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.IntegerField(default=0)
    # type = 0 (Content KL Mapping)
    sub_type = models.IntegerField(default=0)
    # type = 0
    # subtype   : 0 (= Question ),
    #           : 1 (= Video) ,

    index = models.IntegerField(default=0)
    # order in list

    #
    id_book = models.UUIDField(null=True, blank=True)
    # complex sturcture
    id_myself = models.UUIDField(null=True, blank=True)
    id_root_complex = models.UUIDField(null=True, blank=True)
    id_leaf_complex = models.UUIDField(null=True, blank=True)

    invalid = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=django.utils.timezone.now)
    date_updated = models.DateTimeField(auto_now=True)

    version = models.IntegerField(default=0)
    pass


class mCourseBookBranch(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 수식 지원
    title = models.TextField(null=True, blank=True)
    # branch order
    branch_ids = models.TextField(null=True, blank=True)
    # parent id
    parent_id = models.UUIDField(null=True, blank=True)

    # --------------- detail -------------------------------
    # branch == 0, content == 1
    type = models.IntegerField(default=0)
    level = models.IntegerField(default=0)
    code = models.TextField(null=True, blank=True)
    content_num = models.IntegerField(default=0)
    # 수정 불가능 ?
    fixed = models.BooleanField(default=True)
    # --------------- detail -------------------------------

    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else ''

# Testum


class mTestum(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent_id = models.UUIDField(null=True, blank=True)
    type = models.IntegerField(default=0)
    # 수식 지원
    title = models.TextField(null=True, blank=True)
    # [q_id:?:?,q_id:q_id:q_id]
    # q_id = mQuestionAtom
    content_ids = models.TextField(null=True, blank=True)
    # [qu_id,qu_id...] mTestumUnit
    unit_ids = models.TextField(null=True, blank=True)

    author_id = models.UUIDField(null=True, blank=True)

    # 소속
    belongto = models.BooleanField(default=False)

    # 쌍둥이
    # Todo - 잠시 Default 를 twin = True , twin_num = 2 로 할까?
    # twin = models.BooleanField(default=False)
    # twin_num = models.IntegerField(default=0)
    twin = models.BooleanField(default=True)
    twin_num = models.IntegerField(default=2)

    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else ''


class mTestumUnit(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent_id = models.UUIDField(null=True, blank=True)
    type = models.IntegerField(default=0)
    # 수식 지원
    title = models.TextField(null=True, blank=True)
    # [q_id:?:?] 혹은 [q_id:q_id:q_id]
    # q_id = mQuestionAtom
    content_ids = models.TextField(null=True, blank=True)

    author_id = models.UUIDField(null=True, blank=True)

    # 소속
    belongto = models.BooleanField(default=False)

    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else ''


class mTestumPart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent_id = models.UUIDField(null=True, blank=True)
    type = models.IntegerField(default=0)
    title = models.TextField(null=True, blank=True)
    # [v_id:q_id:?:?,v_id:q_id:q_id]
    # v_id = mVideoAtom

    content_ids = models.TextField(null=True, blank=True)
    author_id = models.UUIDField(null=True, blank=True)
    # 소속
    belongto = models.BooleanField(default=False)
    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

# Lesson


class mLesson(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent_id = models.UUIDField(null=True, blank=True)
    type = models.IntegerField(default=0)
    title = models.TextField(null=True, blank=True)
    # [v_id:q_id:?:?,v_id:q_id:q_id]
    # v_id = mVideoAtom
    # q_id = mQuestionAtom
    content_ids = models.TextField(null=True, blank=True)
    # 혹은
    # lu_id = mLessonUnit
    # [lu_id,lu_id, .... ]
    unit_ids = models.TextField(null=True, blank=True)

    author_id = models.UUIDField(null=True, blank=True)

    # 소속
    belongto = models.BooleanField(default=False)

    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else ''


class mLessonUnit(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent_id = models.UUIDField(null=True, blank=True)
    type = models.IntegerField(default=0)
    title = models.TextField(null=True, blank=True)
    # [v_id:q_id:?:?]
    # v_id = mVideoAtom
    # q_id = mQuestionAtom
    content_ids = models.TextField(null=True, blank=True)

    author_id = models.UUIDField(null=True, blank=True)

    # 소속
    belongto = models.BooleanField(default=False)

    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else ''


class mLessonPart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    parent_id = models.UUIDField(null=True, blank=True)
    type = models.IntegerField(default=0)
    title = models.TextField(null=True, blank=True)
    # [v_id,q_id,q_id...]
    # v_id = mVideoAtom
    # q_id = mQuestionAtom
    content_ids = models.TextField(null=True, blank=True)
    author_id = models.UUIDField(null=True, blank=True)
    # 소속
    belongto = models.BooleanField(default=False)
    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)


# mQuestion -> mQuestionSolutionText
class mQuestionSolutionText(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    q_id = models.UUIDField(null=True, blank=True)
    content = models.TextField(default='')
    author_id = models.UUIDField(null=True, blank=True)

    invalid = models.BooleanField(default=False)
    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

# mQuestion -> mQuestionSolutionVideo


class mQuestionSolutionVideo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.TextField(default='')
    q_id = models.UUIDField(null=True, blank=True)
    # v_id = models.UUIDField(null=True, blank=True)
    # v_id = models.UUIDField(null=True, blank=True)
    url = models.TextField(default='')
    # [00:00:00-00:00:00]
    time = models.TextField(default='')
    description = models.TextField(default='')
    author_id = models.UUIDField(null=True, blank=True)

    invalid = models.BooleanField(default=False)
    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)
