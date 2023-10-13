import {mtvElementBuilder} from '../utils/mtv-element-builder.js';
require('../../../../css/mtv/core/input/mtv-input-toggle-switch.css');

export var mtvInputToggleSwitch = function(options) {
    this.id = "id-mtv-input-toggle-switch-" + mtvInputToggleSwitch.id++;
    this.options = options;
    this.elThis = null;

    this.init();

}

mtvInputToggleSwitch.id = 0;
mtvInputToggleSwitch.staticBody = [
    // <div class="el-checkbox">
    //     <span class="margin-r">Unchecked</span>
    //     <input type="checkbox" name="check" id="1_1">
    //     <label class="el-checkbox-style" for="1_1"></label>
    // </div>     
    {'level' : 0, 'tag':'div', 'class' : 'cl-mtv-toggle-switch-checkbox', },
        {'level' : 1, 'tag':'span', 'class' : 'margin-r','text':''},
        {'level' : 1, 'tag':'input', 'attr':{'type':'checkbox','name':'check','id':''}},
        {'level' : 1, 'tag':'label', 'class' : 'cl-mtv-toggle-checkbox-style','attr':{'for':'',}},
        
];

mtvInputToggleSwitch.prototype.prepare = function() {
    if(!this.options)
        return;
    // var text = '저장하기';
    // var iClass = 'fa fa-check';
    // var id = this.id;

    // if(this.options.text)
    //     text = this.options.text;

    // if(this.options.iClass)
    //     iClass = this.options.iClass;

    // mtvInputToggleSwitch.staticBody[0]['id'] = id;    
    // mtvInputToggleSwitch.staticBody[1]['class'] = iClass;
    // mtvInputToggleSwitch.staticBody[2]['text'] = text;
}


/* <button type="button" class="btn btn-outline-primary">Primary</button>
<button type="button" class="btn btn-outline-secondary">Secondary</button>
<button type="button" class="btn btn-outline-success">Success</button>
<button type="button" class="btn btn-outline-danger">Danger</button>
<button type="button" class="btn btn-outline-warning">Warning</button>
<button type="button" class="btn btn-outline-info">Info</button>
<button type="button" class="btn btn-outline-light">Light</button>
<button type="button" class="btn btn-outline-dark">Dark</button> */

mtvInputToggleSwitch.prototype.FillPrimary = function(className)
{
    $(this.elThis).removeClass('btn-outline-primary');
    $(this.elThis).addClass('btn-primary');
}

mtvInputToggleSwitch.prototype.OutlinePrimary = function(className)
{
    $(this.elThis).removeClass('btn-primary');
    $(this.elThis).addClass('btn-outline-primary');
}

mtvInputToggleSwitch.prototype.init = function() {
    this.prepare();

    // if(!this.options)
    //     this.options = mtvInputToggleSwitch.staticBody;
    
    this.elThis = mtvElementBuilder.createComponent(mtvInputToggleSwitch.staticBody);
    if(this.options.RemoveMarginLeft)
        this.elThis.classList.remove('ml-4');

    if(this.options && this.options.eventHandler)
    {
        this.elThis.addEventListener('click', this.options.eventHandler);
    }


}

/////////////////////////////// API ////////////////////////////////
mtvInputToggleSwitch.prototype.setMarginLeft = function(bAdd,marginLeft) {
    if(bAdd)
        this.elThis.classList.add(marginLeft);
    else
        this.elThis.classList.remove(marginLeft);
}

mtvInputToggleSwitch.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtvInputToggleSwitch.prototype.enable = function(bEnable) {
    if(bEnable)
        this.elThis.disabled = false;
    else
        this.elThis.setAttribute('disabled',true);
}

mtvInputToggleSwitch.prototype.removeClass = function(className)
{
    $(this.elThis).removeClass(className);
}

mtvInputToggleSwitch.prototype.addClass = function(className)
{
    $(this.elThis).addClass(className);
}

mtvInputToggleSwitch.prototype.setEnable = function(bEnable) {
    if(bEnable)
    {
        this.enable(true);
        this.addClass('btn-outline-primary');
        this.removeClass('btn-primary');
        this.removeClass('btn-outline-secondary');
    }
    else
    {
        this.enable(false);
        this.removeClass('btn-primary');
        this.addClass('btn-outline-primary');
    }
}

mtvInputToggleSwitch.prototype.setGrayDisable = function() {
    this.enable(false);
    this.removeClass('btn-primary');
    this.addClass('btn-outline-secondary');
}

