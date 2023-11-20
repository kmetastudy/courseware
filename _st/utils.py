import uuid
import json

from _cp.constants import *
from _cp.models import mCourseN, mElementN
from .models import mUserCourse


def has_course_permission(course_id, user_id):
    if not course_id or not user_id:
        return False
    if mUserCourse.objects.filter(user_id=user_id, course_id=course_id).exists():
        return True
    return False


def get_content_info(request, content_type):
    if content_type == CP_TYPE_LESSON:
        return get_lesson_info(request)
    elif content_type == CP_TYPE_TESTUM or content_type == CP_TYPE_EXAM:
        return get_testum_info(request)
    else:
        empty_content_info = {
            'content_list': [],
            'units': [],
        }
        return empty_content_info


def get_lesson_info(request):
    content_list = []
    units = []

    empty_content_info = {
        'content_list': [],
        'units': [],
    }

    # units = json.loads(request.POST.get('units'))
    course_id = request.POST.get('course_id')
    content_id = request.POST.get('content_id')
    courses = mCourseN.objects.filter(id=uuid.UUID(course_id), invalid=False)
    if len(courses) != 1:
        return empty_content_info

    # print('_v2tc_get_lessoninfo : ', units)
    course_info = json.loads(courses[0].json_data)
    contents = course_info['contents']
    lists = course_info['lists']

    content_idx = 0
    bFindIdx = False
    for list in lists:
        if list['id'] == content_id:
            bFindIdx = True
            break
        content_idx += 1

    # print('_v2tc_get_lessoninfo 1: ', content_idx)
    if bFindIdx == False:
        return empty_content_info

    units = contents[content_idx]['units']

    for unit in units:
        index = 0
        contentunit_list = []
        for type in unit['types']:
            content_id = unit['ids'][index]
            index += 1
            if type == 'v':
                elements = mElementN.objects.filter(
                    id=uuid.UUID(content_id),
                    type=2,
                    # invalid = False
                )
                if len(elements) == 1:
                    info = json.loads(elements[0].json_data)
                    contentunit_list.append(
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
            elif type == 'q':
                elements = mElementN.objects.filter(
                    id=uuid.UUID(content_id),
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
                            solutions = mElementN.objects.filter(
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
                            solutions = mElementN.objects.filter(
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
                    contentunit_list.append(
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
        content_list.append(contentunit_list)

    result = {}
    result['units'] = units
    result['content_list'] = content_list
    return result


def get_testum_info(request):
    content_list = []
    units = []

    # units = json.loads(request.POST.get('units'))
    course_id = request.POST.get('course_id')
    content_id = request.POST.get('content_id')
    courses = mCourseN.objects.filter(id=uuid.UUID(course_id), invalid=False)
    if len(courses) != 1:
        return content_list

    course_info = json.loads(courses[0].json_data)
    contents = course_info['contents']
    lists = course_info['lists']

    content_idx = 0
    bFindIdx = False
    for list in lists:
        if list['id'] == content_id:
            bFindIdx = True
            break
        content_idx += 1
    # print('get_testum_info 0: ', content_idx)
    if bFindIdx == False:
        return content_list

    units = contents[content_idx]['units']
    # print('get_testum_info 1: ', units)

    for unit in units:
        index = 0
        contentunit_list = []
        # print('get_testum_info 2: ', unit['types'])
        for type in unit['types']:
            content_id = unit['ids'][index]
            index += 1
            # {
            #     'video': '1',
            #     'id':str(videoAtom.id.hex), # uuid include '-'
            #     'title' : videoAtom.title,
            #     'url' : videoAtom.url,
            #     'time' : videoAtom.time,
            # }
            if type == 'v':
                elements = mElementN.objects.filter(
                    id=uuid.UUID(content_id),
                    type=2, invalid=False
                )
                if len(elements) == 1:
                    info = json.loads(elements[0].json_data)
                    contentunit_list.append(
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
            elif type == 'q':
                elements = mElementN.objects.filter(
                    id=uuid.UUID(content_id),
                    type=1, invalid=False
                )
                if len(elements) == 1:
                    info = json.loads(elements[0].json_data)
                    contentunit_list.append(
                        {
                            'video': 0,
                            'id': str(elements[0].id),
                            'content': info['main'],
                            "style": info['style'],
                            "level": info['level'],
                            "answer": info['answer'],
                            "tag": info['tag'],
                            'json_data': elements[0].json_data
                        }
                    )
                pass
        content_list.append(contentunit_list)

    result = {}
    result['units'] = units
    result['content_list'] = content_list
    return result


# def _vfn_st_get_coursecontentinfo(request, student):
    ret_data = {}
    study_list = []
    clinic_list = []
    demo = request.demo
    student_id = request.POST.get('student_id')
    # course_type = 0 : basic , 1 : clinic
    course_type = int(request.POST.get('course_type'))

    if demo:
        if course_type == 0:
            json_course_list = request.POST.get('parameters')
            course_list = json.loads(json_course_list)

            for course in course_list:
                class_id = course["class_id"]
                course_id = course["course_id"]
                clinic_id = course_id
                if 'clinic_id' in request.POST:
                    clinic_id = request.POST.get('clinic_id')

                contents = mDemoClassContentAssignN.objects.filter(
                    id_class=uuid.UUID(class_id),
                    id_course=uuid.UUID(course_id),
                    invalid=False,
                    type=1,
                )
                content_list = []
                if len(contents) == 1:
                    condition = json.loads(contents[0].condition)
                    content_list = condition['scheduler_list']
                    pass
                results = _vfn_st_get_studyresult_demo(
                    class_id, course_id, clinic_id, student_id, student)

                study_list.append({
                    "class_id": class_id,
                    "course_id": course_id,
                    "content_list": json.dumps(content_list, ensure_ascii=False),
                    "results": results,
                })
                # clinic_list
                contents = mDemoStudyResultN.objects.filter(
                    id_class=uuid.UUID(class_id),
                    id_course=uuid.UUID(course_id),
                    id_student=uuid.UUID(student_id),
                    invalid=False,
                    type=0,
                )
                for content in contents:
                    clinic_list.append({
                        "class_id": class_id,
                        "clinic_id": str(content.id_content),
                        "properties": content.properties}
                    )
                    pass
            ret_data['study_list'] = study_list
            ret_data['clinic_list'] = clinic_list
            return ret_data
        pass
    else:
        pass

    return ret_data
