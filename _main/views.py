import json
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect, render
from django.http import JsonResponse
from django.urls import reverse

from decouple import config

from _cm.models import courseDetail
from _main.forms import PaymentForm
from _main.models import Payment
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
    schoolOption2 = {'element': 'E', 'middle': 'M',
                    'midhigh': 'MH', 'high': 'H', 'high2': 'HH'}
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
        courses = getCourses(request, schoolOption2[school], subject)

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
        
        courses = getCourses(request, schoolOption2[school], subject)

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

    courses = courseDetail.objects.using("courseware").filter(q).values('courseId', 'courseTitle', 'subject', 'price', 'thumnail')

    courseList = json.dumps(list(courses))

    print(courseList)
    print('--------------------')


    return courseList

@jwt_login_required
def detailView(request, school, subject, id):
    context_sample = make_context(request)
    
    courses = courseDetail.objects.using("courseware").filter(courseId=id).values(
        'courseId','courseTitle', 'courseSummary', 'desc', 'thumnail',
        'year', 'school', 'grade', 'semester', 'subject', 'publisher', 'difficulty',
        'producer', 'duration', 'price')

    detail_context = json.dumps(list(courses))

    context = {"context": json.dumps(context_sample),
               "options": detail_context}
    return render(request, "_main/detail.html", context)



@jwt_login_required
def payment_new(request):
    context_sample = make_context(request)

    if request.method == "POST":
        form = PaymentForm(request.POST)
        if form.is_valid():
            payment = form.save()
            return redirect('_main:payment_pay', pk=payment.pk)
    else:
        form = PaymentForm()

    context = {
            "context": json.dumps(context_sample),
            "form": form
            }
    return render(request, "_main/payment_form.html", context)

@jwt_login_required
def payment_pay(request, pk):
    context_sample = make_context(request)

    payment = get_object_or_404(Payment, pk=pk)
    payment_props = {
        "merchant_uid": payment.merchant_uid,
        "name": payment.name,
        "amount": payment.amount,
    }

    payment_check_url = reverse('_main:payment_check', args=[payment.pk])

    context = {
            "context": json.dumps(context_sample),
            "payment_check_url": payment_check_url,
            "payment_props": payment_props
            }

    return render(request, "_main/payment_pay.html",context)

@jwt_login_required
def payment_check(request, pk):
    payment = get_object_or_404(Payment, pk=pk)
    return None