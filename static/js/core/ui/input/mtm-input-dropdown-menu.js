// vanilla javascript 
// How to make 3 vertical dots using CSS?
// https://stackoverflow.com/questions/30260195/how-to-make-3-vertical-dots-using-css

// 3 dots dropdown menu
// https://www.codeforui.com/3-dots-dropdown-menu/
require('./mtm-input-dropdown-menu.css');

/**
 * @param {{items : [{ title : string , icon : string, enable: boolean}] } } options 
 */
export var mtmInputDropdownMenu = function(options)
{
    this.id = 'id-mtm-input-dropdown-menu-' + mtmInputDropdownMenu.id++;
    this.elThis = null;
    
    this.options = options;

    this._init();
}

mtmInputDropdownMenu.id = 0;

mtmInputDropdownMenu.prototype._init = function() {
    this.elThis = document.createElement('div');
    this.elThis.classList.add('mtm-input-dropdown-menu-content')
    if(this.options && this.options.menu)
    {
        for(var i=0;i<this.options.menu.length;i++)
        {
            var item = document.createElement('a');
            var icon = document.createElement('i')
            for(var j=0;j<this.options.menu[i].icon.length;j++)
            {
                item.classList.add(this.options.menu[i].icon[j]);
            }
            
            // BugFix. Jstar : Scroll to Top 
            // item.setAttribute('href','#');
            item.setAttribute('data-index',i);
            item.innerHTML=this.options.menu[i].title;
            
            item.addEventListener('click',this.onClickHandler.bind(this));
            item.addEventListener('focus',this.onFocusHandler.bind(this));
            item.addEventListener('mousedown',this.onMouseDownHandler.bind(this));
            item.addEventListener('mouseup',this.onMouseUpHandler.bind(this));
            item.addEventListener('mouseenter',this.onMouseEnterHandler.bind(this));
            item.addEventListener('mousemove',this.onMouseMoveHandler.bind(this));
            item.addEventListener('mouseleave',this.onMouseLeaveHandler.bind(this));
            
            if(!this.options.menu[i].enable)
                item.classList.add('disabled');
            
            this.elThis.appendChild(item);
        }
    }

    window.addEventListener('click',this.onCheckClickHandler.bind(this));
}

/////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////// Handler ///////////////////////////////////////
mtmInputDropdownMenu.prototype.onCheckClickHandler = function(e) {
    if((e.target != this.elThis) && (e.target != this.elThis.parentElement))
        this.show(false);
}


mtmInputDropdownMenu.prototype.onFocusHandler = function(e) {
    // e.preventDefault();
    e.stopPropagation();
    return false;
}

mtmInputDropdownMenu.prototype.onMouseEnterHandler = function(e) {
    // e.preventDefault();
    e.stopPropagation();
    return false;
}

mtmInputDropdownMenu.prototype.onMouseMoveHandler = function(e) {
    // e.preventDefault();
    e.stopPropagation();
    return false;
}

mtmInputDropdownMenu.prototype.onMouseLeaveHandler = function(e) {
    // e.preventDefault();
    e.stopPropagation();
    return false;
}


mtmInputDropdownMenu.prototype.onMouseDownHandler = function(e) {
    // e.preventDefault();
    e.stopPropagation();
    return false;
}

mtmInputDropdownMenu.prototype.onMouseUpHandler = function(e) {
    // e.preventDefault();
    e.stopPropagation();
    return false;
}

mtmInputDropdownMenu.prototype.onClickHandler = function(e) {
    console.log('mtmInputDropdownMenu > onClickHandler');
    // e.preventDefault();
    e.stopPropagation();
    
    var disabled = e.target.classList.contains('disabled');
    if(disabled)
        return;

    var index = e.target.getAttribute('data-index');
    if(index != undefined)
        index = parseInt(index);

    if(this.options && this.options.menu)
    {
        if(this.options.menu[index].eventClick)
        {
            this.show(false);
            this.options.menu[index].eventClick();
        }
    }    
    return false;
}

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// API /////////////////////////////////////////
mtmInputDropdownMenu.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = 'block';
    else
        this.elThis.style.display = 'none';
}

mtmInputDropdownMenu.prototype.setEnable = function(bEnable) {
    if(typeof bEnable == "boolean")
    {
        if(bEnable)
        {
            for(var i=0;i<this.elThis.children.length;i++)
            {
                this.elThis.children[i].classList.remove('disabled');
            }
            this.elThis.disabled = false;
        }
        else
        {
            for(var i=0;i<this.elThis.children.length;i++)
            {
                this.elThis.children[i].classList.add('disabled');
            }
            this.elThis.disabled = true;
        }
    }
    else
    // else if(typeof bEnable == 'array')
    {
        for(var i=0;(i<bEnable.length) && (i<this.elThis.children.length);i++)
        {
            if(bEnable[i])
                this.elThis.children[i].classList.remove('disabled');
            else
                this.elThis.children[i].classList.add('disabled');
        }
                    
    }
}

mtmInputDropdownMenu.prototype.setMenuEnable = function(index,bEnable) {
    if(typeof bEnable == "boolean")
    {
        if(bEnable)
        {
            // for(var i=0;i<this.elThis.children.length;i++)
            if(index < this.elThis.children.length)
            {
                this.elThis.children[index].classList.remove('disabled');
            }
        }
        else
        {
            // for(var i=0;i<this.elThis.children.length;i++)
            if(index < this.elThis.children.length)
            {
                this.elThis.children[index].classList.add('disabled');
            }
        }
    }
}