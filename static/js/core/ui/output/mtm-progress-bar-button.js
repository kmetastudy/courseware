// 20 Amazing CSS Progress Bars [With Examples]
// https://alvarotrigo.com/blog/progress-bar-css/

// (즐거웅코드) CSS checkbox 배경색, 아이콘 커스텀 하기
// https://ungdoli0916.tistory.com/793

import { mtoElementBuilder } from "../../utils/mto-element-builder.js";

// require("./mtm-progress-bar-button.css");

export var mtmProgressBarButton = function (options) {
  this.id = "id-mtm-progress-bar-button-" + mtmProgressBarButton.id++;

  this.elThis = null;

  this.options = options;
  this.elCompList = null;
  this.elsArray = ["elThis", "elBar"];
  this.elsObject = {};

  this._init();
};

mtmProgressBarButton.id = 0;

mtmProgressBarButton.staticBody = [
  { step: 0, tag: "div", class: "mtm-progress-bar" },
  { step: 1, tag: "div", class: "mtm-progress-bar-bar", attr: { style: "width:0%" } },
];

mtmProgressBarButton.prototype._matchElements = function () {
  for (var i = 0; i < this.elsArray.length; i++) {
    if (this.elsArray[i]) this.elsObject[this.elsArray[i]] = this.elCompList[i];
  }
};

mtmProgressBarButton.prototype._create = function () {
  this.elCompList = mtoElementBuilder.buildComponent(mtmProgressBarButton.staticBody, true);
  this.elThis = this.elCompList[0];
};

mtmProgressBarButton.prototype._init = function () {
  this._create();
  this._matchElements();

  if (this.options && this.options.class) {
    for (var i = 0; i < this.options.class.length; i++) this.elThis.classList.add(this.options.class[i]);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////// API ///////////////////////////////////////////
mtmProgressBarButton.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "";
  else this.elThis.style.display = "none";
};

mtmProgressBarButton.prototype.setProgress = function (progress) {
  this.elsObject.elBar.style.width = progress;
};
