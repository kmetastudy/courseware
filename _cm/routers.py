from .views import SchoolViewSet

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"school", SchoolViewSet)
