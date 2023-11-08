import { MtuIcon, isValidIconName } from "../icon/mtu-icon";

require("./mtu-input.css");
export class MtuInput {
  constructor(options) {
    this.element = null;

    this.input = null;
    this.wrapperElement = null;
    this.elSuffix = null;
    this.elPrefix = null;

    this.defaultOptions = this.#getConfig();

    this.options = this.#getConfiguredOptions(options);

    this.#create();
  }

  #getConfig() {
    const config = {
      type: {
        defaultValue: "text",
        validate: (value) => typeof value === "string",
      },
      size: {
        defaultValue: "middle",
        validate: (value) => ["small", "middle", "large"].includes(value),
      },
      prefix: {
        defaultValue: null,
        validate: (value) => isValidIconName(value),
      },
      suffix: {
        defaultValue: null,
        validate: (value) => isValidIconName(value),
      },
      name: {
        defaultValue: null,
        validate: (value) => typeof value === "string",
      },
      value: {
        defaultValue: null,
        validate: (value) => typeof value === "string",
      },
      fixedValue: {
        // value를 수정 못하게 고정해야되는 경우
        defaultValue: null,
        validate: (value) => typeof value === "string",
      },
      placeholder: {
        defaultValue: null,
        validate: (value) => typeof value === "string",
      },
      maxLength: {
        default: null,
        validate: (value) => typeof value === "number",
      },
      disabled: {
        defaultValue: false,
        validate: (value) => typeof value === "boolean",
      },
      className: {
        defaultValue: null,
        validate: (value) => typeof value === "string",
      },
      onClick: {
        defaultValue: null,
        validate: (value) => typeof value === "function",
      },
      onBlur: {
        defaultValue: null,
        validate: (value) => typeof value === "function",
      },
      onFocus: {
        defaultValue: null,
        validate: (value) => typeof value === "function",
      },
    };

    return config;
  }

  #getConfiguredOptions(userOptions = {}) {
    const configuredOptions = {};

    for (let key in this.defaultOptions) {
      if (userOptions.hasOwnProperty(key) && this.defaultOptions[key].validate(userOptions[key])) {
        configuredOptions[key] = userOptions[key];
      } else {
        configuredOptions[key] = this.defaultOptions[key].defaultValue;
      }
    }

    return configuredOptions;
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
