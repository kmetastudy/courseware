import json

from django.views import View
from django.http import JsonResponse
from django.utils.decorators import method_decorator

from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import mStudyResult, mDemoStudyResult
from .serializer import StudyResultSerializer, DemoStudyResultSerializer
from .results import create_study_result, get_study_result, update_study_result
from .results import create_demo_study_result, get_demo_study_result, update_demo_study_result
from _user.utils import demo_student_id
from _user.decorators import jwt_login_required


# @method_decorator(jwt_login_required, name='dispatch')
class StudyResultViewSet(viewsets.ModelViewSet):
    queryset = mStudyResult.objects.all()
    serializer_class = StudyResultSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['id_student', 'id_course', 'id_content']

    @action(detail=False, methods=['get', 'post', 'patch', 'delete'])
    def properties(self, request):
        """
        Handle properties of Study result
        api/study_result/<id>/properties/
        """
        if request.method == 'GET':
            course_id = request.query_params.get("course_id")
            student_id = request.query_params.get("student_id")

            query = get_study_result(
                course_id=course_id, student_id=student_id)

            properties = json.loads(query.properties)['property']

            # return JsonResponse({"message": "Get mStudyResult properties", "result": properties})
            return Response(data=properties)

        if request.method == 'POST':
            course_id = request.POST.get("course_id")
            student_id = request.POST.get("student_id")

            query = create_study_result(
                course_id=course_id, student_id=student_id)

            properties = json.loads(query.properties["property"])

            return Response(data=properties)

        if request.method == 'PATCH':
            """
            data values
            course_id, student_id, content_id, results, point, progress
            """
            data = request.data

            query, err_response = update_study_result(**data)

            if err_response:
                return err_response

            properties = json.loads(query.properties)['property']

            return Response(data=properties)


class DemoStudyResultViewSet(viewsets.ModelViewSet):
    queryset = mDemoStudyResult.objects.all()
    serializer_class = DemoStudyResultSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['id_student', 'id_course', 'id_content']

    @action(detail=False, methods=['get', 'post', 'patch', 'delete'])
    def properties(self, request):
        """
        Handle properties of Demo Study result
        api/demo_study_result/<id>/properties/
        """

        student_id = demo_student_id(request=request)

        if request.method == 'GET':
            course_id = request.query_params.get("course_id")

            query = get_demo_study_result(
                course_id=course_id, student_id=student_id)

            properties = json.loads(query.properties)['property']
            return Response(data=properties)

        elif request.method == 'POST':
            course_id = request.POST.get("course_id")
            query = create_demo_study_result(
                course_id=course_id, student_id=student_id)

            properties = json.loads(query.properties["property"])

            return Response(data=properties)

        elif request.method == 'PATCH':
            """
            data values
            course_id, student_id, content_id, results, point, progress
            """
            data = request.data
            data["student_id"] = student_id

            query, err_response = update_demo_study_result(**data)

            if err_response:
                return err_response

            properties = json.loads(query.properties)['property']

            return Response(data=properties)
