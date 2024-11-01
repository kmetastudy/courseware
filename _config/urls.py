"""_config URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.views.static import serve

from django.views.generic.base import TemplateView

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("auth.urls")),
    path("api/", include("api.urls")),
    path("user/", include("_user.urls")),
    path("", include("_main.urls")),
    path("cp/", include("_cp.urls")),
    path("cm/", include("_cm.urls")),
    path("school/", include("_school.urls")),
    path("st/", include("_st.urls")),
    path("class/", include("_class.urls")),
    path("__debug__/", include("debug_toolbar.urls")),
    path(
        "robots.txt/",
        TemplateView.as_view(
            template_name="_main/robots.txt", content_type="text/plain"
        ),
    ),
]

if settings.DEBUG:  # 개발 환경에서만 사용
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
