from rest_framework import serializers
from _cm.models import courseDetail, Notice, FAQ


class CourseDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = courseDetail
        fields = "__all__"


class NoticeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notice
        fields = "__all__"


class FAQSerializer(serializers.ModelSerializer):

    class Meta:
        model = FAQ
        fields = "__all__"
