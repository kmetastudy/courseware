import elem from "../../../../../core/utils/elem/elem";
import { removeChildNodes } from "../../../../../core/utils/dom";
export class CourseProcessList {
  constructor() {
    this.items = null;
    this.elThis = elem("ul", { class: "menu col-span-12 bg-100 hidden rounded-lg" });
  }

  init(items) {
    if (items && this.items === items) {
      return;
    }

    removeChildNodes(this.elThis);

    this.create(items);
  }

  create(items) {
    const elItems = items.map((item) => this.createItem(item));

    this.elThis.append(...elItems);
  }

  createItem(item) {
    const elItem = elem("li");
    if (item.child) {
      const child = this.createSubMenu(item);
      elItem.append(...child);
    } else {
      const title = elem("a", item.title);
      elItem.append(title);
    }

    return elItem;
  }

  createSubMenu(item) {
    const details = elem("details");
    const summary = elem("summary", item.title);

    const childWrapper = elem("ul");

    const elChilds = item.child.map((child) => elem("li", elem("a", child.title)));
    details.append(summary, childWrapper);
    childWrapper.append(...elChilds);

    return details;
  }
}
