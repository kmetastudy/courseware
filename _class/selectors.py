import json
from .models import mClass


def get_class_course(instance: mClass):
    json_data = json.loads(instance.json_data)
    course = json_data["course"]

    return course
