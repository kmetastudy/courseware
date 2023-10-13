import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";

export var mtmStudyAnswerLong = function (options) {
  this.id = "id-mtm-study-answer-long-" + mtmStudyAnswerLong.id++;
  this.options = options;
  this.elThis = null;
  this.elInput = null;
  this.init();
};

mtmStudyAnswerLong.id = 0;

mtmStudyAnswerLong.staticBody = [
  { level: 0, tag: "div", class: "answer-type-long col-12 ml-1 mt-1", id: "long-answer" },
  { level: 1, tag: "div", class: "form-group shadow-textarea" },
  { level: 2, tag: "label", for: "long-answer-input" },
  { level: 3, tag: "i", class: "fa fa-edit mr-2" },
  { level: 3, text: "답을 서술하시요" },
  {
    level: 2,
    tag: "textarea",
    id: "long-answer-input",
    class: "form-control z-depth-1",
    attr: { rows: "3", placeholder: "정답을 서술 하시오..." },
  },
];

mtmStudyAnswerLong.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

mtmStudyAnswerLong.prototype.prepare = function () {
  // if(!this.options)
  //     return;

  mtmStudyAnswerLong.staticBody[0]["id"] = this.id;
  mtmStudyAnswerLong.staticBody[5]["id"] = this.id + "-input";
};

mtmStudyAnswerLong.prototype.clear = function () {
  this.elInput.value = "";
};

mtmStudyAnswerLong.prototype.getValue = function () {
  return this.elInput.value;
};

mtmStudyAnswerLong.prototype.setValue = function (value) {
  this.elInput.value = value;
};

mtmStudyAnswerLong.prototype.init = function () {
  this.prepare();

  this.elThis = mtvElementBuilder.createComponent(mtmStudyAnswerLong.staticBody);
  this.elInput = $(this.elThis).find("#" + this.id + "-input")[0];

  if (!this.options.showLabel) this.elThis.children[0].children[0].style.display = "none";

  if (this.options && this.options.eventHandler) this.elInput.addEventListener("change", this.options.eventHandler);

  // console.log('mtmStudyAnswerLong : this.elInput :', this.elInput);
};

///////////////////////////////// API ////////////////////////
mtmStudyAnswerLong.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

mtmStudyAnswerLong.prototype.setAnswer = function (value) {
  this.elInput.value = value;
};

mtmStudyAnswerLong.prototype.getAnswer = function () {
  return this.elInput.value;
};
