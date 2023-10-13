import uuid
import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views import View

from .models import mStudyResultN, mDemoStudyResultN
from _tc.models import mClassContentAssignN, mDemoClassContentAssignN
from _cp.models import mCourseBook, mCourseBookBranch, mLesson, mLessonUnit, mTestum, mTestumUnit
from _cp.models import mVideoAtom, mQuestionAtom
from _cp.models import mQuestionSolutionVideo, mQuestionSolutionText
from _cp.nmodels import mCourseN,mElementN

from _ml.constants import *
from _cp.constants import *

# Student Content 정보
# 0) Course Content 의 Lesson/Testum 의 순차 기본 정보 필요
# 1) 순차 기본 정보 + 일정(Scheduler) 정보 필요.
# 2) 기본 + 일정 + 상세 (Unit) 정보 필요
# 3) 기본 + 일정 + 상세 + 결과 (Result) 정보 필요

def _vfn_st_create_studyresult_basic_total_demo(class_id, course_id,clinic_id, student_id):
    contents = mDemoClassContentAssignN.objects.filter(
                                        id_class = uuid.UUID(class_id),
                                        id_course = uuid.UUID(course_id),
                                        invalid = False,
                                        type = 1,
                                    )
    
    # print('_vfn_st_create_studyresult_basic_total_demo mDemoClassContentAssignN contents',contents)
    dic_properties = {}
    study_property = []
    if len(contents) == 1:
        content = contents[0]
        condition = json.loads(content.condition)
        
        for content in condition["scheduler_list"]:
            # print(content)
            property = {
                    'id' : content['id'],
                    'title' : content['title'],
                    'type' : content['type'],
                    'level' : content['level'],
                    # 나중에 숙고 , 
                    # 'on_date' : content['on_date'],
                    # 'show_off' : content['show_off'],
                    # 나중에 고려,
                    # at_time : content['at_time'],
                    # in_time : content['in_time'],
                    # 'progress':0,
                    # 'point':0,
                    # 'results' : []
                }
            
            if "show" in content:
                property["show"] = content['show']
            
            # 이것은 Class 에 의해 조정 될 수 있으므로 가져 가지 말자.
            # if "date" in content:
            #     property["date"] = content['date']
            
            # 이것도 progress/point 와 units 과 results 는 분리 관리하는 것이 좋을 수 있다.
            if "units" in content:
                property["progress"] = 0
                property["point"] = 0

                property["units"] = content['units']
                property["results"] = []

            study_property.append(property)
        pass
    
    # Todo. Jstar : mDemoStudentContentAssignN 을 거쳐 Student 화
    
    dic_properties["property"] = study_property
    # json_properties = json.dumps(dic_properties,indent=4, ensure_ascii=False)
    json_properties = json.dumps(dic_properties, ensure_ascii=False)

    ret_data = mDemoStudyResultN.objects.create(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    id_content = uuid.UUID(clinic_id),
                                    properties = json_properties,
                                    # total result
                                    type = 1,
                                 )
    # print('_vfn_st_create_studyresult_basic_total_demo',ret_data.properties)
    return ret_data


def _vfn_st_create_studyresult_basic_total(class_id, course_id, student_id):
    contents = mClassContentAssignN.objects.filter(
                                        id_class = uuid.UUID(class_id),
                                        id_course = uuid.UUID(course_id),
                                        invalid = False,
                                        type = 1,
                                    )
    
    # print('_vfn_st_create_studyresult_basic_total_demo mDemoClassContentAssignN data',data)
    dic_properties = {}
    study_property = []
    if len(contents) == 1:
        content = contents[0]
        condition = json.loads(content.condition)
        
        for content in condition.scheduler_list:
            property = {
                    'id' : content['id'],
                    'title' : content['title'],
                    'type' : content['type'],
                    'level' : content['level'],
                    # 나중에 숙고 , 
                    'date' : content['date'],
                    'show' : content['show'],
                    # 나중에 고려,
                    # at_time : content['at_time'],
                    # in_time : content['in_time'],
                    'progress':0,
                    'point':0,
                    'results' : []
                }

            if "units" in content:
                property["units"] = content['units']

            study_property.append(property)
        pass
    
    # Todo. Jstar : mDemoStudentContentAssignN 을 거쳐 Student 화
    
    dic_properties["property"] = study_property
    # json_properties = json.dumps(dic_properties,indent=4, ensure_ascii=False)
    json_properties = json.dumps(dic_properties, ensure_ascii=False)

    ret_data = mStudyResultN.objects.create(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    properties = json_properties,
                                    # total result
                                    type = 1,
                                 )
    # print('_vfn_st_create_studyresult_basic_total_demo',ret_data.properties)
    return ret_data


def _vfn_st_get_studyresult_clinic_demo(class_id, course_id, student_id):
    pass

def _vfn_st_get_studyresult_clinic(class_id, course_id, student_id):
    pass

