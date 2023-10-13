from rest_framework import serializers
from .models import *


class QuestionBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionBook
        fields = '__all__'


class QuestionBookDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionBookDetail
        fields = '__all__'


class QuestionBookBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionBookBranch
        fields = '__all__'


class QuestionAtomSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionAtom
        fields = '__all__'


class QuestionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionDetail
        fields = '__all__'


class QuestionRelation(serializers.ModelSerializer):
    class Meta:
        model = mQuestionRelation
        fields = '__all__'


class QuestionProtoSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionProto
        fields = '__all__'


class SolutionTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = mSolutionText
        fields = '__all__'


class VideoAtomSerializer(serializers.ModelSerializer):
    class Meta:
        model = mVideoAtom
        fields = '__all__'


class CourseBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = mCourseBook
        fields = '__all__'


class CourseBookDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = mCourseBookDetail
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = mCategory
        fields = '__all__'


class CategoryMapperSerializer(serializers.ModelSerializer):
    class Meta:
        model = mCategoryMapper
        fields = '__all__'


class CourseBookBranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = mCourseBookBranch
        fields = '__all__'


class TestumSerializer(serializers.ModelSerializer):
    class Meta:
        model = mTestum
        fields = '__all__'


class TestumUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = mTestumUnit
        fields = '__all__'


class TestumPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = mTestumPart
        fields = '__all__'


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = mLesson
        fields = '__all__'


class LessonUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = mLessonUnit
        fields = '__all__'


class LessonPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = mLessonPart
        fields = '__all__'


class QuestionSolutionTextSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionSolutionText
        fields = '__all__'


class QuestionSolutionVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = mQuestionSolutionVideo
        fields = '__all__'
