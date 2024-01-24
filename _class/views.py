import json

from django.shortcuts import render, redirect
from django.http import JsonResponse
# Create your views here.

from _user.utils import make_context
from _user.decorators import jwt_login_required, last_visited


@last_visited
@jwt_login_required
def index(request):
    user_id = request.userId

    # remove after test
    if not user_id:
        next_url = request.session.get("next", "/")
        del request.session['next']
        return redirect(next_url)

    context = make_context(request)

    print("context: ", context)
    dumped_context = {'context': json.dumps(context)}
    return render(request, "_class/_class.html", dumped_context)