# student -> student
# teacher -> student
def _vfn_st_get_studyresult_demo(class_id, course_id,clinic_id, student_id, student):
    ret_data = mDemoStudyResultN.objects.filter(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    id_content = uuid.UUID(clinic_id),
                                    # total result
                                    type = 1,
                                 )
    if len(ret_data) == 0:
        # 학생이 요청 -> 없으면 생성
        if student :
            ret_data = _vfn_st_create_studyresult_basic_total_demo(class_id,course_id,clinic_id,student_id)
            return ret_data.properties
        else:
            properties = {}
            properties["property"] = []
            # dummy property
            # return json.dumps(properties,indent=4,ensure_ascii=False)
            return json.dumps(properties,ensure_ascii=False)
    else:
        # properties = json.load(ret_data[0].properties)
        # if(properties["property"].length == 0)
        pass

        return ret_data[0].properties
    pass

def _vfn_st_get_studyresult_basic_total(class_id, course_id,clinic_id, student_id):
    ret_data = mStudyResultN.objects.filter(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    id_content = uuid.UUID(clinic_id),
                                    # total result
                                    type = 1,
                                 )
    if len(ret_data) == 0:
        ret_data = _vfn_st_create_studyresult_basic_total(class_id,course_id,clinic_id,student_id)
        return ret_data.properties
    else:
        return ret_data[0].properties
    pass

# Normal Course Study Result for Demo
def _vfn_st_update_studyresult_demo(class_id, course_id,clinic_id, student_id,request):
    # javascript 에서 한꺼번에 properties 를 올리는 것은 어떤가?
    properties = request.POST.get('properties')
    point = int(request.POST.get('point'))
    progress = int(request.POST.get('progress'))
    content_id = request.POST.get('content_id')
    # print('_vfn_st_update_studyresult_demo : ', clinic_id)
    ret_data = mDemoStudyResultN.objects.filter(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    # id_content = uuid.UUID(clinic_id),
                                    id_content = uuid.UUID(course_id),
                                    # total result
                                    type = 1,
                                 )
    json_properties = None
    if len(ret_data) == 1:
        # 이렇게 해도, dictionary 는 reference 로 수정 가능하다.
        json_properties = json.loads(ret_data[0].properties)
        content_list = json_properties['property']

        for content in content_list:
            if content['id'] == content_id:
                content['results'] = json.loads(properties)
                content['progress'] = progress
                content['point'] = point
                break
        ret_data[0].properties = json.dumps(json_properties,ensure_ascii=False)
        ret_data[0].save()
        pass
    else:
        pass
    pass


# Normal Course Simul Result for Demo
def _vfn_st_update_simulresult_demo(class_id, course_id,clinic_id, student_id,request):
    # simul 은 한꺼번에 올린다.
    # javascript 에서 한꺼번에 properties 를 올리는 것은 어떤가?
    properties = request.POST.get('properties')
    
    ret_data = mDemoStudyResultN.objects.filter(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    id_content = uuid.UUID(course_id),
                                    type = 1,
                                 )
    if len(ret_data) == 1:    
        ret_data[0].properties = properties
        ret_data[0].save()
        pass
    else:
        mDemoStudyResultN.objects.create(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    id_content = uuid.UUID(course_id),
                                    properties = properties,
                                    type = 1,
                                 )
        pass
    pass

# Normal Course Study Result for Real
def _vfn_st_update_studyresult_real(class_id, course_id, student_id, properties):
    ret_data = mStudyResultN.objects.filter(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    # total result
                                    type = 1,
                                 )
    study_result = None
    if len(ret_data) == 0:
        study_result = _vfn_st_create_studyresult_basic_total(class_id,course_id,student_id)
    else:
        study_result = ret_data[0]

    study_result.properties = properties
    # print('_vfn_st_update_studyresult_basic_total',properties)
    study_result.save()

    pass

def _vfn_st_update_clinicresult_demo(class_id, course_id,clinic_id, student_id,request):
    # javascript 에서 한꺼번에 properties 를 올리는 것은 어떤가?
    properties = request.POST.get('properties')
    point = int(request.POST.get('point'))
    progress = int(request.POST.get('progress'))
    content_id = request.POST.get('content_id')
    
    ret_data = mDemoStudyResultN.objects.filter(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    id_content = uuid.UUID(clinic_id),
                                    # total result
                                    type = 0,
                                 )
    json_properties = None
    if len(ret_data) == 1:

        # 이렇게 해도, dictionary 는 reference 로 수정 가능하다.
        json_properties = json.loads(ret_data[0].properties)
        content_list = json_properties['property']

        for content in content_list:
            if content['id'] == content_id:
                content['results'] = json.loads(properties)
                content['progress'] = progress
                content['point'] = point
                break
        ret_data[0].properties = json.dumps(json_properties,ensure_ascii=False)
        ret_data[0].save()
        pass
    else:
        pass
    pass


def _vfn_st_update_clinicsimulresult_demo(class_id, course_id,clinic_id, student_id,request):
    # javascript 에서 한꺼번에 properties 를 올리는 것은 어떤가?
    properties = request.POST.get('properties')
    # point = int(request.POST.get('point'))
    # progress = int(request.POST.get('progress'))
    content_id = request.POST.get('content_id')
    
    ret_data = mDemoStudyResultN.objects.filter(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    id_content = uuid.UUID(clinic_id),
                                    # total result
                                    type = 0,
                                 )
    # json_properties = None
    if len(ret_data) == 1:

        # 이렇게 해도, dictionary 는 reference 로 수정 가능하다.
        # json_properties = json.loads(ret_data[0].properties)
        # content_list = json_properties['property']

        # for content in content_list:
        #     if content['id'] == content_id:
        #         content['results'] = json.loads(properties)
        #         content['progress'] = progress
        #         content['point'] = point
        #         break
        ret_data[0].properties["property"] = properties
        # json.dumps(json_properties,ensure_ascii=False)
        ret_data[0].save()
        pass
    else:
        pass
    pass

