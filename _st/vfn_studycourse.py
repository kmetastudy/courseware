import uuid
import json
from .models import mStudyResultN, mDemoStudyResultN
from _tc.models import mClassContentAssignN, mDemoClassContentAssignN
from _cp.models import mCourseBook, mCourseBookBranch, mLesson, mLessonUnit, mTestum, mTestumUnit
from _cp.models import mVideoAtom, mQuestionAtom
from _cp.models import mQuestionSolutionVideo, mQuestionSolutionText
from _cp.nmodels import mCourseN,mElementN

from _mn.models import mDemoAgencyN,mDemoTeacherN,mDemoStudentN,mDemoACLMapperN
from _mn.models import mDemoStudentExtraN
from _tc.models import mDemoClassN

from _tc.models import mClass,mStudent,mClassContentAssign,mClassContentReassign,mClinicContentAssign
from _tc.models import mStudentDetail

from _ml.constants import *
from _cp.constants import *

def _vfn_st_get_assignedcourseinfo(request):
    result = {}
    
    content_list = []
    student_name = ''
    
    # print('start get assigned course')
    demo = request.demo

    student_code = request.POST.get('student_code')
    student_id = request.POST.get('student_id')
    # student_id = None
    if demo:
        # print('demo mode : _tc_getassignedcourse')
        agency_code = request.academyCode
        agencies = mDemoAgencyN.objects.filter(code = agency_code, invalid=False)
        if len(agencies) != 1:
            # content_list -> course_list 로 바꿔야 맞다.
            result = {
                'student_name': '신원미상',
                'student_id': None,
                'content_list' : content_list,
            }
        id_agency = agencies[0].id
        students = mDemoStudentN.objects.filter(
                                    # id= uuid.UUID(student_id),
                                    id_agency = id_agency,
                                    code = student_code,
                                    invalid = False)
        if len(students) != 1:
            # content_list -> course_list 로 바꿔야 맞다.
            result = {
                'student_name': '신원미상',
                'student_id': None,
                'content_list' : content_list,
            }
            return result
        student_id = str(students[0].id)
        student_name = students[0].name
        student_extras = mDemoStudentExtraN.objects.filter(id= uuid.UUID(student_id))

        if len(student_extras) != 1:
            # content_list -> course_list 로 바꿔야 맞다.
            result = {
                'student_name': student_name,
                'student_id': student_id,
                'content_list' : content_list,
            }
            return result

        ids_class = student_extras[0].ids_class
        inclass_list = []
        if ids_class:
            inclass_list = ids_class.split(',')
        
        if len(inclass_list) <= 0:
            # content_list -> course_list 로 바꿔야 맞다.
            result = {
                'student_name': student_name,
                'student_id': student_id,
                'content_list' : content_list,
            }
            return result

        for inclass in inclass_list:
            classes = mDemoClassN.objects.filter(id=uuid.UUID(inclass))
            if len(classes) == 1:
                course_ids = classes[0].ids_course
                class_id = classes[0].id
                course_id_list = []
                if course_ids :
                    course_id_list = course_ids.split(',')
                    for course_id in course_id_list:
                        # Todo. mBookNXX
                        # courses = mCourseBook.objects.filter(id=uuid.UUID(course))
                        courses = mCourseN.objects.filter(id=uuid.UUID(course_id),
                                                          type=CP_BOOK_TYPE_C,
                                                          invalid=False)
                        if len(courses) == 1:
                            content = {'class_id': str(class_id), 'course_id':str(courses[0].id), 'title':courses[0].title}
                            content_list.append(content)

        # result = {
        #         'student_name': student_name,
        #         'student_id': student_id,
        #         'content_list' : content_list,
        #     }
        pass

    else:
        students = mStudent.objects.filter(code=student_code,invalid=False)
        
        if len(students) != 1:
            result = {
                'student_name': '신원미상',
                'student_id': None,
                'content_list' : content_list,
            }
            # return JsonResponse({"message": "getAssignedCourse", "result":result},status=200)
            return result

        student_id = students[0].id
        student_name = students[0].name
        student_details = mStudentDetail.objects.filter(student_id=student_id)

        if len(student_details) != 1:
            result = {
                'student_name': student_name,
                'student_id': student_id,
                'content_list' : content_list,
            }
            # return JsonResponse({"message": "getAssignedCourse", "result":result},status=200)
            return result

        inclasses_ids = student_details[0].inclasses_ids
        inclass_list = []
        if inclasses_ids:
            inclass_list = inclasses_ids.split(',')
        
        if len(inclass_list) <= 0:
            result = {
                'student_name': student_name,
                'student_id': student_id,
                'content_list' : content_list,
            }
            # return JsonResponse({"message": "getAssignedCourse", "result":result},status=200)
            return result

        for inclass in inclass_list:
            classes = mClass.objects.filter(id=uuid.UUID(inclass))
            if len(classes) == 1:
                course_ids = classes[0].course_ids
                class_id = classes[0].id
                course_id_list = []
                if course_ids :
                    course_id_list = course_ids.split(',')
                    for course_id in course_id_list:
                        # courses = mCourseBook.objects.filter(id=uuid.UUID(course_id))
                        courses = mCourseN.objects.filter(id=uuid.UUID(course_id),
                                                          type = CP_BOOK_TYPE_C,
                                                          invalid = False)
                        if len(courses) == 1:
                            content = {'class_id': str(class_id), 'course_id':str(courses[0].id), 'title':courses[0].title}
                            content_list.append(content)

    result = {
            'student_name': student_name,
            'student_id': student_id,
            'content_list' : content_list,
        }
    # print('getassignedcourse > content_list :', content_list ,student_id)
    return result
    pass

