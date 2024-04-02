import { createElement } from "../../../core/utils/dom-utils";
import { dashboardHeader } from "./common/dashboard-header";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
import { MtuProgress } from "../../../core/mtu/progress/mtu-progress";
import { classNames } from "../../../core/utils/class-names";

require("../../../../css/pages/main/dashboard/dashboard-total-stats.css");
export class DashboardTotalStats {
  constructor({ prefixCls } = {}) {
    this.prefixCls = prefixCls;
    this.init();
  }

  init() {
    this.initVariables();
    this.create();
  }

  initVariables() {
    this.rootCls = `dashboard-total-stats`;
  }

  create() {
    this.elThis = createElement("div", { className: classNames(this.prefixCls, this.rootCls) });

    this.elHeader = this.createHeader();
    this.elBody = this.createBody();

    this.elThis.append(this.elHeader, this.elBody);
  }

  createHeader() {
    const elHeader = dashboardHeader({
      className: `${this.rootCls}-header`,
      title: { title: this.title, className: `${this.rootCls}-title` },
      // anchor: { className: `${this.rootCls}-anchor` },
    });

    return elHeader;
  }

  createBody() {
    const elBody = createElement("div", { className: `${this.rootCls}-body` });

    const elStatInfoBoxContainer = createElement("div", { className: `${this.rootCls}-body-info-box-container` });
    elBody.append(elStatInfoBoxContainer);

    this.elCourseCount = this.createCourseCountInfo();
    this.elQuestionAccuracy = this.createQuestionAccuracyInfo();
    elStatInfoBoxContainer.append(this.elCourseCount, this.elQuestionAccuracy);

    return elBody;
  }

  createCourseCountInfo(courseCount) {
    const prefixCls = "dashboard-stat-info-box";
    const elInfoBox = createElement("div", { className: prefixCls });

    const elIconWrapper = createElement("div", { className: `${prefixCls}-icon-wrapper` });
    const elIcon = MtuIcon("book", { style: { fontSize: "24px" } });
    elIconWrapper.appendChild(elIcon);

    const elTextWrapper = createElement("div", { className: `${prefixCls}-text-wrapper` });

    const elTitle = createElement("p", { className: `${prefixCls}-title` });
    elTitle.textContent = "강의 수";

    this.elCourseCountText = createElement("p", { className: `${prefixCls}-info` });
    courseCount ? (this.elCourseCountText.textContent = `${courseCount} 개`) : null;

    elTextWrapper.append(elTitle, this.elCourseCountText);

    elInfoBox.append(elIconWrapper, elTextWrapper);
    return elInfoBox;
  }

  createQuestionAccuracyInfo(questionAccuracy) {
    const prefixCls = "dashboard-stat-info-box";
    const elInfoBox = createElement("div", { className: prefixCls });

    const elIconWrapper = createElement("div", { className: `${prefixCls}-icon-wrapper` });
    const elIcon = MtuIcon("form", { style: { fontSize: "24px" } });
    elIconWrapper.appendChild(elIcon);

    const elTextWrapper = createElement("div", { className: `${prefixCls}-text-wrapper` });

    const elTitle = createElement("p", { className: `${prefixCls}-title` });
    elTitle.textContent = "테스트 정답률";

    this.elQuestionAccuracyText = createElement("p", { className: `${prefixCls}-info` });
    questionAccuracy ? (this.elQuestionAccuracyText.textContent = `${questionAccuracy} %`) : null;

    elTextWrapper.append(elTitle, this.elQuestionAccuracyText);

    elInfoBox.append(elIconWrapper, elTextWrapper);
    return elInfoBox;
  }

  createProgressCircle(progress = 0) {
    const elWrapper = createElement("div", { className: `${this.rootCls}-progress-wrapper` });

    this.clProgress = new MtuProgress({ prefixCls: `${this.rootCls}-progress`, type: "circle", percent: progress });
    const elProgress = this.clProgress.getElement();

    elWrapper.append(elProgress);
    return elWrapper;
  }

  // ============ API ============
  getElement() {
    return this.elThis;
  }

  setData({ courseCount, questionAccuracy, progress }) {
    courseCount && this.setCourseCount(courseCount);
    questionAccuracy && this.setQuestionAccuracy(questionAccuracy);

    if (progress) {
      this.setProgressCircle(progress);
    }
  }

  setCourseCount(courseCount) {
    this.elCourseCountText.textContent = `${courseCount} 개`;
  }

  setQuestionAccuracy(questionAccuracy) {
    this.elQuestionAccuracyText.textContent = `${questionAccuracy}%`;
  }

  setProgressCircle(progress) {
    const nextProgressCircle = this.createProgressCircle(progress);
    this.elProgress ? this.elProgress.replaceWith(nextProgressCircle) : this.elBody.append(nextProgressCircle);

    this.elProgress = nextProgressCircle;
  }
}