def _vfn_st_update_clinicresult_real(class_id, course_id,clinic_id, student_id,request):
    # javascript 에서 한꺼번에 properties 를 올리는 것은 어떤가?
    properties = request.POST.get('properties')
    point = int(request.POST.get('point'))
    progress = int(request.POST.get('progress'))
    content_id = request.POST.get('content_id')
    
    ret_data = mDemoStudyResultN.objects.filter(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    id_content = uuid.UUID(clinic_id),
                                    # total result
                                    type = 0,
                                 )
    json_properties = None
    if len(ret_data) == 1:

        # 이렇게 해도, dictionary 는 reference 로 수정 가능하다.
        json_properties = json.loads(ret_data[0].properties)
        content_list = json_properties['property']

        for content in content_list:
            if content['id'] == content_id:
                content['results'] = json.loads(properties)
                content['progress'] = progress
                content['point'] = point
                break
        ret_data[0].properties = json.dumps(json_properties,ensure_ascii=False)
        ret_data[0].save()
        pass
    else:
        pass
    pass

def _vfn_st_get_classcoursecontentdetaillist_basic_demo(class_id,course_id):
    data = mDemoClassContentAssignN.objects.filter(
                                        id_class = uuid.UUID(class_id),
                                        id_course = uuid.UUID(course_id),
                                        invalid = False,
                                        type__gt = CP_CONTENT_TYPE,
                                        # total -> condition field
                                        # type = 1,
                                    ).order_by('content_order')
    
    # print('_vfn_st_create_studyresult_basic_total_demo mDemoClassContentAssignN data',data)
    dic_properties = {}
    list_property = []
    
    for datum in data:
        list_unit = []
        if datum.type == CP_TYPE_LESSON:
            
            lessons = mLesson.objects.filter(id=datum.id_content)
            # 한번
            for lesson in lessons:
                unit_ids = lesson.unit_ids.split(',')
                for unit_id in unit_ids:
                    units = mLessonUnit.objects.filter(id=uuid.UUID(unit_id))
                    # 한번
                    for unit in units:
                        content_ids = unit.content_ids.split(',')
                        types = []
                        first = True
                        for content_id in content_ids:
                            if first:
                                types.append('v')
                                first = False
                            else:
                                types.append('q')
                                
                            
                        list_unit.append(
                            {"contents":content_ids , "types":types}
                        )
                        pass
                    pass
                list_property.append(
                        {
                            "content_id" : str(datum.id_content),   # content_id
                            "content_title" : datum.title,          # content_title
                            "content_type" : datum.type,            # content_type
                            "on_date" : datum.on_date,
                            "show_off" : datum.show_off,
                            "units" : list_unit,
                        }
                    )
                pass
            pass
        elif datum.type == CP_TYPE_TESTUM:
            testums = mTestum.objects.filter(id=datum.id_content)
            # 한번
            for testum in testums:
                unit_ids = testum.unit_ids.split(',')
                for unit_id in unit_ids:
                    units = mTestumUnit.objects.filter(id=uuid.UUID(unit_id))
                    # 한번
                    for unit in units:
                        content_ids = unit.content_ids.split(',')
                        types = []
                        first = True
                        for content_id in content_ids:
                            types.append('q')
                                
                        list_unit.append(
                            {"contents":content_ids , "types":types}
                        )
                        pass
                    pass
                list_property.append(
                        {
                            "content_id" : str(datum.id_content),   # content_id
                            "content_title" : datum.title,          # content_title
                            "content_type" : datum.type,            # content_type
                            "on_date" : datum.on_date,
                            "show_off" : datum.show_off,
                            "units" : list_unit,
                        }
                    )
                pass
            pass
    
    dic_properties["property"] = list_property
    # json_properties = json.dumps(dic_properties,indent=4, ensure_ascii=False)
    json_properties = json.dumps(dic_properties, ensure_ascii=False)
    return json_properties
    pass

def _vfn_st_get_studyresult_basic(class_id, course_id, student_id):
    return _vfn_st_get_studyresult_basic_total(class_id,course_id,student_id)

def _vfn_st_get_studyresult(request,student):
    ret_data = {}
    demo = request.demo
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    student_id = request.POST.get('student_id')
    # course_type = 0 : basic , 1 : clinic 
    course_type = int(request.POST.get('course_type'))
    clinic_id = course_id
    if 'clinic_id' in request.POST:
        clinic_id = request.POST.get('clinic_id')

    if demo:
        # normal course
        if course_type == 0:    
            return _vfn_st_get_studyresult_demo(class_id,course_id,clinic_id,student_id,student)
        pass
    else:
        pass

    return ret_data

def _vfn_st_get_studyresultlist(request,student):
    ret_data = {}
    result_list = []
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

                results = _vfn_st_get_studyresult_demo(class_id,course_id,clinic_id,student_id,student)

                result_list.append({ 
                        "class_id":class_id,
                        "course_id":course_id,
                        "results" : results
                        })

            return result_list
        pass
    else:
        pass

    return ret_data


