// https://github.com/ahamed/treeSortable

// CodePen Home
// SlideToggle / SlideUp / SlideDown - JavaScript (Vanilla)
// https://codepen.io/ivanwebstudio/pen/OJVzPBL

import {mtmListItem} from './mtm-list-item.js';
// import {mtvInputDate} from '../input/mtv-input-date.js';
// import {mtmInputDate} from '../input/mtm-input-date.js';
import {mtmInputDateInline} from '../input/mtm-input-date-inline.js';
// import {mtvInputToggle} from '../input/mtv-input-toggle.js';
import {mtmInputToggle} from '../input/mtm-input-toggle.js';
// import {mtvInputToggleSwitch} from '../input/mtv-input-toggle-switch.js';

export var mtmTreeQuestion = function(options)
{
    this.id = 'id-mtm-tree-question-' + mtmTreeQuestion.id++;
    
    this.elThis = null;
    this.options = options;

    this.bAssignToggle = false;
    if(this.options)
    {
        if(this.options.assign_toggle)
        {
            this.assign_level1 = true;
            this.assign_toggle_level1 = true;
            this.assign_date_level1 = false;

            this.assign = true;
            this.assign_toggle = true;
            this.assign_date = false;
        }
        if(this.options.assign_date)
        {
            this.assign_level1 = false;
            this.assign_toggle_level1 = false;
            this.assign_date_level1 = false;

            this.assign = true;
            this.assign_toggle = true;
            this.assign_date = true;
        }
    }

    this.elSelectedBranch = null;
    this.itemList = [];
    this._init();
    
}

mtmTreeQuestion.id = 0;
// DB 에서는 첫 Branch Level == 0 이다.
// result.append({"id" : branch.id ,"title" : branch.title, "level" : level+1, 'fixed':1,'type':branch.type ,})
    // result.append({"id" : branch.id ,"title" : branch.title, "level" : branch.level+1, 'fixed':1, 'type':branch.type ,})
         
mtmTreeQuestion.testData = [
    {"id":'',"title":"01 Chapter ", "level": 1, "type":0},
        {"id":'',"title":"01 KL Chapter 01 ", "level": 2, "type":0},
    {"id":'',"title":"02 Chapter ", "level": 1, "type":0},
        {"id":'',"title":"01 KL Chapter 02 ", "level": 2, "type":0},
        {"id":'',"title":"02 KL Chapter 02 ", "level": 2, "type":0},
    {"id":'',"title":"03 Chapter ", "level": 1, "type":0},
        {"id":'',"title":"01 KL Chapter 03 ", "level": 2, "type":0},
        {"id":'',"title":"02 KL Chapter 03 ", "level": 2, "type":0},
        {"id":'',"title":"03 KL Chapter 03 ", "level": 2, "type":0},
    {"id":'',"title":"04 Chapter ", "level": 1, "type":0},
        {"id":'',"title":"01 KL Chapter 04 ", "level": 2, "type":0},
        {"id":'',"title":"02 KL Chapter 04 ", "level": 2, "type":0},
        {"id":'',"title":"03 KL Chapter 04 ", "level": 2, "type":0},
        {"id":'',"title":"04 KL Chapter 04 ", "level": 2, "type":0},
];

mtmTreeQuestion.options = {
    depth: 10,  // 얼마나 들어가나 ? px
    // handle: ".drag-handler",
    handle: "handle",
    // treeSelector: '#tree',
    branchSelector: '.cl-tree-branch',
    contentsSelector: '.contents',
    // dragHandlerSelector:  '.handle', //'.branch-drag-handler', 
    // A class name that gets applied to the otherwise white space.
    placeholderName: 'sortable-placeholder',
    childrenBusSelector: '.children-bus',
    levelPrefix: 'level',
    maxLevel: 10,
};

// mtmTreeQuestion.prototype._addInputDate = function() 
// {
//     var options = {};
//     options.title = "시작일";
//     options.width = "50%";
//     options.size = 'small';
//     options.shape = 'round';
//     // var inputDate = new mtvInputDate(item);
//     var clInputDate = new mtmInputDate(options);
//     var clInputDateInline = new mtmInputDateInline(options);
//     var clInputToggle = new mtmInputToggle(options);


