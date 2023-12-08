import random
import string

import jwt
import requests
from decouple import config

from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import redirect
from django.views import View
from django.utils.decorators import method_decorator
from django.core.exceptions import ValidationError

from .models import mUser
from .decorators import last_visited
from .constants import *
from .utils import JWTGenerator, get_or_create_social_user


# KAKAO


class KaKaoSignInView(View):
    def get(self, request):
        kakao_auth_api = 'https://kauth.kakao.com/oauth/authorize?response_type=code'
        app_key = config('KAKAO_REST_API_KEY')
        redirect_uri = 'http://localhost:8000/user/signin/kakao/callback/'
        url = f'{kakao_auth_api}&client_id={app_key}&redirect_uri={redirect_uri}'

        return JsonResponse({"message": "auth_url", "url": url})


class KakaoSignInCallbackView(View):
    def get(self, request):
        try:
            auth_code = request.GET.get("code")
            kakao_token_api = 'https://kauth.kakao.com/oauth/token'
            data = {
                'grant_type': 'authorization_code',
                'client_id': config('KAKAO_REST_API_KEY'),
                'redirection_uri': 'http://localhost:8000/user/signin/kakao/callback',
                'code': auth_code
            }

            token_response = requests.post(kakao_token_api, data=data)
            payload = token_response.json()

            error = payload.get("error", None)

            if error is not None:
                return JsonResponse({"message": "INVALD_CODE"}, status=400)

            access_token = payload.get("access_token")

            # 받아온 token으로, user 정보 가져오기.
            user_info_response = requests.get(
                'https://kapi.kakao.com/v2/user/me', headers={'Authorization': f'Bearer ${access_token}'})

            user_info = user_info_response.json()
            email = user_info['kakao_account']['email']
            nickname = user_info['properties']['nickname']

            refresh_token, cookie_max_age = create_refresh_token_social_login(
                email, nickname)

            next_url = request.session.get("next", "/")
            del request.session['next']

            if refresh_token:
                response = redirect(next_url)
                response.set_cookie('refresh_token', refresh_token,
                                    httponly=True, samesite='Strict', max_age=cookie_max_age)
                return response

            return JsonResponse({"message": "Social Login Failed"})

        except KeyError:
            return JsonResponse({"message": "INVALID_TOKEN"}, status=400)

        except Exception as e:
            return JsonResponse({"message": f"Exception: {e}"}, status=400)

# NAVER


class NaverSignInView(View):
    # https://developers.naver.com/docs/login/devguide/devguide.md#3-4-2-%EB%84%A4%EC%9D%B4%EB%B2%84-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%97%B0%EB%8F%99-url-%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0
    def get(self, request):
        naver_auth_api = 'https://nid.naver.com/oauth2.0/authorize'
        response_type = 'code'
        app_key = config('NAVER_REST_API_KEY')
        redirect_uri = 'http://localhost:8000/user/signin/naver/callback'
        state = config('NAVER_STATE')

        url = f'{naver_auth_api}?response_type={response_type}&client_id={app_key}&redirect_uri={redirect_uri}&state={state}'

        return JsonResponse({"message": "auth_url", "url": url})


class NaverSignInCallbackView(View):
    def get(self, request):
        try:
            auth_code = request.GET.get("code")
            naver_token_api = 'https://nid.naver.com/oauth2.0/token'
            data = {
                'grant_type': 'authorization_code',
                'client_id': config('NAVER_REST_API_KEY'),
                'client_secret': config('NAVER_SECRET_KEY'),
                'code': auth_code,
                'state': config('NAVER_STATE'),
            }
            client_id = config("NAVER_REST_API_KEY")
            client_secret = config("NAVER_SECRET_KEY")
            state_string = request.GET.get("state")

            token_request = requests.get(
                f"https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id={client_id}&client_secret={client_secret}&code={auth_code}&state={state_string}")
            payload = token_request.json()
            # token_response = requests.post(naver_token_api, data=data)
            # payload = token_response.json()

            error = payload.get("error", None)
            print("payload:", payload)
            if error is not None:
                return JsonResponse({"message": f"INVALD_CODE: {error}"}, status=400)

            access_token = payload.get("access_token")

            # 받아온 token으로, user 정보 가져오기.
            user_info_response = requests.get(
                'https://openapi.naver.com/v1/nid/me', headers={'Authorization': f'Bearer ${access_token}'})

            print(access_token)
            print(user_info_response)
            return JsonResponse({'user_info': user_info_response.json()}, status=200)
            # return redirect('/')

        except KeyError:
            return JsonResponse({"message": "INVALID_TOKEN"}, status=400)

        except access_token.DoesNotExist:
            return JsonResponse({"message": "INVALID_TOKEN"}, status=400)