# Todo. Jstar : _vfn_st_get_studentstudyinfo 와 동일성 유지 필요
# 학생/선생님 통계 결과 보기  
def _vfn_st_get_coursecontentinfo(request,student):
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
                                        id_class = uuid.UUID(class_id),
                                        id_course = uuid.UUID(course_id),
                                        invalid = False,
                                        type = 1,
                                    )
                content_list = []
                if len(contents) == 1:
                    condition = json.loads(contents[0].condition)
                    content_list = condition['scheduler_list']
                    pass
                results = _vfn_st_get_studyresult_demo(class_id,course_id,clinic_id,student_id,student)

                study_list.append({ 
                        "class_id":class_id,
                        "course_id":course_id,
                        "content_list" : json.dumps(content_list,ensure_ascii=False),
                        "results" : results,
                        })
                # clinic_list
                contents = mDemoStudyResultN.objects.filter(
                                        id_class = uuid.UUID(class_id),
                                        id_course = uuid.UUID(course_id),
                                        id_student = uuid.UUID(student_id),
                                        invalid = False,
                                        type = 0,
                                    )
                for content in contents:
                    clinic_list.append({
                                        "class_id" : class_id,
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

def _vfn_st_update_studyresultinfo(request,bReal):
    ret_data = {}
    demo = request.demo
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    student_id = request.POST.get('student_id')
    # content_id = request.POST.get('content_id')
    # course_type = 0 : basic , 1 : clinic 
    course_type = int(request.POST.get('course_type'))
    # properties = request.POST.get('properties')
    clinic_id = course_id
    if 'clinic_id' in request.POST:
        clinic_id = request.POST.get('clinic_id')

    if demo:
        # normal course
        if course_type == 0:
            if bReal:
                return _vfn_st_update_studyresult_demo(class_id,course_id,clinic_id, student_id,request)
            else:
                return _vfn_st_update_simulresult_demo(class_id,course_id,clinic_id, student_id,request)
        # clinic course
        elif course_type == 1:
            if bReal:
                return _vfn_st_update_clinicresult_demo(class_id,course_id,clinic_id, student_id,request)
            else:
                return _vfn_st_update_clinicsimulresult_demo(class_id,course_id,clinic_id, student_id,request)
        pass
    else:
        if course_type == 0:
            return _vfn_st_update_studyresult_real(class_id,course_id,clinic_id, student_id,request)
        elif course_type == 1:
            return _vfn_st_update_clinicresult_real(class_id,course_id,clinic_id, student_id,request)
        pass

    return ret_data

def _vfn_st_get_classcoursecontentdetaillist(request):
    ret_data = {}
    demo = request.demo
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    # student_id = request.POST.get('student_id')
    # course_type = 0 : basic , 1 : clinic 
    course_type = int(request.POST.get('course_type'))
    if demo:
        if course_type == 0:
            return _vfn_st_get_classcoursecontentdetaillist_basic_demo(class_id,course_id)
        pass
    else:
        pass

    return ret_data

def _vfn_st_update_lessonresultinfo_demo(request):
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    student_id = request.POST.get('student_id')
    content_id = request.POST.get('content_id')
    progress = int(request.POST.get('progress'))
    point = int(request.POST.get('point'))
    
    # lesson_results -> study_results
    json_lesson_results = request.POST.get('lesson_results')
    lesson_results = json.loads(json_lesson_results)
    ret_data = mDemoStudyResultN.objects.filter(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    # total result
                                    type = 1,
                                 )
    if len(ret_data) == 1:
        properties = json.loads(ret_data[0].properties)

        for content in properties["property"]:
            if content['content_id'] == content_id:
                content['results'] = lesson_results
                content['progress'] = progress
                content['point'] = point
                
                break

        # ret_data[0].properties = json.dumps(properties,indent=4,ensure_ascii=False)
        ret_data[0].properties = json.dumps(properties,ensure_ascii=False)
        ret_data[0].save()
        pass
    pass

def _vfn_st_update_lessonresultinfo_basic(request):
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    student_id = request.POST.get('student_id')
    content_id = request.POST.get('content_id')
    progress = int(request.POST.get('progress'))
    point = int(request.POST.get('point'))
    pass

def _vfn_st_update_testumresultinfo_demo(request):
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    student_id = request.POST.get('student_id')
    content_id = request.POST.get('content_id')
    progress = int(request.POST.get('progress'))
    point = int(request.POST.get('point'))
    # testum_results -> study_results
    json_lesson_results = request.POST.get('testum_results')
    lesson_results = json.loads(json_lesson_results)
    ret_data = mDemoStudyResultN.objects.filter(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    # total result
                                    type = 1,
                                 )
    if len(ret_data) == 1:
        properties = json.loads(ret_data[0].properties)

        for content in properties["property"]:
            if content['content_id'] == content_id:
                content['results'] = lesson_results
                content['progress'] = progress
                content['point'] = point
                break

        # ret_data[0].properties = json.dumps(properties,indent=4,ensure_ascii=False)
        ret_data[0].properties = json.dumps(properties,ensure_ascii=False)
        ret_data[0].save()
        pass
    pass

def _vfn_st_update_testumresultinfo_basic(request):
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    student_id = request.POST.get('student_id')
    content_id = request.POST.get('content_id')
    progress = int(request.POST.get('progress'))
    point = int(request.POST.get('point'))
    pass

def _vfn_st_get_coursecontent(request):
    pass

def _vfn_st_get_lessonunit(lesson):
    lessonUnitList = []

    if lesson.unit_ids:
    #    lessonUnit_ids = lesson.content_ids.split(',')
        lessonUnit_ids = lesson.unit_ids.split(',')
        # [lu_id,lu_id] == [lesson_unit_id,lesson_unit_id]
        for lessonUnit_id in lessonUnit_ids:
            lessonUnits = mLessonUnit.objects.filter(id= uuid.UUID(lessonUnit_id))
            # [v_id, q_id, q_id, q_id]
            lessonContent_List = []
            if len(lessonUnits) == 1:
                lessonUnit = lessonUnits[0]

                if lessonUnit.content_ids:
                    lessonUnitContent_ids = lessonUnit.content_ids
                    lessonContent_ids = lessonUnitContent_ids.split(',')
                    
                    start = True
                    for content_id in lessonContent_ids:
                        if start:
                            start = False
                            if (content_id) and (content_id != 'null') and (content_id != '?'): 
                                contents = mVideoAtom.objects.filter(id=uuid.UUID(content_id),invalid= False)
                                if len(contents) == 1:
                                    videoAtom = contents[0]
                                    lessonContent_List.append(
                                        {
                                            'video': '1',
                                            'id':str(videoAtom.id.hex), # uuid include '-' 
                                            'title' : videoAtom.title,
                                            'url' : videoAtom.url,
                                            'time' : videoAtom.time,
                                        }
                                    )
                        else:
                            if (content_id) and (content_id != 'null') and (content_id != '?'):
                                # print('_getLessonContentUnit uuid',content_id)
                                contents = mQuestionAtom.objects.filter(id=uuid.UUID(content_id),invalid= False)
                                if len(contents) == 1:
                                    questionAtom = contents[0]
                                    solution_video = []
                                    solution_text = []

                                    if questionAtom.solution_video :
                                        video_solutions = mQuestionSolutionVideo.objects.filter(id=questionAtom.solution_video)
                                        for video_solution in video_solutions:
                                            solution_video.append({
                                                'url':video_solution.url,
                                                'title':video_solution.title,
                                                'time':video_solution.time,
                                                })

                                    if questionAtom.solution_text :
                                        text_solutions = mQuestionSolutionText.objects.filter(id=questionAtom.solution_text)
                                        for text_solution in text_solutions:
                                            solution_text.append({
                                                'content':text_solution.content,
                                                }) 
                                            
                                    lessonContent_List.append(
                                        {
                                            'video': '0',
                                            'id':str(questionAtom.id.hex), # uuid exclude '-' 
                                            'content' : questionAtom.content,
                                            "style": questionAtom.style, 
                                            "level": questionAtom.level,
                                            "answer":questionAtom.answer,
                                            "solution_id": questionAtom.solution_text,
                                            "video_id": questionAtom.solution_video,
                                            "solution_video":solution_video,
                                            "solution_text":solution_text,
                                            
                                        }
                                    )
                                else:
                                    print('No Question Atom Exist')

                lessonUnitList.append(
                    # {
                    #     'unit_id' : lessonUnit_id,  # uuid exclude '-' 
                    #     'content_list' : lessonContent_List
                    # }
                    lessonContent_List
                )
            
    return lessonUnitList
    pass

def _vfn_st_get_testumunit(testum):
    testumUnitList = []
    # print('_getTestumContentUnit',testum.unit_ids)
    if testum.unit_ids:  #
    #    testumUnit_ids = testum.content_ids.split(',')
        testumUnit_ids = testum.unit_ids.split(',')
        # [tu_id,tu_id] == [testum_unit_id,testum_unit_id]
        for testumUnit_id in testumUnit_ids:
            testumUnits = mTestumUnit.objects.filter(id = uuid.UUID(testumUnit_id),invalid= False)
            # [q_id, q_id, q_id]
            testumContent_List = []
            if len(testumUnits) == 1:
                testumUnit = testumUnits[0]
                # print('_getTestumContentUnit',testumUnit)
                if testumUnit.content_ids:
                    testumUnitContent_ids = testumUnit.content_ids
                    testumContent_ids = testumUnitContent_ids.split(',')

                    for content_id in testumContent_ids:
                        if (content_id) and (content_id != 'null') and (content_id != '?'): 
                            contents = mQuestionAtom.objects.filter(id=uuid.UUID(content_id),invalid= False)
                            if len(contents) == 1:
                                questionAtom = contents[0]
                                solution_video = []
                                solution_text = []

                                if questionAtom.solution_video :
                                    video_solutions = mQuestionSolutionVideo.objects.filter(id=questionAtom.solution_video)
                                    for video_solution in video_solutions:
                                        solution_video.append({
                                            'url':video_solution.url,
                                            'title':video_solution.title,
                                            'time':video_solution.time,
                                            })

                                if questionAtom.solution_text :
                                        text_solutions = mQuestionSolutionText.objects.filter(id=questionAtom.solution_text)
                                        for text_solution in text_solutions:
                                            solution_text.append({
                                                'content':text_solution.content,
                                                }) 
                                            # print('+++++ _get_testum_unit ++++++++ ')
                            
                                testumContent_List.append(
                                    {
                                        'video': '0',
                                        'id':str(questionAtom.id.hex), # uuid include '-' 
                                        'content' : questionAtom.content,
                                        "style": questionAtom.style, 
                                        "level": questionAtom.level,
                                        "answer":questionAtom.answer,
                                        "tag" : questionAtom.tag,
                                        "solution_id": questionAtom.solution_text,
                                        "video_id": questionAtom.solution_video,
                                        "solution_video":solution_video,
                                        "solution_text":solution_text,
                                    }  
                                )

                testumUnitList.append(
                    # {
                    #     'unit_id' : testumUnit_id,  # 
                    #     'content_list' : testumContent_List
                    # }
                    testumContent_List
                )
    # testum 의 쌍둥이 문제는 어떻게 ....

    return testumUnitList

def _v2st_get_lessoninfo(request):
    content_list = []

    # units = json.loads(request.POST.get('units'))
    course_id = request.POST.get('course_id')
    content_id = request.POST.get('content_id')
    courses = mCourseN.objects.filter(id=uuid.UUID(course_id),invalid=False)
    if len(courses) != 1:
        return content_list
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
        return content_list
    
    units = contents[content_idx]['units']
    # print('_v2tc_get_lessoninfo 1: ', units)
    
    for unit in units:
        index = 0
        contentunit_list = []
        # print('_v2tc_get_lessoninfo 2: ', unit['types'])
        for type in unit['types']:
            content_id = unit['ids'][index]
            # print('_v2tc_get_lessoninfo > content_id : ', content_id)
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
                    id = uuid.UUID(content_id),
                    type=2,
                    # invalid = False
                    )
                if len(elements) == 1:
                    info = json.loads(elements[0].json_data)
                    contentunit_list.append(
                        {
                            'video': 1,
                            'id' : str(elements[0].id),
                            'title':info['title'],
                            'url':info['url'],
                            'time':info['time'],
                            'json_data' : elements[0].json_data
                        }
                    )
                    pass
                pass
            # {
            #     'video': '0',
            #     'id':str(questionAtom.id.hex), # uuid include '-' 
            #     'content' : questionAtom.content,
            #     "style": questionAtom.style, 
            #     "level": questionAtom.level,
            #     "answer":questionAtom.answer,
            #     "tag" : questionAtom.tag,
            #     "solution_id": questionAtom.solution_text,
            #     "video_id": questionAtom.solution_video,
            #     "solution_video":solution_video,
            #     "solution_text":solution_text,
            # }  
            # solution_text.append({
            #   'content':text_solution.content,
            # }) 
            # solution_video.append({
            #     'url':video_solution.url,
            #     'title':video_solution.title,
            #     'time':video_solution.time,
            # })
            elif type == 'q':
                elements = mElementN.objects.filter(
                    id = uuid.UUID(content_id),
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
                                    id = uuid.UUID(solution_id),
                                    type = CP_TYPE_EL_SOL_T,
                                    invalid = False
                                )
                            if len(solutions) == 1:
                                sol_info = json.loads(solutions[0].json_data)
                                sol_text.append({'content': sol_info['main']})
                        pass

                    # solution video
                    if len(info["sol_video"]) > 0:
                        for solution_id in info["sol_video"]:
                            solutions = mElementN.objects.filter(
                                    id = uuid.UUID(solution_id),
                                    type = CP_TYPE_EL_SOL_V,
                                    invalid = False
                                )
                            if len(solutions) == 1:
                                sol_info = json.loads(solutions[0].json_data)
                                sol_video.append({
                                    'time': sol_info['time'],
                                    'title':sol_info['title'],
                                    'url': sol_info['url'],
                                    })
                        pass
                    contentunit_list.append(
                        {
                            'video': 0,
                            'id' : str(elements[0].id),
                            'content' : info['main'],
                            "style": info['style'], 
                            "level": info['level'],
                            "answer":info['answer'],
                            "tag" : info['tag'],
                            'sol_text':sol_text,
                            'sol_video':sol_video,
                            'json_data' : elements[0].json_data
                        }
                    )
                    
                pass
        content_list.append(contentunit_list)
    return content_list
    pass

def _vfn_st_get_lessoninfo(request):
    lessonContent = []
    lesson_id = request.POST.get('content_id')
    lessons = mLesson.objects.filter(id = uuid.UUID(lesson_id), invalid = False)
    if len(lessons) != 1:
        return lessonContent
    
    return _vfn_st_get_lessonunit(lessons[0])

    pass


def _v2st_get_testuminfo(request):
    content_list = []

    # units = json.loads(request.POST.get('units'))
    course_id = request.POST.get('course_id')
    content_id = request.POST.get('content_id')
    courses = mCourseN.objects.filter(id=uuid.UUID(course_id),invalid=False)
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
    # print('_v2st_get_testuminfo 0: ', content_idx)
    if bFindIdx == False:
        return content_list
    
    units = contents[content_idx]['units']
    # print('_v2st_get_testuminfo 1: ', units)
    
    for unit in units:
        index = 0
        contentunit_list = []
        # print('_v2st_get_testuminfo 2: ', unit['types'])
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
                    id = uuid.UUID(content_id),
                    type=2,invalid = False
                    )
                if len(elements) == 1:
                    info = json.loads(elements[0].json_data)
                    contentunit_list.append(
                        {
                            'video': 1,
                            'id' : str(elements[0].id),
                            'title':info['title'],
                            'url':info['url'],
                            'time':info['time'],
                            'json_data' : elements[0].json_data
                        }
                    )
                    pass
                pass
            # {
            #     'video': '0',
            #     'id':str(questionAtom.id.hex), # uuid include '-' 
            #     'content' : questionAtom.content,
            #     "style": questionAtom.style, 
            #     "level": questionAtom.level,
            #     "answer":questionAtom.answer,
            #     "tag" : questionAtom.tag,
            #     "solution_id": questionAtom.solution_text,
            #     "video_id": questionAtom.solution_video,
            #     "solution_video":solution_video,
            #     "solution_text":solution_text,
            # }  
            # solution_text.append({
            #   'content':text_solution.content,
            # }) 
            # solution_video.append({
            #     'url':video_solution.url,
            #     'title':video_solution.title,
            #     'time':video_solution.time,
            # })
            elif type == 'q':
                elements = mElementN.objects.filter(
                    id = uuid.UUID(content_id),
                    type=1,invalid = False
                    )
                if len(elements) == 1:
                    info = json.loads(elements[0].json_data)
                    contentunit_list.append(
                        {
                            'video': 0,
                            'id' : str(elements[0].id),
                            'content' : info['main'],
                            "style": info['style'], 
                            "level": info['level'],
                            "answer":info['answer'],
                            "tag" : info['tag'],
                            'json_data' : elements[0].json_data
                        }
                    )
                pass
        content_list.append(contentunit_list)
        
    return content_list
    pass

