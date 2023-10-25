from rest_framework import serializers

from _cp.serializer import CourseSerializer, ElementSerializer


class ContentSerializer(serializers.Serializer):
    Course = CourseSerializer()
    Element = ElementSerializer()

    class Meta:
        fields = ['course', 'element']
