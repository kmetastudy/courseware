// Custom Styling Form Inputs With Modern CSS Features
// https://css-tricks.com/custom-styling-form-inputs-with-modern-css-features/

// Animated Toggle Button with JavaScript | ON-OFF Toggle Button Using HTML, CSS, and JS
// https://www.youtube.com/watch?v=R6ODcr-MwKE
import {mtvElementBuilder} from '../utils/mtv-element-builder.js';
require('../../../../css/mtv/core/input/mtv-input-toggle.css');

export var mtvInputToggle = function(options) {
    this.id = 'id-mtv-input-toggle-' + mtvInputToggle.id++;
    this.elThis = null;
    this.onActive =false;

    this.elCompList = null;
    this.elsArray = ['elThis','elToggle','elButton'];
    this.elsObject = {};
    this._init();
}

mtvInputToggle.id = 0;

mtvInputToggle.staticBody = [
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


mtvInputToggle.prototype._initEvents = function() {
    this.elsObject.elButton.addEventListener('click',this.onClickHandler.bind(this));
        
}


mtvInputToggle.prototype._create = function() {
    this.elCompList = mtvElementBuilder.buildComponent(mtvInputToggle.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];

}


mtvInputToggle.prototype._prepare = function() {
        
}

mtvInputToggle.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }
}

mtvInputToggle.prototype._init = function() {
    this._prepare();
    this._create();
    this._matchElements();
    this._initEvents();
    this.elThis = this.elsObject.elThis;
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Handler /////////////////////////////////////
mtvInputToggle.prototype.onClickHandler = function() {
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
mtvInputToggle.prototype.getValue = function() {
    return this.onActive;
}

mtvInputToggle.prototype.setValue = function(value) {
    this.onActive = value;
    if(this.onActive)
        this.elsObject.elButton.classList.add('active');
    else
        this.elsObject.elButton.classList.remove('active');
}