def _vfn_st_get_testuminfo(request):
    testumContent = []
    testum_id = request.POST.get('content_id')
    testums = mTestum.objects.filter(id = uuid.UUID(testum_id), invalid = False)
    if len(testums) != 1:
        return testumContent
    
    return _vfn_st_get_testumunit(testums[0])
    pass

def _vfn_st_get_videoinfo(request):
    videoContent = []
    video_id = request.POST.get('video_id')
    contents = mVideoAtom.objects.filter(id=uuid.UUID(video_id),invalid= False)
    if len(contents) == 1:
        videoAtom = contents[0]
        videoContent.append(
            {
                'video': '1',
                'id':str(videoAtom.id.hex), # uuid include '-' 
                'title' : videoAtom.title,
                'url' : videoAtom.url,
                'time' : videoAtom.time,
            }
        )
    pass


def _vfn_st_get_questioninfo(request):
    questionContent = []
    question_id = request.POST.get('question_id')
    contents = mQuestionAtom.objects.filter(id=uuid.UUID(question_id),invalid= False)
    if len(contents) == 1:
        questionAtom = contents[0]
        solution_video = []
        solution_text = []

        if questionAtom.solution_video :
            video_solutions = mQuestionSolutionVideo.objects.filter(id=questionAtom.solution_video)
            for video_solution in video_solutions:
                solution_video.append({
                    'url':video_solution.url,
                    'title':video_solution.title,
                    'time':video_solution.time,
                    })

        if questionAtom.solution_text :
            text_solutions = mQuestionSolutionText.objects.filter(id=questionAtom.solution_text)
            for text_solution in text_solutions:
                solution_text.append({
                    'content':text_solution.content,
                    }) 
                
        questionContent.append(
            {
                'video': '0',
                'id':str(questionAtom.id.hex), # uuid exclude '-' 
                'content' : questionAtom.content,
                "style": questionAtom.style, 
                "level": questionAtom.level,
                "answer":questionAtom.answer,
                "solution_id": questionAtom.solution_text,
                "video_id": questionAtom.solution_video,
                "solution_video":solution_video,    # 멀티 - array
                "solution_text":solution_text,      # 멀티 - array
                
            }
        )

    pass

