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
require('../../../../css/mtv/core/input/mtm-input-date-v2.css');

import {mtvElementBuilder} from '../utils/mtv-element-builder.js';

export var mtmInputDate = function(options) {
    this.id = 'id-mtm-input-date-' + mtmInputDate.id++;
    this.elThis = null;
    this.elLabel = null;
    this.elInputDate = null;

    // for element matching
    this.elCompList = null;
    this.elsArray = ['elThis','elLabel','elInputDate'];
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

mtmInputDate.id = 0;

mtmInputDate.staticBody = [
    {'step':0, 'tag':'div','class':'class-mtm-input-date','text':'',},
        {'step':1,'tag':'label','text':'<i class="fa fa-calendar-check-o"> </i> 시작일',},
        {'step':0,'tag':'input', 'class':'class-mtm-input-date-input',
            'attr' :{'type':'date', },
        },
];


mtmInputDate.prototype._initEvents = function() {
        
}

mtmInputDate.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
}

mtmInputDate.prototype._create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtmInputDate.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    // 옵션 스타일 적용
    // options for style
    if(this.options.width)
        this.elThis.style.width = this.options.width;
}


mtmInputDate.prototype._prepare = function() {
    // console.log(' mtmInputDate : prepare : ', this.options.title);

    mtmInputDate.staticBody[1]['text'] = '<i class="fa fa-calendar-check-o"> </i> ' + this.options.title;
}

mtmInputDate.prototype._init = function() {
    this._prepare();
    this._create();
    this._initEvents();
    this._matchElements();

    if(this.options && this.options.value)
        this.elsObject.elInputDate.value = this.options.value;
}

//////////////////////////////////////////////////////
mtmInputDate.prototype.getValue = function() {
    return this.value;
}

mtmInputDate.prototype.getDate = function() {
    return this.elsObject.elInputDate.value;
}

mtmInputDate.prototype.setDate = function(value) {
    this.elsObject.elInputDate.value = value;
}
