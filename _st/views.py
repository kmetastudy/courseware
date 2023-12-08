import json
import uuid

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse

from rest_framework.decorators import api_view
import requests

from .models import mStudyResult
from _cp.models import mElement, mCourseN
from .utils import has_course_permission, get_content_info
from _user.utils import make_context
from _user.decorators import jwt_login_required
from _cp.constants import *


@jwt_login_required
def index(request):
    course_id = request.GET.get("course_id")
    user_id = request.userId
    print(course_id)

    request.demo = True
    if has_course_permission(course_id, user_id):
        request.demo = False

    st_context = make_context(request)

    st_context['courseId'] = course_id
    # remove after test
    if not course_id:
        st_context['courseId'] = '59005c33-84ac-4f19-9e4f-1567607611ef'

    print("st_context: ", st_context)
    context = {'context': json.dumps(st_context)}
    return render(request, "_st/_st.html", context)


def get_content(request):
    result = {}
    print('st get content info')
    content_type = int(request.POST.get("content_type"))
    # content_list = get_content_info(request, content_type)
    content_info = get_content_info(request, content_type)
    result["content_list"] = content_info['content_list']
    result['units'] = content_info['units']
    result["content_type"] = content_type
    return JsonResponse({"message": "getContentInfo", "result": result}, status=200)


@api_view(['POST'])
def get_element_list(request):
    ids = request.data.get('ids')
    types = request.data.get('types')
    size = len(ids)
    element_list = []

    for index in range(size):
        element_type = types[index]
        element_id = ids[index]

        if element_type == 'v':
            elements = mElement.objects.filter(
                id=uuid.UUID(element_id),
                type=2,
                # invalid = False
            )
            if len(elements) == 1:
                info = json.loads(elements[0].json_data)
                element_list.append(
                    {
                        'video': 1,
                        'id': str(elements[0].id),
                        'title': info['title'],
                        'url': info['url'],
                        'time': info['time'],
                        'json_data': elements[0].json_data
                    }
                )
                pass
            pass
        elif element_type == 'q':
            elements = mElement.objects.filter(
                id=uuid.UUID(element_id),
                type=1,
                # invalid = False
            )
            if len(elements) == 1:
                info = json.loads(elements[0].json_data)
                sol_text = []
                sol_video = []
                # solution text
                if len(info["sol_text"]) > 0:
                    for solution_id in info["sol_text"]:
                        solutions = mElement.objects.filter(
                            id=uuid.UUID(solution_id),
                            type=CP_TYPE_EL_SOL_T,
                            invalid=False
                        )
                        if len(solutions) == 1:
                            sol_info = json.loads(solutions[0].json_data)
                            sol_text.append({'content': sol_info['main']})
                    pass

                # solution video
                if len(info["sol_video"]) > 0:
                    for solution_id in info["sol_video"]:
                        solutions = mElement.objects.filter(
                            id=uuid.UUID(solution_id),
                            type=CP_TYPE_EL_SOL_V,
                            invalid=False
                        )
                        if len(solutions) == 1:
                            sol_info = json.loads(solutions[0].json_data)
                            sol_video.append({
                                'time': sol_info['time'],
                                'title': sol_info['title'],
                                'url': sol_info['url'],
                            })
                    pass
                element_list.append(
                    {
                        'video': 0,
                        'id': str(elements[0].id),
                        'content': info['main'],
                        "style": info['style'],
                        "level": info['level'],
                        "answer": info['answer'],
                        "tag": info['tag'],
                        'sol_text': sol_text,
                        'sol_video': sol_video,
                        'json_data': elements[0].json_data
                    }
                )

            pass

    return JsonResponse({"data": element_list})

# @jwtlogin_st_decorator


def create_study_result_info(request):
    result = {}

    student_id = request.POST.get("student_id")
    course_id = request.POST.get("course_id")

    course = mCourseN.objects.filter(id=course_id).first()
    if not course:
        return JsonResponse({"message": "invalid course", "result": result}, )

    json_data = json.loads(course.json_data)
    # lists =
    return JsonResponse({"message": "invalid course", "result": result}, )


def get_study_result_info(request):
    course_id = request.POST.get("course_id")
    student_id = request.POST.get("student_id")
    content_id = request.POST.get("content_id")

    study_result = mStudyResult.objects.filter(
        course_id=course_id,
        student_id=student_id,
        # content_id=course_id,
    ).first()

    result = {}

    if not study_result:
        properties = requests.post("../user/create_study_result_info",
                                   course_id=course_id,
                                   student_id=student_id)

    # if study_results.exists()

    return


def update_study_result_info(request):
    result = {}
    student_id = request.POST.get("student_id")
    class_id = request.POST.get("class_id")
    course_id = request.POST.get("course_id")
    clinic_id = request.POST.get("clinic_id")
    content_id = request.POST.get("content_id")
    content_type = request.POST.get("content_type")
    course_type = request.POST.get("course_type")
    properties = request.POST.get("properties")
    point = request.POST.get("point")
    progress = request.POST.get("progress")

    print("student_id: ", student_id)
    print("course_id: ", course_id)
    print("content_id: ", content_id)
    print("content_type: ", content_type)
    print("properties: ", properties)
    print("course_type: ", course_type)
    print("point: ", point)
    print("progress: ", progress)

    study_result = mStudyResult.objects.filter(
        id_course=uuid.UUID(course_id),
        id_student=uuid.UUID(student_id),
        id_content=uuid.UUID(course_id),  # 왜 course_id..?
        # type=1,
    ).first()

    if not study_result:
        return JsonResponse({"message": "No content", "result": result}, status=204)

    json_properties = None
    json_properties = json.loads(study_result.properties)
    content_list = json_properties['property']

    for content in content_list:
        if content['id'] == content_id:
            content['results'] = json.loads(properties)
            content['progress'] = progress
            content['point'] = point
            break

    study_result.properties = json.dumps(json_properties, ensure_ascii=False)
    study_result.save()

    return JsonResponse({"message": "updateStudyResultInfo", "result": result}, status=200)

# class
# 1. login & demo x
# 원래대로 하면 될거고
# 2. login & demo
# 전체를 만들어준다.
# 그리고 아마, demo라는 field를 두면 되지 않나? 아니, 그 전에, demo라는 Field가 필요해?
# demo일 때랑, demo가 아닐 때랑, 결과에 대한 차이를 두어야할까?
# 사실, userCourse에서 확인해도 되긴하다. 일단, field는 추가하지 말자.
# 그러면, 구매를 하더라도 mStudyResult는 변하는 데이터가 없다.
# 3. loginx & demo
# 이 값을 저장하는게 타당한가? 어떻게 관리하는게 좋나?
# 특히나, 함부로 저장하면 데이터가 너무 많아지지 않나?
# 차라리 local storage? => 너무 데이터가 많다.
# 아니면 session에다가 저장할까?
# 그러면, request를 보낼 때 데모인 경우에는, session에서 id를 받는다.
# 그리고, session에서 result를 가져온다. 이 때, expiration데이터는?
# 그러면, 만약 사용자가 result데이터가 있는 경우, 해당을 mStudyResult에 옮기면 되긴한다.
