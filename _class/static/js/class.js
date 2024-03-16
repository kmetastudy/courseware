import { AppClass } from "../../../static/js/pages/class/AppClass";
require("../../../static/css/css-reset.css");
require("../css/class.css");
export function start_class(context, csrf_token) {
  setConfig(csrf_token);

  initClass(context);
}

function setConfig(csrf_token) {
  const defaultAxiosConfig = {
    headers: { "X-CSRFTOKEN": csrf_token },
  };

  axios.defaults.headers = defaultAxiosConfig.headers;
}

function initClass(context) {
  const parsedContext = JSON.parse(context);

  const options = {
    userType: parsedContext.userType,
    userId: parsedContext.userId,
    userLogin: parsedContext.userLogin,
  };
  console.log(options);

  const body = document.getElementById("body");

  const clAppClass = new AppClass(options);
  const element = clAppClass.getElement();

  body.append(element);
}
