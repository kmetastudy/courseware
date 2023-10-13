# from .vfn_studycourse import _vfn_st_get_assignedcourseinfo, _vfn_st_get_assignedcourseinfo_v2
# from .vfn_studyresult import _vfn_st_get_contentinfo, _vfn_st_get_coursecontentinfo
# from .vfn_studyresult import _vfn_st_get_questioninfo, _vfn_st_get_testuminfo
# from .vfn_studyresult import _vfn_st_get_videoinfo, _vfn_st_get_lessoninfo
# from .vfn_studyresult import _vfn_st_get_studyresult, _vfn_st_get_studyresultlist
# from .vfn_studyresult import _vfn_st_update_studyresultinfo
# from .vfn_studyresult import _vfn_st_update_lessonresultinfo, _vfn_st_update_testumresultinfo
# from .vfn_studyresult import _vfn_st_get_coursecontent
import uuid
import json

from django.shortcuts import render
from django.http import JsonResponse
from django.views import View
from _cp.models import mCourseBook, mQuestionSolutionVideo, mQuestionSolutionText

from _cp.models import mQuestionAtom, mVideoAtom, mCourseBookBranch, mTestum, mTestumUnit, mLesson, mLessonUnit
from _cp.models import mMapper
# from _tc.models import mClass, mStudent, mClassContentAssign, mClassContentReassign, mClinicContentAssign
# from _tc.models import mStudentDetail
from .models import mTestumProgress, mLessonProgress
from .models import mTestumResult, mLessonResult
from _ml.utils import jwtlogin_decorator, jwtlogin_st_decorator, make_context
# for dev -> use fake decorator
from _ml.utils import jwtlogin_st_decorator0, make_context0
from _ml.constants import *
from _cp.constants import *

# from _tc.models import mDemoClassN
# from _mn.models import mDemoAgencyN, mDemoTeacherN, mDemoStudentN, mDemoACLMapperN
# from _mn.models import mDemoStudentExtraN
# from _tc.models import mDemoClassContentAssignN, mDemoStudentContentAssignN, mDemoClinicContentAssignN
from _st.models import mDemoStudyLogN, mDemoStudyResultN

# Create your views here.

###########################################################################################


@jwtlogin_st_decorator0
def study_view(request):
    context = {'context': json.dumps(make_context0(request))}
    return render(request, "_st/_st.html", context)

###########################################################################################


def _set_content_progress(student_id, class_id, course_id, content_id, type, point, progress, try_count):
    # progresses = []
    # print('_get_content_progress content_id',content_id)
    if type == CP_TYPE_LESSON:
        progresses = mLessonProgress.objects.filter(student_id=uuid.UUID(student_id),
                                                    class_id=uuid.UUID(class_id), course_id=uuid.UUID(course_id),
                                                    lesson_id=uuid.UUID(
                                                        content_id)
                                                    )
        if len(progresses) == 1:
            progresses[0].progress = progress
            progresses[0].point = point
            progresses[0].try_count = try_count
            progresses[0].save()
        elif len(progresses) == 0:
            mLessonProgress.objects.create(student_id=uuid.UUID(student_id),
                                           class_id=uuid.UUID(class_id), course_id=uuid.UUID(course_id),
                                           lesson_id=uuid.UUID(content_id),
                                           progress=progress, point=point,
                                           try_count=try_count
                                           )
            pass
        else:
            print('In mLessonProgress something wrong _set_content_progress')
        pass
    elif type == CP_TYPE_TESTUM or type == CP_TYPE_EXAM:
        progresses = mTestumProgress.objects.filter(student_id=uuid.UUID(student_id),
                                                    class_id=uuid.UUID(class_id), course_id=uuid.UUID(course_id),
                                                    testum_id=uuid.UUID(
                                                        content_id)
                                                    )

        if len(progresses) > 0:
            if type == CP_TYPE_TESTUM:
                progresses[0].progress = progress
            # elif progresses[0].progress == 0:       # CP_TYPE_EXAM and time == 0
            #     progresses[0].progress = progress

            progresses[0].point = point
            progresses[0].try_count = try_count
            progresses[0].save()
        elif len(progresses) == 0:
            mTestumProgress.objects.create(student_id=uuid.UUID(student_id),
                                           class_id=uuid.UUID(class_id), course_id=uuid.UUID(course_id),
                                           testum_id=uuid.UUID(content_id),
                                           progress=progress, point=point,
                                           try_count=try_count
                                           )
            pass
        else:
            print('In mTestumProgress something wrong _set_content_progress')
        pass
    return


def _get_content_progress(student_id, class_id, course_id, content_id, type):
    progresses = []
    # print('_get_content_progress content_id',content_id)
    if type == CP_TYPE_LESSON:
        progresses = mLessonProgress.objects.filter(student_id=uuid.UUID(student_id),
                                                    class_id=uuid.UUID(class_id), course_id=uuid.UUID(course_id),
                                                    lesson_id=uuid.UUID(
                                                        content_id.hex)
                                                    )
        pass
    elif type == CP_TYPE_TESTUM or type == CP_TYPE_EXAM:
        progresses = mTestumProgress.objects.filter(student_id=uuid.UUID(student_id),
                                                    class_id=uuid.UUID(class_id), course_id=uuid.UUID(course_id),
                                                    testum_id=uuid.UUID(
                                                        content_id.hex)
                                                    )
        pass

    if len(progresses) > 0:
        progress = progresses[0]
        return progress.progress, progress.point, progress.try_count

    return 0, 0, 0


def _get_assigned_content_detail(content_list, student_id, class_id, course_id, content):
    progress, point, try_count = _get_content_progress(
        student_id, class_id, course_id, content.content_id, content.content_type)
    content_list.append({
        'class_id': class_id,
        'course_id': course_id,
        'content_id': content.content_id,
        'content_title': content.content_title,
        'content_type': content.content_type,
        'progress': progress,
        'point': point,
        'try_count': try_count,
    })


def _get_assigned_exam_content_detail(content_list, student_id, class_id, course_id, content):
    progress, point, try_count = _get_content_progress(
        student_id, class_id, course_id, content.content_id, content.content_type)
    content_list.append({
        'class_id': class_id,
        'course_id': course_id,
        'content_id': content.content_id,
        'content_title': content.content_title,
        'content_type': content.content_type,
        'examdate': content.completed_date,    # date-time
        'examtime': content.content_name,      # time period
        # duration, ontime, resulttime , etc...
        'attribute': content.sections,
        'progress': progress,
        'point': point,
        'try_count': try_count,
    })


def _get_assigned_content_detail_with(content_list, student_id, class_id, course_id, content, reassigned):
    if reassigned:
        pass
    progress, point, try_count = _get_content_progress(
        student_id, class_id, course_id, content.content_id, content.content_type)
    content_list.append({
        'class_id': class_id,
        'course_id': course_id,
        'content_id': content.content_id,
        'content_type': content.content_type,
        'content_title': content.content_title,
        'content_type': content.content_type,
        'progress': progress,
        'point': point,
        'try_count': try_count,
    })


def _get_assigned_basic_content_stat_detail(content_list, student_id, class_id, course_id, content):
    progress, point, try_count = _get_content_progress(
        student_id, class_id, course_id, content.content_id, content.content_type)
    # print('content.content_id',content.content_id)
    contentUnitList, twin, twin_num = _get_content_detail(
        uuid.UUID(content.content_id.hex))

    content_list.append({
        'class_id': class_id,
        'course_id': course_id,
        'content_id': content.content_id,
        # 'content_type':content.content_type,
        'content_title': content.content_title,
        'content_type': content.content_type,
        'progress': progress,
        'point': point,
        'try_count': try_count,
        'unit_list': contentUnitList,
    })


def _st_get_assigned_basic_content_stat_detail_with_kl(content_list, student_id, class_id, course_id, content):
    kl_book = set([])
    contentUnitList, twin, twin_num = _st_get_content_detail_with_kl(
        uuid.UUID(content.content_id.hex),
        kl_book
    )

    content_list.append({
        'class_id': class_id,
        'course_id': course_id,
        'content_id': content.content_id,
        # 'content_type':content.content_type,
        'content_title': content.content_title,
        'content_type': content.content_type,
        # 'progress' : progress,
        # 'point' : point,
        # 'try_count' : try_count,
        'unit_list': contentUnitList,
    })


def _get_assigned_clinic_content_stat_detail(content_list, student_id, class_id, course_id, content):
    progress, point, try_count = _get_content_progress(
        student_id, class_id, course_id, content.content_id, content.content_type)
    # print('content.content_id',content.content_id)
    contentUnitList, twin, twin_num = _get_content_detail(
        uuid.UUID(content.content_id.hex))

    content_list.append({
        'class_id': class_id,
        'course_id': course_id,
        'content_id': content.content_id,
        # 'content_type':content.content_type,
        'content_title': content.content_title,
        'content_type': content.content_type,
        'progress': progress,
        'point': point,
        'try_count': try_count,
        'unit_list': contentUnitList,
    })


