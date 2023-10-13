// Custom Styling Form Inputs With Modern CSS Features
// https://css-tricks.com/custom-styling-form-inputs-with-modern-css-features/

// Animated Toggle Button with JavaScript | ON-OFF Toggle Button Using HTML, CSS, and JS
// https://www.youtube.com/watch?v=R6ODcr-MwKE
import {mtvElementBuilder} from '../utils/mtv-element-builder.js';
require('../../../../css/mtv/core/input/mtv-input-toggle.css');

// Mod-Exam. Jstar : Exam -> mtvInputToggleText 를 통채로... 체크 박스로 할려니까 좀...
export var mtvInputToggleText = function(options) {
    this.id = 'id-mtv-input-toggle-text-' + mtvInputToggleText.id++;
    this.elThis = null;
    this.onActive =false;

    this.elCompList = null;
    this.elsArray = ['elThis','elToggle','elButton'];
    this.elsObject = {};
    this._init();
}

mtvInputToggleText.id = 0;

mtvInputToggleText.staticBody = [
    // <label> 
    //     First Name:
    //     <input type="text" name="firstname" />
    // </label>

    // <label for="explicit-label-name">Last Name: </label>
    // <input type="text" id="explicit-label-name" name="lastname" />
    {'step' : 0, 'tag':'div', 'class' : 'cl-mtv-input-toggle-container', },
        {'step' : 1, 'tag':'div', 'class' : 'cl-mtv-input-toggle', },
            {'step' : 1, 'tag':'div', 'class' : 'cl-mtv-input-toggle-button', },
            
];


mtvInputToggleText.prototype._initEvents = function() {
    this.elsObject.elButton.addEventListener('click',this.onClickHandler.bind(this));
        
}


mtvInputToggleText.prototype._create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtvInputToggleText.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

}


mtvInputToggleText.prototype._prepare = function() {
        
}

mtvInputToggleText.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }
}

mtvInputToggleText.prototype._init = function() {
    this._prepare();
    this._create();
    this._matchElements();
    this._initEvents();
    this.elThis = this.elsObject.elThis;
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Handler /////////////////////////////////////
mtvInputToggleText.prototype.onClickHandler = function() {
    if(this.onActive)
    {
        this.onActive = false;
        this.elsObject.elButton.classList.remove('active');
    }
    else
    {
        this.onActive = true;
        this.elsObject.elButton.classList.add('active');
    }
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////// API /////////////////////////////////////
mtvInputToggleText.prototype.getValue = function() {
    return this.onActive;
}

mtvInputToggleText.prototype.setValue = function(value) {
    this.onActive = value;
    if(this.onActive)
        this.elsObject.elButton.classList.add('active');
    else
        this.elsObject.elButton.classList.remove('active');
}
