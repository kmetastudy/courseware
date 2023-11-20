import json

from django.shortcuts import render
from django.http import JsonResponse

from _cm.models import courseDetail
from _user.decorators import jwt_login_required
from _user.utils import make_context

# Create your views here.


@jwt_login_required
def index(request):
    context = {'user': 'mega'}
    context_sample = make_context(request)
    context_dumped = {"context": json.dumps(context_sample)}
    return render(request, "_main/_main.html", context_dumped)


def getSubject(request, school, subject):
    schoolOption = {'element': '초등', 'middle': '중등',
                    'midhigh': '예비고1', 'high': '고등', 'high2': '수능'}
    subjectOption = {
        'element': ['국어', '영어', '수학', '사회', '과학', '도덕'],
        'middle': ['국어', '영어', '수학', '사회', '역사', '과학', '정보', '도덕'],
        'midhigh': ['국어', '영어', '수학', '과학'],
        'high': ['국어', '영어', '수학', '사회', '역사', '과학', '정보', '도덕'],
        'high2': ['6모', '9모',]
    }

    courses = []

    if (subject == 'all'):
        courses = courseDetail.objects.filter(school=school).values()
    else:
        courses = courseDetail.objects.filter(
            school=school, subject=subject).values()

    print(courses)

    main_context = {'school': school,
               'schoolKor': schoolOption[school],
               'subject': subject,
               'subject_list': subjectOption[school]}
    context = {'context':json.dumps(main_context)}
    print(context)
    return render(request, "_main/_main.html", context)


def getDetail(request, school, subject, id):
    context = {'school': school,
               'subject': subject}

    return render(request, "_main/detail.html", context)
