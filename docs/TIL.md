# Today I Learned

## django 원하는 데이터 가져오기

```python
model_obj = list(mymodel.objects.filter(id=myid).values('id', 'title'))
newid = model_obj[0]['id']
```

## django array post로 받는 법

```python
title = request.POST.get('myarr')[0].split(',') #['1,2,3,4,5,10']
title = [int(i) for i in title]
```

서버에서 데이터를 받을 때, 리스트 형식은 split(',')형태로 한다.
이 때 문자열 속 ,도 split되기에, 이를 미리 다른 형태로 치환해준다.

```javascript
let myArr = ["안녕,내이름은", "자스", "입니다."];
let relacedArr = [];
var regex = /,/gi;
for (var i = 0; i < myArr.length; i++) {
  replacedArr.push(myArr[i].replace(regex, "$")); // arr요소(문자열) 속 ,를 $로 치환.
}
```

## 비동기함수

비동기처리란 호출부에서 실행 결과를 기다리지 않는 함수이다.
대표적으로 다음과 같은 setTimeout()이라는 함수가 있다

```javascript
function findUerID(id) {
  let user;
  setTiemout(function () {
    console.log("waited 0.1sec");
    user = {
      id: id,
      name: "User" + id,
      email: id + "@test.com",
    };
  }, 100);
  return user;
}
const user = findUser(1);
consoloe.log("user:", user);
```

위 코드의 경우 setTimeout()은 비동기 함수의 호출이다. 따라서 기다리지않고 그대로 return user을 해버림. 이런 경우 callback으로 해결이 가능하다.

```javascript
function findUserAndCallBack(id, cb) {
  setTimeout(function () {
    console.log("waiter 0.1 sec.");
    const user = {
      id: id,
      name: "User" + id,
      email: id + "@test.com",
    };
    cb(user);
  }, 100);
}

findUserAndCallBack(1, function (user) {
  console.log("user", user);
});
```

위와 같이 실행하고자 하는 함수를 비동기함수의 callback으로 넣어주면 된다.
하지만 이러한 방식은 코드가 복잡해질수록 코드의 가독성을 심하게 해친다.
이러한 이유로 최근에는 Promise나 async/await로 대체되고있다.

## Promise

얻는데 딜레이가 있는 데이터에 접근하기 위한 방법을 제공.
findUser(1).then(function (user) {
console.log("user"W)
})

## JQuery를 사용해 데이터 장고로 보내기

- ojbect의 경우 다음과 같이 하자
  자바스크립트: JSON.stringify 처리
  장고: json.loads 처리

자바스크립트 코드

```js
var arraydic = {'a': [1,2,3], 'b': [2,5,6]}
var testint = 24;
var teststr = 'hi';

var dic = JSON.stringify(arraydata);
var data = {
  "arraydata": arraydata,
  "int": testint,
  "str": teststr,
}

var url = 'test/'
$.ajax({
  url: url,
  type: 'POST',
  headers: {"X-CSRFTOKEN": csrftoken},
  data: data,
  cache; false,
  dataType: 'json',
  success: function() {
    console.log('done')
  },
  error: function() {
    console.log('error')
  }
})
```

장고 코드(views.py)

```python
import json
from django.http import JsonResponse

def test(request):
  data = request.POST.get("arraydata")
  data = json.loads(data)
  integer = request.POST.get("int")
  string = request.POST.get("str")
  return JsonResponse("message":"test complete")
```

## uuid to string

1. uuid -> string

```python
test_id = testModel.objects.all()[0].id
string_id = str(test_id.hex)
```

2. string->uuid

```python
import uuid
test_id = testModel.objects.all()[0].id
string_id = str(test_id.hex)

uuid_id = uuid.UUID(string_id)
print(test_id==uuid_id) #True
```

## Ajax에서의 ContentType, DataType

contentType : 보내는 데이터의 타입
dataType : 서버에서 받을 데이터의 타입

## try/except문

## 자바스크립트로 css root의 변수 바꾸기

https://stackoverflow.com/questions/37801882/how-to-change-css-root-color-variables-in-javascript

```javascript
document.documentElement.style.setProperty("--your-variable", "#YOURCOLOR");
```

## ckeditor5 online builder -> 빌드하기

1. online builder 에서 원하는 옵션을 선택한 후 zip file을 설치한다.
2. 압축해제를 한 후, 원하는 경로에 넣는다(Project폴더가 좋은듯?)
3. 해당 폴더의 경로로 들어가, 터미널을 실행하고, npm install 을 하여 해당 패키지가 필요한 것들을 설치
4. 마지막으로, 사용하는 폴더(megaTest) 경로로 들어가 다음과 같이 설치한다.

