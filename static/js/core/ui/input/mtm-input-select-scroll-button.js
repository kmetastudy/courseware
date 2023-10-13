import {mtoElementBuilder} from '../utils/mto-element-builder.js';

require('./mtm-input-select-scroll-button.css');

// 1) 스크롤 선택 박스 옆에 Action Button 이 있는 것..
// 1-1) 여기서 한 단계 더 발전해서 Action Button 에 확장 Menu를 더해서
// 1-2) Extension Menu 에 Save/Delete 을 할 수 있게.... 
export var mtmInputSelectScrollButton = function(options)
{
    this.id = 'id-mtm-input-select-scroll-button-' + mtmInputSelectScrollButton.id++;
    this.elThis = null;
    
    this.options = null;
    this._initOptions(options);

    this.elSelect = null;
    this.elList = null;
    // this.elSelected = null;
    
    this.elListLi = [];
    this.itemList = [];

    this.elCompList = null; 
    this.elsArray = ['elThis','elSelectThis', 'elBox','elSelect','elList','elButton'];
    this.elsObject = {};
    this.bInitEvent = false;
    this._init();    
    
}

mtmInputSelectScrollButton.id = 0;

mtmInputSelectScrollButton.staticBody = [
    // {'step':0,'tag':'div', 'class':'mtm-input-select-scroll','attr':{'style':'width:50%;'}},
    {'step':0, 'tag':'div', 'class': 'mtm-input-select-scroll-button justify-content-center',
        // 'attr':{'style':'width:50%'}
        },
        {'step': 1,'tag':'div', 'class':'mtm-input-select-scroll-button-select',
            // 'attr':{'style':'width:50%;'}
            },
            {'step':1,'tag':'div','class':'box',},
                {'step':1,'tag':'div','class':'select','text':'선택'},
                {'step':0,'tag':'ul','class':'list',},
        {'step':-2, 'tag':'button', 'class': 'mtm-input-select-scroll-button-button', 
                'text' : '',
            },
                    // {'step':1,'tag':'li','class':'selected','text':'선택'},
                // {'step':0,'tag':'li','text':'항목1'},
                // {'step':0,'tag':'li','text':'항목2'},
                // {'step':0,'tag':'li','text':'항목3'},
                // {'step':0,'tag':'li','text':'항목4'},
                // {'step':0,'tag':'li','text':'항목5'},                
];

