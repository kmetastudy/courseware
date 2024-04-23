import json
import uuid

from django.shortcuts import render
from django.http import JsonResponse
from _cm.models import courseDetail

from _cp.nmodels import mCourseN, mElementN

# Create your views here.


def index(request):
    context = {"user": "mega"}
    return render(request, "_cm/_cm.html", context)


def course_import(request):

    json_data = request.FILES["file"].read()

    course_info = json.loads(json_data)
    # print(course_info)

    if "course" in course_info:
        # print(course_info["course"])
        # _set_batch_progress(process_id,100)
        # return JsonResponse({"message": "v2cp_import_course_file_v7", "result":result},status=200)

        course_id = course_info["course"]["_id"]
        course_title = course_info["course"]["_title"]
        course_type = course_info["course"]["_type"]
        course_cdate = course_info["course"]["_cdate"]
        course_udate = course_info["course"]["_udate"]
        course_year = course_info["course"]["_year"]
        course_contents = course_info["course"]["contents"]
        # units types [1,2] -> ["q", "v"]
        for branch in course_contents:
            if "units" in branch:
                branch_units = branch["units"]
                for unit in branch_units:
                    unit["types"] = ["v" if x == 2 else "q" for x in unit["types"]]

        id_course = uuid.UUID(course_id)

        courses = mCourseN.objects.filter(id=id_course)

        if len(courses) == 1:
            courses[0].json_data = json.dumps(course_info["course"], ensure_ascii=False)
            courses[0].save()
            print("course 업데이트 완료")
        elif len(courses) == 0:
            mCourseN.objects.create(
                id=id_course,
                type=course_type,
                title=course_title,
                year=course_year,
                json_data=json.dumps(course_info["course"], ensure_ascii=False),
            )
            print("course 추가 완료")

    if "elements" in course_info:
        size = len(course_info["elements"])
        if size != 0:
            index = 0
            percent = int(index * 90 / size)
            for element in course_info["elements"]:
                index += 1
                element_id = element["_id"]
                element_type = element["_type"]
                element_cdate = element["_cdate"]
                element_udate = element["_udate"]
                element_json = element["_json_data"]
                id_element = None
                try:
                    id_element = uuid.UUID(element_id)
                except ValueError:
                    continue

                elements = mElementN.objects.filter(id=id_element)
                if len(elements) == 1:
                    elements[0].json_data = element_json
                    elements[0].save()
                    print("element 업데이트 완료")
                    pass
                elif len(elements) == 0:
                    mElementN.objects.create(
                        id=id_element, type=element_type, json_data=element_json
                    )
                    print("element 추가 완료")
                    pass
                pass
        pass

    return JsonResponse({"message": "업로드 성공"}, status=200)


def getCourseBook(request):
    res = []
    books = mCourseN.objects.filter(type=2)
    for book in books:
        courseId = book.id
        title = book.title

        res.append({"id": courseId, "title": title})
    return JsonResponse({"book": res})


def getDetail(request):
    courseId = request.POST.get("courseId")
    course = courseDetail.objects.filter(courseId=courseId).values().first()

    print(course)

    return JsonResponse({"data": course})


def setDetail(request):
    # school E:초등 M:중등 H:고등
    # grade 0:공통 1:1학년 2:2학년 3:3학년
    # semester 0:전학기 1:1학기 2:2학기
    # subject kor,eng,math,soc,sci,info,korhist
    # publisher 비상,능률,씨마스,천재,미래엔
    # difficulty 0:하 1:중 2:상
    # isTest True:형성평가 False:코스
    # producer
    # duration 0:무제한, 값
    # price 0:무료, 값
    print(request.POST)

    year = request.POST.get("year")
    school = request.POST.get("school")
    grade = request.POST.get("grade")
    semester = request.POST.get("semester")
    subject = request.POST.get("subject")
    publisher = request.POST.get("publisher")
    difficulty = request.POST.get("difficulty")
    isTest = False
    if request.POST.get("isTest"):
        isTest = request.POST.get("isTest")
    duration = request.POST.get("duration")
    price = request.POST.get("price")
    producer = request.POST.get("producer")

    thumnail = request.POST.get("thumnail")
    courseId = request.POST.get("courseId")
    courseTitle = request.POST.get("courseTitle")
    courseSummary = request.POST.get("courseSummary")
    desc = request.POST.get("content")

    course = courseDetail.objects.filter(courseId=courseId)
    if course:
        course.update(
            year=year,
            school=school,
            grade=grade,
            semester=semester,
            subject=subject,
            publisher=publisher,
            difficulty=difficulty,
            isTest=isTest,
            duration=duration,
            price=price,
            producer=producer,
            thumnail=thumnail,
            courseId=courseId,
            courseTitle=courseTitle,
            courseSummary=courseSummary,
            desc=desc,
        )
    else:
        detail = courseDetail(
            year=year,
            school=school,
            grade=grade,
            semester=semester,
            subject=subject,
            publisher=publisher,
            difficulty=difficulty,
            isTest=isTest,
            duration=duration,
            price=price,
            producer=producer,
            thumnail=thumnail,
            courseId=courseId,
            courseTitle=courseTitle,
            courseSummary=courseSummary,
            desc=desc,
        )
        detail.save()

    return JsonResponse({"message": "good"})


def get_detail_list(request):
    try:
        course_ids = request.POST.get("course_ids")
        if course_ids:
            course_ids = json.loads(course_ids)
        queryset = courseDetail.objects.filter(courseId__in=course_ids).values()

        data = list(queryset)
        return JsonResponse({"message": "success", "data": data})
    except Exception as e:
        return JsonResponse({"message": "Fail: get_detail_list"}, status=404)