//     // var clInputToggleSw = new mtvInputToggleSwitch(options);

//     // this.elThis.appendChild(clInputDate.elThis);
//     // this.elThis.appendChild(clInputDateInline.elThis);
//     // this.elThis.appendChild(clInputToggle.elThis);


//     // this.elThis.appendChild(clInputToggleSw.elThis);
    
// }

mtmTreeQuestion.prototype._addTreeItem = function(item) 
{
    var listItem = new mtmListItem(item);
    this.elThis.appendChild(listItem.elThis);
}

mtmTreeQuestion.prototype._setTreeList = function() {
    if(!this.options || !this.options.treeList)
        return;
    var action = {};
    var eventHandler = {};
    eventHandler.add = this.onAddHandler.bind(this);
    eventHandler.click = this.onClickHandler.bind(this);
    eventHandler.remove = this.onRemoveHandler.bind(this);
    eventHandler.toggle = this.onToggleHandler.bind(this);
    // eventHandler.select = this.onSelectHandler.bind(this);

    action.edit = true;
    action.remove = true;
    action.add = true;
    var addItems = ['형제','자식'];

    // action = action;
    this.itemList = [];
    for(var i=0;i<this.options.treeList.length;i++)
    {
        // this._addTreeItem(this.options.treeList[i]);
        var listItem = null;
        if(this.options.treeList[i].level == 1)
            listItem = new mtmListItem({ data: this.options.treeList[i],
                                        localIndex : i,
                                        eventHandler : eventHandler,
                                        action : action,
                                        addItems : addItems,
                                        // assign : false,
                                        assign : this.assign_level1,
                                        assign_toggle : this.assign_toggle_level1,
                                        assign_date : this.assign_date_level1,
                                        
                                    });
        else
            listItem = new mtmListItem({ data: this.options.treeList[i],
                                        localIndex : i,
                                        eventHandler : eventHandler,
                                        action : action,
                                        addItems : null,
                                        // assign : true,
                                        assign : this.assign,
                                        assign_toggle : this.assign_toggle,
                                        assign_date : this.assign_date,
                                        
                                        });

        // listItem.setAction(false);
        
        if( (this.options.treeList[i].level == 1) && (this.options.treeList.length > i+1))
        {
            if(this.options.treeList[i+1].level == 2)
                listItem.setExpandable(true);    
        }
        else if(this.options.treeList[i].level == 2)
            listItem.show(false);    

        // listItem.setLocalIndex(i);
        this.itemList.push(listItem);
        this.elThis.appendChild(listItem.elThis);
    }
}

mtmTreeQuestion.prototype._init = function() {
    this.elThis = document.createElement('div');
    this.elThis.classList.add('mtm-tree-question');

    // this._addInputDate();
    // for test
    // this.options.treeList = mtmTreeQuestion.testData;
    // this._setTreeList();

    // placeholder 가 height 를 가지면, item 을 freeze 하면,
    // index 의 change 가 너무 많이 불리고, index 는 1 부터 시작한다. 
    // 
    $(this.elThis).sortable({
        // handle: mtmCourseTree.options.dragHandlerSelector,
        // handle: mtmCourseTree.options.handle,

        handle: '.drag-handler', // 이게 있으면.... ui-sortable-handle 이 생기지 않는다.
        // placeholder: "ui-state-highlight",
        // A class name that gets applied to the otherwise white space.
        placeholder: 'sortable-placeholder',
        // placeholderName: 'sortable-placeholder',
    
        // items: '> *',
        // cancel: ".ui-state-disabled",
        forcePlaceholderSize:true ,
        items: '> li:not(.state-disabled)', // 

        // start : function() {},
        // sort : function() {},
        // change : function() {},
        // stop : function() {},
        
        start : this.dragStartHandler.bind(this),
        // sort : this.dragSortHandler.bind(this),
        // change : this.dragChangeHandler.bind(this),
        stop : this.dragStopHandler.bind(this),
        // beforeStop : this.dragBeforeStop.bind(this),
    });

    $(this.elThis).disableSelection();

    this.fixLowLevel = false;
}

