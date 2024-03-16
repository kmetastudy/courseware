from rest_framework import serializers
import json


class JSONTextField(serializers.CharField):
    def to_representation(self, value):
        # DB에서 가져온 문자열을 파이썬 객체로 변환
        if value:
            return json.loads(value)
        return value

    def to_internal_value(self, data):
        # 입력받은 파이썬 객체를 JSON 문자열로 변환
        if isinstance(data, (dict, list)):
            return json.dumps(data)
        return super().to_internal_value(data)