def _vfn_st_get_classscontentlist_demo(request):
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    
    contents = mDemoClassContentAssignN.objects.filter(
                                        id_class = uuid.UUID(class_id),
                                        id_course = uuid.UUID(course_id),
                                        invalid = False,
                                        type = 1,
                                    )
    
    # print('_vfn_st_get_classscontentlist_demo mDemoClassContentAssignN contents',contents)
    dic_properties = {}
    study_property = []
    if len(contents) == 1:
        content = contents[0]
        condition = json.loads(content.condition)
        # return json.dumps(condition["scheduler_list"],indent=4,ensure_ascii=False)
        return json.dumps(condition["scheduler_list"],ensure_ascii=False)
    
    return json.dumps([])
    pass

def _vfn_st_get_classsstudentstudyresultlist_demo(request):
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    json_student_ids = request.POST.get('student_ids')
    # print('json_student_ids',json_student_ids)
    student_ids = json.loads(json_student_ids)
    # print('student_ids',student_ids)
    study_list = []
    for student_id in student_ids:
        study_results = mDemoStudyResultN.objects.filter(
                                        id_class = uuid.UUID(class_id),
                                        id_course = uuid.UUID(course_id),
                                        id_student = uuid.UUID(student_id),
                                        id_content = uuid.UUID(course_id),
                                        invalid = False,
                                        type = 1,        
        )

        if len(study_results) == 1:
            study_result = json.loads(study_results[0].properties)
            study_list.append(study_result["property"])
        else:
            study_list.append([])

    
    return json.dumps(study_list,ensure_ascii=False)
    pass


