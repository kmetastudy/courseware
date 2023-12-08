import json
import uuid

from .models import mStudyResult, mDemoStudyResult
from _cp.models import mCourseN
from _cp.constants import CP_TYPE_TESTUM, CP_TYPE_LESSON, CP_TYPE_EXAM

from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def create_property(course_id):
    """
    mStudyResult
    create empty properties
    """
    empty_property = []
    id_course = uuid.UUID(str(course_id))

    course = mCourseN.objects.filter(id=id_course).first()
    if not course:
        return None

    lists = json.loads(course.json_data)["lists"]

    course_size = len(lists)
    for i in range(course_size):
        list_data = lists[i]
        data = {
            "id": list_data["id"],
            "title": list_data["title"],
            "type": list_data["type"],
            "level": list_data["level"],
        }

        if list_data["type"] != CP_TYPE_TESTUM and list_data["type"] != CP_TYPE_LESSON and list_data["type"] != CP_TYPE_EXAM:
            empty_property.append(data)
            continue

        if "units" in list_data and len(list_data["units"]) > 0:
            data["units"] = list_data["units"]
            data["progress"] = 0
            data["point"] = 0
            data["results"] = []

        empty_property.append(data)

    return empty_property


def create_study_result(course_id, student_id, *args, **kwargs):
    id_course = uuid.UUID(str(course_id))
    id_student = uuid.UUID(str(student_id))

    study_result = mStudyResult(
        id_student=id_student,
        id_course=id_course,
        # total result?
        type=1
    )

    default_property = create_property(course_id=id_course)

    if not default_property:
        study_result.full_clean()
        study_result.save()
        return study_result

    properties = {
        "property": default_property
    }

    study_result.properties = json.dumps(properties, ensure_ascii=False)

    study_result.full_clean()
    study_result.save()

    return study_result


def get_study_result(course_id, student_id):
    if not course_id or not student_id:
        study_result = mStudyResult.objects.all()
        return study_result

    id_course = uuid.UUID(str(course_id))
    id_student = uuid.UUID(str(student_id))

    study_result = mStudyResult.objects.filter(
        id_course=id_course,
        id_student=id_student
    ).first()

    if not study_result:
        study_result = create_study_result(
            course_id=course_id, student_id=student_id)

    return study_result


def update_study_result(*args, **kwargs):
    """
    client에서는 results가 아닌 properties를 post해준다.
    property 인자에는, client에서 보내던 properties를 주면 된다.

    <kwrags>
    course_id, student_id, content_id, results, point, progress
    """
    course_id = uuid.UUID(str(kwargs.get("course_id", None)))
    student_id = uuid.UUID(str(kwargs.get("student_id", None)))
    content_id = uuid.UUID(str(kwargs.get("content_id", None)))

    results = kwargs.get("properties", None)
    point = kwargs.get("point", None)
    progress = kwargs.get("progress", None)

    try:
        study_result = mStudyResult.objects.filter(
            id_student=student_id,
            id_course=course_id
        ).first()

        if not study_result:
            study_result = create_study_result(
                course_id=course_id, student_id=student_id)

        json_properties = json.loads(study_result.properties)

        properties = json_properties["property"]

        for data in properties:
            if data["id"] == str(content_id):
                data["results"] = results
                data["progress"] = progress
                data["point"] = point

        study_result.properties = json.dumps(
            json_properties, ensure_ascii=False)
        study_result.save()

        return study_result, None

    except Exception as e:
        return None, JsonResponse({"error": str(e)}, status=500)


############ DEMO ############
"""
Same logic with above.
The difference is using "mDemoStudyResult", instead of "mStudyResult"

추후에 로직이 바뀔 수도 있어, 일단은 분리해뒀다.
"""


def create_demo_study_result(course_id, student_id, *args, **kwargs):
    # student_id = request.POST.get("student_id")
    # course_id = request.POST.get("course_id")
    # content_id = request.POST.get("content_id")
    id_course = uuid.UUID(str(course_id))
    id_student = uuid.UUID(str(student_id))

    demo_study_result = mDemoStudyResult(
        id_course=id_course,
        id_student=id_student,
        # total result?
        type=1
    )

    default_property = create_property(course_id=id_course)

    if not default_property:
        demo_study_result.full_clean()
        demo_study_result.save()
        return demo_study_result

    properties = {
        "property": default_property
    }

    demo_study_result.properties = json.dumps(properties, ensure_ascii=False)

    demo_study_result.full_clean()
    demo_study_result.save()

    return demo_study_result


def get_demo_study_result(course_id, student_id):
    if not course_id or not student_id:
        demo_study_result = mDemoStudyResult.objects.all()
        return demo_study_result

    id_course = uuid.UUID(str(course_id))
    id_student = uuid.UUID(str(student_id))

    demo_study_result = mDemoStudyResult.objects.filter(
        id_course=id_course,
        id_student=id_student
    ).first()

    if not demo_study_result:
        demo_study_result = create_demo_study_result(
            course_id=id_course, student_id=id_student)

    return demo_study_result


def update_demo_study_result(*args, **kwargs):
    """
    client에서는 results가 아닌 properties를 post해준다.
    property 인자에는, client에서 보내던 properties를 주면 된다.

    <kwrags>
    course_id, student_id, content_id, results, point, progress
    """
    course_id = uuid.UUID(str(kwargs.get("course_id", None)))
    student_id = uuid.UUID(str(kwargs.get("student_id", None)))
    content_id = uuid.UUID(str(kwargs.get("content_id", None)))

    results = kwargs.get("properties", None)
    point = kwargs.get("point", None)
    progress = kwargs.get("progress", None)

    try:
        demo_study_result = mDemoStudyResult.objects.filter(
            id_student=student_id,
            id_course=course_id
        ).first()

        if not demo_study_result:
            demo_study_result = create_demo_study_result(
                course_id=course_id, student_id=student_id)

        json_properties = json.loads(demo_study_result.properties)

        properties = json_properties["property"]

        for data in properties:
            if data["id"] == str(content_id):
                data["results"] = results
                data["progress"] = progress
                data["point"] = point

        demo_study_result.properties = json.dumps(
            json_properties, ensure_ascii=False)

        demo_study_result.save()

        return demo_study_result, None

    except Exception as e:
        return None, JsonResponse({"error": str(e)}, status=500)
