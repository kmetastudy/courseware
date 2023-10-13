// UI/UX example: Tab switch animation
// https://codepen.io/Gelsot/pen/eMOvOP

// CodePen Home - Daily UI #007 | Settings
// https://codepen.io/juliepark/pen/pLMxoP

// Modern Tabs Design with pure CSS - 001
// https://codepen.io/OperaRock/pen/jOMJWbK

// Good looking shadowy CSS3 tabs
// https://dev.housetrip.com/2012/06/15/good-looking-css-tabs/

// Designing Beautiful Shadows in CSS
// https://www.joshwcomeau.com/css/designing-shadows/

// CodePen Home - Modern Tabs Design with pure CSS - 001
// https://codepen.io/OperaRock/pen/jOMJWbK

// ///////////////////////////////////////////////////////////////
// CodePen Home - CSS secret 13 사다리꼴 탭 메뉴
// https://codepen.io/display1180/pen/prNgeB
// transform:perspective(1.5em) rotateX(10deg);
// ///////////////////////////////////////////////////////////////

// 곡률이 있는 사다리꼴을 css로 만들고싶은데 어떻게 해야되나요?
// https://jsfiddle.net/s6k9zjh0/

// mtm-tabs.css
// Color    - Active
//          - Hover
//
import { mtmOutputBadge } from "./output/mtm-output-badge.js";

require("../../../css/core/ui/mtm-tabs.css");

// Creating tabs in HTML + CSS + JS
// https://www.101computing.net/creating-tabs-in-html-css-js/

// CodePen Home / Pure CSS Tabs
// https://codepen.io/markcaron/pen/MvGRYV

// CodePen Home - CSS animated notification badge
// https://codepen.io/sjmcpherson/pen/nodqoq

// Revised Rounded Buttons
// https://codepen.io/tylersticka/pen/XWrgxjw

// Version Badge
// https://codepen.io/avstorm/pen/LYmKaVM

// Tab Styles Inspiration - A small collection of styles for tabs
// https://tympanus.net/Development/TabStylesInspiration/
export var mtmTabs = function (options) {
  this.id = "id-mtm-tabs-" + mtmTabs.id++;
  this.options = options;
  this.elThis = null;
  this.elTabDiv = null;
  this.elPanelDiv = null;

  this.elTabs = []; // Tab 자체
  this.clBadges = [];
  this.elPanels = []; // Tab Panel

  this.activeIndex = -1;
  this.activePanelIndex = -1;
  // Tabs 을 Manager 에서 관리한다.
  // 나중에...
  this.elTabDiv = null;
  this.elTabUl = null;

  this.tabCount = 0;
  this.tabElTitles = [];
  this._init();
};

mtmTabs.id = 0;

mtmTabs.prototype.createTreeElement = function (el) {
  if (!el["tag"]) return el["text"] || "nothing";

  var element = document.createElement(el["tag"]);

  if (el["class"]) element.setAttribute("class", el["class"]);

  if (el["id"]) element.setAttribute("id", el["id"]);

  if (el["style"]) element.setAttribute("style", el["style"]);

  if (el["text"]) element.innerHTML = el["text"];

  return element;
};

mtmTabs.prototype._addTab = function (tab, i) {
  var elDiv = document.createElement("div");
  elDiv.style.position = "relative";

  var el = document.createElement("div");
  var tabClass = "mtm-tabs-tab";
  this.elTabs.push(el);
  elDiv.append(el);

  // just label
  if (tab.label) {
    el.setAttribute("class", tabClass);
    el.classList.add("label");
    if (tab.align) el.classList.add(tabClass + "-" + tab.align);
    el.setAttribute("data-index", this.elTabs.length - 1);
    el.style.display = "none";
    var img = document.createElement("img");
    el.append(img);

    this.tabElTitles.push(el);
    return elDiv;
  }

  if (this.options && this.options.tabs[i].badge) {
    // console.log('mtmTabs > _addTab : has badge');
    var options = {};
    options.element = elDiv;
    options.background = this.options.tabs[i].background;
    options.color = this.options.tabs[i].color;

    var clBadge = new mtmOutputBadge(options);
    this.clBadges.push(clBadge);
  }

  el.setAttribute("class", tabClass);
  if (tab.active) {
    el.classList.add("active");
    this.activeIndex = this.elTabs.length - 1;
    // console.log('mtmTabs > _addTab : this.activeIndex',this.activeIndex);
  }
  if (tab.align) el.classList.add(tabClass + "-" + tab.align);
  el.setAttribute("data-index", this.elTabs.length - 1);
  el.innerHTML = tab.name;

  el.addEventListener("click", this.onTabClickHandler.bind(this));
  this.tabElTitles.push(el);
  return elDiv;
};

