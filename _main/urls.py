from django.urls import path
from .views import *

app_name = '_main'

urlpatterns = [
    path('', index, name='index'),
    
    # path('courses/<str:school>/', getSubject, name='getSubject'),
    path('courses/<str:school>/<str:subject>/', mainView, name='mainView'),
    path('courses/<str:school>/<str:subject>/<str:id>/', detailView, name='detailView'),
    path('cart/', cart_detail, name='cart_detail'),
    path('cart/<str:course_pk>/add/', add_to_cart, name='add_to_cart'),
    path('orders/', order_list, name='order_list'),
    path('orders/new/', order_new, name='order_new'),
    path('orders/<int:pk>/pay/', order_pay, name='order_pay'),
    path('orders/<int:order_pk>/check/<int:payment_pk>/', order_check, name='order_check'),
    path('orders/<int:pk>/', order_detail, name='order_detail'),
    path('payment/new/', payment_new, name='payment_new'),
    path('payment/<int:pk>/pay/', payment_pay, name='payment_pay'),
    path('payment/<int:pk>/check/', payment_check, name='payment_check'),
    path('payment/<int:pk>/', payment_detail, name='payment_detail'),

]