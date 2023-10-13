// https://github.com/ahamed/treeSortable

// CodePen Home
// SlideToggle / SlideUp / SlideDown - JavaScript (Vanilla)
// https://codepen.io/ivanwebstudio/pen/OJVzPBL

import {mtmListItem} from './mtm-list-item.js';
import {mtvInputDate} from '../input/mtv-input-date.js';
import {mtmInputDate} from '../input/mtm-input-date.js';
import {mtmInputDateInline} from '../input/mtm-input-date-inline.js';
import {mtvInputToggle} from '../input/mtv-input-toggle.js';
import {mtmInputToggle} from '../input/mtm-input-toggle.js';
import {mtvInputToggleSwitch} from '../input/mtv-input-toggle-switch.js';

export var mtmTreeCourse = function(options)
{
    this.id = 'id-mtm-tree-course-' + mtmTreeCourse.id++;
    
    this.elThis = null;
    this.options = options;
    
    this.elSelectedBranch = null;
    this._init();
    
}

mtmTreeCourse.id = 0;
// DB 에서는 첫 Branch Level == 0 이다.
// result.append({"id" : branch.id ,"title" : branch.title, "level" : level+1, 'fixed':1,'type':branch.type ,})
    // result.append({"id" : branch.id ,"title" : branch.title, "level" : branch.level+1, 'fixed':1, 'type':branch.type ,})
         
mtmTreeCourse.testData = [
    {"id":'',"title":"01 Chapter ", "level": 1, "type":0},
        {"id":'',"title":"01 레슨 01 ", "level": 2, "type":12},
    {"id":'',"title":"02 Chapter ", "level": 1, "type":0},
        {"id":'',"title":"01 레슨 02 ", "level": 2, "type":12},
        {"id":'',"title":"02 테스텀 02 ", "level": 2, "type":11},
    {"id":'',"title":"03 Chapter ", "level": 1, "type":0},
        {"id":'',"title":"01 레슨 03 ", "level": 2, "type":12},
        {"id":'',"title":"02 테스텀 03 ", "level": 2, "type":11},
        {"id":'',"title":"03 레슨 03 ", "level": 2, "type":12},
    {"id":'',"title":"04 Chapter ", "level": 1, "type":0},
        {"id":'',"title":"01 레슨 04 ", "level": 2, "type":12},
        {"id":'',"title":"02 테스텀 04 ", "level": 2, "type":11},
        {"id":'',"title":"03 레슨 04 ", "level": 2, "type":12},
        {"id":'',"title":"04 테스텀 04 ", "level": 2, "type":11},
];

