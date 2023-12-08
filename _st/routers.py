from _st.api import StudyResultViewSet, DemoStudyResultViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'study_result', StudyResultViewSet)
router.register(r'demo_study_result', DemoStudyResultViewSet)