def _get_testum_unit(testum):

    testumUnitList = []
    # print('_getTestumContentUnit',testum.unit_ids)
    if testum.unit_ids:  #
        #    testumUnit_ids = testum.content_ids.split(',')
        testumUnit_ids = testum.unit_ids.split(',')
        # [tu_id,tu_id] == [testum_unit_id,testum_unit_id]
        for testumUnit_id in testumUnit_ids:
            testumUnits = mTestumUnit.objects.filter(
                id=uuid.UUID(testumUnit_id), invalid=False)
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
                            contents = mQuestionAtom.objects.filter(
                                id=uuid.UUID(content_id), invalid=False)
                            if len(contents) == 1:
                                questionAtom = contents[0]
                                solution_video = []
                                solution_text = []

                                if questionAtom.solution_video:
                                    video_solutions = mQuestionSolutionVideo.objects.filter(
                                        id=questionAtom.solution_video)
                                    for video_solution in video_solutions:
                                        solution_video.append({
                                            'url': video_solution.url,
                                            'title': video_solution.title,
                                            'time': video_solution.time,
                                        })

                                if questionAtom.solution_text:
                                    text_solutions = mQuestionSolutionText.objects.filter(
                                        id=questionAtom.solution_text)
                                    for text_solution in text_solutions:
                                        solution_text.append({
                                            'content': text_solution.content,
                                        })
                                        # print('+++++ _get_testum_unit ++++++++ ')

                                testumContent_List.append(
                                    {
                                        'video': '0',
                                        # uuid include '-'
                                        'id': str(questionAtom.id.hex),
                                        'content': questionAtom.content,
                                        "style": questionAtom.style,
                                        "level": questionAtom.level,
                                        "answer": questionAtom.answer,
                                        "tag": questionAtom.tag,
                                        "solution_id": questionAtom.solution_text,
                                        "video_id": questionAtom.solution_video,
                                        "solution_video": solution_video,
                                        "solution_text": solution_text,
                                    }
                                )

                testumUnitList.append(
                    {
                        'unit_id': testumUnit_id,  #
                        'content_list': testumContent_List
                    }
                )

    return testumUnitList


def _st_get_testum_unit_with_kl(testum, kl_book):

    testumUnitList = []
    # print('_getTestumContentUnit',testum.unit_ids)
    if testum.unit_ids:  #
        #    testumUnit_ids = testum.content_ids.split(',')
        testumUnit_ids = testum.unit_ids.split(',')
        # [tu_id,tu_id] == [testum_unit_id,testum_unit_id]
        for testumUnit_id in testumUnit_ids:
            testumUnits = mTestumUnit.objects.filter(
                id=uuid.UUID(testumUnit_id), invalid=False)
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
                            contents = mQuestionAtom.objects.filter(
                                id=uuid.UUID(content_id), invalid=False)
                            if len(contents) == 1:
                                questionAtom = contents[0]
                                solution_video = []
                                solution_text = []

                                if questionAtom.solution_video:
                                    video_solutions = mQuestionSolutionVideo.objects.filter(
                                        id=questionAtom.solution_video)
                                    for video_solution in video_solutions:
                                        solution_video.append({
                                            'url': video_solution.url,
                                            'title': video_solution.title,
                                            'time': video_solution.time,
                                        })

                                if questionAtom.solution_text:
                                    text_solutions = mQuestionSolutionText.objects.filter(
                                        id=questionAtom.solution_text)
                                    for text_solution in text_solutions:
                                        solution_text.append({
                                            'content': text_solution.content,
                                        })
                                        # print('+++++ _get_testum_unit ++++++++ ')
                                # kl mapping information
                                mappings = mMapper.objects.filter(
                                    id_myself=uuid.UUID(content_id), invalid=False)
                                kl_mapper = []
                                for mapping in mappings:
                                    # print('kl_book',kl_book)
                                    kl_book.add(mapping.id_root_complex)
                                    kl_mapper.append(
                                        {
                                            "id": mapping.id_myself,
                                            "root": mapping.id_root_complex,
                                            "leaf": mapping.id_leaf_complex,
                                        }
                                    )
                                    pass

                                testumContent_List.append(
                                    {
                                        'video': '0',
                                        # uuid include '-'
                                        'id': str(questionAtom.id.hex),
                                        'content': questionAtom.content,
                                        "style": questionAtom.style,
                                        "level": questionAtom.level,
                                        "answer": questionAtom.answer,
                                        "tag": questionAtom.tag,
                                        "solution_id": questionAtom.solution_text,
                                        "video_id": questionAtom.solution_video,
                                        "solution_video": solution_video,
                                        "solution_text": solution_text,
                                        "kl_mapper": kl_mapper,
                                    }
                                )

                testumUnitList.append(
                    {
                        'unit_id': testumUnit_id,  #
                        'content_list': testumContent_List
                    }
                )

    return testumUnitList


def _get_lesson_unit(lesson):

    lessonUnitList = []

    if lesson.unit_ids:
        #    lessonUnit_ids = lesson.content_ids.split(',')
        lessonUnit_ids = lesson.unit_ids.split(',')
        # [lu_id,lu_id] == [lesson_unit_id,lesson_unit_id]
        for lessonUnit_id in lessonUnit_ids:
            lessonUnits = mLessonUnit.objects.filter(
                id=uuid.UUID(lessonUnit_id))
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
                                contents = mVideoAtom.objects.filter(
                                    id=uuid.UUID(content_id), invalid=False)
                                if len(contents) == 1:
                                    videoAtom = contents[0]
                                    lessonContent_List.append(
                                        {
                                            'video': '1',
                                            # uuid include '-'
                                            'id': str(videoAtom.id.hex),
                                            'title': videoAtom.title,
                                            'url': videoAtom.url,
                                            'time': videoAtom.time,
                                        }
                                    )
                        else:
                            if (content_id) and (content_id != 'null') and (content_id != '?'):
                                # print('_getLessonContentUnit uuid',content_id)
                                contents = mQuestionAtom.objects.filter(
                                    id=uuid.UUID(content_id), invalid=False)
                                if len(contents) == 1:
                                    questionAtom = contents[0]
                                    solution_video = []
                                    solution_text = []

                                    if questionAtom.solution_video:
                                        video_solutions = mQuestionSolutionVideo.objects.filter(
                                            id=questionAtom.solution_video)
                                        for video_solution in video_solutions:
                                            solution_video.append({
                                                'url': video_solution.url,
                                                'title': video_solution.title,
                                                'time': video_solution.time,
                                            })

                                    if questionAtom.solution_text:
                                        text_solutions = mQuestionSolutionText.objects.filter(
                                            id=questionAtom.solution_text)
                                        for text_solution in text_solutions:
                                            solution_text.append({
                                                'content': text_solution.content,
                                            })

                                    lessonContent_List.append(
                                        {
                                            'video': '0',
                                            # uuid exclude '-'
                                            'id': str(questionAtom.id.hex),
                                            'content': questionAtom.content,
                                            "style": questionAtom.style,
                                            "level": questionAtom.level,
                                            "answer": questionAtom.answer,
                                            "solution_id": questionAtom.solution_text,
                                            "video_id": questionAtom.solution_video,
                                            "solution_video": solution_video,
                                            "solution_text": solution_text,

                                        }
                                    )
                                else:
                                    print('No Question Atom Exist')

                lessonUnitList.append(
                    {
                        'unit_id': lessonUnit_id,  # uuid exclude '-'
                        'content_list': lessonContent_List
                    }
                )

    return lessonUnitList


