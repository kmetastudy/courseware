import { createElement } from "../../../../core/utils/dom-utils";
import { classNames } from "../../../../core/utils/class-names";
import { isObject } from "../../../../core/mtu/_util/type-check";

import { dashboardAnchor } from "./dashboard-anchor";
import { dashboardTitle } from "./dashboard-title";

require("./dashboard-header.css");
export function dashboardHeader({ className, title, anchor }) {
  const elHeader = createElement("div", {
    className: classNames(className, "dashboard-header"),
  });

  if (isObject(title)) {
    const elTitle = dashboardTitle({ ...title });
    elHeader.appendChild(elTitle);
  }

  if (isObject(anchor)) {
    const elAnchor = dashboardAnchor({ ...anchor });
    elHeader.appendChild(elAnchor);
  }

  return elHeader;
}
