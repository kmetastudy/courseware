// require("../css/Button.css");
export const Button = function (name = "Click me", options = {}) {
  this.name = name;
  this.options = options;
  this._init();
};

Button.prototype._init = function () {
  this._create();
  this._initEvents();
};

Button.prototype._create = function () {
  this.button = document.createElement("button");
  this.button.classList.add("button");
  this.button.setAttribute('type','button')
  this.button.innerHTML = this.name;
};

Button.prototype._initEvents = function () {
  this.button.addEventListener("click", this.handleClick.bind(this));
};

// ============================= API =============================
Button.prototype.getRootElement = function () {
  return this.button;
};

// ============================= Handler =============================
Button.prototype.handleClick = function (evt) {
  if (this.options.onButtonClick) {
    this.options.onButtonClick(this);
  }
};