mtmTreeQuestion.prototype._fixLowLevel = function() {
    this.fixLowLevel = true;
    for(var i=0;i<this.itemList.length;i++)
    {
        if(this.itemList[i].level > 1)
            this.itemList[i].setSortable(false);
            // this.itemList[i].show(false);
    }

    $(this.elThis).sortable("refresh");
    
} 

mtmTreeQuestion.prototype._releaseLowLevel = function() {
    this.fixLowLevel = false;
    for(var i=0;i<this.itemList.length;i++)
    {
        if(this.itemList[i].level > 1)
            this.itemList[i].setSortable(true);
            // this.itemList[i].show(true);
    }

    $(this.elThis).sortable("refresh");

}

mtmTreeQuestion.prototype._findIndex = function(uuid) {
    var currentIdx = -1;
    // console.log('mtmTreeQuestion > onRemoveHandler uuid:',uuid);
    for(var i=0;i<this.itemList.length;i++)
    {
        if(this.itemList[i].uuid ==  uuid)
        {
            currentIdx = i;
            break;
        }
    }

    // if(currentIdx < 0)
    return currentIdx;
}

mtmTreeQuestion.prototype._freezeLevel = function(level) {
    // 
    var index = -1;
    for(var i=0;i<this.itemList.length;i++)
    {
        if(this.itemList[i].level == level)
        {
            index++;
            var elChildrenBus = this.itemList[i].elChildrenBus;
            if(this.origianlUUID == this.itemList[i].uuid)
                this.originalIndex = index;
            for(var j=i+1;j<this.itemList.length;j++)
            {
                if(this.itemList[j].level != level)
                {
                    elChildrenBus.appendChild(this.itemList[j].elThis);
                    this.itemList[j].setSortable(false);
                }
                else
                    break;
            }
        }
    }
}

mtmTreeQuestion.prototype._releaseLevel = function(level) {
    for(var i=0;i<this.itemList.length;i++)
    {
        if(this.itemList[i].level == level)
        {
            // var children = this.itemList[i].elChildrenBus.children;
            while(this.itemList[i].elChildrenBus.lastChild)
            {
                this.itemList[i].elThis.after(this.itemList[i].elChildrenBus.lastChild);
            }
        }
        this.itemList[i].setSortable(true);
    }
}

