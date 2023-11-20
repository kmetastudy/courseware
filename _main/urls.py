from django.urls import path
from .views import *

app_name = '_main'

urlpatterns = [
    path('', index, name='index'),
    
    # path('courses/<str:school>/', getSubject, name='getSubject'),
    path('courses/<str:school>/<str:subject>/', getSubject, name='getDetail'),
    path('courses/<str:school>/<str:subject>/<str:id>/', getDetail, name='getCourses'),

]