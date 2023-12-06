import json

from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password, check_password
from django.views import View

from .utils import make_fake_context
from .decorators import last_visited
from .utils import JWTGenerator
from .models import mUser
from .constants import *

# Create your views here.


@last_visited
def index(request):
    fake_context = make_fake_context(request)
    # fake_context['returnUrl'] = request.next
    fake_context['returnUrl'] = request.GET.get("next")
    context_dumped = {'context': json.dumps(fake_context)}
    return render(request, "_user/_user.html", context_dumped)

# 로그인 화면


def index_signup(request):
    context = {
        'isLogin': False,
        'isSignup': True,
    }
    context_dumped = {'context': json.dumps(context)}
    return render(request, "_user/_user.html", context_dumped)


def login(request):
    print('login?')
    context = {
        'isLogin': True,
        'isSignup': False,
    }
    context_dumped = {'context': json.dumps(context)}
    return render(request, "_user/login.html", context_dumped)


class LoginView(View):
    token_generator = JWTGenerator()

    @staticmethod
    def check_user_existence(email):
        user = mUser
        try:
            return user.objects.get(email=email)
        except user.DoesNotExist:
            return None

    def post(self, request):
        result = {
            "success": False
        }

        email = request.POST.get('email')
        password = request.POST.get('password')

        user = self.check_user_existence(email)

        if user == None:
            return JsonResponse({'message': 'Invalid email', 'result': result})
        if check_password(password, user.password) == False:
            return JsonResponse({'message': 'Invalid email', 'result': result})

        next_url = request.session.get('next', '/')
        result['next_url'] = next_url
        result['success'] = True

        refresh_token = self.token_generator.generate_token(
            'refresh',
            user=str(user.id),
            type=int(user.type),
            name=str(user.nickname))

        response = JsonResponse(
            {'message': 'login success', 'result': result})
        response.set_cookie('refresh_token', refresh_token,
                            httponly=True, samesite='Strict')
        return response


class SignUpView(View):
    token_generator = JWTGenerator()

    def user_exists(self, email, otherfield=None):
        return mUser.objects.ƒilter(email == email).exists()

    def post(self, request):
        result = {"success": False}

        email = request.POST.get("email")
        password = request.POST.get("password")
        nickname = request.POST.get('nickname')

        if email is None or password is None or nickname is None:
            return JsonResponse({"message": "값이 빠졌습니다.", "result": result})

        if mUser.objects.filter(email=email).exists() == True:
            return JsonResponse({"message": "이미 사용중인 아이디입니다", "result": result})

        user = mUser.objects.create(
            email=email,
            password=make_password(password),
            nickname=nickname,
            type=64  # TODO : 임시로 default값 지정해줬으니, 추후에 변경하자
        )

        next_url = request.session.get('next', '/')
        result['next_url'] = next_url
        result['success'] = True

        refresh_token = self.token_generator.generate_token(
            'refresh',
            id=str(user.id),
            type=int(user.type),
            name=str(user.nickname))

        response = JsonResponse(
            {'message': 'login success', 'result': result})
        response.set_cookie('refresh_token', refresh_token,
                            httponly=True, samesite='Strict')
        return response

# jwt token payload
# 1. refesh
# {'id': str(mUser.id)}
# 2. access
# {'id': str(mUser.id), 'type': mUser.type, 'nickname': mUser.nickname}


def logout(request):
    next_url = request.META.get('HTTP_REFERER')

    response = redirect(next_url)
    response.delete_cookie("refresh_token")

    return response
