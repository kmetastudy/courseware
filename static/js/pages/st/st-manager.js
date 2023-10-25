import { mtmTabs } from "../../core/ui/mtm-tabs";

import { StudyCourseContainer } from "./study/study-course-container.js";
import { StudyCourseBuilder } from "./study/study-course-builder.js";
require("./mtm-manager-learn.css");

// Todo. Jstar
// 1) 만약 password 를 바꾸지 않았으면, 노출 위험 경고 문구....
//

/**
 *  Learn Manager
 * @constructor
 * @param {object} options - options for constructor
 */
export var StManager = function (options) {
  console.log("StManager > options: ", options);
  this.id = "id-mtm-manager-learn-" + StManager.id++;
  this.options = options;
  this.elThis = null;

  this._init();
};

StManager.id = 0;

StManager.prototype._initEvents = function () {
  window.addEventListener("resize", this.onResizeWindowHandler.bind(this));
};

StManager.prototype._init = function () {
  this._create();
  this._initEvents();
  this.panelNum = 2;
  // this._arrangePanelLayout();
};

StManager.prototype._create = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("container-fluid", "pt-2", "mtm-manager-learn");

  this.elOnePanel = document.createElement("div");
  this.elOnePanel.classList.add("row");
  // Todo. Jstar : 좀 더 Nice 한 작업 높이를 확보
  this.elOnePanel.style.minHeight = "100vh";

  this.elLeftPanel = document.createElement("div");
  this.elLeftPanel.classList.add("col-4", "border-right-position");

  this.elRightPanel = document.createElement("div");
  this.elRightPanel.classList.add("col-8", "border-left-position");

  this.elOnePanel.appendChild(this.elLeftPanel);
  this.elOnePanel.appendChild(this.elRightPanel);

  this.elThis.appendChild(this.elOnePanel);
  ///////////////////////////////////////////////////////////////////
  var leftTabOptions = {};
  leftTabOptions.tabs = [];
  leftTabOptions.tabs.push({ name: "학습", align: "left", active: true, panel: true });
  // 통계는 현재 안붙임, 설정 -> 아바타, 비밀번호 바꾸기
  // leftTabOptions.tabs.push({name:'통계',align:'left',active:false,panel:true});
  leftTabOptions.eventActivateTab = this.onLeftTabActivate.bind(this);

  this.clLeftTab = new mtmTabs(leftTabOptions);

  this.elLeftPanel.appendChild(this.clLeftTab.elThis);

  // this.clStudyContainer = new mtmStudyContainer(this.options);
  this.clStudyContainer = new StudyCourseContainer(this.options);
  this.clLeftTab.appendPanel(0, this.clStudyContainer.elThis);

  // 이것 현재 안 붙임
  // this.clStatContainer = new mtmStatContainer(this.options);
  // this.clLeftTab.appendPanel(1,this.clStatContainer.elThis);

  this.leftActiveIndex = 0;
  this.clLeftTab.showPanel(this.leftActiveIndex);

  var rightTabOptions = {};
  rightTabOptions.tabs = [];
  rightTabOptions.tabs.push({ name: "학습", align: "right", active: true, panel: true });
  // 통계는 아직
  // leftTabOptions.tabs.push({name:'통계',align:'left',active:false,panel:true});
  rightTabOptions.eventActivateTab = this.onRightTabActivate.bind(this);
  this.clRightTab = new mtmTabs(rightTabOptions);
  this.clRightTab.showTabBar(false);

  this.elRightPanel.appendChild(this.clRightTab.elThis);

  this.clStudyBuilder = new StudyCourseBuilder();
  this.clRightTab.appendPanel(0, this.clStudyBuilder.elThis);

  this.rightActiveIndex = 0;
  this.clRightTab.showPanel(this.rightActiveIndex);
};

