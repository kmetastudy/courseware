import isHTMLNode from "../../../../core/utils/type/isHTMLNode";
import isString from "../../../../core/utils/type/isString";
import isFunction from "../../../../core/utils/type/isFunction";

import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";
import { createElement } from "../../../../core/utils/dom-utils";

require("../../../../../css/pages/st/study/mobile/tab-bar.css");
export class TabBar {
  constructor(items) {
    this.items = items;

    this.prefixCls = "study-mobile-tabbar";
    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = createElement("div", { className: this.prefixCls });
    this.elItems = this.createItems();

    this.elThis.append(this.elItems);
  }

  createItems() {
    this.elItems = createElement("ul", { className: `${this.prefixCls}-items` });

    this.items.forEach((param) => {
      const elItem = this.createItem(param);
      this.elItems.appendChild(elItem);
    });

    return this.elItems;
  }

  createItem({ text, icon, onClick }) {
    const elItem = createElement("li", {
      className: `${this.prefixCls}-item`,
      attributes: { "aria-current": false },
    });

    const elWrapper = createElement("button", { className: `${this.prefixCls}-item-wrapper` });

    let elIcon = createElement("span");
    if (isHTMLNode(icon)) {
      elIcon = icon;
    } else if (isString(icon)) {
      const iconNode = MtuIcon(icon);
      isHTMLNode(iconNode) ? (elIcon = iconNode) : null;
    }
    elIcon ? elWrapper.append(elIcon) : null;

    const elText = createElement("span");
    text ? (elText.textContent = text) : null;
    elWrapper.append(elText);

    if (isFunction(onClick)) {
      elItem.addEventListener("click", onClick);
    }

    elItem.append(elWrapper);

    return elItem;
  }

  // ============ API ============
  getElement() {
    return this.elThis;
  }
}
