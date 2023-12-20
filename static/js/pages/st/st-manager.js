import { mtmTabs } from "../../core/ui/mtm-tabs";
import { StudyCourseContainer } from "./study/study-course-container.js";
import { StudyCourseBuilder } from "./study/study-course-builder.js";
// import { StudyCourseBuilder as StudyCourseBuilderNew } from "./study/study-course-builder-new.js";
// import { StudyCourseContainer as StudyCourseContainerNew } from "./study/study-course-container-new.js";

// Test
import { MtmDashboardManager } from "../main/dashboard/mtm-dashboard-manager.js";
import { mtmSideMenu } from "../../core/ui/sideMenu/mtm-side-menu.js";
import { CourseDashboard } from "../main/dashboard/course/course-dashboard.js";

require("../../../css/pages/st/st-manager.css");
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

  // this.test();

  // this._init();
  this.init();
};

StManager.prototype.init = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("st-manager");

  this.options.rootElement = this.elThis;
  this.clStudyContainer = new StudyCourseContainer(this.options);
  this.clStudyBuilder = new StudyCourseBuilder(this.options);

  // this.elThis.appendChild(this.clStudyContainer.elSidebar);
  this.elThis.appendChild(this.clStudyContainer.elThis);
  this.elThis.appendChild(this.clStudyBuilder.elThis);
};

StManager.prototype.test = function () {
  this.elThis = document.createElement("div");
  this.elThis.classList.add("main-test");
  this.elThis.style.display = "flex";
  this.elThis.style.justifyContent = "center";

  const sideItems = [
    { title: "대시보드" },
    { title: "프로필", onClick: () => (window.location.href = "/"), icon: "user" },
    { title: "학습 관리", children: [{ title: "내 학습" }, { title: "수강전 문의" }] },
    {
      title: "수강신청 관리",
      children: [
        { title: "수강바구니" },
        { title: "좋아요" },
        { title: "쿠폰함" },
        { title: "포인트" },
        { title: "구매내역" },
      ],
    },
    { title: "설정", children: [{ title: "계정 정보" }, { title: "알림 설정" }] },
  ];
  const clSide = new mtmSideMenu({ item: sideItems });
  const elSide = clSide.getElement();
  this.elThis.appendChild(elSide);

  this.wrapper = document.createElement("div");
  this.wrapper.classList.add("dashboard-test-wrapper");
  this.wrapper.style.display = "flex";
  this.wrapper.style.justifyContent = "center";
  this.elThis.appendChild(this.wrapper);

  const clDashboard = new MtmDashboardManager();
  const clCourseDashboard = new CourseDashboard(this.options);
  // this.elThis.appendChild(clDashboard.getElement());
  this.wrapper.appendChild(clCourseDashboard.getElement());
  // this.wrapper.appendChild(clDashboard.getElement());
};

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

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

  ////////////////
  // TEST SIDEBAR
  // this.clSidebar = new MtuSidebar({
  //   items: [
  //     { title: "학습하기", icon: "form" },
  //     { title: "통계", icon: "barChart" },
  //   ],
  // });
  // this.elThis.appendChild(this.clSidebar.getElement());

  ////////////////
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

  this.clStudyContainer = new StudyCourseContainer(this.options);
  // this.clStudyContainer = new StudyCourseContainerNew(this.options);
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

  this.clStudyBuilder = new StudyCourseBuilder(this.options);
  // this.clStudyBuilder = new StudyCourseBuilderNew({ courseId: this.options.courseId });
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

// 왼 오
//  1. 왼 -> builder
//  2. 오 -> sidebar -> container

// sidebar ->
//
// root
//  main (bulider)
//  sidebar
//    학습하기 : click -> aside(container) apper!
//    (통계)
//  aside(container)
//  aside(others..)

// aside가 sidebar안에 있는게 아니네?

// aside
// aside(공통) 기능
//  우측 상단 X클릭 -> 닫기
// aside (container) 기능
// scroll to item
