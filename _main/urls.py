from django.urls import path
from .views import *

app_name = '_main'

urlpatterns = [
    path('', index, name='index'),
    
    # path('courses/<str:school>/', getSubject, name='getSubject'),
    path('courses/<str:school>/<str:subject>/', mainView, name='mainView'),
    path('courses/<str:school>/<str:subject>/<str:id>/', getDetail, name='getDetail'),

]