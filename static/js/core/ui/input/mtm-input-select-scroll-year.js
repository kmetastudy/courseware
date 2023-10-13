////////////////////////////////////////////////////////////////////////
// mtmInputSelectScrollYear = mtmInputSelectYear + mtmInputSelectScroll 기능
// Horizonatl Button Group 을 이용하여, 해당 연도를 선택하는 기능을 한다.
// UI : << Year >>
// SelectScroll 기능을 이용하여 기존에 존제하는 Item(년도) 를 선택할 수 있다.
// 기본 mtmInputSelectYear 에 mtmInputSelectScroll 기능을 더한다. 
////////////////////////////////////////////////////////////////////////
// Horizontal Button Groups
// https://www.w3schools.com/howto/howto_css_button_group.asp
//----------------------------------------------------------------------
import {mtvElementBuilder} from '../utils/mtv-element-builder.js';
require('./mtm-input-select-year.css');

export var mtmInputSelectScrollYear = function(options)
{
    this.id = 'id-mtm-input-select-scroll-year-' + mtmInputSelectScrollYear.id++;
    this.options = null;
    this.elThis = null;

    this.elLeft = null;
    this.elYear = null;
    this.elRight = null;
    
    this._initOptions(options);

    this.elSelect = null;
    this.elList = null;
    // this.elSelected = null;
    
    this.elListLi = [];
    this.itemList = [];

    // for elements matching
    this.elCompList = null;
    this.elsArray = ['elThis',
                    'elWrapper',
                    'elLeft','elYearThis','elBox','elYearSelect','elYearList','elRight'];
    this.elsObject = {};
    this.bInitEvent = false;

    this.today = new Date();
    this.year = this.today.getFullYear();
    this.currentYear = this.year;
    this.currentCount = 0;
    this._init();
}

mtmInputSelectScrollYear.id = 0;

mtmInputSelectScrollYear.staticBody = [
    {'step':0, 'tag':'div', 'class': 'mtm-input-select-year',
        // 'attr':{'style':'width:50%'}
    },
        {'step':1 , 'tag': 'div', 'class':'wrapper d-flex justify-content-center',},
            {'step':1, 'tag':'button', 'class': 'mtm-input-select-year-left',
                //  'text':'&lt;'
            },
            // {'step':0, 'tag':'button', 'class': 'mtm-input-select-year-center', 'text' : 'Year'},
            {'step':0,'tag':'div', 'class':'mtm-input-select-scroll-year',
                // 'attr':{'style':'width:50%;'}
            },
                {'step':1,'tag':'div','class':'box',},
                    {'step':1,'tag':'div','class':'select','text':'선택'},
                    {'step':0,'tag':'ul','class':'list',},
            
            {'step':-2, 'tag':'button', 'class': 'mtm-input-select-year-right', 
                // 'text' : '&gt;'
            },
        
];

mtmInputSelectScrollYear.prototype._makeItemList = function(itemList,bSelectLast) {
    this.itemList = [];
    this.years = [];
    this.counts = [];
    if(itemList.length > 0)
    {
        if(!bSelectLast || (itemList.length == 1))
            this.itemList.push({'step':0,'tag':'li','class':'selected','text':itemList[0],'attr':{'data-index':0}});
        else 
            this.itemList.push({'step':0,'tag':'li','text':itemList[0],'attr':{'data-index':0}});
        
        for(var i=1;i<itemList.length;i++)
        {
            if(bSelectLast && (i==itemList.length-1))
                this.itemList.push({'step':0,'tag':'li','class':'selected','text':itemList[i],'attr':{'data-index':i}});
            else
                this.itemList.push({'step':0,'tag':'li','text':itemList[i],'attr':{'data-index':i}});
            
        }
    }
    else
    {
        this.currentYear = this.year;
        this.currentCount = 0;
        this.years.push(this.currentYear);
        this.counts.push(this.currentCount);
        this.itemList.push({'step':0,'tag':'li',
                    // 'text':this.currentYear + ' (' + this.currentCount  + ')',
                    'text': this._getYearCountText(this.currentYear,this.currentCount),
                    'attr':{'data-index':0}});
        
    }
}

