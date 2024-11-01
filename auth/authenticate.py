import datetime

import jwt
from decouple import config

from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, CSRFCheck

from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

# https://hyeo-noo.tistory.com/301
# https://hyeo-noo.tistory.com/258


def generate_access_token(user):
    access_token_payload = {
        "user_id": user.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=0, minutes=60),
        "iat": datetime.datetime.utcnow(),
    }

    access_token = jwt.encode(
        access_token_payload, config("JWT_KEY"), algorithm="HS256"
    )

    return access_token


def generate_refresh_token(user):
    refresh_token_payload = {
        "user_id": user.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=14),
        "iat": datetime.datetime.utcnow(),
    }

    refresh_token = jwt.encode(
        refresh_token_payload, config("JWT_KEY"), algorithm="HS256"
    )

    return refresh_token


def jwt_login(response, user):
    refresh_token = generate_refresh_token(user)
    access_token = generate_access_token(user)

    data = {
        "access_token": access_token,
    }

    response.data = data
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="Strict",
        max_age=1209600 + 60,
    )  # refresh token exp -> seconds + 60s

    return response


class BaseJWTAuthentication(BaseAuthentication):
    """
    JWT Authentication
    헤더의 jwt 값을 디코딩해 얻은 user_id 값을 통해서 유저 인증 여부를 판단한다.
    """

    def authenticate(self, request):
        authorization_header = request.headers.get("Authorization")

        if not authorization_header:
            return None

        try:
            prefix = authorization_header.split(" ")[0]
            if prefix.lower() != "jwt":
                raise exceptions.AuthenticationFailed("Token is not jwt")

            access_token = authorization_header.split(" ")[1]
            payload = jwt.decode(access_token, config("JWT_KEY"), algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("access_token expired")
        except IndexError:
            raise exceptions.AuthenticationFailed("Token prefix missing")

        return self.authenticate_credentials(request, payload["user_id"])

    def authenticate_credentials(self, request, key):
        """
        user instance would be set at request.user
        """
        user = User.objects.filter(id=key).first()

        if user is None:
            raise exceptions.AuthenticationFailed("User not found")

        if not user.is_active:
            raise exceptions.AuthenticationFailed("User is inactive")

        self.enforce_csrf(request)
        return (user, None)

    def enforce_csrf(self, request):
        check = CSRFCheck()

        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied(f"CSRF Failed: {reason}")


class AdministratorAuthentication(BaseJWTAuthentication):
    def authenticate(self, request):
        return super().authenticate(request)

    def authenticate_credentials(self, request, key):
        user = User.objects.filter(id=key).first()

        if user is None:
            raise exceptions.AuthenticationFailed("User not found")

        if not user.is_active:
            raise exceptions.AuthenticationFailed("User is inactive")

        if not user.is_superuser:
            raise exceptions.AuthenticationFailed("User is not superuser")

        # self.enforce_csrf(request)

        return (user, None)

    def enforce_csrf(self, request):
        super().enforce_csrf(request)
