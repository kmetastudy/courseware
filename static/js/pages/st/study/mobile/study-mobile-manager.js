import { StudyCourseContainer } from "../study-course-container";
import { StudyCourseBuilder } from "../study-course-builder";
import { createElement } from "../../../../core/utils/dom-utils";
import { StudyTabManager } from "./study-tab-manager";
import { StMobileCourseTree } from "./study-mobile-course-tree";

import { mtoEvents } from "../../../../core/utils/mto-events";

import { sum } from "../../../../core/utils/_utils";

require("./study-mobile-manager.css");
export class StudyMobileManager {
  constructor(options = {}) {
    this.options = options;

    this.id = "st-mobile-manager";
    this.prefixCls = "st-mobile-manager";

    this.treeData = null;

    this.setup();
    this.create();

    if (this.courseId) {
      this.initialize(this.courseId, this.studentId);
    }
  }

  setup() {
    this.courseId = this.options?.courseId;
    this.isDemo = this.options?.demo; // annonymous?
    this.userType = this.options?.userType;
    this.studentId = this.options?.studentId;
    this.isLogin = this.options?.userLogin;
    this.contentId = this.options?.contentId;

    // this.clStudyContainer = new StudyCourseContainer(this.options);
    this.clStudyBuilder = new StudyCourseBuilder(this.options);
    this.clStudyMobileCourseTree = new StMobileCourseTree({ onBranchClick: this.handleContentClick.bind(this) });

    this.clStudyTabManager = null;
    this.elStudyTabManager = null;
  }

  create() {
    this.elThis = createElement("div", { className: this.prefixCls });

    this.elHeader = this.createHeader();

    // ==== Section ====
    this.elSection = createElement("section", { className: `${this.prefixCls}-section` });
    this.elStudyBuilder = this.clStudyBuilder.elThis;
    this.elSection.append(this.elStudyBuilder);

    // ==== Footer ====
    // this.elMenu = this.clStudyMobileMenu.getElement();
    this.elTree = this.clStudyMobileCourseTree.getElement();

    this.elThis.append(this.elHeader, this.elSection);
  }

  createHeader() {
    this.elHeader = createElement("header", { className: `${this.prefixCls}-header` });
    return this.elHeader;
  }

  createSection() {
    this.elSection = createElement("section", { className: `${this.prefixCls}-section` });

    this.elStudyBuilder = this.clStudyBuilder.elThis;

    this.elSection.append(this.elStudyBuilder);

    return this.elSection;
  }

  createMain(elTree) {
    this.tabItems = [{ label: "학습하기", panel: elTree }];
    this.clStudyTabManager = new StudyTabManager(this.tabItems);
    const elStudyTabManager = this.clStudyTabManager.getElement();

    if (this.elStudyTabManager) {
      this.elStudyTabManager.replacewith(elStudyTabManager);
    } else {
      this.elThis.append(elStudyTabManager);
      this.elStudyTabManager = elStudyTabManager;
    }
  }

  // ================================================
  // ==================== Handler ===================
  // ================================================
  handleContentClick(data) {
    const contentData = data;
    const param = {
      student_id: this.studentId,
      course_id: this.courseId,
      content_id: contentData.id,
      title: contentData.title,

      content_type: contentData.type,
      results: contentData.results,
      units: contentData.units,
    };

    mtoEvents.emit("OnChangeCourseContent", param);
  }
  // ================================================
  // ====================== URL =====================
  // ================================================
  urlGetCourse(id) {
    try {
      return axios
        .get(`../cp/api/course_n/${id}/`)
        .then((res) => {
          if (res.data) {
            return res.data;
          }
        })
        .catch((err) => console.error(err));
    } catch (err) {
      console.log(err);
    }
  }

  urlGetStudyResultProperties(courseId, userId) {
    try {
      const param = {
        student_id: userId,
        course_id: courseId,
        content_id: courseId,
      };
      const origin = window.location.origin;

      return axios
        .get(`${origin}/st/api/study_result/properties/`, {
          params: param,
        })
        .then((res) => {
          const result = res?.data ? res.data : [];
          return result;
        });
    } catch (err) {
      throw new Error(err);
    }
  }

