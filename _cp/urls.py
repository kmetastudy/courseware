from django.urls import path, include
from . import views as v
from .views import *
from .routers import router


urlpatterns = [
    path('', v.index, name='cp'),
    path('api/', include(router.urls)),

    path('get-full-course/', v.get_full_course, name='get_full_course'),

    # 한번만 사용함
    # 나중에 필요없으면 빼자.
    path('transform-course-all/', v.transform_course_all,
         name='transform_course_all'),
    # path('transform-course-all-test/', v.transform_course_all_test,
    #      name='transform_course_all_test')
    path('migrate-element/', v.migrate_element, name='migrate_element'),

    path('api/convert-course-to-json/',
         v.convert_course_to_json, name='convert_course_to_json')
]
