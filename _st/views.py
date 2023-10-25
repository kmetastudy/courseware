import json
from typing import Any
import uuid

from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views import View

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter


from _st.models import mTestumResult, mLessonResult, mTestumProgress, mLessonProgress
from _cp.models import mCourse, mElement

from _cp.views import CourseViewSet, ElementViewSet
from _user.utils import make_fake_context, jwt_required

from _st.serializer import ContentSerializer
from _cp.serializer import CourseSerializer, ElementSerializer

from _st.utils import get_content_info
# @jwt_required


def index(request):
    context = {'context': json.dumps(make_fake_context(request))}
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


# def getcoursecontentinfo(request):
#     result = _vfn_st_get_coursecontentinfo(request, True)
#     return JsonResponse({"message": "getCourseContent", "result": result}, status=200)


# data = {
#     'study_list': [
#         {'class_id': '',
#          'course_id': 'course_id',
#          'content_list': [],
#          'results': [
#              #  {
#              #     id: "0c9aabde-d743-4cc7-9238-8d623f165f49",
#              #     title: "7. Topic1 : Voca",
#              #     type: 11,
#              #     level: 2,
#              #     show: true,
#              #     date: "2023-09-18",
#              #     units: [{ id: "140c1eb9-cd50-48f4-8afd-ff093e58b715", types: ["q", "q", "q", "q", "q"] }],
#              #     results: [
#              #         {
#              #         repeat: [1, 1, 1, 1, 1],
#              #         result: ["O", "O", "O", "O", "O"],
#              #         first: ["O", "O", "O", "O", "O"],
#              #         second: ["", "", "", "", ""],
#              #         },
#              #     ],
#              #     progress: 100,
#              #     point: 100,
#              #     },
#          ]}
#     ],
#     # mDemoStudyResultN
#     'clinic_list': [{
#         'class_id': 'class_id',
#         'clinic_id': 'str(content.id_content)',
#         'properties': 'content.properties'
#     }],
# }
