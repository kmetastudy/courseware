import elem from "../../utils/elem/elem";
import { classNames } from "../../utils/class-names";
import { omit } from "../../utils/objects";
export class MtmSteps {
  constructor({ items, direction = "horizontal", initialStep = 0, scrollable = true, prefixCls } = {}) {
    this.items = items;
    this.direction = direction;
    this.initialStep = initialStep;
    this.scrollable = scrollable;
    this.prefixCls = prefixCls;

    this.currentStep = this.initialStep;
    this.elItems = [];
    this.init();
  }

  init() {
    this.create();
  }

  create() {
    if (this.scrollable) {
      this.elWrapper = elem("div", { class: "overflow-x-auto" });
    }

    this.elThis = elem("ul", {
      class: classNames(this.prefixCls, "steps", {
        vertical: this.direction === "vertical" ?? false,
      }),
    });

    this.items.forEach((itemConfig, index) => {
      this.elItems.push(this.createItem(itemConfig, index));
    });

    this.elThis.append(...this.elItems);
  }

  // {content, prefixCls, initialStep, ...attributes}
  createItem(config, index) {
    const attributes = omit(config, ["prefixCls", "initialStep", "content"]) ?? {};
    const elItem = elem(
      "li",
      {
        class: classNames("step", config?.prefixCls, {
          "step-primary": index <= this.initialStep ?? false,
        }),
        ...attributes,
      },
      config?.content,
    );

    return elItem;
  }

  setStep(step) {
    const { length } = this.elItems;
    for (let i = 0; i < length; i++) {
      if (i <= step) {
        this.elItems[i]?.classList.add("step-primary");
      } else {
        this.elItems[i]?.classList.remove("step-primary");
      }
    }

    this.currentStep = step;
  }

  getStep() {
    return this.currentStep;
  }

  getElement() {
    return this.elWrapper ?? this.elThis;
  }
}
