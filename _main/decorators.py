from functools import wraps

from decouple import config
import jwt

from _user.utils import JWTGenerator, validate_token


def jwt_main(func):
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


# def jwt_main(func):
#     @wraps(func)
#     def wrapper(request, *args, **kwargs):
#         token_generator = JWTGenerator()
#         request.userId = ''
#         request.userName = ''

#         # 액세스 토큰 검증 시도
#         try:
#             auth_header = request.META.get("HTTP_AUTHORIZATION", "")
#             if auth_header.startswith('Bearer '):
#                 access_token = auth_header.split(' ')[1]
#                 try:
#                     access_payload = jwt.decode(access_token, config(
#                         'JWT_KEY'), algorithms='HS256')
#                     # 유효한 액세스 토큰일 경우 함수 실행
#                     request.userType = access_payload['type']
#                     request.userId = access_payload['user']
#                     request.userName = access_payload['name']
#                     return func(request, *args, **kwargs)
#                 except jwt.ExpiredSignatureError:
#                     # 액세스 토큰 만료 시 리프레시 토큰 검증
#                     refresh_token = request.COOKIES.get('refresh_token')
#                     if refresh_token:
#                         try:
#                             refresh_payload = jwt.decode(refresh_token, config(
#                                 'JWT_KEY'), algorithms='HS256')
#                             new_access_token = token_generator.generate_token(
#                                 'access', **refresh_payload)

#                             request.userType = refresh_payload['type']
#                             request.userId = refresh_payload['user']
#                             request.userName = refresh_payload['name']
#                             response = func(request, *args, **kwargs)
#                             response['Authorization'] = f'Bearer {new_access_token}'
#                             return response
#                         except jwt.ExpiredSignatureError:
#                             request.userType = 0
#                             print("refresh token expired")
#                             return func(request, *args, **kwargs)
#                 except jwt.InvalidTokenError:
#                     request.userType = 0
#                     print("invalid access token")
#                     return func(request, *args, **kwargs)
#             # No Access token -> Check refresh token
#             else:
#                 try:
#                     refresh_token = request.COOKIES.get('refresh_token')
#                     refresh_payload = jwt.decode(refresh_token, config(
#                         'JWT_KEY'), algorithms='HS256')
#                     print("refresh : ", refresh_payload)
#                     new_access_token = token_generator.generate_token(
#                         'access', **refresh_payload)

#                     request.userType = refresh_payload['type']
#                     request.userId = refresh_payload['user']
#                     request.userName = refresh_payload['name']
#                     response = func(request, *args, **kwargs)
#                     response['Authorization'] = f'Bearer {new_access_token}'
#                     return response
#                 except jwt.ExpiredSignatureError:
#                     request.userType = 0
#                     print("refresh token expired")
#                     return func(request, *args, **kwargs)
#                 except jwt.InvalidTokenError:
#                     # 액세스 토큰이 유효하지 않음
#                     request.userType = 0
#                     print("invalid refresh token")
#                     return func(request, *args, **kwargs)
#         except:
#             # 액세스 토큰이 없거나 리프레시 토큰도 유효하지 않을 경우
#             request.userType = 0
#             print("key error")
#             return func(request, *args, **kwargs)
#     return wrapper
