from django.urls import path, include

from .views import *

app_name = '_class'

urlpatterns = [
    path('', index, name='class_index'),
]