mtmTreeCourse.options = {
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

mtmTreeCourse.prototype._addInputDate = function() 
{
    var options = {};
    options.title = "시작일";
    options.width = "50%";
    options.size = 'small';
    options.shape = 'round';
    // var inputDate = new mtvInputDate(item);
    var clInputDate = new mtmInputDate(options);
    var clInputDateInline = new mtmInputDateInline(options);
    var clInputToggle = new mtmInputToggle(options);


    // var clInputToggleSw = new mtvInputToggleSwitch(options);

    // this.elThis.appendChild(clInputDate.elThis);
    // this.elThis.appendChild(clInputDateInline.elThis);
    // this.elThis.appendChild(clInputToggle.elThis);


    // this.elThis.appendChild(clInputToggleSw.elThis);
    
}

mtmTreeCourse.prototype._addTreeItem = function(item) 
{
    var listItem = new mtmListItem(item);
    this.elWrapper.appendChild(listItem.elThis);
}

mtmTreeCourse.prototype._setTreeList = function() {
    if(!this.options || !this.options.treeList)
        return;
    var action = {};
    var eventHandler = {};
    eventHandler.add = this.onAddHandler.bind(this);
    eventHandler.click = this.onClickHandler.bind(this);
    eventHandler.remove = this.onRemoveHandler.bind(this);
    
    action.edit = true;
    action.remove = true;
    action.add = true;
    var addItemsLevel1 = ['챕터','레슨','테스트'];
    var addIndicesLevel1 = [0,1,2];

    var addItemsLevel2 = ['레슨','테스트'];
    var addIndicesLevel2 = [1,2];

    // action = action;
    this.itemList = [];
    for(var i=0;i<this.options.treeList.length;i++)
    {
        var listItem = null;
        // Todo. Jstar : Level 1,2 를 합칠 수 없을까?
        if(this.options.treeList[i].level == 1)
            listItem = new mtmListItem({ data: this.options.treeList[i],
                                        localIndex : i,
                                        eventHandler : eventHandler,
                                        action : action,
                                        addItems : addItemsLevel1,
                                        addIndices : addIndicesLevel1,
                                    });
        else
            listItem = new mtmListItem({ data: this.options.treeList[i],
                                        localIndex : i,
                                        eventHandler : eventHandler,
                                        action : action,
                                        addItems : addItemsLevel2,
                                        addIndices : addIndicesLevel2,
                                    });

        // listItem.setAction(false);
        
        if( (this.options.treeList[i].level == 1) && (this.options.treeList.length - 1 > i+1))
        {
            if(this.options.treeList[i+1].level == 2)
                listItem.setExpandable(true);    
        }
        else if(this.options.treeList[i].level == 2)
            listItem.show(false);    

        listItem.setLocalIndex(i);
        this.itemList.push(listItem);
        this.elWrapper.appendChild(listItem.elThis);
    }
}

mtmTreeCourse.prototype._init = function() {
    this.elThis = document.createElement('div');
    this.elThis.classList.add('mtm-tree-course');
    this.elThis.setAttribute('id',this.id);
    
    if(this.options && this.options.classList)
    {
        for(var i=0;i<this.options.classList.length;i++)
            this.elThis.classList.add(this.options.classList[i]);
    }

    this.elWrapper = document.createElement('div');
    // this.elWrapper.style.minHeight = '300px';
    // this.elWrapper.style.maxHeight = '300px';
    this.elWrapper.style.height = '300px';
    this.elWrapper.style.overflowY = 'scroll';
    this.elThis.append(this.elWrapper);

    // this._addInputDate();
    // for test
    this.options.treeList = []; // mtmTreeCourse.testData;
    this._setTreeList();

    // placeholder 가 height 를 가지면, item 을 freeze 하면,
    // index 의 change 가 너무 많이 불리고, index 는 1 부터 시작한다. 
    // 
    $(this.elWrapper).sortable({
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
        // beforeStop : this.beforeStop.bind(this),
    });
    $(this.elWrapper).disableSelection();

    this.fixLowLevel = false;
}

mtmTreeCourse.prototype._fixLowLevel = function() {
    this.fixLowLevel = true;
    for(var i=0;i<this.itemList.length;i++)
    {
        if(this.itemList[i].level > 1)
            this.itemList[i].setSortable(false);
            // this.itemList[i].show(false);
    }

    $(this.elWrapper).sortable("refresh");
    
} 

mtmTreeCourse.prototype._releaseLowLevel = function() {
    this.fixLowLevel = false;
    for(var i=0;i<this.itemList.length;i++)
    {
        if(this.itemList[i].level > 1)
            this.itemList[i].setSortable(true);
            // this.itemList[i].show(true);
    }

    $(this.elWrapper).sortable("refresh");

}

mtmTreeCourse.prototype._findIndex = function(uuid) {
    var currentIdx = -1;
    // console.log('mtmTreeCourse > onRemoveHandler uuid:',uuid);
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

mtmTreeCourse.prototype._freezeLevel = function(level) {
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

mtmTreeCourse.prototype._releaseLevel = function(level) {
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

mtmTreeCourse.prototype._changeItem = function(level) {
    
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

    // console.log("mtmTreeCourse > _changeItem index : ",startIndex, " , 갯수 : ", endIndex - startIndex + 1);

    if(startIndex < 0 || endIndex < 0)
        return;

    // 옮겨야 할 item 들을 추출한다.
    var itemList = this.itemList.splice(startIndex, endIndex - startIndex + 1);
    // console.log("mtmTreeCourse > _changeItem List : ", itemList);
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

    // console.log('mtmTreeCourse > _changeItem (itemList): ', findIndex , itemList );
    for(var i=0;i<itemList.length;i++)
    {
        this.itemList.splice(i+findIndex,0,itemList[i]);
    }

    console.log('mtmTreeCourse > _changeItem (this.itemList) : ', this.itemList);
    
}
////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// Ajax ///////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Handler /////////////////////////////////////////
// DOM equivalent to jQuery `.detach()`?
// https://stackoverflow.com/questions/48626203/dom-equivalent-to-jquery-detach
mtmTreeCourse.prototype.dragStartHandler = function(_,ui)
{
    this.originalLevel = Number(ui.item[0].getAttribute('data-level'));
    this.originalIndex = ui.item.index();
    this.origianlUUID = ui.item[0].getAttribute('data-id');
    
    (ui.placeholder[0]).classList.add('level-'+this.originalLevel);

    console.log('mtmTreeCourse > dragStartHandler : start : ', this.originalLevel,
        this.originalIndex,this.origianlUUID);
    // return;

    if(this.originalLevel == 1)
    {
        this._freezeLevel(this.originalLevel);
        // ui.placeholder[0].style.height = '32px';
        $(this.elWrapper).sortable('refresh');
    }
    // if(ui.item[0].getAttribute('data-level') == '1')
    // {
    //     // fixed data level 2
    //     this._fixLowLevel();
    // }
    return;
    
    // Keep Upper Item when start
    this.$startUpperItem = ui.item.prev();

    // for Server Side DB Operation
    this._moveItemId = ui.item.attr('data-id');
    this.$_startPrevItem = ui.item.prev();
    this._startPrevItemId = this.$_startPrevItem.attr('data-id');
    this.$_startUpperItem = this.$_startPrevItem;
    this._startUpperItemId = null;
    this._startUpperItemLevel = 0;
    while(this.$_startUpperItem)
    {
        this._startUpperItemId = this.$_startUpperItem.attr('data-id');
        this._startUpperItemLevel = this.$_startUpperItem.attr('data-level');
        if(this._startUpperItemLevel==1)
        {
            console.log('mtmCourseTree > startHandler : id, level',this._startUpperItemId,this._startUpperItemLevel);
            break;
        }
        
        this.$_startUpperItem = this.$_startUpperItem.prev();
        // 
    }
    
    // console.log('mtmCourseTree > startHandler : upper item ', this.$startUpperItem);
    // console.log('mtmCourseTree > startHandler : item ', ui.item);

    // Synchronize the placeholder level with the item's level.
    var level = this._getBranchLevel(ui.item);
    this.currentLevel = level;
    // if(this.currentLevel <= 1)
    //     return false;
    // console.log('ui.placeholder : ', ui.placeholder);
    this._updateBranchLevel(ui.placeholder,level);

    // get drag start item index relative to it's sibling
    this.originalIndex = ui.item.index();
    //  Store the original level.
    this.originalLevel = level;

    // Fill the children bus with the children.
    this.$childrenBus = ui.item.find(mtmCourseTree.options.childrenBusSelector);
    this.$childrenBus.append(this._getChildren(ui.item.next()));
    
    // console.log('children-Bus', childrenBus);
    
    // Calculate the placeholder width & height according to the
    // helper's width & height respectively.
    var height = this.$childrenBus.outerHeight();
    var placeholderMarginTop = ui.placeholder.css('margin-top');

    height += height > 0 ? this._pxToNumber(placeholderMarginTop) : 0;
    height += ui.helper.outerHeight();
    this.helperHeight = height;
    height -= 2;

    var width =
        // jstar modify
        // ui.helper.find(dragHandlerSelector).outerWidth() - 2;
        ui.helper.find('.course-branch-drag-handler').outerWidth() - 2;
    
    ui.placeholder.css({ height, width });

    var tmp = this._nextBranch(ui.placeholder);
    tmp.css('margin-top', this._numberToPx(this.helperHeight));
    ui.placeholder.detach();

    // 여기서도 문제가...
    // $(this.$id).sortable('refresh');
    
    ui.item.after(ui.placeholder);
    tmp.css('margin-top', 0);

    // Set the current level by the initial item's level.
    // this.currentLevel = level;

    // console.log('startHandler : end');
    console.log('mtmTreeCourse > dragStartHandler : end');
}

mtmTreeCourse.prototype.dragSortHandler = function(_,ui)
{
    // console.log('mtmTreeCourse > dragSortHandler : start : ',ui);
    return;
    // const { options, getTreeEdge } = treeSortable;
    // const { depth, maxLevel } = options;
    // var self = this;
    // console.log('sortHandler start');
    
    var depth = 0;
    // if(this.currentLevel <=1)
    //     return;

    if(this.options && this.options.depth)
        depth = this.options.depth;
    else
        depth = mtmCourseTree.options.depth;
        
    var treeEdge = this._getTreeEdge();
    var offset = ui.helper.offset();
    var currentBranchEdge = offset.left;
    var lowerBound = 1;
    var upperBound = mtmCourseTree.options.maxLevel;

    // Calculate the upper bound. The upper bound would be,
    // the minimum value between the
    // (previous branch level + 1) and the maxLevel.
    var prevBranch = this._prevBranch(ui.placeholder);
    prevBranch =
        prevBranch[0] === ui.item[0]
            ? this._prevBranch(prevBranch)
            : prevBranch;

    var prevBranchLevel = this._getBranchLevel(prevBranch);
    upperBound = Math.min(prevBranchLevel + 1, mtmCourseTree.options.maxLevel);

    // jstar fix
    // 움직이는 아이템을 Level 2로 고정한다.
    lowerBound = 2;
    upperBound = 2;

    // Calculate the lower bound. The lower bound would be,
    // the maximum value between the
    // Next Sibling Level and 1
    var nextSibling = this._nextSibling(ui.placeholder);
    var placeholderLevel = 1;

    if (nextSibling.length) {
        placeholderLevel = this._getBranchLevel(ui.placeholder) || 1;
    } else {
        // If no sibling found then
        // the placeholder level would be the next branch's level.
        var nextBranch = this._nextBranch(ui.placeholder);
        placeholderLevel = this._getBranchLevel(nextBranch) || 1;
    }

    lowerBound = Math.max(1, placeholderLevel);

    // Calculate the position which is the current helper offset left
    // minus the tree parent's offset left.
    // Find the changed level by dividing the position by depth value.
    // 
    // The final valid changed level would be a value
    // between upper and lower bound inclusive.
    var position = Math.max(0, currentBranchEdge - treeEdge);
    var newLevel = Math.floor(position / depth) + 1;
    newLevel = Math.max(lowerBound, Math.min(newLevel, upperBound));

    if (this.canSwapItems(ui)) {
        var nextBranch = this._nextBranch(ui.placeholder);

        if (this._getChildren(nextBranch).length) {
            newLevel = this._getBranchLevel(nextBranch) + 1;
        }

        nextBranch.after(ui.placeholder);
        // 여기서 뭔가 문제가 있네...
        // $(this.$id).sortable('refreshPositions');
    }

    // Update the placeholder position by the changed level.
    this.updatePlaceholder(ui.placeholder, newLevel);

    console.log('mtmTreeCourse > dragSortHandler : end');
    
}

mtmTreeCourse.prototype.dragChangeHandler = function(_,ui)
{
    // var index = ui.placeholder.index();
    // if(this.originalIndex != index)
    //     console.log('mtmTreeCourse > dragChangeHandler : start : ', this.originalIndex, index);
    // if(ui.placeholder.index() == 2) 
        // ui.placeholder.addClass('invalid-position');
    // else ui.placeholder.removeClass('invalid-position');
    return;
    // console.log('changeHandler start');
    // if(this.currentLevel <=1)
    //     return;
    var prevBranch = this._prevBranch(ui.placeholder);

    prevBranch =
        prevBranch[0] === ui.item[0]
            ? this._prevBranch(prevBranch)
            : prevBranch;

    
    // After changing branches bound the placeholder to the
    // changed boundary.

    var prevBranchLevel = this._getBranchLevel(prevBranch) || 1;

    if (prevBranch.length) {
        ui.placeholder.detach();
        let children = this._getChildren(prevBranch);
        if (children && children.length) 
            prevBranchLevel += 1;
        this._updateBranchLevel(ui.placeholder,prevBranchLevel);
        prevBranch.after(ui.placeholder);
    }
    // console.log('changeHandler end');
    
    console.log('mtmTreeCourse > dragChangeHandler : end');
}

mtmTreeCourse.prototype.dragStopHandler = function(_,ui)
{
    // return;
    console.log('mtmTreeCourse > dragStopHandler : start : ',this.originalIndex, ui.item.index());
    // console.log('mtmTreeCourse > dragStopHandler : start : ', ui.placeholder.index());
    // $(this.elThis).sortable("cancel");
    this.changeIndex = ui.item.index();

    if(this.originalLevel != 1)
    {
        if(ui.item.index() == 0)
        {
            $(this.elWrapper).sortable("cancel");
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
        $(this.elWrapper).sortable('refresh');
    }
    // if(ui.item[0].getAttribute('data-level') == '1')
    // {
    //     // fixed data level 2
    //     this._releaseLowLevel();
    // }
    // return;
    return;
    // Place the children after the sorted item,
    // and clear the children bus.
    // if(this.currentLevel <=1)
    //     return;

    var children = this.$childrenBus.children().insertAfter(ui.item);
    this.$childrenBus.empty();

    // Update the item by currently changed level.
    this._updateBranchLevel(ui.item,this.currentLevel);
    this._shiftBranchLevel(children,this.currentLevel - this.originalLevel);

    // update check status of upper item when stop
    var upper = ui.item.prev();
    if(upper)
    {
        // console.log('upper');
        if(this._getBranchLevel(upper) < this._getBranchLevel(ui.item))
        {
            upper.find('.branch-expand').addClass('branch-parent');
            upper.find('input[type=checkbox]').prop('checked',true);
        }
    }
    // update check status of upper item when start
    if(this.$startUpperItem)
    {
        var next = this.$startUpperItem.next();
        if(next)
        {
            if(this._getBranchLevel(next) <= this._getBranchLevel(this.$startUpperItem))
            {
                this.$startUpperItem.find('.branch-expand').removeClass('branch-parent');
                this.$startUpperItem.find('input[type=checkbox]').prop('checked',false);
            }
        }
    }

    this.$startUpperItem = null;

    if (
        this.currentLevel !== this.originalLevel ||
        this.originalIndex !== ui.item.index()
    ) {
        $(document).trigger('sortCompleted', [ui]);
    }

    // for Server Side DB Operation
    this.$_stopPrevItem = ui.item.prev();
    this._stopPrevItemId = this.$_stopPrevItem.attr('data-id')
    this.$_stopUpperItem = this.$_stopPrevItem;
    this._stopUpperItemId = null;
    this._stopUpperItemLevel = 0;
    while(this.$_stopUpperItem)
    {
        this._stopUpperItemId = this.$_stopUpperItem.attr('data-id');
        this._stopUpperItemLevel = this.$_stopUpperItem.attr('data-level');
        if(this._stopUpperItemLevel==1)
        {
            console.log('mtmCourseTree > stopHandler : id, level',this._stopUpperItemId,this._stopUpperItemLevel);
            break;
        }
        
        this.$_stopUpperItem = this.$_stopUpperItem.prev();
        // 
    }

    if(this._startPrevItemId != this._stopPrevItemId)
        setTimeout(this._reorderContentHandler.bind(this),0);
    // console.log('stopHandler end');
    console.log('mtmTreeCourse > dragStopHandler : end');
    
}

mtmTreeCourse.prototype.beforeStop = function(event, ui) {
    // if(ui.placeholder.index() == 2) 
    console.log('mtmTreeCourse > beforeStop : ', ui.placeholder.index());
    // return false;
}

// click or select ??
mtmTreeCourse.prototype.onBranchClickHandler = function() {

}

// title ?
mtmTreeCourse.prototype.onBranchChangeTitleHandler = function() {

}

// order ?
mtmTreeCourse.prototype.onBranchChangeOrderHandler = function() {

}

mtmTreeCourse.prototype.onAddHandler = function(clItem, uuid,index, actionIndex) {
    var currentIdx = -1;
    // console.log('mtmTreeCourse > onAddHandler uuid:',uuid);
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
    // console.log('mtmTreeCourse > onAddHandler currentIdx :',currentIdx);
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
        // if(clItem.level != 1)
        //     bAssign = true;

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
        this.elWrapper.children[currentIdx].after(listItem.elThis);
        
    }
    else
    {
        if(actionIndex == 0)    // 형제 Add
        {
            var findIdx = -1;
            var listItem = null;
            var data = {"id":'',"title":"제목 입력", "level": clItem.level, "type":0};
            
            // if(clItem.level == 1)
            addItems = ['챕터','레슨','테스트'];
                
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
            this.elWrapper.children[findIdx].after(listItem.elThis);
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
            // this.elWrapper.appendChild(listItem.elThis);
            this.elWrapper.children[currentIdx].after(listItem.elThis);
        }
    }
}

mtmTreeCourse.prototype.onRemoveHandler = function(clItem, uuid,index) {
    var currentIdx = -1;
    // console.log('mtmTreeCourse > onRemoveHandler uuid:',uuid);
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

    eEls.push(this.elWrapper.children[currentIdx]);
    eCls.push(this.itemList[currentIdx]);
    if(clItem.level == 1)   // 자식들을 같이 지우자...
    {
        var findIdx = -1;
        for(var i = currentIdx+1;i<this.itemList.length;i++)
        {
            if(this.itemList[i].level == 2)
            {
                findIdx = i;
                eEls.push(this.elWrapper.children[i]);
                eCls.push(this.itemList[i]);
            }
            else
                break;
        }

        if(findIdx < 0)
        {
            this.itemList.splice(currentIdx, 1 );
            // this.elWrapper.appendChild(listItem.elThis);
            this.elWrapper.children[currentIdx].remove();
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
            // this.elWrapper.appendChild(listItem.elThis);
        this.elWrapper.children[currentIdx].remove();
    }

    // console.log('mtmTreeCourse > onRemoveHandler :', this.itemList, 
    //     this.elWrapper.children);

    if(this.elWrapper.children.length == 0) // 하나는 남겨 놔야 하지 않을까?
    {
        ;//   
    }
}

mtmTreeCourse.prototype.onClickHandler = function(clItem, uuid,index) {
    var currentIdx = this._findIndex(uuid)

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
        // console.log('mtmTreeCourse > onClickHandler idx :',currentIdx);
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

            var eData = {};
            eData.id = uuid;
            eData.title = title;
            eData.type = clItem.type;
            // this.options.eventClick(uuid,title,clItem.type);
            this.options.eventClick(eData);
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////// API ///////////////////////////////////////////
mtmTreeCourse.prototype.show = function(bShow)
{
    if(bShow)
        this.elThis.style.display = '';
    else
        this.elThis.style.display = 'none';
}


mtmTreeCourse.prototype.setActionable = function(bActionable)
{
    this.bActionable = bActionable;

    for(var i=0;i<this.itemList.length;i++)
        this.itemList[i].setAction(bActionable);
    // {
        // this.itemList[i].setAction(bActionable);
    // }
}

mtmTreeCourse.prototype.setAssignable = function(bAssign)
{
    this.bAssign = bAssign;

    for(var i=0;i<this.itemList.length;i++)
        this.itemList[i].setAssign(bAssign);
}

mtmTreeCourse.prototype.setAssignToggle = function(bAssignToggle)
{
    this.bAssignToggle = bAssignToggle;

    for(var i=0;i<this.itemList.length;i++)
        this.itemList[i].setAssignToggle(bAssignToggle);
}

mtmTreeCourse.prototype.setTreeList = function(treeList)
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
