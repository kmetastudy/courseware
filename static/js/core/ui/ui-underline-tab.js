let tabModuleCount = 0;

require("../../../css/core/ui/ui-underline-tab.css");
export const uiUnderlineTab = function (tabNames, parent, options) {
  if (!tabNames) {
    throw new Error(`you should put "tabNames"`);
  }

  if (!parent) {
    throw new Error(`you should put "parent"`);
  }
  this.tabNames = tabNames; //["name1", "name2"]
  this.parent = parent; // where to put tab?
  this.options = options || {};
  this.selectedTabIndex = 0;

  // Dom Elements
  // Tab
  this.tabElements = {}; //{"tabname": tabElement,}
  this.arrTabElements = [];
  // Content(TargetToDisplay)
  this.contentElements = {}; // {"tabname": document.querySelector('.content'),}
  this.tabNames.forEach((tabName) => {
    this.contentElements[tabName] = null;
  });

  this._init();
};

uiUnderlineTab.prototype._init = function () {
  this._initContentElements();
  tabModuleCount++;
  this._create();
  this._initEvents();
};

uiUnderlineTab.prototype._initContentElements = function () {
  if (!this.options.contentElements) {
    return;
  }

  for (let key in this.options.contentElements) {
    if (!this.tabNames.includes(key)) {
      throw new Error(`The key of contentElements: "${key}" should be same with tab names`);
    }

    this.contentElements[key] = this.options.contentElements[key];
    this.contentElements[key].classList.add("underline-tab-content");

    // 첫번째는 활성화
    if (this.tabNames[0] === key) {
      this.contentElements[key].classList.add("active");
      this.selectedTabIndex = 0;
    }
  }
};

uiUnderlineTab.prototype._create = function () {
  this.elThis = document.createElement("nav");
  this.elThis.classList.add("underline-tab");
  this.elThis.setAttribute("id", `underline-tab-${tabModuleCount}`);

  this.elSection = document.createElement("div");
  this.elSection.classList.add("underline-tab-section");
  this.elThis.appendChild(this.elSection);

  this.parent.appendChild(this.elThis);
  this.createTabItems(this.tabNames);
};

uiUnderlineTab.prototype.createTabItems = function (tabNames) {
  tabNames.forEach((tabName, tabIndex) => {
    const elTab = document.createElement("div");
    elTab.classList.add("underline-tab-item");
    elTab.setAttribute("id", `underline-tab-item-${tabModuleCount}-${tabIndex}`);

    const elTabName = document.createElement("span");
    elTabName.classList.add("underline-tab-name");
    elTabName.setAttribute("id", `underline-tab-name-${tabModuleCount}-${tabIndex}`);
    elTabName.innerHTML = tabName;
    elTab.appendChild(elTabName);

    this.elSection.appendChild(elTab);
    this.tabElements[tabName] = elTab;
    this.arrTabElements.push(elTab);
  });

  // Create Tab Bar
  if (!this.elTabBar) {
    this.elTabBar = document.createElement("div");
    this.elTabBar.classList.add("underline-tab-bar");
    this.elTabBar.setAttribute("id", `underline-tab-bar-${tabModuleCount}`);
    this.elSection.appendChild(this.elTabBar);

    window.requestAnimationFrame(() => {
      this.elTabBar.style.left = `${this.arrTabElements[0].offsetLeft}px`;
      this.elTabBar.style.width = `${this.arrTabElements[0].offsetWidth}px`;
    });
  }
};

uiUnderlineTab.prototype._initEvents = function () {
  for (let tabName in this.tabElements) {
    this.tabElements[tabName].addEventListener("click", (evt) => {
      this.handleTabClick(tabName, this.tabElements[tabName], evt);
    });
  }
};

// ===============================================================
// ============================= Handler =========================
// ===============================================================
uiUnderlineTab.prototype.handleTabClick = function (clickedTabName, clickedTabElement) {
  if (clickedTabElement.classList.contains("disabled")) {
    return;
  }
  this.arrTabElements.forEach((tab) => {
    tab.classList.remove("active");
  });
  clickedTabElement.classList.add("active");

  this.selectedTabIndex = this.arrTabElements.indexOf(clickedTabElement);

  // Locate Tabbar
  this.elTabBar.style.left = `${clickedTabElement.offsetLeft}px`;
  this.elTabBar.style.width = `${clickedTabElement.offsetWidth}px`;

  // Dipslay target content
  this.tabNames.forEach((tabName) => {
    if (this.contentElements[tabName]) {
      this.contentElements[tabName].classList.remove("active");
    }
  });

  if (this.contentElements[clickedTabName]) {
    this.contentElements[clickedTabName].classList.add("active");
  }

  if (this.options && this.options.onTabClick) {
    this.options.onTabClick(this.selectedTabIndex);
  }
};
// ===============================================================
// ============================== API ============================
// ===============================================================
uiUnderlineTab.prototype.setTarget = function (tabName, targetElement) {
  if (!(tabName in this.contentElements)) {
    throw new Error(`tabName "${tabName} is invalid"`);
  }

  this.contentElements[tabName] = targetElement;
  targetElement.classList.add("underline-tab-content");

  //
  if (tabName === this.tabNames[0]) {
    targetElement.classList.add("active");
  }
};

uiUnderlineTab.prototype.show = function (tabName) {
  this.enable(tabName);

  if (typeof tabName === "string" && this.contentElements[tabName]) {
    this.handleTabClick(tabName, this.tabElements[tabName]);
  }
};

uiUnderlineTab.prototype.disable = function (tabName) {
  this.tabElements[tabName].classList.add("disabled");
};

uiUnderlineTab.prototype.enable = function (tabName) {
  this.tabElements[tabName].classList.remove("disabled");
};
