import uuid

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers

from core.utils.object_helpers import get_object
from .services import ClassStudyResultService
from .models import mClass, mClassStudyResult


class ClassCreateAPI(APIView):
    def post(self, request):
        # Implement your create logic here
        return Response("Create API")


class ClassRetrieveAPI(APIView):
    def get(self, request, id):
        # Implement your retrieve logic here
        return Response(f"Retrieve API for id {id}")


class ClassUpdateAPI(APIView):
    def put(self, request, id):
        # Implement your update logic here
        return Response(f"Update API for id {id}")


class ClassDeleteAPI(APIView):
    def delete(self, request, id):
        # Implement your delete logic here
        return Response(f"Delete API for id {id}")


class ClassStudyResultUpdatePropertyApi(APIView):
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = mClassStudyResult

    def patch(self, request, pk):
        data = request.data

        id_class = uuid.UUID(str(data.get("id_class", None)))
        id_student = uuid.UUID(str(data.get("id_student", None)))
        id_course = uuid.UUID(str(data.get("id_course", None)))

        class_study_result = get_object(
            id_class=id_class, id_student=id_student, id_course=id_course
        )

        service = ClassStudyResultService()
        updated_class_study_result = service.update_study_result(
            instance=class_study_result, **data
        )

        serializer = self.OutputSerializer(updated_class_study_result)

        return Response(data=serializer.data, status=status.HTTP_200_OK)
