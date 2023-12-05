from datetime import datetime
import json
import logging
from unicodedata import normalize
from typing import Type, Dict, Any
import uuid

from django.db import models

from .constants import CP_TYPE_TESTUM, CP_TYPE_LESSON, CP_TYPE_EXAM
from .models import mMapperN, mCourseBookBranch, mTestum, mTestumUnit, mLesson, mLessonUnit, mQuestionAtom, mVideoAtom, mCourseN, mElementN


class DataValidator:
    def __init__(self):
        self._field_name_cache = {}

    def validate(self, model: Type[models.Model], data: Dict[str, Any]) -> Dict[str, Any]:
        uuid_fields = ['id', 'parent_id']
        valid_data = {}

        for key, value in data.items():
            if key in uuid_fields and value:
                value = self.convert_to_uuid(value)
                if value is None:
                    continue  # Skip invalid UUIDs
            if self.is_valid_field_name(model, key):
                valid_data[key] = value
        return valid_data

    def convert_to_uuid(self, id_to_check: Any) -> uuid.UUID:
        try:
            return uuid.UUID(str(id_to_check))
        except ValueError:
            logging.error(f"Invalid UUID: {id_to_check}")
            return None

    def is_valid_field_name(self, model: Type[models.Model], field_name_to_check: str) -> bool:
        field_names = self.get_field_names(model)
        return field_name_to_check in field_names

    def get_field_names(self, model: Type[models.Model]) -> list[str]:
        if model in self._field_name_cache:
            return self._field_name_cache[model]

        field_names = [field.name for field in model._meta.fields]
        self._field_name_cache[model] = field_names
        return field_names


def convert_branch_recursive(id, lists, contents, kls):
    lists_item = {
        "level": None,
        "type": None,
        "title": None,
        "id": None,
        "units": []
    }
    contents_item = {
        "units": []
    }
    kls_item = {
        "units": []
    }
    lists.append(lists_item)
    contents.append(contents_item)
    kls.append(kls_item)

    query = mCourseBookBranch.objects.filter(id=id).first()
    if not query:
        return

    lists_item['level'] = query.level
    lists_item['type'] = query.type
    lists_item['title'] = query.title
    lists_item['id'] = query.id

    if query.type == CP_TYPE_TESTUM or query.type == CP_TYPE_EXAM:
        convert_testum_recursive(query.id,
                                 lists_item['units'],
                                 contents_item['units'],
                                 kls_item['units'])
    elif query.type == CP_TYPE_LESSON:
        convert_lesson_recursive(query.id,
                                 lists_item['units'],
                                 contents_item['units'],
                                 kls_item['units'])

    branch_ids = query.branch_ids.split(",") if query.branch_ids else []
    for branch_id in branch_ids:
        convert_branch_recursive(branch_id, lists, contents, kls)


def convert_testum_recursive(branch_id, lists_units, contents_units, kls_units):
    testum = mTestum.objects.filter(id=branch_id).first()
    if not testum:
        return

    unit_ids = testum.unit_ids.split(",") if testum.unit_ids else []

    for unit_id in unit_ids:
        types = []
        kl = []
        unit = mTestumUnit.objects.filter(id=unit_id).first()
        if not unit:
            continue
        # lists_item['units'].append(unit_id)
        content_ids = unit.content_ids.split(",") if unit.content_ids else []
        for content_id in content_ids:
            add_atom_type(content_id, types)
            add_kl(content_id, kl)

        lists_units.append({"id": unit_id, "types": types})
        contents_units.append({"ids": content_ids, "types": types})
        kls_units.append({"kl": kl, "types": types})


def convert_lesson_recursive(branch_id, lists_units, contents_units, kls_units):
    testum = mLesson.objects.filter(id=branch_id).first()
    if not testum:
        return

    unit_ids = testum.unit_ids.split(",") if testum.unit_ids else []

    for unit_id in unit_ids:
        types = []
        kl = []
        unit = mLessonUnit.objects.filter(id=unit_id).first()
        if not unit:
            continue
        # lists_item['units'].append(unit_id)
        content_ids = unit.content_ids.split(",") if unit.content_ids else []
        for content_id in content_ids:
            add_atom_type(content_id, types)
            add_kl(content_id, kl)

        lists_units.append({"id": unit_id, "types": types})
        contents_units.append({"ids": content_ids, "types": types})
        kls_units.append({"kl": kl, "types": types})


def add_atom_type(atom_id, types):
    if mQuestionAtom.objects.filter(id=atom_id).exists():
        types.append("q")
    elif mVideoAtom.objects.filter(id=atom_id).exists():
        types.append("v")


def add_kl(atom_id, kl):
    value_list = mMapperN.objects.filter(id_myself=atom_id).values(
        'id_root_complex', 'id_leaf_complex')
    kl_values = [{"root": kl_value['id_root_complex'],
                  "leaf": kl_value["id_leaf_complex"]} for kl_value in value_list]
    kl.append(kl_values)


def create_time_data(course_n):
    try:
        json_data = json.loads(course_n.json_data)

        lists = json_data['lists']
        contents = json_data['contents']

        contents_size = len(contents)
        for i in range(contents_size):
            content_data = contents[i]
            list_data = lists[i]

            content_units = content_data['units']
            list_units = list_data['units']
            units_size = len(content_units)

            list_time = 0
            for j in range(units_size):
                content_unit = content_units[j]
                list_unit = list_units[j]

                ids = content_unit["ids"]
                types = content_unit["types"]
                seconds = []
                for k in range(len(types)):
                    if types[k] == "v":
                        video = mElementN.objects.filter(id=ids[k]).first()
                        if not video:
                            continue

                        json_video = json.loads(video.json_data)

                        video_str_time = json_video["time"]
                        start, end = video_str_time.split("-")
                        start_seconds = convert_hhmmss_to_seconds(start)
                        end_seconds = convert_hhmmss_to_seconds(end)

                        seconds.append(abs(end_seconds-start_seconds))
                    elif types[k] == 'q':
                        seconds.append(0)

                content_unit["times"] = seconds  # time of each element
                list_unit['time'] = sum(seconds)  # total time of unit
                list_time += (sum(seconds))

            list_data['time'] = list_time
        return json_data
    except Exception as e:
        print("create_time_data failed : ", e)
        return None


def convert_hhmmss_to_seconds(time):
    hours, minutes, seconds = map(int, time.split(":"))
    return hours*3600+minutes*60+seconds
