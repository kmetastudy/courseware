import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";

require("./mtm-study-answer-long.css");
export class mtmStudyAnswerLong {
  constructor(options) {
    this.id = "id-mtm-study-answer-long-" + mtmStudyAnswerLong.id++;
    this.options = options;
    this.elThis = null;
    this.elInput = null;

    this.init();
  }

  prepare() {
    mtmStudyAnswerLong.staticBody[0]["id"] = this.id;
    mtmStudyAnswerLong.staticBody[5]["id"] = this.id + "-input";
  }

  clear() {
    this.elInput.value = "";
  }

  getValue() {
    return this.elInput.value;
  }

  setValue(value) {
    this.elInput.value = value;
  }

  init() {
    this.prepare();

    this.elThis = mtvElementBuilder.createComponent(mtmStudyAnswerLong.staticBody);
    this.elInput = $(this.elThis).find("#" + this.id + "-input")[0];

    if (!this.options.showLabel) this.elThis.children[0].children[0].style.display = "none";

    if (this.options && this.options.eventHandler) this.elInput.addEventListener("change", this.options.eventHandler);
  }

  setAnswer(value) {
    this.elInput.value = value;
  }

  getAnswer() {
    return this.elInput.value;
  }

  // ============ API ============
  show(bShow) {
    if (bShow) {
      this.elThis.style.display = "block";
    } else {
      this.elThis.style.display = "none";
    }
  }
}

mtmStudyAnswerLong.id = 0;

mtmStudyAnswerLong.staticBody = [
  { level: 0, tag: "div", class: "answer-type-long", id: "long-answer" },
  { level: 1, tag: "div", class: "form-group shadow-textarea" },
  { level: 2, tag: "label", for: "long-answer-input" },
  { level: 3, tag: "i", class: "fa fa-edit" },
  { level: 3, text: "답을 서술하시요" },
  {
    level: 2,
    tag: "textarea",
    id: "long-answer-input",
    class: "form-control z-depth-1",
    attr: { rows: "3", placeholder: "정답을 서술 하시오..." },
  },
];
