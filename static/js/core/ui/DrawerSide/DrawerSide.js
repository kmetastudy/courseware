import { Component } from "../../../shared/lib/components";
import elem from "../../utils/elem/elem";

import { DrawerSideModel } from "./DrawerSideModel";
export class DrawerSide extends Component {
  /**
   *
   * @param {object} param
   * @param {HTMLElement} param.target
   * @param {object} param.props
   * @param {number} param.props.userType
   * @param {boolean} param.props.userLogin
   */
  constructor({ target, props }) {
    super({ target, props, model: new DrawerSideModel({ ...props }) });
  }

  template() {
    const menuItems = this.$model.getMenuItems();

    const itemNodes = this.createItemNodes(menuItems) ?? [];

    const itemNodeStrings = itemNodes.map((itemNode) => itemNode.outerHTML);

    const hasItem = itemNodeStrings.length > 0;

    return `
    <aside class="drawer-side z-[80]">
        <label class="drawer-overlay"></label>
        <nav class="flex min-h-screen w-72 flex-col gap-2 overflow-y-auto bg-base-100 px-6 py-10">
            ${false ? `<div class="mx-4 flex items-center gap-2 font-black"></div>` : ""}
            <ul class="menu menu-lg grow" data-component="drawer-side-menu">
                ${hasItem ? itemNodeStrings.join("") : ""}
            </ul>
        </nav>
    </aside>
    `;
  }

  createItemNodes(items = []) {
    const { length } = items;
    const itemNodes = items
      .filter((item) => !!item.text)
      .map(({ text, child = [], key, icon, disabled = false }, index) => {
        const elItem = elem("li");
        if (disabled) {
          elItem.classList.add("disabled");
        }

        if (index === length - 1) {
          elItem.classList.add("mt-auto");
        }

        // Title
        let elTitle;

        if (child.length > 0) {
          elTitle = elem("h2", { class: "menu-title" }, text);
          elItem.append(elTitle);

          // Child
          const elChildContainer = elem("ul");
          elItem.append(elChildContainer);

          const elChildNodes = this.createItemNodes(child);
          elChildContainer.append(...elChildNodes);
        } else {
          elTitle = elem("a", text);
          elItem.append(elTitle);
        }

        // Icon
        icon && elTitle.prepend(icon);

        // key && this.elItemMap.set(key, elItem);
        key && elItem.setAttribute("data-drawer-key", key);

        return elItem;
      });

    return itemNodes;
  }

  setEvent() {}

  mounted() {
    // return;
    const items = this.$model.getMenuItems();

    items.forEach(({ key, on }) => {
      if (!key || !on) {
        return;
      }

      const item = this.$target.querySelector(`[data-drawer-key='${key}']`);
      if (item) {
        for (const [event, handler] of Object.entries(on)) {
          item.addEventListener(event, handler);
        }
      }
    });
  }

  getElement() {
    return this.$target?.children[0];
  }
}
