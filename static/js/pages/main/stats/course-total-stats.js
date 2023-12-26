import { createElement } from "../../../core/utils/dom-utils";
import { dashboardHeader } from "../dashboard/common/dashboard-header";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
import { MtuProgress } from "../../../core/mtu/progress/mtu-progress";
import { classNames } from "../../../core/utils/class-names";

require("./course-total-stats.css");
export class CourseTotalStats {
  constructor({ progress, questionCorrectRate, videoCorrectRate, className } = {}) {
    this.progress = typeof progress === "number" ? progress : 0;
    this.questionCorrectRate = typeof questionCorrectRate === "number" ? questionCorrectRate : 0;
    // this.videoCorrectRate = typeof videoCorrectRate === "number" ? videoCorrectRate : 0;
    this.className = typeof className === "string" ? className : null;

    this.init();
  }

  init() {
    this.initVariables();
    this.create();
  }

  initVariables() {
    this.prefixCls = `course-total-stats`;
    this.title = "학습 통계";

    this.stringProgress = `${Math.round(this.progress)}%`;
    this.stringQuestionCorrectRate = `${Math.round(this.questionCorrectRate)}%`;
    this.stringVideoCorrectRate = `${Math.round(this.videoCorrectRate)}%`;
  }

  create() {
    this.elThis = createElement("div", { className: classNames(this.className, this.prefixCls) });

    this.elHeader = this.createHeader();
    this.elBody = this.createBody();

    this.elThis.append(this.elHeader, this.elBody);
    console.log(this.elThis);
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
    //
    const elBody = createElement("div", { className: `${this.prefixCls}-body` });
    const elStatInfoBoxContainer = this.createStatInfoBoxContainer();
    const elProgress = this.createProgress(this.progress);

    elBody.append(elStatInfoBoxContainer, elProgress);
    // elBody.append(elStatInfoBoxContainer);

    return elBody;
  }

  createStatInfoBoxContainer() {
    const elContainer = createElement("div", { className: `${this.prefixCls}-body-info-box-container` });
    //
    // const elVideoCorrectRate = this.createInfoBox("playCircleFilled", "영상 문제 정답률", this.stringVideoCorrectRate);
    const elQuestionCorrectRate = this.createInfoBox("form", "테스트 정답률", this.stringQuestionCorrectRate);

    // elContainer.append(elVideoCorrectRate, elQuestionCorrectRate);
    elContainer.append(elQuestionCorrectRate);

    return elContainer;
  }

  // 왼쪽에는 아이콘, 오른쪽에는 text가 있는 ui
  createInfoBox(icon, title, info) {
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

  setData(data) {
    this.data = data;

    this.progress = this.composeProgress(data);
  }

  // 메가코스
  // 김포 양국고등학교
  // AI 코스웨어
  // 메가코스 국어 체험
  // 어휘테스트

  getElement() {
    return this.elThis;
  }
}
