from rest_framework import serializers

from _cp.serializer import CourseSerializer, ElementSerializer

from .models import mStudyResult


class ContentSerializer(serializers.ModelSerializer):
    Course = CourseSerializer()
    Element = ElementSerializer()

    class Meta:
        fields = ['course', 'element']


class StudyResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = mStudyResult
        # fields = ['id', 'json_data', 'progress', 'properties', 'point']
        fields = '__all__'
