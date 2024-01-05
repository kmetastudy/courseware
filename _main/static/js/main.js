require("../css/main.css");

import { NavManager } from "../../../static/js/core/component/nav-manager";
import { CourseManager } from "../../../static/js/pages/main/course/course-manager";
import { DetailManager } from "../../../static/js/pages/main/course/detail-manager";
import { mtmSideMenu } from "../../../static/js/core/ui/sideMenu/mtm-side-menu";
import { CourseView } from "../../../static/js/pages/main/course/mtv-course"
import { CourseSwiperView } from "../../../static/js/pages/main/course/mtv-course-swiper";

export function BaseOnReady(context) {
  const clNav = new NavManager(context)
  $('.navbar').html(clNav.getElement())
}

export function CourseLandingOnReady(context,courses, recommend) {
  console.log(context)
  console.log(courses)


  var $elSearch = $(`<div class="my-6 flex flex-1 justify-center items-center">
                        <input type="text" class="mx-2 p-2 w-1/2 border border-gray-500 rounded-full text-[12px] focus:outline-none focus:shadow-lg" placeholder="과목을 입력해보세요.">
                        <i class="ri-search-line cursor-pointer"></i>
                    </div>`)

  $elSearch[0].children[0].addEventListener('keyup', function(e){
    if(e.keyCode == 13){
      // console.log('enter')
      var keyword = $elSearch[0].children[1].previousElementSibling.value
      var obj = courses
      // console.log(obj)
      var keyCourse = obj.filter(course => course.courseTitle.includes(keyword))
      console.log(keyCourse)
      if(keyCourse.length == 0){
        var clCourseView = new CourseView(courses)
        $(".courses_landing").html(clCourseView.elThis);
      } else{
        var clCourseView = new CourseView(keyCourse)
        $(".courses_landing").html(clCourseView.elThis);
      }

      
    }
  })

  $elSearch[0].children[1].addEventListener('click', () => {
      console.log($elSearch[0].children[1].previousElementSibling.value)
      var keyword = $elSearch[0].children[1].previousElementSibling.value
      var obj = courses
      // console.log(obj)
      var keyCourse = obj.filter(course => course.courseTitle.includes(keyword))
      console.log(keyCourse)

      if(keyCourse.length == 0){
        var clCourseView = new CourseView(courses)
        $(".courses_landing").html(clCourseView.elThis);
      } else{
        var clCourseView = new CourseView(keyCourse)
        $(".courses_landing").html(clCourseView.elThis);
      }
  })

  $(".search").append($elSearch)

  var clCourseSwiper = new CourseSwiperView(recommend)
  $(".courses_recomend").append(clCourseSwiper.elThis)

  var slider  = new Swiper('.swiper-container', {
    slidesPerView: 2,
    spaceBetween:10,
    breakpoints: {
      640: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView:4 ,
        spaceBetween: 20,
      }
    },
    navigation: {
      nextEl: '.prev-btn',
      prevEl: '.next-btn',
    },
    
  });


  var clCourseView = new CourseView(courses)
  $(".courses_landing").append(clCourseView.elThis);
}

export function CourseMainOnReady(context,options,courses) {
  console.log(context)
  console.log(options)
  console.log(courses)


  var clCourses = new CourseManager(options, courses)

  

  
  // 코스 리스트
  // var clCourses = new Course();
  // $(".courses_main").html(clCourses.elThis);
}


export function CourseDetailOnReady(context,data) {

  const token = getCookie("csrftoken");
  const defaultAxiosConfig = {
    headers: { "X-CSRFTOKEN": token },
  };
  axios.defaults.headers = defaultAxiosConfig.headers;


  var clCourseDetail = new DetailManager(context,data[0])
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  console.log("token : ", cookieValue);
  return cookieValue;
}


export function MyCourseOnReady(context) {
  const sideItems = [
    { title: "Home", children: [{ title: "대시보드" }, { title: "프로필", onClick: () => (window.location.href = "/"), icon: "user" }]},
    { title: "학습 관리", children: [{ title: "내 학습" }, { title: "수강전 문의" }] },
    {
      title: "수강신청 관리",
      children: [
        { title: "수강바구니" },
        { title: "좋아요" },
        { title: "쿠폰함" },
        { title: "포인트" },
        { title: "구매내역" },
      ],
    },
    { title: "설정", children: [{ title: "계정 정보" }, { title: "알림 설정" }] },
  ];
  const clSide = new mtmSideMenu({ item: sideItems });
  const elSide = clSide.getElement();

  $('.sidebar').append(elSide)
}