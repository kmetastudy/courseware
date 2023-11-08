from django.urls import path, include
from .views import index, login, index_signup, LoginView, SignUpView
from .social_login import *
app_name = '_user'

urlpatterns = [
    path('', index, name='index'),
    path('login/', login, name='login-page'),
    path('signup/', index_signup, name='index_signup'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/sign-up/', SignUpView.as_view(), name='signup'),

    path('signin/kakao/', KaKaoSignInView.as_view(), name='kakao_signin'),
    path('signin/kakao/callback/', KakaoSignInCallbackView.as_view(),
         name='kakao_signin_callback'),

    path('signin/naver/', NaverSignInView.as_view(), name='naver_signin'),
    path('signin/naver/callback/', NaverSignInCallbackView.as_view(),
         name='naver_signin_callback'),

    path('signin/google/', GoogleSignInView.as_view(), name='google_signin'),
    path('signin/google/callback/', GoogleSignInCallbackView.as_view(),
         name='google_signin_callback'),


    path('signin/facebook/', FaceBookSignInView.as_view(), name='facebook_signin'),
    path('signin/facebook/callback/', FaceBookSignInCallbackView.as_view(),
         name='facebook_signin_callback'),

]
