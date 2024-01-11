import { mtmStudyQuestionCard } from "../study/mtm-study-question-card.js";

require("../../../../css/pages/st/testum/mtm-player-testum-question.css");
export class mtmPlayerTestumQuestion {
  constructor(options) {
    this.id = "id-mtm-player-testum-question-" + mtmPlayerTestumQuestion.id++;

    this.elThis = null;
    this.options = options;
    if (!this.options) this.options = {};

    this.bEnableAnswer = true;

    this._init();
  }
  _setProperty() {
    if (this.options.display_option == 8) {
      this.clTestumQuestionCard.setCorrectMark();
      this.clTestumQuestionCard.setCorrectAnswer();
      this.clTestumQuestionCard.setAnswerEnable(false);
      // console.log('mtmPlayerTestumQuestion > _setProperty: ',this.options);
      this.clTestumQuestionCard.setSolution(this.options);
      this.clTestumQuestionCard.showSolution(true);
      this.setShowSubmitList([false, false, false, true]);
    } else if (this.options.display_option == 2) {
      this.setShowSubmitList([true, false, false, false]);
      this.clTestumQuestionCard.setSolution(this.options);
      this.clTestumQuestionCard.showSolution(false);
    } else {
      this.clTestumQuestionCard.setSolution(this.options);
      this.clTestumQuestionCard.showSolution(false);
    }
  }
  _init() {
    this.elThis = document.createElement("div");
    this.elThis.setAttribute("id", this.id);

    this.elFlex = document.createElement("div");
    this.elFlex.setAttribute("class", "mtm-player-testum-question-flexbox");

    this.elWrapper = document.createElement("div");
    // Todo. 문제의 크기 조정
    this.elWrapper.setAttribute("class", "mtm-player-testum-question-wrapper");

    var item = this.options;
    this.clTestumQuestionCard = new mtmStudyQuestionCard(item);

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

    this.clTestumQuestionCard.setSubmitItemList(submitItems);

    this.elWrapper.appendChild(this.clTestumQuestionCard.elThis);
    this.elFlex.appendChild(this.elWrapper);

    this.elThis.appendChild(this.elFlex);

    // this.options.rc++;
    this._setProperty();
  }
  /////////////////////////////////////////////////////////
  ////////////////////// Handler //////////////////////////
  onConfirmHandler() {
    // console.log('mtmPlayerTestumQuestion > onConfirmHandler : ');
    if (this.options && this.options.eventConfirmHandler) this.options.eventConfirmHandler();
  }
  onSubmitHandler() {
    var eData = {};
    eData.itemIndex = this.options.no - 1;
    eData.rc = ++this.options.rc;
    eData.id = this.options.id;
    eData.answer = this.options.answer;
    eData.userAnswer = this.clTestumQuestionCard.getAnswer();
    eData.correct = eData.answer == eData.userAnswer;

    if (eData.correct) {
      this.showSolution(true);
      this.clTestumQuestionCard.setCorrectMark();
      this.setShowSubmitList([false, false, false, true]);
    } else {
      this.clTestumQuestionCard.setWrongMark();
      if (eData.rc >= 1) {
        this.showSolution(true);
        this.setShowSubmitList([false, true, false, true]);
      } else {
        this.showSolution(false);
        this.setShowSubmitList([false, true, false, false]);
      }
    }

    this.clTestumQuestionCard.setAnswerEnable(false);

    if (this.options && this.options.eventSubmitHandler) this.options.eventSubmitHandler(eData);
  }
  // 오답하기
  onCorrectWrongHandler() {
    // console.log('mtmPlayerTestumQuestion > onCorrectWrongHandler : ', this.options.eventSubmitHandler);
    this.showSolution(false);
    this.clTestumQuestionCard.hideAllMark();
    this.clTestumQuestionCard.setAnswer("");
    this.clTestumQuestionCard.setAnswerEnable(true);
    this.setShowSubmitList([true, false, false, false]);

    if (this.options && this.options.eventCorrectWrongHandler) this.options.eventCorrectWrongHandler();
  }
  // 다음 하기
  onNextStepHandler() {
    // console.log('mtmPlayerTestumQuestion > onNextStepHandler : ', this.options.eventSubmitHandler);
    if (this.options && this.options.eventNextStepHandler) this.options.eventNextStepHandler();
  }
  onEventSolutionHandler(eData) {
    // console.log('mtmPlayerTestumQuestion > onEventSolutionHandler : ', this.options.eventSubmitHandler);
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
    this.clTestumQuestionCard.setAnswerEnable(bEnable);
  }
  setAnswerCorrect() {}
  setAnswer(answer) {
    this.clTestumQuestionCard.setAnswer(answer);
  }
  setQuestionNumber(no) {
    // this.clTestumQuestionCard.setQuestionNumber(no);
  }
  setQuestion(item) {
    if (!item) item = {};

    item.bSubmitAction = true;
    item.submitList = [1];

    item.eventSolutionHandler = this.onEventSolutionHandler.bind(this);
    this.clTestumQuestionCard.setQuestionData(item);
    this.clTestumQuestionCard.hideAllMark();
    // this.clTestumQuestionCard.setAnswerEnable(true);
  }
  showSolution(bShow) {
    this.clTestumQuestionCard.showSolution(bShow);
  }
  setSolution(items) {
    this.clTestumQuestionCard.setSolution(items);
  }
  getAnswer() {
    return this.clTestumQuestionCard.getAnswer();
  }
  getPoint() {
    return this.clTestumQuestionCard.getPoint();
  }
  // mtmPlayerTestumQuestion.prototype.setAnswer = function(value) {
  //     return this.clTestumQuestionCard.getAnswer();
  // }
  showMark(bShow) {
    if (bShow) return;
    this.clTestumQuestionCard.hideAllMark();
  }
  setMark(bMark) {
    if (bMark) this.clTestumQuestionCard.setCorrectMark();
    else this.clTestumQuestionCard.setWrongMark();

    // this.clTestumQuestionCard.showSubmitAction(false);
  }
  setShowSubmitAction(index, bShow, bMargin) {
    this.clTestumQuestionCard.setShowSubmitAction(index, bShow, bMargin);
  }
  setEnableSubmitAction(index, bShow) {
    this.clTestumQuestionCard.setEnableSubmitAction(index, bShow);
  }
  setShowSubmitList(bShowList) {
    this.clTestumQuestionCard.setShowSubmitList(bShowList);
  }
}

mtmPlayerTestumQuestion.id = 0;
