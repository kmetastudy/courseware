import { mtvComponentBuilder } from "../../../core/utils/mtv-component-builder.js";
import { mtmStudyQuestionCard } from "../study/mtm-study-question-card.js";

require("./mtm-player-lesson-question.css");
export class mtmPlayerLessonQuestion {
  constructor(options) {
    this.id = "id-mtm-player-lesson-question-" + mtmPlayerLessonQuestion.id++;

    this.elThis = null;
    this.options = options;
    if (!this.options) this.options = {};

    this.bEnableAnswer = true;

    this._init();
  }
  _init() {
    this.elThis = document.createElement("div");
    this.elThis.setAttribute("id", this.id);

    this.elFlex = document.createElement("div");
    this.elFlex.setAttribute("class", "mtm-player-lesson-question-flexbox");

    this.elWrapper = document.createElement("div");
    this.elWrapper.setAttribute("class", "mtm-player-lesson-question-wrapper");

    this.options.item = {};

    this.options.item.eventSolutionHandler = this.onEventSolutionHandler.bind(this);
    this.options.type = 1;
    this.clLessonQuestionCard = new mtmStudyQuestionCard(this.options.item);

    var options = {};
    options.items = [];
    var submitItems = [
      {
        enable: true,
        text: " 제출",
        icon: "fa fa-check",
        eventHandler: this.onSubmitHandler.bind(this),
      },
      {
        enable: true,
        text: " 오답 하기",
        icon: "fa fa-question-circle",
        eventHandler: this.onCorrectWrongHandler.bind(this),
      },
      {
        enable: true,
        text: " 다음 하기",
        icon: "fa fa-external-link",
        eventHandler: this.onNextStepHandler.bind(this),
      },
      {
        enable: true,
        text: " 확인",
        icon: "fa fa-check",
        eventHandler: this.onConfirmHandler.bind(this),
      },
    ];

    this.clLessonQuestionCard.setSubmitItemList(submitItems);

    this.elWrapper.appendChild(this.clLessonQuestionCard.elThis);
    this.elFlex.appendChild(this.elWrapper);

    this.elThis.appendChild(this.elFlex);
  }
  /////////////////////////////////////////////////////////
  ////////////////////// Handler //////////////////////////
  onConfirmHandler() {
    // console.log('mtmPlayerLessonQuestion > onConfirmHandler : ', this.options.eventSubmitHandler);
    if (this.options && this.options.eventConfirmHandler) this.options.eventConfirmHandler();
  }
  onSubmitHandler() {
    // console.log('mtmPlayerLessonQuestion > onSubmitHandler : ', this.options.eventSubmitHandler);
    if (this.options && this.options.eventSubmitHandler) this.options.eventSubmitHandler();
  }
  onCorrectWrongHandler() {
    // console.log('mtmPlayerLessonQuestion > onSubmitHandler : ', this.options.eventSubmitHandler);
    if (this.options && this.options.eventCorrectWrongHandler) this.options.eventCorrectWrongHandler();
  }
  onNextStepHandler() {
    // console.log('mtmPlayerLessonQuestion > onSubmitHandler : ', this.options.eventSubmitHandler);
    if (this.options && this.options.eventNextStepHandler) this.options.eventNextStepHandler();
  }
  onEventSolutionHandler(eData) {
    // console.log('mtmPlayerLessonQuestion > onSubmitHandler : ', this.options.eventSubmitHandler);
    if (this.options && this.options.eventSolutionHandler) this.options.eventSolutionHandler(eData);
  }
  /////////////////////////////////////////////////////////
  ////////////////////// API //////////////////////////////
  show(bShow) {
    if (bShow) this.elThis.style.display = "block";
    else this.elThis.style.display = "none";
  }
  setAnswerEnable(bEnable) {
    this.bEnableAnswer = bEnable;
    this.clLessonQuestionCard.setAnswerEnable(bEnable);
  }
  setAnswerCorrect() {}
  setAnswer(answer) {
    this.clLessonQuestionCard.setAnswer(answer);
  }
  setQuestionNumber(no) {
    // this.clLessonQuestionCard.setQuestionNumber(no);
  }
  setQuestion(item) {
    if (!item) item = {};

    item.bSubmitAction = true;
    item.submitList = [1];
    item.eventSolutionHandler = this.onEventSolutionHandler.bind(this);

    this.clLessonQuestionCard.setQuestionData(item);
    this.clLessonQuestionCard.hideAllMark();
    // this.clLessonQuestionCard.setAnswerEnable(true);
  }
  showSolution(bShow) {
    this.clLessonQuestionCard.showSolution(bShow);
  }
  setSolution(items) {
    this.clLessonQuestionCard.setSolution(items);
  }
  getAnswer() {
    return this.clLessonQuestionCard.getAnswer();
  }
  showMark(bShow) {
    if (bShow) return;
    this.clLessonQuestionCard.hideAllMark();
  }
  setMark(bMark) {
    if (bMark) this.clLessonQuestionCard.setCorrectMark();
    else this.clLessonQuestionCard.setWrongMark();

    // this.clLessonQuestionCard.showSubmitAction(false);
  }
  setShowSubmitAction(index, bShow, bMargin) {
    this.clLessonQuestionCard.setShowSubmitAction(index, bShow, bMargin);
  }
  setEnableSubmitAction(index, bShow) {
    this.clLessonQuestionCard.setEnableSubmitAction(index, bShow);
  }
  setShowSubmitList(bShowList) {
    this.clLessonQuestionCard.setShowSubmitList(bShowList);
  }
}

mtmPlayerLessonQuestion.id = 0;

mtvComponentBuilder.register("mtv-player-lesson-question", mtmPlayerLessonQuestion);
