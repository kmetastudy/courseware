import { mtoEvents } from "../../../core/utils/mto-events";
import { MtuSidebar } from "../../../core/mtu/sidebar/mtu-sidebar";
import { mtuMenu } from "../../../core/ui/menu/mtu-menu";
import { StCourseTree } from "../st-course-tree";
/**
 *
 * Refactor mtmStudyContainer
 * @param {*} options
 */
export class StudyCourseContainer {
  constructor(options = {}) {
    this.options = options;
    console.log(this.options);
    this.elThis = null;

    this._init();
  }

  async _init() {
    this.elThis = document.createElement("div");

    this._initVariables();

    const courseId = this.courseId;
    const studentId = this.studentId;
    const { courseBookData, courseData, resultData } = await this.getCourseData(courseId, studentId);
    this.courseData = courseData;
    this.resultData = resultData;
    this.courseBookData = courseBookData;

    this.initCourseTree({ courseBookData, courseData, resultData });

    this.initSidebar();
  }

  _initVariables() {
    this.courseId = this.options.courseId ?? null;
    this.isDemo = this.options.demo ?? null; // annonymous?
    this.userType = this.options.userId ?? null;
    this.studentId = this.options.studentId ?? null;
  }

  initSidebar() {
    const learnTarget = this.elCourseTree;

    this.clSidebar = new MtuSidebar({
      position: "right",
      items: [
        { title: "학습하기", icon: "form", aside: learnTarget },
        { title: "통계", icon: "barChart" },
      ],
    });
    this.elSidebar = this.clSidebar.getElement();
    this.options.rootElement.prepend(this.elSidebar);
    // document.body.appendChild(this.elSidebar);
  }

  initCourseTree({ courseBookData, courseData, resultData }) {
    const title = "학습하기";
    this.clCourseTree = new StCourseTree({
      courseBookData,
      courseData,
      resultData,
      title,

      onBranchClick: this.handleContentClick.bind(this),
    });
    this.elCourseTree = this.clCourseTree.getElement();
    // this.elThis.appendChild(this.elCourseTree);
    this.options.rootElement.appendChild(this.elCourseTree);
  }
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// Handler  ////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  // Click Branch
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
    // branchData.id;
  }
  ////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////// URL  //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  urlGetCourseBook(courseId) {
    try {
      const url = `../cp/api/course_book/${courseId}`;
      return axios.get(url).then((res) => {
        return res.data ? res.data : {};
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  urlGetCourse(id, field_type) {
    try {
      const validFieldType = ["lists", "contents", "keys"];
      if (field_type && validFieldType.indexOf(field_type) === -1) {
        throw new Error(`Invalid field_type: ${field_type}`);
      }

      const param = {
        field_type: field_type,
      };
      return axios
        .get(`../cp/api/course_n/${id}/get_json_field/`, {
          params: param,
        })
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

  urlGetStudyResult(courseId, userId) {
    try {
      const param = {
        id_student: userId,
        id_course: courseId,
        id_content: courseId,
      };
      console.log(param);
      return axios.get("../st/api/study_result/", param).then((res) => {
        const result = res?.data ? res.data : [];
        return result;
      });
    } catch (err) {
      throw new Error(err);
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////// API  //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  async getCourseData(courseId, studentId) {
    try {
      const courseBookData = await this.urlGetCourseBook(courseId);
      const courseData = await this.urlGetCourse(courseId);
      const resultData = await this.urlGetStudyResult(courseId, studentId);
      return { courseBookData, courseData, resultData };
    } catch (err) {
      throw new Error(err);
    }
  }

  composeTreeData(lists) {
    let treeData = [];
    lists.forEach((data) => {
      const type = data.type === 0 ? "chapter" : "branch";
      if (type === "chapter") {
        data["children"] = [];
        treeData.push(data);
      } else if (type === "branch") {
        const chapterSize = treeData.length - 1;
        treeData[chapterSize].children.push(data);
      }
    });
    return treeData;
  }
}
