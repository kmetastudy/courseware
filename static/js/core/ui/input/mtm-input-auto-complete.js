import {mtoElementBuilder} from '../utils/mto-element-builder.js';
require('./mtm-input-auto-complete.css');

// var elLoginAcademyInput = this._createElementWithAttributes('input','input',null,
// {'type':'text','id':'academy_login','autocomplete':'off', 'placeholder':'학교/학원 코드','spellcheck':false});

// 한글 인코딩의 이해(유니코드) 완전 기초!
// https://jinios.github.io/study/2018/06/23/unicode_background_korean/

// Todo. Jstar : 현재 선택된 항목을 Box List 에서 다른 색으로 표현하는 기능 추가.
export var mtmInputAutoComplete = function(options)
{
    this.id = 'id-mtm-input-auto-complete-' + mtmInputAutoComplete.id++;
    this.elThis = null;
    
    this.options = null;
    this._initOptions(options);

    // this.elSelect = null;
    // this.elList = null;
    // this.elSelected = null;
    
    this.elListLi = [];
    this.itemList = [];

    this.elCompList = null; 
    this.elsArray = ['elThis','elBox','elInput','elList','elSubTitle'];
    this.elsObject = {};
    this.bInitEvent = false;
    this.data_id = '';
    this.itemSize = 0;
    this.iSelectIndex == -1;
    this._init();    
    
}

mtmInputAutoComplete.id = 0;

mtmInputAutoComplete.staticBody = [
    {'step':0,'tag':'div', 'class':'mtm-input-auto-complete',},
        {'step':1,'tag':'div','class':'box',},
            // {'step':1,'tag':'div','class':'select','text':'선택'},
            {'step':1, 'tag':'input', 'class':'main-title input', 'attr':{'type':'text','placeholder':'학교/학원 이름',}, },
            {'step':0,'tag':'ul','class':'list',},
            {'step':0,'tag':'div', 'class':'sub-title'}
                // {'step':1,'tag':'li','class':'selected','text':'선택'},
                // {'step':0,'tag':'li','text':'항목1'},
                // {'step':0,'tag':'li','text':'항목2'},
                // {'step':0,'tag':'li','text':'항목3'},
                // {'step':0,'tag':'li','text':'항목4'},
                // {'step':0,'tag':'li','text':'항목5'},                
];

mtmInputAutoComplete.staticItem = [
    {'step':0,'tag':'li', 'class':'mtm-auto-complete-item',},
        {'step':1,'tag':'ul','class':'sub-title-list',},
        {'step':0,'tag':'ul','class':'main-title-list',},
        
];

mtmInputAutoComplete.testListItem = [
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

mtmInputAutoComplete.prototype._createItemElement = function(index) {
    // this.itemData[index];
    var elCompList = mtoElementBuilder.buildComponent(mtmInputAutoComplete.staticItem,true);
    var subTitle = '';
    if(this.itemData[index].city)
        subTitle += this.itemData[index].city;
    if(this.itemData[index].region)
        subTitle += (' ' + this.itemData[index].region);

    elCompList[0].setAttribute('data-index',index);
    elCompList[1].innerHTML = subTitle;
    elCompList[2].innerHTML = this.itemData[index].name;

    return elCompList[0];
}

mtmInputAutoComplete.prototype._makeItemList = function(itemList,bSelectLast,bSelectFirst) {
    this.itemList = [];
    this.itemData = itemList;
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

        if(bSelectLast && (itemList.length == 1))
            this.itemList.push({'step':0,'tag':'li','class':'selected','text':text,'attr':{'data-index':0,'value':value}});
        else 
            this.itemList.push({'step':0,'tag':'li','text':text,'attr':{'data-index':0,'value':value}});
        
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
            else if(bSelectFirst && (i==0))
                this.itemList.push({'step':0,'tag':'li','class':'selected','text':text,'attr':{'data-index':i,'value':value}});
            else
                this.itemList.push({'step':0,'tag':'li','text':text,'attr':{'data-index':i,'value':value}});
            
        }
    }
}

