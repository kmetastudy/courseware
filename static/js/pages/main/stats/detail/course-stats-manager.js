import { createElement } from "../../../../core/utils/dom-utils";
import { classNames } from "../../../../core/utils/class-names";
import { CourseStatsServices } from "./course-stats-services";

import { dashboardHeader } from "../../dashboard/common/dashboard-header";

import { RecentChapter } from "./recent-chapter";
import { ChapterStatsChart } from "./chapter-stats-chart";
import { CourseResultsTable } from "./course-results-table";
import { CourseTotalStats } from "./course-total-stats";

require("../../../../../css/pages/main/stats/detail/course-stats-manager.css");
export class CourseStatsManager {
  constructor(options = {}) {
    this.options = options;
    // TEST:
    // this.courseId = "9b4400f7-f7ad-4442-a4fe-380436d7a2a8";

    this.prefixCls = "course-stats-manager";
    this.cardPrefixCls = "dashboard-card";
    this.largeLayoutCls = "grid-span-8";
    this.smallLayoutCls = "grid-span-4";
    this.title = this.options?.title ?? "코스 통계";

    this.init();
  }

  init() {
    this.setup();

    this.create();
  }

  setup() {
    this.services = new CourseStatsServices();

    this.clChapterStats = new ChapterStatsChart(classNames([this.cardPrefixCls, `grid-span-${8}`]));
    this.elChapterStats = this.clChapterStats.getElement();

    this.clRecentChapter = new RecentChapter({ className: "dashboard-card" });
    this.elRecentChapter = this.clRecentChapter.getElement();

    this.clCourseResultsTable = new CourseResultsTable(classNames([this.cardPrefixCls, `grid-span-${8}`]));
    this.elCourseResultsTable = this.clCourseResultsTable.getElement();

    this.clCourseTotalStats = new CourseTotalStats({ className: classNames([this.cardPrefixCls, `grid-span-${4}`]) });
    this.elCourseTotalStats = this.clCourseTotalStats.getElement();
  }

  create() {
    this.elThis = createElement("div", { className: this.prefixCls });

    this.elWrapper = createElement("div", { className: `${this.prefixCls}-wrapper` });
    this.elThis.appendChild(this.elWrapper);

    this.elHeader = dashboardHeader({
      className: `${this.prefixCls}-header`,
      title: { title: "", className: `${this.prefixCls}-title` },
    });

    this.elBody = createElement("div", { className: `${this.prefixCls}-body` });
    this.elBody.append(this.elRecentChapter, this.elCourseTotalStats, this.elChapterStats, this.elCourseResultsTable);

    this.elWrapper.append(this.elHeader, this.elBody);
  }

  // ============ API ============
  setData(data) {
    this.services.setData(data);
    const property = this.services.getProperty();

    this.services.getRecentChapters();
    this.totalAccuracyRate = this.services.composeTotalAccuracyRate();
    this.totalProgress = this.services.composeTotalProgress();

    this.clRecentChapter.setData(property);
    this.clChapterStats.setData(property);
    this.clCourseResultsTable.setData(property);
    this.clCourseTotalStats.setData({ progress: this.totalProgress, questionCorrectRate: this.totalAccuracyRate });
  }

  setTitle(title) {
    this.elHeader.textContent = title;
  }

  getElement() {
    return this.elThis;
  }

  activate() {
    this.elThis.classList.add("activate");
  }

  deactivate() {
    this.elThis.classList.remove("activate");
  }
}
