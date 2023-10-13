import jwt

from _config.settings import SECRET_KEY

from django.conf import settings
from django.shortcuts import redirect
from django.http import JsonResponse
from http import HTTPStatus

from .constants import *
# backend django JWT 발행하기 (with PyJWT)
# https://velog.io/@hwang-eunji/backend-django-JWT-발행하기

# Django 8. bcrypt를 통한 비밀번호 암호화
# https://velog.io/@jiffydev/Django-8.-bcrypt를-통한-비밀번호-암호화

# Django 응용하기 - Authorization Decorator 만들고 활용하기
# https://livetodaykono.tistory.com/49

# Django 응용하기 Authentication & Authorization(인증&인가 - Bcrypt와 JWT)
# https://livetodaykono.tistory.com/48

# bcrypt와 PyJWT
# https://velog.io/@2cong/bcrypt와-PyJWT
# https://velog.io/@2cong/토큰-decorator

# pyJWT를 이용한 Python Django Login Decorator
# https://koreanblacklee.github.io/posts/decorator/


# [Python] Bcrypt and Jwt
# https://unocoding.tistory.com/90

# [Django] login Decorator useing pyjwt
# https://unocoding.tistory.com/92


# 장고(Django) 핥짝 맛보기
# 기존의 Django Admin 의 User 모델의 기능을 Customize 하는 자세한 설명
# 사용자인증(1)
# https://swarf00.github.io/2018/12/07/registration.html

# [Django] login Decorator useing pyjwt
# https://unocoding.tistory.com/92
########################################################################
########################################################################
# fake jwtlogin_home_decorator
def jwtlogin_home_decorator0(func):
    def wrapper(request, *args, **kwargs):
        # if "Authorization" not in request.headers:
        # return JsonResponse({"retcode": 1 , "message":"No Authorization in Header"},status=401)

        # token = request.headers["Authorization"]
        request.userType = 1
        return func(request, *args, **kwargs)
    return wrapper

# real jwtlogin_home_decorator


def jwtlogin_home_decorator(func):
    def wrapper(request, *args, **kwargs):
        # if "Authorization" not in request.headers:
        # return JsonResponse({"retcode": 1 , "message":"No Authorization in Header"},status=401)

        # token = request.headers["Authorization"]
        request.userId = ''
        request.userName = ''
        request.academyCode = ''
        try:
            mc_access_token = request.COOKIES.get('mc_access_token')
            # print('access_token :' , access_token)
            # print('SECRET_KEY : ',settings.JWT_KEY )
            request.demo = False

            token = jwt.decode(
                mc_access_token, settings.JWT_KEY, algorithms='HS256')

            if token['demo']:
                request.demo = True

            # print('token : ', token)
            request.userType = token['type']
            request.userId = token['user']
            request.userName = token['name']
            request.academyCode = token['academyCode']

            return func(request, *args, **kwargs)
        except jwt.DecodeError:
            # return JsonResponse({"retcode":2, "message":"No Token in Header"},status=401)
            print('jwt.DecodeError')
            request.userType = 0

            # return redirect('/')
        except jwt.exceptions.ExpiredSignatureError:
            print('jwt.ExpiredSignatureError')
            request.userType = 0
            # return redirect('/')
        # except models.User.DoesNotExist:
        #     return JsonResponse({"retcode":3, "message":"No Valid Token in Header"},status=401)
            # return func(self,request, *args, **kwargs)
        except KeyError:
            request.userType = 0

            # return func(self,request, *args, **kwargs)
            # return redirect('/')

        return func(request, *args, **kwargs)
    return wrapper

# fake jwtlogin_decorator


def jwtlogin_decorator0(func):
    def wrapper(request, *args, **kwargs):
        # if "Authorization" not in request.headers:
        # return JsonResponse({"retcode": 1 , "message":"No Authorization in Header"},status=401)

        # token = request.headers["Authorization"]
        request.userType = 1
        return func(request, *args, **kwargs)
    return wrapper

# real jwtlogin_decorator


def jwtlogin_decorator(func):
    def wrapper(request, *args, **kwargs):
        # if "Authorization" not in request.headers:
        # return JsonResponse({"retcode": 1 , "message":"No Authorization in Header"},status=401)

        # token = request.headers["Authorization"]
        request.userId = ''
        request.userName = ''
        try:
            mc_access_token = request.COOKIES.get('mc_access_token')
            # print('access_token :' , access_token)
            # print('SECRET_KEY : ',settings.JWT_KEY )
            token = jwt.decode(
                mc_access_token, settings.JWT_KEY, algorithms='HS256')
            # print('token : ', token)
            request.userType = token['type']
            request.userId = token['user']
            request.userName = token['name']
            request.academyCode = token['academyCode']

            return func(request, *args, **kwargs)
        except jwt.DecodeError:
            # return JsonResponse({"retcode":2, "message":"No Token in Header"},status=401)
            print('jwt.DecodeError')
            request.userType = 0
            return redirect('/')
        except jwt.exceptions.ExpiredSignatureError:
            print('jwt.ExpiredSignatureError')
            request.userType = 0
            return redirect('/')
        # except models.User.DoesNotExist:
        #     return JsonResponse({"retcode":3, "message":"No Valid Token in Header"},status=401)
            # return func(self,request, *args, **kwargs)
        except KeyError:
            request.userType = 0
            # return func(self,request, *args, **kwargs)
            return redirect('/')

        # return func(self,request, *args, **kwargs)
    return wrapper


