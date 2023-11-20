import json
import uuid

from django.shortcuts import render
from django.http import JsonResponse

# rest api
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response

from .constants import *
from .utils import DataValidator, convert_branch_recursive
from .models import (mCourseBook,
                     mCourseBookBranch,
                     mTestum,
                     mLesson,
                     mTestumUnit,
                     mLessonUnit,
                     mQuestionAtom,
                     mVideoAtom,
                     mQuestionSolutionText,
                     mQuestionSolutionVideo,
                     mMapperN,
                     mCourseN,
                     mElementN,
                     ##
                     mCourse,
                     mElement)

from .serializer import (
    # New
    CourseSerializer,
    ElementSerializer,
)
# Create your views here.


def index(request):
    return render(request, "_cp/index.html")


class CourseViewSet(viewsets.ModelViewSet):
    queryset = mCourse.objects.all()
    serializer_class = CourseSerializer

    @action(detail=True, methods=['get'])
    def get_json_field(self, request, pk=None):
        obj = self.get_object()
        json_field = obj.json_data
        print("course id: ", obj.id)
        # Convert the JSON-like string to a Python dictionary
        json_dict = json.loads(json_field)

        # Extract 'lists', 'contents', or 'kl' based on the query parameter
        field_type = request.query_params.get('field_type')
        if field_type in ['lists', 'contents', 'kl']:
            data = json_dict.get(field_type)
        else:
            data = {'error': 'Invalid field_type parameter'}

        return Response(data)


class ElementViewSet(viewsets.ModelViewSet):
    queryset = mElement.objects.all()
    serializer_class = ElementSerializer

    @action(detail=True, methods=['get'])
    def get_json_field(self, request, pk=None):
        obj = self.get_object()
        json_field = obj.json_data
        print("course id: ", obj.id)

        return Response(json_field)

    # @action(detail=False, methods=['post'])
    # def get_element_list(self, request, pk=None):
    #     element_list = []

    #     ids = request.data.get('ids')
    #     types = request.data.get('types')

    #     if not isinstance(ids, list) or not isinstance(types, list):
    #         return Response({'error': 'Invalid data format, arrays of IDs and Types are expected.'}, status=400)

    #     if len(ids) != len(types):
    #         return Response({'error': 'The length of IDs and Types arrays must match.'}, status=400)

    #     query = Q()
    #     for idx, id in enumerate(ids):
    #         query |= Q(id=id, type=types[idx])

    #     objects = self.queryset.filter(query).iterator()

    #     for obj in objects:
    #         data = json.loads(obj.json_data)
    #         type = data.type
    #         #

    #         #

    #     # 객체들을 시리얼라이즈합니다.
    #     serializer = self.get_serializer(objects, many=True)

    #     # 시리얼라이즈된 데이터를 응답으로 반환합니다.
    #     return Response(serializer.data)


def get_full_course(request):
    data_validator = DataValidator()
    # result = []

    book_id = data_validator.convert_to_uuid(request.POST.get("id"))
    book_query = mCourseBook.objects.filter(id=book_id)
    if book_query.count() == 0:
        return JsonResponse({"message": "No matched data"})

    book_data = list(book_query.values())[0]
    book_data["children"] = []
    # result.append(book_data)

    print(book_data['title'])

    if book_data["branch_ids"] == None or book_data["branch_ids"] == "":
        return JsonResponse({"message": "No chapter", "result": book_data})

    chapter_ids = book_data["branch_ids"].split(",")

    for chapter_id in chapter_ids:
        chapter_query = mCourseBookBranch.objects.filter(id=chapter_id)
        if chapter_query.count() == 0:
            continue
        chapter_data = list(chapter_query.values())[0]
        # result.append(chapter_data)
        book_data["children"].append(chapter_data)

        if chapter_data["branch_ids"] == None or chapter_data["branch_ids"] == "":
            continue

        branch_ids = chapter_data["branch_ids"].split(",")
        chapter_data["children"] = []
        for branch_id in branch_ids:
            branch_query = mCourseBookBranch.objects.filter(id=branch_id)
            if branch_query.count() == 0:
                continue
            branch_data = list(branch_query.values())[0]
            # result.append(branch_data)
            chapter_data["children"].append(branch_data)

    # return JsonResponse({"result": result})
    return JsonResponse({"result": book_data})
    # 데이터를 ID 기준으로 매핑하여 쉽게 찾을 수 있게 합니다.

