import { createElement } from "../../../core/utils/dom-utils";
import isString from "../../../core/utils/type/isString";

// import { MtuBreadcrumb } from "../../../core/mtu/breadcrumb/mtu-breadcrumb";
import { CourseTable } from "./course-table";
// import { CourseStatsManager } from "./course-stats-manager";

require("../../../../css/pages/main/stats/stats-manager.css");
export class StatsManager {
  static #studyResultEndpoint = "../st/api/study_result/properties/";
  constructor(studentId) {
    if (!studentId) {
      return;
    }

    this.studentId = studentId;

    this.prefixCls = "stats-manager";
    this.cardPrefixCls = "dashboard-card";
    this.largeLayoutCls = "grid-span-8";
    this.smallLayoutCls = "grid-span-4";
    this.title = "통계";

    this.init();
  }

  async init() {
    this.setup();

    this.create();

    await this.getData(this.studentId);

    this.setTableData(this.details, this.results);

    this.clCourseTable.activate();
    // this.clCourseStatsManager.deactivate();
  }

  setup() {
    // this.clBreadcrumb = new MtuBreadcrumb({
    //   items: [
    //     { title: "전체보기", onClick: this.handleBreadcrumbClick.bind(this), icon: "" },
    //     { title: "코스 통계", icon: "" },
    //   ],
    // });
    // this.elBreadcrumb = this.clBreadcrumb.getElement();

    this.clCourseTable = new CourseTable({
      onCellClick: this.handleCellClick.bind(this),
      onCellTap: this.handleCellTap.bind(this),
    });
    this.elCourseTable = this.clCourseTable.getElement();

    // this.clCourseStatsManager = new CourseStatsManager();
    // this.elCourseStatsManager = this.clCourseStatsManager.getElement();
  }

  create() {
    this.elThis = createElement("div", { className: this.prefixCls });

    this.elTitle = createElement("div", {
      className: `${this.prefixCls}-title`,
      text: this.title,
    });

    // this.elBreadcrumbWrapper = createElement("div", { className: `${this.prefixCls}-breadcrumb` });
    // this.elBreadcrumbWrapper.append(this.elBreadcrumb);

    this.elBody = createElement("div", { className: `${this.prefixCls}-body` });
    // this.elBody.append(this.elCourseTable, this.elCourseStatsManager);
    this.elBody.append(this.elCourseTable);

    // this.elThis.append(this.elTitle, this.elBreadcrumbWrapper, this.elBody);
    this.elThis.append(this.elTitle, this.elBody);
  }

  // ============ Handler ============
  handleCellClick(data) {
    this.setCourseStatsData(data);
  }

  handleCellTap(data) {
    this.setCourseStatsData(data);
  }

  // handleBreadcrumbClick(evt) {
  //   console.log("bread click");
  //   this.clCourseTable.activate();
  //   // this.clCourseStatsManager.deactivate();
  // }

  // ============ URL ============
  // TODO: change logic
  // 현재는 result데이터에서 가져온다.
  // 이렇게 하는게 아니라, 원래는 main의 order모델(확실하진 않음)에서 가져와야됨.
  urlGetPurchasedCourses(studentId) {
    return this.urlGetStudyResults(studentId);
  }

  urlGetStudyResults(studentId) {
    if (!studentId) {
      return;
    }

    try {
      const param = {
        id_student: studentId,
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

  // ============ API ============
  async getData(studentId) {
    try {
      this.courses = await this.urlGetPurchasedCourses(studentId);

      const courseIds = this.courses.map((data) => data.id_course);

      this.details = await this.urlGetCourseDetails(courseIds);

      this.results = await this.urlGetStudyResults(studentId);
    } catch (err) {
      console.log(err);
    }
  }

  setTableData(details, results) {
    this.clCourseTable.setData(details, results);
  }

  // After click cell, show course stats
  async setCourseStatsData(data) {
    try {
      const courseId = data.id;
      // const courseResult = this.findCourseResult(courseId);
      window.location.href = `/stats/${courseId}/`;
    } catch (error) {
      console.log(error);
    }

    // this.clCourseStatsManager.setData(courseResult);

    // this.clCourseTable.deactivate();
    // this.clCourseStatsManager.activate();
  }

  // findCourseResult(courseId) {
  //   if (!this.results || !courseId) {
  //     return;
  //   }

  //   return this.results.find((result) => result.id_course === courseId);
  // }

  getElement() {
    return this.elThis;
  }

  // ============ Utils ============
  parseAll(array, key = "properties") {
    return array?.map((data) => {
      if (isString(data[key])) {
        data[key] = JSON.parse(data[key]);
        return data;
      }
    });
  }
}
