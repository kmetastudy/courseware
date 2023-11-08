## Form

### Form 요소의 장점?

```js
const form = document.querySelector("form");
form.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const formData = new FormData(form);
  // if you want to see key/value

  for (let [key, value] of formData) {
    console.log(key, value);
  }
});
```

input의 name attribute가 있어야만 위 방식 가능.

formData.

### Reference

https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement
