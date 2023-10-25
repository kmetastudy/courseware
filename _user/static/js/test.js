import { ApiCp } from "../../../static/js/core/api/api-cp";

export const testFunction = async function () {
  this.apiCourseBook = new ApiCp("cp", "course_book", "../../cp/api/course_book/");
  this.apiCourseBookBranch = new ApiCp("cp", "course_book_branch");

  const id = "30f29a71-f0ff-47d8-94f2-9fae580bd93f";
  // this.testTime();
  // this.test();
  // this.urlGetCourseBook(id);
  // this.urlCreateCourseBook();

  // test ajax
  const res = await this.urlGetCourseBookAjax(id);
  console.log("result: ", res);
};

//////////////////////////////////// URL ////////////////////////////////////
testFunction.prototype.urlCreateCourseBook = async function (dataToCreate = {}) {
  try {
    const result = await this.apiCourseBook.create(dataToCreate);
    return result;
  } catch (err) {
    console.error(err);
  }
};

testFunction.prototype.urlGetCourseBook = async function (id = null) {
  try {
    const result = await this.apiCourseBook.get(id);
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
  }
};

testFunction.prototype.urlGetCourseBookBranch = async function (id = null) {
  try {
    const result = await this.apiCourseBookBranch.get(id);
    return result;
  } catch (err) {
    console.error(err);
  }
};

testFunction.prototype.urlfilterCourseBookBranch = async function (conditions = {}) {
  try {
    const result = await this.apiCourseBookBranch.filter(conditions);
    return result;
  } catch (err) {
    console.error(err);
  }
};

testFunction.prototype.urlGetFullCourse = async function (bookId) {
  try {
    // 원래 post로 하면 안됩니다..제가 잘못 짜서..
    const formData = new FormData();
    formData.append("id", bookId);
    return await axios.post("../cp/get-full-course/", formData).then((res) => {
      if (res.data.result) {
        return res.data.result;
      } else {
        console.log(res.data.message);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// jquery ajax로 async await를 쓰고 싶으시면, 다음과 같이 하셔도 됩니다.
// 똑같아요.
testFunction.prototype.urlGetCourseBookAjax = async function (id) {
  let url = `../../cp/api/course_book/`;
  if (id && id !== "") {
    url += `${id}/`;
  }
  console.log(url);
  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      type: "GET",
      headers: { "X-CSRFTOKEN": csrftoken },
      success: function (res) {
        resolve(res);
      },
      error: function (err) {
        reject(err);
      },
    });
  });
};

//////////////////////////////////// API ////////////////////////////////////
testFunction.prototype.testTime = async function () {
  try {
    let res1 = [];
    let res2;

    let start1 = performance.now();
    //방법1, 백에서 처리하기
    const books = await this.urlGetCourseBook();
    const bookSize = books.length;
    for (let i = 0; i < bookSize; i++) {
      console.log(`${i} / ${bookSize}, id:  ${books[i].id}`);
      res1.push(await this.getFullCourse(books[i].id));
    }

    let end1 = performance.now();

    // // 방법2, record 하나하나마다 왔다갔다하기
    let start2 = performance.now();
    res2 = await this.getFullCourseOneByOne();
    let end2 = performance.now();

    console.log("res1: ", res1);
    console.log("res2: ", res2);

    console.log(`백에서 최대한 한번에 처리하는 시간: ${(end1 - start1).toFixed(2)} ms`);
    console.log(`클라이언트와 백 왔다갔다 하면서 처리하는 시간: ${(end2 - start2).toFixed(2)} ms`);
  } catch (err) {
    console.error(err);
  }
};

// 랜딩페이지에서, 특정 코스(e.g. 중3-1 완성)에 대해서, 전체를 다 불러올 때 사용하시면 됩니다.
// 다만 이건 testum/lesson 등은 가져오지 않습니다.
// 따라서, 코스의 상세페이지에서, 목록 등을 보여주기 위할 때 사용하시면 됩니다.
// 결과의 데이터구조는 아래랑 같아요
// var data = [{
//   children: [{ <- chapter
//     children: [{}] <- branch
//   }, {}, {}]
// }, {}, {}]
testFunction.prototype.getFullCourse = async function (bookId) {
  try {
    const data = await this.urlGetFullCourse(bookId);
    return data;
  } catch (err) {
    console.log(err);
  }
};

// 한 코스에 대한 chapter, branch 데이터 모두 가져오기
// 다만, one-by-one으로, 하나씩 가져옵니다.
testFunction.prototype.getFullCourseOneByOne = async function () {
  try {
    const result = [];
    const books = await this.urlGetCourseBook();
    const bookSize = books.length;
    for (let i = 0; i < bookSize; i++) {
      console.log(`process ${i} / ${bookSize}`);
      const book = books[i];
      book.children = []; // 임의로 이렇게 해볼게요.
      result.push(book);
      if (book.branch_ids && book.branch_ids !== "") {
        await this.getFullChapter(book);
      }
    }
    return result;
  } catch (err) {
    console.log(err);
  }
};

testFunction.prototype.getFullChapter = async function (book) {
  try {
    const chapterIds = book.branch_ids.split(","); // ["chapter1", "chapter2", ...]
    const chapterSize = chapterIds.length;

    for (let i = 0; i < chapterSize; i++) {
      const chapterId = chapterIds[i];
      const chapter = await this.urlGetCourseBookBranch(chapterId);
      chapter.children = [];
      book.children.push(chapter);

      if (chapter.branch_ids && chapter.branch_ids !== "") {
        await this.getFullBranch(chapter);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

testFunction.prototype.getFullBranch = async function (chapter) {
  try {
    const branchIds = chapter.branch_ids.split(","); // ["chapter1", "chapter2", ...]
    const branchSize = branchIds.length;

    for (let i = 0; i < branchSize; i++) {
      const branchId = branchIds[i];
      const branch = await this.urlGetCourseBookBranch(branchId);
      chapter.children.push(branch);
    }
  } catch (error) {
    console.error(error);
  }
};
