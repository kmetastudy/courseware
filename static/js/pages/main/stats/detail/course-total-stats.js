import { createElement } from "../../../../core/utils/dom-utils";
import { dashboardHeader } from "../../dashboard/common/dashboard-header";
import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";
import { MtuProgress } from "../../../../core/mtu/progress/mtu-progress";
import { classNames } from "../../../../core/utils/class-names";
import isNumber from "../../../../core/utils/type/isNumber";

require("./course-total-stats.css");
export class CourseTotalStats {
  constructor({ className } = {}) {
    this.progress = 0;
    this.questionCorrectRate = 0;
    this.videoCorrectRate = 0;
    this.className = typeof className === "string" ? className : null;

    this.elInfoRegistry = {};

    this.init();
  }

  init() {
    this.initVariables();

    this.create();
  }

  initVariables() {
    this.prefixCls = `course-total-stats`;
    this.title = "학습 현황";
  }

  create() {
    this.elThis = createElement("div", { className: classNames(this.className, this.prefixCls) });

    this.elHeader = this.createHeader();
    this.elBody = this.createBody();

    this.elThis.append(this.elHeader, this.elBody);
  }

  createHeader() {
    const elHeader = dashboardHeader({
      className: `${this.prefixCls}-header`,
      title: { title: this.title, className: `${this.prefixCls}-title` },
      anchor: { className: `${this.prefixCls}-anchor` },
    });

    return elHeader;
  }

  createBody() {
    const elBody = createElement("div", { className: `${this.prefixCls}-body` });
    this.elStatInfoBoxContainer = this.createStatInfoBoxContainer();
    this.elProgress = this.createProgress(this.progress);

    elBody.append(this.elStatInfoBoxContainer, this.elProgress);
    return elBody;
  }

  createStatInfoBoxContainer() {
    const elContainer = createElement("div", { className: `${this.prefixCls}-body-info-box-container` });

    // this.elVideoCorrectRate = this.createInfoBox("playCircleFilled", "영상 문제 정답률", this.videoCorrectRate);
    this.elQuestionCorrectRate = this.createInfoBox(
      "form",
      "테스트 정답률",
      `${this.questionCorrectRate}%`,
      "questionCorrectRate",
    );

    // elContainer.append(elVideoCorrectRate, elQuestionCorrectRate);
    elContainer.append(this.elQuestionCorrectRate);

    return elContainer;
  }

  // 왼쪽에는 아이콘, 오른쪽에는 text가 있는 ui
  createInfoBox(icon, title, info, key) {
    const prefixCls = "dashboard-stat-info-box";
    const elInfoBox = createElement("div", { className: prefixCls });

    const elIconWrapper = createElement("div", { className: `${prefixCls}-icon-wrapper` });
    const elIcon = MtuIcon(icon, { style: { fontSize: "32px" } });
    elIconWrapper.appendChild(elIcon);

    const elTextWrapper = createElement("div", { className: `${prefixCls}-text-wrapper` });

    const elTitle = createElement("p", { className: `${prefixCls}-title` });
    elTitle.textContent = title;

    const elInfo = createElement("p", { className: `${prefixCls}-info` });
    elInfo.textContent = info;

    key ? (this.elInfoRegistry[key] = elInfo) : null;

    elTextWrapper.append(elTitle, elInfo);

    elInfoBox.append(elIconWrapper, elTextWrapper);

    return elInfoBox;
  }

  createProgress(progress = 0) {
    const elWrapper = createElement("div", { className: `${this.prefixCls}-progress` });

    const clProgress = new MtuProgress({ type: "circle", percent: progress });
    const elProgress = clProgress.getElement();

    elWrapper.appendChild(elProgress);
    return elWrapper;
  }

  // ============ API ============

  setData({ progress = 0, questionCorrectRate = 0 } = {}) {
    if (isNumber(progress)) {
      this.setProgress(progress);
    }

    if (isNumber(questionCorrectRate)) {
      this.setQuestionCorrectRate(questionCorrectRate);
    }
  }

  setProgress(progress) {
    const newProgress = this.createProgress(progress);
    this.elProgress.replaceWith(newProgress);

    this.elProgress = newProgress;
  }

  setQuestionCorrectRate(questionCorrectRate) {
    this.elInfoRegistry["questionCorrectRate"].textContent = questionCorrectRate;
  }

  getElement() {
    return this.elThis;
  }
}