# TOOLS


def compose_new_contents(prev_json_data):
    try:
        # for content in prev_json_data["contents"]:
        new_contents = []
        for i in range(len(prev_json_data["contents"])):
            content = prev_json_data['contents'][i]
            lists = prev_json_data['lists'][i]

            new_content = lists.copy()
            new_content.pop('units', None)
            # units 키가 있는지 확인하고, 그 안의 데이터를 합칩니다.
            if "units" in content and content["units"]:
                combined_ids = []
                combined_types = []
                for unit in content["units"]:
                    combined_ids.extend(unit["ids"])
                    combined_types.extend(unit["types"])

                new_content['elements'] = {
                    "ids": combined_ids, "types": combined_types}

            else:
                # 'units' 키가 없거나 비어있는 경우, 빈 'elements'를 추가합니다.
                new_content['elements'] = {"ids": [], "types": []}

            new_contents.append(new_content)
        return new_contents
    except:
        return []


def compose_new_kls(prev_json_data):
    new_kls = []
    try:
        for content in prev_json_data["kls"]:
            # units 키가 있는지 확인하고, 그 안의 데이터를 합칩니다.
            if "units" in content and content["units"]:
                combined_ids = []
                combined_types = []
                for unit in content["units"]:
                    combined_ids.extend(unit["kl"])
                    combined_types.extend(unit["types"])

                new_kls.append(
                    {"elements": {"kl": combined_ids, "types": combined_types}})
            else:
                # 'units' 키가 없거나 비어있는 경우, 빈 'elements'를 추가합니다.
                new_kls.append({"elements": {}})

        return new_kls
    except:
        return []


def transform_course(course_id):
    query = mCourseN.objects.filter(id=course_id)
    if not query.exists():
        return json.dumps({}, ensure_ascii=False)

    course = query[0]
    prev_json_data = json.loads(course.json_data)

    next_json_data = {}
    next_json_data['contents'] = compose_new_contents(prev_json_data)
    next_json_data['kls'] = compose_new_kls(prev_json_data)
    return json.dumps(next_json_data, ensure_ascii=False)

# type=2인 애들만


def transform_course_all(request):
    ids_list = mCourseN.objects.filter(type=2).values_list('id', flat=True)
    ids = list(ids_list)

    for id in ids:
        course = mCourse.objects.filter(id=id)
        if course.exists():
            continue

        values = list(mCourseN.objects.filter(id=id).values())[0]
        json_new = transform_course(id)

        values['json_data'] = json_new
        mCourse.objects.create(**values)
    return JsonResponse({'result': {}, 'message': "transform complete"}, status=200)


def transform_course_all_test(request):
    ids_list = mCourseN.objects.filter(type=2).values_list('id', flat=True)
    ids = list(ids_list)

    id = ids[0]
    values = list(mCourseN.objects.filter(id=id).values())[0]
    json_new = transform_course(id)

    values['json_data'] = json_new
    mCourse.objects.create(**values)
    return JsonResponse({'result': values}, status=200)


def migrate_element(request):
    values = list(mElementN.objects.all().values())
    size = len(values)
    cnt = 0
    for value in values:
        id = value['id']
        if mElement.objects.filter(id=id).exists():
            continue

        mElement.objects.create(**value)
        cnt += 1

    return JsonResponse({'result': {}, 'message': f"mElement created, {cnt}/{size}"}, status=201)


@api_view(['POST'])
def convert_course_to_json(request):
    course_id = request.data.get("course_id")

    print(course_id)
    print(request.data)
    course = mCourseBook.objects.filter(id=course_id).first()
    if not course:
        return Response({}, status.HTTP_204_NO_CONTENT)

    chapter_ids = course.branch_ids.split(",") if course.branch_ids else []

    lists = []
    contents = []
    kls = []

    for chapter_id in chapter_ids:
        convert_branch_recursive(chapter_id, lists, contents, kls)

    results = {
        "lists": lists,
        "contents": contents,
        "kls": kls,
    }

    return Response(results, status.HTTP_200_OK)
