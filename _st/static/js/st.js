require("../../../static/css/core/component/mtm-common.css");
require("../css/st.css");

import { mtoConfig } from "../../../static/js/core/utils/mto-config.js";
import { mtoEvents } from "../../../static/js/core/utils/mto-events.js";

import { StManager } from "../../../static/js/pages/st/st-manager.js";
import { mtmNaviBar } from "../../../static/js/core/ui/navi/mtm-navi-bar.js";

function mtfLearnManagerOnReady(context) {
  const parsedContext = JSON.parse(context);

  //NaviBar
  const naviOptions = {
    logo: "COURSEWARE",
    menuItems: [{ title: "소개", url: "" }],
    context: parsedContext,
  };
  const clNavibar = new mtmNaviBar(naviOptions);

  // StManager
  const options = {
    demo: parsedContext.demo,
    userType: parsedContext.demo,
    courseId: parsedContext.courseId,
  };
  const clManager = new StManager(options);

  var body = document.getElementById("body");
  body.appendChild(clNavibar.elThis);
  body.appendChild(clManager.elThis);
}

mtoEvents.on("OnReady", mtfLearnManagerOnReady);

export function st_run(context) {
  console.log("Mega Student runs ....");
  mtoEvents.emit("OnReady", context);
}
