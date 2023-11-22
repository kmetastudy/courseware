import json
from django.db.models import Q
from django.shortcuts import render
from django.http import JsonResponse

from _cm.models import courseDetail
from _user.decorators import jwt_login_required
from _user.utils import make_context

# Create your views here.


@jwt_login_required
def index(request):
    context_sample = make_context(request)
    context_dumped = {"context": json.dumps(context_sample)}
    return render(request, "_main/_main.html", context_dumped)

@jwt_login_required
def mainView(request, school, subject):
    schoolOption = {'element': '초등', 'middle': '중등',
                    'midhigh': '예비고1', 'high': '고등', 'high2': '수능'}
    subjectOption = {
        'element': [
            { 'kor':'국어', 'eng':'kor' },
            { 'kor':'영어', 'eng':'eng' },
            { 'kor':'수학', 'eng':'math' },
            { 'kor':'사회', 'eng':'soc' },
            { 'kor':'과학', 'eng':'sci' },
            { 'kor':'도덕', 'eng':'mor' } ],
        'middle': [
            { 'kor':'국어', 'eng':'kor' },
            { 'kor':'영어', 'eng':'eng' },
            { 'kor':'수학', 'eng':'math' },
            { 'kor':'사회', 'eng':'soc' },
            { 'kor':'역사', 'eng':'hist' },
            { 'kor':'과학', 'eng':'sci' },
            { 'kor':'정보', 'eng':'info' },
            { 'kor':'도덕', 'eng':'mor' } ],
        'midhigh': [
            { 'kor':'국어', 'eng':'kor' },
            { 'kor':'영어', 'eng':'eng' },
            { 'kor':'수학', 'eng':'math' },
            { 'kor':'과학', 'eng':'sci' } ],
        'high': [
            { 'kor':'국어', 'eng':'kor' },
            { 'kor':'영어', 'eng':'eng' },
            { 'kor':'수학', 'eng':'math' },
            { 'kor':'사회', 'eng':'soc' },
            { 'kor':'한국사', 'eng':'korhist' },
            { 'kor':'과학', 'eng':'sci' },
            { 'kor':'정보', 'eng':'info' },
            { 'kor':'도덕', 'eng':'mor' } ],
        'high2': [
            { 'kor':'6모', 'eng':'june'},
            { 'kor':'9모', 'eng':'september'} ]
    }
    print(request.method)
    if (subject == 'all' and request.method == 'GET'):
        courses = getCourses(request, school, subject)

        context_sample = make_context(request)
        main_context = {"school": school,
                "schoolKor": schoolOption[school],
                "subject": subject,
                "subject_list": subjectOption[school]}
        
        
        context = {"context": json.dumps(context_sample),
                "options": json.dumps(main_context),
                "courses": courses}
        
        print(context)
        return render(request, "_main/course.html", context)
    
    else:
        
        courses = getCourses(request, school, subject)

        return JsonResponse({"message":subject, "courses":courses})


def getCourses(request, school, subject):
    grade = request.POST.getlist('grade[]', None)
    semester = request.POST.getlist('semester[]', None)
    difficulty = request.POST.getlist('difficulty[]', None)
    isTest = request.POST.get('isTest')

    courses = []

    q = Q()
    q.add(Q(school=school), q.AND)
    
    if (subject != 'all'):
        q.add(Q(subject=subject), q.AND)
    if grade:
        q.add(Q(grade__in=grade), q.AND)
    if semester:
        q.add(Q(semester__in=semester), q.AND)
    if difficulty:
        q.add(Q(difficulty__in=difficulty), q.AND)

    courses = courseDetail.objects.filter(q).values('courseId', 'courseTitle', 'cost')

    courseList = json.dumps(list(courses))

    print(courseList)
    print('--------------------')


    return courseList


def getDetail(request, school, subject, id):
    context = {'school': school,
               'subject': subject}

    return render(request, "_main/detail.html", context)
