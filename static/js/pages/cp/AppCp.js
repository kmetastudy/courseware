import { mtoEvents } from "../../core/utils/mto-events";

import { NavManager } from "../../core/component/nav-manager";
import { SidebarManager } from "./sidebar-manager";

import { OverviewManager } from "./overview-manager";
import { EditManager } from "./edit-manager";
import { MtuBreadcrumb } from "../../core/mtu/breadcrumb/mtu-breadcrumb";
import { MtuTabs } from "../../core/mtu/tabs/mtu-tabs";

require("../../../css/pages/cp/app-cp.css");
export const AppCp = function () {
  this._create();
  this.initialize();
};

AppCp.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("app-cp");
};

AppCp.prototype.initialize = function () {
  this.navManager = new NavManager();
  this.sidebarManager = new SidebarManager();
  this.overviewManager = new OverviewManager();
  this.editManager = new EditManager();
  this.breadcrumb = new MtuBreadcrumb({
    items: [{ title: "title" }, { title: "hello?", href: "/", icon: "" }, { type: "separator", separator: ":" }],
  });
  this.tabs = new MtuTabs({
    items: [
      { title: "Tab1", key: "1" },
      { title: "Tab2", key: "2" },
    ],
  });

  this.elThis.appendChild(this.breadcrumb.getElement());
  this.elThis.appendChild(this.editManager.getElement());
  this.elThis.appendChild(this.tabs.getElement());
};

// AppCp
