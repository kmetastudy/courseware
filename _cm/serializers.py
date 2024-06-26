from rest_framework import serializers
from _cm.models import Post, courseDetail, Notice, FAQ


class CourseDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = courseDetail
        fields = "__all__"


class NoticeSerializer(serializers.ModelSerializer):

    created_at = serializers.DateTimeField(format="%Y.%m.%d")

    class Meta:
        model = Notice
        fields = "__all__"


class FAQSerializer(serializers.ModelSerializer):

    created_at = serializers.DateTimeField(format="%Y.%m.%d")

    class Meta:
        model = FAQ
        fields = "__all__"


class PostSerializer(serializers.ModelSerializer):

    created_at = serializers.DateTimeField(format="%Y년 %m월 %d일")

    class Meta:
        model = Post
        fields = "__all__"
