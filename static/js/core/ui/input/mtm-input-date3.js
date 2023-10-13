// <input type="date">
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date

// input type date styling
// https://cssdeck.com/labs/oqpjrd0k

// Pikaday
// https://github.com/Pikaday/Pikaday
// https://pikaday.com/

// Browse 300.000+ SVG Vectors and Icons
// https://www.svgrepo.com/
// require('../../../../css/mtv/core/input/mtm-input-date.css');
require('../../../../css/mtv/core/input/mtm-input-date3-v2.css');

import {mtoElementBuilder} from '../utils/mto-element-builder.js';

export var mtmInputDate3 = function(options) {
    this.id = 'id-mtm-input-date3-' + mtmInputDate3.id++;
    this.elThis = null;
    this.elLabel = null;
    this.elInputDate = null;

    // for element matching
    this.elCompList = null;
    this.elsArray = ['elThis','elDateLabel','elInputDate'];
    this.elsObject = {};

    this.value = "";

    if(!options)
        this.options = {};
    else
        this.options = options;

    // if(!this.options.placeholder)
    //     this.options.placeholder = '입력하세요';
    if(!this.options.title)
        this.options.title = '시작일';

    this._init();
}

mtmInputDate3.id = 0;

mtmInputDate3.staticBody = [
    {'step':0, 'tag':'div','class':'class-mtm-input-date3','text':'',},
        {'step':1,'tag':'label','text':'<i class="fa fa-calendar-check-o"> </i> 시작일',},
        {'step':0,'tag':'input', 'class':'class-mtm-input-date3-input',
            'attr' :{'type':'text', },
        },
];


mtmInputDate3.prototype._initEvents = function() {
    // this.elsObject.elInputDate.addEventListener('change',this.onChangeDateHandler.bind(this));
    this.elsObject.elDateLabel.addEventListener('click',this.onClickDateHandler.bind(this));
    // this.elsObject.elIconLabel.addEventListener('click',this.onClickDateHandler.bind(this));
}

mtmInputDate3.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
}

mtmInputDate3.prototype._create = function() {
    this.elCompList = mtoElementBuilder.buildComponent(mtmInputDate3.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    // 옵션 스타일 적용
    // options for style
    if(this.options.width)
        this.elThis.style.width = this.options.width;
}


mtmInputDate3.prototype._prepare = function() {
    // console.log(' mtmInputDate3 : prepare : ', this.options.title);
    if(this.options && this.options.noIcon)
        mtmInputDate3.staticBody[1]['text'] = this.options.title;
    else if(this.options && this.options.iconHtml)
        mtmInputDate3.staticBody[1]['text'] = this.options.iconHtml + this.options.title;
    else
        mtmInputDate3.staticBody[1]['text'] = '<i class="fa fa-calendar-check-o"> </i> ' + this.options.title;
}

mtmInputDate3.prototype._init = function() {
    this._prepare();
    this._create();
    this._matchElements();

    this._initEvents();
    
    if(this.options && this.options.value)
        this.elsObject.elInputDate.value = this.options.value;
    if(this.options && this.options.classes)
    {
        for(var i=0;i<this.options.classes.length;i++)
            this.elsObject.elThis.classList.add(this.options.classes[i]);
    }

    this.elsObject.elInputDate.addEventListener('change',this.onChangeHandler.bind(this));
    // this.datepicker = new Datepicker(this.elsObject.elInputDate, {format: 'yyyy-mm-dd',language:'ko'}); 
    //     console.log('mtmInputDate3 > _init : ', this.datepicker);
    this.instance = new dtsel.DTS(this.elsObject.elInputDate, {dateFormat: "yyyy-mm-dd",});
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Handler ///////////////////////////////////
mtmInputDate3.prototype.onChangeHandler = function() {
    console.log('mtmInputDate3 > onChangeHandler : ',this.elsObject.elInputDate.value);

    // this.elsObject.elInputDate.dispatchEvent(new Event('click'))
    // this.datepicker.show();
}

mtmInputDate3.prototype.onClickDateHandler = function() {
    // this.elsObject.elInputDate.dispatchEvent(new Event('click'))
    // this.datepicker.show();
}

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// API /////////////////////////////////////
mtmInputDate3.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtmInputDate3.prototype.getValue = function() {
    return this.value;
}

mtmInputDate3.prototype.getDate = function() {
    return this.elsObject.elInputDate.value;
}

mtmInputDate3.prototype.setDate = function(value) {
    this.elsObject.elInputDate.value = value;
}
