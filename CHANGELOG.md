## 2023/11/09

mCourseBookBranch -> Add new Field: is_demo_available
mUserCourse -> Create" new model at `_st`: This model is for the user and courses that user has

## 2023/11/22

### Add Time Data

#### 개요

> Model: mCourseN

mCourseN의 json_data 중, 다음 항목들에 대해 `time(seconds)` 추가

#### 추가항목

lists

- `time` : 해당 (branch)의 총 소요시간
- `units['time']`: 각 유닛의 총 소요 시간

contents

- `units['times']`: 각 (문제/비디오)의 시간

#### 데이터

```js
json_data = {
  lists: [
    { level: 1, type: 0, title: "This is chapter", id: "chapter_id", units: [] },
    {
      level: 2,
      type: 12,
      title: "This is lesson",
      id: "branch_id",
      units: [
        { id: "lesson_unit_id", types: ["v", "q", "q"] },
        { id: "lesson_unit_id", types: ["v", "q", "q"] },
      ],
    },
  ],
  contents: [
    { units: [] },
    {
      units: [
        {
          ids: ["element_id", "element_id", "element_id"],
          types: ["v", "q", "q"],
        },
        {
          ids: ["element_id", "element_id", "element_id"],
          types: ["v", "q", "q"],
        },
      ],
    },
  ],
};
```

변경 후

```js
json_data = {
  lists: [
    { level: 1, type: 0, title: "This is chapter", id: "chapter_id", units: [] },
    {
      level: 2,
      type: 12,
      title: "This is lesson",
      id: "branch_id",
      time: 1500, // 600+900
      units: [
        { id: "lesson_unit_id", types: ["v", "q", "q"], time: 600 }, //600+0+0
        { id: "lesson_unit_id", types: ["v", "q", "q"], time: 900 },
      ],
    },
  ],
  contents: [
    { units: [] },
    {
      units: [
        {
          ids: ["element_id", "element_id", "element_id"],
          types: ["v", "q", "q"],
          times: [600, 0, 0],
        },
        {
          ids: ["element_id", "element_id", "element_id"],
          types: ["v", "q", "q"],
          times: [900, 0, 0],
        },
      ],
    },
  ],
};
```
