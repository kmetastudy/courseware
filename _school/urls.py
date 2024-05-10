from django.urls import path
from .views import *

app_name = "_school"

urlpatterns = [
    path("", index, name="index"),
    path("page/<str:school_id>/", school_page, name="schoolPage"),
    path(
        "page/<str:school_id>/courses/<str:school>/<str:subject>/<str:id>/",
        school_detailView,
        name="school_detailView",
    ),
    path("page/<str:school_id>/st/", school_st, name="schoolST"),
]