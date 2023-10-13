// mtm-list-item 

// jConfirm - Confirmation Tooltip
// https://htmlguyllc.github.io/jConfirm/


// book item
// course item
// ....

// level
// type(icon) + text (title) + ... + badge (number) + action(add + erase)

// options.level
// options.type
// options.title 
// options.badge = [children number]
// options.action = [add child, add brother, erase]
// options.attribute = [on/off date]

// options.action = { remove : true / false / null 
//                      add : [],
//                      }
import {mtmInputToggle} from '../input/mtm-input-toggle.js';
import {mtmInputDateInline} from '../input/mtm-input-date-inline.js';
require('../../../../css/mtv/core/navi/mtm-list-item.css');

// .contents .branch {
    // line-height : 2.4; 
// }
export var mtmTreeItem = function(options) {
    this.id = 'mtm-tree-item-' + mtmTreeItem.id++;
    this.options = options;
    // console.log('mtmTreeItem : ', this.options);
    // if(!this.options)
    this.elThis = null;

    this._init();
}

mtmTreeItem.id = 0;
mtmTreeItem.minType = 11;
mtmTreeItem.contents = [
    { type : 11, kind : 'testum',},
    { type : 12, kind : 'lesson',},
];

mtmTreeItem.prototype._renderLatex = function(el)
{
    renderMathInElement(el,
        {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false},
                {left: "\\(", right: "\\)", display: false},
                {left: "\\[", right: "\\]", display: true}
            ],
            throwOnError : false
        } 
    );
}

// add Type Icon
mtmTreeItem.prototype._addTypeIcon = function(type)
{
    var elTypeIcon = null;
    
    if(type >= mtmTreeItem.minType) 
    {
        elTypeIcon = document.createElement('i');
        if(type == 11)
            elTypeIcon.classList.add("fa", "fa-file-text-o");
        else if(type == 12)
            elTypeIcon.classList.add("fa", "fa-file-video-o");
        else if(type == 13)
            elTypeIcon.classList.add("fa", "fa-file-image-o");
    }

    return elTypeIcon;
}

mtmTreeItem.prototype._addInputText = function(type)
{
    var elInputText = document.createElement('input');
    elInputText.setAttribute("type","text");
    elInputText.setAttribute("readonly",true);
    elInputText.setAttribute("placeholder","제목을 입력하세요");
    
    this.elInputText = elInputText;

    if(type >= mtmTreeItem.minType)
    {
        if(type == 11)
            elInputText.setAttribute("placeholder","테스트 제목을 입력하세요.");
        else if(type == 12)
            elInputText.setAttribute("placeholder","레슨 제목을 입력하세요.");
        else if(type == 13)
            elInputText.setAttribute("placeholder","블로그 제목을 입력하세요.");

        elInputText.setAttribute('data-type',type);
        elInputText.setAttribute('data-id',id);
    }

    elInputText.addEventListener("keydown",this.onValueKeydownHandler.bind(this));
    elInputText.addEventListener("blur",this.onValueBlurHandler.bind(this));

    return elInputText;
}

// add Action Remove Icons
mtmTreeItem.prototype._addActionEdit = function()
{
    if(!this.options || !this.options.action || !this.options.action.edit)
        return null;
    
    var self = this;
    var elActionEdit = document.createElement('i');
    elActionEdit.classList.add("fa","fa-pencil");
    elActionEdit.addEventListener('click',this.onEditClickHandler.bind(this));
    return elActionEdit;
}   

// add Action Remove Icons
mtmTreeItem.prototype._addActionRemove = function()
{
    if(!this.options || !this.options.action || !this.options.action.remove)
        return null;
    
    var self = this;
    var elActionTrash = document.createElement('i');
    elActionTrash.classList.add("fa","fa-trash");
    $(elActionTrash).jConfirm({
        question : '삭제 할까요?',
        size: 'tiny',
        theme: 'white',
        position: 'top',
        hide_on_click: true,
    }).on('confirm', 
        function(e){
            self.onRemoveClickHandler.call(self, e, self.id);
        }
    );

    return elActionTrash;
}   

// add Action Add Icons
mtmTreeItem.prototype._addActionAdd = function()
{
    if(!this.options || !this.options.action || !this.options.action.add)
        return null;
    
    var self = this;
    var elActionAdd = document.createElement('i');
    elActionAdd.classList.add("fa","fa-plus");
    
    var btns = [];
    if(this.options.addItems)
    {
        for(var i=0;i < this.options.addItems.length ;i++)
        {
            var btn = {
                    text:   this.options.addItems[i],
                    event: 'add-create',
                    data: {
                        id: this.id,
                        index : i
                    },
            }
            btns.push(btn);
        }
        

        $(elActionAdd).jConfirm({
            question: '',
            size: 'tiny',
            theme: 'white',
            position: 'top',
            btns: btns,
        }).on('add-create',this.onAddClickHandler.bind(this));
    }
    else
    {
        elActionAdd.addEventListener('click', this.onAddClickHandler.bind(this));
    }
    

    return elActionAdd;
}

