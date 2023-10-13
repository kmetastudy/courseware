// CodePen Home
// Rounded Bootstrap Buttons
// https://codepen.io/davidelvar/pen/dYMgrR

// Organic Button
// https://codepen.io/davidelvar/pen/pJPVgP

// CodePen Home
// How to create your custom Bootstrap buttons
// https://codepen.io/ondrejsvestka/pen/NjxgVR

// Bootstrap buttons: button groups and toolbars
// https://codepen.io/ondrejsvestka/pen/rPmXvp

// CodePen Home
// Bootstrap buttons: Radio button
// https://codepen.io/ondrejsvestka/pen/LqywyB

// Todo. 스타일 적용하는 기능 추가.
// Todo. 크기 적용 가능 추가.
import {mtvElementBuilder} from '../utils/mtv-element-builder.js';

export var mtvInputButton = function(options) {
    this.id = "id-mtv-input-button-" + mtvInputButton.id++;
    this.options = options;
    this.elThis = null;

    this.init();

}

mtvInputButton.id = 0;
mtvInputButton.staticBody = [

    // {'level' : 0, 'tag':'button', 'class' : 'ml-4 px-3 py-1 btn btn-sm btn-rounded btn-outline-primary', 'id':'question-create', 'attr' :{ 'type' : "button",
    //     'style':"font-size: 0.8em; font-weight: 700",}, },
    {'level' : 0, 'tag':'button', 'class' : 'px-2 py-1 btn btn-sm btn-rounded btn-outline-primary', 'id':'question-create', 'attr' :{ 'type' : "button",
        'style':"font-size: 0.8em; font-weight: 700",}, },
//             <i class="fas fa-magic"></i> 새로 만들기
        {'level' : 1, 'tag':'i', 'class' : 'fa fa-magic',},
        {'level' : 1, 'text' : ' 새로 만들기', },

    // <button class='btn btn-sm btn-primary btn-rounded px-4' id="get-score-md" style="position:fixed;bottom:10px;right:40px;display:none;"><i class="fas fa-check mr-2"></i>채점</button>
    // <button class='btn btn-sm btn-warning btn-rounded px-4' id="drop-test-md" style="position:fixed;bottom:10px;right:140px;display:none;"><i class="fas fa-external-link-alt mr-2"></i>나가기</button> 
         
];

mtvInputButton.prototype.prepare = function() {
    if(!this.options)
        return;
    var text = '저장하기';
    var iClass = 'fa fa-check';
    var id = this.id;

    if(this.options.text)
        text = this.options.text;

    if(this.options.iClass)
        iClass = this.options.iClass;

    mtvInputButton.staticBody[0]['id'] = id;    
    mtvInputButton.staticBody[1]['class'] = iClass;
    mtvInputButton.staticBody[2]['text'] = text;
}


/* <button type="button" class="btn btn-outline-primary">Primary</button>
<button type="button" class="btn btn-outline-secondary">Secondary</button>
<button type="button" class="btn btn-outline-success">Success</button>
<button type="button" class="btn btn-outline-danger">Danger</button>
<button type="button" class="btn btn-outline-warning">Warning</button>
<button type="button" class="btn btn-outline-info">Info</button>
<button type="button" class="btn btn-outline-light">Light</button>
<button type="button" class="btn btn-outline-dark">Dark</button> */

mtvInputButton.prototype.FillPrimary = function(className)
{
    $(this.elThis).removeClass('btn-outline-primary');
    $(this.elThis).addClass('btn-primary');
}

mtvInputButton.prototype.OutlinePrimary = function(className)
{
    $(this.elThis).removeClass('btn-primary');
    $(this.elThis).addClass('btn-outline-primary');
}

mtvInputButton.prototype.init = function() {
    this.prepare();

    // if(!this.options)
    //     this.options = mtvInputButton.staticBody;
    
    this.elThis = mtvElementBuilder.createComponent(mtvInputButton.staticBody);
    if(this.options.RemoveMarginLeft)
        this.elThis.classList.remove('ml-4');

    if(this.options && this.options.eventHandler)
    {
        this.elThis.addEventListener('click', this.options.eventHandler);
    }


}

/////////////////////////////// API ////////////////////////////////
mtvInputButton.prototype.setMarginLeft = function(bAdd,marginLeft) {
    if(bAdd)
        this.elThis.classList.add(marginLeft);
    else
        this.elThis.classList.remove(marginLeft);
}

mtvInputButton.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtvInputButton.prototype.enable = function(bEnable) {
    if(bEnable)
        this.elThis.disabled = false;
    else
        this.elThis.setAttribute('disabled',true);
}

mtvInputButton.prototype.removeClass = function(className)
{
    $(this.elThis).removeClass(className);
}

mtvInputButton.prototype.addClass = function(className)
{
    $(this.elThis).addClass(className);
}

mtvInputButton.prototype.setEnable = function(bEnable) {
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

mtvInputButton.prototype.setGrayDisable = function() {
    this.enable(false);
    this.removeClass('btn-primary');
    this.addClass('btn-outline-secondary');
}



