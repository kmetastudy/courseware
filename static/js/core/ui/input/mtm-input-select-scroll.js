import { mtoElementBuilder } from "../../utils/mto-element-builder.js";
require("../../../../css/core/ui/input/mtm-input-select-scroll.css");

// Todo. Jstar : 현재 선택된 항목을 Box List 에서 다른 색으로 표현하는 기능 추가.
export var mtmInputSelectScroll = function (options) {
  this.id = "id-mtm-input-select-scroll-" + mtmInputSelectScroll.id++;
  this.elThis = null;

  this.options = null;
  this._initOptions(options);

  this.elSelect = null;
  this.elList = null;
  // this.elSelected = null;

  this.elListLi = [];
  this.itemList = [];

  this.elCompList = null;
  this.elsArray = ["elThis", "elBox", "elSelect", "elList"];
  this.elsObject = {};
  this.bInitEvent = false;
  this.iSelectIndex = -1;
  this._init();
};

mtmInputSelectScroll.id = 0;

mtmInputSelectScroll.staticBody = [
  { step: 0, tag: "div", class: "mtm-input-select-scroll" },
  { step: 1, tag: "div", class: "box" },
  { step: 1, tag: "div", class: "select", text: "선택" },
  { step: 0, tag: "ul", class: "list" },
  // {'step':1,'tag':'li','class':'selected','text':'선택'},
  // {'step':0,'tag':'li','text':'항목1'},
  // {'step':0,'tag':'li','text':'항목2'},
  // {'step':0,'tag':'li','text':'항목3'},
  // {'step':0,'tag':'li','text':'항목4'},
  // {'step':0,'tag':'li','text':'항목5'},
];

mtmInputSelectScroll.testListItem = [
  { step: 0, tag: "li", class: "selected", text: "선택" },
  { step: 0, tag: "li", text: "항목1" },
  { step: 0, tag: "li", text: "항목2" },
  { step: 0, tag: "li", text: "항목3" },
  { step: 0, tag: "li", text: "항목4" },
  { step: 0, tag: "li", text: "항목5" },
  { step: 0, tag: "li", text: "항목6" },
  { step: 0, tag: "li", text: "항목7" },
  { step: 0, tag: "li", text: "항목8" },
  { step: 0, tag: "li", text: "항목9" },
  { step: 0, tag: "li", text: "항목10" },
];

mtmInputSelectScroll.prototype._makeItemList = function (itemList, bSelectLast, bSelectFirst) {
  this.itemList = [];
  var text = "";
  var value = 0;

  if (itemList.length > 0) {
    if (!!itemList[0].code) value = itemList[0].code;
    else value = 1;

    if (!!itemList[0].name) text = itemList[0].name;
    else text = itemList[0];

    if (bSelectLast && itemList.length == 1)
      // this.itemList.push({'step':0,'tag':'li','class':'selected','text':itemList[0],'attr':{'data-index':0}});
      this.itemList.push({
        step: 0,
        tag: "li",
        class: "selected",
        text: text,
        attr: { "data-index": 0, value: value },
      });
    // this.itemList.push({'step':0,'tag':'li','text':itemList[0],'attr':{'data-index':0}});
    else this.itemList.push({ step: 0, tag: "li", text: text, attr: { "data-index": 0, value: value } });

    for (var i = 1; i < itemList.length; i++) {
      if (!!itemList[i].code) value = itemList[i].code;
      else value = i + 1;

      if (!!itemList[i].name) text = itemList[i].name;
      else text = itemList[i];

      if (bSelectLast && i == itemList.length - 1)
        // this.itemList.push({'step':0,'tag':'li','class':'selected','text':itemList[i],'attr':{'data-index':i}});
        this.itemList.push({
          step: 0,
          tag: "li",
          class: "selected",
          text: text,
          attr: { "data-index": i, value: value },
        });
      else if (bSelectFirst && i == 0)
        this.itemList.push({
          step: 0,
          tag: "li",
          class: "selected",
          text: text,
          attr: { "data-index": i, value: value },
        });
      // this.itemList.push({'step':0,'tag':'li','text':itemList[i],'attr':{'data-index':i}});
      else this.itemList.push({ step: 0, tag: "li", text: text, attr: { "data-index": i, value: value } });
    }
  }
};

mtmInputSelectScroll.prototype._initOptions = function (options) {
  this.options = options;
  if (!this.options) this.options = {};

  if (!this.options.color) this.options.color = "mtm-select-scroll-color-0";

  if (!this.options.items) this.options.items = [];
};

mtmInputSelectScroll.prototype._initEvents = function () {
  if (!this.bInitEvent) this.elsObject.elSelect.addEventListener("click", this.onListOnHandler.bind(this));

  for (var i = 0; i < this.elListLi.length; i++)
    this.elListLi[i].addEventListener("click", this.onListSelectHandler.bind(this));

  if (!this.bInitEvent) document.addEventListener("click", this.onListOffHandler.bind(this));

  this.bInitEvent = true;
};

mtmInputSelectScroll.prototype._matchElements = function () {
  for (var i = 0; i < this.elsArray.length; i++) {
    if (this.elsArray[i]) this.elsObject[this.elsArray[i]] = this.elCompList[i];
  }
};

