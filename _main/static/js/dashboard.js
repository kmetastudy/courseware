import { NavManager } from "../../../static/js/core/component/nav-manager";
import { AppDashboard } from "../../../static/js/pages/main/dashboard/app-dashboard";
export function dashboard_run(context) {
  const parsedContext = JSON.parse(context);
  const { usertype, studentId, userLogin } = parsedContext;

  if (!userLogin) {
    window.location.href = "../user/";
  }

  const main = document.querySelector("#main");

  const clNav = new NavManager(parsedContext);
  const clManager = new AppDashboard({ usertype, studentId, userLogin });

  main.append(clNav.getElement(), clManager.getElement());
}