mtmInputAutoComplete.prototype._postSelectProcess = function(index){
    var eData = {};
    this.data_id = this.itemData[index].id;
    eData.id = this.itemData[index].id;
    eData.name = this.itemData[index].name;
    eData.city = this.itemData[index].city;
    eData.region = this.itemData[index].region;
    
    // var text = e.target.innerHTML;
    var subTitle = '';

    if(eData.city)
        subTitle += eData.city;
    if(eData.region)
        subTitle += ( ' ' + eData.region);
    
    if(subTitle)
    {
        this.elsObject.elSubTitle.innerHTML = subTitle;
        this.elsObject.elSubTitle.classList.remove('mtm-login-error');
        this.elsObject.elSubTitle.style.visibility = 'visible';
    }

    this.elsObject.elInput.value = eData.name;

    this.elsObject.elList.style.display = 'none';

    
    if(this.options && this.options.eventChangeHandler)
        this.options.eventChangeHandler(eData);
    else if(this.options && this.options.eventHandler)
        this.options.eventHandler(eData);
}

mtmInputAutoComplete.prototype._initOptions = function(options){
    this.options = options;
    if(!this.options)
        this.options = {};
    
    if(!this.options.color)
        this.options.color = 'mtm-select-scroll-color-0';
    
    if(!this.options.items)
        this.options.items = [];
    
}

mtmInputAutoComplete.prototype._initEvents = function() {
    
    if(!this.bInitEvent)
    {
        this.elsObject.elInput.addEventListener('click',this.onListOnHandler.bind(this));
        this.elsObject.elInput.addEventListener('keyup',this.onKeyUpHandler.bind(this));
        // this.elsObject.elInput.addEventListener('keypress',this.onKeyPressHandler.bind(this));
    }
        
    for(var i=0;i<this.elListLi.length;i++)
        this.elListLi[i].addEventListener('click',this.onListSelectHandler.bind(this));
    
    if(!this.bInitEvent)
        document.addEventListener('click',this.onListOffHandler.bind(this));
    
    this.bInitEvent = true;
}

mtmInputAutoComplete.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }
}

mtmInputAutoComplete.prototype._create = function(){    
    
    // Create Select List Component
    this.elCompList = mtoElementBuilder.buildComponent(mtmInputAutoComplete.staticBody,true);

    // Component List Matching
    this.elThis = this.elCompList[0];

    if(this.options && this.options.width)
        this.elThis.style.width = this.options.width;
    if(this.options && this.options.classList)
        for(var i=0;i<this.options.classList.length;i++)
            this.elThis.classList.add(this.options.classList[i]);
    
    this._matchElements();
    
    this.elsObject['elSubTitle'].innerHTML = '선택 없음';
    this.elsObject['elSubTitle'].style.visibility = 'hidden';

    // Add Select List Items
    // if(this.options.items.length == 0)
    //     for(var i=0;i<mtmInputAutoComplete.testListItem.length;i++)
    //     {
    //         var el = mtoElementBuilder.createElement(mtmInputAutoComplete.testListItem[i]);
    //         this.elListLi.push(el);
    //         this.elsObject.elList.appendChild(el);
    //     }
    
    this.clearSuggestion();
    // this.setList(this.options.items);
}

mtmInputAutoComplete.prototype._prepare = function() {
    if(this.options.items.length == 0)
        this.options.items.push('선택');

    mtmInputAutoComplete.staticBody[2]['text'] = this.options.items[0];
    
}

mtmInputAutoComplete.prototype._init = function() {
    this._prepare();
    this._create();

}

