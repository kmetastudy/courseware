from django.urls import path
from .views import *

app_name = "_main"

urlpatterns = [
    path("", index, name="index"),
    path("desc/<str:page>/", descView, name="descView"),
    path("contact/", new_contact, name="index"),
    path("about/", about, name="about"),
    path("faq/", faq, name="faq"),
    path("news/", news, name="news"),
    path("courses/<str:school>/<str:subject>/", mainView, name="mainView"),
    path("courses/<str:id>/", detailView, name="detailView"),
    path("chapter/", detail_chapter, name="detail_chapter"),
    # dashboard
    path("dashboard/", dashboard_view, name="dashboard_view"),
    path("stats/", stats_view, name="stats_view"),
    path("stats/<str:course_id>/", stats_detail_view, name="stats_detail_view"),
]
