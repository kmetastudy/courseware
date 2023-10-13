import {mtmStudySubmitAction} from '../study/mtm-study-submit-action.js';

export var mtmPlayerTestumResultAction = function(options) {
    this.id = 'id-mtm-player-testum-result-action-' + mtmPlayerTestumResultAction.id++;
    this.elThis = null;    
    this.options = options;
    this.init();
}

mtmPlayerTestumResultAction.id = 0;

mtmPlayerTestumResultAction.prototype.init = function () {
    var submitOptions = {};
    submitOptions.items = [
            {
                enable : true,
                text : ' 오답 하기',
                icon : 'fa fa-check',
                eventHandler:this.options.eventCorrectWrongHandler,
            },
            {
                enable : true,
                text : ' 다음 하기',
                icon : 'fa fa-external-link',
                eventHandler:this.options.eventNextStepHandler,
            },
            {
                enable : true,
                text : ' 결과 보기',
                icon : 'fa fa-list',
                eventHandler:this.options.eventStatusHandler,
            },
            // {
            //     enable : true,
            //     text : '설정',
            //     icon : 'fa fa-external-link',
            //     eventHandler:this.onSettingHandler.bind(this),
            // }
    ];

    this.clTestumSubmitAction = new mtmStudySubmitAction(submitOptions);
    // element = this.clTestumSubmitActionSlider.elThis;
    this.clTestumSubmitAction.setShow(1,false);
    this.clTestumSubmitAction.setShow(2,false);
    this.clTestumSubmitAction.setShow(3,false);
    this.elThis = this.clTestumSubmitAction.elThis;

    this.elThis.setAttribute('id',this.id);
}
////////////////////////////// API //////////////////////////////////////
mtmPlayerTestumResultAction.prototype.show = function (bShow) {
    if(bShow)
        this.elThis.style.display = ''
    else
        this.elThis.style.display = 'none';
}

mtmPlayerTestumResultAction.prototype.setShow = function (index,bShow) {
    this.clTestumSubmitAction.setShow(index,bShow);
}

mtmPlayerTestumResultAction.prototype.showCorrectWrong = function (bShow) {
    this.clTestumSubmitAction.setShow(0,bShow);
}

mtmPlayerTestumResultAction.prototype.showNextStep = function (bShow) {
    this.clTestumSubmitAction.setShow(1,bShow);
}

mtmPlayerTestumResultAction.prototype.showTotalResult = function (bShow) {
    this.clTestumSubmitAction.setShow(2,bShow);
}
