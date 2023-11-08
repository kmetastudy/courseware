require("../../../../css/core/ui/button/mtu-button.css");
export const mtuButton = function (options) {
  this.options = {};

  this.type = "default";
  this.shape = "default";
  this.size = "middle";
  this.loading = false;
  this.disabled = false;
  this.htmlType = "button";

  this.options = this._initOptions(options);
  this._init();
};

mtuButton.prototype._init = function () {
  // this._initVariables();
  console.log(this.options);
};

mtuButton.prototype._initOptions = function (prevOption) {
  const finalOptions = {};

  this.defaultOptions = {
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
    onClick: {
      default: null,
      validate: (value) => typeof value === "function",
    },
    htmlType: {
      defaultValue: "button",
      validate: (value) => ["submit", "rest", "button"].includes(value),
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
};
