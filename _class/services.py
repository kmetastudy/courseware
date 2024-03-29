import uuid
import json
import copy
from typing import List, Dict, Optional
from datetime import timedelta, datetime

from django.db import transaction
from django.utils import timezone, dateparse

from .models import mClass, mClassContentAssign, mClassStudyResult, mClassMember
from .selectors import get_class_course
from _cp.models import mCourseN
from _cp.constants import CP_TYPE_TESTUM, CP_TYPE_LESSON, CP_TYPE_EXAM
from _st.models import mStudyResult
from core.utils.object_helpers import get_object
from core.services import model_update
from rest_framework.views import APIView
from rest_framework.response import Response


class ClassService:
    def __init__(
        self,
    ) -> None:
        pass

    def _create_course_info(self, id: uuid.UUID, title: str):
        return {
            "id": id,
            "instance_id": uuid.uuid4,
            "title": title,
            "closed": False,
        }

    def create_course_info(self, instance: mClass, course: mCourseN):
        course_id = course.id
        course_title = course.title

        json_data = json.loads(instance.json_data)

        courses = json_data["course"]
        course_info = self._create_course_info(id=course_id, title=course_title)
        courses.append(course_info)

        updated_instance = self.update(
            instance=instance, data={"json_data": json.dumps(json_data)}
        )

        return updated_instance

    @transaction.atomic
    def create(
        self,
        id_course: uuid.UUID,
        id_user: uuid.UUID,
        **kwargs,
    ):
        obj = mClass(
            id_course=id_course,
            id_owner=id_user,
            **kwargs,
        )

        obj.full_clean()
        obj.save()

        return obj

    @transaction.atomic
    def update(self, instance: mClass, data):
        instance = get_object(mClass, id=id)

        allowed_fields = [
            "id_owner",
            "title",
            "description",
            "institution",
            "institution_type",
            "start_date",
            "end_date",
            "status",
            "json_data",
            "active",
        ]

        if instance:
            updated_instance, has_updated = model_update(
                instance=instance, fields=allowed_fields, data=data
            )

        return updated_instance


# class ClassContentAssignService
class ClassStudyResultServiceV2:
    def __init__(self):
        pass

    def _create_property(self, scheduler_list):
        for data in scheduler_list:
            data["progress"] = 0
            data["point"] = 0
            data["results"] = []

        return scheduler_list

    @transaction.atomic
    def create_study_result(self, scheduler_list):
        prop = self._create_property(scheduler_list)
        properties = json.dumps({"property": prop}, ensure_ascii=False)

        obj = mStudyResult(
            id_student=self.id_student,
            id_course=self.id_course,
            id_class=self.id_class,
            type=1,
            properties=properties,
        )

        obj.full_clean()
        obj.save()

        return obj

    @transaction.atomic
    def create(
        self,
        id_class: uuid.UUID,
        id_student: uuid.UUID,
        id_course: uuid.UUID,
        **data,
    ):
        obj = mClassStudyResult(
            id_class=id_class,
            id_student=id_student,
            id_course=id_course,
            **data,
        )

        obj.full_clean()

        obj.save()

        return obj

    @transaction.atomic
    def update(self, instance: mClassStudyResult, data):
        instance = get_object(mClassStudyResult, id=id)

        allowed_fields = [
            "type",
            "subtype",
            "title",
            "oreder",
            "index",
            "progress",
            "point",
            "json_data",
            "invalid",
            "version",
        ]

        if instance:
            updated_instance, has_updated = model_update(
                instance=instance, fields=allowed_fields, data=data
            )

        return updated_instance