mtmInputSelectScrollYear.prototype._makeItemListCount = function(itemList,bSelectLast) {
    this.itemList = [];
    this.years = [];
    this.counts = [];
    if(itemList.length > 0)
    {
        if(!bSelectLast || (itemList.length == 1))
            this.itemList.push({'step':0,'tag':'li','class':'selected',
                // 'text':itemList[0].year + ' (' + itemList[0].count  + ')' ,
                'text': this._getYearCountText(itemList[0].year,itemList[0].count),
                'attr':{'data-index':0,'data-year':itemList[0].year}});
        else 
            this.itemList.push({'step':0,'tag':'li',
                // 'text':itemList[0].year + ' (' + itemList[0].count  + ')' ,
                'text': this._getYearCountText(itemList[0].year,itemList[0].count),
                'attr':{'data-index':0,'data-year':itemList[0].year}});
        
        this.years.push(itemList[0].year);
        this.counts.push(itemList[0].count);

        for(var i=1;i<itemList.length;i++)
        {
            if(bSelectLast && (i==itemList.length-1))
                this.itemList.push({'step':0,'tag':'li','class':'selected',
                    // 'text':itemList[i].year + ' (' + itemList[i].count  + ')',
                    'text': this._getYearCountText(itemList[i].year,itemList[i].count),
                    'attr':{'data-index':i,'data-year':itemList[i].year}});
            else
                this.itemList.push({'step':0,'tag':'li',
                    // 'text':itemList[i].year + ' (' + itemList[i].count  + ')',
                    'text': this._getYearCountText(itemList[i].year,itemList[i].count),
                    'attr':{'data-index':i,'data-year':itemList[i].year}});
            
            this.years.push(itemList[i].year);
            this.counts.push(itemList[i].count);
        
        }
    }
    else
    {
        // this.itemList.push({'step':0,'tag':'li',
        //             'text':this.year + ' (' + 0  + ')','attr':{'data-index':0}});
            
        // this.years.push(this.year);
        
        this.currentYear = this.year;
        this.currentCount = 0;
        this.years.push(this.currentYear);
        this.counts.push(this.currentCount);
        this.itemList.push({'step':0,'tag':'li',
                    // 'text':this.currentYear + ' (' + this.currentCount  + ')',
                    'text': this._getYearCountText(this.currentYear,this.currentCount),
                    'attr':{'data-index':0}});
        this.currentIndex = 0;
    }
}

mtmInputSelectScrollYear.prototype._initOptions = function(options){
    this.options = options;
    if(!this.options)
        this.options = {};
    
    if(!this.options.color)
        this.options.color = 'mtm-select-scroll-color-0';
    
    if(!this.options.items)
        this.options.items = [];
    
}

mtmInputSelectScrollYear.prototype._create = function() {

    this.elCompList = mtvElementBuilder.buildComponent(mtmInputSelectScrollYear.staticBody,true);

    // console.log('mtmInputSelectScrollYear > this.elCompList : ', this.elCompList);

    // Component List Matching
    this.elThis = this.elCompList[0];
    this.elThis.setAttribute('id',this.id);
}

mtmInputSelectScrollYear.prototype._matchElements = function() {
    for(var i=0;i<this.elsArray.length;i++)
    {
        if(this.elsArray[i])
            this.elsObject[this.elsArray[i]] = this.elCompList[i];
    }
    // console.log('mtmInputSelectScrollYear > this.elsObject : ', this.elsObject);
}

mtmInputSelectScrollYear.prototype._initEventsArrow = function() {
    this.elsObject.elLeft.addEventListener('click',this.onLeftClickHandler.bind(this));
    this.elsObject.elRight.addEventListener('click',this.onRightClickHandler.bind(this));
}

mtmInputSelectScrollYear.prototype._initEventsList = function() {
    if(!this.bInitEvent)
        this.elsObject.elYearSelect.addEventListener('click',this.onListOnHandler.bind(this));
    
    for(var i=0;i<this.elListLi.length;i++)
        this.elListLi[i].addEventListener('click',this.onListSelectHandler.bind(this));
    
    if(!this.bInitEvent)
        document.addEventListener('click',this.onListOffHandler.bind(this));
    
    this.bInitEvent = true;
}

mtmInputSelectScrollYear.prototype._initEvents = function() {
    // this.elsObject.elLeft.addEventListener('click',this.onLeftClickHandler.bind(this));
    // this.elsObject.elRight.addEventListener('click',this.onRightClickHandler.bind(this));
    // this.elsObject.elYear.addEventListener('click',this.onCenterClickHandler.bind(this));

    this._initEventsArrow();
    this._initEventsList();
}

mtmInputSelectScrollYear.prototype._prepare = function() {
    // mtmInputSelectScrollYear.staticBody[2]['text'] = this.currentYear;
    if(this.options.items.length == 0)
    {
        if(this.options && this.options.initTitle)
        {
            this.options.items.push(this.options.initTitle);
        }
        else
        {
            this.options.items.push(' ');
        }
    }

    mtmInputSelectScrollYear.staticBody[4]['text'] = this.options.items[0];
}

