import {mtmStudySubmitAction} from '../study/mtm-study-submit-action.js';

export var mtmPlayerTestumSubmitAction = function(options) {
    this.id = 'id-mtm-player-testum-submit-action-' + mtmPlayerTestumSubmitAction.id++;
    this.elThis = null;
    this.options = options;
    this._init();
}

mtmPlayerTestumSubmitAction.id = 0;

mtmPlayerTestumSubmitAction.prototype._init = function () {
    var timer_options = {
        enable : true,
        text : ' 00:00:00',
        iClass : 'fa-regular fa-clock',
        eventHandler:this.options.eventTimerHandler,
    };

    var options = {};
    options.items = [
        {
            // mtvClass : mtvInputButton,
            enable : true,
            text : ' 오답 하기',
            icon : 'fa fa-check',
            eventHandler:this.options.eventCorrectWrongHandler,
        },
        {
            // mtvClass : mtvInputButton,
            enable : true,
            text : ' 다음 하기',
            icon : 'fa fa-external-link',
            eventHandler:this.options.eventNextStepHandler.bind(this),
        },
        {
            // mtvClass : mtvInputButton,
            enable : true,
            text : ' 전체 보기',
            icon : 'fa fa-list',
            eventHandler:this.options.eventStatusHandler.bind(this),
        },
    ];

    this.clTestumSubmitAction = new mtmStudySubmitAction(options);
    // element = this.clTestumSubmitActionSlider.elThis;
    this.clTestumSubmitAction.setShow(0,false);
    this.clTestumSubmitAction.setShow(1,false);
    this.clTestumSubmitAction.setShow(2,false);
    this.elThis = this.clTestumSubmitAction.elThis;

    this.elThis.setAttribute('id',this.id);
}

////////////////////////////// API //////////////////////////////////////
mtmPlayerTestumSubmitAction.prototype.show = function (bShow) {
    if(bShow)
        this.elThis.style.display = ''
    else
        this.elThis.style.display = 'none';
}

mtmPlayerTestumSubmitAction.prototype.setShow = function (index,bShow) {
    this.clTestumSubmitAction.setShow(index,bShow);
}

mtmPlayerTestumSubmitAction.prototype.showTimeElapse = function (bShow) {
    this.clTestumSubmitAction.setShow(0,bShow);
}

mtmPlayerTestumSubmitAction.prototype.showCorrectWrong = function (bShow) {
    this.clTestumSubmitAction.setShow(1,bShow);
}

mtmPlayerTestumSubmitAction.prototype.showNextStep = function (bShow) {
    this.clTestumSubmitAction.setShow(2,bShow);
}

mtmPlayerTestumSubmitAction.prototype.showTotalResult = function (bShow) {
    this.clTestumSubmitAction.setShow(3,bShow);
}

mtmPlayerTestumSubmitAction.prototype.timerStart = function () {
    this.clElapseTimer.start();
}

mtmPlayerTestumSubmitAction.prototype.timerReset = function () {
    this.clElapseTimer.reset();
}

mtmPlayerTestumSubmitAction.prototype.timerStop = function () {
    this.clElapseTimer.stop();
}