class ClassContentAssignService:
    def __init__(
        self,
        id_class: uuid.UUID,
        id_course: uuid.UUID,
        start_date: str,
        end_date: str,
    ) -> None:
        self.id_class = id_class
        self.id_course = id_course
        self.start_date = start_date
        self.end_date = end_date

    def _create_base_condition(self, start_date, end_date):
        condition = {
            "scheduler": {
                "onweek": [0, 0, 0, 0, 0, 1, 0],
                "offweek": [0, 0, 0, 0, 0, 0, 0],
                "onday": [],
                "offday": [],
                "assign": [],
            },
            "clinic": {
                "wrong": {"auto": True, "term": "0000-00-01 00:00:00"},
                "weak": {"auto": False, "term": "0000-00-01 00:00:00"},
            },
        }

        first_assign = {
            "index": 0,
            "from": start_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "to": end_date.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "per": 0,
        }

        condition["scheduler"]["assign"].append(first_assign)

        return condition

    def _create_scheduler_list(
        self, lists: List[Dict], start_date=timezone, end_date=timezone
    ) -> List[Dict]:
        scheduler_list = copy.deepcopy(lists)

        branches = [item for item in scheduler_list if item["type"] != 0]
        branches_count = len(branches)

        # 날짜 범위 계산
        date_range = (end_date - start_date).days + 1

        # 각 날짜에 할당할 최대 개수 계산 (균등 분배)
        distributions = [branches_count // date_range] * date_range
        for i in range(branches_count % date_range):
            distributions[i] += 1

        # 날짜 할당
        current_period = 0
        for i, distribution in enumerate(distributions):
            current_date = start_date + timedelta(days=i)
            for _ in range(distribution):
                branches[current_period]["date"] = current_date.strftime(
                    "%Y-%m-%dT%H:%M:%SZ"
                )  # UTC 형식으로 변경
                branches[current_period]["period"] = i + 1  # period 할당
                current_period += 1

        # type이 0인 항목에 대한 date 및 period 처리 코드 수정
        for item in scheduler_list:
            if item["type"] == 0:
                item["date"] = ""  # date가 빈 문자열인 경우
                item["period"] = ""  # period 또한 빈 문자열 할당
            item["show"] = True

        return scheduler_list

    def auto_create_assign(self):
        """
        When you create SingleCourseClass, and having a start_date/end_date, automatically assign course
        """

        course = get_object(mCourseN, id=self.id_course)

        lists = json.loads(course.json_data).get("lists")
        print(lists)

        json_data = {}
        condition = self._create_base_condition(
            start_date=self.start_date, end_date=self.end_date
        )
        scheduler_list = self._create_scheduler_list(
            lists=lists,
            start_date=self.start_date,
            end_date=self.end_date,
        )

        json_data["condition"] = condition
        json_data["scheduler_list"] = scheduler_list

        obj = mClassContentAssign(
            id_class=self.id_class,
            id_course=self.id_course,
            json_data=json.dumps(json_data, ensure_ascii=False),
        )

        obj.full_clean()
        obj.save()

        return obj

    def auto_create_study_result(self):
        return


class ClassStudyResultService:
    def __init__(self) -> None:
        pass

    def _create_property(self, scheduler_list):
        for data in scheduler_list:
            data["progress"] = 0
            data["point"] = 0
            data["results"] = []

        return scheduler_list

    def create_study_result(self, id_class, id_student, id_course, scheduler_list):
        prop = self._create_property(scheduler_list)
        json_data = json.dumps({"property": prop}, ensure_ascii=False)

        obj = mClassStudyResult(
            id_student=id_student,
            id_course=id_course,
            id_class=id_class,
            type=1,
            json_data=json_data,
        )

        obj.full_clean()
        obj.save()

        return obj

    def update_study_result(self, instance: mClassStudyResult, data):
        content_id = uuid.UUID(str(data.get("id_content", None)))

        results = data.get("results", None)
        point = data.get("point", None)
        progress = data.get("progress", None)

        json_data = json.loads(instance.json_data)

        properties = json_data["property"]

        now_utc = timezone.now()
        updated_date = now_utc.isoformat()

        for data in properties:
            if data["id"] == str(content_id):
                data["results"] = json.loads(results)
                data["progress"] = progress
                data["point"] = point
                data["updated_date"] = updated_date

        instance.json_data = json.dumps(json_data, ensure_ascii=False)
        instance.full_clean()
        instance.save()

        return instance
