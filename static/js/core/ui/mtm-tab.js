// activate -> display: visibility=visible, tab color change;
// var tabOption={
//     data: [
//         {title:'문제 입력', displayTarget: null},
//     ],
//     style: {
//         width:'1000px',
//         borderBottom:'1px solid black',
//         marginTop:'10px',
//     }
// }

require("../../../css/core/ui/mtm-tab.css");
export let mtmTab = function (options) {
  this.options = options || {};
  this.elTabArray = []; //tab elements
  this.displayTargetArray = []; //target elements to show(displayTarget)
  this._init();
};

mtmTab.prototype._init = function () {
  this._setProperty();
  this._create();
  this._initStyle();
};

mtmTab.prototype._setProperty = function () {
  this.tabDataArray = this.options.data || [];
  this.style = this.options.style || {};
};

mtmTab.prototype._initStyle = function () {
  for (let styleProp in this.style) {
    if (this.style.hasOwnProperty(styleProp)) {
      this.elThis.style[styleProp] = this.style[styleProp];
    }
  }
};

mtmTab.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.setAttribute("class", "mtm-tab");

  this.tabDataArray.forEach((tabData, index) => {
    this.createTabElement(tabData, index);
    this.setEvents(tabData, index);
  });
  if (this.elTabArray.length != 0) {
    this.elTabArray[0].classList.add("tab-active");
  }
};

// ===================================================================
// ============================= Handler =============================
// ===================================================================
mtmTab.prototype.onClickActiveHandler = function (tabData) {
  const tabEl = tabData.tabElement;
  this.selectedIndex = null;
  this.elTabArray.forEach((el, index) => {
    el.classList.remove("tab-active");
    // this.selectedIndex = index
  });
  tabEl.classList.add("tab-active");
  if (this.options.eventTabClick) {
    this.options.eventTabClick(tabData);
  }
};
// ===============================================================
// ============================= API =============================
// ===============================================================

mtmTab.prototype.setDisplayTarget = function (title, displayTarget) {
  this.tabDataArray.forEach((tabData, index) => {
    if (tabData.title === title) {
      tabData.displayTarget = displayTarget;
      this.setEvents(tabData, index);
      return;
    }
  });
};

mtmTab.prototype.createTabElement = function (tabData, tabIndex) {
  var tabEl = document.createElement("div");
  var tabSpan = document.createElement("span");
  tabSpan.innerHTML = tabData.title;
  tabEl.appendChild(tabSpan);
  this.elTabArray.push(tabEl);
  this.elThis.appendChild(tabEl);
  tabData.tabElement = tabEl;
  tabData.index = tabIndex;
};

mtmTab.prototype.setEvents = function (tabData, index) {
  tabData.tabElement.addEventListener("click", this.onClickActiveHandler.bind(this, tabData));
  if (tabData.displayTarget != null) {
    this.displayTargetArray.push(tabData.displayTarget);
    tabData.tabElement.addEventListener("click", this.showTarget.bind(this, tabData.displayTarget));
  }
};

mtmTab.prototype.showTarget = function (target) {
  this.displayTargetArray.forEach((el) => {
    el.style.display = "none";
  });
  target.style.display = "block";
};

mtmTab.prototype.disableTarget = function (index) {
  this.displayTargetArray[index].style.display = "none";
};

mtmTab.prototype.showTargetWithIndex = function (tabIndex) {
  this.displayTargetArray.forEach((el, index) => {
    if (tabIndex === index) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });

  this.elTabArray.forEach((el, index) => {
    el.classList.remove("tab-active");
    if (index === tabIndex) {
      el.classList.add("tab-active");
    }
  });
};
