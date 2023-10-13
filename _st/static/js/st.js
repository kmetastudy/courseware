require("../../../static/css/core/component/mtm-common.css");
require("../css/st.css");

import { mtoConfig } from "../../../static/js/core/utils/mto-config.js";
import { mtoEvents } from "../../../static/js/core/utils/mto-events.js";

import { mtmManagerLearn } from "../../../static/js/pages/st/mtm-manager-learn.js";
import { mtmNaviBar } from "../../../static/js/core/ui/navi/mtm-navi-bar.js";
// import {mtmNaviBar} from "../../../static/js/pages"

function mtfLearnManagerOnReady(context) {
  console.log("mtfLearnManagerOnReady");
  var body = document.getElementById("body");
  var options = { logo: "MEGA-COURSE", menuItems: [] };
  options.context = JSON.parse(context);
  options.menuItems.push({ title: "소개", url: "/" });

  var clNavibar = new mtmNaviBar(options);

  var optionsManagerLearn = {};
  optionsManagerLearn.body = body;
  optionsManagerLearn.context = JSON.parse(context);
  console.log("optionsManagerLearn: ", optionsManagerLearn);
  var clManagerLearn = new mtmManagerLearn(optionsManagerLearn);
  body.appendChild(clNavibar.elThis);
  body.appendChild(clManagerLearn.elThis);
}

mtoEvents.on("OnReady", mtfLearnManagerOnReady);

export function st_run(context) {
  console.log("Mega Student runs ....");
  mtoEvents.emit("OnReady", context);
}
