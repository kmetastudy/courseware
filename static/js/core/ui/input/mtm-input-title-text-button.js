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

require('./mtm-input-title-text-button.css');

// 1) 텍스트 입력 박스 + Action Button 이 있는 것..

export var mtmInputTitleTextButton = function(options) {
    this.id = 'id-mtm-input-title-text-button-' + mtmInputTitleTextButton.id++;
    this.elThis = null;
    this.elLabel = null;
    this.elInputDate = null;

    // for element matching
    this.elCompList = null;
    this.elsArray = ['elThis','elLabel','elInputText','elButton'];
    this.elsObject = {};

    this.value = "";

    this.options = options;

    if(!this.options)
        this.options = {};
    
    if(!this.options.title)
        this.options.title = '제목';
    if(!this.options.btnTitle)
        this.options.btnTitle = '저장';
    this._init();
}

mtmInputTitleTextButton.id = 0;

mtmInputTitleTextButton.staticBody = [
    {'step':0, 'tag':'div','class':'class-mtm-input-title-text-button','text':'',},
        {'step':1,'tag':'label','text':'<i class="fa-solid fa-file"></i> 제목',},
        {'step':0,'tag':'input', 'class':'class-mtm-input-title-text-button-input',
            'attr' :{'type':'text', },
        },
        {'step':0,'tag':'button','text':'<i class="fa-solid fa-check"></i> 저장',},
        
];


mtmInputTitleTextButton.prototype._initEvents = function() {
    this.elsObject.elInputText.addEventListener('change', this.onChangeHandler.bind(this));
    // if(this.options && this.options.eventChangeHandler)
    //     this.options.eventChanageHandler(this.elsObject.elInputText.value);
}

mtmInputTitleTextButton.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
}

mtmInputTitleTextButton.prototype._create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtmInputTitleTextButton.staticBody,true);
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


mtmInputTitleTextButton.prototype._prepare = function() {
    if(this.options && this.options.icon)
        mtmInputTitleTextButton.staticBody[1]['text'] = this.options.icon + this.options.title;
    else
        mtmInputTitleTextButton.staticBody[1]['text'] = this.options.title;
    mtmInputTitleTextButton.staticBody[3]['text'] = this.options.btnTitle;
}

mtmInputTitleTextButton.prototype._init = function() {
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
mtmInputTitleTextButton.prototype.onChangeHandler = function() {
    console.log('------------ mtmInputTitleTextButton > onChangeHandler ------------------- ');
    if(this.options && this.options.eventChangeHandler)
        this.options.eventChangeHandler(this.elsObject.elInputText.value);
}

mtmInputTitleTextButton.prototype.onClickHandler = function() {
    console.log('mtmInputTitleTextButton > onClickHandler');

    if(this.options && this.options.eventClick)
        this.options.eventClick();
}
//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// API ////////////////////////////////////
mtmInputTitleTextButton.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

// mtmInputTitleTextButton.prototype.getValue = function() {
//     return this.value;
// }

mtmInputTitleTextButton.prototype.getValue = function() {
    return this.elsObject.elInputText.value;
}

mtmInputTitleTextButton.prototype.setValue = function(value) {
    this.elsObject.elInputText.value = value;
}

mtmInputTitleTextButton.prototype.setReadOnly = function(bReadOnly)
{
    this.elsObject.elInputText.readOnly = bReadOnly;
}

mtmInputTitleTextButton.prototype.setBtnEnable = function(bEnable)
{
    if(bEnable)
        this.elsObject.elButton.disabled = false;
    else
        this.elsObject.elButton.setAttribute('disabled',true);
}
