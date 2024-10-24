import json
from django.db.models import Q
from django.forms import modelformset_factory
from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse

from decouple import config

from _cm.models import (
    FAQ,
    Banner,
    CourseReset,
    Notice,
    Post,
    courseDetail,
    courseLanding,
)
from _cm.serializers import (
    CourseDetailSerializer,
    FAQSerializer,
    NoticeSerializer,
    PostSerializer,
)
from _cp.nmodels import mCourseN
from _main.forms import CartCourseForm, PaymentForm
from _main.models import (
    CartCourse,
    Order,
    OrderPayment,
    OrderedProduct,
    Payment,
    PointCharge,
    PointUse,
    Points,
)
from _school.models import mSchool, mSchoolSection
from _school.serializers import SchoolSerializer, SectionSerializer
from _st.utils import has_course_permission
from _user.decorators import jwt_login_required
from _user.models import mUser
from _user.utils import make_context

# Create your views here.


@jwt_login_required
def index(request):
    context_sample = make_context(request)

    banners = Banner.objects.all()

    school = mSchool.objects.filter(active=True)
    schools = SchoolSerializer(school, many=True).data

    elementary_course_queryset = courseDetail.objects.filter(school="E")
    elementary_courses = CourseDetailSerializer(
        elementary_course_queryset, many=True
    ).data

    elementary_sections = {"title": "초등코스"}
    elementary_sections["courses"] = [
        {"course": course} for course in elementary_courses
    ]

    middle_course_queryset = courseDetail.objects.filter(school="M")
    middle_courses = CourseDetailSerializer(middle_course_queryset, many=True).data

    middle_sections = {"title": "중등코스"}
    middle_sections["courses"] = [{"course": course} for course in middle_courses]

    high_course_queryset = courseDetail.objects.filter(school="H")
    high_courses = CourseDetailSerializer(high_course_queryset, many=True).data

    high_sections = {"title": "고등코스"}
    high_sections["courses"] = [{"course": course} for course in high_courses]

    sections = []
    sections.append(elementary_sections)
    sections.append(middle_sections)
    sections.append(high_sections)

    context = {
        "context": json.dumps(context_sample),
        "banners": banners,
        "sections": json.dumps(sections),
        "schools": schools,
    }
    return render(request, "_main/landing.html", context)


@jwt_login_required
def new_contact(request):
    context_sample = make_context(request)
    context = {
        "context": json.dumps(context_sample),
    }
    return render(request, "_main/contact.html", context)


@jwt_login_required
def about(request):
    context_sample = make_context(request)

    notice_queryset = Notice.objects.all()
    notices = NoticeSerializer(notice_queryset, many=True).data
    # date = notices[0]["created_at"]
    # print(type(date))

    context = {
        "context": json.dumps(context_sample),
        "notices": json.dumps(notices),
    }
    return render(request, "_main/about.html", context)


@jwt_login_required
def faq(request):
    context_sample = make_context(request)

    faq_queryset = FAQ.objects.all()
    faqs = FAQSerializer(faq_queryset, many=True).data

    context = {
        "context": json.dumps(context_sample),
        "faqs": json.dumps(faqs),
    }
    return render(request, "_main/about_faq.html", context)


@jwt_login_required
def news(request):
    context_sample = make_context(request)

    post_queryset = Post.objects.all()
    posts = PostSerializer(post_queryset, many=True).data

    context = {
        "context": json.dumps(context_sample),
        "posts": json.dumps(posts),
    }
    return render(request, "_main/about_news.html", context)


@jwt_login_required
def descView(request, page):
    context_sample = make_context(request)

    context = {"context": json.dumps(context_sample)}
    pageName = "_main/landing" + page + ".html"

    return render(request, pageName, context)


