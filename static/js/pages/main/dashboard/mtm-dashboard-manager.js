import { DashboardRecentCourse } from "./dashboard-recent-course";
import { DashboardTotalStats } from "./dashboard-total-stats";
import { DashboardMonthlySubjectCounts } from "./dashboard-monthly-subject-counts";
import { dashboardTitle } from "./common/dashboard-title";
import { dashboardServices } from "./dashboard-services";

import isString from "../../../core/utils/type/isString";
import { createElement } from "../../../core/utils/dom-utils";

require("../../../../css/pages/main/dashboard/mtm-dashboard-manager.css");
export class MtmDashboardManager {
  /**usertype, studentId, userLogin
   *
   * @param {Object} config
   * @property {string} config.studentId
   * @property {string} config.usertype
   * @property {string} config.userLogin
   */
  constructor(config) {
    this.config = config;
    Object.assign(this, config);

    this.elContents = null; // [element]
    this.elCards = null; // [element]
    this.prefixCls = "mtm-dashboard-manager";

    this.init();
  }

  async init() {
    this.setup();

    this.create();

    this.setData(this.studentId);
  }

  setup() {
    const prefixCls = "dashboard-card";
    const gridSpan8 = "grid-span-8"; // grid-column : span 4;
    this.elContents = [];
    this.clRecentCourse = new DashboardRecentCourse({ prefixCls, ...this.config });
    this.elRecentCourse = this.clRecentCourse.getElement();

    this.clTotalStats = new DashboardTotalStats({ prefixCls });
    this.elTotalStats = this.clTotalStats.getElement();

    this.clMonthlySubject = new DashboardMonthlySubjectCounts({ className: [prefixCls, gridSpan8] });
    this.elMonthlySubject = this.clMonthlySubject.getElement();

    this.elContents.push(this.elRecentCourse, this.elTotalStats, this.elMonthlySubject);
  }

  create() {
    this.elThis = document.createElement("div");
    this.elThis.classList.add(this.prefixCls);

    this.elWrapper = document.createElement("div");
    this.elWrapper.classList.add(`${this.prefixCls}-wrapper`);
    this.elThis.appendChild(this.elWrapper);

    this.elHeader = this.createHeader();
    this.elBody = this.createBody();

    this.elWrapper.append(this.elHeader, this.elBody);
  }

  createHeader() {
    const elHeader = createElement("div", { className: `${this.prefixCls}-header` });

    const elTitle = dashboardTitle({ title: this.title, className: `${this.prefixCls}-title` });
    elHeader.appendChild(elTitle);

    return elHeader;
  }

  createBody() {
    const elBody = createElement("div", { className: `${this.prefixCls}-body` });

    if (Array.isArray(this.elContents) && this.elContents.length > 0) {
      elBody.append(...this.elContents);
    }

    return elBody;
  }

  async setData(studentId) {
    await dashboardServices.set(studentId);

    this.clRecentCourse.setData(dashboardServices.getRecentCourses(3));

    this.clTotalStats.setData({
      courseCount: dashboardServices.getTotalCourseCount(),
      questionAccuracy: dashboardServices.getTotalQuestionAccuracy(),
      progress: dashboardServices.getTotalProgress(),
    });

    this.clMonthlySubject.setData(dashboardServices.getMonthlySubjectCounts());
  }

  getElement() {
    return this.elThis;
  }
}