```
(myvenv) sonhanjong@sonhanjong-ui-MacBookPro megaTest % npm install ./ckeditor-customed/
```

해당 폴더의 package.json 파일을 보고, 설치를 해주는 것이다. (설치된 패키지의 이름은 package.json 파일의 name이다.)(현재 name은 ckeditor-custom-build)
마지막으로 node_modules에 위 name과 일치하는 패키지가 있는지 확인하고, 파일이 동일하게 들어가있는지 확인한다.

자바스크립트에서는 다음과 같이 사용하면 된다.

```javascript
import Editor from "ckeditor5-custom-build";
```

## local에서 pacakge 빌드후 local 프로젝트에서 사용하기(without installation to node_modules)(npm link)

https://itchallenger.tistory.com/852

위 방법의 경우 프로젝트에 설치를 한다. 이 경우 프로젝트의 node_modules에 파일들이 커지고 하면 deploy를 진행시 속도저하 등의 불편함이 야기될 수 있다. 이를 방지하기 위한 방법은 위와 같다.

패키지의 이름이 my-package라 가정하자. 이 경우, 다음과 같이 진행하면 된다.

```
npm link # in package's root
```

```
npm link my-package # in local projects' root

```

npm link는 리눅스의 symbolic link과 비슷한 개념인데, 바로가기와 비슷한(같은건 아님)느낌이다.
**결론적으로, 이 방법은 쓰지 말자!**

## dist에 패키지 넣어 관리하기!

1. dist 폴더를 만든다(megaTest/dist)
2. 장고가 인식 가능하도록 staticdirs를 추가해준다

```python
# python
os.path.join(BASE_DIR, 'dist/static')
```

3. 패키지의 package.json을 보자. 거기에 있는 파일을 dist 폴더에 넣으면 된다(필요하다면 css파일 등도)

## 자바스크립트에서 불리언 결과가 false로 간주되는 것들

undefined, null
NaN
0(숫자 리터럴), -0
"" (단, 빈 배열, 빈 객체는 true로 간주한다.)
false

## 데이터프레임을 리스트로 변경해 자바스크립트로 보내기

```python
request.FILES['file']
file = excelFile.read()
df = pd.read_excel(file)
df = df.replace({np.nan:None})
return df.values.tolist()
```

장고와 클라이언트는 기본적으로 json을 통해 데이터를 교환한다.
이 때, json에서는 NaN은 유효한 타입이 아니기 때문에, 전송하는 데이터에 NaN타입의 값이 있는 경우 전송이 불가하다.

이 경우, NaN타입을 유효한 값으로 바꾸는것이 좋다.
None 타입은 json에서 유효하며, 자바스크립트로 전송되는 경우 null값으로 변환된다.
따라서 장고에서 자바스크립트로 보내는 데이터에 NaN값이 있는 경우, None타입으로 변환 후 전송해야한다.

참고: https://stackoverflow.com/questions/66760733/change-nan-to-none-in-pandas-dataframe

## 비동기 반복 제어

비동기 처리를 반복적으로 처리하면서, 이것의 처리 순서를 보장하고 싶을 때가 있다.
그런 경우, async await를 사용할 수 있다.

```js
async function fetchData(id, depth) {
  // 데이터를 비동기적으로 가져오는 Ajax 요청 예시 (여기에서는 Promise 사용)
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "your_api_url",
      data: { id: id },
      // ... Ajax 설정
      success: function (res) {
        resolve(res);
      },
      error: function (err) {
        reject(err);
      },
    });
  });
}

async function fetchTreeData(id, depth) {
  if (depth === 0) {
    return; // 종료 조건
  }

  try {
    const parentData = await fetchData(id); // 부모 데이터 가져오기
    console.log(`부모 데이터: ${parentData}`);

    if (parentData.branch_ids) {
      for (const childId of parentData.branch_ids) {
        const childData = await fetchData(childId); // 자식 데이터 가져오기
        console.log(`자식 데이터: ${childData}`);

        if (childData.branch_ids) {
          for (const grandchildId of childData.branch_ids) {
            const grandchildData = await fetchData(grandchildId); // 손자 데이터 가져오기
            console.log(`손자 데이터: ${grandchildData}`);
          }
        }
      }
    }

    // 재귀적으로 다음 depth의 데이터를 가져옵니다.
    for (const childId of parentData.branch_ids) {
      await fetchTreeData(childId, depth - 1);
    }
  } catch (err) {
    console.error("오류 발생:", err);
  }
}

const rootId = "root"; // 루트 데이터의 ID
const depth = 3; // 트리의 깊이

fetchTreeData(rootId, depth)
  .then(() => {
    console.log("모든 데이터 요청 완료");
  })
  .catch((err) => {
    console.error("오류 발생:", err);
  });
```

