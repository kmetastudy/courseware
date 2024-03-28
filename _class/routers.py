from .views import (
    ClassViewSet,
    SingleCourseClassViewSet,
    ClassMemberViewSet,
    ClassPostViewSet,
    CommentViewSet,
    ReactionViewSet,
    ClassContentAssignViewSet,
    ClassInvitationViewSet,
    ClassStudyResultViewSet,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"class", ClassViewSet)
router.register(r"single-course-class", SingleCourseClassViewSet)
router.register(r"class-member", ClassMemberViewSet)
router.register(r"class-post", ClassPostViewSet)
router.register(r"comment", CommentViewSet)
router.register(r"reaction", ReactionViewSet)
router.register(r"class-content-assign", ClassContentAssignViewSet)
router.register(r"class-invitation", ClassInvitationViewSet)
router.register(r"study-result", ClassStudyResultViewSet)
