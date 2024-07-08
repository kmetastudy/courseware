require("../../../static/css/css-reset.css");
require("../css/main.css");
require("../css/contact.css");
// require("../css/tailwind.css");
import("../css/tailwind.css");

import { drawerHelper } from "../../../static/js/shared/helpers/drawer/drawer-helper";
import { DrawerSide } from "../../../static/js/core/ui/DrawerSide";

import { NavManager } from "../../../static/js/core/component/nav-manager";
import { CourseManager } from "../../../static/js/pages/main/course/course-manager";
import { DetailManager } from "../../../static/js/pages/main/course/detail-manager";
import { mtmSideMenu } from "../../../static/js/core/ui/sideMenu/mtm-side-menu";
import { CourseView } from "../../../static/js/pages/main/course/mtv-course";
import CategoryPaginatedContent from "../../../static/js/pages/school/container/CategoryPaginatedContent";
import { CourseSwiperView } from "../../../static/js/pages/main/course/mtv-course-swiper";

import HighlightCourse from "../../../static/js/pages/school/container/HighlightCourse";

export function BaseOnReady(context) {
  dayjs.extend(window.dayjs_plugin_relativeTime);
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_timezone);
  dayjs.locale("ko");

  axios.defaults.headers["X-CSRFTOKEN"] = csrftoken;

  const parsedContext = JSON.parse(context);
  const { userType, userId, userLogin } = parsedContext;
  // drawer API
  const drawer = drawerHelper();

  const root = document.querySelector("#main");
  // root.classList.add("min-h-screen");

  const content = document.createElement("main");

  const navOptions = { ...parsedContext, drawer };
  const clNav = new NavManager(navOptions);
  const elNav = clNav.getElement();

  content.append(elNav);

  const fakeWrapper = document.createElement("div");
  const clDrawerSide = new DrawerSide({ target: fakeWrapper, props: { userType, userLogin } });
  const elDrawerSide = clDrawerSide.getElement();

  // setDrawer({ root, content, side: elDrawerSide, drawer });
}

function setDrawer({ root, content, side, drawer }) {
  const { Root, Toggle, Content, Side, Overlay } = drawer;
  Root({ element: root, position: "right", forceOpen: false });
  // Toggle
  Toggle({ id: "mypage-drawer" });
  // Content
  Content({ element: content });
  // Side
  Side({ element: side });
  // Overlay
  const overlay = side.querySelector(".drawer-overlay");
  Overlay({ element: overlay });
}

export function CourseLandingOnReady(context, sections) {
  console.log(context);
  console.log(sections);

  new CategoryPaginatedContent(document.querySelector(".courses_landing"), {sections})
}

export function CourseMainOnReady(context, options, courses) {
  console.log(context);
  console.log(options);
  console.log(courses);

  var clCourses = new CourseManager(options, courses);

  // 코스 리스트
  // var clCourses = new Course();
  // $(".courses_main").html(clCourses.elThis);
}

export function CourseDetailOnReady(context, data) {
  const token = getCookie("csrftoken");
  const defaultAxiosConfig = {
    headers: { "X-CSRFTOKEN": token },
  };
  axios.defaults.headers = defaultAxiosConfig.headers;

  var clCourseDetail = new DetailManager(context, data);
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

export function BasicLandingOnReady(context, sections) {
  console.log(context);
  console.log(sections);

  const courses = []
  sections.forEach((section) => {
      section.courses.forEach((course) => {
          courses.push(course.course)
      })
  })

  console.log(courses)

  new HighlightCourse(document.querySelector(".courses_recomend"), {sections})

  var clCourseView = new CourseView(courses);
  $(".courses_landing").append(clCourseView.elThis);
}

export function MyCourseOnReady(context) {
  const sideItems = [
    {
      title: "Home",
      children: [{ title: "대시보드" }, { title: "프로필", onClick: () => (window.location.href = "/"), icon: "user" }],
    },
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

  $(".sidebar").append(elSide);
}
