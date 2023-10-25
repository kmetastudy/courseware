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
