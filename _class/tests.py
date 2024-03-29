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

    def _find_min_index_greater_than_current(self, arr, current_index):
        """
        현재 인덱스보다 큰 인덱스를 가진 요소들 중에서 최소값을 찾습니다.
        해당값의 index를 반환합니다.
        """
        candidates = [
            (index, value) for index, value in enumerate(arr) if index > current_index
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

        print(len(distributions))

        for i in range(branches_count % date_range):
            distributions[i] += 1

        # 날짜 할당
        scheduler_index = 0
        current_date = start_date
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
        print(current_date)
        return scheduler_list

    def start(self):
        course = get_object(mCourseN, id=uuid.UUID("59005c3384ac4f199e4f1567607611ef"))
        lists = json.loads(course.json_data).get("lists")
        start_date = timezone.now()
        end_date = timezone.now() + timedelta(days=128)

        scheduler_list = self.create_scheduler_list(
            lists=lists, start_date=start_date, end_date=end_date
        )

        result = [
            {
                "date": item.get("date", ""),
                "period": item.get("period", ""),
                "type": item.get("type", ""),
            }
            for item in scheduler_list
        ]
        # print(result)
        print(start_date, end_date)

        return


[
    {"date": "", "period": "", "type": 0},
    {"date": "2024-03-28T06:30:21Z", "period": 1, "type": 12},
    {"date": "2024-03-29T06:30:21Z", "period": 2, "type": 11},
    {"date": "2024-03-30T06:30:21Z", "period": 3, "type": 12},
    {"date": "2024-03-31T06:30:21Z", "period": 4, "type": 11},
    {"date": "2024-04-01T06:30:21Z", "period": 5, "type": 12},
    {"date": "2024-04-02T06:30:21Z", "period": 6, "type": 11},
    {"date": "2024-04-03T06:30:21Z", "period": 7, "type": 12},
    {"date": "2024-04-04T06:30:21Z", "period": 8, "type": 11},
    {"date": "2024-04-05T06:30:21Z", "period": 9, "type": 12},
    {"date": "2024-04-06T06:30:21Z", "period": 10, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-07T06:30:21Z", "period": 11, "type": 12},
    {"date": "2024-04-08T06:30:21Z", "period": 12, "type": 11},
    {"date": "2024-04-09T06:30:21Z", "period": 13, "type": 12},
    {"date": "2024-04-10T06:30:21Z", "period": 14, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-11T06:30:21Z", "period": 15, "type": 12},
    {"date": "2024-04-12T06:30:21Z", "period": 16, "type": 11},
    {"date": "2024-04-13T06:30:21Z", "period": 17, "type": 12},
    {"date": "2024-04-14T06:30:21Z", "period": 18, "type": 11},
    {"date": "2024-04-15T06:30:21Z", "period": 19, "type": 12},
    {"date": "2024-04-16T06:30:21Z", "period": 20, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-17T06:30:21Z", "period": 21, "type": 12},
    {"date": "2024-04-18T06:30:21Z", "period": 22, "type": 11},
    {"date": "2024-04-19T06:30:21Z", "period": 23, "type": 12},
    {"date": "2024-04-20T06:30:21Z", "period": 24, "type": 11},
    {"date": "2024-04-21T06:30:21Z", "period": 25, "type": 12},
    {"date": "2024-04-22T06:30:21Z", "period": 26, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-04-23T06:30:21Z", "period": 27, "type": 12},
    {"date": "2024-04-24T06:30:21Z", "period": 28, "type": 11},
    {"date": "2024-04-25T06:30:21Z", "period": 29, "type": 12},
    {"date": "2024-04-26T06:30:21Z", "period": 30, "type": 11},
    {"date": "2024-04-27T06:30:21Z", "period": 31, "type": 12},
    {"date": "2024-04-28T06:30:21Z", "period": 32, "type": 11},
    {"date": "2024-04-29T06:30:21Z", "period": 33, "type": 12},
    {"date": "2024-04-30T06:30:21Z", "period": 34, "type": 11},
    {"date": "2024-05-01T06:30:21Z", "period": 35, "type": 12},
    {"date": "2024-05-02T06:30:21Z", "period": 36, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-05-03T06:30:21Z", "period": 37, "type": 12},
    {"date": "2024-05-04T06:30:21Z", "period": 38, "type": 11},
    {"date": "2024-05-05T06:30:21Z", "period": 39, "type": 12},
    {"date": "2024-05-06T06:30:21Z", "period": 40, "type": 11},
    {"date": "2024-05-07T06:30:21Z", "period": 41, "type": 12},
    {"date": "2024-05-08T06:30:21Z", "period": 42, "type": 11},
    {"date": "2024-05-09T06:30:21Z", "period": 43, "type": 12},
    {"date": "2024-05-10T06:30:21Z", "period": 44, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-05-11T06:30:21Z", "period": 45, "type": 12},
    {"date": "2024-05-12T06:30:21Z", "period": 46, "type": 11},
    {"date": "2024-05-13T06:30:21Z", "period": 47, "type": 12},
    {"date": "2024-05-14T06:30:21Z", "period": 48, "type": 11},
    {"date": "2024-05-15T06:30:21Z", "period": 49, "type": 12},
    {"date": "2024-05-16T06:30:21Z", "period": 50, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-05-17T06:30:21Z", "period": 51, "type": 12},
    {"date": "2024-05-18T06:30:21Z", "period": 52, "type": 11},
    {"date": "2024-05-19T06:30:21Z", "period": 53, "type": 12},
    {"date": "2024-05-20T06:30:21Z", "period": 54, "type": 11},
    {"date": "2024-05-21T06:30:21Z", "period": 55, "type": 12},
    {"date": "2024-05-22T06:30:21Z", "period": 56, "type": 11},
    {"date": "2024-05-23T06:30:21Z", "period": 57, "type": 12},
    {"date": "2024-05-24T06:30:21Z", "period": 58, "type": 11},
    {"date": "2024-05-25T06:30:21Z", "period": 59, "type": 12},
    {"date": "2024-05-26T06:30:21Z", "period": 60, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-05-27T06:30:21Z", "period": 61, "type": 12},
    {"date": "2024-05-28T06:30:21Z", "period": 62, "type": 11},
    {"date": "2024-05-29T06:30:21Z", "period": 63, "type": 12},
    {"date": "2024-05-30T06:30:21Z", "period": 64, "type": 11},
    {"date": "2024-05-31T06:30:21Z", "period": 65, "type": 12},
    {"date": "2024-06-01T06:30:21Z", "period": 66, "type": 11},
    {"date": "2024-06-02T06:30:21Z", "period": 67, "type": 12},
    {"date": "2024-06-03T06:30:21Z", "period": 68, "type": 11},
    {"date": "2024-06-04T06:30:21Z", "period": 69, "type": 12},
    {"date": "2024-06-05T06:30:21Z", "period": 70, "type": 11},
    {"date": "", "period": "", "type": 0},
    {"date": "2024-06-06T06:30:21Z", "period": 71, "type": 12},
    {"date": "2024-06-07T06:30:21Z", "period": 72, "type": 11},
    {"date": "2024-06-08T06:30:21Z", "period": 73, "type": 12},
    {"date": "2024-06-09T06:30:21Z", "period": 74, "type": 11},
    {"date": "2024-06-10T06:30:21Z", "period": 75, "type": 12},
    {"date": "2024-06-11T06:30:21Z", "period": 76, "type": 11},
    {"date": "2024-06-12T06:30:21Z", "period": 77, "type": 12},
    {"date": "2024-06-13T06:30:21Z", "period": 78, "type": 11},
    {"date": "2024-06-14T06:30:21Z", "period": 79, "type": 12},
    {"date": "2024-06-15T06:30:21Z", "period": 80, "type": 11},
    {"date": "2024-06-16T06:30:21Z", "period": 81, "type": 12},
    {"date": "2024-06-17T06:30:21Z", "period": 82, "type": 11},
    {"date": "2024-06-18T06:30:21Z", "period": 83, "type": 12},
    {"date": "2024-06-19T06:30:21Z", "period": 84, "type": 11},
]