재귀적인 방법을 통해 비동기 처리의 반복 제어도 가능하다. 하지만 이의 경우, call stack overflow, 지연 및 성능 문제, 동시성 문제 등의 문제들을 유발할 수 있다.
따라서 위와 같이 async/await를 사용하는것이 좋다고 생각이 된다.

다만 await를 여러개 사용할 때, 동기적처리가 필요하지 않은 경우가 있다. 이런 경우, 다음과 같이 병렬 처리를 해주자.

```js
async function getInfo() {
  // 1. 동기처리가 필요할 때
  let parent = await getParent();
  let child = await getChild(parent.childId);

  // 2. 동기처리가 필요 없을 때 -> 병렬처리
  let [child1, child2] = await Promise.all([getChild(id1), getChild(id2)]);
}

getInfo();
```

참고 : <https://inpa.tistory.com/entry/JS-%F0%9F%93%9A-%EB%B9%84%EB%8F%99%EA%B8%B0%EC%B2%98%EB%A6%AC-async-await>

## requestAnimationFrame

setTimeout 대신 requestAnimationFrame를 사용하는게 좋다.

```js
const elThis = document.createElement("div");
window.requestAnimationFrame(() => {
  console.log(elThis.offsetLeft);
});
```

위와 같이, 돔이 렌더되기 전에 사용하기 유용하다. 물론 setTimeout도 가능하긴하다.
https://velog.io/@wejaan/setTimeout%EA%B3%BC-requestAnimationFrame

### typeof Array

array에 typeof를 작성하면, object가 나온다.
따라서, 이를 제대로 확인하기 위해선 다음과 같이 하면 된다.

```js
const arr = [1, 2, 3];
Array.isArray(arr) === true; // true;
```

### Django exists()

```python
targets = SomeModel.objects.filter(id='some_id')
if not targets.exists():
    emptyResult = {}
    return JsonResponse({"message": "No Data", "result": emptyResult}, status=200)

```

기존에는 `len(targets)==0`을 사용했는데,그것보다는 `some_queryset.exists()`를 사용하자.

## Python mutable

object, array, set은 mutable요소다.
따라서, 변이를 막기 위해선 copy를 해야된다.

```python
# shallow copy
original_dict = {'a': 1, 'b': 2, 'c': 3}
new_dict = original_dict.copy()

original_dict = {'a': 1, 'b': 2, 'c': 3}
new_dict = {**original_dict}

original_dict = {'a': 1, 'b': 2, 'c': 3}
new_dict = dict(original_dict)

# deep copy
import copy

original_dict = {'a': 1, 'b': {'nested_key': 2}, 'c': 3}
new_dict = copy.deepcopy(original_dict)

```

## uuid to string

1. uuid -> string

```python
test_id = testModel.objects.all()[0].id
string_id = str(test_id.hex)
```

2. string->uuid

```python
import uuid
test_id = testModel.objects.all()[0].id
string_id = str(test_id.hex)

uuid_id = uuid.UUID(string_id)
print(test_id==uuid_id) #True
```

## typing

파이썬에서, type의 힌트를 주고 싶은 경우, `typing`을 사용할 수 있다.

```python
from typing import Type, Dict, Any

def typingFunc(param1: Type[models.Model], data: Dict[str, Any]) -> Dict[str, Any]:
  return
```

## setattr/getattr

## decorator

## HTTP Status Code

200 OK: Standard response for successful GET, PUT, PATCH requests.
201 Created: The request has been fulfilled and has resulted in one or more new resources being created.
204 No Content: The server successfully processed the request and is not returning any content.
400 Bad Request: The server could not understand the request due to invalid syntax.
401 Unauthorized: Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated".
403 Forbidden: The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource.
404 Not Found: The server can not find the requested resource.
405 Method Not Allowed: The request method is known by the server but has been disabled and cannot be used.
500 Internal Server Error: An error on the server prevented the request from being fulfilled.

## event.target, event.currentTarget

특정 event가 자신의 것인지, 혹은 자식으로부터 bubbling된것인지 알기 위해서는, event.target===event.currentTarget을 사용하면 된다.

