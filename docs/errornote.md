##### Uncaught TypeError: $(...).jConfirm is not a function

내가 만든 bookwithexcelcourse의 문제라고 생각이 된다.
bookwithexcel에 questionbook 데이터를 넣을 시 원활히 돌아갔다.
이에 questionbook데이터와 비교해보니, depth도 0으로 되어있었고, coursebook에 branchids를 넣지 않았다.


### HttpReponse에서 파일 다운이 안될 때

HttpResponse를 사용해 파일을 다운받는 경우(엑셀 등), 에러가 뜨지 않는데도 파일이 다운이 안되는 경우가 있다.
dataType을 확인해보자.
ajax의 dataType은 서버에서 어떤 타입을 받을지를 의미한다. 이것이 원하는것과 다른 파일형식인경우 다운이 안될수도 있다.   


## DevTools failed to load SourceMap: Could not load content for https://cdn.jsdelivr.net/npm/@tensorflow/tf.min.js.map: HTTP error: status code 404, net::ERR_HTTP_RESPONSE_CODE_FAILURE

https://stackoverflow.com/questions/61205390/how-can-i-fix-the-devtools-failed-to-load-sourcemap-could-not-load-content-er
개발자도구 -> 환경설정 -> Uncheck Enable JavaScript source maps/Enable CSS source map


## Uncaught DOMException: Failed to execute 'add' on 'DOMTokenList': The token provided must not be empty.
아무것도 없는 빈 요소를 classList에 add할 때 발생
```js
var el = document.createElement('i');
el.classList.add('');
```
