import json
from django.shortcuts import redirect, render
from _cm.models import FAQ, Banner, Notice, courseDetail
from _cm.serializers import CourseDetailSerializer, NoticeSerializer, FAQSerializer
from _school.models import mSchool, mSchoolCourse, mSchoolNotice, mSchoolSection
from _school.serializers import (
    SchoolSerializer,
    SectionSerializer,
    CourseSerializer,
)
from _st.utils import has_course_permission
from _user.decorators import jwt_login_required
from _user.utils import make_context


# Create your views here.
@jwt_login_required
def index(request):
    if request.method == "GET":
        school_list = []
        school_all = mSchool.objects.values()

        for school in school_all:
            school_list.append(SchoolSerializer(school).data)

        context = {"school_list": school_list}
    return render(request, "_school/schoolList.html", context)


@jwt_login_required
def school_page(request, school_id):
    context_sample = make_context(request)

    banners = Banner.objects.all()

    school = mSchool.objects.filter(id=school_id)[0]
    school_data = SchoolSerializer(school).data
    school_notices = school_data["notice"]

    notice_queryset = Notice.objects.all()
    notices = NoticeSerializer(notice_queryset, many=True).data

    faq_queryset = FAQ.objects.all()
    faqs = FAQSerializer(faq_queryset, many=True).data

    school_section_queryset = mSchoolSection.objects.filter(
        id_school=school_id, active=True
    ).order_by("sequence")

    school_sections = SectionSerializer(school_section_queryset, many=True).data

    print(school_data)

    context = {
        "context": json.dumps(context_sample),
        "banners": banners,
        "school_data": school_data,  # json.dumps 안하고 보내야 .으로 참조가능 -> 시리얼라이즈 했으니까
        "school_sections": json.dumps(school_sections),
        "school_notices": school_notices[:7],
        "notices": notices[:7],
        "faqs": faqs[:7],
    }

    return render(request, "_school/school_landing.html", context)


@jwt_login_required
def school_detailView(request, school_id, id):
    context_sample = make_context(request)

    school = mSchool.objects.filter(id=school_id)[0]
    school_data = SchoolSerializer(school).data

    try:
        course = mSchoolCourse.objects.filter(id=id)[0]

    except:
        origin_course = courseDetail.objects.filter(courseId=id)[0]
        course = mSchoolCourse.objects.filter(course=origin_course)[0]

    course_data = CourseSerializer(course).data
    modified_course = course_data["course"]
    print(json.dumps(modified_course))
    # detail_context = json.dumps(list(courses), default=str)

    context = {
        "context": json.dumps(context_sample),
        "options": json.dumps(modified_course, default=str),
        "school_data": school_data,
    }
    return render(request, "_school/school_detail.html", context)


@jwt_login_required
def basic_detailView(request, school_id, id):
    context_sample = make_context(request)

    school = mSchool.objects.filter(id=school_id)[0]
    school_data = SchoolSerializer(school).data

    try:
        course = mSchoolCourse.objects.filter(id=id)[0]

    except:
        origin_course = courseDetail.objects.filter(courseId=id)[0]
        course = mSchoolCourse.objects.filter(course=origin_course)[0]

    course_data = CourseSerializer(course).data
    modified_course = course_data["course"]
    print(json.dumps(modified_course))
    # detail_context = json.dumps(list(courses), default=str)

    context = {
        "context": json.dumps(context_sample),
        "options": json.dumps(modified_course, default=str),
        "school_data": school_data,
    }
    return render(request, "_school/basic_detail.html", context)


@jwt_login_required
def school_st(request, school_id):
    course_id = request.GET.get("course_id")
    content_id = request.GET.get("content_id")
    user_id = request.userId

    # remove after test
    if not course_id:
        next_url = request.session.get("next", "/")
        del request.session["next"]

        return redirect(next_url)

    request.demo = True
    if has_course_permission(course_id, user_id):
        request.demo = False

    st_context = make_context(request)
    st_context["courseId"] = course_id
    st_context["contentId"] = content_id

    school = mSchool.objects.filter(id=school_id)[0]
    school_data = SchoolSerializer(school).data

    print("st_context: ", st_context)
    context = {
        "context": json.dumps(st_context),
        "school_data": school_data,
        "schoolId": school_id,
    }
    return render(request, "_st/_st_school.html", context)


@jwt_login_required
def basic_landing(request, school_id):
    context_sample = make_context(request)

    school = mSchool.objects.filter(id=school_id)[0]
    school_data = SchoolSerializer(school).data
    school_name = school_data["title"]
    school_logo = school_data["img_logo"]
    school_banner = school_data["img_banner"]
    school_notice = school_data["notice"]

    school_sections = mSchoolSection.objects.filter(
        id_school=school_id, active=True
    ).order_by("sequence")

    sections = SectionSerializer(school_sections, many=True).data

    bannerBG = ""
    if school_id == "8f554e40-6aaf-4730-88c7-5a7bd9ed9b2c":
        bannerBG = "basic_element"
    elif school_id == "cbb29b29-9f01-4024-9aac-15e382e3edb2":
        bannerBG = "basic_middle"
    else:
        bannerBG = "basic_high"

    context = {
        "context": json.dumps(context_sample),
        "sectionCourses": json.dumps(sections),
        "schoolId": school_id,
        "schoolName": school_name,
        "schoolLogo": school_logo,
        "schoolBanner": school_banner,
        "bannerBG": bannerBG,
    }

    return render(request, "_school/landing_basic.html", context)
