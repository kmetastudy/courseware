import json

from django.shortcuts import render
from django.http import JsonResponse


from .decorators import jwt_main
from _user.utils import make_context
from _st.models import mUserCourse


# @jwt_main
# def index(request):
#     context = make_context(request)
#     context_dumped = {'context': json.dumps(context)}
#     return render(request, "_main/_main.html", context_dumped)
