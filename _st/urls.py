from django.urls import path, include

from .views import index, get_content, get_element_list, update_study_result_info
from .routers import router
from .results import create_study_result


app_name = '_st'

urlpatterns = [
    path('', index, name='index'),
    path('get-content/', get_content, name='get_content'),
    path('get-element-list/', get_element_list, name='get_element_list'),
    path('updatestudyresultinfo/', update_study_result_info,
         name='update_study_result_info'),
    path('api/', include(router.urls)),

    path("api/create-study-result/", create_study_result,
         name='create_study_result'),
]
