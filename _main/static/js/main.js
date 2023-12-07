require("../css/main.css");

import { NavManager } from "../../../static/js/core/component/nav-manager";
import { CourseManager } from "../../../static/js/pages/main/course/course-manager";
import { DetailManager } from "../../../static/js/pages/main/course/detail-manager";
import { mtmSideMenu } from "../../../static/js/core/ui/sideMenu/mtm-side-menu";
import { CourseView } from "../../../static/js/pages/main/course/course-view"

export function BaseOnReady(context) {
  const clNav = new NavManager(context)
  $('.navbar').html(clNav.getElement())
}

export function CourseLandingOnReady(context,courses) {
  console.log(context)
  console.log(courses)


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

  const clNav = new NavManager(context)
  $('.navbar').html(clNav.getElement())

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