@jwt_login_required
def mainView(request, school, subject):
    schoolOption = {
        "element": "초등",
        "middle": "중등",
        "midhigh": "예비고1",
        "high": "고등",
        "high2": "수능",
    }
    schoolOption2 = {
        "element": "E",
        "middle": "M",
        "midhigh": "MH",
        "high": "H",
        "high2": "HH",
    }
    subjectOption = {
        "element": [
            {"kor": "국어", "eng": "kor"},
            {"kor": "영어", "eng": "eng"},
            {"kor": "수학", "eng": "math"},
            {"kor": "사회", "eng": "soc"},
            {"kor": "과학", "eng": "sci"},
            {"kor": "기타", "eng": "etc"},
        ],
        "middle": [
            {"kor": "국어", "eng": "kor"},
            {"kor": "영어", "eng": "eng"},
            {"kor": "수학", "eng": "math"},
            {"kor": "사회", "eng": "soc"},
            {"kor": "역사", "eng": "hist"},
            {"kor": "과학", "eng": "sci"},
            {"kor": "정보", "eng": "info"},
            {"kor": "기타", "eng": "etc"},
        ],
        "high": [
            {"kor": "국어", "eng": "kor"},
            {"kor": "영어", "eng": "eng"},
            {"kor": "수학", "eng": "math"},
            {"kor": "사회", "eng": "soc"},
            {"kor": "한국사", "eng": "korhist"},
            {"kor": "과학", "eng": "sci"},
            {"kor": "정보", "eng": "info"},
            {"kor": "특성화", "eng": "etc"},
        ],
    }
    print(request.method)
    if subject == "all" and request.method == "GET":
        courses = getCourses(request, schoolOption2[school], subject)

        context_sample = make_context(request)
        main_context = {
            "school": school,
            "schoolKor": schoolOption[school],
            "subject": subject,
            "subject_list": subjectOption[school],
        }

        context = {
            "context": json.dumps(context_sample),
            "options": json.dumps(main_context),
            "courses": json.dumps(courses, default=str),
        }

        print(context)
        return render(request, "_main/course.html", context)

    else:

        courses = getCourses(request, schoolOption2[school], subject)

        return JsonResponse(
            {"message": subject, "courses": json.dumps(courses, default=str)}
        )


def getCourses(request, school, subject):
    grade = request.POST.getlist("grade[]", None)
    semester = request.POST.getlist("semester[]", None)
    publisher = request.POST.getlist("publisher[]", None)
    difficulty = request.POST.getlist("difficulty[]", None)
    isTest = request.POST.get("isTest")

    courses = []

    q = Q()
    if school != "all":
        q.add(Q(school=school), q.AND)

    if subject != "all":
        q.add(Q(subject=subject), q.AND)
    if grade:
        q.add(Q(grade__in=grade), q.AND)
    if semester:
        q.add(Q(semester__in=semester), q.AND)
    if publisher:
        q.add(Q(publisher__in=publisher), q.AND)
    if difficulty:
        q.add(Q(difficulty__in=difficulty), q.AND)

    courses = courseDetail.objects.filter(q).values(
        "courseId", "courseTitle", "school", "subject", "price", "thumnail", "deliver"
    )

    courseList = list(courses)

    # print(courseList)
    print("--------------------")

    return courseList


@jwt_login_required
def detailView(request, id):
    context_sample = make_context(request)

    courses = courseDetail.objects.filter(courseId=id).values(
        "courseId",
        "courseTitle",
        "courseSummary",
        "desc",
        "thumnail",
        "year",
        "school",
        "grade",
        "semester",
        "subject",
        "publisher",
        "difficulty",
        "producer",
        "duration",
        "price",
        "deliver",
    )

    detail_context = json.dumps(courses[0], default=str)

    context = {"context": json.dumps(context_sample), "options": detail_context}
    return render(request, "_main/detail.html", context)


@jwt_login_required
def dashboard_view(request):
    dashboard_context = make_context(request)

    context = {"context": json.dumps(dashboard_context)}

    return render(request, "_main/dashboard.html", context)


@jwt_login_required
def stats_view(request):
    stats_context = make_context(request)
    course_id = request.GET.get("course_id")
    if course_id:
        stats_context["course_id"] = course_id
    else:
        stats_context["course_id"] = None

    context = {"context": json.dumps(stats_context)}

    return render(request, "_main/stats.html", context)


@jwt_login_required
def stats_detail_view(request, course_id):
    if not course_id:
        return redirect("stats")
    else:
        stats_context = make_context(request)
        stats_context["courseId"] = course_id

        context = {"context": json.dumps(stats_context)}

        return render(request, "_main/stats_detail.html", context)


def detail_chapter(request):
    courseId = request.POST.get("courseId")
    replaced_id = courseId.replace("-", "")
    print(replaced_id)
    course = get_object_or_404(mCourseN, id=replaced_id)

    return JsonResponse({"data": course.json_data})


@jwt_login_required
def mycourse(request):
    context_sample = make_context(request)
    orders = Order.objects.all().filter(user=request.userId)

    context = {"context": json.dumps(context_sample), "orders": orders}
    return render(request, "_main/mycourse.html", context)
