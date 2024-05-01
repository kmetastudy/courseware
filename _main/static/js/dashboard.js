import { drawerHelper } from "../../../static/js/shared/helpers/drawer/drawer-helper";

import { AppDashboard } from "../../../static/js/pages/main/dashboard/app-dashboard";
import { NavManager } from "../../../static/js/core/component/nav-manager";
import { DrawerSide } from "../../../static/js/core/ui/DrawerSide";

require("../css/tailwind.css");
require("../../../static/css/css-reset.css");
export function dashboard_run(context) {
  dayjs.extend(window.dayjs_plugin_relativeTime);
  dayjs.extend(window.dayjs_plugin_utc);
  dayjs.extend(window.dayjs_plugin_timezone);
  dayjs.locale("ko");

  const parsedContext = JSON.parse(context);
  const { userType, userId, userLogin } = parsedContext;

  if (!userLogin) {
    window.location.href = "/";
  }

  axios.defaults.headers["X-CSRFTOKEN"] = csrftoken;

  render(parsedContext);
}

function render(parsedContext = {}) {
  const { userType, userId, userLogin } = parsedContext;

  // drawer API
  const drawer = drawerHelper();

  const root = document.querySelector("#main");
  root.classList.add("min-h-screen");

  const content = document.createElement("main");

  const navOptions = { ...parsedContext, drawer };
  const clNav = new NavManager(navOptions);
  const elNav = clNav.getElement();

  const clManager = new AppDashboard({ userType, userId, userLogin });
  const elManager = clManager.getElement();

  content.append(elNav, elManager);

  const fakeWrapper = document.createElement("div");
  const clDrawerSide = new DrawerSide({ target: fakeWrapper, props: { userType, userLogin } });
  const elDrawerSide = clDrawerSide.getElement();

  setDrawer({ root, content, side: elDrawerSide, drawer });
}

function setDrawer({ root, content, side, drawer }) {
  const { Root, Toggle, Content, Side, Overlay } = drawer;
  Root({ element: root, position: "right", forceOpen: false });
  // Toggle
  Toggle({ id: "mypage-drawer" });
  // Content
  Content({ element: content });
  // Side
  Side({ element: side });
  // Overlay
  const overlay = side.querySelector(".drawer-overlay");
  Overlay({ element: overlay });
}
