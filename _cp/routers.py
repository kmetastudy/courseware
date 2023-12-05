from .api import *
from rest_framework.routers import DefaultRouter

app_name = '_cp'
router = DefaultRouter()
router.register(r'question_book', QuestionBookViewSet)
router.register(r'question_book_branch', QuestionBookBranchViewSet)
router.register(r'course_book', CourseBookViewSet)
router.register(r'course_book_branch', CourseBookBranchViewSet)
router.register(r'testum', TestumViewSet)
router.register(r'testum_unit', TestumUnitViewSet)
router.register(r'lesson', LessonViewSet)
router.register(r'lesson_unit', LessonUnitViewSet)
router.register(r'question_atom', QuestionAtomViewSet)
router.register(r'video_atom', VideoAtomViewSet)
router.register(r'question_solution_text', QuestionSolutionTextViewSet)
router.register(r'question_solution_video', QuestionSolutionVideoViewSet)

router.register(r'course_n', CourseNViewSet)
router.register(r'element_n', ElementNViewSet)
