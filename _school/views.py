import json
from django.shortcuts import redirect, render
from _cm.models import courseDetail
from _main.serializers import CourseDetailSerializer
from _school.models import mSchool, mSchoolCourse, mSchoolNotice, mSchoolSection
from _school.serializers import (
    NoticeSerializer,
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

    school = mSchool.objects.filter(id=school_id)[0]
    school_data = SchoolSerializer(school).data
    school_name = school_data["title"]
    school_logo = school_data["img_logo"]
    school_banner = school_data["img_banner"]

    notice = mSchoolNotice.objects.filter(id_school=school_id)
    notice_data = NoticeSerializer(notice, many=True).data
    print(notice_data)

    school_sections = mSchoolSection.objects.filter(id_school=school_id, active=True)

    sections = SectionSerializer(school_sections, many=True).data

    context = {
        "context": json.dumps(context_sample),
        "sectionCourses": json.dumps(sections),
        "schoolId": school_id,
        "schoolName": json.dumps(school_name),
        "schoolLogo": school_logo,
        "schoolBanner": school_banner,
        "notices": notice_data,
    }

    return render(request, "_school/school_landing.html", context)


@jwt_login_required
def school_detailView(request, school_id, school, subject, id):
    context_sample = make_context(request)

    school = mSchool.objects.filter(id=school_id)[0]
    school_logo = SchoolSerializer(school).data["img_logo"]

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

    detail_context = json.dumps(list(courses), default=str)

    context = {
        "context": json.dumps(context_sample),
        "options": detail_context,
        "schoolId": school_id,
        "schoolLogo": school_logo,
    }
    return render(request, "_main/school_detail.html", context)


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
    school_logo = SchoolSerializer(school).data["img_logo"]

    print("st_context: ", st_context)
    context = {
        "context": json.dumps(st_context),
        "schoolLogo": school_logo,
        "schoolId": school_id,
    }
    return render(request, "_st/_st_school.html", context)
