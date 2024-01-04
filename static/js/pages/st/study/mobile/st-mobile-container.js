import { createElement } from "../../../../core/utils/dom-utils";

import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";
import { MtuProgress } from "../../../../core/mtu/progress/mtu-progress";
import { StMobileMenu } from "./st-mobile-menu";

require("./st-mobile-container.css");
export class StMobileContainer {
  constructor(options = {}) {
    this.options = options;
    this.data = this.options?.data ?? null;
    console.log(this.data);

    this.rootCls = "st-mobile-container";
    this.init();
  }

  init() {
    this.clMenu = new StMobileMenu({ data: this.data, onSubItemClick: this.options?.onSubItemClick });

    this.setup();

    this.create();
  }

  setup() {
    const [totalLectures, completedLectures] = this.composeProgress(this.data);
    this.progress = this.getProgressPercentage(totalLectures, completedLectures);
    this.progressRatio = this.getProgressRatio(totalLectures, completedLectures);
  }

  create() {
    this.elThis = createElement("div", { className: this.rootCls });

    this.elSection = this.createSectionNode();
    this.elThis.append(this.elSection);

    this.elMenu = this.clMenu.getElement();
    this.elThis.append(this.elMenu);
  }

  createSectionNode() {
    this.elSection = createElement("section", { className: `${this.rootCls}-section` });

    // header
    this.elSectionHeader = createElement("div", { className: `${this.rootCls}-section-header` });
    this.elSection.append(this.elSectionHeader);

    this.elSectionTitleContainer = createElement("div", { className: `${this.rootCls}-section-title-container` });
    this.elSectionHeader.append(this.elSectionTitleContainer);
    const elTitle = createElement("p", { className: `${this.rootCls}-section-title`, text: "학습 상황" });

    this.elSectionTitleContainer.append(elTitle);

    this.elSectionButtonContainer = createElement("div", { className: `${this.rootCls}-section-button-container` });
    this.elSectionHeader.append(this.elSectionButtonContainer);

    // progress
    this.elSectionProgress = createElement("div", { className: `${this.rootCls}-section-progress` });
    this.elSection.append(this.elSectionProgress);

    // progress > icon
    const elIconContainer = createElement("div", { className: `${this.rootCls}-section-progress-icon-container` });
    this.elSectionProgress.append(elIconContainer);

    const progressIcon = new MtuIcon("book");
    elIconContainer.append(progressIcon);

    // progress > content
    const progressContentContainer = createElement("div", {
      className: `${this.rootCls}-section-progress-content-container`,
    });
    this.elSectionProgress.append(progressContentContainer);

    // progressbar
    this.progressContent = createElement("div", { className: `${this.rootCls}-section-progress-content` });
    progressContentContainer.append(this.progressContent);

    const progressTitle = createElement("p", { className: `${this.rootCls}-section-progress-text`, text: "진도율" });
    this.progressContent.append(progressTitle);

    this.progressContainer = createElement("div", { className: `${this.rootCls}-progress-container` });
    this.progressContent.append(this.progressContainer);

    this.clProgress = new MtuProgress({ percent: this.progress, type: "line", prefixCls: `${this.rootCls}-progress` });
    this.elProgress = this.clProgress.getElement();
    this.progressContainer.append(this.elProgress);

    // progress info(강의 52/52)
    this.progressInfoContainer = createElement("div", {
      className: `${this.rootCls}-section-progress-info-container`,
    });
    progressContentContainer.append(this.progressInfoContainer);

    this.elProgressRatio = createElement("p", {
      className: `${this.rootCls}-progress-ratio`,
      text: `강의 ${this.progressRatio}`,
    });
    this.progressInfoContainer.append(this.elProgressRatio);

    return this.elSection;
  }

  // ============ API ============
  getElement() {
    return this.elThis;
  }

  setProgress() {
    //
  }

  // ============ Handler ============

  // ============ Utils ============
  composeProgress(data) {
    const lectures = data.map((item) => item.children).flat();
    const totalLectures = lectures.length;
    const completedLectures = lectures.filter((item) => item.progress === 100).length;

    return [totalLectures, completedLectures];
  }

  getProgressPercentage(denominator, numerator, digits = 2) {
    return denominator === 0 ? 0 : parseFloat(((numerator / denominator) * 100).toFixed(digits));
  }

  getProgressRatio(denominator, numerator) {
    return `${numerator} / ${denominator}`;
  }
}
