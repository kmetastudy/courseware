import { MtuIcon, isValidIconName } from "../../../../core/mtu/icon/mtu-icon";
import { createElement } from "../../../../core/utils/dom-utils";
import { classNames } from "../../../../core/utils/class-names";

require("./dashboard-anchor.css");
export function dashboardAnchor({ title = "전체 보기", icon = "right", url, className }) {
  const iconName = isValidIconName(icon) ? icon : "right";
  const titleContent = typeof title === "string" ? title : "전체 보기";
  const href = typeof url === "string" ? url : "#";

  const prefixCls = "dashboard-anchor";

  const attributes = { href };

  const elAnchor = createElement("div", {
    className: prefixCls,
  });

  const elLink = createElement("a", {
    className: classNames(className, `${prefixCls}-link`),
    attributes,
  });

  const elTitle = createElement("span", {
    className: `${prefixCls}-link-title`,
  });
  elTitle.textContent = titleContent;

  const elIcon = MtuIcon(iconName);
  elIcon.classList.add(`${prefixCls}-link-icon`);

  elAnchor.appendChild(elLink);
  elLink.append(elTitle, elIcon);
  return elAnchor;
}
