// SVG in CSS backgrounds
// https://codepen.io/noahblon/post/coloring-svgs-in-css-background-images

// Change Color of SVG on Hover
// https://css-tricks.com/change-color-of-svg-on-hover/

// SVG 아이콘 사용하기
// https://junojunho.com/front-end/svg-icon

require('./mtm-input-date-inline3.css');

import {mtvElementBuilder} from '../utils/mtv-element-builder.js';

export var mtmInputDateInline3 = function(options) {
    this.id = 'id-mtm-input-date-inline3-' + mtmInputDateInline3.id++;
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

mtmInputDateInline3.id = 0;

mtmInputDateInline3.staticBody = [
    {'step':0, 'tag':'div','class':'mtm-input-date-inline3','text':'',},
        {'step':1,'tag':'input', 'class':'mtm-input-date-input',
            'attr' :{'type':'text', 'vaule':''},
        },
];


mtmInputDateInline3.prototype._initEvents = function() {
    this.elsObject.elInputDate.addEventListener('change',this.onChangeValueHandler.bind(this));
    this.elsObject.elInputDate.addEventListener('blur', this.onBlurHandler.bind(this));
    this.elsObject.elInputDate.addEventListener('realblur', this.onRealBlurHandler.bind(this));
    
}

mtmInputDateInline3.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
}

mtmInputDateInline3.prototype._create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtmInputDateInline3.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    // 옵션 스타일 적용
    // options for style
    // if(this.options.width)
    //     this.elThis.style.width = this.options.width;
}


mtmInputDateInline3.prototype._prepare = function() {
    // console.log(' mtmInputDateInline3 : prepare : ', this.options.title);

    // mtmInputDateInline3.staticBody[1]['text'] = '<i class="fa fa-calendar-check-o"> </i> ' + this.options.title;
}

mtmInputDateInline3.prototype._init = function() {
    this._prepare();
    this._create();
    this._matchElements();
    
    
    if(this.options && this.options.value)
        this.elsObject.elInputDate.value = this.options.value;
    // Todo. Jstar 툴팁(Tooltip) 처럼 해야 되는 데...
    // this.datepicker = new Datepicker(this.elsObject.elInputDate, {format: 'yyyy-mm-dd',language:'ko'}); 
    //     console.log('mtmInputDate3 > _init : ', this.datepicker);
    
    var showTime = false;
    var showDate = true;

    // console.log('mtmInputDateInline3 > _init : ',this.options);

    if(this.options && this.options.eData)
    {
        if(this.options.eData.type == 2)  // date only
        {
            this.elThis.classList.add('date');
        }
        else if(this.options.eData.type == 3)  // date and time
        {
            this.elThis.classList.add('date-time');
            showTime = true;
        }
        else if(this.options.eData.type == 4)  // time only
        {
            this.elThis.classList.add('time');
            showTime = true;
            showDate = false;
        }
    }

    this.instance = new dtsel.DTS(this.elsObject.elInputDate, {
        dateFormat: "yyyy-mm-dd",
        showTime: showTime,
        showDate : showDate,
        timeFormat: "HH:MM",
    });

    this._initEvents();
}
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Handler /////////////////////////////////////////
mtmInputDateInline3.prototype.onChangeValueHandler = function() {
    
    if(this.options && (this.elsObject.elInputDate.value == this.options.value))
        return;
    
    // if(this.options && this.options.eventHandler)
    // {
    //     this.options.value = this.elsObject.elInputDate.value;
    //     this.options.eventHandler(this.options.value,this.options.eData);
    // }
}

mtmInputDateInline3.prototype.onBlurHandler = function() {
    // console.log('mtmInputDateInline3 > onBlurHandler ');

    // if(this.options && this.options.eventHandler)
    // {
    //     this.options.value = this.elsObject.elInputDate.value;
    //     this.options.eventHandler(this.options.value,this.options.eData);
    // }
}

mtmInputDateInline3.prototype.onRealBlurHandler = function (params) {
    // console.log('mtmInputDateInline3 > onRealBlurHandler ');
    if(this.options && (this.elsObject.elInputDate.value == this.options.value))
        return;
    if(this.options && this.options.eventHandler)
    {
        this.options.value = this.elsObject.elInputDate.value;
        this.options.eventHandler(this.options.value,this.options.eData);
    }
}
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// API /////////////////////////////////////////
mtmInputDateInline3.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtmInputDateInline3.prototype.getValue = function() {
    return this.value;
}

mtmInputDateInline3.prototype.getDate = function() {
    return this.elsObject.elInputDate.value;
}

mtmInputDateInline3.prototype.setDate = function(value) {
    this.elsObject.elInputDate.value = value;
}