def _st_get_lesson_unit_with_kl(lesson, kl_book):

    lessonUnitList = []

    if lesson.unit_ids:
        #    lessonUnit_ids = lesson.content_ids.split(',')
        lessonUnit_ids = lesson.unit_ids.split(',')
        # [lu_id,lu_id] == [lesson_unit_id,lesson_unit_id]
        for lessonUnit_id in lessonUnit_ids:
            lessonUnits = mLessonUnit.objects.filter(
                id=uuid.UUID(lessonUnit_id))
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
                                contents = mVideoAtom.objects.filter(
                                    id=uuid.UUID(content_id), invalid=False)
                                # kl mapping information
                                mappings = mMapper.objects.filter(
                                    id_myself=uuid.UUID(content_id), invalid=False)
                                kl_mapper = []
                                for mapping in mappings:
                                    kl_book.add(mapping.id_root_complex)

                                    kl_mapper.append(
                                        {
                                            "id": mapping.id_myself,
                                            "root": mapping.id_root_complex,
                                            "leaf": mapping.id_leaf_complex,
                                        }
                                    )
                                    pass

                                if len(contents) == 1:
                                    videoAtom = contents[0]
                                    lessonContent_List.append(
                                        {
                                            'video': '1',
                                            # uuid include '-'
                                            'id': str(videoAtom.id.hex),
                                            'title': videoAtom.title,
                                            'url': videoAtom.url,
                                            'time': videoAtom.time,
                                            "kl_mapper": kl_mapper,
                                        }
                                    )
                        else:
                            if (content_id) and (content_id != 'null') and (content_id != '?'):
                                # print('_getLessonContentUnit uuid',content_id)
                                contents = mQuestionAtom.objects.filter(
                                    id=uuid.UUID(content_id), invalid=False)
                                if len(contents) == 1:
                                    questionAtom = contents[0]
                                    solution_video = []
                                    solution_text = []

                                    if questionAtom.solution_video:
                                        video_solutions = mQuestionSolutionVideo.objects.filter(
                                            id=questionAtom.solution_video)
                                        for video_solution in video_solutions:
                                            solution_video.append({
                                                'url': video_solution.url,
                                                'title': video_solution.title,
                                                'time': video_solution.time,
                                            })

                                    if questionAtom.solution_text:
                                        text_solutions = mQuestionSolutionText.objects.filter(
                                            id=questionAtom.solution_text)
                                        for text_solution in text_solutions:
                                            solution_text.append({
                                                'content': text_solution.content,
                                            })
                                    # kl mapping information
                                    mappings = mMapper.objects.filter(
                                        id_myself=uuid.UUID(content_id), invalid=False)
                                    kl_mapper = []
                                    for mapping in mappings:
                                        kl_book.add(mapping.id_root_complex)

                                        kl_mapper.append(
                                            {
                                                "id": mapping.id_myself,
                                                "root": mapping.id_root_complex,
                                                "leaf": mapping.id_leaf_complex,
                                            }
                                        )
                                        pass

                                    lessonContent_List.append(
                                        {
                                            'video': '0',
                                            # uuid exclude '-'
                                            'id': str(questionAtom.id.hex),
                                            'content': questionAtom.content,
                                            "style": questionAtom.style,
                                            "level": questionAtom.level,
                                            "answer": questionAtom.answer,
                                            "solution_id": questionAtom.solution_text,
                                            "video_id": questionAtom.solution_video,
                                            "solution_video": solution_video,
                                            "solution_text": solution_text,
                                            "kl_mapper": kl_mapper,
                                        }
                                    )
                                else:
                                    print('No Question Atom Exist')

                lessonUnitList.append(
                    {
                        'unit_id': lessonUnit_id,  # uuid exclude '-'
                        'content_list': lessonContent_List
                    }
                )

    return lessonUnitList


def _get_content_detail(content_id):
    contents = mCourseBookBranch.objects.filter(id=content_id, invalid=False)
    if len(contents) != 1:
        return None, 0, 0
    content = contents[0]
    # print('_getContent',content)
    if content.type == CP_TYPE_TESTUM or content.type == CP_TYPE_EXAM:
        # test
        testums = mTestum.objects.filter(id=content.id, invalid=False)
        if len(testums) != 1:
            return None, 0, 0
        return _get_testum_unit(testums[0]), testums[0].twin, testums[0].twin_num
        # return _getTestumContent1(testums[0])
    elif content.type == CP_TYPE_LESSON:
        # lesson
        lessons = mLesson.objects.filter(id=content.id, invalid=False)
        if len(lessons) != 1:
            return None, 0, 0
        return _get_lesson_unit(lessons[0]), 0, 0

    return None, 0, 0


def _st_get_content_detail_with_kl(content_id, kl_book):
    contents = mCourseBookBranch.objects.filter(id=content_id, invalid=False)
    if len(contents) != 1:
        return None, 0, 0
    content = contents[0]
    # print('_getContent',content)
    if content.type == CP_TYPE_TESTUM or content.type == CP_TYPE_EXAM:
        # test
        testums = mTestum.objects.filter(id=content.id, invalid=False)
        if len(testums) != 1:
            return None, 0, 0
        return _st_get_testum_unit_with_kl(testums[0], kl_book), testums[0].twin, testums[0].twin_num
        # return _getTestumContent1(testums[0])
    elif content.type == CP_TYPE_LESSON:
        # lesson
        lessons = mLesson.objects.filter(id=content.id, invalid=False)
        if len(lessons) != 1:
            return None, 0, 0
        return _st_get_lesson_unit_with_kl(lessons[0], kl_book), 0, 0

    return None, 0, 0


def _get_lesson_detail(unit_ids):
    lessonUnitList = []
    for lessonUnit in unit_ids:
        lessonContent_List = []
        start = True
        for content_id in lessonUnit:
            if start:
                start = False
                if (content_id) and (content_id != 'null') and (content_id != '?'):
                    print('_get_lesson_detail : ', content_id)
                    contents = mVideoAtom.objects.filter(
                        id=uuid.UUID(content_id), invalid=False)
                    if len(contents) == 1:
                        videoAtom = contents[0]
                        lessonContent_List.append(
                            {
                                'video': '1',
                                # uuid include '-'
                                'id': str(videoAtom.id.hex),
                                'title': videoAtom.title,
                                'url': videoAtom.url,
                                'time': videoAtom.time,
                            }
                        )
            else:
                if (content_id) and (content_id != 'null') and (content_id != '?'):
                    # print('_getLessonContentUnit uuid',content_id)
                    contents = mQuestionAtom.objects.filter(
                        id=uuid.UUID(content_id), invalid=False)
                    if len(contents) == 1:
                        questionAtom = contents[0]
                        solution_video = []
                        solution_text = []

                        if questionAtom.solution_video:
                            video_solutions = mQuestionSolutionVideo.objects.filter(
                                id=questionAtom.solution_video)
                            for video_solution in video_solutions:
                                solution_video.append({
                                    'url': video_solution.url,
                                    'title': video_solution.title,
                                    'time': video_solution.time,
                                })

                        if questionAtom.solution_text:
                            text_solutions = mQuestionSolutionText.objects.filter(
                                id=questionAtom.solution_text)
                            for text_solution in text_solutions:
                                solution_text.append({
                                    'content': text_solution.content,
                                })

                        lessonContent_List.append(
                            {
                                'video': '0',
                                # uuid exclude '-'
                                'id': str(questionAtom.id.hex),
                                'content': questionAtom.content,
                                "style": questionAtom.style,
                                "level": questionAtom.level,
                                "answer": questionAtom.answer,
                                "solution_id": questionAtom.solution_text,
                                "video_id": questionAtom.solution_video,
                                "solution_video": solution_video,
                                "solution_text": solution_text,

                            }
                        )
                    else:
                        print('No Question Atom Exist')

        lessonUnitList.append(
            {
                'unit_id': '?',  # uuid exclude '-'
                'content_list': lessonContent_List
            }
        )
    return lessonUnitList
    pass


def _get_testum_detail(unit_ids):
    testumUnitList = []
    for testumUnit in unit_ids:
        testumContent_List = []
        for content_id in testumUnit:
            if (content_id) and (content_id != 'null') and (content_id != '?'):
                contents = mQuestionAtom.objects.filter(
                    id=uuid.UUID(content_id), invalid=False)
                if len(contents) == 1:
                    questionAtom = contents[0]
                    solution_video = []
                    solution_text = []

                    if questionAtom.solution_video:
                        video_solutions = mQuestionSolutionVideo.objects.filter(
                            id=questionAtom.solution_video)
                        for video_solution in video_solutions:
                            solution_video.append({
                                'url': video_solution.url,
                                'title': video_solution.title,
                                'time': video_solution.time,
                            })

                    if questionAtom.solution_text:
                        text_solutions = mQuestionSolutionText.objects.filter(
                            id=questionAtom.solution_text)
                        for text_solution in text_solutions:
                            solution_text.append({
                                'content': text_solution.content,
                            })
                            # print('+++++ _get_testum_unit ++++++++ ')

                    testumContent_List.append(
                        {
                            'video': '0',
                            'id': str(questionAtom.id.hex),  # uuid include '-'
                            'content': questionAtom.content,
                            "style": questionAtom.style,
                            "level": questionAtom.level,
                            "answer": questionAtom.answer,
                            "solution_id": questionAtom.solution_text,
                            "video_id": questionAtom.solution_video,
                            "solution_video": solution_video,
                            "solution_text": solution_text,
                        }
                    )

                testumUnitList.append(
                    {
                        'unit_id': '?',  #
                        'content_list': testumContent_List
                    }
                )

    return testumUnitList


def _get_clinic_content_detail(content_id):
    contents = mClinicContentAssign.objects.filter(
        id=content_id, invalid=False)

    if len(contents) != 1:
        return None, 0, 0
    content = contents[0]
    unit_ids = json.loads(content.unit_ids)

    # print('_getContent',content)
    if content.type == CP_TYPE_TESTUM or content.type == CP_TYPE_EXAM:
        # testum
        return _get_testum_detail(unit_ids["unit_ids"]), 0, 0
        pass
    elif content.type == CP_TYPE_LESSON:
        # lesson
        return _get_lesson_detail(unit_ids["unit_ids"]), 0, 0
    return None, 0, 0
    pass


def _get_content_itself(content_id, content_type):

    content = mCourseBookBranch.objects.filter(
        id=uuid.UUID(content_id), invalid=False)
    contentUnitList = _get_content_detail(uuid.UUID(content_id))

    result = {
        "id": content_id,
        "title": content[0].title,
        "level": 0, "type": content_type,
        # "parent_id" : None, "sibling_id": None ,
        "contentunit_list": contentUnitList,
    }
    return result


