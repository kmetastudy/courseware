import json


from decouple import config
import jwt


from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter, OrderingFilter

from django_filters.rest_framework import DjangoFilterBackend

from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.hashers import make_password, check_password
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie


from .utils import make_fake_context
from .decorators import last_visited
from .utils import JWTGenerator
from .models import mUser, mCoursePurchases
from .constants import *
from auth.authenticate import generate_access_token
from .serializers import UserSerializer, SignUpSerializer, CoursePurchasesSerializer

from core.mixins import CreateListModelMixin
from core.session_helpers import get_next_url, delete_session

# Create your views here.


@last_visited
def index(request):
    fake_context = make_fake_context(request)
    # fake_context['returnUrl'] = request.next
    fake_context["returnUrl"] = request.GET.get("next")
    context_dumped = {"context": json.dumps(fake_context)}
    return render(request, "_user/_user.html", context_dumped)


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
        result = {"success": False}

        email = request.POST.get("email")
        password = request.POST.get("password")

        user = self.check_user_existence(email)

        if user == None:
            return JsonResponse({"message": "Invalid email", "result": result})
        if check_password(password, user.password) == False:
            return JsonResponse({"message": "Invalid email", "result": result})

        if user.is_teacher() or user.is_staff():
            next_url = "/dashboard/"
            delete_session(request, "next")
        else:
            next_url = get_next_url(request=request, delete=True)
        result["next_url"] = next_url
        result["success"] = True

        refresh_token = self.token_generator.generate_token(
            "refresh",
            user=str(user.id),
            type=int(user.type),
            full_name=str(user.full_name),
        )

        expiration = self.token_generator.get_max_age()
        cookie_expiration = expiration

        response = JsonResponse({"message": "login success", "result": result})
        response.set_cookie(
            "refresh_token",
            refresh_token,
            httponly=True,
            samesite="Strict",
            max_age=cookie_expiration,
        )
        return response


class SignUpView(View):
    token_generator = JWTGenerator()

    def user_exists(self, email, otherfield=None):
        return mUser.objects.ƒilter(email == email).exists()

    def post(self, request):
        result = {"success": False}

        email = request.POST.get("email")
        password = request.POST.get("password")
        # nickname = request.POST.get('nickname')
        type = request.POST.get("type")
        name = request.POST.get("name")
        print(request.data)

        # if email is None or password is None or nickname is None:
        #     return JsonResponse({"message": "값이 빠졌습니다.", "result": result})
        if email is None or password is None or name is None:
            return JsonResponse({"message": "값이 빠졌습니다.", "result": result})

        if mUser.objects.filter(email=email).exists() == True:
            return JsonResponse(
                {"message": "이미 사용중인 아이디입니다", "result": result}
            )

        user = mUser.objects.create(
            email=email,
            password=make_password(password),
            # nickname=nickname,
            name=name,
            type=type,
        )

        next_url = request.session.get("next", "/")
        result["next_url"] = next_url
        result["success"] = True

        del request.session["next"]

        refresh_token = self.token_generator.generate_token(
            "refresh", user=str(user.id), type=int(user.type), name=str(user.nickname)
        )

        expiration = self.token_generator.get_max_age()
        cookie_expiration = expiration

        response = JsonResponse({"message": "login success", "result": result})
        response.set_cookie(
            "refresh_token",
            refresh_token,
            httponly=True,
            samesite="Strict",
            max_age=cookie_expiration,
        )
        return response


# class LoginView(APIView):


class SignUp(APIView):
    token_generator = JWTGenerator()

    def post(self, request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user_data = serializer.validated_data
            print("validated_data: ", user_data)
            user = mUser.objects.create_user(
                email=user_data["email"],
                password=user_data["password"],
                full_name=user_data.get("full_name"),
                nickname=user_data.get("nickname"),
                type=user_data.get("type"),
                grade=user_data.get("grade"),
                gender=user_data.get("gender"),
                json_data=user_data.get("json_data"),
            )

            next_url = get_next_url(request, delete=True)
            refresh_token = self.token_generator.generate_token(
                "refresh",
                user=str(user.id),
                type=int(user.type),
                full_name=str(user.full_name),
            )
            expiration = self.token_generator.get_max_age()

            response = Response(
                {
                    "email": user.email,
                    "full_name": user.full_name,
                    "next_url": next_url,
                },
                status=status.HTTP_201_CREATED,
            )
            response.set_cookie(
                "refresh_token",
                refresh_token,
                httponly=True,
                samesite="Strict",
                max_age=expiration,
            )

            return response
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# jwt token payload
# 1. refesh
# {'id': str(mUser.id)}
# 2. access
# {'id': str(mUser.id), 'type': mUser.type, 'nickname': mUser.nickname}


def logout(request):
    next_url = request.META.get("HTTP_REFERER")

    response = redirect(next_url)
    response.delete_cookie("refresh_token")

    return response


class UserViewSet(viewsets.ModelViewSet):
    queryset = mUser.objects.all()
    serializer_class = UserSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = {
        "id": ["in", "exact"],
        "email": ["in", "exact"],
        "full_name": ["in", "exact"],
    }


class CoursePurchasesViewSet(CreateListModelMixin, viewsets.ModelViewSet):
    queryset = mCoursePurchases.objects.all()
    serializer_class = CoursePurchasesSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = {
        "id": ["in", "exact"],
        "id_user": ["in", "exact"],
    }
