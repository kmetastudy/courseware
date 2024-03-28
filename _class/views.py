import json
import uuid

from django.shortcuts import render, redirect
from django.http import QueryDict
from django.db import transaction


# Create your views here.
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import api_view, action
from rest_framework import serializers

from django_filters.rest_framework import DjangoFilterBackend

from _user.models import mCoursePurchases
from _user.utils import make_context
from _user.decorators import jwt_login_required, last_visited
from core.utils.dictionary_helpers import extract
from .models import (
    mClass,
    mSingleCourseClass,
    mClassMember,
    mClassPost,
    mReaction,
    mComment,
    mClassContentAssign,
    mClassInvitation,
    mClassCourse,
    mClassStudyResult,
)
from .serializers import (
    ClassSerializer,
    SingleCourseClassSerializer,
    ClassMemberSerializer,
    ClassPostSerializer,
    CommentSerializer,
    ReactionSerializer,
    ClassContentAssignSerializer,
    ClassInvitationSerializer,
    ClassStudyResultSerializer,
)

from .services import ClassContentAssignService, ClassStudyResultService


@last_visited
@jwt_login_required
def index(request):
    user_id = request.userId

    if not user_id:
        print("debug")
        next_url = request.session.get("next", None)

        if next_url:
            del request.session["next"]

        return redirect(next_url) if next_url else redirect("/")

    context = make_context(request)

    print("context: ", context)
    dumped_context = {"context": json.dumps(context)}
    return render(request, "_class/_class.html", dumped_context)


@last_visited
@jwt_login_required
def index_classroom(request):
    user_id = request.userId
    class_id = request.GET.get("id")

    if not user_id:
        print("debug")
        next_url = request.session.get("next", None)

        if next_url:
            del request.session["next"]

        return redirect(next_url) if next_url else redirect("/")

    member = mClassMember.objects.filter(id_user=user_id).first()

    member_type = member.display_type
    context = make_context(request)
    if class_id:
        context["classId"] = class_id

    dumped_context = {"context": json.dumps(context)}

    if member_type == "Teacher" or member_type == "Admin":
        return render(request, "_class/classroom-teacher.html", dumped_context)
    else:
        return render(request, "_class/classroom-student.html", dumped_context)


@last_visited
@jwt_login_required
def page_classroom_teacher(request, id_class):

    context = make_context(request)
    context["classId"] = str(id_class)

    dumped_context = {"context": json.dumps(context)}

    return render(request, "_class/classroom-teacher.html", dumped_context)


@last_visited
@jwt_login_required
def page_classroom_student(request, id_class):
    context = make_context(request)
    context["classId"] = str(id_class)

    dumped_context = {"context": json.dumps(context)}

    return render(request, "_class/classroom-student.html", dumped_context)


@last_visited
@jwt_login_required
def page_class_launch(request):
    id_user = request.userId
    id_course = request.GET.get("id_course", None)

    # id_course = request.
    if not id_user or not id_course:
        next_url = request.session.get("next", None)

        if next_url:
            del request.session["next"]

        return redirect(next_url) if next_url else redirect("/user")

    context = make_context(request)
    context["courseId"] = id_course

    dumped_context = {"context": json.dumps(context)}
    return render(request, "_class/_class_launch.html", dumped_context)


class ClassViewSet(viewsets.ModelViewSet):
    queryset = mClass.objects.all()
    serializer_class = ClassSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = {
        "id": ["in", "exact"],
        "id_owner": ["in", "exact"],
        "active": ["exact"],
    }

    def perform_create(self, serializer):
        class_instance = serializer.save()

        mClassMember.objects.create(
            id_user=class_instance.id_owner,
            id_class=class_instance.id,
            type=mClassMember.TYPE_TEACHER,
        )


class SingleCourseClassViewSet(viewsets.ModelViewSet):
    queryset = mSingleCourseClass.objects.all()
    serializer_class = SingleCourseClassSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = {
        "id": ["in", "exact"],
        "id_course": ["in", "exact"],
        "id_owner": ["in", "exact"],
        "active": ["exact"],
    }

    @transaction.atomic
    def perform_create(self, serializer):
        single_course_class = serializer.save()

        class_member = mClassMember(
            id_user=getattr(single_course_class, "id_owner"),
            id_class=getattr(single_course_class, "id"),
            type=mClassMember.TYPE_TEACHER,
        )

        class_member.full_clean()
        class_member.save()

        service = ClassContentAssignService(
            id_class=getattr(single_course_class, "id"),
            id_course=getattr(single_course_class, "id_course"),
            start_date=getattr(single_course_class, "start_date"),
            end_date=getattr(single_course_class, "end_date"),
        )

        class_content_assign = service.auto_create_assign()
        return Response(data=serializer.data, status=status.HTTP_201_CREATED)


class ClassMemberViewSet(viewsets.ModelViewSet):
    queryset = mClassMember.objects.all()
    serializer_class = ClassMemberSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    # filterset_fields = ['id', 'id_owner']
    filterset_fields = {
        "id": ["in", "exact"],
        "id_user": ["in", "exact"],
        "id_class": ["in", "exact"],
        "type": ["in", "exact"],
    }


class ClassPostViewSet(viewsets.ModelViewSet):
    queryset = mClassPost.objects.all()
    serializer_class = ClassPostSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    # filterset_fields = ['id', 'id_owner']
    filterset_fields = {
        "id": ["in", "exact"],
    }


