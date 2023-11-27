require("../css/main.css");

import { NavManager } from "../../../static/js/core/component/nav-manager";
import { CourseManager } from "../../../static/js/pages/main/course/course-manager";
import { DetailManager } from "../../../static/js/pages/main/course/detail-manager";

export function MainOnReady(context) {
  console.log(context)

  const clNav = new NavManager(context)
  $('.navbar').html(clNav.getElement())

}

export function CourseMainOnReady(context,options,courses) {
  console.log(context)
  console.log(options)
  console.log(courses)

  const clNav = new NavManager(context)
  $('.navbar').html(clNav.getElement())

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