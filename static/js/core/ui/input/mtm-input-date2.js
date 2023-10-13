// <input type="date">
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date

// input type date styling - FireFox/Chrome 차이가 많음. 특히, FireFox 는 너무 못생김.
// https://cssdeck.com/labs/oqpjrd0k

// Pikaday - 못 생기고 아마추어적임.
// https://github.com/Pikaday/Pikaday
// https://pikaday.com/

// Browse 300.000+ SVG Vectors and Icons
// https://www.svgrepo.com/
// require('../../../../css/mtv/core/input/mtm-input-date.css');

// CodePen Home - Custom DatePicker - jquery-ui - 살짝 아마추어 느낌.
// https://codepen.io/smfoisal/pen/bjJqxL

// Custom Date Picker in JavaScript & CSS - 따라 해보자. (설명 들을 가치 있음)
// https://www.youtube.com/watch?v=wY2dao1hJms

// JAVASCRIPT & CSS DATE PICKER - 전체적으로 좋은 정보
// https://www.cssscript.com/tag/date-picker/
//  + Vanilla JS Datepicker
//      https://github.com/mymth/vanillajs-datepicker 

// Modern Javascript event calendar - 영감을 주는 달력
// https://demo.mobiscroll.com/javascript/eventcalendar/#

require('../../../../css/mtv/core/input/mtm-input-date2-v2.css');

// 이거 이상하군
// import {Datepicker} from '../../../../datepicker/js/datepicker.min.js';
import {mtvElementBuilder} from '../utils/mtv-element-builder.js';

// <i class="fa-solid fa-calendar-days"></i>
export var mtmInputDate2 = function(options) {
    // this.id = 'id-mtm-input-date2-' + mtmInputDate2.id++;
    this.index = mtmInputDate2.id++;
    this.id = 'id-mtm-input-date2-' + this.index;
    this.elThis = null;
    
    // for element matching
    this.elCompList = null;
    this.elsArray = ['elThis','elWrapper', 'elInner','elInputDate','elDateLabel','elIconLabel'];
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

mtmInputDate2.id = 0;
mtmInputDate2.defaultDate = '날짜 지정 없음';

mtmInputDate2.staticBody = [
    // {'step':0, 'tag':'div','class':'class-mtm-input-date','text':'',},
    //     {'step':1,'tag':'label','text':'<i class="fa fa-calendar-check-o"> </i> 시작일',},
    //     {'step':0,'tag':'input', 'class':'class-mtm-input-date-input',
    //         'attr' :{'type':'date', },
    //     },
    { 'step': 0, 'tag':'div', 'class':'class-mtm-input-date2-container'},
        { 'step': 1, 'tag':'div', 'class':'class-mtm-input-date2-wrapper'},
            { 'step': 1 , 'tag':'div', 'class' : 'class-mtm-input-date2 pt-0',},
                { 'step' : 1 ,'tag':'input', 'id':'', 'attr' :{'type':'text',},},
                { 'step' : 0 ,'tag':'label', 'class':'class-mtm-input-date2-name', 
                    // 'attr' :{'type':'text', 'value':mtmInputFile.defaultName,'spellcheck':'false' },
                    // 'prop' : {'readonly':true,},    
                    'text': mtmInputDate2.defaultDate,
                    'attr' :{'for':'',},
                },
                { 'step' : 0 ,'tag':'label','class' : 'class-mtm-upload-btn' , 
                    'text':'<i class="fa-solid fa-calendar-days"></i>','attr' :{'for':'',},
                },
];


mtmInputDate2.prototype._initEvents = function() {

    this.elsObject.elInputDate.addEventListener('change',this.onChangeDateHandler.bind(this));
    this.elsObject.elDateLabel.addEventListener('click',this.onClickDateHandler.bind(this));
    this.elsObject.elIconLabel.addEventListener('click',this.onClickDateHandler.bind(this));
}

mtmInputDate2.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }

    // console.log('mtvInputFile > this.elsObject : ', this.elsObject);
}

mtmInputDate2.prototype._create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtmInputDate2.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

    // 옵션 스타일 적용
    // options for style
    if(this.options.width)
        this.elThis.style.width = this.options.width;
}


mtmInputDate2.prototype._prepare = function() {
    // console.log(' mtmInputDate2 : prepare : ', this.options.title);

    // mtmInputDate2.staticBody[1]['text'] = '<i class="fa fa-calendar-check-o"> </i> ' + this.options.title;
    mtmInputDate2.staticBody[4]['attr']['for'] = 'id-mtm-input-date2-input-' + this.index;
    mtmInputDate2.staticBody[3]['id'] = 'id-mtm-input-date2-input-' + this.index;
}

mtmInputDate2.prototype._init = function() {
    this._prepare();
    this._create();
    this._matchElements();
    this._initEvents();
    
    if(this.options && this.options.value)
        this.elsObject.elInputDate.value = this.options.value;

    this.datepicker = new Datepicker(this.elsObject.elInputDate, {format: 'yyyy-mm-dd',language:'ko'}); 
    console.log('mtmInputDate2 > _init : ', this.datepicker);
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Handler ///////////////////////////////////
mtmInputDate2.prototype.onClickDateHandler = function() {
    // this.elsObject.elInputDate.dispatchEvent(new Event('click'))
    this.datepicker.show();
}

mtmInputDate2.prototype.onChangeDateHandler = function() {
    var value = '';
    if(!this.elsObject.elInputDate.value)
    {
        // this.value = this.elsObject.elFileName.innerHTML = mtmInputFile.defaultName;
        this.value = ''; 
        value = "날자 지정 없음";
    }
    else
    {
        this.value = this.elsObject.elInputDate.value;
        value = this.elsObject.elInputDate.value;
    }

    this.elsObject.elInputDate.innerHTML = value;
    console.log('mtmInputDate2 : value ', value);
}

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// API //////////////////////////////////////
mtmInputDate2.prototype.getValue = function() {
    return this.value;
}

mtmInputDate2.prototype.getDate = function() {
    return this.elsObject.elInputDate.value;
}

mtmInputDate2.prototype.setDate = function(value) {
    this.elsObject.elInputDate.value = value;
}
