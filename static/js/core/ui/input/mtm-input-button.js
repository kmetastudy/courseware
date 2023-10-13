require("../../../../css/core/ui/input/mtm-input-button.css");

import { mtoElementBuilder } from "../../utils/mto-element-builder.js";

// options = font-family , font-size , font-weight
export var mtmInputButton = function (options) {
  this.id = "id-mtm-input-button-" + mtmInputButton.id++;
  this.options = options;
  this.elThis = null;

  this.elCompList = null;
  this.elsArray = ["elThis", "elIcon", "elText"];
  this.elsObject = {};

  this._init();
};

mtmInputButton.id = 0;
mtmInputButton.staticBody = [
  { step: 0, tag: "button", class: "mtm-input-button mtm-input-button-default", attr: { type: "button" } },
  { step: 1, tag: "i", class: "fa fa-magic" },
  { step: 0, text: " 새로 만들기" },
];

mtmInputButton.prototype._prepare = function () {
  var text = "";
  var iClass = "";
  var btnClass = "mtm-input-button mtm-input-button-default";
  var id = this.id;

  if (this.options && this.options.text) text = this.options.text;

  if (this.options && this.options.iClass) iClass = this.options.iClass;

  if (this.options && this.options.btnClass) btnClass = this.options.btnClass;

  mtmInputButton.staticBody[0]["id"] = id;
  mtmInputButton.staticBody[0]["class"] = btnClass;
  mtmInputButton.staticBody[1]["class"] = iClass;
  mtmInputButton.staticBody[2]["text"] = text;
};

mtmInputButton.prototype._matchElements = function () {
  for (var i = 0; i < this.elsArray.length; i++) {
    if (this.elsArray[i]) this.elsObject[this.elsArray[i]] = this.elCompList[i];
  }
};

/* <button type="button" class="btn btn-outline-primary">Primary</button>
<button type="button" class="btn btn-outline-secondary">Secondary</button>
<button type="button" class="btn btn-outline-success">Success</button>
<button type="button" class="btn btn-outline-danger">Danger</button>
<button type="button" class="btn btn-outline-warning">Warning</button>
<button type="button" class="btn btn-outline-info">Info</button>
<button type="button" class="btn btn-outline-light">Light</button>
<button type="button" class="btn btn-outline-dark">Dark</button> */
mtmInputButton.prototype._create = function () {
  this.elCompList = mtoElementBuilder.buildComponent(mtmInputButton.staticBody, true);
  this.elThis = this.elCompList[0];
};

mtmInputButton.prototype._init = function () {
  this._prepare();
  this._create();
  this._matchElements();

  if (this.options && this.options.fontSize) this.elThis.style.fontSize = this.options.fontSize;
  if (this.options && this.options.fontWeight) this.elThis.style.fontWeight = this.options.fontWeight;

  if (this.options && this.options.eventHandler) {
    this.elThis.addEventListener("click", this.onClickHandler.bind(this));
  }
};

////////////////////////////////////////////////////////////////////
/////////////////////////////// Handler ////////////////////////////
// Fixed
mtmInputButton.prototype.onClickHandler = function (e) {
  if (this.options && this.options.eventHandler) {
    // Fixed. Jstar : 버튼 Click Event 를 통해서 Data 를 전달하려 하는 시도를 다음과 같이 수정.
    this.options.eventHandler(e, this.options);
  }
};

////////////////////////////////////////////////////////////////////
/////////////////////////////// API ////////////////////////////////
mtmInputButton.prototype.fillPrimary = function (className) {
  // this.elThis.classList.remove('btn-outline-primary');
  // this.elThis.classList.add('btn-primary');
};

mtmInputButton.prototype.outlinePrimary = function (className) {
  // this.elThis.classList.remove('btn-primary');
  // this.elThis.classList.add('btn-outline-primary');
};

mtmInputButton.prototype.setMarginLeft = function (bAdd, marginLeft) {
  if (bAdd) this.elThis.classList.add(marginLeft);
  else this.elThis.classList.remove(marginLeft);
};

mtmInputButton.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "";
  else this.elThis.style.display = "none";
};

mtmInputButton.prototype.enable = function (bEnable) {
  if (bEnable) this.elThis.disabled = false;
  else this.elThis.setAttribute("disabled", true);
};

mtmInputButton.prototype.removeClass = function (className) {
  // $(this.elThis).removeClass(className);
  this.elThis.classList.remove(className);
};

mtmInputButton.prototype.addClass = function (className) {
  // $(this.elThis).addClass(className);
  this.elThis.classList.add(className);
};

mtmInputButton.prototype.setEnable = function (bEnable) {
  if (bEnable) {
    this.enable(true);
    // this.addClass('btn-outline-primary');
    this.removeClass("btn-primary");
    // this.removeClass('btn-outline-secondary');
  } else {
    this.enable(false);
    // this.removeClass('btn-primary');
    // this.addClass('btn-outline-primary');
  }
};

mtmInputButton.prototype.setGrayDisable = function () {
  this.enable(false);
  // this.removeClass('btn-primary');
  // this.addClass('btn-outline-secondary');
};

mtmInputButton.prototype.setText = function (text) {
  this.elsObject.elText.textContent = text;
};

mtmInputButton.prototype.setBtnText = function (text) {
  this.elsObject.elText.innerHTML = text;
};

mtmInputButton.prototype.setIcon = function (icon) {
  this.elsObject.elIcon.setAttribute("class", icon);
};

mtmInputButton.prototype.setIconColor = function (bColor) {
  // this.elsObject.elIcon.setAttribute('class',icon);
  if (bColor) this.elsObject.elIcon.style.color = "var(--theme-color-v2-c3-rgb)";
  else this.elsObject.elIcon.style.color = "var(--theme-color-v2-c1-rgb)";
};

mtmInputButton.prototype.setHtml = function (html) {
  this.elThis.innerHTML = html;
};

mtmInputButton.prototype.setAttrs = function (attrs) {
  for (var i = 0; i < attrs.length; i++) {
    this.elThis.setAttribute(attrs[i].key, attrs[i].value);
  }
};
