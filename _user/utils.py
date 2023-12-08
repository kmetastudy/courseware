import uuid
import datetime

import jwt
from decouple import config

from django.contrib.auth.hashers import make_password, check_password

from .constants import *
from .models import mUser

# 사이트에 접속(main)
# userType을 통해, client에서는 이 사람의 정보를 알 수 있다.
# 예를 들어, 토큰이 있는지, 있다면 어떤 유형(관리자/사용자/anonymous)인지
# 토큰이 없다면, client는 이 사용자를, 특정 페이지(예. 로그인/회원가입)페이지로 보낼 수 있따.
# 그게 아니여도, 그냥 그 상태를 저장해두고, 대신 페이지에 제약을 둘 수 있다.
from functools import wraps
from django.http import JsonResponse
import jwt


def validate_token(request, token, token_type):
    token_generator = JWTGenerator()
    try:
        payload = jwt.decode(token, config('JWT_KEY'), algorithms='HS256')
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


def decode_token(token, secret, algorithms):
    try:
        return jwt.decode(token, secret, algorithms=algorithms), None
    except jwt.ExpiredSignatureError:
        return None, 'Token has expired'
    except jwt.InvalidTokenError:
        return None, 'Invalid token'


def issue_new_token(payload, secret, algorithm):
    return jwt.encode(payload, secret, algorithm=algorithm)


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


# def make_context(request):
#     context = {
#         'demo': request.demo,
#         'userId': request.userId,
#         'userType': request.userType,
#         'userName': request.userName,
#     }
#     print('make_context :', context)
#     return context


def make_fake_context(request):
    course_id = request.GET.get('course_id')
    content_id = request.GET.get('content_id')
    context = {
        'demo': False,
        'userType': 16,
        # 'courseId': '59005c33-84ac-4f19-9e4f-1567607611ef',
        'courseId': course_id,
        'contentId': content_id,
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


def make_context(request):
    context = {
        'demo': getattr(request, 'demo', True),
        'userId': request.userId,
        'userType': request.userType,
        'userName': request.userName,  # nickname
        # 'accessToken': request.access_token,
        # 'academyCode': request.academyCode,
        #
        # 0 : no User (Admin)
        # 1 : Admin 이 만든 CP(콘텐츠 제작자)
        # 2 : Admin 이 만든 선생님
        # 3 : 선생님이 만든 학생
        # 4 : 학생의 Observer (부모)
        # 5 : 일반 유저 (스스로 가입한 학생)

        'userAdmin': ((request.userType & ACCOUNT_TYPE_ADMIN) != 0),
        'userOP': ((request.userType & ACCOUNT_TYPE_OPERATOR) != 0),
        'userCP':      ((request.userType & ACCOUNT_TYPE_PRODUCER) != 0),
        'userTeacher': ((request.userType & ACCOUNT_TYPE_TEACHER) != 0),
        'userStudent': ((request.userType & ACCOUNT_TYPE_STUDENT) != 0),
        'userParent': ((request.userType & ACCOUNT_TYPE_PARENT) != 0),
        'userUser': ((request.userType & ACCOUNT_TYPE_USER) != 0),
        'userLogin': (request.userType != 0),
    }
    print('make_context :', context)
    return context


class JWTGenerator:
    ACCESS_EXP = datetime.timedelta(hours=1)
    REFRESH_EXP = datetime.timedelta(weeks=2)
    JWT_KEY = config("JWT_KEY")
    ALGORITHM = 'HS256'
    cookie_max_age = None

    def get_max_age(self):
        return self.cookie_max_age

    def _generate_expiration(self, token_type):
        if token_type == 'access':
            return datetime.datetime.utcnow() + self.ACCESS_EXP
        elif token_type == 'refresh':
            self.cookie_max_age = 1209600 + 60  # 2 weeks
            return datetime.datetime.utcnow() + self.REFRESH_EXP
        raise ValueError("Invalid token type provided.")

    def _generate_payload(self, token_type, **data):
        expiration_time = self._generate_expiration(token_type)

        payload = {'exp': expiration_time}
        payload.update(data)
        return payload

    def generate_token(self, token_type, **data):
        if token_type not in ["access", "refresh"]:
            raise ValueError("Invalid token type provided.")

        payload = self._generate_payload(token_type, **data)
        token = jwt.encode(payload, self.JWT_KEY, self.ALGORITHM)

        encoded = jwt.decode(token, self.JWT_KEY, self.ALGORITHM)
        print(encoded)
        return token


def social_user_create(email, password=None, **extra_fields):
    DEFAULT_NICKNAME = "User"
    DEFAULT_TYPE = 64  # type of student

    user = mUser(email=email)

    if password:
        user.password = make_password(password)

    if "nickname" in extra_fields:
        user.nickname = extra_fields["nickname"]
    elif "name" in extra_fields:
        user.nickname = extra_fields["name"]
    else:
        user.nickname = DEFAULT_NICKNAME

    if "type" in extra_fields:
        user.type = extra_fields["type"]
    else:
        user.type = DEFAULT_TYPE

    user.full_clean()
    user.save()

    return user


def get_or_create_social_user(email, **extra_data):
    user = mUser.objects.filter(email=email).first()

    if user:
        return user, False

    return social_user_create(email=email, **extra_data), True


def get_next_url(request, delete=False):
    """
    Get next url

    """
    next_url = request.session.get("next", "/")

    if delete:
        del request.session['next']

    return next_url


def demo_student_id(request):
    """
    Get or create demo student(user) id, using session
    return str(uuid.uuid4())
    """
    demo_student_id = request.session.get("demo_student_id")
    if not demo_student_id:
        demo_student_id = uuid.uuid4()  # create new
        request.session["demo_student_id"] = demo_student_id
        request.session.modified = True

    return demo_student_id
