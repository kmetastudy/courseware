import datetime

import jwt
from decouple import config

from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, CSRFCheck

from django.conf import settings

from .models import mUser


def generate_demo_student_id(request):

    return


def generate_access_token(refresh_token):
    payload = jwt.decode(refresh_token,
                         config("JWT_REFRESH_KEY"),
                         algorithms="HS256")

    access_token_payload = {
        'user': payload["user"],
        'type': payload["type"],
        'name': payload['name'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(
            days=0, minutes=60
        ),
        'iat': datetime.datetime.utcnow(),
    }

    access_token = jwt.encode(
        access_token_payload,
        config("JWT_KEY"),
        algorithm='HS256'
    ).decode('utf-8')

    return access_token


def generate_refresh_token(user):
    refresh_token_payload = {
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=14),
        'iat': datetime.datetime.utcnow(),
    }

    refresh_token = jwt.encode(
        refresh_token_payload,
        config("JWT_REFRESH_KEY"), algorithm='HS256'
    ).decode('utf-8')

    return refresh_token


def jwt_login(response, user):
    refresh_token = generate_refresh_token(user)
    access_token = generate_access_token(refresh_token=refresh_token)

    data = {
        'access_token': access_token,
    }

    response.data = data
    response.set_cookie(key="refreshtoken",
                        value=refresh_token,
                        httponly=True,
                        samesite="Strict",
                        max_age=1209600 + 60)  # refresh token exp -> seconds + 60s

    return response


class SafeJWTAuthentication(BaseAuthentication):
    """
    TODO
    JWT Authentication
    헤더의 jwt 값을 디코딩해 얻은 user_id 값을 통해서 유저 인증 여부를 판단한다.
    """

    def enforce_csrf(self, request):
        check = CSRFCheck()

        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied(f'CSRF Failed: {reason}')

    def authenticate_credentials(self, request, key):
        user = mUser.objects.filter(id=key).first()

        if user is None:
            raise exceptions.AuthenticationFailed('User not found')

        if not user.is_active:
            raise exceptions.AuthenticationFailed('User is inactive')

        self.enforce_csrf(request)
        return (user, None)

    def authenticate(self, request):
        authorization_header = request.headers.get('Authorization')

        if not authorization_header:
            return None

        try:
            prefix = authorization_header.split(' ')[0]
            if prefix.lower() != 'jwt':
                raise exceptions.AuthenticationFailed('Token is not jwt')

            access_token = authorization_header.split(' ')[1]
            payload = jwt.decode(
                access_token, settings.SECRET_KEY, algorithms=['HS256']
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('access_token expired')
        except IndexError:
            raise exceptions.AuthenticationFailed('Token prefix missing')

        return self.authenticate_credentials(request, payload['user'])
