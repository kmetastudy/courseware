import { mtvElementBuilder } from "../../../core/component/mtv-element-builder.js";

require("./mtm-study-answer-short.css");
export class mtmStudyAnswerShort {
  constructor(options) {
    this.id = "id-mtm-study-answer-short-" + mtmStudyAnswerShort.id++;
    this.options = options;
    if (!this.options) this.options = {};

    this.options.answer = "";

    this.elThis = null;
    this.elInput = null;
    this._init();
  }
  _prepare() {
    // if(!this.options)
    //     return;
    mtmStudyAnswerShort.staticBody[0]["id"] = this.id;
    mtmStudyAnswerShort.staticBody[4]["id"] = this.id + "-input";
  }
  _init() {
    this._prepare();

    this.elThis = mtvElementBuilder.createComponent(mtmStudyAnswerShort.staticBody);

    this.elInput = $(this.elThis).children("#" + this.id + "-input")[0]; // children[1]; //(this.id + '-input');

    if (!this.options.showLabel) this.elThis.children[0].style.display = "none";

    this.elInput.addEventListener("change", this.onChangeHandler.bind(this));

    // if(this.options && this.options.eventHandler)
    //     this.elInput.addEventListener('change',this.options.eventHandler);
    // console.log('mtmStudyAnswerShort : this.elInput :', this.elInput);
  }
  /////////////////////////////////////////////////////////////////////////
  //////////////////////////////////// Handler ////////////////////////////
  onChangeHandler() {
    this.options.answer = this.elInput.value;
    this.options.answer.trim();

    var eData = {};
    eData.answer = this.options.answer;

    if (this.options && this.options.eventHandler) this.options.eventHandler(eData);
  }
  /////////////////////////////////////////////////////////////////////////
  //////////////////////////////////// API ////////////////////////////////
  // Todo. Jstar : ShortAnswer
  show(bShow) {
    if (bShow) this.elThis.style.display = "block";
    else this.elThis.style.display = "none";
  }
  setAnswerEnable(bEnable) {
    this.bEnableAnswer = bEnable;

    if (bEnable) {
      this.elInput.readOnly = false;
    } else {
      this.elInput.readOnly = true;
    }
  }
  setAnswer(value) {
    this.options.answer = value;
    this.elInput.value = this.options.answer;
  }
  getAnswer() {
    return this.options.answer;
  }
  clear() {
    this.options.answer = "";
    this.elInput.value = this.options.answer;
  }
  getValue() {
    return this.options.answer;
  }
  setValue(value) {
    this.options.answer = value;
    this.elInput.value = this.options.answer;
  }
}

mtmStudyAnswerShort.id = 0;

mtmStudyAnswerShort.staticBody = [
  { level: 0, tag: "div", class: "answer-type-short", id: "short-answer" },
  { level: 1, tag: "label", attr: { for: "short-answer-input" } },
  { level: 2, tag: "i", class: "fa fa-edit" },
  { level: 2, text: "정답을 입력하시오" },
  {
    level: 1,
    tag: "input",
    id: "short-answer-input",
    class: "form-control",
    attr: { type: "text", placeholder: "정답을 입력하시오", autocomplete: "off" },
  },
];