mtmTreeQuestion.prototype._changeItem = function(level) {
    
    var startIndex = -1;
    var endIndex = -1;

    // find startIndex , endIndex
    // drag item 과 그 children 
    // (sortable 의 index 와 무관한 itemList 의 index)
    for(var i=0;i<this.itemList.length;i++)
    {
    
        if((this.itemList[i].level == level) && (this.itemList[i].uuid == this.origianlUUID))
        {
            startIndex = i;

            // 마지막 item
            if((i+1) >= this.itemList.length)
                endIndex = i;
            // child 가 없다.
            else if((this.itemList[i+1].level <= level))
                endIndex = i;
            // child 가 있다.
            else
            {
                for(var j = startIndex+1; j < this.itemList.length; j++)
                {
                    if(this.itemList[j].level <= level)
                    {
                        endIndex = j-1;
                        break;
                    }
                }
            }
            // child 가 있고 마지막에 있는 item
            if(endIndex < 0)
                endIndex = this.itemList.length-1;
            break;
        }
    }

    // console.log("mtmTreeQuestion > _changeItem index : ",startIndex, " , 갯수 : ", endIndex - startIndex + 1);

    if(startIndex < 0 || endIndex < 0)
        return;

    // 옮겨야 할 item 들을 추출한다.
    var itemList = this.itemList.splice(startIndex, endIndex - startIndex + 1);
    // console.log("mtmTreeQuestion > _changeItem List : ", itemList);
    // itemList의 어디에다 놓아야 하는지 this.changeIndex 로 findIndex 를 찾음
    var destIndex = -1; // sortable 의 index
    var findIndex = -1; // itemList 의 index 

    for(var i=0;i<this.itemList.length;i++)
    {
        if(this.itemList[i].level <= level)
        {
            destIndex++;

            if(destIndex == this.changeIndex)
            {
                findIndex = i;
                break;
            }

        }
    }

    if(findIndex < 0)
        findIndex = this.itemList.length;

    // console.log('mtmTreeQuestion > _changeItem (itemList): ', findIndex , itemList );
    for(var i=0;i<itemList.length;i++)
    {
        this.itemList.splice(i+findIndex,0,itemList[i]);
    }

    console.log('mtmTreeQuestion > _changeItem (this.itemList) : ', this.itemList);
    
}
////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// Ajax ///////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Handler /////////////////////////////////////////
// DOM equivalent to jQuery `.detach()`?
// https://stackoverflow.com/questions/48626203/dom-equivalent-to-jquery-detach
mtmTreeQuestion.prototype.dragStartHandler = function(_,ui)
{
    this.originalLevel = Number(ui.item[0].getAttribute('data-level'));
    this.originalIndex = ui.item.index();
    this.origianlUUID = ui.item[0].getAttribute('data-id');
    
    (ui.placeholder[0]).classList.add('level-'+this.originalLevel);

    console.log('mtmTreeQuestion > dragStartHandler : start : ', this.originalLevel,
        this.originalIndex,this.origianlUUID);
    // return;

    if(this.originalLevel == 1)
    {
        this._freezeLevel(this.originalLevel);
        // ui.placeholder[0].style.height = '32px';
        $(this.elThis).sortable('refresh');
    }
    
    return;
}

mtmTreeQuestion.prototype.dragSortHandler = function(_,ui)
{
    // console.log('mtmTreeQuestion > dragSortHandler : start : ',ui);
    return;
    
}

mtmTreeQuestion.prototype.dragChangeHandler = function(_,ui)
{
    console.log('mtmTreeQuestion > dragChangeHandler ');
    return;
}

mtmTreeQuestion.prototype.dragStopHandler = function(_,ui)
{
    console.log('mtmTreeQuestion > dragStopHandler : ',this.originalIndex, ui.item.index());
    
    this.changeIndex = ui.item.index();

    if(this.originalLevel != 1)
    {
        if(ui.item.index() == 0)
        {
            $(this.elThis).sortable("cancel");
            return;     
        }
        if(this.originalIndex != this.changeIndex)
            this._changeItem(this.originalLevel);
    }
    else
    {
        if(this.originalIndex != this.changeIndex)
            this._changeItem(this.originalLevel);

        this._releaseLevel(this.originalLevel);
        $(this.elThis).sortable('refresh');
    }
    
    return;
    
}

mtmTreeQuestion.prototype.dragBeforeStop = function(event, ui) {
    // if(ui.placeholder.index() == 2) 
    console.log('mtmTreeQuestion > beforeStop : ', ui.placeholder.index());
    // return false;
}

// click or select ??
mtmTreeQuestion.prototype.onBranchClickHandler = function() {

}

// title ?
mtmTreeQuestion.prototype.onBranchChangeTitleHandler = function() {

}

// order ?
mtmTreeQuestion.prototype.onBranchChangeOrderHandler = function() {

}

