import { MtuIcon, isValidIconName } from "../icon/mtu-icon";

require("./mtu-button.css");
export class MtuButton {
  constructor(options = {}) {
    this.options = this._initOptions(options);
    this._init();
  }
  _initOptions(prevOption) {
    const finalOptions = {};

    this.defaultOptions = {
      text: {
        defaultValue: null,
        validate: (value) => typeof value === "string",
      },
      htmlType: {
        defaultValue: "button",
        validate: (value) => ["button", "submit", "rest"].includes(value),
      },
      type: {
        defaultValue: "default",
        validate: (value) => ["default", "primary", "dashed", "link", "text"].includes(value),
      },
      shape: {
        defaultValue: "default",
        validate: (value) => ["default", "circle", "round"].includes(value),
      },
      size: {
        defaultValue: "middle",
        validate: (value) => ["small", "middle", "large"].includes(value),
      },
      loading: {
        defaultValue: false,
        validate: (value) => typeof value === "boolean",
      },
      disabled: {
        defaultValue: false,
        validate: (value) => typeof value === "boolean",
      },
      icon: {
        defaultValue: null,
        validate: (value) => isValidIconName(value),
      },
      onClick: {
        defaultValue: null,
        validate: (value) => typeof value === "function",
      },
      onSubmit: {
        defaultValue: null,
        validate: (value) => typeof value === "function",
      },
    };

    for (let key in this.defaultOptions) {
      if (prevOption.hasOwnProperty(key) && this.defaultOptions[key].validate(prevOption[key])) {
        finalOptions[key] = prevOption[key];
      } else {
        finalOptions[key] = this.defaultOptions[key].defaultValue;
      }
    }
    return finalOptions;
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
      const iconElement = MtuIcon(this.options.icon);
      this.button.prepend(iconElement);
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
