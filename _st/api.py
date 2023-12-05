import json
import uuid


from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import mStudyResult
from _cp.models import mCourseN
from .serializer import StudyResultSerializer


class StudyResultViewSet(viewsets.ModelViewSet):
    queryset = mStudyResult.objects.all()
    serializer_class = StudyResultSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = ['id_student', 'id_course', 'id_content']

    def get_property_data(self, pk):
        query = self.get_object()

        if not query.properties:
            return {}

        try:
            properties = json.loads(query.properties)
        except json.JSONDecodeError:
            return {}

        return properties

    @action(detail=False, methods=['get'])
    def filter_json_data(self, request, pk=None):

        return Response()

    @action(detail=True, methods=['get', 'post', 'patch', 'delete'])
    def manage_property(self, request, pk=None):
        if request.method == 'GET':
            return self.get_property(request, pk)

        if request.method == 'POST':
            return self.create_property(request, pk)

        if request.method == 'PATCH':
            return self.update_property(request, pk)

        if request.method == 'DELETE':
            return self.delete_property(request, pk)

    def get_property(self, request, pk=None):
        property_data = self.get_property_data(pk)

        return Response(data=property_data, status=status.HTTP_200_OK)

    def create_property(self, request, pk=None):
        course_id = request.data['course_id']
        student_id = request.data['student_id']
        course_json_data = mCourseN.objects.filter(id=course_id)

        if not course_json_data.exists():
            print("Invalid course_id")
            return Response(status=status.HTTP_404_NOT_FOUND)

        dic_properties = {}
        study_property = []

        lists = course_json_data['lists']

        for i in range(len(lists)):
            list_data = lists[i]
            property_data = {
                'id': list_data['id'],
                'title': list_data['title'],
                'type': list_data['level'],
                # 'level': content['level'],
                # 'date': content['date'],
                # 'show': content['show'],
                'progress': 0,
                'point': 0,
                'results': [],
                'units': list_data['units']
            }
            study_property.append(property_data)

        dic_properties['property'] = study_property
        json_properties = json.dumps(dic_properties, ensure_ascii=False)

        study_result = mStudyResult.objects.create(
            id_course=uuid.UUID(course_id),
            id_student=uuid.UUID(student_id),
            properties=json_properties,
            type=1,
        )

        return Response(status=status.HTTP_201_CREATED)

    def update_property(self, request, pk=None):
        properties = request.data['properties']
        point = int(request.data['point'])
        progress = int(request.data['progress'])
        content_id = request.data['content_id']

        study_result = mStudyResult.objects.filter(
            # id_class =
        )
        property_data = self.get_property_data(pk)

        return Response(status=status.HTTP_200_OK)

    def delete_property(self, request, pk=None):
        property_data = self.get_property_data(pk)
        return Response(status=status.HTTP_204_NO_CONTENT)
