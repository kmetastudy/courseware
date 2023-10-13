// <input type="date">
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date

// input type date styling
// https://cssdeck.com/labs/oqpjrd0k

// Pikaday
// https://github.com/Pikaday/Pikaday
// https://pikaday.com/

// Browse 300.000+ SVG Vectors and Icons
// https://www.svgrepo.com/
import {mtvElementBuilder} from '../utils/mtv-element-builder.js';

require('./mtm-input-text-button.css');

// 1) 텍스트 입력 박스 + Action Button 이 있는 것..

export var mtmInputTextButton = function(options) {
    this.id = 'id-mtm-input-text-button-' + mtmInputTextButton.id++;
    this.elThis = null;
    this.elLabel = null;
    this.elInputDate = null;

    // for element matching
    this.elCompList = null;
    this.elsArray = ['elThis','elInputText','elButton'];
    this.elsObject = {};

    this.value = "";

    this.options = options;

    if(!this.options)
        this.options = {};
    
    if(!this.options.title)
        this.options.title = '시작일';

    this._init();
}

mtmInputTextButton.id = 0;

mtmInputTextButton.staticBody = [
    {'step':0, 'tag':'div','class':'class-mtm-input-text-button','text':'',},
        {'step':1,'tag':'input', 'class':'class-mtm-input-text-button-input',
            'attr' :{'type':'text', },
        },
        {'step':0,'tag':'button','text':'<i class="fa fa-calendar-check-o"> </i> 시작일',},
        
];


mtmInputTextButton.prototype._initEvents = function() {
    this.elsObject.elInputText.addEventListener('change', this.onChangeHandler.bind(this));
    // if(this.options && this.options.eventChangeHandler)
    //     this.options.eventChanageHandler(this.elsObject.elInputText.value);
}

mtmInputTextButton.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
}

mtmInputTextButton.prototype._create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtmInputTextButton.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    if(this.options && this.options.classList)
    {
        for(var i=0;i<this.options.classList.length;i++)
            this.elThis.classList.add(this.options.classList[i]);
    }
    
    // 옵션 스타일 적용
    // options for style
    if(this.options && this.options.width)
        this.elThis.style.width = this.options.width;
}


mtmInputTextButton.prototype._prepare = function() {
    // console.log(' mtmInputTextButton : prepare : ', this.options.title);

    mtmInputTextButton.staticBody[2]['text'] = this.options.icon + this.options.title;
}

mtmInputTextButton.prototype._init = function() {
    this._prepare();
    this._create();
    this._matchElements();
    this._initEvents();
    
    if(this.options.title_width)
        this.elsObject.elButton.style.width = this.options.title_width;

    this.elsObject.elButton.addEventListener('click',this.onClickHandler.bind(this));
}
//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Handler //////////////////////////////////
mtmInputTextButton.prototype.onChangeHandler = function() {
    console.log('------------ mtmInputTextButton > onChangeHandler ------------------- ');
    if(this.options && this.options.eventChangeHandler)
        this.options.eventChangeHandler(this.elsObject.elInputText.value);
}

mtmInputTextButton.prototype.onClickHandler = function() {
    if(this.options && this.options.eventClick)
        this.options.eventClick();
}
//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// API ////////////////////////////////////
mtmInputTextButton.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

// mtmInputTextButton.prototype.getValue = function() {
//     return this.value;
// }

mtmInputTextButton.prototype.getValue = function() {
    return this.elsObject.elInputText.value;
}

mtmInputTextButton.prototype.setValue = function(value) {
    this.elsObject.elInputText.value = value;
}

mtmInputTextButton.prototype.setReadOnly = function(bReadOnly)
{
    this.elsObject.elInputText.readOnly = bReadOnly;
}

mtmInputTextButton.prototype.setBtnEnable = function(bEnable)
{
    if(bEnable)
        this.elsObject.elButton.disabled = false;
    else
        this.elsObject.elButton.setAttribute('disabled',true);
}