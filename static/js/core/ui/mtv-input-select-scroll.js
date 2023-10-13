// [UI] 커스텀 셀렉트박스(custom selectbox)
// https://recordboy.github.io/2019/10/02/ui-custom-selectbox/

// [Prolog 시즌3] SelectBox (dropdown) 리팩토링 2
// https://dev-hyun.tistory.com/183

// Custom Select Styles with Pure CSS
// https://moderncss.dev/custom-select-styles-with-pure-css/

// Custom select menu - CSS only
// https://www.youtube.com/watch?v=bB14uo0Tu5A

// select 태그 커스텀 하기, 혹은 직접 만들기 (feat. javascript)
// https://wazacs.tistory.com/34

// How to Create A Custom Select Box - Styling Select Dropdown Using Html and CSS
// https://www.youtube.com/watch?v=LekyHMiuNgI

// Developing custom dropdowns with vanilla JS & CSS (In under 5 minutes)
// https://medium.com/@kyleducharme/developing-custom-dropdowns-with-vanilla-js-css-in-under-5-minutes-e94a953cee75
////////////////////////////////////////////////////////////////////////
// 아래의 mtvInputSelectScroll 은 밑의 인터넷 자료를 참조하여 제작한 것입니다.
// [UI] 커스텀 셀렉트박스(custom selectbox)
// https://recordboy.github.io/2019/10/02/ui-custom-selectbox/
////////////////////////////////////////////////////////////////////////
// 일반 Select Box 를 확장하여,
// Select Box 밑에 Horizontal Scroll List 를 표시하여 선택하게 한다.
// Todo. 1) Multi-Select 기능 추가...
// Todo. 2) 좀 더 예쁘게...
////////////////////////////////////////////////////////////////////////
import { mtvElementBuilder } from "../component/mtv-element-builder";
// import {mtvComponentBuilder} from '../utils/mtv-component-builder.js';
require("../../../css/core/ui/mtv-input-select-scroll.css");
export var mtvInputSelectScroll = function (options) {
  this.id = "id-mtv-input-select-scroll-" + mtvInputSelectScroll.id++;
  this.elThis = null;

  this.options = null;
  this.initOptions(options);

  this.elSelect = null;
  this.elList = null;
  // this.elSelected = null;

  this.elListLi = [];
  this.itemList = [];

  this.elCompList = null;
  this.elsArray = ["elThis", null, "elSelect", "elList"];
  this.elsObject = {};
  this.bInitEvent = false;
  this.init();
};

mtvInputSelectScroll.id = 0;

mtvInputSelectScroll.staticBody = [
  { step: 0, tag: "div", class: "class-mtv-input-select-scroll", attr: { style: "width:50%;" } },
  { step: 1, tag: "div", class: "class-box" },
  { step: 1, tag: "div", class: "class-select", text: "선택" },
  { step: 0, tag: "ul", class: "class-list" },
];

mtvInputSelectScroll.prototype._makeItemList = function (itemList, bSelectLast) {
  this.itemList = [];

  if (itemList.length > 0) {
    if (!bSelectLast || itemList.length == 1)
      //itemlist : ['문제집선택'] //문제집이 없는 경우
      this.itemList.push({ step: 0, tag: "li", class: "class-selected", text: itemList[0], attr: { "data-index": 0 } });
    else this.itemList.push({ step: 0, tag: "li", text: itemList[0], attr: { "data-index": 0 } });

    for (var i = 1; i < itemList.length; i++) {
      if (bSelectLast && i == itemList.length - 1)
        this.itemList.push({
          step: 0,
          tag: "li",
          class: "class-selected",
          text: itemList[i],
          attr: { "data-index": i },
        });
      else this.itemList.push({ step: 0, tag: "li", text: itemList[i], attr: { "data-index": i } });
    }
  }
};

mtvInputSelectScroll.prototype.initOptions = function (options) {
  this.options = options;
  if (!this.options) this.options = {};

  if (!this.options.color) this.options.color = "class-mtv-select-scroll-color-0";

  if (!this.options.items) this.options.items = [];
};

mtvInputSelectScroll.prototype.listOnHandler = function () {
  this.elThis.classList.toggle("on");
  if ($(this.elsObject.elThis).hasClass("on")) $(this.elsObject.elList).css("display", "block");
  else $(this.elsObject.elList).css("display", "none");
};

