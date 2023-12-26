import { DashboardRecentCourse } from "./dashboard-recent-course";
import { DashboardTotalStats } from "./dashboard-total-stats";
import { DashboardCategoryStats } from "./dashboard-category-stats";
import { dashboardTitle } from "./common/dashboard-title";

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
    this.initContents();

    this.create();

    try {
      const studyResults = await this.urlGetStudyResults(this.studentId);

      const courseIds = this.composeIds(studyResults);

      const courseDetails = await this.urlGetCourseDetails(courseIds);

      this.results = studyResults;
      this.courseDetails = courseDetails;

      // this.render();
    } catch (e) {
      throw new Error(e);
    }
  }

  urlGetStudyResults(studentId) {
    console.log(studentId);
    if (!studentId) {
      return;
    }

    try {
      const param = {
        student_id: studentId,
      };
      return axios
        .get(`../st/api/study_result/`, { params: param })
        .then((res) => {
          if (res?.data) {
            return this.parseAll(res?.data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (e) {
      throw new Error(e);
    }
  }

  urlGetCourseDetails(courseIds) {
    const formData = new FormData();
    formData.append("course_ids", JSON.stringify(courseIds));
    return axios
      .post("../cm/get-detail-list/", formData)
      .then((res) => {
        if (res?.data.data) {
          return res?.data.data;
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  initContents() {
    const prefixCls = "dashboard-card";
    const gridSpan8 = "grid-span-8"; // grid-column : span 4;
    this.elContents = [];
    this.recentLecture = new DashboardRecentCourse({ className: prefixCls, ...this.config });
    this.elRecentLecture = this.recentLecture.getElement();

    this.totalStats = new DashboardTotalStats({
      progress: 75,
      questionCorrectRate: 40,
      videoCorrectRate: 50,
      className: prefixCls,
    });
    this.elTotalStats = this.totalStats.getElement();

    this.categoryStats = new DashboardCategoryStats({ className: [prefixCls, gridSpan8] });
    this.elCategoryStats = this.categoryStats.getElement();

    this.elContents.push(this.elRecentLecture, this.elTotalStats, this.elCategoryStats);
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

    const elCards = this.createCards();

    if (Array.isArray(elCards) && elCards.length > 0) {
      elBody.append(...elCards);
      this.elCards = elCards;
    }

    return elBody;
  }

  createCards() {
    const elCards = [];
    this.elContents.forEach((elContent) => {
      const elCard = this.createCard(elContent);
      elCards.push(elCard);
    });

    return elCards;
  }

  createCard(child) {
    // child.classList.add("dashboard-card");
    return child;
  }

  parseAll(array, key = "properties") {
    return array?.map((data) => {
      if (isString(data[key])) {
        data[key] = JSON.parse(data[key]);
        return data;
      }
    });
  }

  composeIds(data) {
    console.log(data);
    return data?.map((item) => item.id_course);
  }

  getElement() {
    return this.elThis;
  }
}
