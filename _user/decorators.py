from decouple import config
import jwt

from functools import wraps
from django.http import JsonResponse

from .utils import decode_token, issue_new_token


def last_visited(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if request.method == 'GET':
            request.session['next'] = request.get_full_path()
        return view_func(request, *args, **kwargs)
    return wrapper


def jwt_user(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        nextUrl = request.GET.get('next')
        #

        return func(request, *args, **kwargs)

    return wrapper


def jwt_login_required(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        access_token = request.POST.get('access_token')

        if not access_token:
            refresh_token = request.COOKIES.get('refresh_token', None)

            if not refresh_token:
                return JsonResponse({'error': 'Authentication required'}, status=401)

            payload, err = decode_token(
                refresh_token, config("JWT_KEY"), ['HS256'])

            if err:
                return JsonResponse({'error': err}, status=401)

            new_payload = {'user_id': payload['user_id']}
            new_access_token = issue_new_token(
                new_payload, config("JWT_KEY"), 'HS256')

            response = func(request, *args, **kwargs)
            response.content = JsonResponse(
                {'access_token': new_access_token}).content
            return response

        payload, err = decode_token(access_token, config("JWT_KEY"), ['HS256'])

        if err:
            return JsonResponse({'error': err}, status=401)

        return func(request, *args, **kwargs)

    return wrapper