mtmInputAutoComplete.prototype._keyUpHandler = function(e){
    
    var ret = false;

    if(this.itemSize <= 0)
        return ret;
    // up/left
    if( ( e.keyCode == 38 || e.which == 38 ) || ( e.keyCode == 37 || e.which == 37 ) ){
        if(this.itemSize > 0)
        {
            if(this.iSelectIndex == -1)
                this.iSelectIndex = 0;
            else if(this.iSelectIndex > 0)
                this.iSelectIndex--;
            else
                this.iSelectIndex = this.itemSize - 1;
        }      
        ret = true;  
    }
    // down/right
    else if (( e.keyCode == 40 || e.which == 40 ) || ( e.keyCode == 39 || e.which == 39 )) {
        if(this.itemSize > 0)
        {
            if(this.iSelectIndex == -1)
                this.iSelectIndex = 0;
            else if(this.iSelectIndex < this.itemSize - 1)
                this.iSelectIndex++;
            else
                this.iSelectIndex = 0;
        }
        ret = true;
    }
    else if(( e.keyCode == 13 || e.which == 13 ))
    {
        if(this.iSelectIndex >= 0)
            this._postSelectProcess(this.iSelectIndex);

        ret = true;
    }

    if(this.iSelectIndex >= 0)
    {
        for(var i=0 ; i< this.elListLi.length;i++)
        {
            if(this.elListLi[i].classList.contains('selected'))
                this.elListLi[i].classList.remove('selected');
        }

        var el = this.elListLi[this.iSelectIndex];
        el.classList.add('selected');
        el.scrollIntoView({ behavior: "smooth", });

    }

    return ret;
}
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Handler /////////////////////////////////////
// List Navigation/Selection Key Up/Down , Enter Key 
mtmInputAutoComplete.prototype.onKeyPressHandler = function(e){
    if(this.itemSize <= 0)
        return;

    // up/left
    if( ( e.keyCode == 38 || e.which == 38 ) || ( e.keyCode == 37 || e.which == 37 ) ){
        if(this.itemSize > 0)
        {
            if(this.iSelectIndex == -1)
                this.iSelectIndex = 0;
            else if(this.iSelectIndex > 0)
                this.iSelectIndex--;
            else
                this.iSelectIndex = this.itemSize - 1;
        }        
    }
    // down/right
    else if (( e.keyCode == 40 || e.which == 40 ) || ( e.keyCode == 39 || e.which == 39 )) {
        if(this.itemSize > 0)
        {
            if(this.iSelectIndex == -1)
                this.iSelectIndex = 0;
            else if(this.iSelectIndex < this.itemSize - 1)
                this.iSelectIndex++;
            else
                this.iSelectIndex = 0;
        }
    }
    else if(( e.keyCode == 13 || e.which == 13 ))
    {
        if(this.iSelectIndex >= 0)
            this._postSelectProcess(this.iSelectIndex);
    }

    if(this.iSelectIndex >= 0)
    {
        for(var i=0 ; i< this.elListLi.length;i++)
        {
            if(this.elListLi[i].classList.contains('selected'))
                this.elListLi[i].classList.remove('selected');
        }

        var el = this.elListLi[this.iSelectIndex];
        el.classList.add('selected');
        el.scrollIntoView({ behavior: "smooth", });
    }
}

mtmInputAutoComplete.prototype.onKeyUpHandler = function(e){
    // console.log('mtmInputAutoComplete.>.onKeyUpHandler');
    // if(this.itemSize <= 0)
    //     return;

    var ret = this._keyUpHandler(e);
    if(ret)
        return;

    if(this.options && this.options.eventKeyUpHandler)
    {
        var self = this;
        setTimeout(function(){
            // console.log('mtmInputAutoComplete.>.eventKeyUpHandler:', self.elsObject.elInput.value);
            self.options.eventKeyUpHandler();
        },0);
    }

    // return this.elsObject.elInput.vaule;
}

mtmInputAutoComplete.prototype.onListOnHandler = function(){
    this.elThis.classList.toggle('on');
    if(this.elsObject.elThis.classList.contains('on'))
        this.elsObject.elList.style.display = 'block';
    else
        this.elsObject.elList.style.display = 'none';
}

