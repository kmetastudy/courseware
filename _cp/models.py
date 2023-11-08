from .nmodels import *
import uuid
from django.db import models
import django.utils.timezone

# Create your models here.
# Question Related Model
# 문제 의식 - 어떤 특정 문제가 여러 Question Book 에 Branch 에 속해 있으려면
# mQuestionAtom -> parent_id, branch_ids 로 만족하나?
# 오히려 Book Branch 에 type 을 1 로 하고 , branch_ids 에 mQuestionAtom.id 를
# 담는 것이 좀 더 합리적이지 않나?

# Question 과 Course Book 의 출판연도 (category_year) 는 의미가 있나?
# 부분 수정이 되거나 이를 copy and paste 할때 기존의 공통 요소와 다른 요소를
# 어떻게 보관해야 하는가?
# 일단 category_year 없이 진행해 보자.


class mQuestionBook(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 수식 지원
    title = models.TextField(null=True, blank=True)
    # branch order
    branch_ids = models.TextField(null=True, blank=True)
    # --------------- detail -------------------------------
    author_id = models.UUIDField(null=True, blank=True)
    academy_id = models.UUIDField(null=True, blank=True)

    # question == 0, kl == 1
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
        return self.title


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
        return self.title


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
        return self.title

# 문제의 속성을 파악하는데, KL Mapping 이 되었냐? 혹은... 문제집에 속해 있냐? 파악
# parend_ids ???


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

    # 해설 uuids
    solution_text_ids = models.TextField(null=True, blank=True)
    # 영상 해설 uuids
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
        return self.id

# ////////////////////////////////////////////////////////////////////////////
# 문제 본문 qb == Question Body


class mQuestionBodyAtom(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 본문 자체
    content = models.TextField(null=True, blank=True)
    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    tag = models.TextField(default='')

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)
    pass


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
        return self.title


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
    # 0 == simulation data
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
        return self.title

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

    # course == 0, course kl == 1
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
        return self.title


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
        return self.title


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
    # Todo. Jstar : 여기서 Testum Content 를 tweak 하자
    # Testum 의 content_num = 1 이면 Testum -> Exam 이 된다.
    content_num = models.IntegerField(default=0)
    # 수정 불가능 ?
    fixed = models.BooleanField(default=True)
    # --------------- detail -------------------------------

    # 유효 한가? 지웠나?
    invalid = models.BooleanField(default=False)

    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

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
        return self.title


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
        return self.title


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
        return self.title


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
        return self.title


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
    # 순서
    # order = models.IntegerField(default=0)

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
    # 순서 Todo. Fix 새로 추가 2022.12.17
    # order = models.IntegerField(default=0)
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

# /////////////////////////////////////////////////////////////////////////////
# //////////////////////////////// KL Mapper //////////////////////////////////
# question_id -> kl_root_id
#  1 : N
# 문제의 속성을 파악하는데, KL Mapping 이 되었냐? 혹은... 문제집에 속해 있냐? 파악
# parend_ids ???


class mQuestionKLMapper(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 문제 uuid
    question_id = models.UUIDField(null=True, blank=True)

    # 소속 kl root id
    belong_kl_root_id = models.UUIDField(null=True, blank=True)
    # 소속 kl 말단 id
    belong_kl_leaf_id = models.UUIDField(null=True, blank=True)

    invalid = models.BooleanField(default=False)
    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)
    pass

# video_id -> kl_root_id
#  1 : N


class mVideoKLMapper(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # 영상 uuid
    video_id = models.UUIDField(null=True, blank=True)

    # 소속 kl root id
    belong_kl_root_id = models.UUIDField(null=True, blank=True)
    # 소속 kl 말단 id
    belong_kl_leaf_id = models.UUIDField(null=True, blank=True)

    invalid = models.BooleanField(default=False)
    created_date = models.DateTimeField(default=django.utils.timezone.now)
    updated_date = models.DateTimeField(auto_now=True)
    pass


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
    pass
