```js
const tst = async () => {
  const dataToPost = {
    id: "adsfasdf",
    arr: [1, 2, 3, 4],
    obj: { 1: "2" },
  };
  const data = new FormData();
  data.append("id", dataToPost.id);

  try {
    const res = await mCourseBookApi.update(data);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
tst();
```

객체 전달하는 경우

```js
try {
  const response = await mQuestionAtomApi.create(data);
  if (response.data && response.data.result) {
    console.log(response.data.result);
  }
} catch (error) {
  console.error(error);
}
```

```js
export const create = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios.post("../createQuestionAtom/", formData, config);
};
```

```Python
def createQuestionAtom(request):
    data = json.loads(request.POST.get('data'))
    validData = getMatchedData("mQuestionAtom", data)
    newAtom = mQuestionAtom.objects.create(**validData)
    result = list(mQuestionAtom.objects.filter(id=newAtom.id).values())[0]
    return JsonResponse({'message':'','result':result})
```

### promise.all과 Transactions

https://jojoldu.tistory.com/639

## 병렬처리

https://inpa.tistory.com/entry/JS-%F0%9F%9A%80-%EC%8A%A4%ED%81%AC%EB%A1%A4-%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C-%EB%82%B4%EB%A6%AC%EA%B8%B0-1
