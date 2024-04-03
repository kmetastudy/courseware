from django.test import TestCase

# Create your tests here.
from datetime import timedelta, datetime
from _cp.models import mCourseN
from typing import List, Dict
from django.utils import timezone
from datetime import timedelta
import uuid
import json
import copy
from core.utils.object_helpers import get_object


class testAssignV0:
    def __init__(self) -> None:
        from datetime import timedelta, datetime
        from _cp.models import mCourseN
        import uuid
        import json
        import copy

        pass

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

        print(distributions)
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

    def start(self):
        course = get_object(mCourseN, id=uuid.UUID("5b0f7b39862d4f9eac190b88b52fc97b"))
        lists = json.loads(course.json_data).get("lists")
        print(lists)
        start_date = timezone.now()
        end_date = timezone.now() + timedelta(days=30)

        self._create_scheduler_list(
            lists=lists, start_date=start_date, end_date=end_date
        )

        return


class testAssign:
    def __init__(self) -> None:
        pass

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

    def create_scheduler_list(
        self, lists: List[Dict], start_date, end_date
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

    def start(self):
        course = get_object(mCourseN, id=uuid.UUID("59005c3384ac4f199e4f1567607611ef"))
        lists = json.loads(course.json_data).get("lists")
        start_date = timezone.now()
        end_date = timezone.now() + timedelta(days=14)

        scheduler_list = self.create_scheduler_list(
            lists=lists, start_date=start_date, end_date=end_date
        )

        result = [
            {
                # "title": item.get("title", ""),
                "date": item.get("date", ""),
                "period": item.get("period", ""),
                "type": item.get("type", ""),
            }
            for item in scheduler_list
        ]

        print(result)
        print(start_date, end_date)

        return


[
    {"date": "", "period": "", "type": 0},
    {"date": "2024-03-30T07:46:48Z", "period": 1, "type": 12},
    {"date": "2024-03-30T07:46:48Z", "period": 1, "type": 11},
    {"date": "2024-03-30T07:46:48Z", "period": 1, "type": 12},
    {"date": "2024-03-30T07:46:48Z", "period": 1, "type": 11},
    {"date": "2024-03-30T07:46:48Z", "period": 1, "type": 12},
    {"date": "2024-03-30T07:46:48Z", "period": 1, "type": 11},
    {"date": "2024-03-31T07:46:48Z", "period": 2, "type": 12},
    {"date": "2024-03-31T07:46:48Z", "period": 2, "type": 11},
    {"date": "2024-03-31T07:46:48Z", "period": 2, "type": 12},
    {"date": "2024-03-31T07:46:48Z", "period": 2, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-01T07:46:48Z", "period": 3, "type": 12},
    {"date": "2024-04-01T07:46:48Z", "period": 3, "type": 11},
    {"date": "2024-04-01T07:46:48Z", "period": 3, "type": 12},
    {"date": "2024-04-01T07:46:48Z", "period": 3, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-02T07:46:48Z", "period": 4, "type": 12},
    {"date": "2024-04-02T07:46:48Z", "period": 4, "type": 11},
    {"date": "2024-04-02T07:46:48Z", "period": 4, "type": 12},
    {"date": "2024-04-02T07:46:48Z", "period": 4, "type": 11},
    {"date": "2024-04-02T07:46:48Z", "period": 4, "type": 12},
    {"date": "2024-04-02T07:46:48Z", "period": 4, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-03T07:46:48Z", "period": 5, "type": 12},
    {"date": "2024-04-03T07:46:48Z", "period": 5, "type": 11},
    {"date": "2024-04-03T07:46:48Z", "period": 5, "type": 12},
    {"date": "2024-04-03T07:46:48Z", "period": 5, "type": 11},
    {"date": "2024-04-03T07:46:48Z", "period": 5, "type": 12},
    {"date": "2024-04-03T07:46:48Z", "period": 5, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-04T07:46:48Z", "period": 6, "type": 12},
    {"date": "2024-04-04T07:46:48Z", "period": 6, "type": 11},
    {"date": "2024-04-04T07:46:48Z", "period": 6, "type": 12},
    {"date": "2024-04-04T07:46:48Z", "period": 6, "type": 11},
    {"date": "2024-04-04T07:46:48Z", "period": 6, "type": 12},
    {"date": "2024-04-04T07:46:48Z", "period": 6, "type": 11},
    {"date": "2024-04-05T07:46:48Z", "period": 7, "type": 12},
    {"date": "2024-04-05T07:46:48Z", "period": 7, "type": 11},
    {"date": "2024-04-05T07:46:48Z", "period": 7, "type": 12},
    {"date": "2024-04-05T07:46:48Z", "period": 7, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-06T07:46:48Z", "period": 8, "type": 12},
    {"date": "2024-04-06T07:46:48Z", "period": 8, "type": 11},
    {"date": "2024-04-06T07:46:48Z", "period": 8, "type": 12},
    {"date": "2024-04-06T07:46:48Z", "period": 8, "type": 11},
    {"date": "2024-04-06T07:46:48Z", "period": 8, "type": 12},
    {"date": "2024-04-06T07:46:48Z", "period": 8, "type": 11},
    {"date": "2024-04-07T07:46:48Z", "period": 9, "type": 12},
    {"date": "2024-04-07T07:46:48Z", "period": 9, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-08T07:46:48Z", "period": 10, "type": 12},
    {"date": "2024-04-08T07:46:48Z", "period": 10, "type": 11},
    {"date": "2024-04-08T07:46:48Z", "period": 10, "type": 12},
    {"date": "2024-04-08T07:46:48Z", "period": 10, "type": 11},
    {"date": "2024-04-08T07:46:48Z", "period": 10, "type": 12},
    {"date": "2024-04-08T07:46:48Z", "period": 10, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-09T07:46:48Z", "period": 11, "type": 12},
    {"date": "2024-04-09T07:46:48Z", "period": 11, "type": 11},
    {"date": "2024-04-09T07:46:48Z", "period": 11, "type": 12},
    {"date": "2024-04-09T07:46:48Z", "period": 11, "type": 11},
    {"date": "2024-04-09T07:46:48Z", "period": 11, "type": 12},
    {"date": "2024-04-09T07:46:48Z", "period": 11, "type": 11},
    {"date": "2024-04-09T07:46:48Z", "period": 11, "type": 12},
    {"date": "2024-04-10T07:46:48Z", "period": 12, "type": 11},
    {"date": "2024-04-10T07:46:48Z", "period": 12, "type": 12},
    {"date": "2024-04-10T07:46:48Z", "period": 12, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-11T07:46:48Z", "period": 13, "type": 12},
    {"date": "2024-04-11T07:46:48Z", "period": 13, "type": 11},
    {"date": "2024-04-11T07:46:48Z", "period": 13, "type": 12},
    {"date": "2024-04-11T07:46:48Z", "period": 13, "type": 11},
    {"date": "2024-04-11T07:46:48Z", "period": 13, "type": 12},
    {"date": "2024-04-11T07:46:48Z", "period": 13, "type": 11},
    {"date": "2024-04-11T07:46:48Z", "period": 13, "type": 12},
    {"date": "2024-04-11T07:46:48Z", "period": 13, "type": 11},
    {"date": "2024-04-12T07:46:48Z", "period": 14, "type": 12},
    {"date": "2024-04-12T07:46:48Z", "period": 14, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 12},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 11},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 12},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 11},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 12},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 11},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 12},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 11},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 12},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 11},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 12},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 11},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 12},
    {"date": "2024-04-13T07:46:48Z", "period": 15, "type": 11},
]