mtmInputSelectScrollYear.prototype._init = function() {
    this._prepare();
    this._create();
    this._matchElements();
    this._initEvents();

    this.setList(this.options.items);
}

mtmInputSelectScrollYear.prototype._getYearCountText = function(year,count) {
    if(this.options && this.options.getYearCountText)
        return this.options.getYearCountText(year,count);
    else
        return year + '학년 (' + count + '개)';
}

mtmInputSelectScrollYear.prototype._displayYearCount = function(year,count) {
    this.elsObject.elYearSelect.innerHTML = this._getYearCountText(year,count);
}
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// Handler ///////////////////////////////////
mtmInputSelectScrollYear.prototype.onLeftClickHandler = function() {
    // console.log('mtmInputSelectScrollYear > onLeftClickHandler:',this.currentYear);
    var count = 0;
    var index = -1;
    this.currentYear--;
    for(var i=0;i<this.years.length;i++)
    {
        if(this.currentYear == this.years[i])
        {
            count = this.counts[i]; 
            index = i;
            break;
        }
    }

    this.currentCount = count;
    // this.elsObject.elYearSelect.innerHTML = this.currentYear + ' (' + this.currentCount + ')';
    this._displayYearCount(this.currentYear,this.currentCount);

    if(this.options && this.options.eventHandler)
        this.options.eventHandler("",index);
    
}

mtmInputSelectScrollYear.prototype.onRightClickHandler = function() {
    // console.log('mtmInputSelectScrollYear > onRightClickHandler:',this.currentYear);
    var count = 0;
    var index = -1;
    this.currentYear++;
    for(var i=0;i<this.years.length;i++)
    {
        if(this.currentYear == this.years[i])
        {
            count = this.counts[i]; 
            index = i;
            break;
        }
        // else if(this.currentYear < this.years[i])
    }

    // if(index < 0)
    // {
    //     this.years.add(this.currentYear);
    //     this.counts.add(count);
    // }

    this.currentCount = count;
    // this.elsObject.elYearSelect.innerHTML = this.currentYear + ' (' + this.currentCount + ')';
    this._displayYearCount(this.currentYear,this.currentCount);

    if(this.options && this.options.eventHandler)
        this.options.eventHandler("",index);
}

mtmInputSelectScrollYear.prototype.onCenterClickHandler = function() {
    this.elsObject.elYearSelect.innerHTML = this.currentYear = this.year;
}

mtmInputSelectScrollYear.prototype.onListOnHandler = function(){
    this.elsObject.elYearThis.classList.toggle('on');
    if(this.elsObject.elYearThis.classList.contains('on'))
        this.elsObject.elYearList.style.display = 'block';
    else
        this.elsObject.elYearList.style.display = 'none';
}

mtmInputSelectScrollYear.prototype.onListSelectHandler = function(e){
    // console.log('mtmInputSelectScrollYear > onListSelectHandler' )

    for(var i=0 ; i< this.elListLi.length;i++)
    {
        if(this.elListLi[i].classList.contains('selected'))
            this.elListLi[i].classList.remove('selected');
    }
    e.target.classList.add('selected');

    this.elThis.classList.remove('on');
    
    var text = e.target.innerHTML;
    this.elsObject.elYearSelect.innerHTML = text;

    this.elsObject.elYearList.style.display = 'none';

    var index = e.target.getAttribute('data-index');
    var year = e.target.getAttribute('data-year');
    
    // this.currentYear = this.years[index];
    this.currentYear = year;
    for(var i=0;i<this.years.length;i++)
    {
        if(this.currentYear == this.years[i])
        {
            this.currentIndex = i;
            break;
        }
    }

    if(this.options && this.options.eventHandler)
        // this.options.eventHandler(text,index);
        this.options.eventHandler(this.currentYear);
}

mtmInputSelectScrollYear.prototype.onListOffHandler = function(e){
    
    if( !(e.target == this.elsObject.elYearSelect) && this.elsObject.elYearThis.classList.contains('on'))
    {
        this.elsObject.elYearThis.classList.remove('on');
        this.elsObject.elYearList.style.display = 'none';
    }
}
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// API /////////////////////////////////////
mtmInputSelectScrollYear.prototype.show = function(bShow) {

}

mtmInputSelectScrollYear.prototype.getYear = function() {
    return this.currentYear;
}

