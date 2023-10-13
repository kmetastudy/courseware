import {mtvComponentBuilder} from '../utils/mtv-component-builder.js';
import {mtvElementBuilder} from '../utils/mtv-element-builder.js';
import {mtvVideoTime} from '../input/mtv-input-video-time.js';

export var mtvElapseTimer = function(options)
{
    this.id = "mtv-elapse-timer-" + mtvElapseTimer.id++;
    this.options = options;
    if(!this.options)
        this.options = {};

    this.elThis = null;
    this.timeElapse = 0;
    this.init();
}

mtvElapseTimer.id = 0;
mtvElapseTimer.staticBody = [
    {'level' : 0, 'tag':'button', 'class' : 'ml-0 px-3 py-1 btn btn-sm btn-rounded btn-outline-primary', 'id':'question-create', 'attr' :{ 'type' : "button",
        'style':"font-size: 0.8em; font-weight: 700",}, },
        {'level' : 1, 'tag':'i', 'class' : 'fa fa-magic',},
        {'level' : 1, 'text' : ' 새로 만들기', },
         
];

// mtvElapseTimer.formatTime = function(sec) {
//     mtvVideoTime.formatTimeFromMinute(sec);
//     return 
// }

mtvElapseTimer.prototype.onIntervalHandler = function() {
    this.timeElapse += 1;
    // this.elThis.innerHTML = this.options.icon + ' ' + mtvVideoTime.formatTimeFromMinute(this.timeElapse);
    this.elThis.innerHTML = this.options.icon + ' ' + mtvVideoTime.formatTime(this.timeElapse);
}

mtvElapseTimer.prototype.prepare = function() {
    if(!this.options)
        return;
    var text = '저장하기';
    var iClass = 'fa fa-check';
    var id = this.id;

    if(this.options.text)
        text = this.options.text;

    if(this.options.iClass)
        iClass = this.options.iClass;
    this.options.icon = '<i class="' + iClass + '"></i>';

    mtvElapseTimer.staticBody[0]['id'] = id;    
    mtvElapseTimer.staticBody[1]['class'] = iClass;
    mtvElapseTimer.staticBody[2]['text'] = text;
}


/* <button type="button" class="btn btn-outline-primary">Primary</button>
<button type="button" class="btn btn-outline-secondary">Secondary</button>
<button type="button" class="btn btn-outline-success">Success</button>
<button type="button" class="btn btn-outline-danger">Danger</button>
<button type="button" class="btn btn-outline-warning">Warning</button>
<button type="button" class="btn btn-outline-info">Info</button>
<button type="button" class="btn btn-outline-light">Light</button>
<button type="button" class="btn btn-outline-dark">Dark</button> */

mtvElapseTimer.prototype.FillPrimary = function(className)
{
    $(this.elThis).removeClass('btn-outline-primary');
    $(this.elThis).addClass('btn-primary');
}

mtvElapseTimer.prototype.OutlinePrimary = function(className)
{
    $(this.elThis).removeClass('btn-primary');
    $(this.elThis).addClass('btn-outline-primary');
}

mtvElapseTimer.prototype.init = function() {
    this.prepare();

    // if(!this.options)
    //     this.options = mtvInputButton.staticBody;
    
    this.elThis = mtvElementBuilder.createComponent(mtvElapseTimer.staticBody);
    this.el
    if(this.options && this.options.eventHandler)
    {
        this.elThis.addEventListener('click', this.options.eventHandler);
    }
}

/////////////////////////////// API ////////////////////////////////
mtvElapseTimer.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtvElapseTimer.prototype.start = function() {
    this.stop();
    this.timerInterval = setInterval(this.onIntervalHandler.bind(this),1000);
}

mtvElapseTimer.prototype.stop = function() {
    if(this.timerInterval)
        clearInterval(this.timerInterval);
}

mtvElapseTimer.prototype.reset = function() {
    this.timeElapse = 0;
    this.elThis.innerHTML = this.options.icon + ' ' + mtvVideoTime.formatTime(this.timeElapse);
}


mtvElapseTimer.prototype.enable = function(bEnable) {
    if(bEnable)
        this.elThis.disabled = false;
    else
        this.elThis.setAttribute('disabled',true);
}

mtvElapseTimer.prototype.removeClass = function(className)
{
    $(this.elThis).removeClass(className);
}

mtvElapseTimer.prototype.addClass = function(className)
{
    $(this.elThis).addClass(className);
}

mtvElapseTimer.prototype.setEnable = function(bEnable) {
    if(bEnable)
    {
        this.enable(true);
        this.addClass('btn-outline-primary');
        this.removeClass('btn-primary');
    }
    else
    {
        this.enable(false);
        this.removeClass('btn-primary');
        this.addClass('btn-outline-primary');
    }
    
}

// mtv/core/utils/mtvComponentBuilder 에 등록
mtvComponentBuilder.register('mtv-elapse-timer',mtvElapseTimer);