```js
// Create parent and child elements
const parent = document.createElement("div");
const child = document.createElement("div");

parent.appendChild(child);

parent.addEventListener("click", function (event) {
  if (event.target === event.currentTarget) {
    console.log("Event originated from parent element.");
  } else {
    console.log("Event is bubbling from child element.");
  }
});

document.body.appendChild(parent);
```

## django filter

특정 조건이 아닌 query

```python
query = myModel.objects.exclude(tag=None)
```

## preventDefault vs stopPropagation

#### preventDefault

`a`태그나 `submit`태그 등, 고유의 동작이 있는 HTML 요소들이 있다. 이러한 요소들의 고유한 동작을 중단시킨다.

#### stopPropagation

이벤트가 상위 엘리먼트에 전달되는것을 막아준다.

## Blur event stops click event.

https://stackoverflow.com/questions/9335325/blur-event-stops-click-event-from-working

https://coffeeandcakeandnewjeong.tistory.com/70

## 반복적인 async/await

https://tecoble.techcourse.co.kr/post/2020-09-01-loop-async/

## css tabindex

`tabindex`는 tab키를 사용해서, 특정 요소를 포커스함.

`tabindex="-1"`의 경우, 연속으로 tab을 누를 때 접근이 안되지만, javascript나 마우스 클릭 등으로는 포커스가 가능하다.
https://developer.mozilla.org/ko/docs/Web/HTML/Global_attributes/tabindex

# 장고의 CSRFTOKEN은 노출되어도 괜찮을까?

장고에서 `CSRFToken`값을 가져오는 방식은 다음과 같다.

### 방법1. template engine & global variable

```html
<script>
  var csrftoken = "{{csrf_token}}";
</script>
```

이 경우, console창에 csrftoken을 입력하면 해당 값을 얻을 수 있다.

### 방법2. template engine

```html
<script>
  window.addEventListener("DOMContentLoaded", function () {
    stlibrary.st_run("{{csrf_token}}");
  });
</script>
```

전역변수로 노출되지는 않는다. 하지만, 개발자도구에서 요소를 보면, 마찬가지로 값이 그대로 노출된다.

### 방법3. COOKIE

노출되지 않게 하려면, 다음과 같이 cookie에서 받아올 수도 있다.

> 단, 이 때는 장고의 설정에 `CSRF_USE_SESSIONS`와 `CSRF_COOKIE_HTTPONLY`가 모두 False여야된다.
>
> 다만 이것은 장고의 default 값이므로, 특별히 변경하지 않은 경우 아래의 코드가 작동한다.

```js
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  console.log("token : ", cookieValue);
  return cookieValue;
}

const csrf_token = getCookie("csrftoken");
```

## 문제점 및 결론

COOKIE에서 가져온다는 것은, 단순히 개발자도구에 같은 코드를 작성해도, 사용자는 해당 값을 가져올 수 있다는 것이다.

결론적으로, 방법1이나 2를 채용하기로 했다. 그 이유는 다음과 같다.

### 1. 노출돼도 크게 문제가 없다.

CSRF TOKEN은, 단순히 client와 서버가 일시적으로 사용하는 값이고, 또 사용자의 세션에 연결돼있으며 만료시간도 있다.

또, CSRF TOKEN은 사용자의 쿠키나 세션 정보 없이 해당 토큰을 악용할 수 없다.

자세한 내용은 공식문서를 참고하자.

### 2. BREACH attacks 방지

template에서 불러온 csrf token(방법1, 방법2)의 값과, cookie에서 불러온 csrf token(방법3)의 값을 출력해보면, 다른것을 알 수 있다.

이것은 template의 경우 `masked token`형식이며, cookie에는 표준적인 `unmasked token`형식이 저장돼있기 떄문이다. 즉 엄연히 다른 값이다.

물론 장고의 `CsrfViewMiddleware`은 두 값 모두 수용하기에 어떤 것을 사용해도 작동한다.

다만, BREACH 공격을 막기 위해서는, masked token을 사용하라고 권장하고 있다.

### 참고

https://docs.djangoproject.com/en/4.2/howto/csrf/#

https://www.reddit.com/r/django/comments/y2fxc6/why_django_keeps_csrf_token_in_cookies/

https://stackoverflow.com/questions/23349883/how-to-pass-csrf-token-to-javascript-file-in-django

## CharField vs TextField

Charfield

- type: varchar
- 최대 길이를 명시하고 사용한다. 최적화와 저장 공간에 더 효율적

TextField

- type: text
- 최대 길이가 DB schema에 의해 지정되지 않는다.