////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Action Handler ////////////////////////////////////
mtmTreeQuestion.prototype.onAddHandler = function(clItem, uuid,index, actionIndex) {
    var currentIdx = -1;
    // console.log('mtmTreeQuestion > onAddHandler uuid:',uuid);
    for(var i=0;i<this.itemList.length;i++)
    {
        if(this.itemList[i].uuid ==  uuid)
        {
            currentIdx = i;
            break;
        }
    }

    if(currentIdx < 0)
        return;
    // console.log('mtmTreeQuestion > onAddHandler currentIdx :',currentIdx);
    // if(clItem.level)
    var action = {};
    var eventHandler = {};
    eventHandler.add = this.onAddHandler.bind(this);
    eventHandler.click = this.onClickHandler.bind(this);
    eventHandler.remove = this.onRemoveHandler.bind(this);

    action.edit = true;
    action.remove = true;
    action.add = true;
    var addItems = null;

    // 같은 레벨에 형제 Add
    if(actionIndex == -1)
    {
        var listItem = null;
        var data = {"id":'',"title":"제목 입력", "level": clItem.level, "type":0};
        var bAssign = false;
        if(clItem.level != 1)
            bAssign = true;

        listItem = new mtmListItem({ data: data,
                                        localIndex : i,
                                        eventHandler : eventHandler,
                                        action : action,
                                        addItems : addItems,
                                        assign : bAssign,
                                    });
        
        // listItem.setAction(false);
        
        this.itemList.splice(currentIdx+1, 0 ,listItem);
        // this.elThis.appendChild(listItem.elThis);
        this.elThis.children[currentIdx].after(listItem.elThis);
        
    }
    else
    {
        if(actionIndex == 0)    // 형제 Add
        {
            var findIdx = -1;
            var listItem = null;
            var data = {"id":'',"title":"제목 입력", "level": clItem.level, "type":0};
            
            // if(clItem.level == 1)
            addItems = ['형제','자식'];
                
            listItem = new mtmListItem({ data: data,
                                        localIndex : i,
                                        eventHandler : eventHandler,
                                        action : action,
                                        addItems : addItems,
                                    });

            for(var i=currentIdx + 1;i < this.itemList.length;i++)
            {
                if(clItem.level == this.itemList[i].level )
                {
                    findIdx = i-1;
                    break;
                }
                
            }

            if(findIdx < 0 )
                    findIdx = this.itemList.length - 1;

            this.itemList.splice(findIdx+1, 0 ,listItem);
            // this.elThis.appendChild(listItem.elThis);
            this.elThis.children[findIdx].after(listItem.elThis);
        }
        else    // 자식 Add 
        {
            var data = {"id":'',"title":"제목 입력", "level": clItem.level+1, "type":0};
            listItem = new mtmListItem({ data: data,
                                        localIndex : i,
                                        eventHandler : eventHandler,
                                        action : action,
                                        addItems : addItems,
                                    });
            this.itemList.splice(currentIdx+1, 0 ,listItem);
            // this.elThis.appendChild(listItem.elThis);
            this.elThis.children[currentIdx].after(listItem.elThis);
        }
    }
}

mtmTreeQuestion.prototype.onRemoveHandler = function(clItem, uuid,index) {
    var currentIdx = -1;
    // console.log('mtmTreeQuestion > onRemoveHandler uuid:',uuid);
    for(var i=0;i<this.itemList.length;i++)
    {
        if(this.itemList[i].uuid ==  uuid)
        {
            currentIdx = i;
            break;
        }
    }

    if(currentIdx < 0)
        return;
    
    var eEls = [];
    var eCls = [];

    eEls.push(this.elThis.children[currentIdx]);
    eCls.push(this.itemList[currentIdx]);
    if(clItem.level == 1)   // 자식들을 같이 지우자...
    {
        var findIdx = -1;
        for(var i = currentIdx+1;i<this.itemList.length;i++)
        {
            if(this.itemList[i].level == 2)
            {
                findIdx = i;
                eEls.push(this.elThis.children[i]);
                eCls.push(this.itemList[i]);
            }
            else
                break;
        }

        if(findIdx < 0)
        {
            this.itemList.splice(currentIdx, 1 );
            // this.elThis.appendChild(listItem.elThis);
            this.elThis.children[currentIdx].remove();
        }
        else
        {
            this.itemList.splice(currentIdx,findIdx-currentIdx+1);
            for(var i =0 ;i<eEls.length;i++)
                eEls[i].remove();
        }
        
    }
    else
    {
        // 
        this.itemList.splice(currentIdx, 1 );
            // this.elThis.appendChild(listItem.elThis);
        this.elThis.children[currentIdx].remove();
    }

    // console.log('mtmTreeQuestion > onRemoveHandler :', this.itemList, 
    //     this.elThis.children);

    if(this.elThis.children.length == 0) // 하나는 남겨 놔야 하지 않을까?
    {
        ;//   
    }
}

