from django.urls import path, include
from .views import *
from .routers import router

app_name = "_cm"

urlpatterns = [
    path("", index, name="index"),
    path("school/", school, name="school"),
    path("course_import/", course_import, name="course_import"),
    path("api/", include(router.urls)),
    # old
    path("getCourseBook/", getCourseBook, name="getCourseBook"),
    path("getDetail/", getDetail, name="getDetail"),
    path("setDetail/", setDetail, name="setDetail"),
    path("get-detail-list/", get_detail_list, name="get_detail_list"),
]
