const counter = 0;

require("../../../css/core/ui/text-input-outlined.css");
export const textInputOutlined = function (options) {
  this.options = options;
  this._init();
};

textInputOutlined.prototype._init = function () {
  this._iniVariables();
  this._create();
  this._initEvents();
};

textInputOutlined.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("text-input-outlined-root");

  this.elLabel = document.createElement("label");
  this.elLabel.classList.add("text-input-outlined-label");
  this.elLabel.setAttribute("for", `text-input-outlined-${counter}`);
  this.elLabel.setAttribute("id", `text-input-outlined-label-${counter}`);
  this.elLabel.innerHTML = this.label;
  this.elThis.appendChild(this.elLabel);

  this.elWrapper = document.createElement("div");
  this.elWrapper.classList.add("text-input-outlined-wrapper");
  this.elThis.appendChild(this.elWrapper);

  this.elTextInput = document.createElement("input");
  this.elTextInput.classList.add("text-input-outlined");
  this.elTextInput.setAttribute("id", `text-input-outlined-${counter}`);
  this.elTextInput.setAttribute("aria-invalid", "false");
  this.elTextInput.setAttribute("type", "text");
  this.elTextInput.setAttribute("value", "");
  this.elWrapper.appendChild(this.elTextInput);

  this.elFieldSet = document.createElement("fieldset");
  this.elFieldSet.classList.add("text-input-outlined-fieldset");
  this.elFieldSet.setAttribute("aria-hidden", "true");
  this.elWrapper.appendChild(this.elFieldSet);

  this.elLegend = document.createElement("legend");
  this.elLegend.classList.add("text-input-outlined-legend");
  this.elFieldSet.appendChild(this.elLegend);

  this.elSpan = document.createElement("span");
  this.elSpan.innerHTML = this.label;
  this.elLegend.appendChild(this.elSpan);
};

textInputOutlined.prototype._iniVariables = function () {
  this.label = "text";
  if (this.options && this.options.label) {
    this.label = this.options.label;
  }

  this.value = "";
};

textInputOutlined.prototype._initEvents = function () {
  this.elTextInput.addEventListener("focus", this.onFocusHandler.bind(this));
  this.elTextInput.addEventListener("blur", this.onBlurHandler.bind(this));
  this.elTextInput.addEventListener("keydown", this.onKeyDownHandler.bind(this));
  this.elTextInput.addEventListener("input", this.onInputHandler.bind(this));
};

// Handler
textInputOutlined.prototype.onFocusHandler = function (evt) {
  if (evt.target !== this.elTextInput) {
    return;
  }

  if (this.value === "") {
    this.elLabel.classList.add("active");
    this.elFieldSet.classList.add("active");
    this.elLegend.classList.add("active");
    return;
  }

  this.elFieldSet.classList.add("active");
};

textInputOutlined.prototype.onBlurHandler = function (evt) {
  if (this.elTextInput !== evt.target) {
    console.log("inaccurate target: " + evt.target);
    return;
  }
  this.blur();

  if (this.options && this.options.eventBlur) {
    this.options.eventBlur(this.getValue());
  }

  // 4023+8033
};

textInputOutlined.prototype.onKeyDownHandler = function (evt) {
  if (evt.defaultPrevented) {
    return;
  }

  if (this.elTextInput !== evt.target) {
    console.log("inaccurate target: " + evt.target);
    return;
  }

  if (evt.keyCode !== 9 && evt.keyCode !== 13 && evt.keyCode !== 27) {
    return;
  }

  this.blur();
};

textInputOutlined.prototype.onInputHandler = function (evt) {
  if (this.options && this.options.eventInput) {
    this.options.eventInput(evt.target.value);
  }
};

textInputOutlined.prototype.blur = function () {
  this.elTextInput.blur();
  this.saveValue();
  if (this.value === "") {
    this.elLabel.classList.remove("active");
    this.elFieldSet.classList.remove("active");
    this.elLegend.classList.remove("active");
    return;
  }

  this.elFieldSet.classList.remove("active");
  this.elLabel.style.color = "rgba(0, 0, 0, 0.6)";
};

textInputOutlined.prototype.saveValue = function () {
  this.value = this.elTextInput.value;
};

textInputOutlined.prototype.getValue = function () {
  return this.value;
};

textInputOutlined.prototype.getRootElement = function () {
  return this.elThis;
};

textInputOutlined.prototype.setValue = function (value) {
  this.elTextInput.value = value;
  this.saveValue();

  this.elTextInput.blur();
  this.elLabel.classList.add("active");
  this.elLegend.classList.add("active");
  this.elFieldSet.classList.remove("active");
  this.elLabel.style.color = "rgba(0, 0, 0, 0.6)";
};

textInputOutlined.prototype.resetValue = function () {
  this.elTextInput.value = "";
  this.blur();
};
