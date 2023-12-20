import json

from rest_framework import serializers
from .models import *


class QuestionBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionBook
        fields = '__all__'


class QuestionBookBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionBookBranch
        fields = '__all__'


class QuestionAtomSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionAtom
        fields = '__all__'


class VideoAtomSerializer(serializers.ModelSerializer):
    class Meta:
        model = mVideoAtom
        fields = '__all__'


class CourseBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = mCourseBook
        fields = '__all__'


class CourseBookBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = mCourseBookBranch
        fields = '__all__'


# class CategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = mCategory
#         fields = '__all__'


# class CategoryMapperSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = mCategoryMapper
#         fields = '__all__'


class TestumSerializer(serializers.ModelSerializer):
    class Meta:
        model = mTestum
        fields = '__all__'


class TestumUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = mTestumUnit
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = mLesson
        fields = '__all__'


class LessonUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = mLessonUnit
        fields = '__all__'


class QuestionSolutionTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionSolutionText
        fields = '__all__'


class QuestionSolutionVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionSolutionVideo
        fields = '__all__'


class CourseNSerializer(serializers.ModelSerializer):
    class Meta:
        model = mCourseN
        fields = '__all__'


class ElementNSerializer(serializers.ModelSerializer):
    class Meta:
        model = mElementN
        fields = '__all__'


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = mCourse
        fields = '__all__'


class ElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = mElement
        fields = '__all__'


class MyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = mCourseN
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        textfield_content = representation.get('json_data', None)
        if textfield_content:
            try:
                representation['json_data'] = json.loads(textfield_content)
            except json.JSONDecodeError as e:
                print("JSONDecodeError in MyModelSerializer", str(e))

        return representation

    def to_internal_value(self, data):
        json_data = data.get('json_data', None)
        print("to_internal_value > json data type: ", type(json_data))
        if json_data and not isinstance(json_data, str):
            try:
                print("to_internal_valu > dump")
                data['json_data'] = json.dumps(json_data)
            except (TypeError, ValueError):
                raise serializers.ValidationError("유효하지 않은 JSON 형식입니다.")

        return super().to_internal_value(data)
