import elem from "../../../core/utils/elem/elem";
import { omit } from "../../../core/utils/objects";

/**
 * https://daisyui.com/components/dropdown/
 */
export class Dropdown {
  constructor({ items, placeholder = "Select" }) {
    this.items = items;
    this.placeholder = placeholder;
    this.elItems = [];
    this.init();
  }

  init() {
    this.create();

    this.items?.forEach((item) => {
      const elItem = this.createItem(item);
      this.elItems.push(elItem);
      this.elContentWrapper.append(elItem);
    });
  }

  create() {
    this.elThis = elem("div", { class: "dropdown" });
    this.elButton = elem(
      "div",
      { class: "btn m-1 btn-outline btn-sm w-28", tabIndex: "0", role: "button" },
      this.placeholder,
    );
    this.elContentWrapper = elem("div", {
      class: "dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36",
      tabIndex: "0",
    });

    this.elThis.append(this.elButton, this.elContentWrapper);
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

  getElement() {
    return this.elThis;
  }
}
