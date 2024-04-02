import { createElement } from "../../utils/dom-utils";
import { classNames } from "../../utils/class-names";
import { MtuIcon } from "../../mtu/icon/mtu-icon";
// Deprecated
// Planned to replaced by "MtuMenu"

require("./mtm-side-menu.css");
export class mtmSideMenu {
  constructor({ item }) {
    this.prefixCls = "mtm-side-menu";

    this.items = item;

    this.elItems = []; // [HTMLLIElement]
    this.elItemMap = new Map(); // (key, HTMLLIElement)

    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = createElement("ul", {
      className: classNames(this.prefixCls, `${this.prefixCls}-root`),
    });

    const itemNodes = this.createItems(this.items);

    this.elThis.append(...itemNodes);
  }

  createItems(items) {
    if (!Array.isArray(items)) {
      return;
    }

    const itemNodes = [];
    items.forEach((item) => {
      if (item.children) {
        const elItemGroup = this.createItemGroup(item);
        itemNodes.push(elItemGroup);
      } else {
        const elItem = this.createItem(item);

        this.elItems.push(elItem);
        item.key && this.elItemMap.set(item.key, elItem);

        itemNodes.push(elItem);
      }
    });

    return itemNodes;
  }

  createItemGroup(item) {
    const elItemGroup = createElement("li", {
      className: `${this.prefixCls}-item-group`,
      attributes: { role: "presentation" },
    });

    const elTitle = createElement("div", {
      className: `${this.prefixCls}-item-group-title`,
      attributes: { role: "presentation" },
    });
    elTitle.textContent = item.title;

    const elGroupList = createElement("ul", {
      className: `${this.prefixCls}-item-group-list`,
      attributes: { role: "group" },
    });

    const elItems = this.createItems(item.children);
    elGroupList.append(...elItems);

    elItemGroup.append(elTitle, elGroupList);

    return elItemGroup;
  }

  createItem(item) {
    const elItem = createElement("li", { className: `${this.prefixCls}-item`, attributes: "menuitem" });
    if (item.icon) {
      const elIcon = MtuIcon(item.icon);
      elItem.append(elIcon);
    }

    const elTitleContent = createElement("span", { className: `${this.prefixCls}-title-content` });
    elTitleContent.textContent = item.title;
    elItem.append(elTitleContent);

    if (item.onClick && typeof item.onClick === "function" && item.disabled !== true) {
      elItem.addEventListener("click", item.onClick);
    }

    if (item.disabled) {
      elItem.classList.add("disabled");
    }

    return elItem;
  }

  activate(key) {
    this.elItems.forEach((elItem) => elItem.classList.remove("active"));

    if (this.elItemMap.has(key)) {
      this.elItemMap.get(key).classList.add("active");
    }
  }

  getElement() {
    return this.elThis;
  }
}
//
