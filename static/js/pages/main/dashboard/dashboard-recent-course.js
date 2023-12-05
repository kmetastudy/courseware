import { createElement } from "../../../core/utils/dom-utils";
import { MtuButton } from "../../../core/mtu/button/mtu-button";
import { dashboardHeader } from "./common/dashboard-header";
import { classNames } from "../../../core/utils/class-names";

require("../../../../css/pages/main/dashboard/dashboard-recent-course.css");
export class DashboardRecentCourse {
  constructor({ className, courseTitle, progressText } = {}) {
    const props = {
      courseTitle: typeof courseTitle === "string" ? courseTitle : "중 3-1",
      progressText: typeof progressText === "string" ? progressText : "",
      className: typeof className === "string" ? className : null,
    };

    this.props = props;
    this.init();
  }

  async init() {
    this.initVariables();
    this.prepareData();
    this.render();
  }

  initVariables() {
    this.title = "최근 학습 강의";
    this.prefixCls = "dashboard-recent-course";
  }

  async prepareData() {
    // const recentCourse = this.urlGetRecentCourse();

    this.courseTitle = "중 3-1";
    this.courseUrl = "#";
    this.progressText = null;
    this.progressPrecent = null;
    this.recentTime = null;
  }

  render() {
    this.elThis = createElement("div", { className: classNames(this.props.className, this.prefixCls) });

    this.elHeader = this.createHeader();
    this.elBody = this.createBody();
    this.elFooter = this.createFooter();

    this.elThis.append(this.elHeader, this.elBody, this.elFooter);
  }

  createHeader() {
    // const elHeader = createElement("div", { className: `${this.prefixCls}-header` });

    // const elTitle = dashboardTitle({ title: this.title, className: `${this.prefixCls}-title` });
    // const elAnchor = dashboardAnchor({ className: `${this.prefixCls}-anchor` });

    // elHeader.append(elTitle, elAnchor);
    const elHeader = dashboardHeader({
      className: `${this.prefixCls}-header`,
      title: {
        title: this.title,
        className: `${this.prefixCls}-title`,
      },
      anchor: {
        className: `${this.prefixCls}-anchor`,
      },
    });
    return elHeader;
  }

  createBody() {
    const elBody = createElement("div", { className: `${this.prefixCls}-body` });

    const elCourseTitle = createElement("a", {
      className: `${this.prefixCls}-course-title`,
      attributes: { href: this.courseUrl },
    });
    elCourseTitle.textContent = this.courseTitle;

    // const elProgress = this.createProgress();
    // const elProgressBar = this.createProgressBar();

    elBody.append(elCourseTitle);
    // elBody.append(elCourseTitle, elProgress, elProgressBar);
    return elBody;
  }

  createFooter() {
    const elFooter = createElement("div", { className: `${this.prefixCls}-footer` });

    const elWrapper = createElement("div", { className: `${this.prefixCls}-footer-button-container` });

    const studyButton = new MtuButton({
      text: "바로 학습",
      size: "large",
      onClick: () => (window.location.href = this.courseUrl),
    });
    const elStudyButton = studyButton.getElement();

    elFooter.appendChild(elWrapper);
    elWrapper.appendChild(elStudyButton);

    return elFooter;
  }

  getElement() {
    return this.elThis;
  }
}
