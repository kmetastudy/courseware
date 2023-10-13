////////////////////////////////////////////////////////////////////////
// mtvInputSelectYear 는 Horizonatl Button Group 을 이용하여, 
// 해당 연도를 선택하는 기능을 한다.
// UI : << Year >>
////////////////////////////////////////////////////////////////////////
// Horizontal Button Groups
// https://www.w3schools.com/howto/howto_css_button_group.asp
//----------------------------------------------------------------------
import {mtvElementBuilder} from '../utils/mtv-element-builder.js';

export var mtvInputSelectYear = function(options)
{
    this.id = 'id-mtv-input-select-year-' + mtvInputSelectYear.id++;
    this.elThis = null;
    this.elLeft = null;
    this.elYear = null;
    this.elRight = null;
    
    // for elements matching
    this.elCompList = null;
    this.elsArray = ['elThis','elLeft','elYear','elRight'];
    this.elsObject = {};

    this.today = new Date();
    this.year = this.today.getFullYear();
    this.currentYear = this.year;

    this.init();
}

mtvInputSelectYear.id = 0;

mtvInputSelectYear.staticBody = [
    // <div class="mtv-input-select-year">
    //     <button>&lt;</button>
    //     <button>Year</button>
    //     <button>&gt;</button>
    // </div>
    {'step':0, 'tag':'div', 'class': 'mtv-input-select-year d-flex justify-content-center','attr':{'style':'width:50%'}},
        {'step':1, 'tag':'button', 'class': 'mtv-input-select-year-left', 'text':'&lt;'},
        {'step':0, 'tag':'button', 'class': 'mtv-input-select-year-center', 'text' : 'Year'},
        {'step':0, 'tag':'button', 'class': 'mtv-input-select-year-right', 'text' : '&gt;'},
        
];

mtvInputSelectYear.prototype.leftClickHandler = function() {
    this.currentYear--;
    this.elsObject.elYear.innerHTML = this.currentYear ;
}

mtvInputSelectYear.prototype.rightClickHandler = function() {
    this.currentYear++;
    this.elsObject.elYear.innerHTML = this.currentYear ;
}

mtvInputSelectYear.prototype.centerClickHandler = function() {
    this.elsObject.elYear.innerHTML = this.currentYear = this.year;
}

mtvInputSelectYear.prototype.create = function() {

    this.elCompList = mtvElementBuilder.buildComponent(mtvInputSelectYear.staticBody,true);

    // console.log('mtvInputSelectYear > this.elCompList : ', this.elCompList);

    // Component List Matching
    this.elThis = this.elCompList[0];
    // this.elLeft = this.elCompList[1];
    // this.elYear = this.elCompList[2];
    // this.elRight = this.elCompList[3];
    
    // console.log('mtvInputSelectYear > this.elThis : ', this.elThis);
    // console.log('mtvInputSelectYear > this.elLeft : ', this.elLeft);
    // console.log('mtvInputSelectYear > this.elYear : ', this.elYear);
    // console.log('mtvInputSelectYear > this.elRight : ', this.elRight);
    
    
    
}

mtvInputSelectYear.prototype.matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }
    // console.log('mtvInputSelectYear > this.elsObject : ', this.elsObject);
}

mtvInputSelectYear.prototype.initEvents = function() {

    this.elsObject.elLeft.addEventListener('click',this.leftClickHandler.bind(this));
    this.elsObject.elRight.addEventListener('click',this.rightClickHandler.bind(this));
    this.elsObject.elYear.addEventListener('click',this.centerClickHandler.bind(this));
    
}

mtvInputSelectYear.prototype.prepare = function() {
    mtvInputSelectYear.staticBody[2]['text'] = this.currentYear;
}

mtvInputSelectYear.prototype.init = function() {
    this.prepare();
    this.create();
    this.matchElements();
    this.initEvents();
}

//////////////////////////////////////////////////////
mtvInputSelectYear.prototype.getYear = function() {
    return this.currentYear;
}