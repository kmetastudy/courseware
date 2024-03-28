from rest_framework import serializers
from core.custom_fields import JSONTextField

from .models import (
    mClass,
    mSingleCourseClass,
    mClassMember,
    mClassPost,
    mComment,
    mReaction,
    mClassContentAssign,
    mClassInvitation,
    mClassStudyResult,
)


class ClassSerializer(serializers.ModelSerializer):
    active = serializers.BooleanField(default=True, required=False)

    class Meta:
        model = mClass
        fields = "__all__"
        # extra_kwargs = {
        #     "active": {"required": False, "default": True},


class SingleCourseClassSerializer(serializers.ModelSerializer):
    active = serializers.BooleanField(default=True, required=False)

    class Meta:
        model = mSingleCourseClass
        fields = "__all__"


class ClassMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = mClassMember
        fields = "__all__"


class ClassPostSerializer(serializers.ModelSerializer):
    type = serializers.IntegerField(source="get_type_display")

    class Meta:
        model = mClassPost
        fields = "__all__"


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = mComment
        fields = "__all__"


class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = mReaction
        fields = "__all__"


class ChoicesField(serializers.Field):
    """Custom ChoiceField serializer field."""

    def __init__(self, choices, **kwargs):
        """init."""
        self._choices = choices
        super(ChoicesField, self).__init__(**kwargs)

    def to_representation(self, obj):
        """Used while retrieving value for the field."""
        return self._choices[obj]

    def to_internal_value(self, data):
        """Used while storing value for the field."""
        for i in self._choices:
            if self._choices[i] == data:
                return i
        raise serializers.ValidationError(
            "Acceptable values are {0}.".format(list(self._choices.values()))
        )


class ClassContentAssignSerializer(serializers.ModelSerializer):
    json_data = JSONTextField()

    class Meta:
        model = mClassContentAssign
        fields = "__all__"


class ClassInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = mClassInvitation
        fields = "__all__"

    def create(self, validated_data):
        original_code = validated_data.get("code", None)
        id_class = validated_data.get("id_class", None)
        if not original_code:
            code = mClassInvitation.custom_objects.generate_unique_code()
            validated_data["code"] = code

        queryset = mClassInvitation.objects.filter(id_class=id_class)
        if queryset.exists():
            instance = queryset.first()
            return super(ClassInvitationSerializer, self).update(
                instance, validated_data
            )
        else:
            print("create")
            return super(ClassInvitationSerializer, self).create(validated_data)


class ClassStudyResultSerializer(serializers.ModelSerializer):
    json_data = JSONTextField()

    class Meta:
        model = mClassStudyResult
        fields = "__all__"
