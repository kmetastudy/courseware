import { MtuIcon, isValidIconName } from "../icon/mtu-icon";
import { config } from "./config";
import { adjustConfig } from "../_util/adjust-config";
require("./mtu-button.css");
export class MtuButton {
  constructor(options = {}) {
    this.options = adjustConfig(config, options);
    this._init();
  }
  _init() {
    //
    this.button = document.createElement("button");
    this.button.classList.add("mtu-btn");

    // Set options
    this.button.setAttribute("type", this.options.htmlType);

    this.button.disabled = this.options.disabled;

    this.button.classList.add(`mtu-btn-${this.options.type}`);

    if (this.options.text) {
      const textElement = this.createTextElement(this.options.text);
      this.button.appendChild(textElement);
    }

    if (this.options.shape !== "default") {
      this.button.classList.add(`mtu-btn-${this.options.shape}`);
    }

    if (this.options.size !== "middle") {
      this.button.classList.add(`mtu-btn-${this.options.size}`);
    }

    if (this.options.icon) {
      const iconWrapper = document.createElement("span");
      iconWrapper.classList.add("mtu-btn-icon");

      const iconElement = MtuIcon(this.options.icon);
      iconWrapper.appendChild(iconElement);
      this.button.prepend(iconWrapper);
    }

    if (this.options.onClick && this.options.htmlType === "button") {
      this.button.addEventListener("click", this.handleClick.bind(this));
    }

    if (this.options.onSubmit && this.options.htmlType === "submit") {
      this.button.addEventListener("submit", this.handleSubmit.bind(this));
    }
    // TODO
    // Loading 기능 넣기
    // 근데 필요한가..?
    if (this.options.loading === true) {
      // this.setLoading(this.button);
    }

    if (this.options.styles) {
      Object.entries(this.options.styles).forEach(([property, value]) => {
        this.button.style[property] = value;
      });
    }
  }

  createTextElement(text) {
    const wrapper = document.createElement("span");
    wrapper.textContent = text;
    return wrapper;
  }
  // Handler
  handleClick(evt) {
    this.options.onClick(evt);
  }

  handleSubmit(evt) {
    evt.preventDefault();
  }
  // API
  getElement() {
    return this.button;
  }
}
