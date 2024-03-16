from rest_framework import serializers
from .models import mUser, mCoursePurchases
from core.custom_fields import JSONTextField


class UserSerializer(serializers.ModelSerializer):
    json_data = JSONTextField()

    class Meta:
        model = mUser
        fields = ["id", "full_name", "email", "json_data"]


class CoursePurchasesSerializer(serializers.ModelSerializer):
    class Meta:
        model = mCoursePurchases
        fields = "__all__"


class SignUpSerializer(serializers.ModelSerializer):
    json_data = JSONTextField(required=False)

    class Meta:
        model = mUser
        fields = [
            "email",
            "password",
            "full_name",
            "nickname",
            "type",
            "grade",
            "gender",
            "json_data",
        ]
        extra_kwargs = {"password": {"write_only": True}}
