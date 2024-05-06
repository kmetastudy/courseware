from django.conf import settings
from rest_framework import serializers

from _cm.models import courseDetail
from _main.serializers import CourseDetailSerializer
from _school.models import mSchool, mSchoolCourse, mSchoolNotice, mSchoolSection


class CourseSerializer(serializers.ModelSerializer):

    course = CourseDetailSerializer(read_only=True)

    class Meta:
        model = mSchoolCourse
        fields = ["course"]


class SectionSerializer(serializers.ModelSerializer):

    courses = CourseSerializer(many=True)
    # course_detail = courseDetail.objects.filter()

    class Meta:
        model = mSchoolSection
        fields = ["title", "courses"]


class NoticeSerializer(serializers.ModelSerializer):

    class Meta:
        model = mSchoolNotice
        fields = "__all__"


class SchoolSerializer(serializers.ModelSerializer):

    notice = NoticeSerializer(many=True, read_only=True)

    class Meta:
        model = mSchool
        fields = ["id", "title", "institution_type", "img_logo", "img_banner", "notice"]
