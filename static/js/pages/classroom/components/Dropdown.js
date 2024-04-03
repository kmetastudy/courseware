import elem from "../../../core/utils/elem/elem";
import { omit } from "../../../core/utils/objects";
import { removeChildNodes } from "../../../core/utils/dom";
/**
 * https://daisyui.com/components/dropdown/
 */
export class Dropdown {
  constructor({ items, placeholder = "Select", defaultKey } = {}) {
    this.items = items;
    this.placeholder = placeholder;
    this.defaultKey = defaultKey;

    this.elItems = [];
    this.init();
  }

  init() {
    this.create();

    // this.items?.forEach((item) => {
    //   const elItem = this.createItem(item);
    //   this.elItems.push(elItem);
    //   this.elContentWrapper.append(elItem);
    // });
    if (this.items) {
      this.render(this.items);
    }
  }

  create() {
    this.elThis = elem("div", { class: "dropdown" });
    this.elButton = elem("div", { class: "w-28", tabIndex: "0", role: "button" }, this.placeholder);
    this.elContentWrapper = elem("div", {
      class: "dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36",
      tabIndex: "0",
    });

    this.elThis.append(this.elButton, this.elContentWrapper);
  }

  render(items, defaultKey) {
    if (!items) {
      return;
    }

    this.items = items;
    this.elItems = items.map((item) => this.createItem(item));

    removeChildNodes(this.elContentWrapper);

    this.elContentWrapper.append(...this.elItems);

    if (defaultKey) {
      this.defaultKey = defaultKey;
    }

    this.defaultKey && this.select(this.defaultKey);
  }

  createItem(item) {
    const elItem = elem("li", elem("a", { ...omit(item, ["key", "label"]) }, item.label));
    elItem.addEventListener("click", this.handleClick.bind(this, item));

    return elItem;
  }

  handleClick(item, evt) {
    this.elButton.textContent = item.label;
    /**
     * https://github.com/saadeghi/daisyui/issues/201#issuecomment-979989571
     * Focus-within을 기반으로 하기 때문에, blur을 하면 강제로 닫을 수 있다.
     */
    this.elContentWrapper.blur();
  }

  // API
  select(key) {
    const label = this.items.find((item) => item.key === key)?.label;
    if (label) {
      this.elButton.textContent = label;
    }
  }

  addItems(items) {
    //
  }

  getElement() {
    return this.elThis;
  }
}
