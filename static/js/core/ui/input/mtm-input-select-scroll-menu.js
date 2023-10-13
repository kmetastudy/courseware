// Select Scroll + Extension Menu

// jQuery contextMenu plugin & polyfill
// https://swisnl.github.io/jQuery-contextMenu/
// https://github.com/swisnl/jQuery-contextMenu

// vanilla javascript 
// How to make 3 vertical dots using CSS?
// https://stackoverflow.com/questions/30260195/how-to-make-3-vertical-dots-using-css

// 3 dots dropdown menu
// https://www.codeforui.com/3-dots-dropdown-menu/
// require('../../../../css/mtv/core/input/mtm-input-select-scroll-menu-v2.css');
require('./mtm-input-select-scroll-menu.css');

import {mtoElementBuilder} from '../utils/mto-element-builder.js';

import {mtmInputDropdownMenu} from './mtm-input-dropdown-menu.js';

// mtmInputSelect 에 대하여
// 보통의 InputSelect 는 크게 2가지로 나뉜다.
// 1) 고정된 Item 갯수를 가지고 있는것.
// 2) Dynamic 하게 Item 갯수가 늘어나고 줄어드는 것.

export var mtmInputSelectScrollMenu = function(options)
{
    this.id = 'id-mtm-input-select-scroll-menu-' + mtmInputSelectScrollMenu.id++;
    this.elThis = null;
    
    this.options = null;
    this._initOptions(options);

    this.elSelect = null;
    this.elList = null;
    // this.elSelected = null;
    
    this.elListLi = [];
    this.itemList = [];

    this.elCompList = null; 
    this.elsArray = ['elThis',
                    'elWrapper',
                    'elSelectThis', 'elBox','elSelect','elList','elButton'];
    // this.elsArray = ['elThis','elWrapper','elSelectThis', 'elBox','elSelect','elList','elButton'];
    this.elsObject = {};
    this.bInitEvent = false;
    this._init();    
    
}

mtmInputSelectScrollMenu.id = 0;

mtmInputSelectScrollMenu.staticBody = [
    // {'step' : 0 , 'tag' : 'div', 'class' : 'mtm-wrapper',},
    {'step':0, 'tag':'div', 'class': 'mtm-input-select-scroll-menu',
        },
        // {'step':1, 'tag':'div', 'class': 'mtm-input-select-scroll-menu justify-content-center',
        // },
        {'step':1 , 'tag': 'div', 'class':'wrapper d-flex justify-content-center',},
        
            {'step': 1,'tag':'div', 'class':'mtm-input-select-scroll-menu-select',
                },
                {'step':1,'tag':'div','class':'box',},
                    {'step':1,'tag':'div','class':'select','text':'선택'},
                    {'step':0,'tag':'ul','class':'list',},
            {'step':-2, 'tag':'button', 'class': 'mtm-input-select-scroll-menu-button', 
                    'text' : '',
                },
                            
];

mtmInputSelectScrollMenu.testListItem = [
    {'step':0,'tag':'li','class':'selected','text':'선택'},
    {'step':0,'tag':'li','text':'항목1'},
    {'step':0,'tag':'li','text':'항목2'},
    {'step':0,'tag':'li','text':'항목3'},
    {'step':0,'tag':'li','text':'항목4'},
    {'step':0,'tag':'li','text':'항목5'},   
    {'step':0,'tag':'li','text':'항목6'},
    {'step':0,'tag':'li','text':'항목7'},
    {'step':0,'tag':'li','text':'항목8'},
    {'step':0,'tag':'li','text':'항목9'},
    {'step':0,'tag':'li','text':'항목10'},                
];


