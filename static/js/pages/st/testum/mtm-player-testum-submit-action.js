import { mtmStudySubmitAction } from "../study/mtm-study-submit-action.js";

export class mtmPlayerTestumSubmitAction {
  constructor(options) {
    this.id = "id-mtm-player-testum-submit-action-" + mtmPlayerTestumSubmitAction.id++;
    this.elThis = null;
    this.options = options;
    this._init();
  }
  _init() {
    var timer_options = {
      enable: true,
      text: " 00:00:00",
      iClass: "fa-regular fa-clock",
      eventHandler: this.options.eventTimerHandler,
    };

    var options = {};
    options.items = [
      {
        // mtvClass : mtvInputButton,
        enable: true,
        text: " 오답 하기",
        icon: "fa fa-check",
        eventHandler: this.options.eventCorrectWrongHandler,
      },
      {
        // mtvClass : mtvInputButton,
        enable: true,
        text: " 다음 하기",
        icon: "fa fa-external-link",
        eventHandler: this.options.eventNextStepHandler.bind(this),
      },
      {
        // mtvClass : mtvInputButton,
        enable: true,
        text: " 전체 보기",
        icon: "fa fa-list",
        eventHandler: this.options.eventStatusHandler.bind(this),
      },
    ];

    this.clTestumSubmitAction = new mtmStudySubmitAction(options);
    // element = this.clTestumSubmitActionSlider.elThis;
    this.clTestumSubmitAction.setShow(0, false);
    this.clTestumSubmitAction.setShow(1, false);
    this.clTestumSubmitAction.setShow(2, false);
    this.elThis = this.clTestumSubmitAction.elThis;

    this.elThis.setAttribute("id", this.id);
  }
  ////////////////////////////// API //////////////////////////////////////
  show(bShow) {
    if (bShow) this.elThis.style.display = "";
    else this.elThis.style.display = "none";
  }
  setShow(index, bShow) {
    this.clTestumSubmitAction.setShow(index, bShow);
  }
  showTimeElapse(bShow) {
    this.clTestumSubmitAction.setShow(0, bShow);
  }
  showCorrectWrong(bShow) {
    this.clTestumSubmitAction.setShow(1, bShow);
  }
  showNextStep(bShow) {
    this.clTestumSubmitAction.setShow(2, bShow);
  }
  showTotalResult(bShow) {
    this.clTestumSubmitAction.setShow(3, bShow);
  }
  timerStart() {
    this.clElapseTimer.start();
  }
  timerReset() {
    this.clElapseTimer.reset();
  }
  timerStop() {
    this.clElapseTimer.stop();
  }
}

mtmPlayerTestumSubmitAction.id = 0;
