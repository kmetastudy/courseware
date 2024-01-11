import { mtoElementBuilder } from "../../../core/utils/mto-element-builder.js";

require("./mtm-study-solution-text-list.css");

export var mtmStudySolutionTextList = function (options) {
  this.id = "mtm-study-solution-text-list-" + mtmStudySolutionTextList.id++;
  this.options = options;
  this.elThis = null;
  // this.checkInput = 0;
  // this.elCheckInput = [];
  this.elCompList = null;
  this.elsArray = ["elThis", "elHeader", null, "elTitle", null, "elBody", "elContent", null];
  this.elsObject = {};

  this._init();
};

mtmStudySolutionTextList.id = 0;

// 헤더 영역
// {'level':0,'comp':'number-area',},
//     {'level':1, 'comp':'number-itself',},
// {'level':0,'tag':'hr','class':'mt-1'},
mtmStudySolutionTextList.areaHeader = [
  { step: 0, tag: "div", class: "px-0 py-0 my-0", attr: { style: "overflow-y:hidden; overflow-x:hidden;" } },
  {
    step: 1,
    tag: "button",
    class: "btn btn-outline-primary py-0",
    attr: { type: "button", style: "background-color:transparent;border:2px solid dodgerblue;" },
    prop: { disabled: "true" },
  },
  { step: 1, tag: "span", class: "font-weight-bold", text: "해설" },
  { step: -2, tag: "hr", class: "mb-1" },
];

// 해설 영역
// {'level':0,'comp':'content-area',},
//      {'level':1,'comp':'content-itself',},
// {'level':0,'tag':'hr','class':'mb-1'},
mtmStudySolutionTextList.areaBody = [
  { step: 0, tag: "div", class: "px-0 py-0 my-0", attr: { style: "overflow-y:hidden; overflow-x:hidden;" } },
  { step: 1, tag: "div", class: "px-0 py-0 my-0", attr: { style: "width:100%;" } },
  { step: -1, tag: "hr", class: "mb-1" },
];

mtmStudySolutionTextList.staticBody = [
  { step: 0, tag: "div", class: "cl-solution-text-wrapper hidden", attr: { style: "overflow-y:auto;" } },
  // Header
  {
    step: 1,
    tag: "div",
    class: "cl-solution-text-header",
    attr: { style: "overflow-y:hidden; overflow-x:hidden;" },
  },
  { step: 1, tag: "div", class: "btn cl-solution-text-list-btn" },
  // {'step':1,'tag':'button','class':'btn btn-outline-primary py-0',
  //     'attr' : {'type':"button",'style':'cursor:pointer;background-color:transparent;border:2px solid dodgerblue;',},
  //     'prop': {'disabled':'true'},},
  { step: 1, tag: "span", class: "font-weight-bold", text: "해설" },
  // {'step':-2,'tag':'hr','class':'mb-1'},
  { step: -2, tag: "div", class: "cl-solution-text-item-divider" },
  // Body
  {
    step: 0,
    tag: "div",
    class: "cl-solution-text-content",
    attr: { style: "overflow-y:auto; overflow-x:hidden;" },
  },
  { step: 1, tag: "div", class: "cl-solution-text-content-child", attr: { style: "width:100%;" } },
  { step: -1, tag: "div", class: "cl-solution-text-item-divider" },
];

mtmStudySolutionTextList.prototype._create = function () {
  this.elCompList = mtoElementBuilder.buildComponent(mtmStudySolutionTextList.staticBody, true);
  // Component List Matching
  this.elThis = this.elCompList[0];
};

mtmStudySolutionTextList.prototype._matchElements = function () {
  for (var i = 0; i < this.elsArray.length; i++) {
    if (this.elsArray[i]) this.elsObject[this.elsArray[i]] = this.elCompList[i];
  }
};

mtmStudySolutionTextList.prototype._prepareOptions = function () {
  if (this.options.no) {
    // this.elsObject.elTitle.setAttribute('text','해설-'+this.options.no);
    this.elsObject.elTitle.innerHTML = "해설-" + this.options.no;
  }

  this.elsObject.elContent.innerHTML = this.options.content;

  renderMathInElement(this.elsObject.elContent, {
    // customised options
    // • auto-render specific keys, e.g.:
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
    ],
    // • rendering keys, e.g.:
    throwOnError: false,
  }); // KaTex

  // $(this.elsObject.elBody).hide(300);
};

mtmStudySolutionTextList.prototype._initEvents = function () {
  this.elsObject.elHeader.addEventListener("click", this._onClickHandler.bind(this));
};

mtmStudySolutionTextList.prototype._init = function () {
  this._create();
  this._matchElements();
  this._prepareOptions();
  this._initEvents();
};

/////////////////////////////////// Event Handler //////////////////////////////////
mtmStudySolutionTextList.prototype._onClickHandler = function (e) {
  if (this.options && this.options.eventClickHandler) {
    // $(this.elsObject.elBody).slideToggle(300);
    this.toggleContent();
  }
};

/////////////////////////////////// API //////////////////////////////////
mtmStudySolutionTextList.prototype.toggleContent = function (e) {
  // this.options.eventClickHandler();
  if (this.elsObject.elThis.classList.contains("hidden")) {
    this.elsObject.elThis.classList.remove("hidden");
    this.elsObject.elThis.classList.add("open");
  } else {
    console.log("mtmStudySolutionTextList > toggleContent: ", this.elsObject.elContent.offsetHeight);
    this.elsObject.elContent.style.maxHeight = this.elsObject.elContent.offsetHeight;
    this.elsObject.elThis.classList.remove("open");
    this.elsObject.elThis.classList.add("hidden");
  }
};