def _vfn_st_get_assignedcourseinfo_v2(request):
    result = {}
    
    content_list = []
    student_name = ''
    
    # print('start get assigned course')
    demo = request.demo

    student_code = request.POST.get('student_code')
    student_id = request.POST.get('student_id')
    # student_id = None
    if demo:
        # print('demo mode : _tc_getassignedcourse')
        agency_code = request.academyCode
        agencies = mDemoAgencyN.objects.filter(code = agency_code, invalid=False)
        if len(agencies) != 1:
            # content_list -> course_list 로 바꿔야 맞다.
            result = {
                'student_name': '신원미상',
                'student_id': None,
                'content_list' : content_list,
            }
        id_agency = agencies[0].id
        _students = mDemoStudentN.objects.filter(
                                    # id= uuid.UUID(student_id),
                                    id_agency = id_agency,
                                    code = student_code,
                                    invalid = False)
        if len(_students) != 1:
            # content_list -> course_list 로 바꿔야 맞다.
            result = {
                'student_name': '신원미상',
                'student_id': None,
                'content_list' : content_list,
            }
            return result
        
        student_name = _students[0].name
        student_id = _students[0].id
        
        if _students[0].json_data:
            student_json_info = json.loads(_students[0].json_data)
            student_class_info = student_json_info['class_info']

            for class_info in student_class_info:
                _classes = mDemoClassN.objects.filter(id=uuid.UUID(class_info['id']))

                if len(_classes) == 1:
                    class_json_info = json.loads(_classes[0].json_data)
                    course_info = class_json_info['course']
                    # class_id = _classes[0].id
                    for course in course_info:
                        _courses = mCourseBook.objects.filter(id=uuid.UUID(course['id']))
                        if len(_courses) == 1:
                            content = {'class_id': str(_classes[0].id), 'course_id':str(_courses[0].id), 'title':_courses[0].title}
                            content_list.append(content)

        result = {
                'student_name': student_name,
                'student_id': student_id,
                'content_list' : content_list,
            }
        

    else:
        students = mStudent.objects.filter(code=student_code,invalid=False)
        
        if len(students) != 1:
            result = {
                'student_name': '신원미상',
                'student_id': None,
                'content_list' : content_list,
            }
            # return JsonResponse({"message": "getAssignedCourse", "result":result},status=200)
            return result

        student_id = students[0].id
        student_name = students[0].name
        student_details = mStudentDetail.objects.filter(student_id=student_id)

        if len(student_details) != 1:
            result = {
                'student_name': student_name,
                'student_id': student_id,
                'content_list' : content_list,
            }
            # return JsonResponse({"message": "getAssignedCourse", "result":result},status=200)
            return result

        inclasses_ids = student_details[0].inclasses_ids
        inclass_list = []
        if inclasses_ids:
            inclass_list = inclasses_ids.split(',')
        
        if len(inclass_list) <= 0:
            result = {
                'student_name': student_name,
                'student_id': student_id,
                'content_list' : content_list,
            }
            # return JsonResponse({"message": "getAssignedCourse", "result":result},status=200)
            return result

        for inclass in inclass_list:
            classes = mClass.objects.filter(id=uuid.UUID(inclass))
            if len(classes) == 1:
                course_ids = classes[0].course_ids
                class_id = classes[0].id
                course_id_list = []
                if course_ids :
                    course_id_list = course_ids.split(',')
                    for course_id in course_id_list:
                        # courses = mCourseBook.objects.filter(id=uuid.UUID(course_id))
                        courses = mCourseN.objects.filter(id=uuid.UUID(course_id),
                                                          type = CP_BOOK_TYPE_C,
                                                          invalid = False)
                        if len(courses) == 1:
                            content = {'class_id': str(class_id), 'course_id':str(courses[0].id), 'title':courses[0].title}
                            content_list.append(content)

    result = {
            'student_name': student_name,
            'student_id': student_id,
            'content_list' : content_list,
        }
    # print('getassignedcourse > content_list :', content_list ,student_id)
    return result
    pass
