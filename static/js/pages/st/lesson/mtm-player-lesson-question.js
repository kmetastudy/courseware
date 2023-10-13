import { mtvComponentBuilder } from "../../../core/utils/mtv-component-builder.js";
import { mtmStudyQuestionCard } from "../study/mtm-study-question-card.js";

export var mtmPlayerLessonQuestion = function (options) {
  this.id = "id-mtm-player-lesson-question-" + mtmPlayerLessonQuestion.id++;

  this.elThis = null;
  this.options = options;
  if (!this.options) this.options = {};

  this.bEnableAnswer = true;

  this._init();
};

mtmPlayerLessonQuestion.id = 0;

mtmPlayerLessonQuestion.prototype._init = function () {
  this.elThis = document.createElement("div");
  this.elThis.setAttribute("id", this.id);

  this.elFlex = document.createElement("div");
  this.elFlex.setAttribute("class", "row d-flex justify-content-center mt-2");

  // {'level':1,'tag':'div', 'class':'card-body px-0 py-0 my-0', },
  //         // <div class="col-12 mb-4" style="position:relative;padding-top:56.25%;border-radius:10px;border:3px solid rgba(0,123,255,255);" id="div_id_yt_root">
  //         {'level':2 , 'tag':'div', 'class':'col-12 px-0', 'attr' : {'style' : 'position:relative;padding-top:56.25%;border-radius:10px;border:3px solid rgba(0,123,255,255);',},},

  this.elWrapper = document.createElement("div");
  this.elWrapper.setAttribute("class", "col-12 col-md-10 col-lg-9 col-xl-8 d-flex justify-content-center");

  // this.options.questionCard.push({
  //     no : i+1,
  //     content : this.options.testum_unit[i].content_list[0].content,
  //     id : this.options.testum_unit[i].content_list[0].id,
  //     style : this.options.testum_unit[i].content_list[0].style,
  //     level : this.options.testum_unit[i].content_list[0].level,
  //     answer : this.options.testum_unit[i].content_list[0].answer,
  // });

  this.options.item = {};
  // this.options.item.bSubmitAction = true;
  // this.options.item.submitList = [1,1,1];
  // this.options.item.eventSubmitHandler = this.onSubmitHandler.bind(this);
  // this.options.item.eventCorrectWrongHandler = this.onCorrectWrongHandler.bind(this);
  // this.options.item.eventNextStepHandler = this.onNextStepHandler.bind(this);
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
};

mtvComponentBuilder.register("mtv-player-lesson-question", mtmPlayerLessonQuestion);

/////////////////////////////////////////////////////////
////////////////////// Handler //////////////////////////
mtmPlayerLessonQuestion.prototype.onConfirmHandler = function () {
  // console.log('mtmPlayerLessonQuestion > onConfirmHandler : ', this.options.eventSubmitHandler);
  if (this.options && this.options.eventConfirmHandler) this.options.eventConfirmHandler();
};

mtmPlayerLessonQuestion.prototype.onSubmitHandler = function () {
  // console.log('mtmPlayerLessonQuestion > onSubmitHandler : ', this.options.eventSubmitHandler);
  if (this.options && this.options.eventSubmitHandler) this.options.eventSubmitHandler();
};

mtmPlayerLessonQuestion.prototype.onCorrectWrongHandler = function () {
  // console.log('mtmPlayerLessonQuestion > onSubmitHandler : ', this.options.eventSubmitHandler);
  if (this.options && this.options.eventCorrectWrongHandler) this.options.eventCorrectWrongHandler();
};

mtmPlayerLessonQuestion.prototype.onNextStepHandler = function () {
  // console.log('mtmPlayerLessonQuestion > onSubmitHandler : ', this.options.eventSubmitHandler);
  if (this.options && this.options.eventNextStepHandler) this.options.eventNextStepHandler();
};

mtmPlayerLessonQuestion.prototype.onEventSolutionHandler = function (eData) {
  // console.log('mtmPlayerLessonQuestion > onSubmitHandler : ', this.options.eventSubmitHandler);
  if (this.options && this.options.eventSolutionHandler) this.options.eventSolutionHandler(eData);
};
/////////////////////////////////////////////////////////
////////////////////// API //////////////////////////////
mtmPlayerLessonQuestion.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "block";
  else this.elThis.style.display = "none";
};

mtmPlayerLessonQuestion.prototype.setAnswerEnable = function (bEnable) {
  this.bEnableAnswer = bEnable;
  this.clLessonQuestionCard.setAnswerEnable(bEnable);
};

mtmPlayerLessonQuestion.prototype.setAnswerCorrect = function () {};

mtmPlayerLessonQuestion.prototype.setAnswer = function (answer) {
  this.clLessonQuestionCard.setAnswer(answer);
};

mtmPlayerLessonQuestion.prototype.setQuestionNumber = function (no) {
  // this.clLessonQuestionCard.setQuestionNumber(no);
};

mtmPlayerLessonQuestion.prototype.setQuestion = function (item) {
  if (!item) item = {};

  item.bSubmitAction = true;
  item.submitList = [1];
  // item.eventSubmitHandler = this.onSubmitHandler.bind(this);
  // item.eventCorrectWrongHandler = this.onCorrectWrongHandler.bind(this);
  // item.eventNextStepHandler = this.onNextStepHandler.bind(this);
  item.eventSolutionHandler = this.onEventSolutionHandler.bind(this);
  this.clLessonQuestionCard.setQuestionData(item);
  this.clLessonQuestionCard.hideAllMark();
  // this.clLessonQuestionCard.setAnswerEnable(true);
};

mtmPlayerLessonQuestion.prototype.showSolution = function (bShow) {
  this.clLessonQuestionCard.showSolution(bShow);
};

mtmPlayerLessonQuestion.prototype.setSolution = function (items) {
  this.clLessonQuestionCard.setSolution(items);
};

mtmPlayerLessonQuestion.prototype.getAnswer = function () {
  return this.clLessonQuestionCard.getAnswer();
};

mtmPlayerLessonQuestion.prototype.showMark = function (bShow) {
  if (bShow) return;
  this.clLessonQuestionCard.hideAllMark();
};

mtmPlayerLessonQuestion.prototype.setMark = function (bMark) {
  if (bMark) this.clLessonQuestionCard.setCorrectMark();
  else this.clLessonQuestionCard.setWrongMark();

  // this.clLessonQuestionCard.showSubmitAction(false);
};

mtmPlayerLessonQuestion.prototype.setShowSubmitAction = function (index, bShow, bMargin) {
  this.clLessonQuestionCard.setShowSubmitAction(index, bShow, bMargin);
};

mtmPlayerLessonQuestion.prototype.setEnableSubmitAction = function (index, bShow) {
  this.clLessonQuestionCard.setEnableSubmitAction(index, bShow);
};

mtmPlayerLessonQuestion.prototype.setShowSubmitList = function (bShowList) {
  this.clLessonQuestionCard.setShowSubmitList(bShowList);
};