def _get_content_result(student_id, class_id, course_id, content_id, content_type, action):
    results = []
    if content_type == CP_TYPE_TESTUM or content_type == CP_TYPE_EXAM:
        testum_results = mTestumResult.objects.filter(student_id=uuid.UUID(student_id),
                                                      class_id=uuid.UUID(
                                                          class_id),
                                                      course_id=uuid.UUID(
                                                          course_id),
                                                      testum_id=uuid.UUID(
                                                          content_id),
                                                      action_request=action
                                                      )
        for testum_result in testum_results:
            # if len(testum_results) == 1:
            # testum_result = testum_results[0]
            results.append({
                'try_count': testum_result.try_count,
                'try_index': testum_result.try_index,
                'wrong_count': testum_result.wrong_count,
                'question_results': testum_result.question_results,
                'question_answers': testum_result.question_answers,
                'repeat_count': testum_result.repeat_count,

            })
        pass
    # elif  content_type == CP_TYPE_EXAM:
    #     testum_results = mTestumResult.objects.filter(student_id=uuid.UUID(student_id),
    #             class_id = uuid.UUID(class_id),
    #             course_id = uuid.UUID(course_id),
    #             testum_id = uuid.UUID(content_id),
    #             action_request = 2
    #             )
    #     for testum_result in testum_results:
    #     # if len(testum_results) == 1:
    #         # testum_result = testum_results[0]
    #         results.append({
    #             'try_count': testum_result.try_count,
    #             'try_index': testum_result.try_index,
    #             'wrong_count': testum_result.wrong_count,
    #             'question_results': testum_result.question_results,
    #             'question_answers': testum_result.question_answers,
    #             'repeat_count': testum_result.repeat_count,

    #         })
    elif content_type == CP_TYPE_LESSON:
        lesson_results = mLessonResult.objects.filter(student_id=uuid.UUID(student_id),
                                                      class_id=uuid.UUID(
                                                          class_id),
                                                      course_id=uuid.UUID(
                                                          course_id),
                                                      lesson_id=uuid.UUID(
                                                          content_id),
                                                      action_request=action
                                                      )

        for lesson_result in lesson_results:
            # if len(lesson_results) == 1:
            # lesson_result = testum_results[0]
            results.append({
                'try_count': lesson_result.try_count,
                'try_index': lesson_result.try_index,
                'wrong_count': lesson_result.wrong_count,
                'question_results': lesson_result.question_results,
                'repeat_count': lesson_result.repeat_count,
            })
        pass
    return results


def _update_content_result(student_id, class_id, course_id, content_id, content_type):
    results = []
    if content_type == CP_TYPE_TESTUM or content_type == CP_TYPE_EXAM:
        testum_results = mTestumResult.objects.filter(student_id=uuid.UUID(student_id),
                                                      class_id=uuid.UUID(
                                                          class_id),
                                                      course_id=uuid.UUID(
                                                          course_id),
                                                      testum_id=uuid.UUID(
                                                          content_id),
                                                      )
        for testum_result in testum_results:
            # if len(testum_results) == 1:
            # testum_result = testum_results[0]
            results.append({
                'try_count': testum_result.try_count,
                'try_index': testum_result.try_index,
                'wrong_count': testum_result.wrong_count,
                'question_results': testum_result.question_results,
                'repeat_count': testum_result.repeat_count,
            })
        pass
    elif content_type == CP_TYPE_LESSON:
        lesson_results = mLessonResult.objects.filter(student_id=uuid.UUID(student_id),
                                                      class_id=uuid.UUID(
                                                          class_id),
                                                      course_id=uuid.UUID(
                                                          course_id),
                                                      lesson_id=uuid.UUID(
                                                          content_id),
                                                      )

        for lesson_result in lesson_results:
            # if len(lesson_results) == 1:
            # lesson_result = testum_results[0]
            results.append({
                'try_count': lesson_result.try_count,
                'try_index': lesson_result.try_index,
                'wrong_count': lesson_result.wrong_count,
                'question_results': lesson_result.question_results,
                'repeat_count': lesson_result.repeat_count,
            })
        pass
    return results

# Fixed. Jstar : show_off = False


def _st_getassignedcontent(request):
    result = {}
    content_list = []

    print('start get assigned content')
    # class_id = request.POST.get('class_id')
    # course_id = request.POST.get('course_id')
    student_id = request.POST.get('student_id')
    from_date = request.POST.get('from_date')
    to_date = request.POST.get('to_date')
    courses_list = request.POST.get('content_list')
    course_list = json.loads(courses_list)
    print('course_list : ', course_list)
    for course in course_list:
        class_id = course['class_id']
        print('class_id : ', class_id)
        if (class_id == '?'):
            continue
        course_id = course['course_id']

        # case 1)    <--| week <----> week |-->
        contents = mClassContentAssign.objects.filter(class_id=class_id, show_off=False,
                                                      course_id=course_id,
                                                      started__lte=from_date, ended__gte=to_date)
        for content in contents:
            _get_assigned_content_detail(
                content_list, student_id, class_id, course_id, content)
            pass

        # case 2)
        contents = mClassContentAssign.objects.filter(class_id=class_id, show_off=False,
                                                      course_id=course_id,
                                                      started__gt=from_date, ended__lt=to_date)

        for content in contents:
            _get_assigned_content_detail(
                content_list, student_id, class_id, course_id, content)
            pass

        # case 3)
        contents = mClassContentAssign.objects.filter(class_id=class_id, show_off=False,
                                                      course_id=course_id,
                                                      started__lte=from_date, ended__gte=from_date, ended__lt=to_date)

        for content in contents:
            _get_assigned_content_detail(
                content_list, student_id, class_id, course_id, content)
            pass

        # case 4)
        contents = mClassContentAssign.objects.filter(class_id=class_id, show_off=False,
                                                      course_id=course_id,
                                                      started__gt=from_date, started__lte=to_date, ended__gte=to_date)

        for content in contents:
            _get_assigned_content_detail(
                content_list, student_id, class_id, course_id, content)
            pass

        pass

    result = {
        'content_list': content_list,
    }
    return result
    pass

# Fixed. Jstar : show_off = False => 이것 (reassign 을 지금 사용하고 있나?)
# _st_getassignedcontentwithreassign -> _st_getassignedcontentwithreassignnew


