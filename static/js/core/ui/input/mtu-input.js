require("../../../../css/core/ui/input/mtu-input.css");
export const mtuInput = function (options = {}) {
  this.options = options;
  this._initVariable();
  this.create();
};

mtuInput.prototype._initVariable = function () {
  this.type = this.options.type ?? "text"; // mdn: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
  this.size = this.options.size ?? "middle"; // 'large' | 'middle' | 'small'
  this.placeholder = this.options.size ?? null;
  this.className = this.options.className ?? null;
  this.prefix = this.options.prefix ?? null;
  this.suffix = this.options.suffix ?? null;
  this.onBlur = this.options.onBlur ?? null;
  this.onChange = this.options.onChange ?? null;
  this.onFocus = this.options.onFocus ?? null;
  this.disabled = this.options.disabled ?? false;
  this.defaultValue = this.options.defaultValue ?? null;
  this.allowClear = this.options.allowClear ?? false; // boolean | string(icon-name)
  this.bordered = this.options.bordered ?? true;
  this.status = this.options.status ?? null; // 'error' | 'warning'
  // this.styles = this.options.styles ??
  this.id = this.options.id ?? null;
  this.maxLength = this.options.maxLength ?? null;
};

mtuInput.prototype.create = function () {
  this.element = document.createElement("input");
  this.element.classList.add("mtu-input");

  this.element.setAttribute("type", this.type);
  this.element.setAttribute("id", this.id);
  this.element.classList.add("className", this.className);

  this.element.setAttribute("value", this.defaultValue);
  this.element.setAttribute("disabled", this.disabled);
  this.element.setAttribute("placeholder", this.placeholder);
  this.element.setAttribute("maxLength", this.maxLength);

  this.setStyle();
  this._initEvents();

  return this.element;
};

mtuInput.prototype._initEvents = function () {
  if (typeof this.options.onBlur === "function") {
    this.element.addEventListener("blur", this.options.onBlur.bind(this));
  }
  if (typeof this.options.onFocus === "function") {
    this.element.addEventListener("blur", this.options.onFocus.bind(this));
  }
};
