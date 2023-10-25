1. handler / event
   handler : 대략적 정보 + 함수의 행동 + handler
   ex) qEditorSaveHandler
   ex) unitCardShowHanlder

event : on 이벤트 + Event
ex) onSaveBtnClickEvent?

2. url

- url + CRUD(+get) + target
- urlCreateUnit
- urlDeleteQuestion
- urlGetUnit

3. 파일 이름 (Compositional Layout)
   reference: https://developer.apple.com/documentation/uikit/uicollectionviewcompositionallayout

App / Section / Group / item

App

- Application
- AppCp, AppSt

Section

- Application 내부의 영역(특정 역할을 하는 영역)
- Section + Appname + 역할
- SectionCpDisplay, SectionCpEdit

Group

- Section 내부의 item의 레이아웃을 위해 만든 개념
- Group+item역할
- GroupQuestionEditor, GroupUnit

Item

- 모듈
- mtmButton

4. 폴더 구조
   reference: https://ahnheejong.name/articles/package-structure-with-the-principal-of-locality-in-mind/

지역성의 원칙을 준수하며 하자
도메인에 따라 코드를 두자.

5. Extra

- handler, API, URL을 구별지어둔다
- 언더바(\_)가 쳐진 함수는 내부에서만 작동하는 함수이다(\_init)

컴포넌트는

1. Headless 기반의 추상화하기
   변하는것 vs 상대적으로 변하지 않는 것

2. 한 가지 역할만 하기
   또는 한 가지 역할만 하는 컴포넌트의 조합으로 구성하기

3. 도메인 분리하기
   도메인을 포함하는 컴포넌트와 그렇지 않은 컴포넌트 분리하기

컴포넌트는
데이터관리(외부, 내부), 데이터가 사용자에게 어떻게 보여줄 지 정의(UI), 어떻게 사용자와 상호작용할지

https://github.com/kettanaito/naming-cheatsheet