View가 Field를 어떻게 다룰것인지가 중요하다.
generic edit view에서 `TextField`는 다중 행 크기 조정 가능한 입력으로 렌더링된다.
`CharField`는 단일 라인 입력으로 렌더링된다.

https://stackoverflow.com/questions/7354588/whats-the-difference-between-charfield-and-textfield-in-django

## Element pretend

자식 element를 부모 element에 붙이는 경우, `appendChild`를 사용한다. 이 때, 자식 element는 부모요소의 자식들 중, 가장 마지막 자식이 된다.

만약, 새로운 자식 element를, 부모요소의 **첫 번째** 자식으로 집어넣고 싶으면 어떻게 하면 될까?

#### 1. Element.insertBefore

> `insertBefore(newNode, referenceNode)`

`insertBefore`은 자식 요소를, 원하는 위치에 집어넣을 수 있다는 장점이 있다.
이 경우 첫 번째로 집어넣기에, referenceNode를 `firstChild`로 둔다.

```js
let parent;
let newChild;

parent.insertBefore(newChild, parent.firstChild);
```

#### 2. prepend

```js
prepend(param1);
prepend(param1, param2);
prepend(param1, param2, /* ..., */ paramN);
```

`Element.prepend()`는, `Node` 객체나 `String`객체를, `Element`의 첫 번째 자식으로 집어넣는다.

```js
let parent;
let newChild;

parent.prepend(newChild);
```

prepend의 특징은 다음과 같다.

> append도 마찬가지다. appendChild와 비교하면 된다.

1. 여러개의 value나, 혹은 spred operator `...`를 전달할 수 있다.
2. `String` 값 또한 삽입 가능하다. 이 때, 이것은 text Element로 처리된다

```js
parent.prepend(newChild, "foo"); // [newChild, "foo", child1, child2]

const list = ["bar", newChild];
parent.append(...list, "fizz"); // [child1, child2, "bar", newChild, "fizz"]
```

**주의**

1. undefined나 null등, `Node`객체가 아닌 요소들은 모두 "string"으로 간주되는거같다. 이를 유의하자.
2. text를 여러개 삽입하고 `parent.textContent`를 보면 text들이 합쳐진 모습이다. 그런데, `childNodes`에는 각 text들이 들어간다(1개가 아니라)

```js
const parent = document.createElement("div");
document.body.appendChild(parent);

let child1, child2, child3, child4;

child1 = document.createElement("span");

child2 = "child2";

child3 = document.createElement("span");

child4 = "child4";

parent.append(child1, child2, child3, child4);

console.log(parent); //<div></div><span></span>child2<span></span>child4</div>
console.log(parent.textContent.length); // 12
console.log(parent.childNodes); // [span, #text, span, #text]
```

**Ref**

1. [Read More](https://stackoverflow.com/questions/5173545/using-javascripts-insertbefore-to-insert-item-as-last-child/45656649#45656649) - `child.before` and `child.after`
2. [Read More](https://stackoverflow.com/questions/843680/how-to-replace-dom-element-in-place-using-javascript/40444300#40444300) - `child.replaceWith`

[Mozilla Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Element/prepend)

[Can I Use](https://caniuse.com/dom-manip-convenience)

## TODO

비구조 할당
map vs forEach?

## 파이썬 update

파이썬은 dictionary를 update할 수 있다.

```python
info = {
  'name': 'user',
  'gender': 'female',
  'age': 20,
}

new_info = {
  'age': 24,
  'hobby': 'piano',
  'height': 170,
  'hasCar': True
}

info.update(new_info)

```

## migration 삭제하기

장고의 migration 파일과, database의 django_migrations 데이터 모두 삭제해야된다.
원하는 app의 이름이 `myapp`라고 하자.

1. 일단 대기중인 migration이 있는 경우, 적용

```shell
python manage.py makemigrations
```

다음 메시지가 나온다면, 다음 단계로 넘어가자.

```shell
No changes detected
```

2. 원하는 앱에서 마이그레이션 기록 삭제
   먼저, migration 기록을 확인

```shell
python manage.py showmigrations
```

그 후, 원하는 기록 삭제
`myapp`의 app 기록을 삭제한다고 하면 다음과 같이 한다.

```zsh
python manage.py migrate --fake myapp zero
```

3. 마이그레이션 파일 삭제.
   `myapp`의 migration 폴더를 열고, `__init__.py`파일을 제외한 모든 파일 삭제

4. 첫 마이그레이션을 생성.

```bash
python manage.py makemigrations
```

database가 이미 존재하기 때문에, 첫 마이그래이션을 migrate하는 대신, fake migrate

```bash
python manage.py migrate --fake _myapp
```
