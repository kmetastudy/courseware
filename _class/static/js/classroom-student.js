import { AppClassroomStudent } from "../../../static/js/pages/classroom/student/App";
import { mtmNaviBar } from "../../../static/js/core/ui/navi/mtm-navi-bar";
require("../../../static/css/css-reset.css");
require("../../../static/css/core/component/mtm-common.css");
require("../css/classroom-student.css");
export function start_classroom(context, csrf_token) {
  setConfig(csrf_token);

  initClassroom(context);
}

function setConfig(csrf_token) {
  const defaultAxiosConfig = {
    headers: { "X-CSRFTOKEN": csrf_token },
  };

  axios.defaults.headers = defaultAxiosConfig.headers;
}

function initClassroom(context) {
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_timezone);
  dayjs.extend(window.dayjs_plugin_isToday);
  dayjs.locale("ko");

  const parsedContext = JSON.parse(context);

  const body = document.getElementById("body");

  const options = {
    userType: parsedContext.userType,
    userId: parsedContext.userId,
    parent: body,
    classId: parsedContext.classId,
  };

  const clNavibar = new mtmNaviBar({ context: options });

  const clClassroom = new AppClassroomStudent(options);
  // const elClassroom = clClassroom.getElement();
  // body.append(elClassroom);
}