https://github.com/ryanmcdermott/clean-code-javascript
(한글버전 : https://github.com/qkraudghgh/clean-code-javascript-ko)

<!-- Naming -->

[Clean Code JavaScript]: This guide includes some naming convention advice alongside many other coding practices inspired by Robert C. Martin's book "Clean Code."

[Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
JavaScript Naming Conventions: This article goes into detail about naming variables, functions, and more, providing specific examples.

[JavaScript Naming Conventions](https://www.robinwieruch.de/javascript-naming-conventions/)
w3schools JavaScript Coding Conventions: A simple guide to basic naming and styling conventions, including some examples of function and variable naming.

[w3schools JavaScript Coding Conventions](https://www.w3schools.com/js/js_conventions.asp)
Microsoft's Best Practices for Naming: Although not specific to JavaScript, Microsoft's naming guidelines provide some general advice that might be applied to any programming language.

[Microsoft Naming Guidelines](https://jstherightway.org/#naming-conventions)
JavaScript The Right Way: This guide gives a brief overview of conventions, including naming, that are commonly used in JavaScript.

JavaScript The Right Way

# Convention

## Naming

### Array & Objects

Array의 경우, "property"의 복수형으로 붙이자.
Object의 경우, "property" + "Attributes" 형태로 하자. 단, 해당 방법이 적합하지 않는 경우, 다른 작명도 사용하자. 다만, "property"의 복수형으로는 붙이지 말자.

```js
const validNumbers = [1, 2, 3];
const styleAttributes = {
  color: red,
  display: flex,
};
```

### UnderScore

내부에서만 사용되어야 하는 함수의 경우, underbar를 붙이자. 외부에서 사용가능한 함수(e.g. setData, getData)는 붙이지 말자.

### Actions

##### remove

Removes something **from** somewhere

```js
function removeFilter(filterName, filters) {
  return filters.filter((name) => name !== filterName);
}

const selectedFilters = ["price", "availability", "size"];
removeFilter("price", selectedFilters);
```

##### delete

Completely erases something from the realms of existence

```js
function deletePost(id) {
  return database.find({ id }).delete();
}
```

## remove/delete

반대의 의미를 가진 add/create를 생각하면 된다.

> add : 어디로 추가 (ex. 데이터를 배열에 추가)  
> remove : 어디로부터 제거 (ex. 데이터를 배열에서 삭제)
>
> create: 생성 (ex. 데이터 생성)  
> delete: 삭제 (ex. 데이터 완전히 삭제)

### Prefixes

##### is

Describes a characteristic or state of the current context (usually boolean).

```js
const color = "blue";
const isBlue = color === "blue"; // characteristic
const isPresent = true; // state

if (isBlue && isPresent) {
  console.log("Blue is present!");
}
```

##### has

Describes whether the current context possesses a certain value or state (usually boolean).

```js
/* Bad */
const isProductsExist = productsCount > 0;
const areProductsPresent = productsCount > 0;

/* Good */
const hasProducts = productsCount > 0;
```

##### should

Reflects a positive conditional statement (usually boolean) coupled with a certain action.

```js
function shouldUpdateUrl(url, expectedUrl) {
  return url !== expectedUrl;
}
```

##### min/max

Represents a minimum or maximum value. Used when describing boundaries or limits.

```js
/**
 * Renders a random amount of posts within
 * the given min/max boundaries.
 */
function renderPosts(posts, minPosts, maxPosts) {
  return posts.slice(0, randomBetween(minPosts, maxPosts));
}
```

##### prev/next

Indicate the previous or the next state of a variable in the current context. Used when describing state transitions.

```js
async function getPosts() {
  const prevPosts = this.state.posts;

  const latestPosts = await fetch("...");
  const nextPosts = concat(prevPosts, latestPosts);

  this.setState({ posts: nextPosts });
}
```

#### compose

compose
기존의 데이터로부터 새로운 데이터 생성 (string, objects, or functions)

```js
function composePageUrl(pageName, pageId) {
  return pageName.toLowerCase() + "-" + pageId;
}
```

- 참조 링크
  > https://github.com/kettanaito/naming-cheatsheet#prefixes

### Events

##### Handler

참조링크 https://stackoverflow.com/questions/60048249/what-is-the-right-name-of-event-handler-onclick-or-handleclick

<!-- Handler의 경우, "on" + "event" + "Handler" 형태로 한다. -->
<!-- callback의 경우, "on" + "event" + "Callback" 형태로 한다. -->

Handler의 경우, "handle" + "이벤트대상" + "이벤트종류" 형태로 한다.
callback의 경우, "on" + "이벤트 발생 위치" + "이벤트대상" + "이벤트종류" 형태로 한다.

```js
// Parent > Child
// child.js
export const Child = function (options = {}) {
  this.options = options;

  const buttonElement = document.createElement("button");
  buttonElement.addEventListener("click", this.handleButtonClick.bind(this));

  const linkElement = document.createElement("a");
  linkElement.addEventListener("click", this.handleLinkClick.bind(this));
};

Child.prototype.handleButtonClick = function () {
  console.log("button click");
  if (this.options.onChildButtonClick) {
    this.options.onChildButtonClick("button-click-method");
  }
};

Child.prototype.handleLinkClick = function () {
  console.log("link click");
  if (this.options.onChildLinkClick) {
    this.options.onChildLinkClick("link-click-method");
  }
};

// parent.js
import { Child } from "../path/child";

export const Parent = function () {
  const options = {
    onChildButtonClick: this.handleChildButtonClick.bind(this),
    onChildLinkClick: this.handleChildLinkClick.bind(this),
  };
  this.child = new Child(options);
};

Parent.prototype.handleChildButtonClick = function (methodName) {
  console.log("Child button was clicked, calling method:", methodName);
};

Parent.prototype.handleChildLinkClick = function (methodName) {
  console.log("Child link was clicked, calling method:", methodName);
};
```

##### api

API의 결과(data)를 부모로 전달해주는 경우, 다음 형식으로 하자.(이건 아직 미정)

```js
questionEditor.prototype.createQuestion = async function () {
  const createdQuestionData = await apiCreateQuestion();
  if (this.options.onQuestionCreated) {
    this.options.onQuestionCreated(createdQuestionData);
  }
};
```

이렇게 하면 부모가 볼 때, 문제가 생성됐구나 알 수 있지 않을까?

### Axios

#### POST

우선, POST를 사용하는 경우는, formData를 사용하든, request.body를 사용하고 encoding 한다.
배열과 객체를 보내고 받는건 다음과 같다.

```js
const arr = [1, 2, 3];
const obj = { title: "sample", num: 1 };
const formData = new FormData();
formData.append("arrayData", arr);
formData.append("data", JSON.stringify(obj));
formData.append("stringData", "This is a string");
formData.append("integerData", 42);
```

```python
...
from django.http import JsonResponse
import json

def createQuestion(request):
    if request.method == 'POST':
        arr = request.POST.get('arrayData')  # This will be the string "1,2,3"
        arr_list = [int(x) for x in arr.split(',')]  # This converts it to a list [1, 2, 3]

        obj = json.loads(request.POST.get('data'))  # This will be the dictionary {'title': 'sample', 'num': 1}
        stringData = request.POST.get('stringData') # This will be "This is a string"
        integerData = int(request.POST.get('integerData')) # This converts it to a integer
        # Your logic here

        return JsonResponse({'status': 'success'})

    return JsonResponse({'status': 'error'}, status=400)
```

이와 같이 전처리 없이 FormData로 POST하는 경우, 모든 것들이 "toString"되므로, 자료형에 따른 전처리가 필요하다.
이것이 불편한 경우, 아래와 같이 한번에 보내자.(대신 이 경우, formData의 key값은 'data'로 둔다?)

> **단, file의 경우 다음과 같이 따로 처리하는것을 잊지말자.**

```HTML
<input type="file" id="fileInput" />
```

```js
const arr = [1, 2, 3];
const obj = { title: "sample", num: 1 };
const stringData = "This is a string";
const integerData = 42;
// file
const fileInput = document.getElementById("fileInput");
const file = fileInput.files[0]; // Get the first selected file

const data = {
  arr: arr,
  obj: obj,
  stringData: stringData,
  integerData: integerData,
};

const formData = new FormData();
formData.append("data", JSON.stringify(data)); // Append the data object as a JSON string
formData.append("file", file); // Append the file separately
```

```python
# views.py
import json
from django.http import JsonResponse

def createQuestion(request):
    if request.method == 'POST':
        data = json.loads(request.POST.get('data'))
        arr = data['arr']  # This will be the list [1, 2, 3]
        obj = data['obj']  # This will be the dictionary {'title': 'sample', 'num': 1}
        string_data = data['stringData']  # This will be 'This is a string'
        integer_data = int(data['integerData'])  # This will be 42
        # Your logic here
        file = request.FILES['file']  # This will be the uploaded file
        return JsonResponse({'status': 'success'})

    return JsonResponse({'status': 'error'}, status=400)

```

### POSTMAN

data: {"level": 1, "array":[1,2,3], "stringV": "hello", "obj": {"name":"hi"}}

## File

Service > manager > some components

## Django

https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/coding-style/

장고 convention
https://github.com/octoenergy/conventions/blob/main/conventions/django.md
장고 encapsulation
https://www.dabapps.com/insights/django-models-and-encapsulation/
