from decouple import config
import jwt

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from django.contrib.auth import get_user_model
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie

from auth.authenticate import generate_access_token, jwt_login

mUser = get_user_model()


@method_decorator(csrf_protect, name="dispatch")
class RefreshAccessToken(APIView):
    """ """

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token is None:
            return Response(
                {"message": "Authentication credentials were not provided."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            payload = jwt.decode(
                refresh_token, config("JWT_REFRESH_KEY"), algorithms=["HS256"]
            )
        except:
            return Response(
                {"message": "expired refresh token, please login again."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user = mUser.objects.filter(id=payload["user_id"]).first()

        if user is None:
            return Response(
                {"message": "user not found"}, status=status.HTTP_400_BAD_REQUEST
            )
        if not user.is_active:
            return Response(
                {"message": "user is inactive"}, status=status.HTTP_400_BAD_REQUEST
            )

        access_token = generate_access_token(user)

        return Response(
            {
                "access_token": access_token,
            }
        )


@method_decorator(csrf_protect, name="dispatch")
class LogoutApi(APIView):
    def post(self, request):
        response = Response(
            {"message": "Logout success"}, status=status.HTTP_202_ACCEPTED
        )

        response.delete_cookie("refresh_token")

        return response