mtmInputSelectScroll.prototype._create = function () {
  // Create Select List Component
  this.elCompList = mtoElementBuilder.buildComponent(mtmInputSelectScroll.staticBody, true);

  // Component List Matching
  this.elThis = this.elCompList[0];

  if (this.options && this.options.width) this.elThis.style.width = this.options.width;
  if (this.options && this.options.classList)
    for (var i = 0; i < this.options.classList.length; i++) this.elThis.classList.add(this.options.classList[i]);

  this._matchElements();

  // Add Select List Items
  // if(this.options.items.length == 0)
  //     for(var i=0;i<mtmInputSelectScroll.testListItem.length;i++)
  //     {
  //         var el = mtoElementBuilder.createElement(mtmInputSelectScroll.testListItem[i]);
  //         this.elListLi.push(el);
  //         this.elsObject.elList.appendChild(el);
  //     }

  this.setList(this.options.items);
};

mtmInputSelectScroll.prototype._prepare = function () {
  if (this.options.items.length == 0) this.options.items.push("선택");

  mtmInputSelectScroll.staticBody[2]["text"] = this.options.items[0];
};

mtmInputSelectScroll.prototype._init = function () {
  this._prepare();
  this._create();
};

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Handler /////////////////////////////////////
mtmInputSelectScroll.prototype.onListOnHandler = function () {
  this.elThis.classList.toggle("on");
  if (this.elsObject.elThis.classList.contains("on")) this.elsObject.elList.style.display = "block";
  else this.elsObject.elList.style.display = "none";
};

mtmInputSelectScroll.prototype.onListSelectHandler = function (e) {
  // console.log('mtmInputSelectScroll > onListSelectHandler : ', )

  for (var i = 0; i < this.elListLi.length; i++) {
    if (this.elListLi[i].classList.contains("selected")) this.elListLi[i].classList.remove("selected");
  }
  e.target.classList.add("selected");

  this.elThis.classList.remove("on");

  var text = e.target.innerHTML;
  this.elsObject.elSelect.innerHTML = text;

  this.elsObject.elList.style.display = "none";

  var index = e.target.getAttribute("data-index");
  this.iSelectIndex = index;

  if (this.options && this.options.eventChangeHandler) this.options.eventChangeHandler(text, index);
  else if (this.options && this.options.eventHandler) this.options.eventHandler(text, index);
};

mtmInputSelectScroll.prototype.onListOffHandler = function (e) {
  if (!(e.target == this.elsObject.elSelect) && this.elThis.classList.contains("on")) {
    this.elThis.classList.remove("on");
    this.elsObject.elList.style.display = "none";
  }
};
//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// API //////////////////////////////////////////
mtmInputSelectScroll.prototype.show = function (bShow) {
  if (bShow) this.elThis.style.display = "";
  else this.elThis.style.display = "none";
};

mtmInputSelectScroll.prototype.getValue = function () {
  return this.elsObject.elSelect.innerHTML;
};

mtmInputSelectScroll.prototype.setOptionList = function (listItem, bSelectLast) {
  this.setList(listItem, bSelectLast);
};

mtmInputSelectScroll.prototype.setListIndex = function (listItem, iIndex) {
  this.iSelectIndex = iIndex;

  this._makeItemList(listItem, false, false);
  this.elListLi = [];

  while (this.elsObject.elList.firstChild) {
    this.elsObject.elList.removeChild(this.elsObject.elList.lastChild);
  }

  for (var i = 0; i < this.itemList.length; i++) {
    var el = mtoElementBuilder.createElement(this.itemList[i]);

    this.elListLi.push(el);
    this.elsObject.elList.appendChild(el);
    // if((bSelectLast && (i==this.itemList.length-1)) || (bSelectFirst && (i==0)))
    if (iIndex >= 0 && iIndex == i) {
      el.classList.add("selected");
      var text = listItem[i];
      // console.log('mtmInputSelectScrollButton > setList : ',listItem[i]);

      // $(this.elsObject.elSelect).text(listItem[i]);
      this.elsObject.elSelect.innerHTML = listItem[i];
      if (this.options && this.options.eventChangeHandler) this.options.eventChangeHandler(text, i);
      else if (this.options && this.options.eventHandler) this.options.eventHandler(text, index);
    }
  }

  // console.log('this.itemList : ',this.itemList);
  this._initEvents();
};

mtmInputSelectScroll.prototype.setList = function (listItem, bSelectLast, bSelectFirst) {
  this._makeItemList(listItem, bSelectLast, bSelectFirst);

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
  // console.log('mtmInputSelectScroll > setList : ', bSelectLast, this.itemList);

  for (var i = 0; i < this.itemList.length; i++) {
    var el = mtoElementBuilder.createElement(this.itemList[i]);
    this.elListLi.push(el);
    this.elsObject.elList.appendChild(el);
    // if(bSelectLast && (i==this.itemList.length-1))
    if ((bSelectLast && i == this.itemList.length - 1) || (bSelectFirst && i == 0)) {
      this.iSelectIndex = i;

      var text = listItem[i];
      // console.log('mtmInputSelectScroll > setList : ',listItem[i]);

      $(this.elsObject.elSelect).text(listItem[i]);
      if (this.options && this.options.eventHandler) this.options.eventHandler(text, i);
    }
  }

  // console.log('this.itemList : ',this.itemList);
  this._initEvents();
};

mtmInputSelectScroll.prototype.setTitle = function (title) {
  this.elsObject.elSelect.innerHTML = title;
};

mtmInputSelectScroll.prototype.setSelectedTitle = function (title, index) {
  this.elsObject.elSelect.innerHTML = title;
  this.itemList[index] = title;
  this.elListLi[index].innerHTML = title;
};

mtmInputSelectScroll.prototype.getSelectIndex = function () {
  return this.iSelectIndex;
};
