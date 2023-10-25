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

# nxmodels.py 의 mBookNXX 동일하게 만듬


class mCourse(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.IntegerField(default=0)
    # type : 0 (= folder), 1 (= element book ), 2 (= course book) , 3(= kl book)
    sub_type = models.IntegerField(default=0)
    # sub_type : 0 (= no meanig) , 1 (= KL)
    index = models.IntegerField(default=0)
    # order in list
    title = models.TextField(null=True, blank=True)
    short_title = models.TextField(null=True, blank=True)
    code = models.CharField(max_length=64, null=True, blank=True)

    # category year
    year = models.IntegerField(default=0)
    # free book
    free = models.BooleanField(default=False)
    # published book
    published = models.BooleanField(default=False)

    level = models.IntegerField(default=0)
    # level 분류
    subject = models.IntegerField(default=0)
    # 과목 코드
    grade = models.IntegerField(default=0)
    # 학년 코드
    category = models.IntegerField(default=0)
    #
    sub_category = models.IntegerField(default=0)
    language = models.IntegerField(default=0)
    country = models.IntegerField(default=0)
    publisher = models.IntegerField(default=0)
    author = models.IntegerField(default=0)

    json_data = models.TextField(null=True, blank=True)

    # 분류
    id_subject = models.UUIDField(null=True, blank=True)
    # 세분류
    id_grade = models.UUIDField(null=True, blank=True)
    # 분류
    id_catergoy = models.UUIDField(null=True, blank=True)
    # 세분류
    id_sub_category = models.UUIDField(null=True, blank=True)
    # 언어
    id_language = models.UUIDField(null=True, blank=True)
    level = models.IntegerField(default=0)

    # 아래의 항목 표시 포함
    # show_brand = models.CharField(max_length=256,null=True, blank=True)
    # # 상표 이름 (쎈수학, 디딤돌)
    # show_publisher = models.CharField(max_length=256,null=True, blank=True)
    # # 출판사 이름 (엔스크린, 지학사)
    # show_subject = models.CharField(max_length=64,null=True, blank=True)
    # # 과목 이름 (국어, 영어, 정보)
    # show_grade = models.CharField(max_length=64,null=True, blank=True)
    # # 학년 이름 (중1, 고1)

    # 분류
    id_subject = models.UUIDField(null=True, blank=True)
    # 세분류
    id_grade = models.UUIDField(null=True, blank=True)
    # 분류
    id_catergoy = models.UUIDField(null=True, blank=True)
    # 세분류
    id_sub_category = models.UUIDField(null=True, blank=True)
    # 언어
    id_language = models.UUIDField(null=True, blank=True)
    # 나라
    id_country = models.UUIDField(null=True, blank=True)
    # licese issue
    id_publisher = models.UUIDField(null=True, blank=True)
    # id_publisher = id_institute
    id_author = models.UUIDField(null=True, blank=True)
    # id_author = id_member
    # id_langauge = models.UUIDField(null=True, blank=True)

    tag = models.TextField(null=True, blank=True)

    invalid = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=django.utils.timezone.now)
    date_updated = models.DateTimeField(auto_now=True)

    version = models.IntegerField(default=0)

    class Meta:
        db_table = '__cp_mCourseN'
    pass


# Element == Item
# nxmodels.py 의 mElementNXX 와 동일
class mElement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.IntegerField(default=0)
    # type : 0 (= Question), 1 (= Video) , 3 (= Body ), 4 (= Picture) , 5 (= Sound)
    sub_type = models.IntegerField(default=0)
    # Question Type :
    # Video Type :
    index = models.IntegerField(default=0)
    # order in list

    year = models.IntegerField(default=0)

    json_data = models.TextField(null=True, blank=True)
    # content_question* :
    # {
    # body : [uuid],
    # main : "main text",
    # choices : ["choice text",...],
    # answers : ["answer text",...],
    # solution_text : [uuid,...],
    # solution_video:[uuid,...],
    # ref : [
    #       { id_course: , id_leaf : },
    #       { id_course: , id_leaf : },
    #       ],
    # kl : [
    #       { id_kl: , id_leaf : },
    #       { id_kl: , id_leaf : },
    #       ],
    # }

    # content_video* :
    # {
    # title : "title text",
    # type : "youtube", or ...
    # url : "url text",
    # times : ["time text",...],
    # thumb : "thumb text",
    # question : "uuid"
    # ref : [
    #       { id_course: , id_leaf : },
    #       { id_course: , id_leaf : },
    #       ],
    # kl : [
    #       { id_kl: , id_leaf : },
    #       { id_kl: , id_leaf : },
    #       ],
    # }

    likes = models.IntegerField(default=0)

    # licese issue
    id_publisher = models.UUIDField(null=True, blank=True)
    # id_publisher = id_institute
    id_author = models.UUIDField(null=True, blank=True)
    # id_author = id_member
    id_langauge = models.UUIDField(null=True, blank=True)

    tag = models.TextField(null=True, blank=True)
    sub_tag = models.TextField(null=True, blank=True)
    # sub_tag_question* :
    # {
    # style : sc = style choice , ss = style short answr , sl = style long answer,
    # level : l0 = easy , l1 = normal , l2 = hard , l3 = very hard,
    # body : be = body exist , bn = body not exist ,
    # solution_text : tse  = text solution exist , tsn = text solution not exist,
    # solution_video : vse = video solution exist , vsn = video solution not exist,
    # }
    # sub_tag_video* :
    # {
    #   video type : yt = youtube , vm = vimeo ,
    #
    # }
    invalid = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=django.utils.timezone.now)
    date_updated = models.DateTimeField(auto_now=True)

    version = models.IntegerField(default=0)

    class Meta:
        db_table = '__cp_mElementN'

    pass
