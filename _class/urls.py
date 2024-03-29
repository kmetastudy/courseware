from django.urls import path, include, re_path

from .views import (
    index,
    index_classroom,
    page_classroom_teacher,
    page_classroom_student,
    page_class_launch,
    class_join,
    SingleCourseClassRegistrationView,
)

from .apis import ClassStudyResultUpdatePropertyApi
from .routers import router

app_name = "_class"

teacher_patterns = [
    re_path(
        r"^.*$",
        page_classroom_teacher,
        name="classroom-teacher",
    ),
]

student_patterns = [
    re_path(
        r"^.*$",
        page_classroom_student,
        name="classroom-student",
    ),
]

urlpatterns = [
    path("", index, name="class_home"),
    path("classroom/", index_classroom, name="classroom"),
    path("classroom/teacher/<uuid:id_class>/", include(teacher_patterns)),
    path("classroom/student/<uuid:id_class>/", include(student_patterns)),
    path("launch/", page_class_launch, name="class_launch"),
    path("join/<str:class_code>", class_join, name="class_join"),
    path(
        "single-course-class/registration/",
        SingleCourseClassRegistrationView.as_view(),
        name="single_course_class_registration",
    ),
    path("api/", include(router.urls)),
    path(
        "api/study-result-property/<uuid:pk>/",
        ClassStudyResultUpdatePropertyApi.as_view(),
        name="study_result_property",
    ),
]
