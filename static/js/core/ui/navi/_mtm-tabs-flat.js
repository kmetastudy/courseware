// mtm-tabs.css 
// Color    - Active
//          - Hover
//          
// require('../../../css/mtv/core/mtm-tabs.css');
require('../../../../css/mtv/core/mtm-tabs-v2.css');

import {mtvElementBuilder} from './utils/mtv-element-builder.js';

// Creating tabs in HTML + CSS + JS
// https://www.101computing.net/creating-tabs-in-html-css-js/

// CodePen Home / Pure CSS Tabs
// https://codepen.io/markcaron/pen/MvGRYV

// 기존에 Tabs 을 구현하기 위해서 
// Tab 과 Panel 을 Parent/Child 구조로 하였으나,
// 새로운 Tabs 는 Pab 과 Panel을 Flat 한 구조로 만든다.
export var mtmTabsFlat = function(options)
{
    this.id = "id-mtm-tabs-flat-" + mtmTabsFlat.id++;
    this.options = options;
    this.elThis = null;

    this.elTabDiv = null;
    this.elPanelDiv = null;

    this.elTabs = [];       // Tab 자체 
    this.elPanels = [];     // Tab Panel
    
    this.activeIndex = -1;
    this.activePanelIndex = -1;
    // Tabs 을 Manager 에서 관리한다.
    // 나중에...
    this.elTabDiv = null;
    this.elTabUl = null;
    
    this.tabCount = 0;
    this.tabElTitles = [];
    this._init();
}

mtmTabsFlat.id = 0;

mtmTabsFlat.prototype._createTreeElement = function(el)
{
    if(!el['tag'])
        return (el['text'] || 'nothing');

    var element = document.createElement(el['tag']);

    if(el['class'])
        element.setAttribute('class',el['class']);
    
    if(el['id'])
        element.setAttribute('id',el['id']);
    
    if(el['style'])
        element.setAttribute('style',el['style']);
    
    if(el['text'])
        element.innerHTML = el['text'];


    return element;
}

mtmTabsFlat.prototype._addTab = function(tab) {
    var el = document.createElement('div');
    var tabClass = 'mtm-tabs-tab';
    this.elTabs.push(el);

    el.setAttribute('class',tabClass);
    if(tab.active)
    {
        el.classList.add('active');
        this.activeIndex = this.elTabs.length-1;
        // console.log('mtmTabsFlat > _addTab : this.activeIndex',this.activeIndex);
    }
    if(tab.align)
        el.classList.add(tabClass+'-'+tab.align);
    el.setAttribute('data-index',this.elTabs.length-1);
    el.innerHTML = tab.name;

    el.addEventListener('click',this.onTabClickHandler.bind(this));
    this.tabElTitles.push(el);
    return el;
}

mtmTabsFlat.prototype._addPanel = function(panel) {
    if(!panel)
        return null;

    var el = document.createElement('div');
    this.elPanels.push(el);

    el.setAttribute('class','mtm-tabs-panel');
    el.setAttribute('data-index',this.elPanels.length-1);
    // default add
    el.style.display = 'none';
    return el;
}


