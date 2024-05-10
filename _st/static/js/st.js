require("../css/tailwind.css");
require("../../../static/css/css-reset.css");
require("../../../static/css/core/component/mtm-common.css");
require("../css/st.css");

import("../css/tailwind.css");

import { mtoConfig } from "../../../static/js/core/utils/mto-config.js";
import { mtoEvents } from "../../../static/js/core/utils/mto-events.js";

import { drawerHelper } from "../../../static/js/shared/helpers/drawer/drawer-helper.js";

import { StManager } from "../../../static/js/pages/st/st-manager.js";
import { mtmNaviBar } from "../../../static/js/core/ui/navi/mtm-navi-bar.js";
import { NavManager } from "../../../static/js/core/component/nav-manager.js";
import { mtoCommon } from "../../../static/js/core/component/mto-common.js";
import { DrawerSide } from "../../../static/js/core/ui/DrawerSide/DrawerSide.js";


function mtfLearnManagerOnReady(context) {
  dayjs.extend(window.dayjs_plugin_relativeTime);
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_timezone);
  dayjs.locale("ko");

  axios.defaults.headers["X-CSRFTOKEN"] = csrftoken;

  const parsedContext = JSON.parse(context);

  // NaviBar;
  const naviOptions = {
    logo: "COURSEWARE",
    menuItems: [{ title: "소개", url: "" }],
    context: parsedContext,
    eventLogin: () => (window.location.href = "../user/"),
  };
  const clNavibar = new mtmNaviBar(naviOptions);

  // change drawer
  const drawer = drawerHelper();

  const navOptions = { ...parsedContext, drawer };
  const clNav = new NavManager(navOptions);

  // StManager
  const options = {
    demo: parsedContext.demo,
    userType: parsedContext.userType,
    courseId: parsedContext.courseId,
    studentId: parsedContext.userId,
    userLogin: parsedContext.userLogin,
    contentId: parsedContext.contentId,
  };
  const clManager = new StManager(options);

  // var body = document.getElementById("body");
  // Drawer
  // drawer > root
  const { userType, userLogin } = parsedContext;

  const root = document.querySelector("#main")
  const content = document.createElement("main");
  // drawer > content
  const body = document.querySelector("#body");

  content.appendChild(clNav.getElement());
  body.appendChild(clManager.elThis);

  // drawer > side

  const fakeWrapper = document.createElement("div");
  const clDrawerSide = new DrawerSide({
    target: fakeWrapper,
    props: { userType: parsedContext.userType, userLogin: parsedContext.userLogin },
  });
  const elDrawerSide = clDrawerSide.getElement();

  setDrawer({ root, content, side: elDrawerSide, drawer });
}

function setDrawer({ root, content, side, drawer }) {
  const { Root, Toggle, Content, Side, Overlay } = drawer;
  Root({ element: root, position: "right", forceOpen: false });
  // Toggle
  Toggle({ id: "st-drawer" });
  // Content
  Content({ element: content });
  // Side
  Side({ element: side });
  // Overlay
  const overlay = side.querySelector(".drawer-overlay");
  Overlay({ element: overlay });
}

mtoEvents.on("OnReady", mtfLearnManagerOnReady);

export function st_run(context, csrf_token) {
  const token = getCookie("csrftoken");
  const defaultAxiosConfig = {
    headers: { "X-CSRFTOKEN": token },
  };

  const refresh_token = getCookie("refresh_token");
  axios.defaults.headers = defaultAxiosConfig.headers;
  console.log("Mega Student runs ....");
  mtoEvents.emit("OnReady", context);
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