mtmInputSelectScrollMenu.prototype._makeItemList = function(itemList,bSelectLast) {
    this.itemList = [];
    var text = '';
    var value = 0;
    if(itemList.length > 0)
    {
        if(!!itemList[0].code)
            value = itemList[0].code;
        else
            value = 1;

        if(!!itemList[0].name)
            text = itemList[0].name;
        else
            text = itemList[0];

        // if(!!itemList[0].code)
        //     code = itemList[0].code;
        // else
        //     text = itemList[0];
        
        if(!bSelectLast || (itemList.length == 1))
        {
            // this.itemList.push({'step':0,'tag':'li','class':'selected','text':text,'attr':{'data-index':0,'value':value}});
            this.itemList.push({'step':0,'tag':'li', // 'class':'selected',
                                    'text':text,'attr':{'data-index':0,'value':value}});
        }
        else
        {
            this.itemList.push({'step':0,'tag':'li','text':text,'attr':{'data-index':0,'value':value}});
        }

        for(var i=1;i<itemList.length;i++)
        {
            if(!!itemList[i].code)
                value = itemList[i].code;
            else
                value = i+1;

            if(!!itemList[i].name)
                text = itemList[i].name;
            else
                text = itemList[i];
                
            if(bSelectLast && (i==itemList.length-1))
                this.itemList.push({'step':0,'tag':'li','class':'selected','text':text,'attr':{'data-index':i,'value':value}});
            else
                this.itemList.push({'step':0,'tag':'li','text':text,'attr':{'data-index':i,'value':value}});
            
        }
        this.elThis.classList.remove('disabled');
        this.elsObject.elButton.disabled = false;
    }
    else
    {
        this.elThis.classList.add('disabled');
        this.elsObject.elButton.disabled = true;
    }
}

mtmInputSelectScrollMenu.prototype._initOptions = function(options){
    this.options = options;
    if(!this.options)
        this.options = {};
    
    if(!this.options.color)
        this.options.color = 'mtm-select-scroll-color-0';
    
    if(!this.options.items)
        this.options.items = [];
    
}

mtmInputSelectScrollMenu.prototype._initEvents = function() {
    // console.log('mtmInputSelectScrollMenu > _initEvents :');
    if(!this.bInitEvent)
        this.elsObject.elSelect.addEventListener('click',this.onListOnHandler.bind(this));
    
    if(!this.bInitEvent)
        document.addEventListener('click',this.onListOffHandler.bind(this));
    
    if(!this.bInitEvent)
        this.elsObject.elButton.addEventListener('click',this.onListClickHandler.bind(this));
    
    for(var i=0;i<this.elListLi.length;i++)
        this.elListLi[i].addEventListener('click',this.onListSelectHandler.bind(this));
    this.bInitEvent = true;
}

mtmInputSelectScrollMenu.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }
}

mtmInputSelectScrollMenu.prototype._create = function(){    
    
    // Create Select List Component
    this.elCompList = mtoElementBuilder.buildComponent(mtmInputSelectScrollMenu.staticBody,true);

    // Component List Matching
    this.elThis = this.elCompList[0];
    
    if(this.options && this.options.classList)
    {
        for(var i=0;i<this.options.classList.length;i++)
            this.elThis.classList.add(this.options.classList[i]);
    }
    
    this.elThis.setAttribute('id',this.id);
    // this.elThis.style.transition = 'height 0.3';
    // this.elThis.style.overflowY = 'hidden';

    if(this.options && this.options.width)
        this.elThis.style.width = this.options.width;
    // if(this.options && this.options.classList)
    //     for(var i=0;i<this.options.classList.length;i++)
    //         this.elThis.classList.add(this.options.classList[i]);
    this._matchElements();
    
    // Add Select List Items
    // if(this.options.items.length == 0)
    //     for(var i=0;i<mtmInputSelectScrollMenu.testListItem.length;i++)
    //     {
    //         var el = mtoElementBuilder.createElement(mtmInputSelectScrollMenu.testListItem[i]);
    //         this.elListLi.push(el);
    //         this.elsObject.elList.appendChild(el);
    //     }
    
    
    this.setList(this.options.items);
    if(this.options && this.options.buttonIcon)
        for(var i=0;i<this.options.buttonIcon.length;i++)
            this.elsObject.elButton.classList.add(this.options.buttonIcon[i]);
    // this.elsObject.elButton.innerHTML = this.options.buttonTitle; 
    // this.elsObject.elButton.disabled = true;

}

mtmInputSelectScrollMenu.prototype._prepare = function() {
    // if(this.options.items.length == 0)
    //     this.options.items.push('선택');

    if(this.options && this.options.title)
        mtmInputSelectScrollMenu.staticBody[4]['text'] = this.options.title;
    else
        mtmInputSelectScrollMenu.staticBody[4]['text'] = this.options.items[0];
    
}

