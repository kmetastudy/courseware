// reference
// https://www.daleseo.com/css-toggle-switch/
require("../../../../css/core/view/component/mtm-toggle.css");
export const mtmToggle = function (options) {
  this.options = options || {};
  this.isActivated = false;
  this._init();
};

mtmToggle.prototype._init = function () {
  this._create();
  this._initEvents();
};

mtmToggle.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtm-toggle");

  this.elLabel = document.createElement("label");
  this.elLabel.classList.add("mtm-toggle-label");
  this.elThis.appendChild(this.elLabel);

  this.elInput = document.createElement("input");
  this.elInput.classList.add("mtm-toggle-input");
  this.elInput.setAttribute("role", "switch");
  this.elInput.setAttribute("type", "checkbox");
  this.elLabel.appendChild(this.elInput);

  this.elTitle = document.createElement("span");
  this.elTitle.classList.add("mtm-toggle-title");
  this.elLabel.appendChild(this.elTitle);
};

mtmToggle.prototype._initEvents = function () {
  this.elThis.addEventListener("click", this.handleClick.bind(this));
};

// ===============================================================
// ========================== Handler ============================
// ===============================================================
mtmToggle.prototype.handleClick = function () {
  this.elThis.classList.toggle("active");
  this.setIsActivated();

  if (this.options.onToggleClick) {
    this.options.onToggleClick(this.isActivated);
  }
};

// ===============================================================
// =========================== API ===============================
// ===============================================================
mtmToggle.prototype.setTitle = function (title) {
  this.elTitle.innerHTML = title;
};
// ===============================================================
// =========================== Tool ==============================
// ===============================================================
mtmToggle.prototype.activate = function () {
  this.elInput.checked = true;

  if (this.options.onToggleActivate) {
    this.options.onToggleActivate();
  }
  this.setIsActivated();
};

mtmToggle.prototype.deActivate = function () {
  this.elInput.checked = false;

  if (this.options.onToggleDeActivate) {
    this.options.onToggleDeActivate();
  }
  this.setIsActivated();
};

mtmToggle.prototype.setIsActivated = function () {
  this.isActivated = this.elInput.checked;
};
