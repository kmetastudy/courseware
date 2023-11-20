from functools import wraps


import jwt
from decouple import config

from django.http import JsonResponse

from .models import mUserCourse
from _user.utils import JWTGenerator


def jwt_required(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        token_generator = JWTGenerator()
        request.userId = ''
        request.userName = ''

        def validate_token(token, token_type):
            try:
                payload = jwt.decode(token, config(
                    'JWT_KEY'), algorithms='HS256')
                request.userType = payload['type']
                request.userId = payload['user']
                request.userName = payload['name']

                if token_type == 'refresh':
                    new_access_token = token_generator.generate_token(
                        'access', **payload)
                    return new_access_token
                return None
            except jwt.ExpiredSignatureError:
                print(f"{token_type} token expired")
                return None
            except jwt.InvalidTokenError:
                print(f"invalid {token_type} token")
                return None
        # 1. If there is access token
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith('Bearer '):
            access_token = auth_header.split(' ')[1]
            new_access_token = validate_token(access_token, 'access')
            if new_access_token:
                response = func(request, *args, **kwargs)
                response['Authorization'] = f'Bearer {new_access_token}'
                return response

        # 2. If there is no access token, but refresh token
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            new_access_token = validate_token(refresh_token, 'refresh')
            if new_access_token:
                response = func(request, *args, **kwargs)
                response['Authorization'] = f'Bearer {new_access_token}'
                return response

        request.userType = 0
        return func(request, *args, **kwargs)

    return wrapper
