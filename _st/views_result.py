import uuid
import json

from rest_framework import status
from rest_framework.response import Response


from .models import mStudyResult
from _cp.models import mCourseN


def create_study_result(request, **kwargs):
    course_id = kwargs['course_id']
    student_id = kwargs['student_id']
    course = mCourseN.objects.filter(id=course_id).first()

    if not course:
        return Response(status=status.HTTP_404_NOT_FOUND)

    dic_properties = {}
    study_property = []

    course_json_data = json.loads(course.json_data)
    lists = course_json_data['lists']

    for i in range(len(lists)):
        list_data = lists[i]
        property_data = {
            'id': list_data['id'],
            'title': list_data['title'],
            'type': list_data['level'],
            # 'level': content['level'],
            # 'date': content['date'],
            # 'show': content['show'],
            'progress': 0,
            'point': 0,
            'results': [],
            'units': list_data['units']
        }
        study_property.append(property_data)

    dic_properties['property'] = study_property
    json_properties = json.dumps(dic_properties, ensure_ascii=False)

    study_result = mStudyResult.objects.create(
        id_course=uuid.UUID(course_id),
        id_student=uuid.UUID(student_id),
        properties=json_properties,
        type=1,
    )
    return json_properties


def get_study_result(*args, **kwargs):
    course_id = kwargs['course_id']
    user_id = kwargs['user_id']
    content_id = kwargs['content_id']

    #
    return


def update_study_result(*args, **kwargs):
    course_id = kwargs['course_id']
    user_id = kwargs['user_id']
    content_id = kwargs['content_id']
    properties = kwargs['properties']
    point = kwargs['point']
    progress = kwargs['progress']

    # print('_vfn_st_update_studyresult_demo : ', clinic_id)
    query = mStudyResult.objects.filter(
        id_course=uuid.UUID(course_id),
        id_student=uuid.UUID(user_id),
        # id_content = uuid.UUID(clinic_id),
        id_content=uuid.UUID(course_id),
        # total result
        type=1,
    )
    json_properties = None
    if not query.exists():
        return
    study_result = query[0]
    # 이렇게 해도, dictionary 는 reference 로 수정 가능하다.
    json_properties = json.loads(study_result.properties)
    content_list = json_properties['property']

    for content in content_list:
        if content['id'] == content_id:
            content['results'] = json.loads(properties)
            content['progress'] = progress
            content['point'] = point
            break
    study_result.properties = json.dumps(
        json_properties, ensure_ascii=False)
    study_result.save()
    return
