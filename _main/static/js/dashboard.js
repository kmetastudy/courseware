import { NavManager } from "../../../static/js/core/component/nav-manager";
import { AppDashboard } from "../../../static/js/pages/main/dashboard/app-dashboard";

require("../../../static/css/css-reset.css");
export function dashboard_run(context) {
  dayjs.extend(window.dayjs_plugin_relativeTime);
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_timezone);
  dayjs.locale("ko");

  const parsedContext = JSON.parse(context);
  console.log(parsedContext);
  const { userType, userId, userLogin } = parsedContext;

  if (!userLogin) {
    window.location.href = "../user/";
  }

  axios.defaults.headers["X-CSRFTOKEN"] = csrftoken;

  const main = document.querySelector("#main");

  const clNav = new NavManager(parsedContext);
  const clManager = new AppDashboard({ userType, userId, userLogin });

  main.append(clNav.getElement(), clManager.getElement());
}
