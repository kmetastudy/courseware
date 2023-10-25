from django.urls import path, include
from _st.views import index, get_content

app_name = '_st'

urlpatterns = [
    path('', index, name='index'),
    path('get-content/', get_content, name='get_content'),
]