mtmInputAutoComplete.prototype.onListSelectHandler = function(e){
    // console.log('mtmInputAutoComplete > onListSelectHandler : ', )
    if(this.itemSize <= 0)
        return;

    for(var i=0 ; i< this.elListLi.length;i++)
    {
        if(this.elListLi[i].classList.contains('selected'))
            this.elListLi[i].classList.remove('selected');
    }

    e.currentTarget.classList.add('selected');

    this.elThis.classList.remove('on');
    
    var index = e.currentTarget.getAttribute('data-index');

    this._postSelectProcess(index);
    // var eData = {};
    // eData.id = this.itemData[index].id;
    // eData.name = this.itemData[index].name;
    // eData.city = this.itemData[index].city;
    // eData.region = this.itemData[index].region;
    
    // var text = e.target.innerHTML;
    // var subTitle = '';

    // if(eData.city)
    //     subTitle += eData.city;
    // if(eData.region)
    //     subTitle += ( ' ' + eData.region);
    
    // this.elsObject.elSubTitle.innerHTML = subTitle;
    // this.elsObject.elInput.innerHTML = eData.name;

    // this.elsObject.elList.style.display = 'none';

    
    // if(this.options && this.options.eventChangeHandler)
    //     this.options.eventChangeHandler(eData);
    // else if(this.options && this.options.eventHandler)
    //     this.options.eventHandler(eData);
}

mtmInputAutoComplete.prototype.onListOffHandler = function(e){
    
    if( !(e.target == this.elsObject.elInput) && this.elThis.classList.contains('on'))
    {
        this.elThis.classList.remove('on');
        this.elsObject.elList.style.display = 'none';
    }
}
//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// API //////////////////////////////////////////
mtmInputAutoComplete.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtmInputAutoComplete.prototype.getValue = function() {
    return this.elsObject.elInput.innerHTML;
}

mtmInputAutoComplete.prototype.setOptionList = function(listItem,bSelectLast) {
    this.setList(listItem,bSelectLast);
}

// iIndex 의 항목을 선택한다.
mtmInputAutoComplete.prototype.setListIndex = function(listItem,iIndex) {
    this.elsObject.elSubTitle.style.visibility = 'hidden';

    this._makeItemList(listItem,false,false);
    this.elListLi = [];

    while (this.elsObject.elList.firstChild) {
        this.elsObject.elList.removeChild(this.elsObject.elList.lastChild);
    }

    for(var i=0;i<this.itemList.length;i++)
    {
        // var el = mtoElementBuilder.createElement(this.itemList[i]);
        var el = this._createItemElement(i);

        this.elListLi.push(el);
        this.elsObject.elList.appendChild(el);
        // if((bSelectLast && (i==this.itemList.length-1)) || (bSelectFirst && (i==0)))
        if( (iIndex >= 0) && (iIndex == i))
        {
            el.classList.add('selected');
            var text = listItem[i];
            // console.log('mtmInputAutoCompleteButton > setList : ',listItem[i]);
            
            // $(this.elsObject.elSelect).text(listItem[i]);
            this._postSelectProcess(i);
            // this.elsObject.elInput.innerHTML = listItem[i];
            // if(this.options && this.options.eventChangeHandler)
            //     this.options.eventChangeHandler(text,i);
            // else if(this.options && this.options.eventHandler)
            //     this.options.eventHandler(text,i);
        }
    }
    
    // console.log('this.itemList : ',this.itemList);
    this._initEvents();
}

