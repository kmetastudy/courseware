from django.conf import settings
from rest_framework import serializers

from _main.models import courseDetail


class CourseDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = courseDetail
        fields = ["courseId", "courseTitle", "thumnail", "school", "grade", "subject"]
