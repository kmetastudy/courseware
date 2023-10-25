import { testFunction } from "./test"; // Remove after test

import { mtoEvents } from "../../../static/js/core/utils/mto-events";
import { mtmLoginManager } from "../../../static/js/pages/user/login/mtm-login-manager";
import { mtmSignupManager } from "../../../static/js/pages/user/signup/mtm-signup-manager";
// require("../../../static/css/core/component/mtm-common.css");
require("../../../static/css/index.css");
require("../css/user.css");
function activate(context) {
  const body = document.getElementById("body");

  const decodedContext = JSON.parse(context);
  if (decodedContext.isLogin) {
    var loginOption = {};
    var clLoginManager = new mtmLoginManager(loginOption);
    body.appendChild(clLoginManager.getElement());
  } else if (decodedContext.isSignup) {
    var signupOption = {};
    var clSignupManager = new mtmSignupManager(signupOption);
    body.appendChild(clSignupManager.getElement());
  }
}

mtoEvents.on("onReady", activate);

export function user_run(context) {
  console.log("User Students runs");
  const decodedContext = JSON.parse(context);
  console.log(decodedContext);
  mtoEvents.emit("onReady", context);
}

export function user_login(context) {
  // var context = (context.userType = 1);
  mtoEvents.emit("onReady", context);
}

export function user_signup(context) {
  mtoEvents.emit("onReady", context);
}

// Remove after test
export function user_test() {
  const defaultAxiosConfig = {
    headers: { "X-CSRFTOKEN": csrftoken },
  };
  axios.defaults.headers = defaultAxiosConfig.headers;

  const test = new testFunction();
}
