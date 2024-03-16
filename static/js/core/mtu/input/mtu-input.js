import { MtuIcon } from "../icon/mtu-icon";
import { config } from "./config";
import { adjustConfig } from "../_util/adjust-config";
require("./mtu-input.css");
export class MtuInput {
  constructor(options) {
    this.options = adjustConfig(config, options);

    this.element = null;

    this.input = null;
    this.wrapperElement = null;
    this.elSuffix = null;
    this.elPrefix = null;

    this.#create();
  }

  #create() {
    this.createInput();

    this.applyAttributes();

    this.setEvents();
  }

  createInput() {
    this.input = document.createElement("input");
    this.input.classList.add("mtu-input");
    this.element = this.input;
  }

  applyAttributes() {
    this.input.setAttribute("type", this.options.type);
    this.input.disabled = this.options.disabled;

    if (this.options.size) {
      this.input.classList.add(`mtu-input-${this.options.size}`);
    }

    if (this.options.value) {
      this.input.value = this.options.value;
    }

    if (this.options.fixedValue) {
      this.input.value = this.options.fixedValue;
      this.input.setAttribute("readonly", "");
    }

    if (this.options.maxLength) {
      this.input.setAttribute("maxLength", this.options.maxLength);
    }

    if (this.options.placeholder) {
      this.input.setAttribute("placeholder", this.options.placeholder);
    }

    if (this.options.className) {
      // this.input.classList.add(this.options.className);
    }

    if (this.options.name) {
      this.input.setAttribute("name", this.options.name);
    }

    if (this.options.required) {
      this.input.setAttribute("required", this.options.required);
    }

    if (this.options.autocomplete) {
      this.input.setAttribute("autocomplete", this.options.autocomplete);
    }

    const hasAffix = this.options.prefix || this.options.suffix;
    if (hasAffix) {
      const size = this.options.size;
      const affixWrapper = this.createWrapper("affix", size);

      affixWrapper.appendChild(this.input);
      this.element = affixWrapper;

      this.createAffix(affixWrapper);
    }
  }

  createWrapper(type, size) {
    const wrapper = document.createElement("span");
    wrapper.classList.add(`mtu-input-${type}-wrapper`);

    if (size === "large" || size === "small") {
      wrapper.classList.add(`mtu-input-${type}-wrapper-${size}`);
    }
    return wrapper;
  }

  createAffix(parent) {
    if (this.options.prefix) {
      this.elPrefix = document.createElement("span");
      this.elPrefix.classList.add("mtu-input-prefix");

      const prefixIcon = MtuIcon(this.options.prefix);
      this.elPrefix.appendChild(prefixIcon);

      parent.prepend(this.elPrefix);
    }
    //
    if (this.options.suffix) {
      this.elSuffix = document.createElement("span");
      this.elSuffix.classList.add("mtu-input-suffix");

      const suffixIcon = MtuIcon(this.options.suffix);
      this.elSuffix.appendChild(suffixIcon);

      parent.appendChild(this.elSuffix);
    }
  }

  setEvents() {
    if (this.options.onClick) {
      this.input.addEventListener("click", this.options.onClick());
    }
    if (this.options.onBlur) {
      this.input.addEventListener("blur", this.options.onBlur());
    }
    if (this.options.onFocus) {
      this.input.addEventListener("focus", this.options.onFocus());
    }
  }

  // API
  getElement() {
    return this.element;
  }
}
