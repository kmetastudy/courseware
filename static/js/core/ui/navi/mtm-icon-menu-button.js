// How TO - Icon Bar
// https://www.w3schools.com/howto/howto_css_icon_bar.asp
require('../../../../css/mtv/core/navi/mtm-icon-menu-button.css');

export var mtmIconMenuButton = function(options) {
    this.id = 'mtm-icon-menu-button-' + mtmIconMenuButton.id++;
    this.options = options;

    this.elThis = null;

    this._init();
}

mtmIconMenuButton.id = 0;

mtmIconMenuButton.prototype._init = function() {

    this.elThis = document.createElement('div');
    this.elThis.classList.add('mtm-icon-menu-button');

    if(!this.options)
        return;
    if(!this.options.items)
        return;
    
    for(var i=0;i<this.options.items.length;i++)
    {
        var el = document.createElement('a');
        el.setAttribute('href','#none');
        el.innerHTML = this.options.items[i].icon;
        el.setAttribute('data-index',i);
        if(this.options.items[i].active)
            el.classList.add('active');
        el.addEventListener('click',this.onClickHandler.bind(this));
        this.elThis.appendChild(el);
    }


}

////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// Ajax ///////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Handler /////////////////////////////////////////
mtmIconMenuButton.prototype.onClickHandler = function(e) {
    // console.log('mtmIconMenuButton > onClickHandler : ', e.target.tagName);
    var el = e.target;
    if(e.target.tagName == "I")
        el = e.target.parentElement;
        // return;

    // console.log('mtmIconMenuButton > onClickHandler : ', e.target);
    for(var i =0 ;i<this.elThis.children.length;i++)
        this.elThis.children[i].classList.remove('active');
    var index = parseInt(el.getAttribute('data-index'));
    el.classList.add('active');
    if(this.options && this.options.eventHandler)
        this.options.eventHandler(index);
}
////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// API ///////////////////////////////////////////