mtmInputAutoComplete.prototype.setList = function(listItem,bSelectLast,bSelectFirst) {

    this._makeItemList(listItem,bSelectLast,bSelectFirst);

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
    // console.log('mtmInputAutoComplete > setList : ', bSelectLast, this.itemList);
    this.elsObject.elSubTitle.style.visibility = 'hidden';
    
    for(var i=0;i<this.itemList.length;i++)
    {
        // var el = mtoElementBuilder.createElement(this.itemList[i]);
        var el = this._createItemElement(i);

        this.elListLi.push(el);
        this.elsObject.elList.appendChild(el);
        // if(bSelectLast && (i==this.itemList.length-1))
        if((bSelectLast && (i==this.itemList.length-1)) || (bSelectFirst && (i==0)))
        {
            var text = listItem[i];
            // console.log('mtmInputAutoComplete > setList : ',listItem[i]);
            
            this._postSelectProcess(i);
            // $(this.elsObject.elInput).text(listItem[i]);
            // if(this.options && this.options.eventHandler)
            //     this.options.eventHandler(text,i);
        }
    }
    
    // console.log('this.itemList : ',this.itemList);
    this._initEvents();
}

mtmInputAutoComplete.prototype.setTitle = function(title) {
    this.elsObject.elInput.innerHTML = title;
}

mtmInputAutoComplete.prototype.setSelectedTitle = function(title,index) {
    
    this.elsObject.elInput.innerHTML = title;
    this.itemList[index] = title;
    this.elListLi[index].innerHTML = title;
}

mtmInputAutoComplete.prototype.getInputValue = function() {
    return this.elsObject.elInput.value;
}

mtmInputAutoComplete.prototype.setInputValue = function(value) {
    this.elsObject.elInput.value = value;
}

mtmInputAutoComplete.prototype.setSubTitle = function(subTitle) {
    this.elsObject.elSubTitle.innerHTML = subTitle;
    this.elsObject.elSubTitle.classList.remove('mtm-login-error');
    this.elsObject.elSubTitle.style.visibility = 'visible';
}

mtmInputAutoComplete.prototype.getSubTitle = function(subTitle) {
    return this.elsObject.elSubTitle.innerHTML;
}

mtmInputAutoComplete.prototype.setSuggestion = function(itemList) {
    this.data_id = '';
    this.itemSize = itemList.length;

    if(itemList.length == 0)
        itemList.push({id:'',name:'선택 목록 없음',city:'',region:''});
        
    this.setList(itemList,false,false);
    this.iSelectIndex = -1;
    if(this.itemSize > 0)
    {
        // this.itemSelectionIndex = 0;
        this.elsObject.elList.style.display = 'block';

        // for(var i=0 ; i< this.elListLi.length;i++)
        // {
        //     if(this.elListLi[i].classList.contains('selected'))
        //         this.elListLi[i].classList.remove('selected');
        // }
        // this.elListLi[this.itemSelectionIndex].classList.add('selected');
        
    }
}

mtmInputAutoComplete.prototype.clearSuggestion = function() {
    this.data_id = '';
    var itemList = [];
    this.itemSize = 0;
    this.iSelectIndex = -1;
    this.elsObject.elSubTitle.style.visibility = 'hidden';
    itemList.push({id:'',name:'선택 목록 없음',city:'',region:''});
    
    this.setList(itemList,false,false);
}

mtmInputAutoComplete.prototype.getDataID = function() {
    return this.data_id;
}

mtmInputAutoComplete.prototype.focus = function() {
    this.elsObject.elInput.focus();
}

mtmInputAutoComplete.prototype.setMessage = function(message) {
    // console.log('mtmInputAutoComplete.>.setMessage : ', message);
    var name = this.elsObject.elInput.value;
    var html = this.elsObject.elSubTitle.innerHTML; 
    this.elsObject.elSubTitle.innerHTML = html + ' ' + '"'+ name + '"';
    this.elsObject.elSubTitle.classList.add('mtm-login-error');

    this.elsObject.elInput.setAttribute('placeholder',message);
    this.elsObject.elInput.classList.add('mtm-login-error');
    this.elsObject.elInput.value = '';
}

mtmInputAutoComplete.prototype.setEnable = function(bEnable)
{
    this.elsObject.elInput.disabled = !bEnable;
}