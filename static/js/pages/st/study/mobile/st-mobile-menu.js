import { createElement } from "../../../../core/utils/dom-utils";
import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";
import { MtuProgress } from "../../../../core/mtu/progress/mtu-progress";

require("./st-mobile-menu.css");
export class StMobileMenu {
  static initNum = 0;
  constructor(options = {}) {
    this.options = options;
    this.data = this.options?.data;
    this.onSubItemClick = this.options?.onSubItemClick;

    this.videoIcon = "stVideo";
    this.questionIcon = "stQuestion";
    this.progressTitle = "진도율";
    this.pointTitle = "점수";
    this.rootCls = "st-mobile-menu";
    this.init();
  }

  init() {
    this.initNum++;

    this.create();
  }

  create() {
    this.elThis = createElement("div", { className: this.rootCls, attributes: { "data-acoordion": true } });

    this.data.forEach((data, index) => {
      const item = this.createItem(data, index);
      this.elThis.append(item);
    });
  }

  // ============ API ============
  getElement() {
    return this.elThis;
  }

  createItem(data, index) {
    const item = createElement("div", { className: `${this.rootCls}-item` });
    const itemButton = this.createItemButton(data, index);
    item.append(itemButton);
    if (data.children) {
      const subItemPanel = createElement("div", { className: `${this.rootCls}-subitem-panel` });
      item.append(subItemPanel);

      const subItemWrapper = createElement("div", { className: `${this.rootCls}-subitem-wrapper` });
      subItemPanel.append(subItemWrapper);

      const subItemRoot = createElement("ul", { className: `${this.rootCls}-subitem-root` });
      subItemWrapper.append(subItemRoot);

      data.children.forEach((childData, subIndex) => {
        const subItem = this.createSubItem(childData, index, subIndex);
        subItem.addEventListener("click", this.handleSubItemClick.bind(this, subItem, childData));
        subItemRoot.append(subItem);
      });
    }

    return item;
  }

  createItemButton(data, index) {
    const button = createElement("button", {
      className: `${this.rootCls}-item-button`,
      attributes: {
        type: "button",
        "data-accordion-control": true,
        "aria-expanded": false,
        // id: `${this.initNum}`,
      },
    });

    button.addEventListener("click", this.handleButtonClick.bind(this, button));

    const { title, progress } = this.composeItemText(data, index);

    const expandIcon = new MtuIcon("down");
    button.append(expandIcon);

    const textContainer = createElement("span", { className: `${this.rootCls}-item-text-container` });
    button.append(textContainer);

    const textWrapper = createElement("div", { className: `${this.rootCls}-item-text-wrapper` });
    textContainer.append(textWrapper);

    const itemTitle = createElement("p", { className: `${this.rootCls}-item-title`, text: title });

    const itemProgress = createElement("p", { className: `${this.rootCls}-item-progress`, text: progress });

    textWrapper.append(itemTitle, itemProgress);

    return button;
  }

  // SubItem
  createSubItem(data, index, subIndex) {
    const { title, type, units, progress, point } = data;
    // const icon = type === 12 ? "stLesson" : "stTestum";
    const { videoNum, questionNum } = this.getContentNum(units);

    const elSubItem = createElement("div", { className: `${this.rootCls}-subitem` });

    // const elSubItemIcon = this.createSubItemIcon(icon);
    const elSubItemInfo = this.createSubItemInfo({ title, videoNum, questionNum });
    const elSubItemResult = this.createSubItemResult({ progress, point });

    // elSubItemIcon ? elSubItem.appendChild(elSubItemIcon) : null;
    elSubItemInfo ? elSubItem.appendChild(elSubItemInfo) : null;
    elSubItemResult ? elSubItem.appendChild(elSubItemResult) : null;

    return elSubItem;
  }

  // createSubItemIcon(icon) {
  //   const iconStyle = {
  //     fontSize: "2em",
  //     color: "rgba(152, 109, 80)",
  //   };
  //   const elIcon = MtuIcon(icon, { style: iconStyle });
  //   return elIcon;
  // }

