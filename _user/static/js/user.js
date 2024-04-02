import { UserManager } from "../../../static/js/pages/user/user-manager";

require("../css/tailwind.css");
require("../../../static/css/css-reset.css");
require("../css/user.css");
export function start_user(context, csrf_token) {
  setConfig(csrf_token);

  initUser(context);
}

function setConfig(csrf_token) {
  const defaultAxiosConfig = {
    headers: { "X-CSRFTOKEN": csrf_token },
  };

  axios.defaults.headers = defaultAxiosConfig.headers;
}

function initUser(context) {
  const parsedContext = JSON.parse(context);

  const body = document.getElementById("body");

  // const options = {
  //   userType: parsedContext.userType,
  //   userId: parsedContext.userId,
  //   parent: body,
  //   classId: parsedContext.classId,
  // };

  const clUserManager = new UserManager();
  const elUserManager = clUserManager.getElement();
  body.append(elUserManager);
}