def _vfn_st_get_classsstudentstudyinfo_demo(request):
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    json_student_ids = request.POST.get('student_ids')
    # print('json_student_ids',json_student_ids)
    student_ids = json.loads(json_student_ids)
    # print('student_ids',student_ids)
    study_list = []
    for student_id in student_ids:
        study_results = mDemoStudyResultN.objects.filter(
                                        id_class = uuid.UUID(class_id),
                                        id_course = uuid.UUID(course_id),
                                        id_student = uuid.UUID(student_id),
                                        id_content = uuid.UUID(course_id),
                                        invalid = False,
                                        type = 1,        
        )

        if len(study_results) == 1:
            study_result = json.loads(study_results[0].properties)
            study_list.append(study_result["property"])
        else:
            study_list.append([])

    
    return json.dumps(study_list,ensure_ascii=False)
    pass


def _vfn_st_get_clinicstudentstudyinfo_demo(request):
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    json_student_ids = request.POST.get('student_ids')
    # print('json_student_ids',json_student_ids)
    student_ids = json.loads(json_student_ids)

    student_id = student_ids[0]
    clinic_list = []
    # for student_id in student_ids:
    study_results = mDemoStudyResultN.objects.filter(
                                    id_class = uuid.UUID(class_id),
                                    id_course = uuid.UUID(course_id),
                                    id_student = uuid.UUID(student_id),
                                    # id_content = uuid.UUID(course_id),
                                    invalid = False,
                                    type = 0,        
    )

    for study_result in study_results:
        clinic_list.append(
            {
                "class_id": class_id,
                "clinic_id": str(study_result.id_content),       
                "properties": study_result.properties
            }
            )
    
    # return json.dumps(clinic_list,ensure_ascii=False)
    return clinic_list
    pass


