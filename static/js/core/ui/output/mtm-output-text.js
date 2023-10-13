// <input type="date">
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date

// input type date styling
// https://cssdeck.com/labs/oqpjrd0k

// Pikaday
// https://github.com/Pikaday/Pikaday
// https://pikaday.com/

// Browse 300.000+ SVG Vectors and Icons
// https://www.svgrepo.com/
import {mtoElementBuilder} from '../utils/mto-element-builder.js';

// 이것을 output 으로 따로 해야 하나?
require('../input/mtm-input-text.css');

export var mtmOutputText = function(options) {
    this.id = 'id-mtm-output-text-' + mtmOutputText.id++;
    this.elThis = null;
    this.elLabel = null;
    this.elInputDate = null;

    // for element matching
    this.elCompList = null;
    this.elsArray = ['elThis','elLabel',];
    this.elsObject = {};

    this.value = "";

    this.options = options;

    if(!this.options)
        this.options = {};
    
    if(!this.options.title)
        this.options.title = '시작일';

    this._init();
}

mtmOutputText.id = 0;

mtmOutputText.staticBody = [
    {'step':0, 'tag':'div','class':'class-mtm-output-text','text':'',},
        {'step':1,'tag':'label','text':'<i class="fa fa-calendar-check-o"> </i> 시작일',},
        // {'step':0,'tag':'input', 'class':'class-mtm-input-text-input',
        //     'attr' :{'type':'text', },
        // },
];


mtmOutputText.prototype._initEvents = function() {
        
}

mtmOutputText.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
}

mtmOutputText.prototype._create = function() {
    this.elCompList = mtoElementBuilder.buildComponent(mtmOutputText.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    // 옵션 스타일 적용
    // options for style
    if(this.options.width)
        this.elThis.style.width = this.options.width;
}


mtmOutputText.prototype._prepare = function() {
    // console.log(' mtmOutputText : prepare : ', this.options.title);

    mtmOutputText.staticBody[1]['text'] = this.options.icon + this.options.title;
}

mtmOutputText.prototype._init = function() {
    this._prepare();
    this._create();
    this._initEvents();
    this._matchElements();
}

///////////////////////////////////////////////////////////
/////////////////////////// API ///////////////////////////
mtmOutputText.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtmOutputText.prototype.getValue = function() {
    return this.value;
}

mtmOutputText.prototype.getValue = function() {
    return this.elsObject.elInputText.value;
}

mtmOutputText.prototype.setValue = function(value) {
    this.elsObject.elInputText.value = value;
}

mtmOutputText.prototype.setReadOnly = function(bReadOnly)
{
    this.elsObject.elInputText.readOnly = bReadOnly;
}