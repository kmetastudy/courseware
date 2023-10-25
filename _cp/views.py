from django.shortcuts import render, get_object_or_404
from django.views import View
from django.db import models
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

import json
import uuid
from _cp.models import (mCourseBook,
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
                        # new
                        mCourse,
                        mElement)

from typing import Type, Dict, Any
import logging

# rest api
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import status
from rest_framework.pagination import LimitOffsetPagination
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
                         # New
                         CourseSerializer,
                         ElementSerializer,
                         )

# django-filter(23.3)
from django_filters.rest_framework import DjangoFilterBackend
# Create your views here.


def index(request):
    return render(request, "_cp/index.html")

# BASIC CRUD


class QuestionBookViewSet(viewsets.ModelViewSet):
    queryset = mQuestionBook.objects.all()
    serializer_class = QuestionBookSerializer


# class QuestionBookBranchViewSet(viewsets.ModelViewSet):
#     queryset = mQuestionBookBranch.objects.all()
#     serializer_class = QuestionBookBranchSerializer

class QuestionBookBranchViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionBookBranchSerializer
    queryset = mQuestionBookBranch.objects.all()

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['parent_id']
    ordering = ['created_at']  # default 정렬을 지정


class CourseBookViewSet(viewsets.ModelViewSet):
    queryset = mCourseBook.objects.all()
    serializer_class = CourseBookSerializer


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


class CourseViewSet(viewsets.ModelViewSet):
    queryset = mCourse.objects.all()
    serializer_class = CourseSerializer

    @action(detail=True, methods=['get'])
    def get_json_field(self, request, pk=None):
        obj = self.get_object()
        json_field = obj.json_data
        print("course id: ", obj.id)
        # Convert the JSON-like string to a Python dictionary
        json_dict = json.loads(json_field)

        # Extract 'lists', 'contents', or 'kl' based on the query parameter
        field_type = request.query_params.get('field_type')
        if field_type in ['lists', 'contents', 'kl']:
            data = json_dict.get(field_type)
        else:
            data = {'error': 'Invalid field_type parameter'}

        return Response(data)


class ElementViewSet(viewsets.ModelViewSet):
    queryset = mElement.objects.all()
    serializer_class = ElementSerializer


# Complicate Logic


def get_full_course(request):
    data_validator = DataValidator()
    # result = []

    book_id = data_validator.convert_to_uuid(request.POST.get("id"))
    book_query = mCourseBook.objects.filter(id=book_id)
    if book_query.count() == 0:
        return JsonResponse({"message": "No matched data"})

    book_data = list(book_query.values())[0]
    book_data["children"] = []
    # result.append(book_data)

    print(book_data['title'])

    if book_data["branch_ids"] == None or book_data["branch_ids"] == "":
        return JsonResponse({"message": "No chapter", "result": book_data})

    chapter_ids = book_data["branch_ids"].split(",")

    for chapter_id in chapter_ids:
        chapter_query = mCourseBookBranch.objects.filter(id=chapter_id)
        if chapter_query.count() == 0:
            continue
        chapter_data = list(chapter_query.values())[0]
        # result.append(chapter_data)
        book_data["children"].append(chapter_data)

        if chapter_data["branch_ids"] == None or chapter_data["branch_ids"] == "":
            continue

        branch_ids = chapter_data["branch_ids"].split(",")
        chapter_data["children"] = []
        for branch_id in branch_ids:
            branch_query = mCourseBookBranch.objects.filter(id=branch_id)
            if branch_query.count() == 0:
                continue
            branch_data = list(branch_query.values())[0]
            # result.append(branch_data)
            chapter_data["children"].append(branch_data)

    # return JsonResponse({"result": result})
    return JsonResponse({"result": book_data})
    # 데이터를 ID 기준으로 매핑하여 쉽게 찾을 수 있게 합니다.

# TOOLS


class DataValidator:
    def __init__(self):
        self._field_name_cache = {}

    def validate(self, model: Type[models.Model], data: Dict[str, Any]) -> Dict[str, Any]:
        uuid_fields = ['id', 'parent_id']
        valid_data = {}

        for key, value in data.items():
            if key in uuid_fields and value:
                value = self.convert_to_uuid(value)
                if value is None:
                    continue  # Skip invalid UUIDs
            if self.is_valid_field_name(model, key):
                valid_data[key] = value
        return valid_data

    def convert_to_uuid(self, id_to_check: Any) -> uuid.UUID:
        try:
            return uuid.UUID(str(id_to_check))
        except ValueError:
            logging.error(f"Invalid UUID: {id_to_check}")
            return None

    def is_valid_field_name(self, model: Type[models.Model], field_name_to_check: str) -> bool:
        field_names = self.get_field_names(model)
        return field_name_to_check in field_names

    def get_field_names(self, model: Type[models.Model]) -> list[str]:
        if model in self._field_name_cache:
            return self._field_name_cache[model]

        field_names = [field.name for field in model._meta.fields]
        self._field_name_cache[model] = field_names
        return field_names
