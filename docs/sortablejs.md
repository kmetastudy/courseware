## SortableJS

<https://github.com/SortableJS/Sortable>

### 특정 항목 필터링 하기.

```js
const sortableSample = new Sortable(this.sampleEl, {
  ghostClass: "highlight",
  animation: 150,
  onUpdate: function (evt) {
    self.onItemShiftHandler(evt.oldIndex, evt.newIndex);
  },
  filter: ".class-to-filter",
  onMove(e) {
    return e.related.className.indexOf("course-create-item") === -1;
  },
});
```

1. filter Config 에 filter처리할 아이템의 클래스명을 넣어서 드래그가 안되게 한다.

2. onMove이벤트를 사용해, 바꾸고 싶은 아이템의 위치가 filter의 위치인 경우,
   false를 return하게 해준다.

3. 마지막으로, onEnd가 아닌 onUpdate를 사용하자.
   onEnd의 경우, 위치가 바뀌든 바뀌지 않든 발동한다.
   onUpdate의 경우, 위치가 바뀌지 않는 경우 발동하지 않는다.