def _st_getassignedcontentwithreassign(request):
    result = {}
    content_list = []
    clinic_list = []

    print('start get assigned content')
    # class_id = request.POST.get('class_id')
    # course_id = request.POST.get('course_id')
    student_code = request.POST.get('student_code')
    student_id = request.POST.get('student_id')
    from_date = request.POST.get('from_date')
    to_date = request.POST.get('to_date')
    courses_list = request.POST.get('content_list')
    course_list = json.loads(courses_list)
    print('course_list : ', course_list)
    print('student_code : ', student_code)

    # for Demo
    if student_code <= STUDENT_DEMO_CODE:
        for course in course_list:
            class_id = course['class_id']
            print('class_id : ', class_id)
            if (class_id == '?'):
                continue
            course_id = course['course_id']

            # 날짜와 상관없이 다 가져 온다.
            contents = mClassContentAssign.objects.filter(class_id=class_id, show_off=False,
                                                          course_id=course_id)
            for content in contents:
                reassign_contents = mClassContentReassign.objects.filter(class_id=class_id,
                                                                         course_id=course_id, content_id=content.content_id)
                if len(reassign_contents) == 1:
                    if reassign_contents[0].show_off == False:
                        _get_assigned_content_detail(
                            content_list, student_id, class_id, course_id, content)
                elif len(reassign_contents) == 0:
                    _get_assigned_content_detail(
                        content_list, student_id, class_id, course_id, content)
        result = {
            'content_list': content_list,
            'clinic_list': clinic_list,
        }
        return result
        pass

    for course in course_list:
        class_id = course['class_id']
        print('class_id : ', class_id)
        if (class_id == '?'):
            continue
        course_id = course['course_id']

        # 옛날 방식
        # # case 1)    <--| week <----> week |--> 범위 안에 있거나, 범위와 같을때.
        # contents = mClassContentAssign.objects.filter(class_id = class_id,show_off = False,
        #         course_id = course_id,
        #         started__lte = from_date, ended__gte = to_date)
        # for content in contents:
        #     reassign_contents = mClassContentReassign.objects.filter(class_id = class_id,
        #     course_id = course_id,content_id = content.content_id)
        #     if len(reassign_contents) == 1:
        #         if reassign_contents[0].show_off == False:
        #             _get_assigned_content_detail(content_list,student_id,class_id,course_id,content)
        #     elif len(reassign_contents) == 0:
        #         _get_assigned_content_detail(content_list,student_id,class_id,course_id,content)
        # # case 2) 범위 안에 있을때,
        # contents = mClassContentAssign.objects.filter(class_id = class_id,show_off = False,
        #         course_id = course_id,
        #         started__gt = from_date, ended__lt = to_date)

        # for content in contents:
        #     reassign_contents = mClassContentReassign.objects.filter(class_id = class_id,
        #     course_id = course_id,content_id = content.content_id)
        #     if len(reassign_contents) == 1:
        #         if reassign_contents[0].show_off == False:
        #             _get_assigned_content_detail(content_list,student_id,class_id,course_id,content)
        #     elif len(reassign_contents) == 0:
        #         _get_assigned_content_detail(content_list,student_id,class_id,course_id,content)
        # # case 3)
        # contents = mClassContentAssign.objects.filter(class_id = class_id,show_off = False,
        #         course_id = course_id,
        #         started__lte = from_date,ended__gte = from_date, ended__lt = to_date)

        # for content in contents:
        #     reassign_contents = mClassContentReassign.objects.filter(class_id = class_id,
        #     course_id = course_id,content_id = content.content_id)
        #     if len(reassign_contents) == 1:
        #         if reassign_contents[0].show_off == False:
        #             _get_assigned_content_detail(content_list,student_id,class_id,course_id,content)
        #     elif len(reassign_contents) == 0:
        #         _get_assigned_content_detail(content_list,student_id,class_id,course_id,content)
        # # case 4)
        # contents = mClassContentAssign.objects.filter(class_id = class_id,show_off = False,
        #         course_id = course_id,
        #         started__gt = from_date, started__lte = to_date, ended__gte = to_date)

        # for content in contents:
        #     reassign_contents = mClassContentReassign.objects.filter(class_id = class_id,
        #     course_id = course_id,content_id = content.content_id)
        #     if len(reassign_contents) == 1:
        #         if reassign_contents[0].show_off == False:
        #             _get_assigned_content_detail(content_list,student_id,class_id,course_id,content)
        #     elif len(reassign_contents) == 0:
        #         _get_assigned_content_detail(content_list,student_id,class_id,course_id,content)

        # # /////////////////////////////////////////////////////////////////////////////
        # # Clinic Content
        # contents = mClinicContentAssign.objects.filter(class_id = class_id,
        #                                                course_id = course_id, student_id = student_id,
        #                                                on_date__gte = from_date, on_date__lte = to_date,
        #                                                show_off = False)
        # for content in contents:
        #     # _get_assigned_content_detail(clinic_list,student_id,class_id,course_id,content)
        #     progress , point ,try_count = _get_content_progress(student_id,class_id,course_id,content.id,content.type)
        #     clinic_list.append( {
        #                     'class_id':class_id,
        #                     'course_id':course_id,
        #                     'content_id':content.id,
        #                     'content_type':content.type,
        #                     'content_title':content.title,
        #                     'progress' : progress,
        #                     'point' : point,
        #                     'try_count' : try_count,
        #                     })
        #
        # case 1)  옛 DB Format
        contents = mClassContentAssign.objects.filter(class_id=class_id, show_off=False,
                                                      course_id=course_id,
                                                      started=from_date, ended=to_date, completed_date=None)
        for content in contents:
            reassign_contents = mClassContentReassign.objects.filter(class_id=class_id,
                                                                     course_id=course_id, content_id=content.content_id)
            if len(reassign_contents) == 1:
                if reassign_contents[0].show_off == False:
                    if content.content_type == CP_TYPE_EXAM:
                        _get_assigned_exam_content_detail(
                            exam_list, student_id, class_id, course_id, content)
                    else:
                        _get_assigned_content_detail(
                            content_list, student_id, class_id, course_id, content)
            elif len(reassign_contents) == 0:
                if content.content_type == CP_TYPE_EXAM:
                    _get_assigned_exam_content_detail(
                        exam_list, student_id, class_id, course_id, content)
                else:
                    _get_assigned_content_detail(
                        content_list, student_id, class_id, course_id, content)
        #
        # case 2) 새 DB format
        contents = mClassContentAssign.objects.filter(class_id=class_id, show_off=False,
                                                      course_id=course_id,
                                                      completed_date__gte=from_date,
                                                      # Todo. Jstar : To be Simplified
                                                      # 평가의 포맷 때문에
                                                      completed_date__lte=to_date + ', 33:33')
        for content in contents:
            reassign_contents = mClassContentReassign.objects.filter(class_id=class_id,
                                                                     course_id=course_id, content_id=content.content_id)
            if len(reassign_contents) == 1:
                if reassign_contents[0].show_off == False:
                    if content.content_type == CP_TYPE_EXAM:
                        _get_assigned_exam_content_detail(
                            exam_list, student_id, class_id, course_id, content)
                    else:
                        _get_assigned_content_detail(
                            content_list, student_id, class_id, course_id, content)

            elif len(reassign_contents) == 0:
                if content.content_type == CP_TYPE_EXAM:
                    _get_assigned_exam_content_detail(
                        exam_list, student_id, class_id, course_id, content)
                else:
                    _get_assigned_content_detail(
                        content_list, student_id, class_id, course_id, content)

        # /////////////////////////////////////////////////////////////////////////////
        # Clinic Content
        contents = mClinicContentAssign.objects.filter(class_id=class_id,
                                                       course_id=course_id, student_id=student_id,
                                                       on_date__gte=from_date, on_date__lte=to_date,
                                                       show_off=False)
        for content in contents:
            # _get_assigned_content_detail(clinic_list,student_id,class_id,course_id,content)
            progress, point, try_count = _get_content_progress(
                student_id, class_id, course_id, content.id, content.type)
            clinic_list.append({
                'class_id': class_id,
                'course_id': course_id,
                'content_id': content.id,
                'content_type': content.type,
                'content_title': content.title,
                'progress': progress,
                'point': point,
                'try_count': try_count,
            })
    result = {
        'content_list': content_list,
        'clinic_list': clinic_list,
    }
    return result
    pass


