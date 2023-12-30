import { createElement } from "../../../../core/utils/dom-utils";
import isString from "../../../../core/utils/type/isString";

import { MtuBreadcrumb } from "../../../../core/mtu/breadcrumb/mtu-breadcrumb";

import { CourseStatsManager } from "./course-stats-manager";

require("../../../../../css/pages/main/stats/detail/stats-detail-manager.css");
export class StatsDetailManager {
  constructor({ studentId, courseId }) {
    this.studentId = studentId;
    this.courseId = courseId;

    this.prefixCls = "stats-detail-manager";
    this.cardPrefixCls = "dashboard-card";
    this.largeLayoutCls = "grid-span-8";
    this.smallLayoutCls = "grid-span-4";

    this.init();
  }

  async init() {
    this.setup();

    this.create();

    const [results, details] = await this.getResultsAndDetails(this.studentId, this.courseId);

    this.clCourseStatsManager.setData(results);
    this.clCourseStatsManager.setTitle(details?.courseTitle);
  }

  setup() {
    this.clCourseStatsManager = new CourseStatsManager({ title: this.title });
    this.elCourseStatsManager = this.clCourseStatsManager.getElement();

    this.clBreadcrumb = new MtuBreadcrumb({
      items: [
        { title: "통계", onClick: () => (window.location.href = "../"), icon: "" },
        { title: "코스 별 통계", icon: "" },
      ],
    });

    this.elBreadcrumb = this.clBreadcrumb.getElement();
  }

  create() {
    this.elThis = createElement("div", { className: this.prefixCls });

    this.elHeader = createElement("div", { className: `${this.prefixCls}-header` });
    this.elHeader.append(this.elBreadcrumb);

    this.elBody = createElement("div", { className: `${this.prefixCls}-body` });
    this.elBody.append(this.elCourseStatsManager);

    this.elThis.append(this.elHeader, this.elBody);
  }

  // ============ URL ============
  urlGetStudyResult(studentId, courseId) {
    try {
      const param = {
        id_student: studentId,
        id_course: courseId,
      };

      return axios
        .get(`../../st/api/study_result/`, { params: param })
        .then((res) => {
          if (res?.data) {
            const result = res.data[0];
            return this.parseProperties(result);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (e) {
      throw new Error(e);
    }
  }

  urlGetCourseDetail(courseId) {
    const formData = new FormData();
    formData.append("courseId", courseId);
    return axios
      .post("../../cm/getDetail/", formData)
      .then((res) => {
        if (res?.data.data) {
          return res?.data.data;
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  }

  // ============ API ============
  async getResultsAndDetails(studentId, courseId) {
    try {
      const results = await this.urlGetStudyResult(studentId, courseId);
      const details = await this.urlGetCourseDetail(courseId);
      return [results, details];
    } catch (err) {
      console.log(err);
    }
  }

  getElement() {
    return this.elThis;
  }

  // ============ Utils ============
  parseProperties(result) {
    if (result.properties && isString(result.properties)) {
      result.properties = JSON.parse(result.properties);
      return result;
    }
  }
}