mtmInputSelectScrollButton.testListItem = [
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


mtmInputSelectScrollButton.prototype._makeItemList = function(itemList,bSelectLast,bSelectFirst) {
    this.itemList = [];

    if(itemList.length > 0)
    {
        if(bSelectLast && (itemList.length == 1))
            this.itemList.push({'step':0,'tag':'li','class':'selected','text':itemList[0],'attr':{'data-index':0}});
        else 
            this.itemList.push({'step':0,'tag':'li','text':itemList[0],'attr':{'data-index':0}});
        
        for(var i=1;i<itemList.length;i++)
        {
            if(bSelectLast && (i==itemList.length-1))
                this.itemList.push({'step':0,'tag':'li','class':'selected','text':itemList[i],'attr':{'data-index':i}});
            else if(bSelectFirst && (i==0))
                this.itemList.push({'step':0,'tag':'li','class':'selected','text':itemList[i],'attr':{'data-index':i}});
            else
                this.itemList.push({'step':0,'tag':'li','text':itemList[i],'attr':{'data-index':i}});
            
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

mtmInputSelectScrollButton.prototype._initOptions = function(options){
    this.options = options;
    if(!this.options)
        this.options = {};
    
    if(!this.options.color)
        this.options.color = 'mtm-select-scroll-color-0';
    
    if(!this.options.items)
        this.options.items = [];
    
}

mtmInputSelectScrollButton.prototype._initEvents = function() {
    // console.log('mtmInputSelectScrollButton > _initEvents :');
    if(!this.bInitEvent)
        this.elsObject.elSelect.addEventListener('click',this.onListOnHandler.bind(this));
    
    if(!this.bInitEvent)
        document.addEventListener('click',this.onListOffHandler.bind(this));
    
    if(!this.bInitEvent)
        this.elsObject.elButton.addEventListener('click',this.onClickHandler.bind(this));
    
    for(var i=0;i<this.elListLi.length;i++)
        this.elListLi[i].addEventListener('click',this.onListSelectHandler.bind(this));
    this.bInitEvent = true;
}

mtmInputSelectScrollButton.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }
}

mtmInputSelectScrollButton.prototype._create = function(){    
    
    // Create Select List Component
    this.elCompList = mtoElementBuilder.buildComponent(mtmInputSelectScrollButton.staticBody,true);

    // Component List Matching
    this.elThis = this.elCompList[0];
    this.elThis.setAttribute('id',this.id);
    
    if(this.options && this.options.width)
        this.elThis.style.width = this.options.width;
    if(this.options && this.options.classList)
        for(var i=0;i<this.options.classList.length;i++)
            this.elThis.classList.add(this.options.classList[i]);
    this._matchElements();
    
    // Add Select List Items
    // if(this.options.items.length == 0)
    //     for(var i=0;i<mtmInputSelectScrollButton.testListItem.length;i++)
    //     {
    //         var el = mtoElementBuilder.createElement(mtmInputSelectScrollButton.testListItem[i]);
    //         this.elListLi.push(el);
    //         this.elsObject.elList.appendChild(el);
    //     }
    
    
    this.setList(this.options.items);
    this.elsObject.elButton.innerHTML = this.options.buttonTitle; 

    if(this.options && this.options.title)
        this.elsObject.elSelect.innerHTML = this.options.title;
    // this.elsObject.elButton.disabled = true;
}

mtmInputSelectScrollButton.prototype._prepare = function() {
    // 하나도 없으면 disabled 가 된다.
    // if(this.options.items.length == 0)
    //     this.options.items.push('선택');

    mtmInputSelectScrollButton.staticBody[3]['text'] = this.options.items[0];
    
}

mtmInputSelectScrollButton.prototype._init = function() {
    this._prepare();
    this._create();

}

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Handler /////////////////////////////////////
mtmInputSelectScrollButton.prototype.onListOnHandler = function(){
    if(this.elThis.classList.contains('disabled'))
        return;

    this.elThis.classList.toggle('on');
    if(this.elsObject.elThis.classList.contains('on'))
        this.elsObject.elList.style.display = 'block';
    else
        this.elsObject.elList.style.display = 'none';
}

mtmInputSelectScrollButton.prototype.onListSelectHandler = function(e){
    // console.log('mtmInputSelectScrollButton > onListSelectHandler : ', )

    for(var i=0 ; i< this.elListLi.length;i++)
    {
        if(this.elListLi[i].classList.contains('selected'))
            this.elListLi[i].classList.remove('selected');
    }
    e.target.classList.add('selected');

    this.elThis.classList.remove('on');
    
    var text = e.target.innerHTML;
    this.elsObject.elSelect.innerHTML = text;

    this.elsObject.elList.style.display = 'none';

    var index = e.target.getAttribute('data-index');
    if(this.options && this.options.eventChangeHandler)
        this.options.eventChangeHandler(text,index);
}

mtmInputSelectScrollButton.prototype.onListOffHandler = function(e){
    
    if( !(e.target == this.elsObject.elSelect) && this.elThis.classList.contains('on'))
    {
        this.elThis.classList.remove('on');
        this.elsObject.elList.style.display = 'none';
    }
}

mtmInputSelectScrollButton.prototype.onClickHandler = function(e){
    if(this.options && this.options.eventClickHandler)
        this.options.eventClickHandler();
}
//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// API //////////////////////////////////////////
mtmInputSelectScrollButton.prototype.show = function(bShow) {
    if(bShow)
        this.elThis.style.display = 'flex';
    else
        this.elThis.style.display = 'none';
}

mtmInputSelectScrollButton.prototype.enable = function(bEnable) {
    if(bEnable)
    {
        this.elThis.classList.remove('disabled');
    }
    else
    {
        this.elThis.classList.add('disabled');
    }
}

mtmInputSelectScrollButton.prototype.getValue = function() {
    return this.elsObject.elSelect.innerHTML;
}

mtmInputSelectScrollButton.prototype.setOptionList = function(listItem,bSelectLast) {
    this.setList(listItem,bSelectLast);
}

mtmInputSelectScrollButton.prototype.setListIndex = function(listItem,iIndex) {
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

mtmInputSelectScrollButton.prototype.setList = function(listItem,bSelectLast,bSelectFirst) {

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
    // console.log('mtmInputSelectScrollButton > setList : ', bSelectLast, this.itemList);
        
    for(var i=0;i<this.itemList.length;i++)
    {
        var el = mtoElementBuilder.createElement(this.itemList[i]);
        this.elListLi.push(el);
        this.elsObject.elList.appendChild(el);
        if((bSelectLast && (i==this.itemList.length-1)) || (bSelectFirst && (i==0)))
        {
            var text = listItem[i];
            // console.log('mtmInputSelectScrollButton > setList : ',listItem[i]);
            
            $(this.elsObject.elSelect).text(listItem[i]);
            if(this.options && this.options.eventChangeHandler)
                this.options.eventChangeHandler(text,i);
        }
    }
    
    // console.log('this.itemList : ',this.itemList);
    this._initEvents();
}

mtmInputSelectScrollButton.prototype.setTitle = function(title) {
    this.elsObject.elSelect.innerHTML = title;
}

mtmInputSelectScrollButton.prototype.setSelectedTitle = function(title,index) {
    
    this.elsObject.elSelect.innerHTML = title;
    this.itemList[index] = title;
    this.elListLi[index].innerHTML = title;
}

mtmInputSelectScrollButton.prototype.setButtonEnable = function(bEnable) {
    this.elsObject.elButton.disabled = !bEnable;
}

mtmInputSelectScrollButton.prototype.setButtonTitle = function(title) {
    this.elsObject.elButton.innerHTML = title;
}