def _st_getassignedcontentwithreassignnew(request):
    result = {}
    content_list = []
    clinic_list = []
    exam_list = []
    print('start get assigned content')
    # class_id = request.POST.get('class_id')
    # course_id = request.POST.get('course_id')
    student_code = request.POST.get('student_code')
    student_id = request.POST.get('student_id')
    from_date = request.POST.get('from_date')
    to_date = request.POST.get('to_date')
    courses_list = request.POST.get('content_list')
    all_list = request.POST.get('all_course_list')
    course_list = json.loads(courses_list)
    all_course_list = json.loads(all_list)
    print('course_list : ', course_list)
    print('student_code : ', student_code)

    # for Demo
    if student_code <= STUDENT_DEMO_CODE:
        for course in course_list:
            class_id = course['class_id']
            print('class_id : ', class_id)
            if (class_id == '?'):
                continue
            course_id = course['course_id']

            # 날짜와 상관없이 다 가져 온다.
            contents = mClassContentAssign.objects.filter(class_id=class_id, show_off=False,
                                                          course_id=course_id)
            for content in contents:
                reassign_contents = mClassContentReassign.objects.filter(class_id=class_id,
                                                                         course_id=course_id, content_id=content.content_id)
                if len(reassign_contents) == 1:
                    if reassign_contents[0].show_off == False:
                        _get_assigned_content_detail(
                            content_list, student_id, class_id, course_id, content)
                elif len(reassign_contents) == 0:
                    _get_assigned_content_detail(
                        content_list, student_id, class_id, course_id, content)
        result = {
            'content_list': content_list,
            'clinic_list': clinic_list,
            'exam_list': exam_list,
        }
        return result
        pass

    for course in course_list:
        class_id = course['class_id']
        print('class_id : ', class_id)
        if (class_id == '?'):
            continue
        course_id = course['course_id']

        #
        # case 1)  옛 DB Format
        contents = mClassContentAssign.objects.filter(class_id=class_id, show_off=False,
                                                      course_id=course_id,
                                                      started=from_date, ended=to_date, completed_date=None)
        for content in contents:
            reassign_contents = mClassContentReassign.objects.filter(class_id=class_id,
                                                                     course_id=course_id, content_id=content.content_id)
            if len(reassign_contents) == 1:
                if reassign_contents[0].show_off == False:
                    if content.content_type == CP_TYPE_EXAM:
                        _get_assigned_exam_content_detail(
                            exam_list, student_id, class_id, course_id, content)
                    else:
                        _get_assigned_content_detail(
                            content_list, student_id, class_id, course_id, content)
            elif len(reassign_contents) == 0:
                if content.content_type == CP_TYPE_EXAM:
                    _get_assigned_exam_content_detail(
                        exam_list, student_id, class_id, course_id, content)
                else:
                    _get_assigned_content_detail(
                        content_list, student_id, class_id, course_id, content)
        #
        # case 2) 새 DB format
        contents = mClassContentAssign.objects.filter(class_id=class_id, show_off=False,
                                                      course_id=course_id,
                                                      completed_date__gte=from_date,
                                                      # Todo. Jstar : To be Simplified
                                                      # 평가의 포맷 때문에
                                                      completed_date__lte=to_date + ', 33:33')
        for content in contents:
            reassign_contents = mClassContentReassign.objects.filter(class_id=class_id,
                                                                     course_id=course_id, content_id=content.content_id)
            if len(reassign_contents) == 1:
                if reassign_contents[0].show_off == False:
                    if content.content_type == CP_TYPE_EXAM:
                        _get_assigned_exam_content_detail(
                            exam_list, student_id, class_id, course_id, content)
                    else:
                        _get_assigned_content_detail(
                            content_list, student_id, class_id, course_id, content)

            elif len(reassign_contents) == 0:
                if content.content_type == CP_TYPE_EXAM:
                    _get_assigned_exam_content_detail(
                        exam_list, student_id, class_id, course_id, content)
                else:
                    _get_assigned_content_detail(
                        content_list, student_id, class_id, course_id, content)

        # /////////////////////////////////////////////////////////////////////////////
        # Clinic Content
        # 기존 legacy lesson clinic
        contents = mClinicContentAssign.objects.filter(class_id=class_id,
                                                       course_id=course_id, student_id=student_id,
                                                       cca_id=None, cc_id=None,
                                                       on_date__gte=from_date, on_date__lte=to_date,
                                                       show_off=False)
        for content in contents:
            # _get_assigned_content_detail(clinic_list,student_id,class_id,course_id,content)
            progress, point, try_count = _get_content_progress(
                student_id, class_id, course_id, content.id, content.type)
            clinic_list.append({
                'class_id': class_id,
                'course_id': course_id,
                'content_id': content.id,
                'content_type': content.type,
                'content_title': content.title,
                'progress': progress,
                'point': point,
                'try_count': try_count,
            })
        # 새로 clinic contents
        # find clinic from class_id , course_id , and student_id
        clinic_courses = mClinicContentAssign.objects.filter(class_id=class_id,
                                                             course_id=course_id, student_id=student_id,
                                                             type=3)

        for clinic_course in clinic_courses:
            clinic_contents = json.loads(clinic_course.unit_ids)

            for clinic_content in clinic_contents:
                contents = mClinicContentAssign.objects.filter(
                    #     class_id = class_id,
                    #    course_id = course_id,
                    #    student_id = student_id,
                    id=uuid.UUID(
                        clinic_content['id']),
                    on_date__gte=from_date, on_date__lte=to_date,
                    show_off=False)
                for content in contents:
                    progress, point, try_count = _get_content_progress(
                        student_id, class_id, course_id, content.id, content.type)
                    clinic_list.append({
                        'class_id': class_id,
                        'course_id': course_id,
                        'content_id': content.id,
                        'content_type': content.type,
                        'content_title': content.title,
                        'progress': progress,
                        'point': point,
                        'try_count': try_count,
                    })

        # contents = mClinicContentAssign.objects.filter(class_id = class_id,
        #                                                course_id = course_id, student_id = student_id,
        #                                                on_date__gte = from_date, on_date__lte = to_date,
        #                                                show_off = False)
        # for content in contents:
        #     # _get_assigned_content_detail(clinic_list,student_id,class_id,course_id,content)
        #     progress , point , try_count = _get_content_progress(student_id,class_id,course_id,content.id,content.type)
        #     clinic_list.append( {
        #                     'class_id':class_id,
        #                     'course_id':course_id,
        #                     'content_id':content.id,
        #                     'content_type':content.type,
        #                     'content_title':content.title,
        #                     'progress' : progress,
        #                     'point' : point,
        #                     'try_count' : try_count,
        #                     })

    exam_from_date = from_date + ', 00:00'
    exam_to_date = to_date + ', 23:59'

    # Total Exam Content List
    for course in all_course_list:
        class_id = course['class_id']
        print('class_id : ', class_id)

        if (class_id == '?'):
            continue
        contents = mClassContentAssign.objects.filter(class_id=class_id, show_off=False,
                                                      course_id=course_id, content_type=CP_TYPE_EXAM,
                                                      completed_date__gte=from_date, completed_date__lte=to_date)
        for content in contents:
            isExist = False
            for exam in exam_list:
                if content.content_id == exam['content_id']:
                    isExist = True
                    break

            if not isExist:
                _get_assigned_exam_content_detail(
                    exam_list, student_id, class_id, course_id, content)

    result = {
        'content_list': content_list,
        'clinic_list': clinic_list,
        'exam_list': exam_list,
    }
    return result


def _st_getassignedcontentdetail(request):
    print('start get assigned content detail')
    student_id = request.POST.get('student_id')
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    content_id = request.POST.get('content_id')
    content_type = int(request.POST.get('content_type'))
    normal_clinic = int(request.POST.get('course_type'))
    # title = ""
    if normal_clinic == 0:
        contentresult_list = _get_content_result(
            student_id, class_id, course_id, content_id, content_type, 0)
        content = mCourseBookBranch.objects.filter(
            id=uuid.UUID(content_id), invalid=False)
        # title = content[0].title
        contentunit_list, twin, twin_num = _get_content_detail(
            uuid.UUID(content_id))
    elif normal_clinic == 1:
        contentresult_list = _get_content_result(
            student_id, class_id, course_id, content_id, content_type, 1)
        content = mClinicContentAssign.objects.filter(
            id=uuid.UUID(content_id), invalid=False)
        contentunit_list, twin, twin_num = _get_clinic_content_detail(
            uuid.UUID(content_id))

    result = {
        "id": content_id,
        "title": content[0].title,
        "content_type": content_type,
        "contentresult_list": contentresult_list,
        "contentunit_list": contentunit_list,
        "twin": twin,
        "twin_num": twin_num,
    }
    return result


def _st_getassignedexamcontentdetail(request):
    print('start get assigned exam content detail')
    student_id = request.POST.get('student_id')
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    content_id = request.POST.get('content_id')
    content_type = int(request.POST.get('content_type'))
    normal_exam = int(request.POST.get('type'))
    examdate = None
    examtime = None
    attribute = None
    # normal exam (정규)
    if normal_exam == 0:
        contentresult_list = _get_content_result(
            student_id, class_id, course_id, content_id, content_type, 2)
        progress, point, try_count = _get_content_progress(
            student_id, class_id, course_id, uuid.UUID(content_id), content_type)
        content = mCourseBookBranch.objects.filter(
            id=uuid.UUID(content_id), invalid=False)
        contents = mClassContentAssign.objects.filter(
            class_id=uuid.UUID(class_id),
            course_id=uuid.UUID(course_id),
            content_id=uuid.UUID(content_id)
        )
        # title = content[0].title
        contentunit_list, twin, twin_num = _get_content_detail(
            uuid.UUID(content_id))
        if len(contents) > 0:
            # content = contents[0]
            examdate = contents[0].completed_date
            examtime = contents[0].content_name
            attribute = contents[0].sections

    # 추천 exam
    elif normal_exam == 1:
        pass
        # contentresult_list = _get_content_result(student_id,class_id,course_id,content_id,content_type,1)
        # content = mClinicContentAssign.objects.filter(id = uuid.UUID(content_id),invalid = False)
        # contentunit_list, twin, twin_num = _get_clinic_content_detail(uuid.UUID(content_id))

    result = {
        "id": content_id,
        "title": content[0].title,
        "content_type": content_type,
        "contentresult_list": contentresult_list,
        "contentunit_list": contentunit_list,
        "twin": twin,
        "twin_num": twin_num,
        "examdate": examdate,        # 시험 일자
        'examtime': examtime,      # time period
        # duration, ontime, resulttime , etc...
        'attribute': attribute,
        "duration": '',        # 시험 시간
        "waittime": '',          # 남은 시간
        "progress": progress,
        "point": point,
        "try_count": try_count,
    }
    return result


def _st_getassignedcourse(request):
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
        agencies = mDemoAgencyN.objects.filter(code=agency_code, invalid=False)
        if len(agencies) != 1:
            # content_list -> course_list 로 바꿔야 맞다.
            result = {
                'student_name': '신원미상',
                'student_id': None,
                'content_list': content_list,
            }
        id_agency = agencies[0].id
        students = mDemoStudentN.objects.filter(
            # id= uuid.UUID(student_id),
            id_agency=id_agency,
            code=student_code,
            invalid=False)
        if len(students) != 1:
            # content_list -> course_list 로 바꿔야 맞다.
            result = {
                'student_name': '신원미상',
                'student_id': None,
                'content_list': content_list,
            }
            return result
        student_id = str(students[0].id)
        student_name = students[0].name
        student_extras = mDemoStudentExtraN.objects.filter(
            id=uuid.UUID(student_id))

        if len(student_extras) != 1:
            # content_list -> course_list 로 바꿔야 맞다.
            result = {
                'student_name': student_name,
                'student_id': student_id,
                'content_list': content_list,
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
                'content_list': content_list,
            }
            return result

        for inclass in inclass_list:
            classes = mDemoClassN.objects.filter(id=uuid.UUID(inclass))
            if len(classes) == 1:
                course_ids = classes[0].ids_course
                class_id = classes[0].id
                course_list = []
                if course_ids:
                    course_list = course_ids.split(',')
                    for course in course_list:
                        courses = mCourseBook.objects.filter(
                            id=uuid.UUID(course))
                        if len(courses) == 1:
                            content = {'class_id': str(class_id), 'course_id': str(
                                courses[0].id), 'title': courses[0].title}
                            content_list.append(content)

        # result = {
        #         'student_name': student_name,
        #         'student_id': student_id,
        #         'content_list' : content_list,
        #     }
        pass

    else:
        students = mStudent.objects.filter(code=student_code, invalid=False)

        if len(students) != 1:
            result = {
                'student_name': '신원미상',
                'student_id': None,
                'content_list': content_list,
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
                'content_list': content_list,
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
                'content_list': content_list,
            }
            # return JsonResponse({"message": "getAssignedCourse", "result":result},status=200)
            return result

        for inclass in inclass_list:
            classes = mClass.objects.filter(id=uuid.UUID(inclass))
            if len(classes) == 1:
                course_ids = classes[0].course_ids
                class_id = classes[0].id
                course_list = []
                if course_ids:
                    course_list = course_ids.split(',')
                    for course in course_list:
                        courses = mCourseBook.objects.filter(
                            id=uuid.UUID(course))
                        if len(courses) == 1:
                            content = {'class_id': str(class_id), 'course_id': str(
                                courses[0].id), 'title': courses[0].title}
                            content_list.append(content)

    result = {
        'student_name': student_name,
        'student_id': student_id,
        'content_list': content_list,
    }
    # print('getassignedcourse > content_list :', content_list ,student_id)
    return result
    pass


