import json

from django.shortcuts import render
from django.http import JsonResponse
from _cm.models import courseDetail

from _cp.nmodels import mCourseN, mElementN

# Create your views here.


def index(request):
    context = {'user': 'mega'}
    return render(request, "_cm/_cm.html", context)


def getCourseBook(request):
    res = []
    books = mCourseN.objects.filter(type=2)
    for book in books:
        courseId = book.id
        title = book.title

        res.append({"id": courseId, "title": title})
    return JsonResponse({"book": res})


def getDetail(request):
    courseId = request.POST.get('courseId')
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

    year = request.POST.get('year')
    school = request.POST.get('school')
    grade = request.POST.get('grade')
    semester = request.POST.get('semester')
    subject = request.POST.get('subject')
    publisher = request.POST.get('publisher')
    difficulty = request.POST.get('difficulty')
    isTest = False
    if request.POST.get('isTest'):
        isTest = request.POST.get('isTest')
    duration = request.POST.get('duration')
    price = request.POST.get('price')
    producer = request.POST.get('producer')

    thumnail = request.POST.get('thumnail')
    courseId = request.POST.get('courseId')
    courseTitle = request.POST.get('courseTitle')
    courseSummary = request.POST.get('courseSummary')
    desc = request.POST.get('content')

    course = courseDetail.objects.filter(courseId=courseId)
    if (course):
        course.update(year=year, school=school, grade=grade, semester=semester, subject=subject,
                      publisher=publisher, difficulty=difficulty, isTest=isTest, duration=duration, price=price, producer=producer,
                      thumnail=thumnail, courseId=courseId, courseTitle=courseTitle, courseSummary=courseSummary, desc=desc)
    else:
        detail = courseDetail(year=year, school=school, grade=grade, semester=semester, subject=subject,
                              publisher=publisher, difficulty=difficulty, isTest=isTest, duration=duration, price=price, producer=producer,
                              thumnail=thumnail, courseId=courseId, courseTitle=courseTitle, courseSummary=courseSummary, desc=desc)
        detail.save()

    return JsonResponse({'message': 'good'})


def get_detail_list(request):
    try:
        course_ids = request.POST.get("course_ids")
        if course_ids:
            course_ids = json.loads(course_ids)
        queryset = courseDetail.objects.filter(
            courseId__in=course_ids).values()

        data = list(queryset)
        return JsonResponse({"message": "success", "data": data})
    except Exception as e:
        return JsonResponse({"message": "Fail: get_detail_list"}, status=404)