mtmTabsFlat.prototype._init = function()
{
    // id-mtm-tabs-flat-
    this.elThis = document.createElement('div');
    this.elThis.setAttribute('id',this.id);

    this.elTabDiv = document.createElement('div');
    this.elTabDiv.classList.add('mtm-tabs-tab-div');

    this.elPanelDiv = document.createElement('div');
    this.elPanelDiv.classList.add('mtm-tabs-panel-div');

    this.elThis.appendChild(this.elTabDiv);
    this.elThis.appendChild(this.elPanelDiv);
    
    // create Tab itself
    // {name:'tabName',align:'float',panel:true}
    if(this.options && this.options.tabs)
    {
        var index = 0;
        for(var i=0;i<this.options.tabs.length;i++)
        {
            var tab = this._addTab(this.options.tabs[i]);
            this.elTabDiv.appendChild(tab);
            
            var panel = this._addPanel(this.options.tabs[i].panel);
            if(panel)
                this.elPanelDiv.appendChild(panel);
        }
    }
    // create Tab Panel

    // this.elTabDiv = document.getElementById(this.id);
    // if(!this.elTabDiv)
    // {
    //     this.elTabDiv = document.createElement('div');
    //     this.elTabDiv.setAttribute('class','tabs');
    //     this.elTabDiv.setAttribute('id',this.id);
    // }

    // this.elTabUl = document.createElement('ul');
    
    // this.elTabDiv.appendChild(this.elTabUl);

    // console.log('this.options : ', this.options);

    // if(this.options)
    // {
    //     for(var i=0;i<this.options.tabTitle.length;i++)
    //     {
    //         // console.log('tabDivTree : ', this.options.tabDivTree[i]);
    //         // 탭 내부 요소 / Scroll 은 뭥미?
    //         this.addTab(this.options.tabTitle[i],this.options.tabDivTree[i],
    //                 this.options.tabGap[i],this.options.tabScroll[i],
    //                 this.options.tabCallback[i],
    //                 this.options.tabFloat[i],
    //                 );
    //     }
    // }

    // this.applyOptions();

}

/////////////////////////////////////////////////////////////////////
////////////////////////////// Handler //////////////////////////////
mtmTabsFlat.prototype.onTabClickHandler = function(e) {
    var index = e.target.getAttribute('data-index');
    if(!index)
        return;
    
    if(this.activeIndex >= 0)
        this.elTabs[this.activeIndex].classList.remove('active');
    
    this.activeIndex = parseInt(index);
    this.elTabs[this.activeIndex].classList.add('active');

    if(this.options && this.options.eventActivateTab)
        this.options.eventActivateTab(this.activeIndex);
}
/////////////////////////////////////////////////////////////////////
////////////////////////////// API //////////////////////////////////

mtmTabsFlat.prototype.addTab = function(tabName,els,gap,scroll,callback,float)
{
    var elLi = document.createElement('li');
    var elAnchor = document.createElement('a');
    var tabId = this.id + '-tabs-' + this.tabCount;
    elAnchor.setAttribute('href','#'+tabId);
    elAnchor.innerHTML = tabName;
    elLi.appendChild(elAnchor);
    this.elTabUl.appendChild(elLi);

    this.tabElTitles.push(elAnchor);

    var elTabs = document.createElement('div');
    elTabs.setAttribute('id',tabId);
    if(gap)
        elTabs.setAttribute('class',gap);
    
    if(float)
    {
        // console.log('float : ', float);
        elLi.setAttribute('class',float);
    }

    this.tabEls.push(elTabs);
    
    // Todo. 좀 더 Nice 하게....
    if(scroll == 1)
        elTabs.setAttribute('style',"overflow-y:auto;max-height:85vh");

    this.elTabDiv.appendChild(elTabs);
    var treeEle = [];
    var level = 0;
    var element = null;
    treeEle.push(elTabs);

    if(els)
    {
        for(var i=0;i<els.length;i++)
        {
            element = this._createTreeElement(els[i]);
            level = els[i]["level"];
            
            treeEle[level].appendChild(element)
            
            treeEle[level+1] = element;

        }
    }

    if(callback)
    {
        callback(elTabs);
    }

    this.tabCount++;
}

// mtmTabsFlat.prototype.applyOptions = function()
// {
//     // Todo. 좀 더 Nice 하게 할 수 없나?
//     if(this.options.activate)   // activate handler 
//         $(this.elTabDiv).tabs({activate:this.options.activate});
//     else
//         $(this.elTabDiv).tabs();
// }

// 
mtmTabsFlat.prototype.setWideClass = function(bSet,classValue)
{
    if(bSet)
        this.elTabDiv.classList.add(classValue);
    else 
        this.elTabDiv.classList.remove(classValue);
}

mtmTabsFlat.prototype.disable = function(index)
{
    $(this.$id).tabs("disable",index);
}

// mtmTabsFlat.prototype.getActiveIndex = function()
// {
//     return $(this.$id).tabs("option","active");
// }

