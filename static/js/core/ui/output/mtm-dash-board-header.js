// <input type="date">
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date

// input type date styling
// https://cssdeck.com/labs/oqpjrd0k

// Pikaday
// https://github.com/Pikaday/Pikaday
// https://pikaday.com/

// Browse 300.000+ SVG Vectors and Icons
// https://www.svgrepo.com/

// 2.21 CSS3 Horizontal & Vertical Centering
// 수평/수직 중앙 정렬
// https://poiemaweb.com/css3-centering
import { mtoElementBuilder } from "../utils/mto-element-builder.js";
import { mtmInputToggle } from "../input/mtm-input-toggle.js";

// require('../../../../css/mtv/core/input/mtm-input-text.css');
require("../../../../css/core/ui/output/mtm-dash-board-header.css");

export var mtmDashBoardHeader = function (options) {
  this.id = "id-mtm-output-text-" + mtmDashBoardHeader.id++;
  this.elThis = null;
  this.elLabel = null;
  this.elInputDate = null;

  // for element matching
  this.elCompList = null;
  this.elsArray = ["elThis", "elLabel"];
  this.elsObject = {};

  this.value = "";

  this.options = options;

  if (!this.options) this.options = {};

  if (!this.options.icon) this.options.icon = '<i class="fa-solid fa-book"></i>';
  if (!this.options.title) this.options.title = "  제목";

  this._init();
};

mtmDashBoardHeader.id = 0;

mtmDashBoardHeader.staticBody = [
  { step: 0, tag: "div", class: "mtm-dash-board-header px-2 py-1", text: "" },
  { step: 1, tag: "label", text: '<i class="fa fa-calendar-check-o"> </i> 시작일' },
  // {'step':0,'tag':'input', 'class':'class-mtm-input-text-input',
  //     'attr' :{'type':'text', },
  // },
];

mtmDashBoardHeader.prototype._initEvents = function () {};

mtmDashBoardHeader.prototype._matchElements = function () {
  for (var i = 0; i < this.elsArray.length; i++) {
    if (this.elsArray[i]) this.elsObject[this.elsArray[i]] = this.elCompList[i];
  }

  // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
};

mtmDashBoardHeader.prototype._create = function () {
  this.elCompList = mtoElementBuilder.buildComponent(mtmDashBoardHeader.staticBody, true);
  // Component List Matching
  this.elThis = this.elCompList[0];
  this.elThis.style.position = "relative";

  var optionsToggle = {};
  optionsToggle.size = "small";
  optionsToggle.shape = "round";
  optionsToggle.eventHandler = this.onToggleHandler.bind(this);
  this.clToggle = new mtmInputToggle(optionsToggle);

  // if(this.options.bDisabled)
  // {
  //     this.clToggle.setValue(false);
  //     this.clToggle.setEnable(false);
  // }
  // else
  // {
  //     this.clToggle.setValue(true);
  // }

  //
  // 수평/수직 중앙 정렬
  // https://poiemaweb.com/css3-centering
  this.clToggle.elThis.style.position = "absolute";
  this.clToggle.elThis.style.right = "10px";
  this.clToggle.elThis.style.top = "50%";
  this.clToggle.elThis.style.transform = "translateY(-50%)";

  this.elThis.append(this.clToggle.elThis);

  // 옵션 스타일 적용
  // options for style
  if (this.options.width) this.elThis.style.width = this.options.width;
};

mtmDashBoardHeader.prototype._prepare = function () {
  // console.log(' mtmDashBoardHeader : prepare : ', this.options.title);

  mtmDashBoardHeader.staticBody[1]["text"] = this.options.icon + this.options.title;
};

mtmDashBoardHeader.prototype._init = function () {
  this._prepare();
  this._create();
  this._initEvents();
  this._matchElements();
};
////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Handler ///////////////////////////////
mtmDashBoardHeader.prototype.onToggleHandler = function (checked) {
  // console.log('mtmDashBoardHeader > onToggleHandler :',checked);
  if (this.options && this.options.eventClick) this.options.eventClick(checked);
};

////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// API //////////////////////////////////
mtmDashBoardHeader.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "";
  else this.elThis.style.display = "none";
};

mtmDashBoardHeader.prototype.getValue = function () {
  return this.value;
};

mtmDashBoardHeader.prototype.getValue = function () {
  return this.elsObject.elInputText.value;
};

mtmDashBoardHeader.prototype.setTitle = function (title) {
  var data = this.options.icon + title;
  this.elsObject.elLabel.innerHTML = data;
};

mtmDashBoardHeader.prototype.setValue = function (value) {
  this.elsObject.elInputText.value = value;
};

mtmDashBoardHeader.prototype.setReadOnly = function (bReadOnly) {
  this.elsObject.elInputText.readOnly = bReadOnly;
};

mtmDashBoardHeader.prototype.setEnable = function (bEnable) {
  if (!bEnable) {
    this.clToggle.setValue(false);
    this.clToggle.setEnable(false);
  } else {
    this.clToggle.setValue(true);
    this.clToggle.setEnable(true);
  }
};
