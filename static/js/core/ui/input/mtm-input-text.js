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

require('./mtm-input-text.css');

// Title Label + Input Text 순서로 있는것
// Title Label 에는 아이콘과 텍스트 가능
// Placeholder 기능
export var mtmInputText = function(options) {
    this.id = 'id-mtm-input-text-' + mtmInputText.id++;
    this.elThis = null;
    this.elLabel = null;
    this.elInputDate = null;

    // for element matching
    this.elCompList = null;
    this.elsArray = ['elThis','elLabel','elInputText'];
    this.elsObject = {};

    this.value = "";

    this.options = options;

    if(!this.options)
        this.options = {};
    
    if(!this.options.title)
        this.options.title = '시작일';

    this._init();
}

mtmInputText.id = 0;

mtmInputText.staticBody = [
    {'step':0, 'tag':'div','class':'class-mtm-input-text','text':'',},
        {'step':1,'tag':'label','text':'<i class="fa fa-calendar-check-o"> </i> 시작일',},
        {'step':0,'tag':'input', 'class':'class-mtm-input-text-input',
            'attr' :{'type':'text', },
        },
];


mtmInputText.prototype._initEvents = function() {
    this.elsObject.elInputText.addEventListener('change', this.onChangeHandler.bind(this));
    // if(this.options && this.options.eventChangeHandler)
    //     this.options.eventChanageHandler(this.elsObject.elInputText.value);
}

mtmInputText.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
}

mtmInputText.prototype._create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtmInputText.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    // 옵션 스타일 적용
    // options for style
    if(this.options.width)
        this.elThis.style.width = this.options.width;
}


mtmInputText.prototype._prepare = function() {
    // console.log(' mtmInputText : prepare : ', this.options.title);

    mtmInputText.staticBody[1]['text'] = this.options.icon + this.options.title;
}

mtmInputText.prototype._init = function() {
    this._prepare();
    this._create();
    this._matchElements();
    this._initEvents();
    
    if(this.options.title_width)
        this.elsObject.elLabel.style.width = this.options.title_width;
}
//////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// Handler //////////////////////////////////
mtmInputText.prototype.onChangeHandler = function() {
    console.log('------------ mtmInputText > onChangeHandler ------------------- ');
    if(this.options && this.options.eventChangeHandler)
        this.options.eventChangeHandler(this.elsObject.elInputText.value);
}

//////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// API ////////////////////////////////////
mtmInputText.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

// mtmInputText.prototype.getValue = function() {
//     return this.value;
// }

mtmInputText.prototype.getValue = function() {
    return this.elsObject.elInputText.value;
}

mtmInputText.prototype.setValue = function(value) {
    this.elsObject.elInputText.value = value;
}

mtmInputText.prototype.setReadOnly = function(bReadOnly)
{
    this.elsObject.elInputText.readOnly = bReadOnly;
}