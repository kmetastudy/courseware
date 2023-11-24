from django.shortcuts import render
from django.http import JsonResponse
from _cm.models import courseDetail

from _cp.nmodels import mCourseN, mElementN

# Create your views here.
def index(request):
    context = {'user':'mega'}
    return render(request, "_cm/_cm.html", context)

def getCourseBook(request):
    res = []
    books = mCourseN.objects.using("old").filter(type=2)
    for book in books:
        courseId = book.id
        title = book.title

        res.append({"id":courseId, "title":title})
    return JsonResponse({"book": res})

def getDetail(request):
    courseId = request.POST.get('courseId')
    course = courseDetail.objects.using("courseware").filter(courseId=courseId).values().first()

    print(course)
    
    return JsonResponse({"data": course})


def setDetail(request):
    # grade 1:1학년 2:2학년 3:3학년
    # semester 0:전학기 1:1학기 2:2학기
    # difficulty 1:하 2:중 3:상
    print(request.POST)
    year = request.POST.get('year')
    school = request.POST.get('school')
    grade = request.POST.get('grade')
    semester = request.POST.get('semester')
    subject = request.POST.get('subject')
    publisher = request.POST.get('publisher')
    difficulty = request.POST.get('difficulty')
    duration = request.POST.get('duration')
    price = request.POST.get('price')

    courseId = request.POST.get('courseId')
    courseTitle = request.POST.get('courseTitle')
    courseSummary = request.POST.get('courseSummary')
    desc = request.POST.get('desc')

    detail = courseDetail(year=year, school=school, grade=grade, semester=semester, subject=subject,
                                  publisher=publisher, difficulty=difficulty, duration=duration, price=price,
                                  courseId=courseId, courseTitle=courseTitle, courseSummary=courseSummary, desc=desc)
    detail.save(using="courseware")

    
    return JsonResponse({'message':'good'})