mtmTreeQuestion.prototype.onToggleHandler = function(clItem, uuid,index,checked) {
    // console.log('mtmTreeQuestion > onToggleHandler');
    var currentIdx = this._findIndex(uuid)
    
    if(currentIdx < 0)
        return;

    if(clItem.level == 1 && this.bAssignToggle)
    {
        // console.log('mtmTreeQuestion > onToggleHandler : ', currentIdx);
        
        for(var i=currentIdx+1;i<this.itemList.length;i++)
        {   
            if(this.itemList[i].level == 2)
            {
                this.itemList[i].setToggle(checked);
            }
            else
                break;
        }
    }
}

mtmTreeQuestion.prototype.onClickHandler = function(clItem, uuid,index) {
    var currentIdx = this._findIndex(uuid)
    // console.log('mtmTreeQuestion > onClickHandler level :',clItem.level);
    
    if(currentIdx < 0)
        return;

    // if(this.itemList.length <= currentIdx + 1)
    //     return;

    var elChildren = [];
    for(var i=currentIdx+1;i<this.itemList.length;i++)
    {   
        if(this.itemList[i].level == 2)
        {
            elChildren.push(this.itemList[i].elThis);
        }
        else
            break;
    }

    // if(elChildren.length <= 0)
    //     return;

    if(clItem.level == 1)
    {
        if(clItem.elInputCheck.checked)
        {
            // hide / collapse
            for(var i=0;i<elChildren.length;i++)
            {
                $(elChildren[i]).slideUp();
            }
            clItem.elInputCheck.checked = false;
        }
        else
        {
            // hide / collapse
            for(var i=0;i<elChildren.length;i++)
            {
                $(elChildren[i]).slideDown();
            }
            clItem.elInputCheck.checked = true;
        }
    }
    else // 
    {
        // console.log('mtmTreeQuestion > onClickHandler idx :',currentIdx);
        for(var i=0;i<this.itemList.length;i++)
        {
            if(i==currentIdx)
                this.itemList[i].setSelect(true);
            else
                this.itemList[i].setSelect(false);
        }
        
        // 여기서 Question 을 불러와야 한다.
        var level = clItem.level;
        if(this.options && this.options.eventClick)
        {
            // var data = {};
            // data.value = [];
            var title = [];
            title.push(clItem.value);
            for(var i=currentIdx-1;i>=0;i--)
            {
                if(this.itemList[i].level < level)
                {
                    title.push(this.itemList[i].value);
                    level--;
                    if(level == 1)
                        break;
                }
            }

            this.options.eventClick(uuid,title);
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// API ///////////////////////////////////////////
mtmTreeQuestion.prototype.show = function(bShow)
{
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}

mtmTreeQuestion.prototype.setActionable = function(bActionable)
{
    this.bActionable = bActionable;

    for(var i=0;i<this.itemList.length;i++)
        this.itemList[i].setAction(bActionable);
    // {
        // this.itemList[i].setAction(bActionable);
    // }
}

mtmTreeQuestion.prototype.setAssignable = function(bAssign)
{
    this.bAssign = bAssign;

    for(var i=0;i<this.itemList.length;i++)
        this.itemList[i].setAssign(bAssign);
}

mtmTreeQuestion.prototype.setAssignToggle = function(bAssignToggle)
{
    this.bAssignToggle = bAssignToggle;

    for(var i=0;i<this.itemList.length;i++)
        this.itemList[i].setAssignToggle(bAssignToggle);
}

mtmTreeQuestion.prototype.setTreeList = function(treeList)
{
    // delete previous 
    for(var i=0;i<this.itemList.length;i++)
    {
        this.itemList[i].elThis.remove();
        delete this.itemList[i];
    }

    this.itemList = [];

    this.options.treeList = treeList;
    this._setTreeList();

}
