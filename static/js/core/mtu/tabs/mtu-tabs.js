import { tabsConfig, itemConfig } from "./config";
import { adjustConfig } from "../_util/adjust-config";

import { MtuIcon } from "../icon/mtu-icon";
require("./mtu-tabs.css");

export class MtuTabs {
  static id = 0;
  constructor(options = {}) {
    this.options = adjustConfig(tabsConfig, options);
    this.items = this.options.items.map((item) => adjustConfig(itemConfig, item));
    this.id = MtuTabs.id;
    MtuTabs.id++;

    console.log(this.options);
    console.log(this.items);
    this.elItems = [];
    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elTabs = document.createElement("div");
    this.elTabs.classList.add("mtu-tabs");

    this.elTabsNav = document.createElement("div");
    this.elTabsNav.classList.add("mtu-tabs-nav");
    this.elTabsNav.setAttribute("rold", "tablist");
    this.elTabs.appendChild(this.elTabsNav);

    this.elTabsNavWrapper = document.createElement("div");
    this.elTabsNavWrapper.classList.add("mtu-tabs-nav-wrap");
    this.elTabsNav.appendChild(this.elTabsNavWrapper);

    this.elTabsNavList = document.createElement("div");
    this.elTabsNavList.classList.add("mtu-tabs-nav-list");
    this.elTabsNavWrapper.appendChild(this.elTabsNavList);

    this.items.forEach((item, idx) => {
      const elItem = this.createItem(item, idx);
      this.elTabsNavList.appendChild(elItem);
      this.elItems.push(elItem);
    });

    this.createIndicator();
  }

  createItem(config, tabIndex) {
    const tab = document.createElement("div");
    tab.classList.add("mtu-tabs-tab");
    tab.setAttribute("data-node-key", config.key);
    config.disabled ? tab.classList.add("mtu-tabs-tab-disabled") : null;
    tabIndex === 0 ? tab.classList.add("mtu-tabs-tab-active") : null;

    const tabButton = document.createElement("div");
    tabButton.classList.add("mtu-tabs-tab-btn");
    tabButton.setAttribute("id", `mtu-tabs-${this.id}-tab-${config.key}`);
    tabButton.setAttribute("aria-controls", `mtu-tabs-${this.id}-panel-${config.key}`);
    tabButton.setAttribute("role", "tab");

    this.applyItemConfig(tabButton, config);

    tab.appendChild(tabButton);
    return tab;
  }

  applyItemConfig(tabButton, config) {
    if (config.icon) {
      const wrapper = document.createElement("span");
      tabButton.appendChild(tabButton);

      const icon = MtuIcon(config.icon);
      wrapper.appendChild(icon);
      wrapper.textContent = config.title;
    } else {
      tabButton.textContent = config.title;
    }
  }

  createIndicator() {
    const indicator = document.createElement("div");
    indicator.classList.add("mtu-tabs-indicator");
    indicator.classList.add("mtu-tabs-indicator-animated");
  }

  //////////// API ////////////
  getElement() {
    return this.elTabs;
  }
}
