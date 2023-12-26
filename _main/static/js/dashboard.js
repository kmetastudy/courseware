import { NavManager } from "../../../static/js/core/component/nav-manager";
import { AppDashboard } from "../../../static/js/pages/main/dashboard/app-dashboard";

require("../../../static/css/css-reset.css");
export function dashboard_run(context) {
  const parsedContext = JSON.parse(context);
  const { usertype, userId, userLogin } = parsedContext;

  if (!userLogin) {
    window.location.href = "../user/";
  }

  axios.defaults.headers["X-CSRFTOKEN"] = csrftoken;

  const main = document.querySelector("#main");

  const clNav = new NavManager(parsedContext);
  const clManager = new AppDashboard({ usertype, studentId: userId, userLogin });

  main.append(clNav.getElement(), clManager.getElement());
}
