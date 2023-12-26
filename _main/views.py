import json
from django.db.models import Q
from django.forms import modelformset_factory
from django.shortcuts import get_object_or_404, redirect, render
from django.http import HttpResponse, JsonResponse
from django.urls import reverse

from decouple import config

from _cm.models import courseDetail
from _cp.nmodels import mCourseN
from _main.forms import CartCourseForm, PaymentForm
from _main.models import CartBill, CartCourse, Order, OrderPayment, OrderedProduct, Payment
from _user.decorators import jwt_login_required
from _user.models import mUser
from _user.utils import make_context

# Create your views here.


@jwt_login_required
def index(request):
    context_sample = make_context(request)
    courses = getCourses(request, 'all', 'all')

    context = {"context": json.dumps(context_sample),
               "courses": courses}
    return render(request, "_main/landing.html", context)


@jwt_login_required
def descView(request, page):
    context_sample = make_context(request)

    context = {"context": json.dumps(context_sample)}
    pageName = '_main/landing'+page+'.html'

    return render(request, pageName, context)


@jwt_login_required
def mainView(request, school, subject):
    schoolOption = {'element': '초등', 'middle': '중등',
                    'midhigh': '예비고1', 'high': '고등', 'high2': '수능'}
    schoolOption2 = {'element': 'E', 'middle': 'M',
                     'midhigh': 'MH', 'high': 'H', 'high2': 'HH'}
    subjectOption = {
        'element': [
            {'kor': '국어', 'eng': 'kor'},
            {'kor': '영어', 'eng': 'eng'},
            {'kor': '수학', 'eng': 'math'},
            {'kor': '사회', 'eng': 'soc'},
            {'kor': '과학', 'eng': 'sci'},
            {'kor': '도덕', 'eng': 'mor'}],
        'middle': [
            {'kor': '국어', 'eng': 'kor'},
            {'kor': '영어', 'eng': 'eng'},
            {'kor': '수학', 'eng': 'math'},
            {'kor': '사회', 'eng': 'soc'},
            {'kor': '역사', 'eng': 'hist'},
            {'kor': '과학', 'eng': 'sci'},
            {'kor': '정보', 'eng': 'info'},
            {'kor': '도덕', 'eng': 'mor'}],
        'midhigh': [
            {'kor': '국어', 'eng': 'kor'},
            {'kor': '영어', 'eng': 'eng'},
            {'kor': '수학', 'eng': 'math'},
            {'kor': '과학', 'eng': 'sci'}],
        'high': [
            {'kor': '국어', 'eng': 'kor'},
            {'kor': '영어', 'eng': 'eng'},
            {'kor': '수학', 'eng': 'math'},
            {'kor': '사회', 'eng': 'soc'},
            {'kor': '한국사', 'eng': 'korhist'},
            {'kor': '과학', 'eng': 'sci'},
            {'kor': '정보', 'eng': 'info'},
            {'kor': '도덕', 'eng': 'mor'}],
        'high2': [
            {'kor': '6모', 'eng': 'june'},
            {'kor': '9모', 'eng': 'september'}]
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

        return JsonResponse({"message": subject, "courses": courses})


def getCourses(request, school, subject):
    grade = request.POST.getlist('grade[]', None)
    semester = request.POST.getlist('semester[]', None)
    difficulty = request.POST.getlist('difficulty[]', None)
    isTest = request.POST.get('isTest')

    courses = []

    q = Q()
    if (school != 'all'):
        q.add(Q(school=school), q.AND)

    if (subject != 'all'):
        q.add(Q(subject=subject), q.AND)
    if grade:
        q.add(Q(grade__in=grade), q.AND)
    if semester:
        q.add(Q(semester__in=semester), q.AND)
    if difficulty:
        q.add(Q(difficulty__in=difficulty), q.AND)

    courses = courseDetail.objects.filter(q).values(
        'courseId', 'courseTitle', 'school', 'subject', 'price', 'thumnail')

    courseList = json.dumps(list(courses))

    print(courseList)
    print('--------------------')

    return courseList


@jwt_login_required
def detailView(request, school, subject, id):
    context_sample = make_context(request)

    courses = courseDetail.objects.filter(courseId=id).values(
        'courseId', 'courseTitle', 'courseSummary', 'desc', 'thumnail',
        'year', 'school', 'grade', 'semester', 'subject', 'publisher', 'difficulty',
        'producer', 'duration', 'price')

    detail_context = json.dumps(list(courses))

    context = {"context": json.dumps(context_sample),
               "options": detail_context}
    return render(request, "_main/detail.html", context)


@jwt_login_required
def dashboard_view(request):
    dashboard_context = make_context(request)

    context = {'context': json.dumps(dashboard_context)}

    return render(request, "_main/dashboard.html", context)


@jwt_login_required
def stats_view(request):
    stats_context = make_context(request)
    course_id = request.GET.get("course_id")
    if course_id:
        stats_context['course_id'] = course_id
    else:
        stats_context['course_id'] = None

    context = {'context': json.dumps(stats_context)}

    return render(request, "_main/stats.html", context)


def detail_chapter(request):
    courseId = request.POST.get('courseId')
    replaced_id = courseId.replace('-', '')
    print(replaced_id)
    course = get_object_or_404(mCourseN, id=replaced_id)

    return JsonResponse({"data": course.json_data})


# 장바구니 관련
@jwt_login_required
def cart_detail(request):
    context_sample = make_context(request)
    user = get_object_or_404(mUser, id=request.userId)
    cart_course_qs = CartCourse.objects.filter(
        user=request.userId).select_related("course")

    CartCourseFormSet = modelformset_factory(
        model=CartCourse,
        form=CartCourseForm,
        extra=0,
        can_delete=True,
    )

    if request.method == "POST":
        formset = CartCourseFormSet(
            data=request.POST,
            queryset=cart_course_qs,
        )

        if formset.is_valid():
            formset.save()
            return redirect("_main:cart_detail")
    else:
        formset = CartCourseFormSet(
            queryset=cart_course_qs
        )

    bill = CartBill.create_from_cart(request.userId, cart_course_qs)

    context = {
        "context": json.dumps(context_sample),
        "formset": formset,
        "user": user,
        "bill": bill
    }
    return render(request, "_main/cart_detail.html", context)


@jwt_login_required
def add_to_cart(request, course_pk):

    course_qs = courseDetail.objects.all()
    course = get_object_or_404(course_qs, courseId=course_pk)

    cart_course, is_created = CartCourse.objects.get_or_create(
        user=get_object_or_404(mUser, id=request.userId),
        course=course
    )

    return HttpResponse("Ok")


@jwt_login_required
def order_list(request):
    context_sample = make_context(request)
    order_qs = Order.objects.all().filter(user=request.userId)

    context = {
        "context": json.dumps(context_sample),
        "order_list": order_qs
    }
    return render(request, "_main/order_list.html", context)


@jwt_login_required
def order_new(request):
    cart_product_qs = CartCourse.objects.filter(user=request.userId)

    order = Order.create_from_cart(request.userId, cart_product_qs)
    cart_product_qs.delete()

    return redirect("_main:order_pay", order.pk)


@jwt_login_required
def order_pay(request, pk):
    context_sample = make_context(request)
    order = get_object_or_404(Order, pk=pk, user=request.userId)

    if not order.can_pay():
        return redirect("order_detail", order.pk)  # TODO: order_detail 구현

    payment = OrderPayment.create_by_order(order)

    payment_props = {
        "merchant_uid": payment.merchant_uid,
        "name": payment.name,
        "amount": payment.desired_amount,
        "buyer_name": 'yun',  # user 연결
        "buyer_email": payment.buyer_email
    }

    context = {
        "context": json.dumps(context_sample),
        "portone_shop_id": config("PORTONE_SHOP_ID"),
        "payment_props": payment_props,
        "next_url": reverse("_main:order_check", args=[order.pk, payment.pk])
    }
    return render(request, "_main/order_pay.html", context)


@jwt_login_required
def order_check(request, order_pk, payment_pk):
    payment = get_object_or_404(
        OrderPayment, pk=payment_pk, order__pk=order_pk)
    payment.update()
    # return redirect("_main:order_detail", order_pk)
    # return redirect("_main:order_list")
    return redirect("_main:mycourse")


@jwt_login_required
def order_detail(request, pk):
    context_sample = make_context(request)
    order = get_object_or_404(Order, pk=pk, user=request.userId)

    context = {
        "context": json.dumps(context_sample),
        "order": order
    }
    return render(request, "_main/order_detail.html", context)


@jwt_login_required
def mycourse(request):
    context_sample = make_context(request)
    orders = Order.objects.all().filter(user=request.userId)

    context = {
        "context": json.dumps(context_sample),
        "orders": orders
    }
    return render(request, "_main/mycourse.html", context)

# 결제 관련


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
    portone_shop_id = config("PORTONE_SHOP_ID")

    context = {
        "context": json.dumps(context_sample),
        "portone_shop_id": portone_shop_id,
        "payment_check_url": payment_check_url,
        "payment_props": payment_props
    }

    return render(request, "_main/payment_pay.html", context)


@jwt_login_required
def payment_check(request, pk):
    payment = get_object_or_404(Payment, pk=pk)
    payment.portone_check()
    return redirect('_main:payment_detail', pk=pk)


@jwt_login_required
def payment_detail(request, pk):
    context_sample = make_context(request)
    payment = get_object_or_404(Payment, pk=pk)

    context = {
        "context": json.dumps(context_sample),
        "payment": payment
    }

    return render(request, "_main/payment_detail.html", context)
