import { dashboardServices } from "./dashboard-services";

import { RecentCourseCard } from "./dashboard/recent-course/recent-course-card";
import { CourseStatusChart } from "./dashboard/course-status-chart/CourseStatusChart";
import { MonthlySubjectChart } from "./dashboard/monthly-subject-chart/MonthlySubjectChart";

import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
import elem from "../../../core/utils/elem/elem";

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
    this.create();

    this.setData(this.studentId);
  }

  create() {
    this.elThis = elem("div", {
      class: "grid grid-cols-12 grid-rows-[min-content] gap-x-6 gap-y-12 p-4 lg:gap-x-12 lg:p-10 hidden",
    });

    // Header
    this.elHeader = elem("div", {
      class: "col-span-12 flex items-center gap-2 lg:gap-4",
    });
    this.elThis.append(this.elHeader);

    this.elLabel = elem("label", {
      for: "dashboard-drawer",
      class: "btn btn-square btn-ghost drawer-button lg:hidden",
    });
    this.elHeader.append(this.elLabel);

    this.elIcon = MtuIcon("menu");
    this.elLabel.append(this.elIcon);

    this.elTitleWrapper = elem("div", { class: "grow" });
    this.elHeader.append(this.elTitleWrapper);

    this.elTitle = elem("h1", { class: "font-bold lg:text-2xl" }, "Dashboard");
    this.elTitleWrapper.append(this.elTitle);

    // 최근 학습 강의
    this.clRecentCourseCard = new RecentCourseCard();
    this.elRecentCourseCard = this.clRecentCourseCard.getElement();
    this.elThis.append(this.elRecentCourseCard);

    // 학습 현황
    this.clCourseStatusChart = new CourseStatusChart();
    this.elCourseStatusChart = this.clCourseStatusChart.getElement();
    this.elThis.append(this.elCourseStatusChart);

    // 월별 수강 강의
    this.clMonthlySubjectChart = new MonthlySubjectChart();
    this.elMonthlySubjectChart = this.clMonthlySubjectChart.getElement();
    this.elThis.append(this.elMonthlySubjectChart);
  }

  async setData(studentId) {
    await dashboardServices.set(studentId);

    const studyResults = dashboardServices.getStudyResults();

    this.clRecentCourseCard.setData(dashboardServices.getRecentCourses(3));

    this.clCourseStatusChart.setData(studyResults);

    this.clMonthlySubjectChart.setData(dashboardServices.getMonthlySubjectCounts());
  }

  getElement() {
    return this.elThis;
  }
}
