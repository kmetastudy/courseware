import { AppClassroomStudent } from "../../../static/js/pages/classroom/student/App";

require("../../../static/css/css-reset.css");
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
  dayjs.locale("ko");

  const parsedContext = JSON.parse(context);

  const body = document.getElementById("body");

  const options = {
    userType: parsedContext.userType,
    userId: parsedContext.userId,
    parent: body,
    classId: parsedContext.classId,
  };

  const clClassroom = new AppClassroomStudent(options);
  // const elClassroom = clClassroom.getElement();
  // body.append(elClassroom);
}
