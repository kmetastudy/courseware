import { adjustConfig } from "../../_util/adjust-config";
import { treeNodeConfig } from "./config";
import { MtuIcon } from "../../icon/mtu-icon";

export class MtuTreeNode {
  constructor(config) {
    this.options = adjustConfig(treeNodeConfig, config);
    this.initVariables();
    this.init();
  }

  initVariables() {
    if (this.options.data) {
      this.data = this.options.data;
    }
  }

  init() {
    this.create();
    this.applyConfig();
    this.applyEvents();
  }

  create() {
    this.element = document.createElement("div");
    this.element.classList.add("mtu-tree");
    this.element.setAttribute("role", "tree");
  }

  applyConfig() {
    const node = this.element;

    if (this.options.checkable) {
      node.appendChild(this.createCheckBox());
    }

    if (this.options.icon) {
      node.appendChild(this.createIcon(this.options.icon));
    }

    node.appendChild(this.createTitle(this.options.title));

    //
  }

  applyEvents() {
    if (this.options.onClick) {
      this.element.addEventListener("click", this.handleClick);
    }
  }

  createCheckBox() {}

  createIcon(name) {
    const iconElement = MtuIcon(name);
    return iconElement;
  }

  createTitle(title) {
    const titleElement = document.createElement("span");
    titleElement.classList.add("mtu-tree-title");
    titleElement.textContent = title;
    return titleElement;
  }

  ////////////////// Handler //////////////////
  handleClick(evt) {
    this.options.onClick(this.data);
  }

  handleChecked(evt) {
    evt.stopPropagation();
    if (evt.target.type !== "checkbox") {
      this.toggleItem(evt.target);
    }
  }

  ////////////////// API //////////////////

  ////////////////// Utils //////////////////
}
