## DRF로 소셜 로그인 API 구현해보기(Google, KaKao, Github)

> https://velog.io/@heyoni/Django-Rest-Framework-%EC%86%8C%EC%85%9C%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-google-naver-kakao-github

- drf-simplejwt를 사용하긴 했지만, 원리는 비슷.

- dj-rest-auth 사용

- [django-allauth](https://docs.allauth.org/en/latest/socialaccount/providers/index.html) 사용
  (google, kakao, facebook, naver 다 지원)

## 라이브러리 안쓰고 카카오 로그인 구현하기

Serializer만 사용하고, 과정도 잘 나와있다.
https://sxxk2.tistory.com/20

## django-allauth 소셜 로그인 구현 원리(OAuth 2.0기반)

말 그대로, 원리가 잘 나와있다.
https://it-eldorado.tistory.com/139
현재 대부분 소셜 로그인이 OAuth 2.0 기반인거같다.

## OAuth 2.0 동작 방식의 이해

https://blog.naver.com/mds_datasecurity/222182943542

---

## 카카오 로그인

https://velog.io/@junsikchoi/Django%EB%A1%9C-%EC%B9%B4%EC%B9%B4%EC%98%A4-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8%EC%9D%84-%ED%95%B4%EB%B3%B4%EC%9E%90

### 카카오 로그인 시 비즈앱

로그인 시 user가 동의를 한 항목만 가져올 수 있다.
그런데, 이건 기본적으로 nickname등만 가져올 수 있다.
email등을 가져오려면 비즈앱 등록을 해야된다.

원래는 사업자 등록을 해야되는데, 개인 개발자는 다음과 따로 신청이 가능하다.
다만 이 방법으론 이름 등은 못가져온다.(설정을 잘못 한걸수도 있다.)

> https://devtalk.kakao.com/t/how-can-i-switch-to-a-biz-app-if-i-do-not-have-any-business-registration-number/71983

## result

email과 nickname은 다음으로 가져온다.

```
kakao_account : {
  profile: {
    nickname: "MyNickName"
  },
  email: "my_email@domain.com
}
```

## 네이버 로그인

네이버는 실사용하기 위해서는 검수를 받아야된다.
그 전까지는, 내가 임의로 테스터 ID를 등록해서 그 아이디로만 해야된다.

그냥 내 실제 네이버 아이디로 하면, token발급까지는 되는데, 유저정보를 불러올 때 error가 난다.
024 에러는 인증 실패 오류로, 아마 여기선 내 실제 ID는 테스터 ID가 아니라, 유효하지 않은 토큰으로 인지하나보다.

> 에러 코드 종류
> https://developers.naver.com/docs/login/api/api.md#5--%EC%97%90%EB%9F%AC-%EC%BD%94%EB%93%9C

```json
{
  "user_info": {
    "resultcode": "024",
    "message": "Authentication failed (\uc778\uc99d \uc2e4\ud328\ud558\uc600\uc2b5\ub2c8\ub2e4.)"
  }
}
```

## 구글 로그인 ([Google OAuth2 API, v2](https://developers.google.com/identity/protocols/oauth2/web-server?hl=ko))

### 구글 API 초기 설정

https://velog.io/@nuri00/Google-OAuth-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EA%B5%AC%ED%98%84

## [scope란?](https://developers.google.com/identity/protocols/oauth2/scopes?hl=ko#oauth2)

내가 GOOGLE에게 요청할 사용자 정보의 범위이다. 로그인 API는 범위가 다음과 같다.

1. email

- https://www.googleapis.com/auth/userinfo.email
- 기본 Google 계정 이메일 주소

2. profile

- https://www.googleapis.com/auth/userinfo.profile
- 개인정보(공개로 설정한 개인정보 전부 포함) 보기
- family name 등 이름 관련된 정보가 나오는데, 유저가 비공개로 설정을 해놨다면 받아올 수 없다.

3. OpenID

- OpenID
- Google에서 내 개인정보를 나와 연결

## 파라미터 등 정리

https://velog.io/@usreon/google-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%82%BD%EC%A7%88-%EA%B3%BC%EC%A0%95
