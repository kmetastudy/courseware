from django.urls import path
from .views import *

app_name = "_main"

urlpatterns = [
    path("", index, name="index"),
    path("desc/<str:page>/", descView, name="descView"),
    path("contact/", new_contact, name="index"),
    path("about/", about, name="about"),
    path("courses/<str:school>/<str:subject>/", mainView, name="mainView"),
    path("courses/<str:id>/", detailView, name="detailView"),
    path("chapter/", detail_chapter, name="detail_chapter"),
    path("basic/<str:school_id>/", basic_landing, name="basic_landing"),
    # path("cart/", cart_detail, name="cart_detail"),
    # path("cart/<str:course_pk>/add/", add_to_cart, name="add_to_cart"),
    # path("point/history/", point_history, name="point_history"),
    # path("point/charge/", point_charge, name="point_charge"),
    # path("point/<int:pk>/pay/", point_pay, name="point_pay"),
    # path("point/check/<int:payment_pk>/", point_check, name="point_check"),
    # path("orders/", order_list, name="order_list"),
    # path("orders/new/", order_new, name="order_new"),
    # path("orders/<int:pk>/pay/", order_pay, name="order_pay"),
    # path(
    #     "orders/<int:order_pk>/check/<int:payment_pk>/", order_check, name="order_check"
    # ),
    # path("orders/<int:pk>/", order_detail, name="order_detail"),
    # path("mycourse/", mycourse, name="mycourse"),
    # path("payment/new/", payment_new, name="payment_new"),
    # path("payment/<int:pk>/pay/", payment_pay, name="payment_pay"),
    # path("payment/<int:pk>/check/", payment_check, name="payment_check"),
    # path("payment/<int:pk>/", payment_detail, name="payment_detail"),
    # dashboard
    path("dashboard/", dashboard_view, name="dashboard_view"),
    path("stats/", stats_view, name="stats_view"),
    path("stats/<str:course_id>/", stats_detail_view, name="stats_detail_view"),
]
