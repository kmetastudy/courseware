import { AppClassLaunch } from "../../../static/js/pages/classroom/launch/AppClassLaunch";

require("../../../static/css/css-reset.css");
require("../css/class_launch.css");

export function start_launch(context, csrf_token) {
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
  dayjs.locale("ko");
  const parsedContext = JSON.parse(context);
  console.log("parsedContext: ", parsedContext);

  const body = document.getElementById("body");

  const options = {
    userType: parsedContext.userType,
    userId: parsedContext.userId,
    courseId: parsedContext.courseId,
    parent: body,
  };

  const clClassLaunch = new AppClassLaunch(options);
  const elClassLaunch = clClassLaunch.getElement();
  body.append(elClassLaunch);
}
