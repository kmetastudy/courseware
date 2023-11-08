import jwt
import datetime
from decouple import config
from django.views import View

from .constants import *

# 사이트에 접속(main)
# userType을 통해, client에서는 이 사람의 정보를 알 수 있다.
# 예를 들어, 토큰이 있는지, 있다면 어떤 유형(관리자/사용자/anonymous)인지
# 토큰이 없다면, client는 이 사용자를, 특정 페이지(예. 로그인/회원가입)페이지로 보낼 수 있따.
# 그게 아니여도, 그냥 그 상태를 저장해두고, 대신 페이지에 제약을 둘 수 있다.
from functools import wraps
from django.http import JsonResponse
import jwt


def decode_token(token, secret, algorithms):
    try:
        return jwt.decode(token, secret, algorithms=algorithms), None
    except jwt.ExpiredSignatureError:
        return None, 'Token has expired'
    except jwt.InvalidTokenError:
        return None, 'Invalid token'


def issue_new_token(payload, secret, algorithm):
    return jwt.encode(payload, secret, algorithm=algorithm)


def jwt_required(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        access_token = request.POST.get('access_token')

        if not access_token:
            refresh_token = request.COOKIES.get('refresh_token', None)

            if not refresh_token:
                return JsonResponse({'error': 'Authentication required'}, status=401)

            payload, err = decode_token(
                refresh_token, config("JWT_KEY"), ['HS256'])

            if err:
                return JsonResponse({'error': err}, status=401)

            new_payload = {'user_id': payload['user_id']}
            new_access_token = issue_new_token(
                new_payload, config("JWT_KEY"), 'HS256')

            response = func(request, *args, **kwargs)
            response.content = JsonResponse(
                {'access_token': new_access_token}).content
            return response

        payload, err = decode_token(access_token, config("JWT_KEY"), ['HS256'])

        if err:
            return JsonResponse({'error': err}, status=401)

        return func(request, *args, **kwargs)

    return wrapper


def jwt_required_fake(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        access_token = request.POST.get('access_token')

        if not access_token:
            refresh_token = request.COOKIES.get('refresh_token', None)

            if not refresh_token:
                return JsonResponse({'error': 'Authentication required'}, status=401)

            payload, err = decode_token(
                refresh_token, config("JWT_KEY"), ['HS256'])

            if err:
                return JsonResponse({'error': err}, status=401)

            new_payload = {'user_id': payload['user_id']}
            new_access_token = issue_new_token(
                new_payload, config("JWT_KEY"), 'HS256')

            response = func(request, *args, **kwargs)
            response.content = JsonResponse(
                {'access_token': new_access_token}).content
            return response

        payload, err = decode_token(access_token, config("JWT_KEY"), ['HS256'])

        if err:
            return JsonResponse({'error': err}, status=401)

        return func(request, *args, **kwargs)

    return wrapper


def jwt_required_fake(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        access_token = request.POST.get('access_token')

        if not access_token:
            refresh_token = request.COOKIES.get('refresh_token', None)

            if not refresh_token:
                return JsonResponse({'error': 'Authentication required'}, status=401)

            payload, err = decode_token(
                refresh_token, config("JWT_KEY"), ['HS256'])

            if err:
                return JsonResponse({'error': err}, status=401)

            new_payload = {'user_id': payload['user_id']}
            new_access_token = issue_new_token(
                new_payload, config("JWT_KEY"), 'HS256')

            response = func(request, *args, **kwargs)
            response.content = JsonResponse(
                {'access_token': new_access_token}).content
            return response

        payload, err = decode_token(access_token, config("JWT_KEY"), ['HS256'])

        if err:
            return JsonResponse({'error': err}, status=401)

        return func(request, *args, **kwargs)

    return wrapper


def jwt_user(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        nextUrl = request.GET.get('next')
        #

        return func(request, *args, **kwargs)

    return wrapper


def make_context(request):
    context = {
        'demo': request.demo,
        'userId': request.userId,
        'userType': request.userType,
        'userName': request.userName,
    }
    print('make_context :', context)
    return context


def make_fake_context(request):
    context = {
        'demo': False,
        'userType': 16,
        'courseId': '59005c33-84ac-4f19-9e4f-1567607611ef',
        'userName': "Annonymous",
        'userLogin': True,
        # ''
    }
    return context


def make_user_context(request):
    context = {
        'userLogin': False,
        'returnUrl': request.next,
    }
    return context


class JWTGenerator:
    ACCESS_EXP = datetime.timedelta(weeks=2)
    REFRESH_EXP = datetime.timedelta(hours=1)
    JWT_KEY = config("JWT_KEY")
    ALGORITHM = 'HS256'

    def _generate_expiration(self, token_type):
        if token_type == 'access':
            return datetime.datetime.utcnow() + self.ACCESS_EXP
        elif token_type == 'refresh':
            return datetime.datetime.utcnow() + self.REFRESH_EXP
        raise ValueError("Invalid token type provided.")

    def _generate_payload(self, token_type, **data):
        expiration_time = self._generate_expiration(token_type)
        payload = {'exp': expiration_time}
        if token_type == 'access':
            payload.update(data)
        return payload

    def generate_token(self, token_type, **data):
        if token_type not in ["access", "refresh"]:
            raise ValueError("Invalid token type provided.")

        payload = self._generate_payload(token_type, **data)
        token = jwt.encode(payload, self.JWT_KEY, self.ALGORITHM)
        return token
