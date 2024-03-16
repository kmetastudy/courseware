import { mtoEvents } from "../../core/utils/mto-events";

import { NavManager } from "../../core/component/nav-manager";
import { SidebarManager } from "./sidebar-manager";

import { OverviewManager } from "./overview-manager";
import { EditManager } from "./edit-manager";
import { MtuBreadcrumb } from "../../core/mtu/breadcrumb/mtu-breadcrumb";
import { createTabs } from "../../core/mtu/tab";
require("../../../css/pages/cp/app-cp.css");
export const AppCp = function () {
  this._create();
  this.initialize();
};

AppCp.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("app-cp");

  const tabs = createTabs();
  const root = tabs.Root({ defaultValue: "tab1" });
  const tabsList = tabs.List();
  const trigger1 = tabs.Tab({ value: "tab1", child: "개요" });
  const trigger2 = tabs.Tab({ value: "tab2", child: "커리큘럼" });
  const content1 = tabs.Panel({ value: "tab1", child: "content1" });
  const content2 = tabs.Panel({ value: "tab2", child: "content2" });

  tabsList.append(trigger1, trigger2);
  root.append(tabsList, content1, content2);

  this.elThis.append(root);
};

AppCp.prototype.initialize = function () {
  this.navManager = new NavManager();
  this.sidebarManager = new SidebarManager();
  this.overviewManager = new OverviewManager();
  this.editManager = new EditManager();
  this.breadcrumb = new MtuBreadcrumb({
    items: [{ title: "title" }, { title: "hello?", href: "/", icon: "" }, { type: "separator", separator: ":" }],
  });

  this.elThis.appendChild(this.breadcrumb.getElement());
  this.elThis.appendChild(this.editManager.getElement());
};

// AppCp
