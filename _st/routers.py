from _st.api import StudyResultViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'study_result', StudyResultViewSet)
