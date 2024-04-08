import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "_config.settings")
django.setup()

# scripts
import json

from django.db.models import Q

from _class.models import (
    mSingleCourseClass,
    mClassContentAssign,
    mClassStudyResult,
    mClassMember,
)
from _class.services import AssignService


# 1. class 중 start_date, end_date 없는 것들 제거
def remove_classes_without_dates():
    classes = mSingleCourseClass.objects.filter(
        Q(start_date__isnull=True) | Q(end_date__isnull=True)
    )

    class_ids = classes.values("id")

    assignments = mClassContentAssign.objects.filter(id_class__in=class_ids)
    results = mClassStudyResult.objects.filter(id_class__in=class_ids)
    members = mClassMember.objects.filter(id_class__in=class_ids)

    print(f"Classes without dates: {classes.count()}")
    print(f"Assignments without dates: {assignments.count()}")
    print(f"Results without dates: {results.count()}")
    print(f"Members without dates: {members.count()}")

    # classes.delete()
    # assignments.delete()
    # results.delete()
    # members.delete()

    print("Classes without dates removed")
    pass


# 2. mClassContentAssign 업데이트


def update_assignments():
    service = AssignService()
    assignments = mClassContentAssign.objects.all()

    for assignment in assignments:
        id_class = assignment.id_class

        cls = mSingleCourseClass.objects.filter(id=id_class).first()
        if not cls:
            continue

        start_date = cls.start_date
        end_date = cls.end_date

        json_data = json.loads(assignment.json_data)

        scheduler_list = service.create_scheduler_list(
            start_date, end_date, json_data["scheduler_list"]
        )

        json_data["scheduler_list"] = scheduler_list

        assignment.json_data = json.dumps(json_data, ensure_ascii=False)

    mClassContentAssign.objects.bulk_update(assignments, ["json_data"])
    print("Assignments updated")
    pass


# 3. mClassStudyResult 업데이트
def update_class_study_results():
    service = AssignService()
    results = mClassStudyResult.objects.all()

    for result in results:
        id_class = result.id_class

        cls = mSingleCourseClass.objects.filter(id=id_class).first()
        if not cls:
            continue

        start_date = cls.start_date
        end_date = cls.end_date

        json_data = json.loads(result.json_data)

        scheduler_list = service.create_scheduler_list(
            start_date, end_date, json_data["property"]
        )

        json_data["property"] = scheduler_list

        result.json_data = json.dumps(json_data, ensure_ascii=False)

    mClassStudyResult.objects.bulk_update(results, ["json_data"])

    print("Class Study Result updated")
    pass


remove_classes_without_dates()
update_assignments()
update_class_study_results()
