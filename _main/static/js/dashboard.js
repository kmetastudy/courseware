import { NavManager } from "../../../static/js/core/component/nav-manager";

export function dashboard_run(context) {
  const parsedContext = JSON.parse(context);
  const { demo, usertype, studentId, userLogin } = parsedContext;

  if (!userLogin) {
    window.location.href = "../user/";
  }

  const main = document.createElement("main");
  main.setAttribute("id", "main");

  const clNav = new NavManager(parsedContext);
  const clManager = new DashboardApp({ demo, usertype, studentId, userLogin });

  main.append(clNav.getElement(), clManager.getElement());
}