def _st_updatelessonresult(request):
    result = {}
    student_id = request.POST.get('student_id')
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    content_id = request.POST.get('content_id')
    content_type = int(request.POST.get('content_type'))
    point = int(request.POST.get('point'))
    progress = int(request.POST.get('progress'))

    try_count = int(request.POST.get('try_count'))
    # 'try_count': lesson_result.try_count,
    play_mode = int(request.POST.get('playMode'))

    try_index = int(request.POST.get('try_index'))
    # 'try_index': lesson_result.try_index,

    wrong_count = 0  # int(request.POST.get('wrong_count'))
    # 'wrong_count': lesson_result.wrong_count,

    question_results = request.POST.get('question_results')
    # 'question_results': lesson_result.question_results,

    repeat_count = request.POST.get('repeat_count')
    # 'repeat_count': lesson_result.repeat_count,

    # contentresult_list = _get_content_result(student_id,class_id,course_id,content_id,content_type)
    # _update_content_result(student_id,class_id,course_id,content_id,content_type)
    # if play_mode == 0:
    print('_st_updatelessonresult', play_mode)
    lesson_result = mLessonResult.objects.create(student_id=uuid.UUID(student_id),
                                                 class_id=uuid.UUID(class_id),
                                                 course_id=uuid.UUID(
                                                     course_id),
                                                 lesson_id=uuid.UUID(
                                                     content_id),
                                                 action_request=play_mode
                                                 )

    lesson_result.try_count = try_count
    lesson_result.try_index = try_index
    lesson_result.wrong_count = wrong_count
    lesson_result.question_results = question_results
    lesson_result.repeat_count = repeat_count
    lesson_result.action_request = play_mode
    lesson_result.save()

    _set_content_progress(student_id, class_id, course_id,
                          content_id, content_type, point, progress, try_count)

    return result
    pass
###########################################################################################
# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def getstudentinfo(request):
    student_code = request.userId
    # test_student_code = request.POST.get('student_code')
    # print(test_student_code)
    # if(test_student_code != None):
    #     student_code = test_student_code

    students = mStudent.objects.filter(code=student_code, invalid=False)
    result = {
        'name': '',
        'id': '',
        'code': '',
    }

    if len(students) == 1:
        result = {
            'name': students[0].name,
            'id': str(students[0].id),
            'code': students[0].code,
        }

        # result.name  =  students[0].name
        # result.id =  students[0].id
        # result.code  = students[0].code
    print('getstudentinfo : ', result)
    return JsonResponse({"message": "getStudentInfo", "result": result}, status=200)


