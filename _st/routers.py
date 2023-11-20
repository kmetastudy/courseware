from _st.api import StudyResultViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'student_study_result', StudyResultViewSet)