class ReactionViewSet(viewsets.ModelViewSet):
    queryset = mReaction.objects.all()
    serializer_class = ReactionSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    # filterset_fields = ['id', 'id_owner']
    filterset_fields = {
        "id": ["in", "exact"],
    }


class CommentViewSet(viewsets.ModelViewSet):
    queryset = mComment.objects.all()
    serializer_class = CommentSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    # filterset_fields = ['id', 'id_owner']
    filterset_fields = {
        "id": ["in", "exact"],
    }


class ClassContentAssignViewSet(viewsets.ModelViewSet):
    queryset = mClassContentAssign.objects.all()
    serializer_class = ClassContentAssignSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = {
        "id": ["in", "exact"],
        "id_class": ["in", "exact"],
        "id_course": ["in", "exact"],
    }

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        contents = self.filter_queryset(queryset)

        if not contents.exists():
            id_course = request.query_params.get("id_course", None)
            id_class = request.query_params.get("id_class", None)
            if id_course and id_class:
                self.create_empty_content(id_class, id_course)
                contents = self.queryset.filter(id_class=id_class, id_course=id_course)

        content = contents.first()
        serializer = self.get_serializer(content)

        return Response(data=serializer.data, status=200)

    def create_empty_content(self, id_class, id_course):
        json_data = {}
        json_data["condition"] = {}

        json_data["condition"]["scheduler"] = {}
        json_data["condition"]["scheduler"]["onweek"] = [1, 1, 1, 1, 1, 1, 1]
        json_data["condition"]["scheduler"]["offweek"] = [0, 0, 0, 0, 0, 0, 0]
        json_data["condition"]["scheduler"]["onday"] = []
        json_data["condition"]["scheduler"]["offday"] = []
        json_data["condition"]["clinic"] = {}
        json_data["condition"]["clinic"]["wrong"] = {}
        json_data["condition"]["clinic"]["wrong"]["auto"] = True
        json_data["condition"]["clinic"]["wrong"]["term"] = "0000-00-01 00:00:00"
        json_data["condition"]["clinic"]["weak"] = {}
        json_data["condition"]["clinic"]["weak"]["auto"] = False
        json_data["condition"]["clinic"]["weak"]["term"] = "0000-00-01 00:00:00"

        json_data["scheduler_list"] = []

        mClassContentAssign.objects.create(
            id_class=id_class,
            id_course=id_course,
            # condition = json.dumps(condition,indent=4,ensure_ascii=False),
            json_data=json.dumps(json_data, ensure_ascii=False),
        )


class ClassInvitationViewSet(viewsets.ModelViewSet):
    queryset = mClassInvitation.objects.all()
    serializer_class = ClassInvitationSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = {
        "id": ["in", "exact"],
        "id_class": ["in", "exact"],
    }

    @action(detail=True, methods=["patch"])
    def refresh(self, request, pk=None):
        instance = self.get_object()
        return Response(data={}, status=status.HTTP_200_OK)


@jwt_login_required
@api_view(["GET"])
def class_join(request, class_code):
    id_user = request.userId
    if not id_user:
        return redirect("_user:index")

    if not class_code:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    invitation_queryset = mClassInvitation.objects.filter(code=class_code)
    if not invitation_queryset.exists():
        return Response(
            data={"message": "Invalid Invitation"}, status=status.HTTP_404_NOT_FOUND
        )

    invitation = invitation_queryset.first()

    id_class = invitation.id_class

    member_queryset = mClassMember.objects.filter(id_class=id_class, id_member=id_user)

    if not member_queryset:
        member_queryset = mClassMember.objects.create(
            id_user=id_user, id_class=id_class
        )

    return redirect("classroom")


class SingleCourseClassRegistrationView(APIView):
    """
    When student buy the course, and also want to join the class
    """

    class InputSerializer(serializers.Serializer):
        id_user = serializers.UUIDField()
        id_class = serializers.UUIDField()
        type = serializers.IntegerField()

    class OutputSerializer(serializers.Serializer):
        id_user = serializers.UUIDField()
        id_class = serializers.UUIDField()
        type = serializers.IntegerField()

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data
        class_query = mSingleCourseClass.objects.filter(id=validated_data["id_class"])

        if not class_query.exists():
            raise ValueError("Invalid Class Id")

        single_course_class = class_query.first()

        member = mClassMember.custom_objects.create_member(**validated_data)

        study_result_service = ClassStudyResultService(
            id_student=member.id_user,
            id_course=single_course_class.id_course,
            id_class=single_course_class.id,
        )

        queryset = mClassContentAssign.objects.filter(id_class=single_course_class.id)
        if queryset.exists():
            content_assign = queryset.first()
            scheduler_list = json.loads(content_assign.json_data).get("scheduler_list")
            study_result_service.create_study_result(scheduler_list=scheduler_list)

        output_serializer = self.OutputSerializer(member)

        return Response(data=output_serializer.data, status=status.HTTP_201_CREATED)


class ClassStudyResultViewSet(viewsets.ModelViewSet):
    queryset = mClassStudyResult.objects.all()
    serializer_class = ClassStudyResultSerializer

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    # filterset_fields = ['id', 'id_owner']
    filterset_fields = {
        "id": ["in", "exact"],
        "id_student": ["in", "exact"],
        "id_course": ["in", "exact"],
        "id_class": ["in", "exact"],
        "id_instance": ["in", "exact"],
    }
