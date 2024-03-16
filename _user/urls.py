from django.urls import path, include
from .views import index, LoginView, SignUpView, logout, SignUp
from .social_login import *
from .routers import router
app_name = '_user'

urlpatterns = [
    path('', index, name='index'),
    path('signup/', SignUp.as_view(), name='signup'),

    path('api/login/', LoginView.as_view(), name='login'),
    path('api/sign-up/', SignUpView.as_view(), name='signup'),
    path('api/logout/', logout, name='logout'),

    path('signin/kakao/', KaKaoSignInView.as_view(), name='kakao_signin'),
    path('signin/kakao/callback/', KakaoSignInCallbackView.as_view(),
         name='kakao_signin_callback'),

    path('signin/naver/', NaverSignInView.as_view(), name='naver_signin'),
    path('signin/naver/callback/', NaverSignInCallbackView.as_view(),
         name='naver_signin_callback'),

    path('signin/google/', GoogleSignInView.as_view(), name='google_signin'),
    path('signin/google/callback/', GoogleSignInCallbackView.as_view(),
         name='google_signin_callback'),

    path('signin/google/test/', GoogleLoginApi.as_view(),
         name='google_signin_test'),
    path('signin/google/test/callback/', GoogleSigninCallBackApi.as_view(),
         name='google_signin_callback_test'),

    path('signin/google/openid/', GoogleOpenIdView.as_view(),
         name='google_signin_openid'),
    path('signin/google/openid/callback/', GoogleOpenIdCallbackView.as_view(),
         name='google_signin_openid_callback'),

    path('signin/facebook/', FaceBookSignInView.as_view(), name='facebook_signin'),
    path('signin/facebook/callback/', FaceBookSignInCallbackView.as_view(),
         name='facebook_signin_callback'),

    path('api/', include(router.urls)),

]
