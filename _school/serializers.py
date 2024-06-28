from django.conf import settings
from rest_framework import serializers

from _cm.models import courseDetail
from _cm.serializers import CourseDetailSerializer
from _school.models import (
    SectionCategory,
    mSchool,
    mSchoolCourse,
    mSchoolNotice,
    mSchoolSection,
)


class CourseSerializer(serializers.ModelSerializer):

    id = serializers.UUIDField(required=False)
    course = CourseDetailSerializer(read_only=True)
    modified_course_title = serializers.CharField(required=False)
    modified_thumnail = serializers.CharField(required=False)

    class Meta:
        model = mSchoolCourse
        fields = ["id", "course", "modified_course_title", "modified_thumnail"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # data = {}

        # if instance.modified_course_title:
        #     data["courseTitle"] = instance.modified_course_title
        # else:
        #     data["courseTitle"] = instance.course.courseTitle

        # if instance.modified_thumnail:
        #     data["thumnail"] = instance.modified_thumnail
        # else:
        #     data["thumnail"] = instance.course.thumnail

        data["course"]["courseTitle"] = (
            instance.modified_course_title or instance.course.courseTitle
        )
        data["course"]["thumnail"] = (
            instance.modified_thumnail or instance.course.thumnail
        )

        return data


class SectionCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionCategory
        fields = ["name", "img_icon"]


class SectionSerializer(serializers.ModelSerializer):

    courses = CourseSerializer(many=True)
    category = SectionCategorySerializer()

    class Meta:
        model = mSchoolSection
        fields = ["category", "title", "courses"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # 위에 방법 보다 이게 더 좋아보인다
        if not instance.category:
            representation["category"] = {
                "name": instance.title,
                "img_icon": instance.img_icon,
            }
        return representation


class SchoolNoticeSerializer(serializers.ModelSerializer):

    class Meta:
        model = mSchoolNotice
        fields = "__all__"


class SchoolSerializer(serializers.ModelSerializer):

    notice = SchoolNoticeSerializer(many=True, read_only=True)

    class Meta:
        model = mSchool
        fields = ["id", "title", "institution_type", "img_logo", "img_banner", "notice"]