@jwtlogin_st_decorator0
def getassignedcourse(request):
    print('st start get assigned course')
    result = _st_getassignedcourse(request)
    print(result)
    return JsonResponse({"message": "getAssignedCourse", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////
# 현재 이것은 안씀 -> getassignedcontentnew 를 사용함.


@jwtlogin_st_decorator0
def getassignedcontentwithreassign(request):
    result = _st_getassignedcontentwithreassign(request)

    return JsonResponse({"message": "getAssignedContentWithReassign", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def getassignedcontent(request):
    # result = {}
    # content_list = []

    # print('start get assigned content')
    # # class_id = request.POST.get('class_id')
    # # course_id = request.POST.get('course_id')
    # student_id = request.POST.get('student_id')
    # from_date = request.POST.get('from_date')
    # to_date = request.POST.get('to_date')
    # courses_list = request.POST.get('content_list')
    # course_list = json.loads(courses_list)
    # print('course_list : ',course_list)
    # for course in course_list:
    #     class_id = course['class_id']
    #     print('class_id : ', class_id)
    #     if(class_id == '?'):
    #         continue
    #     course_id = course['course_id']

    #     # case 1)    <--| week <----> week |-->
    #     contents = mClassContentAssign.objects.filter(class_id = class_id,
    #             course_id = course_id,
    #             started__lte = from_date, ended__gte = to_date)
    #     for content in contents:
    #         _get_assigned_content_detail(content_list,student_id,class_id,course_id,content)
    #         pass

    #     # case 2)
    #     contents = mClassContentAssign.objects.filter(class_id = class_id,
    #             course_id = course_id,
    #             started__gt = from_date, ended__lt = to_date)

    #     for content in contents:
    #         _get_assigned_content_detail(content_list,student_id,class_id,course_id,content)
    #         pass

    #     # case 3)
    #     contents = mClassContentAssign.objects.filter(class_id = class_id,
    #             course_id = course_id,
    #             started__lte = from_date,ended__gte = from_date, ended__lt = to_date)

    #     for content in contents:
    #         _get_assigned_content_detail(content_list,student_id,class_id,course_id,content)
    #         pass

    #     # case 4)
    #     contents = mClassContentAssign.objects.filter(class_id = class_id,
    #             course_id = course_id,
    #             started__gt = from_date, started__lte = to_date, ended__gte = to_date)

    #     for content in contents:
    #         _get_assigned_content_detail(content_list,student_id,class_id,course_id,content)
    #         pass

    #     pass

    # result = {
    #         'content_list' : content_list,
    #     }

    # result = _st_getassignedcontent(request)
    result = _st_getassignedcontentwithreassign(request)

    return JsonResponse({"message": "getAssignedContent", "result": result}, status=200)
# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def getassignedcontentnew(request):

    result = _st_getassignedcontentwithreassignnew(request)

    return JsonResponse({"message": "getAssignedContentNew", "result": result}, status=200)


# ////////////////////////////////////// REST API /////////////////////////////////////////
@jwtlogin_st_decorator0
def getassignedcontentdetail(request):

    # print('start get assigned content detail')
    # student_id = request.POST.get('student_id')
    # class_id = request.POST.get('class_id')
    # course_id = request.POST.get('course_id')
    # content_id = request.POST.get('content_id')
    # content_type = int(request.POST.get('content_type'))

    # contentresult_list = _get_content_result(student_id,class_id,course_id,content_id,content_type)
    # content = mCourseBookBranch.objects.filter(id = uuid.UUID(content_id),invalid = False)
    # contentunit_list, twin, twin_num = _get_content_detail(uuid.UUID(content_id))

    # result = {
    #             "id" : content_id ,
    #             "title" : content[0].title,
    #             "content_type" : content_type,
    #             "contentresult_list" : contentresult_list,
    #             "contentunit_list" : contentunit_list,
    #             "twin" : twin,
    #             "twin_num":twin_num,
    #             }
    result = _st_getassignedcontentdetail(request)

    return JsonResponse({"message": "getAssignedContentDetail", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def getassignedcliniccontentdetail(request):

    request.type = 1
    result = _st_getassignedcontentdetail(request)

    return JsonResponse({"message": "getAssignedContentDetail", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def getassignedexamcontentdetail(request):

    request.type = 1
    result = _st_getassignedexamcontentdetail(request)

    return JsonResponse({"message": "getAssignedExamContentDetail", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def updatetestumresult(request):
    result = {}

    # if request.userType & ACCOUNT_TYPE_USER :
    #     return JsonResponse({"message": "updateTestumResult", "result":result},status=200)
    #     pass

    student_id = request.POST.get('student_id')
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    content_id = request.POST.get('content_id')
    content_type = int(request.POST.get('content_type'))
    point = int(request.POST.get('point'))
    progress = int(request.POST.get('progress'))

    try_count = int(request.POST.get('try_count'))
    # 'try_count': testum_result.try_count,

    try_index = int(request.POST.get('try_index'))
    # 'try_index': testum_result.try_index,

    wrong_count = int(request.POST.get('wrong_count'))
    # 'wrong_count': testum_result.wrong_count,

    question_results = request.POST.get('question_results')
    # 'question_results': testum_result.question_results,

    repeat_count = request.POST.get('repeat_count')

    play_mode = int(request.POST.get('playMode'))
    question_answers = None
    # contentresult_list = _get_content_result(student_id,class_id,course_id,content_id,content_type)
    # _update_content_result(student_id,class_id,course_id,content_id,content_type)
    if play_mode == 2:
        question_answers = request.POST.get('question_answers')

    # if play_mode == 0:
    # if play_mode == 2:
    #     testum_result = mTestumResult.objects.filter(student_id=uuid.UUID(student_id),
    #                 class_id = uuid.UUID(class_id),
    #                 course_id = uuid.UUID(course_id),
    #                 testum_id = uuid.UUID(content_id),
    #                 action_request = play_mode
    #                 )
    #     if len(testum_result)
    # else:

    testum_result = mTestumResult.objects.create(student_id=uuid.UUID(student_id),
                                                 class_id=uuid.UUID(class_id),
                                                 course_id=uuid.UUID(
                                                     course_id),
                                                 testum_id=uuid.UUID(
                                                     content_id),
                                                 action_request=play_mode
                                                 )

    testum_result.try_count = try_count
    testum_result.try_index = try_index
    testum_result.wrong_count = wrong_count
    testum_result.question_results = question_results
    testum_result.question_answers = question_answers
    testum_result.repeat_count = repeat_count
    testum_result.action_request = play_mode

    testum_result.save()

    # if play_mode != 2:
    _set_content_progress(student_id, class_id, course_id,
                          content_id, content_type, point, progress, try_count)

    return JsonResponse({"message": "updateTestumResult", "result": result}, status=200)
# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def updateexamresult(request):
    result = {}

    # if request.userType & ACCOUNT_TYPE_USER :
    #     return JsonResponse({"message": "updateExamResult", "result":result},status=200)
    #     pass

    student_id = request.POST.get('student_id')
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')
    content_id = request.POST.get('content_id')
    content_type = int(request.POST.get('content_type'))
    point = int(request.POST.get('point'))
    progress = int(request.POST.get('progress'))

    try_count = int(request.POST.get('try_count'))

    _set_content_progress(student_id, class_id, course_id,
                          content_id, content_type, point, progress, try_count)

    return JsonResponse({"message": "updateExamResult", "result": result}, status=200)
# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def updatelessonresult(request):

    # result = {}
    # student_id = request.POST.get('student_id')
    # class_id = request.POST.get('class_id')
    # course_id = request.POST.get('course_id')
    # content_id = request.POST.get('content_id')
    # content_type = int(request.POST.get('content_type'))
    # point = int(request.POST.get('point'))
    # progress = int(request.POST.get('progress'))

    # try_count = int(request.POST.get('try_count'))
    # # 'try_count': lesson_result.try_count,

    # try_index = int(request.POST.get('try_index'))
    # # 'try_index': lesson_result.try_index,

    # wrong_count = 0 # int(request.POST.get('wrong_count'))
    # # 'wrong_count': lesson_result.wrong_count,

    # question_results = request.POST.get('question_results')
    # # 'question_results': lesson_result.question_results,

    # repeat_count = request.POST.get('repeat_count')
    # # 'repeat_count': lesson_result.repeat_count,

    # # contentresult_list = _get_content_result(student_id,class_id,course_id,content_id,content_type)
    # # _update_content_result(student_id,class_id,course_id,content_id,content_type)
    # lesson_result = mLessonResult.objects.create(student_id=uuid.UUID(student_id),
    #             class_id = uuid.UUID(class_id),
    #             course_id = uuid.UUID(course_id),
    #             lesson_id = uuid.UUID(content_id),
    #             )

    # lesson_result.try_count = try_count
    # lesson_result.try_index = try_index
    # lesson_result.wrong_count = wrong_count
    # lesson_result.question_results = question_results
    # lesson_result.repeat_count = repeat_count
    # lesson_result.save()

    # _set_content_progress(student_id,class_id,course_id,content_id,content_type,point,progress)
    # if request.userType & ACCOUNT_TYPE_USER :
    #     return JsonResponse({"message": "updateLessonResult", "result":{}},status=200)
    #     pass
    result = _st_updatelessonresult(request)

    return JsonResponse({"message": "updateLessonResult", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
# student 는 자신의 course 의 정오를 딱히 basic 만 알면 된다.
def getcoursestat(request):
    result = {}

    content_list = []
    contentresult_list = []

    # if request.userType & ACCOUNT_TYPE_USER :
    #     result = {
    #         'content_list' : content_list,
    #         'contentresult_list':contentresult_list,
    #     }
    #     return JsonResponse({"message": "getCourseStat", "result":result},status=200)

    print('start get course statistics')
    student_id = request.POST.get('student_id')
    class_id = request.POST.get('class_id')
    course_id = request.POST.get('course_id')

    # courses_list = request.POST.get('content_list')
    # course_list = json.loads(courses_list)

    # for course in course_list:
    # class_id = course['class_id']
    # course_id = course['course_id']
    if (class_id == '?'):
        students_d = mStudentDetail.objects.filter(id=uuid.UUID(student_id))
        if len(students_d) != 1:
            return JsonResponse({"message": "getCourseStat", "result": result}, status=200)
        classes_ids = students_d[0].inclasses_ids.split(',')
        for class_id in classes_ids:
            contents = mClassContentAssign.objects.filter(class_id=class_id)
            for content in contents:
                _get_assigned_basic_content_stat_detail(content_list, student_id, class_id,
                                                        str(content.course_id), content)
                result_list = _get_content_result(
                    student_id, class_id,
                    str(content.course_id),
                    str(content.content_id),
                    content.content_type,
                    0)
                contentresult_list.append({
                    'content_id': content.content_id,
                    'result_list': result_list,
                })
    else:
        contents = mClassContentAssign.objects.filter(class_id=class_id,
                                                      course_id=course_id)
        for content in contents:
            _get_assigned_basic_content_stat_detail(
                content_list, student_id, class_id, course_id, content)
            result_list = _get_content_result(
                student_id, class_id, course_id,
                str(content.content_id),
                content.content_type,
                0)
            contentresult_list.append({
                'content_id': content.content_id,
                'result_list': result_list,
            })

        pass

    result = {
        'content_list': content_list,
        'contentresult_list': contentresult_list,
    }
    return JsonResponse({"message": "getCourseStat", "result": result}, status=200)


# /////////////////////////////////////////////////////////////////////////////////////

# /////////////////////////////////////////////////////////////////////////////////////

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def getassignedcourseinfo(request):
    # result = {}
    print('st get assigned course info -> start')
    # result = _vfn_st_get_assignedcourseinfo(request)
    result = _vfn_st_get_assignedcourseinfo_v2(request)
    print('st get assigned course info <- end')

    return JsonResponse({"message": "getAssignedCourseInfo", "result": result}, status=200)
# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def getcoursecontent(request):
    result = {}
    print('st get course content')
    # result = _vfn_st_get_coursecontent(request)
    result_list = _vfn_st_get_studyresultlist(request, True)
    result["result_list"] = result_list
    return JsonResponse({"message": "getCourseContent", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def getcoursecontentinfo(request):
    # result = {}
    print('st get course content info -> start ')
    # result = _vfn_st_get_coursecontent(request)
    result = _vfn_st_get_coursecontentinfo(request, True)
    # result["study_list"] = study_list
    print('st get course content info <- end ')
    return JsonResponse({"message": "getCourseContent", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def getvideoinfo(request):
    result = {}
    print('st get video info')
    content_list = _vfn_st_get_videoinfo(request)
    result["content_list"] = content_list
    return JsonResponse({"message": "getVideoInfo", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def getquestioninfo(request):
    result = {}
    print('st get question info')
    content_list = _vfn_st_get_questioninfo(request)
    result["content_list"] = content_list
    return JsonResponse({"message": "getQuestionInfo", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def getlessoninfo(request):
    result = {}
    print('st get lesson info')
    content_list = _vfn_st_get_lessoninfo(request)
    result["content_list"] = content_list
    return JsonResponse({"message": "getLessonInfo", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def gettestuminfo(request):
    result = {}
    print('st get testum info')
    content_list = _vfn_st_get_testuminfo(request)
    result["content_list"] = content_list
    return JsonResponse({"message": "getTestumInfo", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def getcontentinfo(request):
    result = {}
    print('st get content info')
    content_list = _vfn_st_get_contentinfo(request)
    result["content_list"] = content_list
    result["content_type"] = int(request.POST.get('content_type'))
    return JsonResponse({"message": "getContentInfo", "result": result}, status=200)
# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def updatestudyresultinfo(request):
    result = {}
    print('st update study result info')
    _vfn_st_update_studyresultinfo(request, True)
    # result["content_list"] = content_list
    # result["content_type"] = int(request.POST.get('content_type'))
    return JsonResponse({"message": "updateStudyResultInfo", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def updatelessonresultinfo(request):
    result = {}
    print('st update lesson result info')
    _vfn_st_update_lessonresultinfo(request)
    # result["content_list"] = content_list
    # result["content_type"] = int(request.POST.get('content_type'))
    return JsonResponse({"message": "updateLessonResultInfo", "result": result}, status=200)

# ////////////////////////////////////// REST API /////////////////////////////////////////


@jwtlogin_st_decorator0
def updatetestumresultinfo(request):
    result = {}
    print('st update testum result info')
    _vfn_st_update_testumresultinfo(request)
    # result["content_list"] = content_list
    # result["content_type"] = int(request.POST.get('content_type'))
    return JsonResponse({"message": "updateTestumResultInfo", "result": result}, status=200)
