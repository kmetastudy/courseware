// SVG in CSS backgrounds
// https://codepen.io/noahblon/post/coloring-svgs-in-css-background-images

// Change Color of SVG on Hover
// https://css-tricks.com/change-color-of-svg-on-hover/

// SVG 아이콘 사용하기
// https://junojunho.com/front-end/svg-icon
// require('../../../../css/mtv/core/input/mtm-input-date-inline.css');
require('../../../../css/mtv/core/input/mtm-input-date-inline-v2.css');

import {mtvElementBuilder} from '../utils/mtv-element-builder.js';

export var mtmInputDateInline = function(options) {
    this.id = 'id-mtm-input-date-inline-' + mtmInputDateInline.id++;
    this.elThis = null;
    this.elLabel = null;
    this.elInputDate = null;

    // for element matching
    this.elCompList = null;
    this.elsArray = ['elThis','elInputDate'];
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

mtmInputDateInline.id = 0;

mtmInputDateInline.staticBody = [
    {'step':0, 'tag':'div','class':'mtm-input-date-inline','text':'',},
        {'step':1,'tag':'input', 'class':'mtm-input-date-input',
            'attr' :{'type':'date', },
        },
];


mtmInputDateInline.prototype._initEvents = function() {
        
}

mtmInputDateInline.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
}

mtmInputDateInline.prototype._create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtmInputDateInline.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    // 옵션 스타일 적용
    // options for style
    // if(this.options.width)
    //     this.elThis.style.width = this.options.width;
}


mtmInputDateInline.prototype._prepare = function() {
    // console.log(' mtmInputDateInline : prepare : ', this.options.title);

    // mtmInputDateInline.staticBody[1]['text'] = '<i class="fa fa-calendar-check-o"> </i> ' + this.options.title;
}

mtmInputDateInline.prototype._init = function() {
    this._prepare();
    this._create();
    this._initEvents();
    this._matchElements();

    if(this.options && this.options.value)
        this.elsObject.elInputDate.value = this.options.value;
}

//////////////////////////////////////////////////////
mtmInputDateInline.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtmInputDateInline.prototype.getValue = function() {
    return this.value;
}

mtmInputDateInline.prototype.getDate = function() {
    return this.elsObject.elInputDate.value;
}

mtmInputDateInline.prototype.setDate = function(value) {
    this.elsObject.elInputDate.value = value;
}
