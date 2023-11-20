require("../../../static/css/core/component/mtm-common.css");
require("../css/st.css");

import { mtoConfig } from "../../../static/js/core/utils/mto-config.js";
import { mtoEvents } from "../../../static/js/core/utils/mto-events.js";

import { StManager } from "../../../static/js/pages/st/st-manager.js";
import { mtmNaviBar } from "../../../static/js/core/ui/navi/mtm-navi-bar.js";
import { NavManager } from "../../../static/js/core/component/nav-manager.js";
import { mtoCommon } from "../../../static/js/core/component/mto-common.js";

function mtfLearnManagerOnReady(context) {
  const parsedContext = JSON.parse(context);
  console.log(parsedContext);

  // NaviBar;
  const naviOptions = {
    logo: "COURSEWARE",
    menuItems: [{ title: "소개", url: "" }],
    context: parsedContext,
    eventLogin: () => (window.location.href = "../user/"),
  };
  const clNavibar = new mtmNaviBar(naviOptions);

  const clNav = new NavManager(parsedContext);

  // StManager
  console.log(parsedContext);
  const options = {
    demo: parsedContext.demo,
    userType: parsedContext.userType,
    courseId: parsedContext.courseId,
    studentId: parsedContext.userId,
  };
  const clManager = new StManager(options);

  var body = document.getElementById("body");
  // body.appendChild(clNavibar.elThis);
  body.appendChild(clNav.getElement());
  body.appendChild(clManager.elThis);
}

mtoEvents.on("OnReady", mtfLearnManagerOnReady);

export function st_run(context, csrf_token) {
  const token = getCookie("csrftoken");
  const defaultAxiosConfig = {
    headers: { "X-CSRFTOKEN": token },
  };
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