  urlGetDemoStudyResultProperties(courseId) {
    try {
      const param = {
        course_id: courseId,
        content_id: courseId,
      };

      return axios
        .get("../st/api/demo_study_result/properties/", {
          params: param,
        })
        .then((res) => {
          const result = res?.data ? res.data : [];
          return result;
        });
    } catch (err) {
      throw new Error(err);
    }
  }

  // ================================================
  // ====================== API =====================
  // ================================================

  async initialize(courseId, studentId) {
    try {
      const [courseFullData, resultData] = await this.getData(courseId, studentId);

      this.courseTitle = courseFullData?.title;

      this.courseTitle ? (document.title = this.courseTitle) : null;

      const courseData = courseFullData?.json_data;

      if (courseData) {
        this.treeData = this.composeTreeData(courseData, resultData);
        this.clStudyMobileCourseTree.initialize(this.treeData, this.courseTitle);
      }

      this.elTree = this.clStudyMobileCourseTree.getElement();
      if (this.elTree) {
        this.createMain(this.elTree);

        this.elThis.classList.add("activate");
      }
      // TODO
      // If you don't need, remove
      this.isAutoPlay = true;
      if (this.treeData && this.isAutoPlay === true) {
        this.autoPlay(this.treeData);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getData(courseId, studentId) {
    try {
      const courseData = await this.urlGetCourse(courseId);

      let resultData;
      if (studentId) {
        resultData = await this.urlGetStudyResultProperties(courseId, studentId);
      } else {
        resultData = await this.urlGetDemoStudyResultProperties(courseId, studentId);
      }

      return [courseData, resultData];
    } catch (error) {
      throw new Error(error);
    }
  }

  autoPlay(data) {
    //
    const contentData = data.map((chapter) => chapter.children).flat()[0];

    if (contentData) {
      const param = {
        student_id: this.studentId,
        course_id: this.courseId,
        content_id: contentData.id,
        title: contentData.title,

        content_type: contentData.type,
        results: contentData.results,
        units: contentData.units,
      };

      mtoEvents.emit("OnChangeCourseContent", param);
    }
  }

  getElement() {
    return this.elThis;
  }

  // ================================================
  // ===================== Utils ====================
  // ================================================
  composeTreeData(courseData, resultData) {
    let treeData = [];
    let currentChapter = null;
    let chapterProgress = [];
    let chapterPoint = [];
    const clonedCourseData = structuredClone(courseData);

    const lists = clonedCourseData.lists;
    const contents = clonedCourseData.contents;
    const results = structuredClone(resultData);

    const { length } = lists;

    for (let i = 0; i < length; i++) {
      const [list, content, result] = [lists[i], contents[i], results[i]];

      const progress = result.progress ?? 0;
      const point = result.point ?? 0;
      const type = list.type === 0 ? "chapter" : "branch";

      if (type === "chapter") {
        if (currentChapter) {
          currentChapter.progress = this.getPercentage(sum(chapterProgress), chapterProgress.length * 100, 0);
          currentChapter.point = this.getPercentage(sum(chapterPoint), chapterPoint.length * 100, 0);
        }
        chapterProgress = [];
        chapterPoint = [];

        list.children = [];
        treeData.push(list);
        currentChapter = list;
      } else if (type === "branch") {
        list.units.forEach((unit, idx) => {
          unit.contentIds = content.units[idx].ids;
          unit.contentTimes = content.units[idx].times;
        });

        list.results = result.results;
        list.progress = progress;
        list.point = point;

        chapterProgress.push(progress);
        chapterPoint.push(point);

        currentChapter.children.push(list);
      }
    }
    return treeData;
  }

  getPercentage(numerator, denominator, digits = 2) {
    if (!denominator) {
      return 0;
    }

    return parseFloat(((numerator / denominator) * 100).toFixed(digits)); //e.g. 20.22
  }
}
