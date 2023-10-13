import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";

export var mtmStudyAnswerShort = function (options) {
  this.id = "id-mtm-study-answer-short-" + mtmStudyAnswerShort.id++;
  this.options = options;
  if (!this.options) this.options = {};

  this.options.answer = "";

  this.elThis = null;
  this.elInput = null;
  this._init();
};

mtmStudyAnswerShort.id = 0;

mtmStudyAnswerShort.staticBody = [
  { level: 0, tag: "div", class: "answer-type-short col-12 ml-1 mt-2", id: "short-answer" },
  { level: 1, tag: "label", attr: { for: "short-answer-input" } },
  { level: 2, tag: "i", class: "fa fa-edit mr-2" },
  { level: 2, text: "정답을 입력하시오" },
  {
    level: 1,
    tag: "input",
    id: "short-answer-input",
    class: "form-control",
    attr: { type: "text", placeholder: "정답을 입력하시오", autocomplete: "off" },
  },
];

mtmStudyAnswerShort.prototype._prepare = function () {
  // if(!this.options)
  //     return;

  mtmStudyAnswerShort.staticBody[0]["id"] = this.id;
  mtmStudyAnswerShort.staticBody[4]["id"] = this.id + "-input";
};

mtmStudyAnswerShort.prototype._init = function () {
  this._prepare();

  this.elThis = mtvElementBuilder.createComponent(mtmStudyAnswerShort.staticBody);

  this.elInput = $(this.elThis).children("#" + this.id + "-input")[0]; // children[1]; //(this.id + '-input');

  if (!this.options.showLabel) this.elThis.children[0].style.display = "none";

  this.elInput.addEventListener("change", this.onChangeHandler.bind(this));

  // if(this.options && this.options.eventHandler)
  //     this.elInput.addEventListener('change',this.options.eventHandler);

  // console.log('mtmStudyAnswerShort : this.elInput :', this.elInput);
};
/////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Handler ////////////////////////////
mtmStudyAnswerShort.prototype.onChangeHandler = function () {
  this.options.answer = this.elInput.value;
  this.options.answer.trim();

  var eData = {};
  eData.answer = this.options.answer;

  if (this.options && this.options.eventHandler) this.options.eventHandler(eData);
};
/////////////////////////////////////////////////////////////////////////
//////////////////////////////////// API ////////////////////////////////
// Todo. Jstar : ShortAnswer
mtmStudyAnswerShort.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

mtmStudyAnswerShort.prototype.setAnswerEnable = function (bEnable) {
  this.bEnableAnswer = bEnable;

  if (bEnable) {
    this.elInput.readOnly = false;
  } else {
    this.elInput.readOnly = true;
  }
};

mtmStudyAnswerShort.prototype.setAnswer = function (value) {
  this.options.answer = value;
  this.elInput.value = this.options.answer;
};

mtmStudyAnswerShort.prototype.getAnswer = function () {
  return this.options.answer;
};

mtmStudyAnswerShort.prototype.clear = function () {
  this.options.answer = "";
  this.elInput.value = this.options.answer;
};

mtmStudyAnswerShort.prototype.getValue = function () {
  return this.options.answer;
};

mtmStudyAnswerShort.prototype.setValue = function (value) {
  this.options.answer = value;
  this.elInput.value = this.options.answer;
};
