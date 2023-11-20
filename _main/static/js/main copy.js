function init(options) {
  console.log("hi");

  // 과목 사이드바
  var clSidebar = new Sidebar(options);
  $(".sidebar").append(clSidebar.elThis);

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

  // 필터
  var clFilter = new Filter();
  $(".courses_filter").prepend(clFilter.elThis);
  // 코스 리스트
  var clCourses = new Course();
  $(".courses_main").html(clCourses.elThis);
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

Course.prototype.create = function () {
  console.log(this.options);
  var $elCourses = $('<div class="grid grid-cols-4"></div>');

  // this.data.forEach(function(content) {
  //     var $elContent = $(`<div class="p-4">
  //                         <img src="../../static/img/${content.thumnail}">
  //                         <p>${content.title}</p>
  //                         <p>${content.publisher}</p>
  //                         <p>${content.cost}</p>
  //                     </div>`)
  //     $elContents.append($elContent)
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

function Sidebar(options) {
  this.options = options;
  this.elThis = null;
  this.create();
}

Sidebar.prototype.create = function () {
  var subjectEng = {
    국어: "kor",
    영어: "eng",
    수학: "math",
    사회: "soc",
    역사: "hist",
    한국사: "korhist",
    과학: "sci",
    정보: "info",
    도덕: "mor",
  };
  var $elSubjects = $('<div class="sidebar-container border"></div>');
  this.options.subject_list.forEach(function (subject) {
    var $elSubject =
      $(`<div class="p-4 border-b text-base cursor-pointer" onclick="location.href='../${subjectEng[subject]}'">
                            <i class="ri-book-line"></i>
                            ${subject}
                        </div>`);

    // $elSubject.on("click",function(){
    //     // console.log(this.innerText)
    //     // var header = $('.courses_header').text()
    //     // $('.courses_header').text(header.split('/')[0]+' / '+this.innerText)

    //     $.ajax({
    //         url:'courses/getCourses/',
    //         type: 'POST',
    //         data: { courseId : courseId },
    //         headers: { "X-CSRFTOKEN": csrftoken },
    //         success:function(res){
    //             if(res.data != null){
    //                 console.log(res.data)
    //                 contentDetailOption = res.data
    //             }

    //         },
    //         error:function(){

    //         }
    //     })
    // })

    $elSubjects.append($elSubject);
  });

  this.elThis = $elSubjects;
};
