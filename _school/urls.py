from django.urls import path
from .views import *

app_name = "_school"

urlpatterns = [
    path("", index, name="index"),
    path("page/<str:school_id>/", school_page, name="schoolPage"),
    path(
        "page/<str:school_id>/courses/<str:id>/",
        school_detailView,
        name="school_detailView",
    ),
    path("page/<str:school_id>/st/", school_st, name="schoolST"),
    path("basic/<str:school_id>/", basic_landing, name="basic_landing"),
    path(
        "basic/<str:school_id>/courses/<str:id>/",
        basic_detailView,
        name="basic_detailView",
    ),
    path("basic/<str:school_id>/st/", school_st, name="schoolST"),
]