# GOOGLE


class GoogleSignInView(View):
    def get(self, request):
        auth_api = 'https://accounts.google.com/o/oauth2/v2/auth'

        # 필수
        client_id = config('GOOGLE_CLIENT_ID')
        redirect_uri = 'http://localhost:8000/user/signin/google/callback/'
        response_type = 'code'
        scope = "https://www.googleapis.com/auth/userinfo.profile"

        # 권장
        state = config('GOOGLE_STATE')

        url = f'{auth_api}?client_id={client_id}&redirect_uri={redirect_uri}&response_type={response_type}&state={state}&scope={scope}'
        return JsonResponse({"message": "auth_url", "url": url})


class GoogleSignInCallbackView(View):
    def get(self, request):
        try:
            auth_code = request.GET.get("code")
            token_api = 'https://oauth2.googleapis.com/token'
            data = {
                'code': auth_code,
                'client_id': config('GOOGLE_CLIENT_ID'),
                'client_secret': config('GOOGLE_SECRET_KEY'),
                'grant_type': 'authorization_code',
                'redirect_uri': 'http://localhost:8000/user/signin/google/callback/',
            }

            token_response = requests.post(token_api, data=data)
            payload = token_response.json()

            error = payload.get("error", None)

            if error is not None:
                return JsonResponse({"message": "INVALD_CODE"}, status=400)

            access_token = payload.get("access_token")

            # 받아온 token으로, user 정보 가져오기.
            token_info_url = 'https://www.googleapis.com/oauth2/v1/'

            # TODO
            # 왜 이 방식은 안될까..?
            # user_info_response = requests.get(
            #     token_info_url, headers={'Authorization': f'Bearer ${access_token}'})
            user_info_response = requests.get(
                f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}")

            user_info = user_info_response.json()
            return JsonResponse({'user_info': user_info_response.json()}, status=200)

        except Exception as e:
            return JsonResponse({"message": e})
        # except KeyError:
        #     return JsonResponse({"message": "INVALID_TOKEN"}, status=400)

        # except access_token.DoesNotExist:
        #     return JsonResponse({"message": "INVALID_TOKEN"}, status=400)


class GoogleOpenIdView(View):
    def get_nonce(self, length=13):
        letters_digits = string.ascii_letters + string.digits
        random_string = ''.join(random.choice(letters_digits)
                                for i in range(length))

        nonce = random_string + random_string

        return nonce

    def get(self, request):
        auth_uri = 'https://accounts.google.com/o/oauth2/v2/auth'

        # 필수
        client_id = config('GOOGLE_CLIENT_ID')
        redirect_uri = 'http://localhost:8000/user/signin/google/callback/'
        response_type = 'token id_token'
        scope = "openid profile email"

        # 권장
        state = config('GOOGLE_STATE')

        nonce = self.get_nonce()

        url = f'{auth_uri}?client_id={client_id}&redirect_uri={redirect_uri}&response_type={response_type}&state={state}&scope={scope}&nonce={nonce}'
        return JsonResponse({"message": "auth_url", "url": url})