mtmInputSelectScrollMenu.prototype._init = function() {
    this._prepare();
    this._create();

    // console.log('mtmInputSelectScrollMenu > _init :',this.elsObject.elButton);
    // var options = {};
    // options.items = [];
    // options.items.push({title:' 새로 만들기',icon:['fa','fa-plus'],enable:true});
    // options.items.push({title:' 가져오기',icon:['fa-solid','fa-file-import'],enable:true});
     
    // options.items.push({title:' 복사',icon:['fa-solid','fa-copy'],enable:false});
    // options.items.push({title:' 내보내기',icon:['fa-solid','fa-file-export'],enable:false});
    // options.items.push({title:' 삭제',icon:['fa','fa-trash'],enable:false});
     
    var options = {};
    if(this.options && this.options.menu)
        options.menu = this.options.menu;
    this.clDropdownMenu =  new mtmInputDropdownMenu(options);
    this.clDropdownMenu.elThis.style.right = '0px';
    this.clDropdownMenu.show(false);
    this.elsObject.elButton.appendChild(this.clDropdownMenu.elThis);

    // $.contextMenu({
    //     // selector: '.mtm-input-select-scroll-menu-button', 
    //     selector: '#'+this.id, 
    //     // selector: this.elsObject.elButton, 
    //     trigger: 'hover',
    //     delay: 500,
    //     autoHide: true,
    //     callback: function(key, options) {
    //         var m = "clicked: " + key;
    //         // window.console && console.log(m) || alert(m); 
    //     },
    //     items: {
    //         "edit": {name: "Edit", icon: "edit"},
    //         "cut": {name: "Cut", icon: "cut"},
    //         "copy": {name: "Copy", icon: "copy"},
    //         "paste": {name: "Paste", icon: "paste"},
    //         "delete": {name: "Delete", icon: "delete"},
    //         "sep1": "---------",
    //         "quit": {name: "Quit", icon: function($element, key, item){ return 'context-menu-icon context-menu-icon-quit'; }}
    //     }
    // });
}

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Handler /////////////////////////////////////
mtmInputSelectScrollMenu.prototype.onListOnHandler = function(){
    if(this.elThis.classList.contains('disabled'))
        return;

    this.elsObject.elThis.classList.toggle('on');
    // this.elsObject.elWrapper.classList.toggle('on');

    if(this.elsObject.elThis.classList.contains('on'))
        this.elsObject.elList.style.display = 'block';
    else
        this.elsObject.elList.style.display = 'none';

    // if(this.elsObject.elWrapper.classList.contains('on'))
    //     this.elsObject.elWrapper.style.display = 'block';
    // else
    //     this.elsObject.elList.style.display = 'none';
}

mtmInputSelectScrollMenu.prototype.onListSelectHandler = function(e){
    // console.log('mtmInputSelectScrollMenu > onListSelectHandler : ', )

    for(var i=0 ; i< this.elListLi.length;i++)
    {
        if(this.elListLi[i].classList.contains('selected'))
            this.elListLi[i].classList.remove('selected');
    }
    e.target.classList.add('selected');

    this.elsObject.elThis.classList.remove('on');
    // this.elsObject.elWrapper.classList.remove('on');
    
    var text = e.target.innerHTML;
    this.elsObject.elSelect.innerHTML = text;

    this.elsObject.elList.style.display = 'none';

    var index = e.target.getAttribute('data-index');
    var code = e.target.getAttribute('value');
    if(this.options && this.options.eventChangeHandler)
        this.options.eventChangeHandler(text,index);
    else if(this.options && this.options.eventHandler)
    {
        this.options.eventHandler({id:this.id,text:text,index:index,code:code});
    }
}

mtmInputSelectScrollMenu.prototype.onListOffHandler = function(e){
    
    if( !(e.target == this.elsObject.elSelect) && this.elThis.classList.contains('on'))
    {
        this.elThis.classList.remove('on');
        this.elsObject.elList.style.display = 'none';
    }
}

mtmInputSelectScrollMenu.prototype.onListClickHandler = function(e){
    // console.log('mtmInputSelectScrollMenu > onListClickHandler');
    this.clDropdownMenu.show(true);
    if(this.options && this.options.eventClickHandler)
        this.options.eventClickHandler();
}
//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// API //////////////////////////////////////////
mtmInputSelectScrollMenu.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = 'flex';
    else
        this.elThis.style.display = 'none';
}

