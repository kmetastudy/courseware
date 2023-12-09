import { sidebarConfig, sidebarItemConfig } from "./config";
import { mtoEvents } from "../../utils/mto-events";
import { adjustConfig } from "../_util/adjust-config";
import { MtuIcon } from "../icon/mtu-icon";
import { isElement } from "../_util/type-check";
import { wrapElement } from "../../utils/dom-utils";

require("./mtu-sidebar.css");
export class MtuSidebar {
  constructor(options) {
    this.options = adjustConfig(sidebarConfig, options);
    this.itemConfigs = this.options.items.map((itemConfig) => adjustConfig(sidebarItemConfig, itemConfig));

    this.position = this.options.position;
    this.items = [];

    this.init();
  }

  init() {
    this.create();

    this.setEvents();

    if (this.items.length > 0) {
      setTimeout(() => {
        /**
         * To calculate width of dom element
         * check setAsidePosition
         */
        this.activate(this.items[0]);
      }, 0);
    }
  }

  create() {
    this.sidebar = document.createElement("div");
    this.sidebar.classList.add("mtu-sidebar");
    this.sidebar.classList.add(`mtu-sidebar-${this.position}`);

    this.itemWrapper = document.createElement("ul");
    this.itemWrapper.classList.add("mtu-sidebar-item-wrapper");
    // this.options.styles ? this.itemWrapper.setAttribute("style", this.options.styles) : null;
    this.sidebar.appendChild(this.itemWrapper);

    this.itemConfigs.forEach((config, idx) => {
      const elItem = this.createItem(config);
      this.itemWrapper.appendChild(elItem);
      const aside = this.getValidElement(config.aside);

      const asideWrapper = this.createAsideWrapper(aside);
      this.items.push({ element: elItem, aside: asideWrapper, isActivate: false });
      console.log(this.items);
    });
  }

  createItem({ title, icon }) {
    if (!title) {
      return;
    }

    const elItem = document.createElement("li");
    elItem.classList.add("mtu-sidebar-item");
    elItem.setAttribute("aria-current", "false");

    const elTitle = document.createElement("p");
    elTitle.textContent = title;
    elItem.appendChild(elTitle);

    if (icon) {
      const elIcon = MtuIcon(icon);
      elItem.prepend(elIcon);
    }

    return elItem;
  }

  createAsideWrapper(aside) {
    const elAside = document.createElement("aside");
    elAside.classList.add("mtu-sidebar-aside");

    if (aside) {
      wrapElement(aside, elAside);
    }
    return elAside;
  }

  //////////// Handler ////////////
  setEvents() {
    this.items.forEach((item) => {
      item.element.addEventListener("click", this.handleItemClick.bind(this, item));
    });
    mtoEvents.on("onAsideClose", this.handleAsideClose.bind(this));
  }

  handleItemClick(item, evt) {
    item.isActivate ? this.deactivate(item) : this.activate(item);
  }

  // mtoEvents
  // If user gives item.aside, then we wrap this.
  // So "this.items[0].aside" is actually wrapper
  // So "realAside" is the child of "this.items[0].aside"
  // Need to Fix
  handleAsideClose(realAside) {
    const targetItem = this.items.find((item) => item.aside.contains(realAside));
    if (targetItem) {
      this.deactivate(targetItem);
    }
  }

  handleAsidePositionChange(aside) {
    // need to change margin of main(e.g. study-builder)
    const totalWidth = this.sidebar.offsetWidth + aside.offsetWidth;

    const param = {
      width: totalWidth,
      position: this.position,
    };

    mtoEvents.emit("onAsidePositionChange", param);
  }

  //////////// API ////////////
  activate(item) {
    const aside = item.aside;

    this.activateItem(item);
    this.openAside(aside);
  }

  deactivate(item) {
    const aside = item.aside;

    this.deactivateItem(item);
    this.closeAside(aside);
  }

  activateItem(targetItem) {
    this.items.forEach((item) => {
      this.deactivateItem(item);
    });

    const itemElement = targetItem.element;

    itemElement.classList.add("activate");
    targetItem.isActivate = true;
  }

  deactivateItem(targetItem) {
    const itemElement = targetItem.element;
    itemElement.classList.remove("activate");
    targetItem.isActivate = false;
  }

  openAside(aside) {
    this.items.forEach((item) => {
      item.aside ? this.closeAside(item.aside) : null;
    });

    if (aside) {
      aside.classList.add("activate");
      this.setAsidePosition(aside);
    }
  }

  closeAside(aside) {
    if (aside) {
      aside.classList.remove("activate");
      this.setAsidePosition(aside);
    }
  }

  setAsidePosition(aside) {
    const width = this.sidebar.offsetWidth;
    aside.setAttribute("style", `${this.position}: ${width}px;`);

    console.log("setAsidePosition, width: ", width);

    this.handleAsidePositionChange(aside);
  }

  getElement() {
    return this.sidebar;
  }
  // Utils
  getValidElement(element) {
    if (isElement(element)) {
      return element;
    }

    if (typeof element === "string") {
      return document.querySelector(element);
    }

    return null;
  }
}
