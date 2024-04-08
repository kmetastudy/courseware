from collections import Counter
import uuid
import json
import copy
from typing import List, Dict, Optional
from datetime import timedelta, datetime

from django.db import transaction
from django.utils import timezone, dateparse

from .models import (
    mClass,
    mSingleCourseClass,
    mClassContentAssign,
    mClassStudyResult,
    mClassMember,
)
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
    """
    Depercated
    Use below "AssignService" instead
    """

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

    def _find_min_index_greater_than_current(self, data: List, current_index):
        """
        현재 인덱스보다 큰 인덱스를 가진 요소들 중에서 최소값을 찾습니다.
        해당값의 index를 반환합니다.
        """
        candidates = [
            (index, value) for index, value in enumerate(data) if index > current_index
        ]

        # candidates가 비어있지 않다면, 최소값을 가진 요소의 인덱스를 반환합니다.
        if candidates:
            min_index, _ = min(candidates, key=lambda x: x[1])
            return min_index

        # candidates가 비어있다면, None을 반환합니다.
        return None

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

    def _create_scheduler_list_v2(
        self, lists: List[Dict], start_date, end_date
    ) -> List[Dict]:
        """
        차시가 chapter를 걸치지 않게 수정.
        """
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
        scheduler_index = 0
        current_date = start_date
        current_period = 1
        for i, distribution in enumerate(distributions):
            current_date = start_date + timedelta(days=i)

            distributed = 0  # 실제 배정된 수
            while distributed < distribution:
                target = scheduler_list[scheduler_index]
                scheduler_index += 1
                target["date"] = ""
                target["period"] = ""
                if target["type"] == 0:
                    if distributed != 0:
                        left_distributed = distribution - distributed
                        for _ in range(left_distributed):
                            index_to_add_distribution = (
                                self._find_min_index_greater_than_current(
                                    distributions, i
                                )
                            )
                            if index_to_add_distribution is not None:
                                distributions[index_to_add_distribution] += 1
                        break
                else:
                    target["date"] = current_date.strftime("%Y-%m-%dT%H:%M:%SZ")
                    target["period"] = i + 1
                    target["show"] = True
                    distributed += 1
                    current_period = i + 1

        for item in scheduler_list:
            item.setdefault("date", "")
            item.setdefault("period", "")
            if item["type"] != 0 and item["date"] == "":
                item["date"] = current_date.strftime("%Y-%m-%dT%H:%M:%SZ")
                item["period"] = current_period
                item["show"] = True

        return scheduler_list

    def _update_scheduler_period(self, scheduler_list):
        current_period = 0
        current_date = None

        for data in scheduler_list:
            if data["type"] == 0:
                current_period = 0
                continue

            if data["date"] != current_date:
                current_period += 1
                current_date = data["date"]

            data["period"] = current_period

        return scheduler_list

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

        json_data = {}
        condition = self._create_base_condition(
            start_date=self.start_date, end_date=self.end_date
        )
        scheduler_list = self._create_scheduler_list_v2(
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


class AssignService:
    def __init__(self) -> None:
        pass

    def _distribute_date(self, start_date, end_date, N):
        """
        날짜의 범위를, N개의 구간으로 나눈다.
        """
        diff = (end_date - start_date) / (N - 1)
        return [start_date + diff * idx for idx in range(N - 1)] + [end_date]

    def _create_distributed_date_matrix(self, distributions, scheduler_list):
        """
        date 로 이루어진 일차원 배열을 chapter 단위로 묶는다.
        다른 chapter에 소속된 branch는 다른 날짜를 가지게 한다.
        [[date1, date2, ...], [date1, date2, ...], ...]
        """
        scheduler_index = 0
        dates = []

        for i in range(len(distributions)):
            current_date = distributions[i][0]
            distribution = distributions[i][1]

            distributed = 0  # 실제 배정된 수
            while distributed < distribution:
                if scheduler_index >= len(scheduler_list):
                    break
                target = scheduler_list[scheduler_index]
                scheduler_index += 1

                if target["type"] == 0:
                    dates.append([])
                    if distributed != 0:
                        left_distribution = distribution - distributed
                        if i + 1 < len(distributions):
                            distributions[i + 1][1] += left_distribution
                            break
                        # break
                else:
                    if len(dates) > 0:
                        dates[-1].append(current_date)
                        distributed += 1
        return dates

    def _flatten_frequencies(self, arr):
        """
        평준화시키는 작업을 한다.
        허용된 날짜 내에서, 한 날짜가 너무 많은 수업을 가지지 않도록 조정한다.
        같은 챕터 내의 branch들에 대한 평준화를 하기 때문에, 날짜가 넘어가지 않는다.
        [0315, 0315, 0315, 0316, 0316, 0316, 0317] -> [0315, 0315, 0316, 0316, 0316, 0317, 0317]
        """
        # 빈도수 계산
        freq = Counter(arr)

        # 요소별 빈도수로 정렬된 리스트 생성
        freq_sorted = sorted(freq.items(), key=lambda x: x[1], reverse=True)

        # 빈도수를 평준화하기 위한 전략 구현
        # 최빈값과 최소값의 빈도수를 이용하여 평준화 시도
        for _ in range(len(freq_sorted)):
            max_freq_item = freq_sorted[0]  # 가장 빈도수가 높은 요소
            min_freq_item = freq_sorted[-1]  # 가장 빈도수가 낮은 요소

            # 최대 빈도수를 갖는 요소의 빈도수를 줄이고, 최소 빈도수를 갖는 요소의 빈도수를 늘림
            if max_freq_item[1] > min_freq_item[1] + 1:
                freq[max_freq_item[0]] -= 1
                freq[min_freq_item[0]] += 1
                freq_sorted = sorted(freq.items(), key=lambda x: x[1], reverse=True)
            else:
                break

        # 조정된 빈도수를 바탕으로 새로운 배열 생성
        new_arr = []
        for item, frequency in freq.items():
            new_arr.extend([item] * frequency)

        return sorted(new_arr)

    def _set_values(self, date_matrix, scheduler_list):
        """
        chapter: {period: 0, date: ""}
        branch: {period: 1, date: "2024-03-30T00:00:00Z", show: True}
        """
        scheduler_idx = 0
        current_date = None
        for dates in date_matrix:
            period = 0
            # chapter
            target = scheduler_list[scheduler_idx]
            target["period"] = period
            target["date"] = ""
            scheduler_idx += 1
            current_date = None
            for date in dates:
                # branch
                target = scheduler_list[scheduler_idx]
                scheduler_idx += 1

                if target["type"] == 0:
                    continue

                if date != current_date:
                    period += 1
                    current_date = date

                target["date"] = date
                target["period"] = period
                target["show"] = True

        return scheduler_list

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

    def create_scheduler_list(self, start_date, end_date, lists):
        scheduler_list = copy.deepcopy(lists)

        branches = [item for item in scheduler_list if item["type"] != 0]
        branches_count = len(branches)

        # 날짜를 분배할 때, 시간도 고려되어 분배되었기에, 이것을 다시 제거한다.
        # 2024-03-30T00:10:05Z -> 2024-03-30T00:00:00Z
        distributed_dates = [
            datetime(value.year, value.month, value.day).strftime("%Y-%m-%dT%H:%M:%SZ")
            for value in self._distribute_date(start_date, end_date, branches_count)
        ]

        distributions = [
            [
                value,
                count,
            ]
            for value, count in Counter(distributed_dates).items()
        ]

        date_matrix = self._create_distributed_date_matrix(
            distributions, scheduler_list
        )

        flattend_date_matrix = [self._flatten_frequencies(item) for item in date_matrix]

        result = self._set_values(flattend_date_matrix, scheduler_list)

        return result

    def auto_assign(self, class_instance: mSingleCourseClass):
        id_class = class_instance.id
        id_course = class_instance.id_course
        start_date = class_instance.start_date
        end_date = class_instance.end_date

        course = mCourseN.objects.filter(id=id_course).first()
        course_json_data = json.loads(course.json_data)
        lists = course_json_data.get("lists")

        json_data = {}
        scheduler_list = self.create_scheduler_list(start_date, end_date, lists)
        condition = self._create_base_condition(start_date, end_date)
        json_data["condition"] = condition
        json_data["scheduler_list"] = scheduler_list

        obj = mClassContentAssign(
            id_class=id_class,
            id_course=id_course,
            json_data=json.dumps(json_data, ensure_ascii=False),
        )

        obj.full_clean()
        obj.save()

        return obj


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
