import { createElement } from "../../../core/utils/dom-utils";
import { classNames } from "../../../core/utils/class-names";
import { StudyResultServices } from "./study-result-services";

import { dashboardHeader } from "../dashboard/common/dashboard-header";

import { RecentChapter } from "./recent-chapter";
import { ChapterStatsChart } from "./chapter-stats-chart";
import { CourseResultsTable } from "./course-results-table";
import { CourseTotalStats } from "./course-total-stats";

require("../../../../css/pages/main/stats/stats-manager.css");
export class StatsManager {
  static #studyResultEndpoint = "../st/api/study_result/properties/";
  /**
   *
   * @param {Object} options
   * @param {string} options.studentId UUID format string
   * @param {string} options.courseId UUID format string
   */
  constructor(options = {}) {
    options.courseId = "9b4400f7-f7ad-4442-a4fe-380436d7a2a8";
    if (!options.studentId || !options.courseId) {
      throw new Error(`You need both student id and course id`);
    }

    Object.assign(this, options);
    // TEST:
    this.courseId = "9b4400f7-f7ad-4442-a4fe-380436d7a2a8";

    this.prefixCls = "stats-manager";
    this.cardPrefixCls = "dashboard-card";
    this.largeLayoutCls = "grid-span-8";
    this.smallLayoutCls = "grid-span-4";
    this.title = "코스 통계";

    this.init();
  }

  init() {
    this.setup();
    this.create();

    this.getData(this.studentId, this.courseId);
  }

  setup() {
    this.clStudyResultServices = null;

    this.clChapterStats = new ChapterStatsChart(classNames([this.cardPrefixCls, `grid-span-${8}`]));
    this.elChapterStats = this.clChapterStats.getElement();

    this.clRecentChapter = new RecentChapter({ className: "dashboard-card" });
    this.elRecentChapter = this.clRecentChapter.getElement();

    this.clCourseResultsTable = new CourseResultsTable(classNames([this.cardPrefixCls, `grid-span-${8}`]));
    this.elCourseResultsTable = this.clCourseResultsTable.getElement();

    this.clCourseTotalStats = null;
  }

  create() {
    this.elThis = createElement("div", { className: this.prefixCls });

    this.elWrapper = createElement("div", { className: `${this.prefixCls}-wrapper` });
    this.elThis.appendChild(this.elWrapper);

    this.elHeader = dashboardHeader({
      className: `${this.prefixCls}-header`,
      title: { title: this.title, className: `${this.prefixCls}-title` },
    });

    this.elBody = createElement("div", { className: `${this.prefixCls}-body` });
    this.elBody.append(this.elRecentChapter, this.elChapterStats, this.elCourseResultsTable);

    this.elWrapper.append(this.elHeader, this.elBody);
  }

  // createCard(child, gridSpan) {
  //   const cardPrefixCls = "dashboard-card";
  //   const card = createElement("div", { className: classNames([cardPrefixCls, `grid-span-${gridSpan}`]) });

  //   card.append(child);
  //   return card;
  // }

  // ============ URL ============
  urlGetStudyResult(studentId, courseId) {
    try {
      const param = { student_id: studentId, course_id: courseId };
      return axios
        .get(StatsManager.#studyResultEndpoint, {
          params: param,
        })
        .then((res) => {
          if (res?.data) {
            return res.data;
          } else {
            console.log(res?.status);
          }
        });
    } catch (error) {
      throw new Error("CourseDashboard > get result: ", error);
    }
  }

  // ============ API ============
  async getData() {
    const data = await this.urlGetStudyResult(this.studentId, this.courseId);
    if (data) {
      this.studyResultData = data;
      this.clStudyResultServices = new StudyResultServices(data);
      this.clStudyResultServices.getRecentChapters();

      this.totalAccuracyRate = this.clStudyResultServices.composeTotalAccuracyRate();
      this.totalProgress = this.clStudyResultServices.composeTotalProgress();

      this.renderDashboard(data);
    }
  }

  renderDashboard(data) {
    this.clRecentChapter.setData(data);
    this.clChapterStats.setData(data);
    this.clCourseResultsTable.setData(data);

    //
    this.clCourseTotalStats = new CourseTotalStats({
      progress: this.totalProgress,
      questionCorrectRate: this.totalAccuracyRate,
      className: classNames([this.cardPrefixCls, `grid-span-${4}`]),
    });

    this.elCourseTotalStats = this.clCourseTotalStats.getElement();
    this.elBody.prepend(this.elCourseTotalStats);
  }

  getElement() {
    return this.elThis;
  }
}
