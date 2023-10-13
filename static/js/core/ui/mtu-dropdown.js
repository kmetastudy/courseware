require("../../../css/core/ui/mtu-dropdown.css");
export const mtuDropdown = function (items = [], options = {}) {
  this.items = items; //[name1, name2,]
  this.elItems = [];
  this.options = options;
  this.itemRegistry = {};

  this._init();
};

mtuDropdown.prototype._init = function () {
  this._initOptions();
  this._create();
  this._initEvents();
  this._initCreateItem();
};

mtuDropdown.prototype._initOptions = function () {
  const defaultPlaceholder = "Select!";
  this.placeholder = this.options.placeholder || defaultPlaceholder;
};

mtuDropdown.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("mtu-dropdown");

  this.elTextBox = document.createElement("input");
  this.elTextBox.classList.add("text-box");
  this.elTextBox.setAttribute("type", "text");
  this.elTextBox.setAttribute("placeholder", this.placeholder);
  this.elTextBox.setAttribute("readonly", "");
  this.elThis.appendChild(this.elTextBox);

  // TODO
  // simplebar (scroll)적용
  this.elItemContainer = document.createElement("div");
  this.elItemContainer.classList.add("items");
  this.elThis.appendChild(this.elItemContainer);
};

mtuDropdown.prototype._initEvents = function () {
  this.elThis.addEventListener("click", this.handleClick.bind(this));
  this.elTextBox.addEventListener("blur", this.handleBlur.bind(this));
};

mtuDropdown.prototype._initCreateItem = function () {
  const items = this.items;
  items.forEach((item) => {
    this.createItem(item.title);
  });
};

mtuDropdown.prototype.addItemEvents = function (elItem, name) {
  elItem.addEventListener("click", this.handleItemClick.bind(this, name));
  elItem.addEventListener("mousedown", this.handleItemMouseDown.bind(this));
};
// ===============================================================
// =========================== Handler ===========================
// ===============================================================
mtuDropdown.prototype.handleClick = function (evt) {
  this.elThis.classList.toggle("active");
};

// Blur event stops click event
// https://stackoverflow.com/questions/9335325/blur-event-stops-click-event-from-working
// 해결
// https://coffeeandcakeandnewjeong.tistory.com/70
mtuDropdown.prototype.handleBlur = function (evt) {
  this.elThis.classList.remove("active");
};

mtuDropdown.prototype.handleItemClick = function (name, evt) {
  console.log(evt.target);
  const index = this.elItems.indexOf(evt.target);
  const data = this.items[index];
  this.elTextBox.value = name;
  if (this.options.onItemClick) {
    this.options.onItemClick(data);
  }
};

mtuDropdown.prototype.handleItemMouseDown = function (evt) {
  evt.preventDefault();
};
// ===============================================================
// ============================= API =============================
// ===============================================================
mtuDropdown.prototype.createItem = function (name) {
  const elItem = this.createItemElement(name);
  this.addItemEvents(elItem, name);
  this.storeItem(elItem, name);
  this.elItemContainer.appendChild(elItem);
};

mtuDropdown.prototype.select = function (name) {
  const hasItem = this.itemRegistry.hasOwnProperty(name);
  if (!hasItem) {
    console.log(`no item named: ${name}`);
    return;
  }

  this.handleItemClick(name);
};

mtuDropdown.prototype.reset = function () {
  this.elTextBox.value = null;
  this.elThis.classList.remove("active");
};

mtuDropdown.prototype.getElement = function () {
  return this.elThis;
};
// ===============================================================
// ============================ TOOL =============================
// ===============================================================
mtuDropdown.prototype.createItemElement = function (name) {
  const elItem = document.createElement("div");
  const span = document.createElement("span");
  span.textContent = name;
  elItem.appendChild(span);
  return elItem;
};

mtuDropdown.prototype.storeItem = function (elItem, name) {
  this.elItems.push(elItem);
  const index = Array.from(this.elItemContainer.children).indexOf(elItem);
  this.itemRegistry[name] = {
    element: elItem,
    index: index,
  };
};