def _vfn_st_get_contentinfo(request):
    content_type = int(request.POST.get('content_type'))

    if content_type == CP_TYPE_LESSON:
        # v1
        # return _vfn_st_get_lessoninfo(request)
        # v2
        return _v2st_get_lessoninfo(request)
    elif content_type == CP_TYPE_TESTUM or content_type == CP_TYPE_EXAM :
        # v1
        # return _vfn_st_get_testuminfo(request)
        # v2
        return _v2st_get_testuminfo(request)
    else:
        return []
    
    pass

# 결국 lessonresultinfo 나 testumresultinfo 는 
# 같은 기능...
# 추후에 studyresultinfo 로 통일 하는 것이 어떨까?
def _vfn_st_update_lessonresultinfo(request):
    content_type = int(request.POST.get('content_type'))
    
    demo = request.demo
    
    if demo:
        _vfn_st_update_lessonresultinfo_demo(request)
    else:
        _vfn_st_update_lessonresultinfo_basic(request)

    pass

def _vfn_st_update_testumresultinfo(request):
    content_type = int(request.POST.get('content_type'))
    
    demo = request.demo

    if demo:
        _vfn_st_update_testumresultinfo_demo(request)
    else:
        _vfn_st_update_testumresultinfo_basic(request)
    
    pass

# 클래스 전체 -> 정규 코스 --> 점수,진도 최적화 필요
def _vfn_st_get_classstudentstudyresultlist(request):
    result = {}
    demo = request.demo
    if demo:
        result["content_list"] = _vfn_st_get_classscontentlist_demo(request)
        result["study_list"] = _vfn_st_get_classsstudentstudyresultlist_demo(request)
        pass
    else:
        result["content_list"] = json.dumps([])
        result["study_list"] = json.dumps([])
        pass

    return result
    pass

# 학생 한명 -> 정규 코스
def _vfn_st_get_studentstudyresultlist(request):
    result = {}
    demo = request.demo
    if demo:
        result["content_list"] = _vfn_st_get_classscontentlist_demo(request)
        result["study_list"] = _vfn_st_get_classsstudentstudyresultlist_demo(request)
        pass
    else:
        result["content_list"] = json.dumps([])
        result["study_list"] = json.dumps([])
        pass

    return result
    pass

# 학생 한명 -> 정규 코스
# Todo. Jstar : _vfn_st_get_coursecontentinfo 와 동일성 유지 필요
# 학생/선생님 통계 결과 보기  
def _vfn_st_get_studentstudyinfo(request):
    result = {}
    demo = request.demo
    if demo:
        result["content_list"] = _vfn_st_get_classscontentlist_demo(request)
        result["study_list"] = _vfn_st_get_classsstudentstudyinfo_demo(request)
        result["clinic_list"] = _vfn_st_get_clinicstudentstudyinfo_demo(request)
        pass
    else:
        result["content_list"] = json.dumps([])
        result["study_list"] = json.dumps([])
        pass

    return result
    pass

# 학생 한명 -> 클리닉 코스
def _vfn_st_get_clinicstudentstudyinfo(request):
    result = {}
    demo = request.demo
    if demo:
        # result["content_list"] = _vfn_st_get_classscontentlist_demo(request)
        result["study_list"] = _vfn_st_get_clinicstudentstudyinfo_demo(request)
        pass
    else:
        # result["content_list"] = json.dumps([])
        result["study_list"] = json.dumps([])
        pass

    return result
    pass