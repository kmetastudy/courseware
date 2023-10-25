### Selector

```css
/* HTML전체 (head 요소도 포함) */
* {}

/* Type Selector */
p {}
a {}

/* ID Selector */
/* 중복 불가능 */
#id1 {}
#id123 {}

/* Class Selector */
/* 중복가능(재사용가능) */
.class1{}
.class2{}

/* Attribute Selector */
a[href] {}
a[target="_black"] {}
h1[title~="first"] {} /* 공백으로 분리된 단어를 포함하는 요소 선택 */
h1[title|="first"] {} /* 지정됨값과 일치or 지정된값뒤-로 시작하는 요소 선택 */
h1[href^="https://"] {} /* 지정된 값으로 시작하는 요소 선택 */
h1[href$=".html"] {} /* 지정된 값으로 끝나는 요소 선택 */
h1[title*="test"] {} /* 지정된값을 포함하는 요소 */
```

* 후손 Selector
> 부모요소: 자신의 1level 상위에 속하는 요소 <br>
> 식요소: 자신의 1level 하위에 속하는 요소 <br>
> 후손요소: 자산의 n level 하위에 속하는 요소

```css
/* 후손요소 */
div p {}

/* 자식요소 */
div > p {}
```

> :link-> 셀렉터가 방문하지 않은 링크일 때 <br>
> :visited-> 셀렉터가 방문한 링클일 때 <br>
> :hover-> 셀렉터에 마우스가 올라가있을 떄 <br>
> :active-> 셀렉터가 클릭된 상태일 때 <br>
> :focus-> 셀렉터에 포커스가 들어와 있을 때



### [@keyframes (애니메이션)](https://themeisle.com/blog/css-animations-tutorial/#gref)


@keyframes의 syntax는 다음과 같다.
```css
.box-animation {
    animation-name: movingObject;
    animation-duration: 2s;
    animation-timing-function: linear;
}

@keyframes moveObejct{
    0% {
        transform: translateX(0);
    }
    50% {
        transform: translateX(300px);
    }
    100% {
        transform: translateX(300px) scale(1,5);
    }
}
```
**Naming** <br>
이 때 `moveObject`와 같은 이름은 [`custom identifier 규칙`](https://developer.mozilla.org/en-US/docs/Web/CSS/custom-ident)을 지켜야 한다.

<br>

**animation-duration** <br>
`animation-duration`은 애니메이션이 지속되는 시간이다. 
음수는 나올 수 없다.

<br>

**animation-timing-function** <br>
`animation-timing-function`은 애니메이션의 진행속도을 정할 수 있다. 
다음과 같은 값들을 넣을 수 있다.
* ease( the initail value)
* ease-in (처음에 느림)
* ease-out (나중에 느림)
* ease-in-out (처음, 나중에 느림)
* linear (일정함)
* step-start
* step-end

`animation-timing-function`은 다음 함수들을 가질 수 있다.
* `cubic-bezier(x1,y1,x2,y2)`: 곡선을 그릴 수 있음
* `steps(step, ev)` : 애니메이션을 단계별로 나눌 수 있음

<br>

**animation-iteration-count** <br>
애니메이션을 원하는 횟수만큼 반복할 수 있다. 초기값은 1이다.
```css
.box{
    animation-iteration-count: 3;
}
```

3.5와 같은 fractional value를 가질 수도 있는데, 이 것은 3.5회를 반복하는 것과 같은 의미

<br>

**animation-direction**<br>
애니메이션의 방향
* normal: default
* reverse: 반대로
* alternate: 방향전환(시작은 default)
* alternate-reverse : 방향전환(시작은 reverse)


## fontello
https://m.blog.naver.com/thdbsgh3443/221276722116
https://bydik.com/optimize-font-awesome/
https://forum.djangoproject.com/t/mime-type-text-html-is-not-supported-as-css/18795/5


#### display: none vs visiblity: hidden
display: none -> document에서 해당 element를 제거한다. 즉, 더이상 공간을 차지하지 않는다.

visibility: hidden -> element를 숨기지만, layout에서 공간을 계속 차지한다.
width 나 height 등을 주면 그 크기만큼의 공간이 유지된다.
