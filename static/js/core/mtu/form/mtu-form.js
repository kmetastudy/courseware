require("./mtu-form.css");
export class MtuForm {
  constructor(items, options = {}) {
    if (!items || !typeof items === "array") {
      return new Error(`invalid items: ${items}`);
    }

    this.options = this.#initOptions(options);
    this.items = this.#initItems(items);

    this.#init();
  }

  #initOptions(prevOption) {
    const finalOptions = {};

    this.defaultOptions = {
      layout: {
        defaultValue: "horizontal",
        validate: (value) => ["horizontal", "vertical", "inline"].includes(value),
      },
      className: {
        defaultValue: null,
        validate: (value) => typeof value === "string",
      },
      name: {
        defaultValue: null,
        validate: (value) => typeof value === "string",
      },
      size: {
        defaultValue: "middle",
        validate: (value) => ["small", "middle", "large"].includes(value),
      },
      disabled: {
        defaultValue: false,
        validate: (value) => typeof value === "boolean",
      },
      name: {
        defaultValue: null,
        validate: (value) => typeof value === "string",
      },
      onFinish: {
        defaultValue: null,
        validate: (value) => typeof value === "function",
      },
      onFinishFailed: {
        defaultValue: null,
        validate: (value) => typeof value === "function",
      },
      onFieldsChange: {
        defaultValue: null,
        validate: (value) => typeof value === "function",
      },
      onValuesChange: {
        defaultValue: null,
        validate: (value) => typeof value === "function",
      },
    };

    for (let key of this.defaultOptions) {
      if (prevOption.hasOwnProperty(key) && this.defaultOptions[key].validate(prevOption[key])) {
        finalOptions[key] = prevOption[value];
      } else {
        finalOptions[key] = this.defaultOptions[key];
      }
    }

    return finalOptions;
  }

  #initItems(items) {
    console;
  }

  #init() {
    this.formElement = this.#createFormElement();

    this.#initEvents();
    // validate items
    // create form Items?
  }
  //
  #createFormElement() {
    const formElement = document.createElement("form");
    formElement.classList.add("mtu-form");

    if (this.options.className) {
      formElement.classList.add(this.options.className);
    }

    if (this.options.name) {
      formElement.setAttribute("id", this.options.name);
    }
    return formElement;
  }

  #initEvents() {
    // if (this.options.onFieldsChange)
  }
}
