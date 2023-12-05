import { MtuIcon, isValidIconName } from "../../../../core/mtu/icon/mtu-icon";
import { classNames } from "../../../../core/utils/class-names";
import { createElement } from "../../../../core/utils/dom-utils";

require("./dashboard-anchor.css");
export function dashboardTitle({ title, icon, className, onClick }) {
  const titleContent = typeof title === "string" ? title : "Dashboard";
  const iconName = isValidIconName(icon) ? icon : null;
  const onClickEvent = typeof onClick === "function" ? onClick : null;

  const prefixCls = "dashboard-title";

  // Create
  const elTitle = createElement("div");
  elTitle.className = prefixCls;

  const elTitleContent = createElement("p", {
    className: classNames(className, `${prefixCls}-content`),
  });
  elTitleContent.textContent = titleContent;

  elTitle.appendChild(elTitleContent);

  if (iconName) {
    const elIcon = new MtuIcon(iconName);
    elIcon.classList.add(`${prefixCls}-icon`);
    elTitle.appendChild(elIcon);
  }

  return elTitle;
}