mtmInputSelectScrollMenu.prototype.collapse = function(bCollapse) {
    
    if(bCollapse)
    {
        this.elThis.style.height = '0px';
    }
    else
    {
        this.elThis.style.height = parseInt(this.elsObject.elWrapper.offsetHeight) + 'px';
    }

}

mtmInputSelectScrollMenu.prototype.getValue = function() {
    return this.elsObject.elSelect.innerHTML;
}

mtmInputSelectScrollMenu.prototype.setOptionList = function(listItem,bSelectLast) {
    this.setList(listItem,bSelectLast);
}


mtmInputSelectScrollMenu.prototype.setListIndex = function(listItem,iIndex) {
    this._makeItemList(listItem,false,false);
    this.elListLi = [];

    while (this.elsObject.elList.firstChild) {
        this.elsObject.elList.removeChild(this.elsObject.elList.lastChild);
    }

    for(var i=0;i<this.itemList.length;i++)
    {
        var el = mtoElementBuilder.createElement(this.itemList[i]);


        this.elListLi.push(el);
        this.elsObject.elList.appendChild(el);
        // if((bSelectLast && (i==this.itemList.length-1)) || (bSelectFirst && (i==0)))
        if( (iIndex >= 0) && (iIndex == i))
        {
            el.classList.add('selected');
            var text = listItem[i];
            // console.log('mtmInputSelectScrollButton > setList : ',listItem[i]);
            
            // $(this.elsObject.elSelect).text(listItem[i]);
            this.elsObject.elSelect.innerHTML = listItem[i];
            if(this.options && this.options.eventChangeHandler)
                this.options.eventChangeHandler(text,i);
        }
    }
    
    // console.log('this.itemList : ',this.itemList);
    this._initEvents();
}

mtmInputSelectScrollMenu.prototype.setList = function(listItem,bSelectLast) {

    this._makeItemList(listItem,bSelectLast);

    this.elListLi = [];

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Remove all child elements of a DOM node in JavaScript
    // https://stackoverflow.com/questions/3955229/remove-all-child-elements-of-a-dom-node-in-javascript
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // Remove All Child Nodes
    // https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
    // Caution: innerHTML
    // The following code also removes all child nodes of a node:
    // 
    // parent.innerHTML = '';
    // 
    // However, it is not recommended because it doesn’t remove the event handlers of the child nodes, 
    // which might cause a memory leak.
    
    while (this.elsObject.elList.firstChild) {
        this.elsObject.elList.removeChild(this.elsObject.elList.lastChild);
    }

    // set New List Item
    // console.log('mtmInputSelectScrollMenu > setList : ', bSelectLast, this.itemList);
        
    for(var i=0;i<this.itemList.length;i++)
    {
        var el = mtoElementBuilder.createElement(this.itemList[i]);
        this.elListLi.push(el);
        this.elsObject.elList.appendChild(el);
        if(bSelectLast && (i==this.itemList.length-1))
        {
            var text = listItem[i];
            // console.log('mtmInputSelectScrollMenu > setList : ',listItem[i]);
            
            $(this.elsObject.elSelect).text(listItem[i]);
            if(this.options && this.options.eventChangeHandler)
                this.options.eventChangeHandler(text,i);
        }
    }
    
    // console.log('this.itemList : ',this.itemList);
    this._initEvents();
}

mtmInputSelectScrollMenu.prototype.setTitle = function(title) {
    this.elsObject.elSelect.innerHTML = title;
}

mtmInputSelectScrollMenu.prototype.setSelectedTitle = function(title,index) {
    
    this.elsObject.elSelect.innerHTML = title;
    this.itemList[index] = title;
    this.elListLi[index].innerHTML = title;
}

mtmInputSelectScrollMenu.prototype.setButtonEnable = function(bEnable) {
    this.elsObject.elButton.disabled = !bEnable;
}

mtmInputSelectScrollMenu.prototype.setButtonTitle = function(title) {
    this.elsObject.elButton.innerHTML = title;
}

mtmInputSelectScrollMenu.prototype.setEnableMenu = function(bEnable) {
    this.clDropdownMenu.setEnable(bEnable);
}


mtmInputSelectScrollMenu.prototype.addItem = function(item,bSelect) {
    // this.clDropdownMenu.setEnable(bEnable);
}