def jwtlogin_admin_decorator(func):
    def wrapper(request, *args, **kwargs):
        request.userId = ''
        request.userName = ''
        try:
            mc_access_token = request.COOKIES.get('mc_access_token')
            if not mc_access_token:
                print('No Access Token')
                return redirect('/')

            token = jwt.decode(
                mc_access_token, settings.JWT_KEY, algorithms='HS256')
            if token['demo']:
                request.demo = True
            else:
                request.demo = False

            request.userType = token['type']
            request.userId = token['user']
            request.userName = token['name']
            request.academyCode = token['academyCode']
            if request.userType & ACCOUNT_TYPE_ADMIN == 0:
                return redirect('/')
            return func(request, *args, **kwargs)

        except jwt.DecodeError:
            print('jwt.DecodeError')
            request.userType = 0
            return redirect('/')
        except jwt.exceptions.ExpiredSignatureError:
            print('jwt.ExpiredSignatureError')
            request.userType = 0
            return redirect('/')
        except KeyError:
            request.userType = 0
            return redirect('/')
    return wrapper


def jwtlogin_op_decorator(func):
    def wrapper(request, *args, **kwargs):
        request.userId = ''
        request.userName = ''
        try:
            mc_access_token = request.COOKIES.get('mc_access_token')
            if not mc_access_token:
                print('No Access Token')
                return redirect('/')

            token = jwt.decode(
                mc_access_token, settings.JWT_KEY, algorithms='HS256')

            if token['demo']:
                request.demo = True
                pass
            else:
                request.demo = False

            request.userType = token['type']
            request.userId = token['user']
            request.userName = token['name']
            request.academyCode = token['academyCode']

            if request.userType & ACCOUNT_TYPE_OPERATOR == 0:
                return redirect('/')
            return func(request, *args, **kwargs)

        except jwt.DecodeError:
            print('jwt.DecodeError')
            request.userType = 0
            return redirect('/')
        except jwt.exceptions.ExpiredSignatureError:
            print('jwt.ExpiredSignatureError')
            request.userType = 0
            return redirect('/')
        except KeyError:
            request.userType = 0
            return redirect('/')
    return wrapper


def jwtlogin_cp_decorator(func):
    def wrapper(request, *args, **kwargs):
        request.userId = ''
        request.userName = ''
        try:
            mc_access_token = request.COOKIES.get('mc_access_token')
            if not mc_access_token:
                print('No Access Token')
                return redirect('/')

            token = jwt.decode(
                mc_access_token, settings.JWT_KEY, algorithms='HS256')

            if token['demo']:
                request.demo = True
            else:
                request.demo = False

            request.userType = token['type']
            request.userId = token['user']
            request.userName = token['name']
            request.academyCode = token['academyCode']

            if request.userType & ACCOUNT_TYPE_PRODUCER == 0:
                return redirect('/')
            return func(request, *args, **kwargs)

        except jwt.DecodeError:
            print('jwt.DecodeError')
            request.userType = 0
            if request.method == 'POST':
                return JsonResponse({'retcode': 0, 'message': 'LoginCheck', 'result': {}}, status=HTTPStatus.FORBIDDEN)

            return redirect('/')
        except jwt.exceptions.ExpiredSignatureError:
            print('jwt.ExpiredSignatureError')
            request.userType = 0
            if request.method == 'POST':
                return JsonResponse({'retcode': 0, 'message': 'LoginCheck', 'result': {}}, status=HTTPStatus.FORBIDDEN)

            return redirect('/')
            # return JsonResponse({"redirect":"/"},status=302)
        except KeyError:
            request.userType = 0
            return redirect('/')
    return wrapper

# fake jwtlogin_decorator


def jwtlogin_tc_decorator0(func):
    def wrapper(request, *args, **kwargs):
        # if "Authorization" not in request.headers:
        # return JsonResponse({"retcode": 1 , "message":"No Authorization in Header"},status=401)

        # token = request.headers["Authorization"]
        request.userType = ACCOUNT_TYPE_TEACHER
        return func(request, *args, **kwargs)
    return wrapper


def jwtlogin_tc_test_decorator(func):
    def wrapper(request, *args, **kwargs):

        if request.method == 'POST':
            return JsonResponse({'retcode': 0, 'message': 'LoginCheck', 'result': {}}, status=HTTPStatus.FORBIDDEN)
        else:
            redirect('/')
    return wrapper


