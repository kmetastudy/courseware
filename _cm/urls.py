from django.urls import path
from .views import *

app_name = '_cm'

urlpatterns = [
    path('', index, name='index'),
    path('getCourseBook/', getCourseBook, name='getCourseBook'),
    path('getDetail/', getDetail, name='getDetail'),
    path('setDetail/', setDetail, name='setDetail'),
    path('get-detail-list/', get_detail_list, name='get_detail_list'),
]
