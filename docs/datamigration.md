## Data Migration

Courseware 프로젝트를 진행하며, DB를 Courseware에 맞게 가져온다.
Model의 경우도, 당장 필요하다 느끼는 model들만 남겨두기로 한다.

### 데이터 옮기기

나의 경우 기존 db가 문제가 있어, 데이터를 reset하기로 했다. 따라서, 내 기존 데이터는 이름을 바꿔서 다른 곳에 백업해두고, 프로젝트에 db파일을 비워두었다.

1. 데이터 dump
   부사장님의 project의 복사본을 하나 만들어, 데이터를 복사한다.

   `_cp`, `_st`의 데이터만 필요하기 때문에, 해당 데이터만 가져온다.

   ```python
   python3 manage.py dumpdata _cp _st > data.json
   ```

2. models.py 적용시키기  
    우선, 내 model은 크게 달라진게 없고, `loaddata`를 편하게 하기 위해, model을 우선 똑같이 세팅했다.

   또한, 기존의 migrations폴더에서, `__init__.py`파일을 제외한 파일들을 삭제하였다.
   현재 db 파일(`db.sqlite3`)가 없으니, migration 및 migrate를 해주어서 바뀐 model들이 적용된 빈 db파일을 생성해준다.

   ```shell
   python3 manage.py makemigrations
   python3 manage.py migrate
   ```

3. 데이터 load

   데이터를 옮길 준비가 되었기 때문에, load 해준다. 이 때 에러가 생겼는데, settings 파일에서 `USE_TZ`값을 True로 바꾸어주었다.
   그 후 원래 하려던대로 데이터를 load한다.

   ```shell
   python3 manage.py loaddata data.json
   ```

### Model 변경하기

Courseware에서는, 다음과 같은 변화가 있다.

#### `_CP`

> Unit 사용하지 않기

따라서, Unit Model들을 삭제한다.
또한, Lesson과 Testum또한, 이제는 나누는게 큰 의미가 없다 생각하여, 삭제하기로 했다.

> mCourseN, mElementN 이름 변경

mCourseN과 mElementN을, 각각 mCourse와 mElement로 이름을 변경한다.
또한, 기존에 `_cp`에 있는 mElement는 빈 데이터이다. 이것을 mElementN데이터로 넘겨주나?

> Mapper은 그대로 유지
> mapper의 경우, 추후에 추천 알고리즘에 필요할 수도 있을것 같아 일단은 그대로 둔다.(mMapper, mMapperN)

#### `_ST`

`_ST`의 경우, 기존의 Model을 삭제하지는 않을 것이다.
다만, `class_id`등, `courseware`에서는 사용하지 않는 Field들이 있다. 이러한 것들은 추후에 제거한다.

#### 결론

`_ST`는 모델이 그대로
`_CP`는 다음 모델들을 사용
mCourse
mElement
mCourseBook
mCourseBookBranch
mQuestionBook
mQuestionBookBranch
mQuestionAtom
mVideoAtom
mQuestionSolutionText
mQuestionSolutionVideo
mMapperN
mMapper

### mCourse 변경하기

unit을 삭제했기 때문에, `mCourse`데이터를 변경한다.
type이 2인 데이터만 변경하면 된다

kls도 units를 합쳐야된다.

### St > Result&Progress

// mLessonProgress
progress point try_count

progress, result는 하나로 관리하자.
mDemoStudyResultN과 같이 관리하면 된다.

<!-- 그러면, `_st`에 새로운 model, `mStudyResult`를 만들고, `mDemoStudyResultN`과 같은 모양을 가져간다. -->

그러면, `_st`에 `mStudyResultN`을 `mStudyResult`로 바꾸자.

다만, 마찬가지로 units가 없어지는걸 생각하자.
(일단 데이터는 없으니, 넣을 때 생각하자)
(client에서 작업해주는게 중요하기 때문에)
