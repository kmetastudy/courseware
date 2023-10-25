## jwt 공식사이트

jwt를 간단히 발급받을 수 있다.

> https://jwt.io/

## jwt 토큰 인증이란? (쿠키 vs 세션 vs 토큰)

> https://inpa.tistory.com/entry/WEB-%F0%9F%93%9A-JWTjson-web-token-%EB%9E%80-%F0%9F%92%AF-%EC%A0%95%EB%A6%AC

## Access Token & Refresh Token 원리

> https://inpa.tistory.com/entry/WEB-%F0%9F%93%9A-Access-Token-Refresh-Token-%EC%9B%90%EB%A6%AC-feat-JWT

## pyjwt 공식문서

> https://pyjwt.readthedocs.io/en/stable/usage.html

## HS256 vs RS256

pyjwt는 다양한 암호화 알고리즘을 제공한다.
사용가능한 알고리즘의 종류는 다음에서 확인이 가능하다.

> https://pyjwt.readthedocs.io/en/stable/algorithms.html

이중 default이며 많이 쓰이는 알고리즘은 `HS256`이다.

그런데 APPLE의 경우 Apple 로그인을 사용하려면, `RS256` 알고리즘으로 서명해야한다.

이 차이는 뭘까?

> https://hwannny.tistory.com/72

## Refresh Token은 왜 사용해되고, 어디에 저장할까?

> https://medium.com/@uk960214/refresh-token-%EB%8F%84%EC%9E%85%EA%B8%B0-f12-dd79de9fb0f0

> https://stackoverflow.com/questions/32060478/is-a-refresh-token-really-necessary-when-using-jwt-token-authentication

## Access Token을 private 변수로, refresh token을 Cookie로?

> https://pomo0703.tistory.com/213

## IP도 검증하고 싶으면?

https://pomo0703.tistory.com/213

## 토큰은 보통 어디에 보관하나요?

https://www.inflearn.com/questions/217547/jwt-%ED%86%A0%ED%81%B0%EC%9D%80-%EB%B3%B4%ED%86%B5-%EC%96%B4%EB%94%94%EC%97%90%EC%84%9C-%EB%B3%B4%EA%B4%80%EC%9D%84-%ED%95%98%EB%82%98%EC%9A%94

일반적으로 많은 사람들이, local storage에는 보관하면 안된다고 한다.
근데 댓글 중 한 사람은, 별 차이 없고, 일반적인 악성 코드의 경우 Local storage가 더 안전할 거라고 한다.
그리고 차라리 session을 추천한다고 한다.
이 사람이 근거로 제시한 자료들을 읽어보자.

## Cookie-based JWT token refresh: is a separate call to the `/refresh` API endpoint really necessary?

https://stackoverflow.com/questions/74709580/cookie-based-jwt-token-refresh-is-a-separate-call-to-the-refresh-api-endpoin

## Why not store JWT access token in memory and refresh token in cookie?

jwt token을 어디에 저장하는지에 대한, 다양한 의견의 링크가 있다
링크는 유용하지만, 사실 정답은 여기도 안나와있다.

https://stackoverflow.com/questions/70303752/why-not-store-jwt-access-token-in-memory-and-refresh-token-in-cookie

## LocalStorage vs Cookies: All You Need To Know About Storing JWT Tokens Securely in The Front-End

https://dev.to/cotter/localstorage-vs-cookies-all-you-need-to-know-about-storing-jwt-tokens-securely-in-the-front-end-15id
