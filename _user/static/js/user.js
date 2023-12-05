import { mtoEvents } from "../../../static/js/core/utils/mto-events";
import { UserManager } from "../../../static/js/pages/user/user-manager";
import { axiosManager } from "../../../static/js/core/utils/axios-manager";
import { NavManager } from "../../../static/js/core/component/nav-manager";
// require("../../../static/css/core/component/mtm-common.css");
require("../../../static/css/css-reset.css");
function activate(context) {
  const body = document.getElementById("body");
  console.log(context);
  // const contextStructure = {
  //   nextUrl: '../some_path/'
  // };

  const clUserManager = new UserManager({
    context: context,
  });

  body.appendChild(clUserManager.elThis);
}

mtoEvents.on("onReady", activate);

export function user_run(context, csrf_token) {
  const parsedContext = JSON.parse(context);

  mtoEvents.emit("setDefaultAxios", parsedContext);
  mtoEvents.emit("onReady", parsedContext);
}

function setAxiosDefault(context) {
  if (context.access_token) {
    axios.defaults.headers["Authorization"] = `Bearer ${context.access_token}`;
  }
}

mtoEvents.on("setDefaultAxios", setAxiosDefault);
