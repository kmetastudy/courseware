import { createElement } from "../../../core/utils/dom-utils";
import { dashboardHeader } from "./common/dashboard-header";
import { classNames } from "../../../core/utils/class-names";
import isString from "../../../core/utils/type/isString";
import { MtuProgress } from "../../../core/mtu/progress/mtu-progress";
import { removeChildNodes } from "../../../core/utils/remove-child-nodes";

require("../../../../css/pages/main/dashboard/dashboard-recent-course.css");
export class DashboardRecentCourse {
  constructor({ prefixCls } = {}) {
    this.prefixCls = isString(prefixCls) ? prefixCls : null;

    this.init();
  }

  async init() {
    this.initVariables();

    this.create();
  }

  initVariables() {
    this.title = "최근 학습 강의";
    this.rootCls = "dashboard-recent-course";
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
      title: {
        title: this.title,
        className: `${this.rootCls}-title`,
      },
      // anchor: {
      //   className: `${this.rootCls}-anchor`,
      // },
    });
    return elHeader;
  }

  createBody() {
    const elBody = createElement("div", { className: `${this.rootCls}-body` });

    return elBody;
  }

  setData(data) {
    // var d = [{ id, title, progress, lectureCount, completedLectureCount, information, link }];
    removeChildNodes.removeAll(this.elBody);

    this.elItems = data.map((item) => {
      return this.createCourseItem({ ...item });
    });

    this.elBody.append(...this.elItems);
  }

  createCourseItem({ id, title, progress, lectureCount, completedLectureCount, information, link }) {
    const elItem = createElement("div", { className: `${this.rootCls}-item` });

    // 1. title
    const elTitle = createElement("a", {
      className: `${this.rootCls}-item-title`,
      attributes: {
        href: link,
      },
      text: title,
    });

    // 2. progress text
    const elProgressTextWrapper = createElement("div", {
      className: `${this.rootCls}-item-progress-text-wrapper`,
    });

    const elProgressText = createElement("p", {
      className: `${this.rootCls}-item-progress-text`,
      text: this.formatProgressText(completedLectureCount, lectureCount, progress),
    });

    const elStudyDate = createElement("time", {
      className: `${this.rootCls}-item-study-date`,
      text: this.compareDates(information.recent_timestamp, new Date()),
    });

    elProgressTextWrapper.append(elProgressText, elStudyDate);

    // 3. progressbar
    const clProgressBar = new MtuProgress({
      prefixCls: `${this.rootCls}-progressbar`,
      type: "line",
      percent: progress,
    });

    const elProgressBar = clProgressBar.getElement();

    elItem.append(elTitle, elProgressTextWrapper, elProgressBar);

    return elItem;
  }

  getElement() {
    return this.elThis;
  }

  // ============ Utils ============
  formatProgressText(completedLectureCount, lectureCount, progress) {
    return `진도율: ${completedLectureCount}강/${lectureCount}강 (${progress}%)`;
  }

  compareDates(date1, date2, withoutSuffix = false) {
    // return date2 ? dayjs(date1).from(dayjs(date2), withoutSuffix) : dayjs(date1).fromNow(withoutSuffix);
    return dayjs(date1).from(dayjs(date2), withoutSuffix);
  }
}