def jwtlogin_tc_decorator(func):
    def wrapper(request, *args, **kwargs):
        request.userId = ''
        request.userName = ''
        print('jwtlogin_tc_decorator')
        try:
            # post_demo = request.POST.get('demo')
            # get_demo = request.GET.get('demo')
            mc_access_token = request.COOKIES.get('mc_access_token')
            if not mc_access_token:
                print('No Access Token')
                return redirect('/')

            token = jwt.decode(
                mc_access_token, settings.JWT_KEY, algorithms='HS256')

            if token['demo']:
                print('demo tc :')
                request.userType = token['type']
                request.userId = token['user']
                request.userName = token['name']
                request.academyCode = token['academyCode']
                request.demo = True
                if request.userType & ACCOUNT_TYPE_TEACHER == 0:
                    print('Not Teacher')
                    return redirect('/')
            else:
                request.userType = token['type']
                request.userId = token['user']
                request.userName = token['name']
                request.academyCode = token['academyCode']
                request.demo = False

                if request.userType & ACCOUNT_TYPE_TEACHER == 0:
                    print('Not Teacher')
                    return redirect('/')
            return func(request, *args, **kwargs)

        except jwt.DecodeError:
            print('jwt.DecodeError')
            request.userType = 0
            if request.method == 'POST':
                return JsonResponse({'retcode': 0, 'message': 'LoginCheck', 'result': {}}, status=HTTPStatus.FORBIDDEN)

            return redirect('/')

        except jwt.exceptions.ExpiredSignatureError:
            print('jwt.ExpiredSignatureError')
            request.userType = 0
            if request.method == 'POST':
                return JsonResponse({'retcode': 0, 'message': 'LoginCheck', 'result': {}}, status=HTTPStatus.FORBIDDEN)
            # Todo. Jstar : JsonResponse 를 해야 하나? , redirect 를 해야 하나?
            return redirect('/')

        except KeyError:
            print('KeyError')
            request.userType = 0
            if request.method == 'POST':
                return JsonResponse({'retcode': 0, 'message': 'LoginCheck', 'result': {}}, status=HTTPStatus.FORBIDDEN)

            return redirect('/')
    return wrapper


def jwtlogin_st_decorator0(func):
    def wrapper(request, *args, **kwargs):
        # if "Authorization" not in request.headers:
        # return JsonResponse({"retcode": 1 , "message":"No Authorization in Header"},status=401)

        # token = request.headers["Authorization"]
        request.userType = ACCOUNT_TYPE_STUDENT
        # 여기서 이걸로 테스트 한다.
        request.userId = '22920002'

        return func(request, *args, **kwargs)
    return wrapper


def jwtlogin_st_decorator(func):
    def wrapper(request, *args, **kwargs):
        request.userId = ''
        request.userName = ''
        try:
            mc_access_token = request.COOKIES.get('mc_access_token')
            token = jwt.decode(
                mc_access_token, settings.JWT_KEY, algorithms='HS256')
            request.userType = token['type']
            request.userId = token['user']
            request.userName = token['name']
            request.academyCode = token['academyCode']
            request.demo = token['demo']

            if request.userType & ACCOUNT_TYPE_STUDENT == 0:
                return redirect('/')
            return func(request, *args, **kwargs)

        except jwt.DecodeError:
            print('jwt.DecodeError')
            request.userType = 0
            return redirect('/')
        except jwt.exceptions.ExpiredSignatureError:
            print('jwt.ExpiredSignatureError')
            request.userType = 0
            if request.method == 'POST':
                return JsonResponse({'retcode': 0, 'message': 'LoginCheck', 'result': {}}, status=HTTPStatus.FORBIDDEN)
            return redirect('/')
        except KeyError:
            request.userType = 0
            return redirect('/')
    return wrapper

########################################################################
# fake make_cotext


def make_context0(request):
    context = {
        # 'userType': request.userType,
        # 0 : no User (Admin)
        # 1 : Admin 이 만든 CP(콘텐츠 제작자)
        # 2 : Admin 이 만든 선생님
        # 3 : 선생님이 만든 학생
        # 4 : 학생의 Observer (부모)
        # 5 : 일반 유저 (스스로 가입한 학생)

        'userAdmin': True,  # request.userType == 0,
        # 'userCP' : request.userType == 1,
        # 'userTeacher' : request.userType == 2,
        # 'userStudent' : request.userType == 3,
        # 'userParent' : request.userType == 4,
        # 'userUser' : request.userType == 5,
        # 'userLogin' : request.userType != -1,
    }
    return context

# 나중에 AcademyCode 에 따른 로고 ...
# real make_context


def make_context(request):

    context = {
        'demo': request.demo,
        'userId': request.userId,
        'userType': request.userType,
        'userName': request.userName,
        'academyCode': request.academyCode,
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

#######################################################################
