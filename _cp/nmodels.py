from .nxmodels import *
import uuid
from django.db import models
import django.utils.timezone
# //////////////////////////////////////////////////////////////////////////////
# ///////////////////////////////// New Models /////////////////////////////////


class mComplex(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.IntegerField(default=0)
    # type : 0 (= folder), 1 (= element book ), 2 (= course book) ,
    sub_type = models.IntegerField(default=0)
    # sub_type : 0 (= no meanig) , 1 (= KL)
    index = models.IntegerField(default=0)
    # order in list
    title = models.TextField(null=True, blank=True)
    code = models.CharField(max_length=64, null=True, blank=True)

    level = models.IntegerField(default=0)
    # depth in tree

    id_parent = models.UUIDField(null=True, blank=True)
    # in tree
    ids_child = models.TextField(null=True, blank=True)
    # ordered children ids in list
    num_child = models.IntegerField(default=0)
    # number of children
    year = models.IntegerField(default=0)
    # category_year

    # licese issue
    id_publisher = models.UUIDField(null=True, blank=True)
    # id_publisher = id_institute
    id_author = models.UUIDField(null=True, blank=True)
    # id_author = id_member
    id_langauge = models.UUIDField(null=True, blank=True)

    tag = models.TextField(null=True, blank=True)

    invalid = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=django.utils.timezone.now)
    date_updated = models.DateTimeField(auto_now=True)

    version = models.IntegerField(default=0)
    pass


class mComplexDetail(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_complex = models.UUIDField(null=True, blank=True)

    thumb = models.TextField(null=True, blank=True)
    # thumb nail picture
    description = models.TextField(null=True, blank=True)

    # folder sturcture
    id_root_complex = models.UUIDField(null=True, blank=True)
    id_leaf_complex = models.UUIDField(null=True, blank=True)

    id_subject = models.UUIDField(null=True, blank=True)
    id_grade = models.UUIDField(null=True, blank=True)
    id_language = models.UUIDField(null=True, blank=True)

    tag = models.TextField(null=True, blank=True)

    invalid = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=django.utils.timezone.now)
    date_updated = models.DateTimeField(auto_now=True)

    version = models.IntegerField(default=0)
    pass

# nxmodels.py 의 mBookNXX 동일하게 만듬


class mCourseN(models.Model):
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

# nxmodels.py 의 mBookExtraNXX 와 동일


class mCourseExtraN(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    id_course = models.UUIDField(null=True, blank=True)

    thumb = models.TextField(null=True, blank=True)
    # thumb nail picture
    description = models.TextField(null=True, blank=True)

    # folder sturcture
    # id_root_complex = models.UUIDField(null=True, blank=True)
    # id_leaf_complex = models.UUIDField(null=True, blank=True)

    # 분류
    id_subject = models.UUIDField(null=True, blank=True)
    # 세분류
    id_grade = models.UUIDField(null=True, blank=True)
    # 언어
    id_language = models.UUIDField(null=True, blank=True)

    tag = models.TextField(null=True, blank=True)

    invalid = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=django.utils.timezone.now)
    date_updated = models.DateTimeField(auto_now=True)

    version = models.IntegerField(default=0)

    class Meta:
        db_table = '__cp_mCourseExtraN'

    pass

# book 과 book 을 mapping
# book 안에 자세한 mapping 은 json_data 로 변환


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

# nxmodels.py 의 mMapperNXX 와 동일(필드명 약간다름)


class mMapperN(models.Model):
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

    class Meta:
        db_table = '__cp_mMapperN'
    pass


class mContent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.IntegerField(default=0)
    # type : 0 (= Unit), 1 (= Lesson) , 2 (= Testum ), 3 (= Examination)
    sub_type = models.IntegerField(default=0)
    #
    index = models.IntegerField(default=0)
    # order in list
    title = models.TextField(null=True, blank=True)
    code = models.CharField(max_length=64, null=True, blank=True)

    id_parent = models.UUIDField(null=True, blank=True)
    # in tree
    ids_child = models.TextField(null=True, blank=True)

    # licese issue
    id_publisher = models.UUIDField(null=True, blank=True)
    # id_publisher = id_institute
    id_author = models.UUIDField(null=True, blank=True)
    # id_author = id_member
    id_langauge = models.UUIDField(null=True, blank=True)

    tag = models.TextField(null=True, blank=True)

    invalid = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=django.utils.timezone.now)
    date_updated = models.DateTimeField(auto_now=True)

    version = models.IntegerField(default=0)
    pass


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
    pass

# Element == Item
# nxmodels.py 의 mElementNXX 와 동일


class mElementN(models.Model):
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
# //////////////////////////////////////////////////////////////////////////////
# ///////////////////////////// Other New Models ///////////////////////////////
# 영상과 문제(특히 영상을 위해서 했지만, 이젠 필요없다)


class mContentComplex(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    type = models.IntegerField(default=0)
    # type : 0 (= folder), 1 (= element book ), 2 (= course book) ,
    sub_type = models.IntegerField(default=0)
    # sub_type : 0 (= no meanig) , 1 (= KL)
    index = models.IntegerField(default=0)
    # order in list
    title = models.TextField(null=True, blank=True)
    code = models.CharField(max_length=64, null=True, blank=True)

    level = models.IntegerField(default=0)
    # depth in tree

    id_parent = models.UUIDField(null=True, blank=True)
    # in tree
    ids_child = models.TextField(null=True, blank=True)
    # ordered children ids in list
    num_child = models.IntegerField(default=0)
    # number of children
    year = models.IntegerField(default=0)
    # category_year

    # licese issue
    id_publisher = models.UUIDField(null=True, blank=True)
    # id_publisher = id_institute
    id_author = models.UUIDField(null=True, blank=True)
    # id_author = id_member
    id_langauge = models.UUIDField(null=True, blank=True)

    tag = models.TextField(null=True, blank=True)

    invalid = models.BooleanField(default=False)
    date_created = models.DateTimeField(default=django.utils.timezone.now)
    date_updated = models.DateTimeField(auto_now=True)

    version = models.IntegerField(default=0)
    pass
