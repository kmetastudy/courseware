from django.urls import path
from .views import *

app_name = '_main'

urlpatterns = [
    path('', index, name='index'),
    
    # path('courses/<str:school>/', getSubject, name='getSubject'),
    path('courses/<str:school>/<str:subject>/', mainView, name='mainView'),
    path('courses/<str:school>/<str:subject>/<str:id>/', detailView, name='detailView'),
    path('payment/new/', payment_new, name='payment_new'),
    path('payment/<int:pk>/pay/', payment_pay, name='payment_pay'),
    path('payment/<int:pk>/check/', payment_check, name='payment_check'),
]