class GoogleOpenIdCallbackView(View):
    def get(self, request):
        try:
            auth_code = request.GET.get("code")
            token_api = 'https://oauth2.googleapis.com/token'
            data = {
                'code': auth_code,
                'client_id': config('GOOGLE_CLIENT_ID'),
                'client_secret': config('GOOGLE_SECRET_KEY'),
                'grant_type': 'authorization_code',
                'redirect_uri': 'http://localhost:8000/user/signin/google/callback/',
            }

            token_response = requests.post(token_api, data=data)
            payload = token_response.json()

            error = payload.get("error", None)

            if error is not None:
                return JsonResponse({"message": "INVALD_CODE"}, status=400)

            access_token = payload.get("access_token")

            # 받아온 token으로, user 정보 가져오기.
            token_info_url = 'https://www.googleapis.com/oauth2/v1/'

            # TODO
            # 왜 이 방식은 안될까..?
            # user_info_response = requests.get(
            #     token_info_url, headers={'Authorization': f'Bearer ${access_token}'})
            user_info_response = requests.get(
                f"https://www.googleapis.com/oauth2/v1/tokeninfo?access_token={access_token}")

            user_info = user_info_response.json()
            print(user_info)
            return JsonResponse({'user_info': user_info_response.json()}, status=200)

        except Exception as e:
            return JsonResponse({"message": e})


class GoogleLoginApi(View):
    def get(self, request, *args, **kwargs):
        client_id = config('GOOGLE_CLIENT_ID')
        redirect_uri = 'http://localhost:8000/user/signin/google/test/callback/'
        response_type = 'code'
        scope = "https://www.googleapis.com/auth/userinfo.email " + \
                "https://www.googleapis.com/auth/userinfo.profile"

        auth_api = "https://accounts.google.com/o/oauth2/v2/auth"

        auth_uri = f"{auth_api}?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&scope={scope}"

        return JsonResponse({"message": "Google auth url", "url": auth_uri})


class GoogleSigninCallBackApi(View):

    def get_access_token(self, google_token_api, code):
        client_id = config('GOOGLE_CLIENT_ID')
        client_secret = config('GOOGLE_SECRET_KEY')
        code = code
        grant_type = 'authorization_code'
        redirect_uri = 'http://localhost:8000/user/signin/google/test/callback/'
        state = "random_string"

        google_token_api += \
            f"?client_id={client_id}&client_secret={client_secret}&code={code}&grant_type={grant_type}&redirect_uri={redirect_uri}&state={state}"

        token_response = requests.post(google_token_api)

        if not token_response.ok:
            raise ValidationError('google_token is invalid')

        access_token = token_response.json().get('access_token')

        return access_token

    def get_user_info(self, access_token):
        user_info_response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            params={
                'access_token': access_token
            }
        )

        if not user_info_response.ok:
            raise ValidationError("Failed to obtain user info from Google")

        user_info = user_info_response.json()

        return user_info

    def get(self, request, *args, **kwargs):
        code = request.GET.get('code')
        google_token_api = "https://oauth2.googleapis.com/token"

        access_token = self.get_access_token(google_token_api, code)
        user_data = self.get_user_info(access_token)

        print("user_data: ", user_data)

        return JsonResponse({"message": "success google login ", "data": user_data})

        profile_data = {
            'username': user_data['email'],
            'first_name': user_data.get('given_name', ''),
            'last_name': user_data.get('family_name', ''),
            'nickname': user_data.get('nickname', ''),
            'name': user_data.get('name', ''),
            'image': user_data.get('picture', None),
            'path': "google",
        }

        # user, _ = get_or_create_social_user(**profile_data)

        # response = redirect(settings.BASE_FRONTEND_URL)
        # response = jwt_login(response=response, user=user)

        # return response

# Social Login

# 1. auth code 가져옴
# 2. redirect-> callback
# 3. access token(+refresh token)을 가져옴
# 4. 해당을 통해, user info를 가져온다.
# 5. 해당을 통해, 회원가입/로그인을 해준다.
# 6. 완료가 되면, jwt token과 함께? 기존에 사용자가 시도했던 url로 돌아가게 한다.


