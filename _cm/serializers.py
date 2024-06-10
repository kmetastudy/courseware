from rest_framework import serializers
from _main.models import courseDetail


class CourseDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = courseDetail
        fields = "__all__"
