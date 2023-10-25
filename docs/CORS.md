# CORS

## **Cross Origin Resource Sharing**

브라우저에서 보안적인 이유로 `cross-origin` HTTP 요청들을 제한

따라서 `cross-origin`요청을 하려면 서버의 동의가 필요.
서버가 동의하면 브라우저에서는 요청을 허락하고, 그렇지 않는 경우 브라우저에서 거절

이러한 허락을 구하고 거절하는 메커니즘은 HTTP-header를 이용해서 가능한데, 이것을 CORS(Cross-Origin Resource Sharing)이라 한다.

### cross-origin

`cross-origin`이란 다음 중 한 가지라도 다른 경우를 말한다.

1. 프로토콜

   http와 https는 프로토콜이 다르다.

2. 도메인

   domain.com과 other-domain.com은 다르다.

3. 포트 번호

   8080포트와 3000포트는 다르다.

## CORS는 왜 필요할까?

CORS가 없이 모든 곳에서 데이터를 요청할 수 있으면, 다른 사이트에서 원래 사이트를 흉내낼 수 있다.

## CORS는 어떻게 동작할까

### Simple requests인 경우

1. 서버로 요청
2. 서버의 응답이 왔을 때, 브라우저가 요청한 `Origin`과 응답한 헤더 `Access-Control-Request-Headers`의 값을 비교하여 유효한 요청이라면 리소스를 응답한다.
   만약 유효하지 않은 요청이라면 브라우저에서 이를 막고 에러가 발생한다.

#### Simple requests란?

HTTPMethod가 다음 중 하나이면서

- GET
- HEAD
- POST

자동으로 설정되는 헤더는 제외하고, 설정할 수 있는 다음 헤더들만 변경하면서

- Accpet
- Accept-Language
- Content-Language

`Content-Type`이 다음과 같은 경우

- application/x-www-form-urlencoded
- multipart/form-data
- text/plain

Simple requests라고 부른다. 이 요청은 추가적으로 확인하지 않고 바로 본 요청을 보낸다.

### preflight 요청일 경우

1. `Origin`헤더에 현재 요청하는 origin과, `Access-Control-Request-Method`헤더에 요청하는 HTTP method와 `Access-Control-Request-Headers`요청 시 사용할 헤더를 `OPTIONS` 메서드로 서버로 요청한다. 이때 내용물은 없이 헤더만 전송합니다.

2. 브라우저가 서버에서 응답한 헤더를 보고 유효한 요청인지 확인합니다. 만약 유효하지 않은 요청이라면 요청은 중단되고 에러가 발생합니다. 만약 유효한 요청이라면 원래 요청으로 보내려던 요청을 다시 요청하여 리소스를 응답받습니다.

#### preflight 요청이란?

Simple requests가 아닌 `cross-origin`요청은 모두 preflight 요청을 하게 되는데, 실제 요청을 보내는 것이 안전한지 확인하기 위해 먼저 OPTIONS 메서드를 사용하여 `cross-origin` HTTP 요청을 보냅니다. 이렇게 하는 이유는 사용자 데이터에 영향을 미칠 수 있는 요청이므로 사전에 확인 후 본 요청을 보냅니다.

## 요청 헤더 목록

- Origin
- Access-Control-Request-Method
  - preflight 요청을 할 때 실제 요청에서 어떤 메서드를 사용할 것인지 서버에게 알리기 위해 사용됩니다.
- Access-Control-Request-Headers
  - preflight요청을 할 때 실제 요청에서 어떤 header를 사용할 것인지 서버에게 알리기 위해 사용됩니다.

## 응답 헤더 목록

- Access-Control-Allow-Origin

  - 브라우저가 해당 origin이 자원에 접근할 수 있도록 허용합니다. 혹은 \*은 credentials이 없는 요청에 한해서 모든 origin에서 접근이 가능하도록 허용합니다.

- Access-Control-Expose-Headers

  - 브라우저가 액세스할 수 있는 서버 화이트리스트 헤더를 허용합니다.

- Access-Control-Max-Age

  - 얼마나 오랫동안 `preflight`요청이 캐싱 될 수 있는지를 나타낸다.

- Access-Control-Allow-Credentials

  - `Credentials`가 true 일 때 요청에 대한 응답이 노출될 수 있는지를 나타냅니다.
  - `preflight`요청에 대한 응답의 일부로 사용되는 경우 실제 자격 증명을 사용하여 실제 요청을 수행할 수 있는지를 나타냅니다.
  - 간단한 GET 요청은 `preflight`되지 않으므로 자격 증명이 있는 리소스를 요청하면 헤더가 리소스와 함께 반환되지 않으면 브라우저에서 응답을 무시하고 웹 콘텐츠로 반환하지 않습니다.

- Access-Control-Allow-Methods
  - `preflight`요청에 대한 대한 응답으로 허용되는 메서드들을 나타냅니다.
