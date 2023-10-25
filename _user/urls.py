from django.urls import path, include
from .views import index, index_test, login, index_signup, LoginView, SignUpView

app_name = '_user'

urlpatterns = [
    path('', index, name='index'),
    path('test/', index_test, name='index'),
    path('login/', login, name='login-page'),
    path('signup/', index_signup, name='index_signup'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/sign-up/', SignUpView.as_view(), name='signup'),
]
