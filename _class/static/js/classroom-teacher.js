import { AppClassroomTeacher } from "../../../static/js/pages/classroom/teacher/App";

require("../../../static/css/css-reset.css");
require("../css/classroom-teacher.css");

export function start_classroom(context, csrf_token) {
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
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_timezone);
  dayjs.locale("ko");

  const parsedContext = JSON.parse(context);

  const options = {
    userType: parsedContext.userType,
    userId: parsedContext.userId,
    classId: parsedContext.classId,
  };

  console.log(options);

  const clClassroom = new AppClassroomTeacher(options);
}
