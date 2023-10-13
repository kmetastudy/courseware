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

export var mtvInputDate = function(options) {
    this.id = 'id-mtv-input-date-' + mtvInputDate.id++;
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

    this.init();
}

mtvInputDate.id = 0;

mtvInputDate.staticBody = [
    {'step':0, 'tag':'div','class':'class-mtv-input-date','text':'',},
        {'step':1,'tag':'label','text':'<i class="fa fa-calendar-check-o"> </i> 시작일',},
        {'step':0,'tag':'input', 'class':'class-mtv-input-date-input',
            'attr' :{'type':'date', },
        },
];


mtvInputDate.prototype.initEvents = function() {
        
}

mtvInputDate.prototype.matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
}

mtvInputDate.prototype.create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtvInputDate.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    // 옵션 스타일 적용
    // options for style
    if(this.options.width)
        this.elThis.style.width = this.options.width;
}


mtvInputDate.prototype.prepare = function() {
    // console.log(' mtvInputDate : prepare : ', this.options.title);

    mtvInputDate.staticBody[1]['text'] = '<i class="fa fa-calendar-check-o"> </i> ' + this.options.title;
}

mtvInputDate.prototype.init = function() {
    this.prepare();
    this.create();
    this.initEvents();
    this.matchElements();
}

//////////////////////////////////////////////////////
mtvInputDate.prototype.getValue = function() {
    return this.value;
}

mtvInputDate.prototype.getDate = function() {
    return this.elsObject.elInputDate.value;
}

mtvInputDate.prototype.setDate = function(value) {
    this.elsObject.elInputDate.value = value;
}