mtmTreeItem.prototype._addAction = function(actionList)
{

    var elAction = document.createElement('div');
    elAction.classList.add("action-edit-list");
    
    // edit, remove , add [sibling , child]
    var elEdit = this._addActionEdit();
    if(elEdit)
        elAction.appendChild(elEdit);
    
    var elRemove = this._addActionRemove();
    if(elRemove)
        elAction.appendChild(elRemove);
    
    var elAdd = this._addActionAdd();
    if(elAdd)
        elAction.appendChild(elAdd);

    return elAction;
}

mtmTreeItem.prototype._addAssign = function () {
    var optionsToggle = {};
    optionsToggle.size = 'small';
    optionsToggle.shape = 'round';

    var elAssign = document.createElement('div');
    elAssign.classList.add("assign-list", "px-2");
    this.clAssignToggle = new mtmInputToggle(optionsToggle);
    this.clAssignStartDate = new mtmInputDateInline({});
    this.clAssignEndDate = new mtmInputDateInline({});
    elAssign.appendChild(this.clAssignToggle.elThis);
    elAssign.appendChild(this.clAssignStartDate.elThis);
    elAssign.appendChild(this.clAssignEndDate.elThis);
    
    return elAssign;
}
//
// elItem
//  +-- elContent
//  |   +-- elBranch
//  |       +-- elDragHandle
//  |       +-- elInputCheck
//  |       +-- elTypeIcon (option)
//  |       +-- elLabel
//  |       +-- elInputText
//  |       +-- elAction
//  |           +-- elActionEdit
//  |           +-- elActionAdd
//  |           +-- elActionTrash
//  +-- elChildrenBus
// 
mtmTreeItem.prototype._init = function() {
    var data = this.options.data;
    this.level = data.level;
    this.type = data.type;
    this.value = data.title;
    this.uuid = data.id;
    this.assign = this.options.assign;
    
    this.localIndex = this.options.localIndex;

    if(!this.level)
        this.level = 0;

    if(!this.type)
        this.type = 0;

    if(!this.value)
        this.value = '제목을 입력하세요';

    if(!this.uuid)
        this.uuid =  this.id + '-item';

    if(!this.localIndex)
        this.localIndex = 0;

    var elItem = document.createElement('li');
    elItem.classList.add("mtm-list-item","level-"+ this.level);
    elItem.setAttribute('style','padding:1px 0px');
    elItem.setAttribute('data-id',this.uuid);
    elItem.setAttribute('data-type',this.type);
    elItem.setAttribute('data-level',this.level);

    // Sortable or draggable 안되는 Level 설정
    // if(this.type < 10)
    //     elItem.classList.add("state-disabled");
    
    var elContent = document.createElement('div');
    elContent.classList.add("contents");

    var elBranch = document.createElement('div');
    elBranch.classList.add("branch");
    

    var elDragHandle = document.createElement('div');
    this.elDragHandle = elDragHandle;
    this.elDragHandle.classList.add("drag-handle");
    this.elDragHandle.classList.add("drag-handler");
    
    // elDivHandle.classList.add("ui-sortable-handle");

    var elInputCheck = document.createElement('input');
    this.elInputCheck = elInputCheck;
    this.elInputCheck.setAttribute("type","checkbox");

    // elLabel
    var elLabel = document.createElement('label');
    this.elLabel = elLabel;
    elLabel.classList.add("item-label",'my-auto');
    elLabel.addEventListener("click",this.onExpandClickHandler.bind(this));
    
    elLabel.setAttribute('data-type',this.type);
    elLabel.setAttribute('data-id',this.uuid);
    elLabel.setAttribute('data-level',this.level);
    elLabel.setAttribute('data-value',this.value);
    // elLabel.setAttribute('style','height:auto;padding-top:1px');

    elLabel.innerHTML = this.value;
    this._renderLatex(elLabel);
    
    var elTypeIcon = this._addTypeIcon(this.type);
    var elInputText = this._addInputText(this.type);
    // if(this.action)
    this.elAction = this._addAction();
    if(this.assign)
        this.elAssign = this._addAssign();

    var elChildrenBus = document.createElement('div');
    this.elChildrenBus = elChildrenBus;
    this.elChildrenBus.classList.add("children-bus");

    elItem.appendChild(elContent);
    
    elContent.appendChild(elBranch);
    elBranch.appendChild(elDragHandle);
    elBranch.appendChild(elInputCheck);

    if(elTypeIcon)
        elBranch.appendChild(elTypeIcon);
        
    elBranch.appendChild(elLabel);
    elBranch.appendChild(elInputText);
    // 제목에 수식
    elInputText.style.display = 'none';

    if(this.elAssign)
        elBranch.appendChild(this.elAssign);
    
    elBranch.appendChild(this.elAction);

    elItem.appendChild(elChildrenBus);

    this.elThis = elItem;
}

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// Handler //////////////////////////////////
mtmTreeItem.prototype.onRemoveClickHandler = function(e,id) {
    // ;//console.log('mtmTreeItem > onRemoveClickHandler : ', id);
    if(this.options && this.options.eventHandler && this.options.eventHandler.remove)
        this.options.eventHandler.remove(this,this.uuid,this.localIndex);
}