mtvInputSelectScroll.prototype.listSelectHandler = function (e) {
  // console.log('listSelectHandler : ', )
  $(e.target).addClass("class-selected").siblings("li").removeClass("class-selected"); //siblings: 형제요소들
  this.elThis.classList.remove("on");
  var text = $(e.target).text();
  $(this.elsObject.elSelect).text(text);
  $(this.elsObject.elList).css("display", "none");
  var index = e.target.getAttribute("data-index");
  if (this.options && this.options.eventHandler) this.options.eventHandler(text, index);
};

mtvInputSelectScroll.prototype.listOffHandler = function (e) {
  if (!$(e.target).is($(this.elsObject.elSelect)) && $(this.elThis).hasClass("on")) {
    $(this.elThis).removeClass("on");
    $(this.elsObject.elList).css("display", "none");
  }
};

mtvInputSelectScroll.prototype.initEvents = function () {
  // document.addEventListener("click", this.closeAllSelect.bind(this));
  if (!this.bInitEvent) this.elsObject.elSelect.addEventListener("click", this.listOnHandler.bind(this));
  for (var i = 0; i < this.elListLi.length; i++)
    this.elListLi[i].addEventListener("click", this.listSelectHandler.bind(this));

  // $(document).on('click', function(e){
  //         that.listOffHandler($(e.target));
  // });
  if (!this.bInitEvent) document.addEventListener("click", this.listOffHandler.bind(this));

  this.bInitEvent = true;
};

mtvInputSelectScroll.prototype.initElements = function () {
  for (var i = 0; i < this.elsArray.length; i++) {
    if (this.elsArray[i]) this.elsObject[this.elsArray[i]] = this.elCompList[i];
  }
};

mtvInputSelectScroll.prototype.create = function () {
  // Create Select List Component
  this.elCompList = mtvElementBuilder.buildComponent(mtvInputSelectScroll.staticBody, true); //true->push to elcomplist
  // Component List Matching
  this.elThis = this.elCompList[0]; //div.class-mtv-input-select-scroll

  if (this.options && this.options.width) this.elThis.style.width = this.options.width;
  // this.elSelect = this.elCompList[2];
  // this.elList = this.elCompList[3];

  this.initElements();
  if (this.options.listDownloadHandler) {
    this.options.listDownloadHandler(); // mtv-question-container > this.questionBookItems
  }
};

mtvInputSelectScroll.prototype.prepare = function () {
  if (this.options.items.length == 0) this.options.items.push("QuestionBook");
  mtvInputSelectScroll.staticBody[2]["text"] = this.options.items[0];
};

mtvInputSelectScroll.prototype.init = function () {
  this.prepare();

  this.create();
};

// mtv/core/utils/mtvComponentBuilder 에 등록
// mtvComponentBuilder.register('mtv-input-select-scroll',mtvInputSelectScroll);

////////////////////// API //////////////////////////////
mtvInputSelectScroll.prototype.getValue = function () {
  $(this.elsObject.elSelect).text();
};

// mtv-question-container > this.clBookSelect.setList(this.questionBookItems)
mtvInputSelectScroll.prototype.setList = function (listItem, bSelectLast) {
  this._makeItemList(listItem, bSelectLast);
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
  // console.log('mtvInputSelectScroll > setList : ', bSelectLast, this.itemList);

  for (var i = 0; i < this.itemList.length; i++) {
    var el = mtvElementBuilder.createElement(this.itemList[i]);
    this.elListLi.push(el);
    this.elsObject.elList.appendChild(el);
    if (bSelectLast && i == this.itemList.length - 1) {
      var text = listItem[i];
      console.log("mtvInputSelectScroll > setList : ", listItem[i]);
      $(this.elsObject.elSelect).text(listItem[i]);
      if (this.options && this.options.eventHandler) {
        this.options.eventHandler(text, i); // onSelectHandler
      }
    }
  }
  // console.log('this.elListLi: ',this.elListLi);
  // console.log('this.elsObject.elList', this.elsObject.elList);

  // console.log('this.itemList : ',this.itemList);
  this.initEvents();
};

mtvInputSelectScroll.prototype.setTitle = function (title) {
  $(this.elsObject.elSelect).text(title);
};

mtvInputSelectScroll.prototype.setSelectedTitle = function (title, index) {
  $(this.elsObject.elSelect).text(title);
  this.itemList[index] = title;
  this.elListLi[index].innerHTML = title;
};
