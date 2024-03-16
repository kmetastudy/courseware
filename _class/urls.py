from django.urls import path, include

from .views import (
    index,
    index_classroom,
    page_classroom_teacher,
    page_classroom_student,
    page_class_launch,
    class_join,
    SingleCourseClassRegistrationView,
)
from .routers import router

app_name = "_class"

urlpatterns = [
    path("", index, name="class_home"),
    path("classroom/", index_classroom, name="classroom"),
    path("classroom/teacher/", page_classroom_teacher, name="classroom-teacher"),
    path("classroom/student/", page_classroom_student, name="classroom-student"),
    path("launch/", page_class_launch, name="class_launch"),
    path("join/<str:class_code>", class_join, name="class_join"),
    path(
        "single-course-class/registration/",
        SingleCourseClassRegistrationView.as_view(),
        name="single_course_class_registration",
    ),
    path("api/", include(router.urls)),
]