mtmTreeItem.prototype.onAddClickHandler = function(e,data) {
    // data: {
    //     id: this.id,
    //     index : i
    // },
    console.log('mtmTreeItem > onAddClickHandler :', data);
    if(this.options.addItems)
    {
        if(this.options && this.options.eventHandler && this.options.eventHandler.add)
            this.options.eventHandler.add(this,this.uuid,this.localIndex,data.index);
        
        // if(data.index == 0)
        //     ;//console.log('mtmTreeItem > onAddClickHandler : ', data.index);
        // else
        //     ;//console.log('mtmTreeItem > onAddClickHandler : ', data.index);
    }
    else
    {
        if(this.options && this.options.eventHandler && this.options.eventHandler.add)
            this.options.eventHandler.add(this, this.uuid,this.localIndex,-1);
        
        // ;//console.log('mtmTreeItem > onAddClickHandler : ', 'data.index');
    }
}

mtmTreeItem.prototype.onExpandClickHandler = function(e,data) {
    if(this.options && this.options.eventHandler && this.options.eventHandler.click)
            this.options.eventHandler.click(this, this.uuid,this.localIndex);
}

mtmTreeItem.prototype.onValueKeydownHandler = function(e)
{
    
    if ( e.keyCode == 27 || e.which == 27 ) {
        e.stopPropagation();
        e.preventDefault();
        // console.log('27 key');
        e.target.setSelectionRange(0,0);
        $(e.target).prop('readonly',true);
        // $(e.target).blur();
        
        var $label = $(e.target).prev('label')[0];
        var elLabel = $($label)[0];
        
        $(e.target).val(this.inputValue);
        elLabel.setAttribute('data-value',this.inputValue);
        elLabel.innerHTML = this.inputValue;

        // console.log('this.inputValue : ', this.inputValue);
        // console.log('elLabel : ', elLabel);

        this._renderLatex(elLabel);
        
        $($label).show();
        $(e.target).hide();
        return false;
    }
    else if(e.keyCode == 13 || e.which == 13) {
        e.stopPropagation();
        e.preventDefault();
        // console.log('13 key');
        // e.target.setAttribute("value",e.target.value);
        e.target.setSelectionRange(0,0);
        $(e.target).prop('readonly',true);
        // $(e.target).blur();
        
        var $label = $(e.target).prev('label')[0];
        var elLabel = $($label)[0];
        
        this.inputValue = $(e.target).val();
        elLabel.setAttribute('data-value',this.inputValue);
        elLabel.innerHTML = this.inputValue;
        
        // console.log('this.inputValue : ', this.inputValue);
        // console.log('elLabel : ', elLabel);

        this._renderLatex(elLabel);
        
        $($label).show();
        $(e.target).hide();

        this.data_id = $($label).attr('data-id');

        // this.updateTreeBranch(this.data_id, this.inputValue);

        return false;
    }
}

// blur
mtmTreeItem.prototype.onValueBlurHandler = function(e)
{
    // console.log(' mtmTreeItem > onValueBlurHandler');
    this.elInputText.setSelectionRange(0,0);
    this.elInputText.readOnly = true;
    // if(!this.elInputText.value)
    //     this.elLabel.innerHTML = this.value;
    // else
    if(this.elInputText.value)
        this.value = this.elInputText.value;
    this.elLabel.innerHTML = this.value;

    this._renderLatex(this.elLabel);
    this.elLabel.style.display = '';
    this.elInputText.style.display = 'none';
}   

mtmTreeItem.prototype.onEditClickHandler = function(e)
{
    // console.log(' mtmTreeItem > onEditClickHandler');
    // e.stopPropagation();
    // e.preventDefault();
    if(this.value)
        this.elInputText.value = this.value;

    this.elLabel.style.display = 'none';

    this.elInputText.style.display = '';
    this.elInputText.readOnly = false;
    this.elInputText.focus();
    this.elInputText.select();
    // return false;
}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////// API ////////////////////////////////////
mtmTreeItem.prototype.show = function(bShow)
{
    if(bShow)
        this.elThis.style.display = "";
    else
        this.elThis.style.display = "none";
}

