import isHTMLNode from "../../../../core/utils/type/isHTMLNode";
import isString from "../../../../core/utils/type/isString";
import isFunction from "../../../../core/utils/type/isFunction";
import { createElement } from "../../../../core/utils/dom-utils";

import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";
import { MtuProgress } from "../../../../core/mtu/progress/mtu-progress";
import { mtoEvents } from "../../../../core/utils/mto-events";

require("../../../../../css/pages/st/study/mobile/study-mobile-info.css");
export class StudyMobileInfo {
  constructor({ headerText, contentText, progress, toolbarItems, isOpen } = {}) {
    this.headerText = headerText ?? null;
    this.contentText = contentText ?? null;
    this.progress = progress ?? null;
    this.toolbarItems = toolbarItems ?? null; // [{text, icon, onClick}]
    this.isOpen = isOpen ?? false;

    this.init();
  }

  init() {
    this.initVariables();

    this.create();

    this.initEvents();

    if (this.headerText) {
      this.setHeaderText(this.headerText);
    }

    if (this.contentTitle) {
      this.setContentTitle(this.contentTitle);
    }

    if (this.progress) {
      this.setProgressText(this.progress);
      this.setProgress(this.progress);
    }

    if (this.isOpen) {
      this.openCollapse();
    }
  }

  initVariables() {
    this.prefixCls = "study-mobile-info";
    this.toolbarItemNodes = [];

    const defaultToolbarItems = [
      { text: "나가기", icon: MtuIcon("rollback"), onClick: null },
      { text: "봤어요", icon: MtuIcon("check"), onClick: null },
      { text: "이전 수업", icon: MtuIcon("arrowLeft"), onClick: null },
      { text: "다음 수업", icon: MtuIcon("arrowRight"), onClick: null },
    ];

    if (!this.toolbarItems) {
      this.toolbarItems = defaultToolbarItems;
    }
  }

  initEvents() {
    mtoEvents.on("OnChangeCourseContent", this.handleChangeCourseContent.bind(this));
    mtoEvents.on("OnChangeProgressPoint", this.handleProgressPointChange.bind(this));
  }

  // ============ Handler ============
  handleChangeCourseContent({ title, course_id, content_id }) {
    this.setHeaderText(title);
    //
  }
  handleProgressPointChange({ content_id, progress, point } = {}) {
    const progressText = this.composeProgressText(progress);
    this.setProgressText(progressText);
    this.setProgress(progress);
    // const resultData = this.resultData.filter((data) => data.id === content_id)[0];
    // const [prevProgress, prevPoint] = [resultData.progress, resultData.point];
    // prevProgress !== progress ? this.updateProgress(content_id, progress) : null;
    // prevPoint !== point ? this.updatePoint(content_id, point) : null;
  }

  // ============ Create Node ============
  create() {
    this.elThis = createElement("div", { className: this.prefixCls });

    this.collapseNode = this.createCollapse();

    this.toolBarNode = this.createToolBar(this.toolbarItems);

    this.elThis.append(this.collapseNode, this.toolBarNode);
  }

  createCollapse() {
    const prefixCls = `${this.prefixCls}-collapse`;
    this.elCollapse = createElement("div", { className: prefixCls });

    // header
    this.elHeader = createElement("div", {
      className: `${prefixCls}-header`,
      attributes: {
        "aria-expanded": true,
        "aria-disabled": false,
        role: "button",
        tabIndex: 0,
      },
    });

    this.elIconWrapper = createElement("div", {
      className: `${prefixCls}-icon-wrapper`,
    });

    this.elCollapseIcon = MtuIcon("right");
    this.elIconWrapper.append(this.elCollapseIcon);

    this.elHeaderText = createElement("span", { className: `${prefixCls}-header-text` });
    this.elHeader.append(this.elHeaderText);

    // content
    this.elContent = createElement("div", { className: `${prefixCls}-content` });

    this.elContentBox = createElement("div", { className: `${prefixCls}-content-box` });
    this.elContent.append(this.elContentBox);

    this.elContentText = createElement("div");
    this.elContentBox.append(this.elContentText);

    this.elContentTitle = createElement("p");
    this.elContentExpiration = createElement("p");
    this.elContentProgressText = createElement("p");
    this.elContentText.append(this.elContentTitle, this.elContentExpiration, this.elContentProgressText);

    this.elCollapse.append(this.elHeader, this.elContent);
    return this.elCollapse;
  }

  // ToolBar
  createToolBar(items) {
    console.log(items);
    const prefixCls = `${this.prefixCls}-toolbar`;
    this.elToolBar = createElement("ul", { className: prefixCls });

    items.forEach((itemOption) => {
      const elItem = this.createToolBarItem(itemOption);
      this.elToolBar.append(elItem);
    });

    return this.elToolBar;
  }

  createToolBarItem({ icon, text, onClick }) {
    const elItem = createElement("li");

    const wrapper = createElement("span", { className: `${this.prefixCls}-toolbar-item` });

    if (isHTMLNode(icon)) {
      wrapper.append(icon);
    } else if (isString(icon)) {
      const iconNode = MtuIcon(icon);
      isHTMLNode(iconNode) ? wrapper.append(icon) : null;
    }

    if (isString(text)) {
      const textNode = createElement("span");
      textNode.textContent = text;
      wrapper.append(textNode);
    }

    isFunction(onClick) ? elItem.addEventListener("click", onClick) : null;

    this.toolbarItemNodes.push(elItem);

    elItem.append(wrapper);

    return elItem;
  }

  // ============ API ============
  getElement() {
    return this.elThis;
  }

  setHeaderText(text) {
    this.elHeaderText.textContent = text;
    this.headerText = text;
  }

  setContentTitle(text) {
    this.elContentTitle.textContent = text;
    this.contentTitle = text;
  }

  setContentExpiration(text) {
    this.elContentExpiration.textContent = text;
    this.contentExpiration = text;
  }

  setProgressText(text) {
    this.elContentProgressText.textContent = text;
    this.contentProgressText = text;
  }

  setProgress(progress) {
    const clProgress = new MtuProgress({
      percent: progress,
      type: "line",
    });

    const elProgress = clProgress.getElement();

    if (this.elProgress) {
      this.elProgress.replaceWith(elProgress);
    } else {
      this.elContentBox.append(elProgress);
    }

    this.elProgress = elProgress;
    this.progress = progress;
  }

  composeProgressText(percent) {
    //
  }
}
