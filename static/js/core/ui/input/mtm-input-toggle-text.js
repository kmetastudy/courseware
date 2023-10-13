import {mtmInputToggle} from './mtm-input-toggle.js';

export var mtmInputToggleText = function(options) {
    this.id = 'id-mtm-input-toggle-text-' + mtmInputToggleText.id++;

    this.options = options;
    this.elThis = null;
    // this.onActive =false;

    // this.elCompList = null;
    // this.elsArray = ['elThis','elCheck','elSlider'];
    // this.elsObject = {};
    this._init();
}

mtmInputToggleText.id = 0;

mtmInputToggleText.prototype._init = function() {
    this.elThis = document.createElement('div');
    this.elThis.setAttribute('id',this.id);
    
    if(this.options && this.options.classList)
        for(var i=0;i<this.options.classList.length;i++)
            this.elThis.classList.add(this.options.classList[i]);
    else
        this.elThis.classList.add('px-2');

    this.elThis.style.position = 'relative';

    
    // this.preText = document.createElement('span');
    // this.preText.style.display = 'inline-block';

    var options = {};
    
    if(this.options && this.options.size)
        options.size = this.options.size;
    if(this.options && this.options.shape)
        options.shape = this.options.shape;
    if(this.options && this.options.on)
        options.on = this.options.on;
    
    this.clInputToggle = new mtmInputToggle(options);
    this.clInputToggle.elThis.style.top = '50%';
    this.clInputToggle.elThis.style.position = 'absolute';
    this.clInputToggle.elThis.style.transform = 'translateY(-50%)';
    
    // this.preIcon = document.createElement('span');
    // this.preIcon.style.display = document.createElement('span');
    
    
    this.preText = document.createElement('span');
    this.preText.style.display = 'inline-block';
    if(this.options && this.options.preText)
    {
        if(this.options && this.options.preIcon)
            this.preText.innerHTML = this.options.preIcon + this.options.preText;
        else
            this.preText.innerHTML = this.options.preText;
        this.preText.classList.add('px-2');
    }
    
    this.postText = document.createElement('span');
    this.postText.style.display = 'inline-block';
    if(this.options && this.options.postText)
    {   
        if(this.options && this.options.postIcon)
            this.postText.innerHTML = this.options.postIcon + this.options.preText;
        else
            this.postText.innerHTML = this.options.postText;

        this.postText.style.paddingLeft = '40px';
    }    

    this.elThis.append(this.preText);
    this.elThis.append(this.clInputToggle.elThis);
    this.elThis.append(this.postText);
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////// API /////////////////////////////////////////
mtmInputToggleText.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtmInputToggleText.prototype.getValue = function() {
    // return this.onActive;
    return this.clInputToggle.getValue();
}

mtmInputToggleText.prototype.setValue = function(value) {
    // this.onActive = value;
    this.clInputToggle.setValue(value);
}