mtmTreeItem.prototype.setExpandable = function(bExpandable)
{
    if(bExpandable)
        this.elLabel.classList.add("branch-parent");
    else
        this.elLabel.classList.remove("branch-parent");
    
}

mtmTreeItem.prototype.expand = function(bExpand)
{
    if(bExpand)
        this.elInputCheck.checked = true;
    else
        this.elInputCheck.checked = false;
    
}


mtmTreeItem.prototype.setLocalIndex = function(index)
{
    this.localIndex = index; 
}

mtmTreeItem.prototype.getLocalIndex = function()
{
    return this.localIndex; 
}

mtmTreeItem.prototype.setSortable = function(bSortable)
{
    // elItem.classList.add("state-disabled");
    if(bSortable)
    {
        this.elThis.classList.remove("state-disabled");
        this.elDragHandle.classList.add('drag-handler');
    }
    else
    {
        this.elThis.classList.add("state-disabled");
        this.elDragHandle.classList.remove('drag-handler');
    }
}

// CodePen Home
// SlideToggle / SlideUp / SlideDown - JavaScript (Vanilla)
// https://codepen.io/ivanwebstudio/pen/OJVzPBL
mtmTreeItem.prototype.timeoutSlideUp = function() {
    this.elThis.style.display = 'none';
    this.elThis.style.removeProperty('height');
    this.elThis.style.removeProperty('padding-top');
    this.elThis.style.removeProperty('padding-bottom');
    this.elThis.style.removeProperty('margin-top');
    this.elThis.style.removeProperty('margin-bottom');
    this.elThis.style.removeProperty('overflow');
    this.elThis.style.removeProperty('transition-duration');
    this.elThis.style.removeProperty('transition-property');
}

mtmTreeItem.prototype.slideUp = function(duration)
{
    this.elThis.style.transitionProperty = 'height, margin, padding';
    this.elThis.style.transitionDuration = duration + 'ms';
    this.elThis.style.boxSizing = 'border-box';
    this.elThis.style.height = this.elThis.offsetHeight + 'px';
    this.elThis.offsetHeight;
    this.elThis.style.overflow = 'hidden';
    this.elThis.style.height = 0;
    this.elThis.style.paddingTop = 0;
    this.elThis.style.paddingBottom = 0;
    this.elThis.style.marginTop = 0;
    this.elThis.style.marginBottom = 0;
    setTimeout( this.timeoutSlideUp.bind(this), duration);
}

mtmTreeItem.prototype.timeoutSlideDown = function() {
    this.elThis.style.removeProperty('height');
    this.elThis.style.removeProperty('overflow');
    this.elThis.style.removeProperty('transition-duration');
    this.elThis.style.removeProperty('transition-property');
}

mtmTreeItem.prototype.slideDown = function(duration) {

    this.elThis.style.removeProperty('display');
    var display = window.getComputedStyle(this.elThis).display;

    if (display === 'none')
      display = 'block';

    this.elThis.style.display = display;
    var height = this.elThis.offsetHeight;
    this.elThis.style.overflow = 'hidden';
    this.elThis.style.height = 0;
    this.elThis.style.paddingTop = 0;
    this.elThis.style.paddingBottom = 0;
    this.elThis.style.marginTop = 0;
    this.elThis.style.marginBottom = 0;
    this.elThis.offsetHeight;
    this.elThis.style.boxSizing = 'border-box';
    this.elThis.style.transitionProperty = "height, margin, padding";
    this.elThis.style.transitionDuration = duration + 'ms';
    this.elThis.style.height = height + 'px';
    this.elThis.style.removeProperty('padding-top');
    this.elThis.style.removeProperty('padding-bottom');
    this.elThis.style.removeProperty('margin-top');
    this.elThis.style.removeProperty('margin-bottom');
    setTimeout(this.timeoutSlideDown.bind(this), duration);
}

mtmTreeItem.prototype.slideToggle = function(duration) {
    if (getComputedStyle(this.elThis).display === 'none') {
        return this.slideDown(duration);
    } else {
        return this.slideUp(duration);
    }
}

// Set Edit Action
mtmTreeItem.prototype.setAction = function(bAction) {
    if(bAction)
        this.elAction.style.display = '';
    else
        this.elAction.style.display = 'none';
}

// Set Assign
mtmTreeItem.prototype.setAssign = function(bAssign) {
    if(!this.elAssign)
        return;
    
    if(bAssign)
        this.elAssign.style.display = '';
    else
        this.elAssign.style.display = 'none';
}
