import { NavManager } from "../../../static/js/core/component/nav-manager";
import { AppStats } from "../../../static/js/pages/main/stats/app-stats";

require("../../../static/css/css-reset.css");
export function stats_run(context) {
  const parsedContext = JSON.parse(context);
  const { usertype, userId, userLogin, courseId } = parsedContext;

  if (!userLogin) {
    window.location.href = "../user/";
  }

  axios.defaults.headers["X-CSRFTOKEN"] = csrftoken;

  const main = document.querySelector("#main");

  const clNav = new NavManager(parsedContext);
  const clAppStats = new AppStats({ usertype, studentId: userId, userLogin, courseId });

  main.append(clNav.getElement(), clAppStats.getElement());
}
