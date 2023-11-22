require("../css/main.css");
import { CourseManager } from "../../../static/js/pages/main/course/course-manager";
import { NavManager } from "../../../static/js/core/component/nav-manager";

export function MainOnReady(context) {
  console.log(context)

  const clNav = new NavManager(context)
  $('.navbar').html(clNav.getElement())

}

export function CourseMainOnReady(context,options, courses) {
  console.log(context)
  console.log(options)
  console.log(courses)

  const clNav = new NavManager(context)
  $('.navbar').html(clNav.getElement())

  var clCourses = new CourseManager(options, courses)

  // 현재 검색페이지
  var subjectKor = {
    all: "전과목",
    kor: "국어",
    eng: "영어",
    math: "수학",
    soc: "사회",
    hist: "역사",
    korhist: "한국사",
    sci: "과학",
    info: "정보",
    mor: "도덕",
  };
  $(".courses_header").text(options.schoolKor + " / " + subjectKor[options.subject]);

  
  // 코스 리스트
  // var clCourses = new Course();
  // $(".courses_main").html(clCourses.elThis);
}


function Filter() {
  this.options = null;
  this.elThis = null;
  this.create();
}

Filter.prototype.create = function () {
  var options = {
    grade: ["1학년", "2학년", "3학년"],
    semester: ["공통", "1학기", "2학기"],
    difficulty: ["상", "중", "하"],
  };
  var filterOption = [];

  var $elFilter = $(`<div class="flex justify-center items-center"></div>`);
  for (const [key, values] of Object.entries(options)) {
    // console.log(`${typeof(key)}: ${typeof(values)}`);  //string : object
    values.forEach(function (value) {
      var $elFilterObj = $(
        `<div id="tag-${value}" class="${key} mx-2 px-2 py-1 rounded-full border text-sm cursor-pointer">${value}</div>`,
      );
      $elFilterObj.on("click", function () {
        $(this).toggleClass("border-[#08A843]");
        filterOption.push($(this).attr("id"));
        console.log(filterOption);
        var filteredCourses = new Course(filterOption);
        $(".courses_main").html(filteredCourses.elThis);
      });
      $elFilter.append($elFilterObj);
    });

    $elFilter.append(`<div class="mx-1 text-gray-500">|</div>`);
  }
  $elFilter.append(`<div class="filter-search flex justify-center items-center">
                            <input type="text" placeholder="검색" class="mx-2 px-4 py-1 w-[250px] border border-gray-300 rounded-full">
                            <i class="fa-solid fa-magnifying-glass text-black cursor-pointer"></i>
                        </div>`);

  console.log($elFilter);
  this.elThis = $elFilter;
};

function Course(options) {
  this.options = options;
  this.data = [{ thumnail: "001.png", title: "중학 수학 1", publisher: "메가코스", cost: 5000 }];
  this.elThis = null;
  this.create();
}

Course.prototype.create = async function () {
  console.log(this.options);

  // const courses = await this.urlGetCourses();
  // console.log(courses);

  var $elCourses = $('<div class="grid grid-cols-4"></div>');

  // courses.forEach(function(content) {
  //     var $elContent = $(`<div class="p-4">
  //                           <img src="../../../static/img/001.png">
  //                           <p>중등 1-1 수학 기초와 개념</p>
  //                           <p class="text-gray-600 text-sm">megacourse</p>
  //                           <p class="text-md">55,000원</p>
  //                     </div>`)
  //     $elCourses.append($elContent)
  // })
  
  for (var i = 1; i < 53; i++) {
    if (i < 10) {
      var $elCourse = $(`<div class="p-4 cursor-pointer" onclick="location.href='./id/'">
                            <img src="../../../static/img/00${i}.png">
                            <p>중등 1-1 수학 기초와 개념</p>
                            <p class="text-gray-600 text-sm">megacourse</p>
                            <p class="text-md">55,000원</p>
                        </div>`);
    } else {
      var $elCourse = $(`<div class="p-4 cursor-pointer" onclick="location.href='./id/'">
                            <img src="../../../static/img/0${i}.png">
                            <p>중등 1-1 수학 기초와 개념</p>
                            <p>megacourse</p>
                            <p>55,000원</p>
                        </div>`);
    }

    $elCourses.append($elCourse);
  }
  this.elThis = $elCourses;
};

Course.prototype.urlGetCourses = function() {
  return axios.get("../../../cp/api/course_book/").then((res) => {
    if (res?.data) {
      return res.data;
    } else {
      console.log(res);
      return [];
    }
  });
}

