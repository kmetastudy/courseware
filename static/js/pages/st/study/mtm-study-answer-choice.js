import { mtoElementBuilder } from "../../../core/utils/mto-element-builder.js";

require("./mtm-study-answer-choice.css");

export class mtmStudyAnswerChoice {
  constructor(options) {
    this.id = "mtm-study-answer-choice-" + mtmStudyAnswerChoice.id++;
    this.options = options;
    if (!this.options) this.options = {};

    this.options.answer = "";
    this.elThis = null;

    this.elChoiceNumber = [];
    this.ChoiceNumberIndex = 0;
    this.bEnableAnswer = true;
    this._init();
  }
  _init() {
    this.elThis = mtoElementBuilder.createComponent(mtmStudyAnswerChoice.staticBody);

    for (var i = 0; i < this.options.choice.length; i++) {
      var element = (this.elChoiceNumber[this.ChoiceNumberIndex] = mtoElementBuilder.createComponent(
        mtmStudyAnswerChoice.staticChoiceNumber,
      ));

      var dataSel = "?";
      if (this.ChoiceNumberIndex < 5) dataSel = this.ChoiceNumberIndex + 1;

      this.elChoiceNumber[this.ChoiceNumberIndex].setAttribute("data-sel", dataSel);
      this.elChoiceNumber[this.ChoiceNumberIndex].innerHTML = dataSel;

      this.elChoiceNumber[this.ChoiceNumberIndex].addEventListener("click", this.onClickChoiceNumberHandler.bind(this));

      this.ChoiceNumberIndex++;

      this.elThis.children[0].appendChild(element);
    }
  }
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// Handler /////////////////////////////
  onClickChoiceNumberHandler(e) {
    if (!this.bEnableAnswer) return;

    var el = e.target;

    var clicked = el.getAttribute("data-clicked");

    if (clicked == "false") clicked = true;
    else clicked = false;

    el.setAttribute("data-clicked", clicked);

    if (clicked) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }

    this.options.answer = "";
    for (var i = 0; i < this.ChoiceNumberIndex; i++) {
      if (this.elChoiceNumber[i].classList.contains("active")) {
        if (this.options.answer != "") {
          this.options.answer = this.options.answer + "," + (i + 1).toString();
        } else {
          this.options.answer = (i + 1).toString();
        }
      }
    }

    var eData = {};
    eData.answer = this.options.answer;
    console.log("mtmStudyAnswerChoice > onClickChoiceNumberHandler : ", this.options.answer);
    if (this.options && this.options.eventHandler) this.options.eventHandler(eData);
  }
  ////////////////////////////////////////////////////////////////////////
  ////////////////////////////////// API /////////////////////////////////
  show(bShow) {
    if (bShow) this.elThis.style.display = "block";
    else this.elThis.style.display = "none";
  }
  setAnswerEnable(bEnable) {
    this.bEnableAnswer = bEnable;

    if (bEnable) {
      // console.log('mtmStudyAnswerChoice > setAnswerEnable : true , ', this.ChoiceNumberIndex);
      for (var i = 0; i < this.ChoiceNumberIndex; i++) this.elChoiceNumber[i].classList.remove("inactive");
    } else {
      // console.log('mtmStudyAnswerChoice > setAnswerEnable : false , ', this.ChoiceNumberIndex);
      for (var i = 0; i < this.ChoiceNumberIndex; i++) this.elChoiceNumber[i].classList.add("inactive");
    }
  }
  clearAnswer() {
    for (var i = 0; i < this.elChoiceNumber.length; i++) {
      this.elChoiceNumber[i].setAttribute("data-clicked", false);
      this.elChoiceNumber[i].classList.remove("active");
    }
    this.options.answer = "";
  }
  setAnswer(answer) {
    if (answer) this.options.answer = answer;

    if (answer == "") {
      this.clearAnswer();
      return;
    }

    var answers = this.options.answer.split(",");
    for (var i = 0; i < answers.length; i++) {
      var answerIndex = parseInt(answers[i]) - 1;
      this.elChoiceNumber[answerIndex].setAttribute("data-clicked", true);
      this.elChoiceNumber[answerIndex].classList.add("active");
    }
  }
  getAnswer() {
    var answerNum = 0;
    var answer = "";

    return this.options.answer;
  }
}

mtmStudyAnswerChoice.id = 0;

mtmStudyAnswerChoice.staticBody = [
  { level: 0, tag: "div" },
  { level: 1, tag: "div", class: "mtm-study-answer-choice-number-container", attr: { style: "" } },
];

mtmStudyAnswerChoice.staticChoiceNumber = [
  {
    level: 0,
    tag: "div",
    class: "mtm-study-answer-choice-number text-center",
    attr: { "data-sel": "", "data-clicked": "false" },
  },
  // {'level':1,'tag':'span',},
];
