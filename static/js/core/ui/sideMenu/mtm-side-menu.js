import elem from "../../utils/elem/elem";
import { classNames } from "../../utils/class-names";
import { MtuIcon } from "../../mtu/icon/mtu-icon";
import { isFunction } from "../../utils/type";

export class mtmSideMenu {
  constructor({ item }) {
    this.items = item;

    this.elItemMap = new Map(); // (key, HTMLLIElement)

    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("aside", { class: "h-dvh z-10" });

    this.elNav = elem("nav", {
      class: "lg:flex hidden my-12 min-h-screen w-72 flex-col gap-2 overflow-y-auto bg-base-100 px-6 py-10 lg:my-0",
    });
    this.elThis.append(this.elNav);

    this.elMenu = elem("ul", { class: "menu menu-lg min-h-full" });
    this.elNav.append(this.elMenu);

    const itemNodes = this.createItemNodes(this.items);

    itemNodes.length > 0 && this.elMenu.append(...itemNodes);
  }

  createItemNodes(items = []) {
    const itemNodes = items
      .filter((item) => !!item.title)
      .map(({ title, child = [], key, icon, onClick, disabled = false }) => {
        const elItem = elem("li", { class: classNames({ disabled: disabled === true }) });

        isFunction(onClick) && !disabled && elItem.addEventListener("click", onClick);

        // Title
        let elTitle;

        if (child.length > 0) {
          elTitle = elem("h2", { class: "menu-title" }, title);
          elItem.append(elTitle);

          // Child
          const elChildContainer = elem("ul");
          elItem.append(elChildContainer);

          const elChildNodes = this.createItemNodes(child);
          elChildContainer.append(...elChildNodes);
        } else {
          elTitle = elem("a", title);
          elItem.append(elTitle);
        }

        // Icon
        icon && elTitle.prepend(MtuIcon(icon));

        key && this.elItemMap.set(key, elItem);

        return elItem;
      });

    return itemNodes;
  }

  activate(key) {
    this.elItemMap.forEach((elItem, itemKey) => {
      const elTitle = elItem.querySelector("h2") || elItem.querySelector("a");
      itemKey === key ? elTitle.classList.add("bg-primary-content") : elTitle.classList.remove("bg-primary-content");
    });
  }

  getElement() {
    return this.elThis;
  }
}
//
