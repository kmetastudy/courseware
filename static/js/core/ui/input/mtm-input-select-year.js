////////////////////////////////////////////////////////////////////////
// mtmInputSelectYear 는 Horizonatl Button Group 을 이용하여, 
// 해당 연도를 선택하는 기능을 한다.
// UI : << Year >>
////////////////////////////////////////////////////////////////////////
// Horizontal Button Groups
// https://www.w3schools.com/howto/howto_css_button_group.asp
//----------------------------------------------------------------------
require('./mtm-input-select-year.css');
import {mtvElementBuilder} from '../utils/mtv-element-builder.js';

export var mtmInputSelectYear = function(options)
{
    this.id = 'id-mtm-input-select-year-' + mtmInputSelectYear.id++;
    this.elThis = null;
    this.elLeft = null;
    this.elYear = null;
    this.elRight = null;
    
    // for elements matching
    this.elCompList = null;
    this.elsArray = ['elThis','elWrapper','elLeft','elYear','elRight'];
    this.elsObject = {};

    this.today = new Date();
    this.year = this.today.getFullYear();
    this.currentYear = this.year;

    this._init();
}

mtmInputSelectYear.id = 0;

mtmInputSelectYear.staticBody = [
    {'step':0, 'tag':'div', 'class': 'mtm-input-select-year d-flex justify-content-center',
        // 'attr':{'style':'width:50%'}
    },
        {'step':1 , 'tag': 'div', 'class':'wrapper',},
            {'step':1, 'tag':'button', 'class': 'mtm-input-select-year-left',
                //  'text':'&lt;'
            },
            {'step':0, 'tag':'button', 'class': 'mtm-input-select-year-center', 'text' : 'Year'},
            {'step':0, 'tag':'button', 'class': 'mtm-input-select-year-right', 
                // 'text' : '&gt;'
            },
        
];

mtmInputSelectYear.prototype._create = function() {

    this.elCompList = mtvElementBuilder.buildComponent(mtmInputSelectYear.staticBody,true);

    // console.log('mtmInputSelectYear > this.elCompList : ', this.elCompList);

    // Component List Matching
    this.elThis = this.elCompList[0];
    this.elThis.setAttribute('id',this.id);
}

mtmInputSelectYear.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }
    // console.log('mtmInputSelectYear > this.elsObject : ', this.elsObject);
}

mtmInputSelectYear.prototype._initEvents = function() {

    this.elsObject.elLeft.addEventListener('click',this.leftClickHandler.bind(this));
    this.elsObject.elRight.addEventListener('click',this.rightClickHandler.bind(this));
    this.elsObject.elYear.addEventListener('click',this.centerClickHandler.bind(this));
    
}

mtmInputSelectYear.prototype._prepare = function() {
    mtmInputSelectYear.staticBody[2]['text'] = this.currentYear;
}

mtmInputSelectYear.prototype._init = function() {
    this._prepare();
    this._create();
    this._matchElements();
    this._initEvents();
}

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Handler ///////////////////////////////////
mtmInputSelectYear.prototype.leftClickHandler = function() {
    this.currentYear--;
    this.elsObject.elYear.innerHTML = this.currentYear ;
}

mtmInputSelectYear.prototype.rightClickHandler = function() {
    this.currentYear++;
    this.elsObject.elYear.innerHTML = this.currentYear ;
}

mtmInputSelectYear.prototype.centerClickHandler = function() {
    this.elsObject.elYear.innerHTML = this.currentYear = this.year;
}

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// API /////////////////////////////////////
mtmInputSelectYear.prototype.getYear = function() {
    return this.currentYear;
}