// mtmTabsFlat.prototype.setActiveIndex = function(index,eventEmitter,eventHandler)
// {
//     $(this.$id).tabs("option","active",index);
//     // if(eventEmitter)
//     //     mtvEvents.emit(eventEmitter,index);
//     // if(eventHandler)
//     //     eventHandler(index);
// }

mtmTabsFlat.prototype.setActiveIndex = function(index) {
    if(this.activeIndex >= 0)
        this.elTabs[this.activeIndex].classList.remove('active');
    
    this.activeIndex = parseInt(index);
    this.elTabs[this.activeIndex].classList.add('active');
}

mtmTabsFlat.prototype.getActiveIndex = function() {
    return this.activeIndex;
}

mtmTabsFlat.prototype.rightAlignment = function(index)
{
    $(this.$id).tabs().addClass( "tabs-to-right" );
}

mtmTabsFlat.prototype.setTitle = function(index ,title) {
    if(this.tabElTitles.length <= index)
    {
        console.log('mtmTabsFlat > setTitel : overflow',this.tabElTitles);
        return;
    }

    this.tabElTitles[index].innerHTML = title;
}

mtmTabsFlat.prototype.getTitle = function(index) {
    if(this.tabElTitles.length <= index)
        return '';
    return this.tabElTitles[index].innerHTML; // = title;
}

mtmTabsFlat.prototype.setTab = function(index ,el,id) {
    
    this.tabEls[index] = el;

    this.elTabDiv.appendChild(el);
    el.style.display = '';
}

mtmTabsFlat.prototype.showTab = function(index)
{
    for(var i=0;i<this.tabEls.length;i++)
    {
        var el = this.tabEls[i];
        if(index == i)
        {
            el.style.display = '';
        }
        else
        {
            el.style.display = 'none';
        }
    }
}

mtmTabsFlat.prototype.getTabs = function()
{
    return this.tabEls;
}

mtmTabsFlat.prototype.getTab = function(index)
{
    return this.tabEls[index];
    // return this.elTabs[index];
}

mtmTabsFlat.prototype.restorePanels = function()
{
    // for(var i=0;i<this.tabEls.length;i++)
    //     this.elTabDiv.appendChild(this.tabEls[i]);
    for(var i=0;i<this.elPanels.length;i++)
        this.elPanelDiv.appendChild(this.elPanels[i]);
}

mtmTabsFlat.prototype.appendPanel = function(index,el)
{
    if(this.elPanels.length <= index)
    {
        // this._addPanel(true);
        var panel = this._addPanel(true);
        if(panel)
            this.elPanelDiv.appendChild(panel);
    }

    this.elPanels[index].appendChild(el);
}

mtmTabsFlat.prototype.addPanel = function(index,el)
{
    if(this.elPanels.length <= index)
        return;

    this.elPanels[index].appendChild(el);
}

mtmTabsFlat.prototype.getPanel = function(index)
{
    return this.elPanels[index];
}

// subIdx 는 무엇을 하려고 했지?
mtmTabsFlat.prototype.showPanel = function(index,subIdx)
{
    if(this.activePanelIndex == index && (subIdx === undefined))
        return;
    
    
    if(this.activePanelIndex >= 0)
        this.elPanels[this.activePanelIndex].style.display = 'none';

    if(this.elPanels.length <= index)
    {
        this.activePanelIndex = -1;
        return;
    }

    this.activePanelIndex = index;

    if(this.activePanelIndex >= 0)
        this.elPanels[this.activePanelIndex].style.display = '';

    // if(this.elPanels[index])
    // {
    //     if(subIdx === undefined)
    //     {
    //         this.elPanels[index].style.display = '';
    //         return;
    //     }    
        
    //     for(i=0; i< this.elPanels[index].children.length ;i++)
    //     {
    //         this.elPanels[index].children[i].style.display = 'none';
    //     }

    //     if(this.elPanels[index].children[subIdx])
    //         this.elPanels[index].children[subIdx].style.display = '';

    // }
}