  createSubItemInfo({ title, videoNum, questionNum }) {
    const elSubItemInfo = createElement("div", { className: `${this.rootCls}-subitem-info` });

    const elSubItemTitle = createElement("p", { className: `${this.rootCls}-subitem-info-title`, text: title });

    elSubItemInfo.appendChild(elSubItemTitle);
    if (videoNum > 0 || questionNum > 0) {
      const elSubItemDetail = createElement("div", { className: `${this.rootCls}-subitem-info-detail` });

      if (videoNum > 0) {
        const elVideo = createElement("div");
        const elVideoIcon = MtuIcon(this.videoIcon);
        const elVideoTimeText = createElement("p", { text: `${videoNum} 개` });
        elVideo.appendChild(elVideoIcon);
        elVideo.appendChild(elVideoTimeText);

        elSubItemDetail.appendChild(elVideo);
      }
      if (questionNum > 0) {
        const elQuestion = createElement("div");
        const elQuestionIcon = MtuIcon(this.questionIcon);

        const elQuestionNumText = createElement("p", { text: `${questionNum}문제` });
        elQuestion.appendChild(elQuestionIcon);
        elQuestion.appendChild(elQuestionNumText);
        elSubItemDetail.appendChild(elQuestion);
      }

      elSubItemInfo.appendChild(elSubItemDetail);
    }

    return elSubItemInfo;
  }

  createSubItemResult({ progress = 0, point = 0 }) {
    const elSubItemResult = createElement("div", { className: `${this.rootCls}-subitem-result` });

    const elProgress = this.createSubItemProgress(progress);
    const elPoint = this.createSubItemPoint(point);

    elProgress ? elSubItemResult.appendChild(elProgress) : null;
    elPoint ? elSubItemResult.appendChild(elPoint) : null;
    return elSubItemResult;
  }

  createSubItemProgress(percent) {
    const elSubItemProgress = createElement("div", { className: `${this.rootCls}-subitem-progress` });

    const elTitle = createElement("p", { text: "진도율" });

    const clProgress = new MtuProgress({ percent, size: 32 });
    const elProgress = clProgress.getElement();
    elProgress.classList.add("subitem-progress");

    elSubItemProgress.append(elTitle, elProgress);
    return elSubItemProgress;
  }

  createSubItemPoint(percent) {
    const elSubItemPoint = createElement("div", { className: `${this.rootCls}-subitem-point` });

    const elTitle = createElement("p", { text: "점수" });

    const clPoint = new MtuProgress({ percent, size: 32 });
    const elPoint = clPoint.getElement();
    elPoint.classList.add("subitem-point");

    elSubItemPoint.append(elTitle, elPoint);
    return elSubItemPoint;
  }
  // ============ Handler ============
  handleButtonClick(buttonNode, evt) {
    evt.stopPropagation();

    const isAriaExpanded = buttonNode.getAttribute("aria-expanded");
    const ariaExpanded = isAriaExpanded === "true" ? "false" : "true";
    buttonNode.setAttribute("aria-expanded", ariaExpanded);
  }

  handleSubItemClick(element, data, evt) {
    console.log(element, data);
    if (this.elSelectedSubItem) {
      this.elSelectedSubItem.classList.remove("activate");
    }

    element?.classList.add("activate");
    this.elSelectedSubItem = element;
    if (this.onSubItemClick) {
      this.onSubItemClick(data);
      this.handleScrollToTop();
    }
  }

  handleScrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ============ Utils ============
  composeItemText(data, index) {
    const title = `챕터 ${index}. ${data.title}`;
    const subItemCount = data.children.length;
    const completedSubItemCount = data.children.filter((child) => child.progress && child.progress === 100).length;
    const progress = `${completedSubItemCount}강 / ${subItemCount}강`;

    return { title, progress };
  }

  getContentNum(units) {
    let videoNum = 0;
    let questionNum = 0;
    units.forEach((unit) => {
      videoNum += unit.types.filter((value) => value === "v").length;
      questionNum += unit.types.filter((value) => value === "q").length;
    });

    return { videoNum, questionNum };
  }

  createTextElement(text, className) {
    const element = document.createElement("p");
    element.textContent = text;
    className ? element.classList.add(className) : null;
    return element;
  }
}