class BaseOAuth2View(View):
    # 공통 설정
    client_id = None
    client_secret = None
    auth_token_url = None
    grant_type = "authorization_code"
    redirect_uri = None
    info_api_url = None

    state = None

    def create_context(self):
        return {
            'grant_type': self.grant_type,
            'client_id': self.client_id,
            'code': self.auth_code,
        }

    def get_token(self, context):
        response = requests.post(self.auth_token_url, data=context)

        error = response.get("error", None)
        if error is not None:
            return JsonResponse({'message': 'Get Token Fail'}, status=400)

        token = response.json()
        return token

    def get_user_info(self, access_token):
        response = requests.get(
            access_token,
            headers={'Authorization': f'Bearer ${access_token}'}
        )

        user_info = response.json()
        return user_info

    def get(self, request, *args, **kwargs):
        result = {
            'email': None,
            'nickname': None,
        }

        auth_code = request.GET.get("code")
        self.auth_code = auth_code

        context = self.create_context()
        token = self.get_token(context)

        access_token = token.get('access_token')

        user_info = self.get_user_info(access_token)

        result['email'] = user_info.email
        result['nickname'] = user_info.nickname
        # signup->
        return redirect(context['authorization_url'])


# FACEBOOK


class FaceBookSignInView(View):
    def get(self, request):
        auth_api = 'https://www.facebook.com/v3.0/dialog/oauth'

        client_id = config('FACEBOOK_CLIENT_ID')
        redirect_uri = 'http://localhost:8000/user/signin/facebook/callback/'
        scope = "email,public_profile"

        uri = f'{auth_api}?client_id={client_id}&redirect_uri={redirect_uri}&scope={scope}'
        res = redirect(uri)
        return res


class FaceBookSignInCallbackView(View):
    def get(self, request):
        try:
            code = request.GET.get("code")
            token_api = 'https://graph.facebook.com/v3.0/oauth/access_token'
            params = {
                'code': code,
                'client_id': config('FACEBOOK_CLIENT_ID'),
                'client_secret': config('FACEBOOK_SECRET_KEY'),
                'grant_type': 'authorization_code',
                'redirect_uri': 'http://localhost:8000/user/signin/facebook/callback/',
            }

            token_response = requests.post(token_api, params)
            payload = token_response.json()
            print("payload:", payload)

            error = payload.get("error", None)

            if error is not None:
                return JsonResponse({"message": "INVALD_CODE"}, status=400)

            access_token = payload.get("access_token")

            # 얻은 토큰을 통해 해당 사용자 고유의 user_id를 받을 수 있다
            # 얻은 토큰을 디버그 해주는 과정
            url = 'https://graph.facebook.com/debug_token'
            params = {
                'input_token': access_token,
                'access_token': f'{config("FACEBOOK_CLIENT_ID")}|{config("FACEBOOK_SECRET_KEY")}',
            }
            # response에는 기본적인 유져 프로필과 같은 사항이 담기게 된다
            response = requests.get(url, params)

            # 받아온 token으로, user 정보 가져오기.
            token_info_url = 'https://graph.facebook.com/v3.0/me'
            user_info_params = {
                'access_token': access_token,
                'fields': ','.join([
                    'id',
                    'name',
                    'first_name',
                    'last_name',
                    'picture',
                ])
            }
            user_info_response = requests.get(token_info_url, user_info_params)
            return JsonResponse({'user_info': user_info_response.json()}, status=200)

        except KeyError:
            return JsonResponse({"message": "INVALID_TOKEN"}, status=400)


def create_refresh_token_social_login(email, nickname, *args, **kwargs):
    """
    Create refresh token for social login

    After you get user's info from OAuth service server, handle signup/signin

    Use this at the callback view (e.g. KakaoSignInCallbackView)

    The reason to split this function is since social login user don't have password.
    This can be changed after
    """
    token_generator = JWTGenerator()

    try:
        query = mUser.objects.filter(email=email)
        if not query.exists():
            created_user = mUser.objects.create(
                email=email,
                nickname=nickname,
                type=64  # TODO: 임시로 default값 지정해줬으니, 추후에 변경하자
            )

            user = mUser.objects.get(id=created_user.id)
        else:
            user = query[0]

        refresh_token = token_generator.generate_token(
            'refresh',
            user=str(user.id),
            type=int(user.type),
            name=str(user.nickname),
            isSocialLogin=True,
        )

        cookie_max_age = token_generator.get_max_age()

        return refresh_token, cookie_max_age
    except Exception as e:
        return None
