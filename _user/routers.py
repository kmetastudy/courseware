from .views import UserViewSet, CoursePurchasesViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'user', UserViewSet)
router.register(r'course-purchases', CoursePurchasesViewSet)
