import json

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
# django-filter(23.3)
from django_filters.rest_framework import DjangoFilterBackend

from .models import (mCourseBook,
                     mCourseBookBranch,
                     mQuestionBook,
                     mQuestionBookBranch,
                     mQuestionAtom,
                     mVideoAtom,
                     mLesson,
                     mLessonUnit,
                     mTestum,
                     mTestumUnit,
                     mQuestionSolutionText,
                     mQuestionSolutionVideo,
                     # mCourseN, mElementN은 안정화되면 지우자
                     mCourseN,
                     mElementN)

from .serializer import (QuestionBookSerializer,
                         QuestionBookBranchSerializer,
                         QuestionAtomSerializer,
                         VideoAtomSerializer,
                         CourseBookSerializer,
                         CourseBookBranchSerializer,
                         TestumSerializer,
                         TestumUnitSerializer,
                         LessonSerializer,
                         LessonUnitSerializer,
                         QuestionSolutionTextSerializer,
                         QuestionSolutionVideoSerializer,
                         CourseNSerializer,
                         ElementNSerializer,
                         )

from .utils import create_time_data


class QuestionBookViewSet(viewsets.ModelViewSet):
    queryset = mQuestionBook.objects.all()
    serializer_class = QuestionBookSerializer


class QuestionBookBranchViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionBookBranchSerializer
    queryset = mQuestionBookBranch.objects.all()

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['parent_id']
    ordering = ['created_date']  # default 정렬을 지정


class CourseBookViewSet(viewsets.ModelViewSet):
    queryset = mCourseBook.objects.all()
    serializer_class = CourseBookSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['title']
    ordering = ['created_date']


class CourseBookBranchViewSet(viewsets.ModelViewSet):
    queryset = mCourseBookBranch.objects.all()
    serializer_class = CourseBookBranchSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    # search_fields = ['parent_id']
    filterset_fields = ["parent_id"]


class TestumViewSet(viewsets.ModelViewSet):
    queryset = mTestum.objects.all()
    serializer_class = TestumSerializer


class TestumUnitViewSet(viewsets.ModelViewSet):
    queryset = mTestumUnit.objects.all()
    serializer_class = TestumUnitSerializer


class LessonViewSet(viewsets.ModelViewSet):
    queryset = mLesson.objects.all()
    serializer_class = LessonSerializer


class LessonUnitViewSet(viewsets.ModelViewSet):
    queryset = mLessonUnit.objects.all()
    serializer_class = LessonUnitSerializer


class QuestionAtomViewSet(viewsets.ModelViewSet):
    queryset = mQuestionAtom.objects.all()
    serializer_class = QuestionAtomSerializer


class VideoAtomViewSet(viewsets.ModelViewSet):
    queryset = mVideoAtom.objects.all()
    serializer_class = VideoAtomSerializer


class QuestionSolutionTextViewSet(viewsets.ModelViewSet):
    queryset = mQuestionSolutionText.objects.all()
    serializer_class = QuestionSolutionTextSerializer


class QuestionSolutionVideoViewSet(viewsets.ModelViewSet):
    queryset = mQuestionSolutionVideo.objects.all()
    serializer_class = QuestionSolutionVideoSerializer


class CourseNViewSet(viewsets.ModelViewSet):
    queryset = mCourseN.objects.all()
    serializer_class = CourseNSerializer

    @action(detail=True, methods=['get'])
    def get_json_field(self, request, pk=None):
        obj = self.get_object()
        json_field = obj.json_data
        json_dict = json.loads(json_field)

        # Extract 'lists', 'contents', or 'kl' based on the query parameter
        field_type = request.query_params.get('field_type')
        if field_type:

            if field_type in ['lists', 'contents', 'kl']:
                data = json_dict.get(field_type)
            else:
                data = {'error': 'Invalid field_type parameter'}
        else:
            data = json_dict

        return Response(data)

    @action(detail=True, methods=['patch'])
    def add_time(self, request, pk=None):
        print("add_time")
        instance = self.get_object()

        updated_json_data = create_time_data(instance)
        if not updated_json_data:
            return Response(data={})

        instance.json_data = json.dumps(updated_json_data)
        instance.save()
        # return Response(self.get_serializer(instance).data)
        return Response(updated_json_data)


class ElementNViewSet(viewsets.ModelViewSet):
    queryset = mElementN.objects.all()
    serializer_class = ElementNSerializer