mtmInputSelectScrollYear.prototype.addCount = function(inc) {
    // return this.currentYear;
    var count = 0;
    var index = -1;
    // this.currentYear++;
    for(var i=0;i<this.years.length;i++)
    {
        if(this.currentYear == this.years[i])
        {
            this.counts[i] += inc;
            this.currentCount = this.counts[i]; 
            index = i;
            break;
        }
    }

    if(index == -1) // 
    {
        this.years.push(this.currentYear);
        count = inc;
        this.counts.push(count);
        console.log('mtmInputSelectScrollYear > addCount :', count);
        this.currentCount = count;
    }
    // else
    //     this.currentCount++;

    console.log('mtmInputSelectScrollYear > addCount 1 :', count,this.years,this.counts,this.currentYear);
        
    // this.currentCount = count;
    // this.elsObject.elYearSelect.innerHTML = this.currentYear + ' (' + this.currentCount + ')';
    this._displayYearCount(this.currentYear,this.currentCount);
    return this.currentCount;
}

mtmInputSelectScrollYear.prototype.setCount = function(cnt) {
    // return this.currentYear;
    var count = 0;
    var index = -1;
    // this.currentYear++;
    for(var i=0;i<this.years.length;i++)
    {
        if(this.currentYear == this.years[i])
        {
            this.counts[i] = cnt;
            this.currentCount = this.counts[i]; 
            index = i;
            break;
        }
    }

    if(index == -1) // 
    {
        this.years.push(this.currentYear);
        count = cnt;
        this.counts.push(count);
        console.log('mtmInputSelectScrollYear > setCount :', count);
        this.currentCount = count;
    }
    // else
    //     this.currentCount++;

    console.log('mtmInputSelectScrollYear > addCount 1 :', count,this.years,this.counts,this.currentYear);
        
    // this.currentCount = count;
    // this.elsObject.elYearSelect.innerHTML = this.currentYear + ' (' + this.currentCount + ')';
    this._displayYearCount(this.currentYear,this.currentCount);
    return this.currentCount;
}

mtmInputSelectScrollYear.prototype.setList = function(listItem,bSelectLast) {

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
    
    while (this.elsObject.elYearList.firstChild) {
        this.elsObject.elYearList.removeChild(this.elsObject.elYearList.lastChild);
    }

    // set New List Item
    // console.log('mtmInputSelectScroll > setList : ', bSelectLast, this.itemList);
        
    for(var i=0;i<this.itemList.length;i++)
    {
        var el = mtvElementBuilder.createElement(this.itemList[i]);
        this.elListLi.push(el);
        this.elsObject.elYearList.appendChild(el);
        if(bSelectLast && (i==this.itemList.length-1))
        {
            var text = listItem[i];
            // console.log('mtmInputSelectScroll > setList : ',listItem[i]);
            
            $(this.elsObject.elYearSelect).text(listItem[i]);
            if(this.options && this.options.eventHandler)
                this.options.eventHandler(text,i);
        }
    }
    
    // console.log('this.itemList : ',this.itemList);
    this._initEventsList();
}

mtmInputSelectScrollYear.prototype.setListCount = function(listItem,bSelectLast) {

    this._makeItemListCount(listItem,bSelectLast);

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
    
    while (this.elsObject.elYearList.firstChild) {
        this.elsObject.elYearList.removeChild(this.elsObject.elYearList.lastChild);
    }

    // set New List Item
    // console.log('mtmInputSelectScroll > setList : ', bSelectLast, this.itemList);
        
    for(var i=0;i<this.itemList.length;i++)
    {
        var el = mtvElementBuilder.createElement(this.itemList[i]);
        this.elListLi.push(el);
        this.elsObject.elYearList.appendChild(el);
        if(bSelectLast && (i==this.itemList.length-1))
        {
            var text = this.itemList[i].text;
            // console.log('mtmInputSelectScroll > setList : ',listItem[i]);
            
            $(this.elsObject.elYearSelect).text(this.itemList[i].text);
            

            this.currentYear = this.years[i];
            this.currentCount = this.counts[i];
            this.currentIndex = i;

            if(this.options && this.options.eventHandler)
                this.options.eventHandler(text,i);
        }
    }
    // console.log('mtmInputSelectScroll > setListCount : ', this.currentYear, this.currentCount, this.currentIndex);
    // console.log('this.itemList : ',this.itemList);
    this._initEventsList();
}

mtmInputSelectScrollYear.prototype.setTitle = function(title) {
    this.elsObject.elYearSelect.innerHTML = title;
}

mtmInputSelectScrollYear.prototype.setSelectedTitle = function(title,index) {
    
    this.elsObject.elYearSelect.innerHTML = title;
    this.itemList[index] = title;
    this.elListLi[index].innerHTML = title;
}