StManager.prototype._arrangePanelLayout = function () {
  // 0) 처음에 Panel 을 2개로 한다.
  // 1) document.documentElement.clientWidth 가 1024 ~= 1000 보다 큰 경우 - 2개 로 나눈다.
  if (document.documentElement.clientWidth >= 1000) {
    this.elRightPanel.classList.remove("px-0");
    this._makeTwoPanel();
    if (parseInt(document.documentElement.clientWidth / 3) <= 400) {
      this.elLeftPanel.classList.add("px-0");
      this.clLeftTab.setWideClass(true, "px-1");
      this.clStudyContainer.setWide(true);
    } else {
      this.elLeftPanel.classList.remove("px-0");
      this.clLeftTab.setWideClass(false, "px-1");
      this.clStudyContainer.setWide(false);
    }
  } else {
    // this.elLeftPanel.classList.add('px-0');
    this.elRightPanel.classList.add("px-0");
    this._makeOnePanel();

    if (document.documentElement.clientWidth <= 400) {
      this.elLeftPanel.classList.add("px-0");
      this.clLeftTab.setWideClass(true, "px-1");
      this.clStudyContainer.setWide(true);
    } else {
      this.elLeftPanel.classList.remove("px-0");
      this.clLeftTab.setWideClass(false, "px-1");
      this.clStudyContainer.setWide(false);
    }
  }
  //
};

StManager.prototype._makeOnePanel = function () {
  if (this.panelNum == 1) return;
  else if (this.panelNum == 2) {
    // mtoEvents.emit('OnBeforeSwitchScreen');
    this.panelNum = 1;
    // hide right Panel

    // this.elRightPanel.style.display = 'none';
    // resize left panel (1/3) -> 전체
    this.elRightPanel.classList.remove("col-8", "border-left");
    this.elRightPanel.classList.add("col-12");

    this.elLeftPanel.classList.remove("col-4", "border-right");
    this.elLeftPanel.classList.add("col-12");
    // move right tab panel to left tab panel
    // after movement, make sure video playing

    // this.clLeftTab.addPanel(0,this.clRightTab.getPanel(0));
    // this.clLeftTab.addPanel(1,this.clRightTab.getPanel(1));
    // for other chores

    // mtoEvents.emit('OnOnePanel');
    // mtoEvents.emit('OnAfterSwitchScreen');
  }
};

StManager.prototype._makeTwoPanel = function () {
  if (this.panelNum == 2) return;
  else if (this.panelNum == 1) {
    // mtoEvents.emit('OnBeforeSwitchScreen');
    this.panelNum = 2;
    // resize left panel
    this.elLeftPanel.classList.remove("col-12");
    this.elLeftPanel.classList.add("col-4", "border-right");

    this.elRightPanel.classList.remove("col-12");
    this.elRightPanel.classList.add("col-8", "border-left");

    // show right Panel
    // this.elRightPanel.style.display = '';
    // move left tab append panel to right tab panel
    // after restore make sure video playing
    // this.clRightTab.restorePanels();
    // for other chores
    // mtoEvents.emit('OnTwoPanel');
    // mtoEvents.emit('OnAfterSwitchScreen');
  }
};

///////////////////////////////////////////////////////////////////////
/////////////////////////// Handler ///////////////////////////////////
/**
 * @callback
 * event : 화면사이즈가 바뀔때
 * function : 화면의 Layout 을 정렬한다.
 */
StManager.prototype.onResizeWindowHandler = function () {
  this._arrangePanelLayout();
};

/**
 * @callback
 * event : 왼쪽 Tab 이 click 될때
 * function : 오른쪽 tab 에 해당 작업을 지시
 * @param {int} index - active 된 tab의 index
 */
StManager.prototype.onLeftTabActivate = function (index) {
  // console.log('StManager > onLeftTabActivate : ',index);

  if (this.leftActiveIndex == index) return;
  this.leftActiveIndex = index;

  this.clLeftTab.showPanel(this.leftActiveIndex);

  var title = this.clLeftTab.getTitle(index);
  this.clRightTab.setTitle(0, title);
  this.rightActiveIndex = this.leftActiveIndex;
  this.clRightTab.showPanel(this.rightActiveIndex);
};

/**
 * @callback
 * event : 오른쪽
 * function :
 */
StManager.prototype.onRightTabActivate = function (index) {
  // console.log('StManager > onLeftTabActivate : ',index);
};