- Access-Control-Allow-Headers
  - `preflight`요청에 대한 대한 응답으로 실제 요청 시 사용할 수 있는 HTTP 헤더를 나타냅니다.

## Django 에서 설정하기

장고에서는, `django-cors-headers`라는 라이브러리를 사용할 수 있다.

```cmd
pip install django-core-headers
```

설치가 완료되면, 장고에서 설정을 해준다.

1. `INSTALLED_APPS`에 `"corsheaders"`를 추가해준다.

```python
# django > settings.py
INSTALLED_APPS = [
  'corsheaders',
]
```

2. `MIDDLEWARE`에 `"corsheaders.middleware.CorsMiddleware"`를 추가해준다.

   **단, 최대한 높은 곳에 두어야 된다.** 특히 `"django.middleware.common.CommonMiddleware"` 나 `"WhiteNoiseMiddleware"`보다 무조건 위에 있어야 된다.

```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

```

3.

## 참고자료

[CORS란 무엇인가?](https://hannut91.github.io/blogs/infra/cors)

[CORS Detail](https://coding-groot.tistory.com/91)

[Django CORS 설정](https://velog.io/@lob3767/Django-CORS-%EC%84%A4%EC%A0%95)

[django-cors-headers](https://github.com/adamchainz/django-cors-headers#cors_allow_headers-sequencestr)

[CORS 에러](https://nankisu.tistory.com/67)

# CSRF

## Cross Site Request Forgery

### CSRF란?

CSRF란 권한을 가진 사용자가 자신의 의도와 무관하게 공격자가 의도한 어떤 행위(수정, 삭제)를 하도록 유도하는 해킹 기법을 말한다.

## HTTP Methods

csrf protection은 모든 methods에 적용되는게 아니다.

> GET, HEAD, OPTIONS, TRACE

해당 HTTP methods는 안전하다고 판단이 되어 csrf 토큰이 필요하지 않는다.
다만 POST 등 위와 다른 HTTP methods의 경우 csrf 토큰이 필요하다.

## csrf token

장고는 CSRF 토큰을 쿠키(세션이 아니라)에 저장한다. 장고가 아닌 다른 프레임워크들은 일반적으로 세션에 저장한다.

csrf 인증이 필요한 요청(POST 등) 이 들어오면, header에서 `csrf token` 가 있는지 확인한다. 만약 `csrf token`이 존재하고 유효한 경우, 해당 요청이 처리된다.

## csrf token 관리하기

csrf token을 특정 도메인에만 허용해줄 수 있을까?

#### CSRF Token Generation Endpoint

1. Trusted domain에서 Get request를 보낸다.
2. 서버에서 해당 도메인을 verify한다.(check `Referer` or `Origin` header)
3. Trusted domain인 경우, `CSRF Token`을 생성 후 보내준다.

```python
from django.middleware.csrf import get_token

@api_view(['GET'])
def get_csrf_token(request):
    # Assuming you've already verified the domain with CORS settings
    csrf_token = get_token(request)
    return Response({'csrfToken': csrf_token})
```

```js
// trusted domain
const csrfToken = // Retrieved from your server
  axios.post("https://yourserver.com/api/some_endpoint/", data, {
    headers: {
      "X-CSRFToken": csrfToken,
    },
  });
```

#### Authentication

`CSRF` 대신, `API keys` 나 `OAuth token`을 사용한다. 이 방법은 특히 `server-to-server`방식에서 활용된다.

## 참고자료

[django 공식문서](https://docs.djangoproject.com/en/4.1/ref/csrf/)

[CSRF란](https://it-eldorado.tistory.com/10?category=749665)

[django는 csrf를 어떻게 방지할까](https://it-eldorado.tistory.com/141)

```js
fetch("http://localhost:8000/apiGetQuestion/", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log("Error:", error));
```

```js
fetch("http://megaclass.co.kr:8080/question/get_all/?limit=1", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log("Error:", error));
```

## COOP

[Cross-Origin Opener Policy document](https://django.readthedocs.io/en/stable/ref/middleware.html#cross-origin-opener-policy)

## 에러 처리

CORS 에러: The request client is not a secure context and the resource is in more-private address space `local`.

origin보다 더 낮은 수준의 네트워크로 요청을 보내는 경우, 위와 같은 에러 발생.
예를 들어, www.megaclass.co.kr -> http://localhost:8000/apiSomething
이 경우, 브라우저 설정에서 다음을 해제해주어야 된다. 다만 테스트가 끝나면 다시 원래대로 하자.
Chrome : [다음 링크](chrome://flags/#block-insecure-private-network-requests)에 들어가서 설정 disabled
Edge: [다음 링크](edge://flags/#block-insecure-private-network-requests)에 들어가서 설정 disabled
https://nankisu.tistory.com/67
