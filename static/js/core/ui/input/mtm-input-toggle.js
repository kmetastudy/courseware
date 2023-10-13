// Toggle  Switch with Icon
// CodePen Home - Daily UI #015 | On/Off Switch
// https://codepen.io/juliepark/pen/ZRJqJL

// CSS – round toggle switch using checkbox and label
// https://infoheap.com/css-round-toggle-switch/

// Custom Styling Form Inputs With Modern CSS Features
// https://css-tricks.com/custom-styling-form-inputs-with-modern-css-features/

// Animated Toggle Button with JavaScript | ON-OFF Toggle Button Using HTML, CSS, and JS
// https://www.youtube.com/watch?v=R6ODcr-MwKE
require('./mtm-input-toggle.css');
import {mtoElementBuilder} from '../utils/mto-element-builder.js';

export var mtmInputToggle = function(options) {
    this.id = 'id-mtm-input-toggle-' + mtmInputToggle.id++;

    this.options = options;
    this.elThis = null;
    this.onActive =false;
    this.bEnable = true;
    this.elCompList = null;
    this.elsArray = ['elThis','elCheck','elSlider'];
    this.elsObject = {};
    this._init();
}

mtmInputToggle.id = 0;

mtmInputToggle.staticBody = [
    // <label> 
    //     First Name:
    //     <input type="text" name="firstname" />
    // </label>

    // <label for="explicit-label-name">Last Name: </label>
    // <input type="text" id="explicit-label-name" name="lastname" />
    {'step' : 0, 'tag':'label', 'class' : 'mtm-input-toggle my-auto', },
        {'step' : 1, 'tag':'input', 'attr':{'type':'checkbox',}, },
        // {'step' : 0, 'tag' : 'p',},
        // {'step' : 0, 'tag':'span', 'class' : 'mtm-input-toggle-pre',  },
        {'step' : 0, 'tag':'span', 'class' : 'mtm-input-toggle-slider', },
        // {'step' : 0, 'tag':'span', 'class' : 'mtm-input-toggle-post',},
        
];


mtmInputToggle.prototype._initEvents = function() {
    this.elsObject.elCheck.addEventListener('click',this.onClickHandler.bind(this));
}


mtmInputToggle.prototype._create = function() {
    this.elCompList = mtoElementBuilder.buildComponent(mtmInputToggle.staticBody,true);
    // Component List Matching
    this.elThis = this.elCompList[0];
}


mtmInputToggle.prototype._prepare = function() {
        
}

mtmInputToggle.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }
    // this.elThis = this.elsObject.elThis;
}

mtmInputToggle.prototype._init = function() {
    this._prepare();
    this._create();
    this._matchElements();
    this._initEvents();

    // console.log('mtmInputToggle > _init : ',this.options);
    if(this.options && this.options.size)
    {
        this.elsObject.elThis.classList.add(this.options.size);
        this.elsObject.elSlider.classList.add(this.options.size);
    }
    else
    {
        this.elsObject.elThis.classList.add('small');
        this.elsObject.elSlider.classList.add('small');
    }
    
    if(this.options && this.options.shape)
    {
        // this.elsObject.elThis.classList.add(this.options.size);
        this.elsObject.elSlider.classList.add(this.options.shape);
    }
    else
    {
        // this.elsObject.elThis.classList.add('small');
        this.elsObject.elSlider.classList.add('rect');
    }
    if(this.options && this.options.on)
        this.elsObject.elCheck.checked = true;
    else
        this.elsObject.elCheck.checked = false;

    // if(this.options && this.options.preText)
    //     this.elsObject.elSlider.innerHTML = this.options.preText;
    // if(this.options && this.options.postText)
    //     this.elsObject.elSlider.innerHTML = this.options.postText;
        
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Handler /////////////////////////////////////
mtmInputToggle.prototype.onClickHandler = function() {
    console.log('mtmInputToggle > onClickHandler :',this.elsObject.elCheck.checked);
    if(!this.bEnable)
        return;

    if(this.options && this.options.eventHandler)
        this.options.eventHandler(this.elsObject.elCheck.checked, this.options.eData);
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////// API /////////////////////////////////////////
mtmInputToggle.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtmInputToggle.prototype.getValue = function() {
    // return this.onActive;
    return this.elsObject.elCheck.checked;
}

mtmInputToggle.prototype.setValue = function(value) {
    this.onActive = value;
    this.elsObject.elCheck.checked = this.onActive
}

mtmInputToggle.prototype.setEnable = function(bEnable) {
    this.bEnable = bEnable;
    if(this.bEnable)
        this.elsObject.elCheck.disabled = false;
    else
        this.elsObject.elCheck.disabled = true;

}