mtmTabs.prototype._addPanel = function (panel) {
  if (!panel) return null;

  var el = document.createElement("div");
  this.elPanels.push(el);

  el.setAttribute("class", "mtm-tabs-panel");
  el.setAttribute("data-index", this.elPanels.length - 1);
  // default add
  el.style.display = "none";
  return el;
};

mtmTabs.prototype._init = function () {
  this.elThis = document.createElement("div");
  this.elThis.setAttribute("id", this.id);

  this.elTabDiv = document.createElement("div");
  this.elTabDiv.classList.add("mtm-tabs-tab-div");
  if (this.options && this.options.align == "center") this.elTabDiv.classList.add("mtm-tabs-tab-div-center");

  this.elPanelDiv = document.createElement("div");
  this.elPanelDiv.classList.add("mtm-tabs-panel-div");

  this.elThis.appendChild(this.elTabDiv);
  this.elThis.appendChild(this.elPanelDiv);

  // create Tab itself
  // {name:'tabName',align:'float',panel:true}
  if (this.options && this.options.tabs) {
    var index = 0;
    for (var i = 0; i < this.options.tabs.length; i++) {
      var tab = this._addTab(this.options.tabs[i], i);
      this.elTabDiv.appendChild(tab);

      var panel = this._addPanel(this.options.tabs[i].panel);
      if (panel) this.elPanelDiv.appendChild(panel);
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
};

/////////////////////////////////////////////////////////////////////
////////////////////////////// Handler //////////////////////////////
mtmTabs.prototype.onTabClickHandler = function (e) {
  var index = e.target.getAttribute("data-index");
  if (!index) return;

  if (this.activeIndex >= 0) this.elTabs[this.activeIndex].classList.remove("active");

  this.activeIndex = parseInt(index);
  this.elTabs[this.activeIndex].classList.add("active");

  if (this.options && this.options.eventActivateTab) this.options.eventActivateTab(this.activeIndex);
};
/////////////////////////////////////////////////////////////////////
////////////////////////////// API //////////////////////////////////
mtmTabs.prototype.addTab = function (tabName, els, gap, scroll, callback, float) {
  var elLi = document.createElement("li");
  var elAnchor = document.createElement("a");
  var tabId = this.id + "-tabs-" + this.tabCount;
  elAnchor.setAttribute("href", "#" + tabId);
  elAnchor.innerHTML = tabName;
  elLi.appendChild(elAnchor);
  this.elTabUl.appendChild(elLi);

  this.tabElTitles.push(elAnchor);

  var elTabs = document.createElement("div");
  elTabs.setAttribute("id", tabId);
  if (gap) elTabs.setAttribute("class", gap);

  if (float) {
    // console.log('float : ', float);
    elLi.setAttribute("class", float);
  }

  this.tabEls.push(elTabs);

  // Todo. 좀 더 Nice 하게....
  if (scroll == 1) elTabs.setAttribute("style", "overflow-y:auto;max-height:85vh");

  this.elTabDiv.appendChild(elTabs);
  var treeEle = [];
  var level = 0;
  var element = null;
  treeEle.push(elTabs);

  if (els) {
    for (var i = 0; i < els.length; i++) {
      element = this.createTreeElement(els[i]);
      level = els[i]["level"];

      treeEle[level].appendChild(element);

      treeEle[level + 1] = element;
    }
  }

  if (callback) {
    callback(elTabs);
  }

  this.tabCount++;
};

// mtmTabs.prototype.applyOptions = function()
// {
//     // Todo. 좀 더 Nice 하게 할 수 없나?
//     if(this.options.activate)   // activate handler
//         $(this.elTabDiv).tabs({activate:this.options.activate});
//     else
//         $(this.elTabDiv).tabs();
// }

mtmTabs.prototype.showTabBar = function (bShow) {
  if (bShow) {
    this.elTabDiv.style.display = "";
    this.elPanelDiv.classList.add("mtm-tabs-panel-div");
  } else {
    this.elTabDiv.style.display = "none";
    this.elPanelDiv.classList.remove("mtm-tabs-panel-div");
  }
};

// 좀 더 섬세한 padding 을 위해서...
mtmTabs.prototype.setWideClass = function (bSet, classValue) {
  if (bSet) this.elTabDiv.classList.add(classValue);
  else this.elTabDiv.classList.remove(classValue);
};

mtmTabs.prototype.disable = function (index) {
  $(this.$id).tabs("disable", index);
};

// mtmTabs.prototype.getActiveIndex = function()
// {
//     return $(this.$id).tabs("option","active");
// }

// mtmTabs.prototype.setActiveIndex = function(index,eventEmitter,eventHandler)
// {
//     $(this.$id).tabs("option","active",index);
//     // if(eventEmitter)
//     //     mtvEvents.emit(eventEmitter,index);
//     // if(eventHandler)
//     //     eventHandler(index);
// }

mtmTabs.prototype.setActiveIndex = function (index) {
  if (this.activeIndex >= 0) this.elTabs[this.activeIndex].classList.remove("active");

  this.activeIndex = parseInt(index);
  this.elTabs[this.activeIndex].classList.add("active");
};

mtmTabs.prototype.getActiveIndex = function () {
  return this.activeIndex;
};

mtmTabs.prototype.rightAlignment = function (index) {
  $(this.$id).tabs().addClass("tabs-to-right");
};

mtmTabs.prototype.setTitle = function (index, title) {
  if (this.tabElTitles.length <= index) {
    console.log("mtmTabs > setTitel : overflow", this.tabElTitles);
    return;
  }

  this.tabElTitles[index].innerHTML = title;
};

mtmTabs.prototype.getTitle = function (index) {
  if (this.tabElTitles.length <= index) return "";
  return this.tabElTitles[index].innerHTML; // = title;
};

mtmTabs.prototype.setTab = function (index, el, id) {
  this.tabEls[index] = el;

  this.elTabDiv.appendChild(el);
  el.style.display = "";
};

mtmTabs.prototype.showTab = function (index) {
  for (var i = 0; i < this.tabEls.length; i++) {
    var el = this.tabEls[i];
    if (index == i) {
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  }
};

mtmTabs.prototype.getTabs = function () {
  return this.tabEls;
};

mtmTabs.prototype.getTab = function (index) {
  return this.tabEls[index];
  // return this.elTabs[index];
};

mtmTabs.prototype.restorePanels = function () {
  // for(var i=0;i<this.tabEls.length;i++)
  //     this.elTabDiv.appendChild(this.tabEls[i]);
  for (var i = 0; i < this.elPanels.length; i++) this.elPanelDiv.appendChild(this.elPanels[i]);
};

mtmTabs.prototype.appendPanel = function (index, el) {
  if (this.elPanels.length <= index) {
    // this._addPanel(true);
    var panel = this._addPanel(true);
    if (panel) this.elPanelDiv.appendChild(panel);
  }

  this.elPanels[index].appendChild(el);
};

mtmTabs.prototype.addPanel = function (index, el) {
  if (this.elPanels.length <= index) return;

  this.elPanels[index].appendChild(el);
};

mtmTabs.prototype.getPanel = function (index) {
  return this.elPanels[index];
};

// subIdx 는 무엇을 하려고 했지?
mtmTabs.prototype.showPanel = function (index, subIdx) {
  if (this.activePanelIndex == index && subIdx === undefined) return;

  if (this.activePanelIndex >= 0) this.elPanels[this.activePanelIndex].style.display = "none";

  if (this.elPanels.length <= index) {
    this.activePanelIndex = -1;
    return;
  }

  this.activePanelIndex = index;

  if (this.activePanelIndex >= 0) this.elPanels[this.activePanelIndex].style.display = "";

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
};

mtmTabs.prototype.setBadge = function (index, value) {
  if (this.clBadges.length > index) {
    this.clBadges[index].setValue(value);
  }
};

mtmTabs.prototype.setImage = function (index, value) {
  if (this.tabElTitles.length <= index) return;

  if (!value) {
    this.tabElTitles[index].style.display = "none";
    return;
  }

  var elImg = this.tabElTitles[index].children[0];
  elImg.setAttribute("src", value);
  this.tabElTitles[index].style.display = "";
};
