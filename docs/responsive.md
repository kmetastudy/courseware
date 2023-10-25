start first global
avoid fixed sizes(width, width...)\
max-width를 써라!
min-height같은거 써라


try media-queries

media 쿼리의 경우, 대부분 min-width 를 설정하고, 중복을 지운다.
overrite를 지우자. 대부분 이렇게 된다.
.sample {
display: flex;
gap: 2em;
}

@media(min-width: 40em) {
.sample {
display: block
}
}

위의 경우도, 다음과 같이 줄이면 된다.
@media(min-width: 40em) {
.sample {
display: flex;
gap: 2em;
}
}

너무 많은 breakpoint는 쓰지 말자.
40em 같이 한두개만 쓰면 된다.
또, device specific breakpoint는 쓰지 마라.
그냥 줄여보고 대충 문제 생기는 곳만 바꾸자


modern css를 사용하자

clamp를 사용하면  화면에 따라 fontsize가 바뀐다.
font-size: clamp(2rem, 1rem+ 10vw, 5rem) 

padding도 똑같이 clamp를 사용할 수 있음.


# flex
```css
/* flex-grow | flex-shrink | flex-basis */
flex: 2 2 100%
```

### 속성
`initial`
아이템 크기가 각각의 width와 height 속성에 따라 정해집니다. 플렉스 컨테이너의 크기를 넘지 않기 위해 최소 크기로 줄어들 수는 있지만, 남은 공간을 채우려 늘어나지는 않습니다. flex: 0 1 auto와 동일합니다.

`auto`
아이템 크기가 각각의 width와 height 속성에 따라 정해집니다. 플렉스 컨테이너의 크기를 넘지 않기 위해 최소 크기로 줄어들 수 있으며, 남은 공간을 채우기 위해 늘어날 수도 있습니다. flex: 1 1 auto와 동일합니다.

`none`
아이템 크기가 각각의 width와 height 속성에 따라 정해지며, 컨테이너의 크기에 관계 없이 변하지 않습니다. flex: 0 0 auto와 동일합니다.

`<'flex-grow'>`
플렉스 아이템의 flex-grow를 지정합니다. 음수 값은 유효하지 않습니다. 생략 시 기본값은 0입니다.

`<'flex-shrink'>`
플렉스 아이템의 flex-shrink를 지정합니다. 음수 값은 유효하지 않습니다. 생략 시 기본값은 1입니다.

`<'flex-basis'>`
플렉스 아이템의 flex-basis를 지정합니다. 0을 지정하려면 `<flex-grow>` 또는 `<flex-shrink>`로 읽히지 않도록 단위를 붙여야 합니다. 생략 시 기본값은 auto입니다.


# flex-*
### flex-wrap
```css
flex-wrap: nowrap; /* Default value */
flex-wrap: wrap;
flex-wrap: wrap-reverse;

/* Global values */
flex-wrap: inherit;
flex-wrap: initial;
flex-wrap: revert;
flex-wrap: revert-layer;
flex-wrap: unset;
```