from typing import Any
import json
import jwt
import datetime
from decouple import config

from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password, check_password
from django.views import View

from .utils import jwt_required
from .models import mUser
from .constants import *

# Create your views here.


@jwt_required
def index(request):
    return render(request, "_user/_user.html")


def index_test(request):
    return render(request, "_user/test.html")

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
    def __init__(self, **kwargs: Any) -> None:

        super().__init__(**kwargs)
        self.type_map = {
            0: 'initial',
            1: 'success',
            2: 'invalid username',
            3: 'invalid password',
        }
        self.type = 0

    @staticmethod
    def issue_access_token(payload):
        return jwt.encode(payload, 'your_secret', algorithm='HS256')

    @staticmethod
    def issue_refresh_token(payload):
        return jwt.encode(payload, 'your_refresh_secret', algorithm='HS256')

    @staticmethod
    def check_user_existence(username):
        user = mUser
        try:
            return user.objects.get(username=username)
        except user.DoesNotExist:
            return None

    @staticmethod
    def generate_exp(token_type):
        if token_type == 'access':
            return datetime.datetime.utcnow() + datetime.timedelta(weeks=2)
        elif token_type == 'refresh':
            return datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        else:
            raise Exception("invalid token type")

    def create_payload(self, query, token_type):
        payload = {
            "exp": self.generate_exp(token_type)
        }
        if token_type == "access":
            payload["id"] = query.username,
            payload["type"] = query.type,
            payload["full_name"] = query.full_name,
        return payload

    def post(self, request):
        username = request.POST.get('username')
        password = request.POST.get('password')

        error_message = ""
        error_type = 0  # error type말고 합쳐서 type?
        print("id: ", username, "pw: ", password)
        user = self.check_user_existence(username)

        if user == None:
            error_message = "Invalid username"

        if user and check_password(password, user.password):
            access_token = self.issue_access_token(
                self.create_payload(user, 'access'))
            refresh_token = self.issue_refresh_token(
                self.create_payload(user, 'refresh'))

            response = JsonResponse({'access_token': access_token})
            response.set_cookie('refresh_token', refresh_token, httponly=True)
            return response

        else:
            error_message = "Invalid Password"
            print(error_message)
            return JsonResponse({'message': f'{error_message}', 'error': 'Invalid Credentials'}, status=401)


class SignUpView(View):
    def post(self, request):
        # username = request.POST.get("username")
        # password = request.POST.get("password")
        # print(f'username: {username} password: {password}')
        # if username is None or password is None:
        #     return JsonResponse({"message": "아이디와 비밀번호는 필수입니다."})
        # if mUser.objects.filter(username=username).exists():
        #     return JsonResponse({"message": "이미 사용중인 아이디입니다"})

        # # 일단 간단히, id랑 pw만 저장한다 해볼까?
        # mUser.objects.create(
        #     username=username, password=make_password(password))

        # # 추후에 바로 토큰을 발행해줄 수도 있다.
        # # user = mUser.objects.filter(username=username)[0]

        return redirect('_user:login-page')
