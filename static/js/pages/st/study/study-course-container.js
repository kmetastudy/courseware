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
    this.elThis = null;

    this._init();
  }

  async _init() {
    this.elThis = document.createElement("div");

    this._initVariables();

    const courseId = this.courseId;
    const studentId = this.studentId;
    // const { courseBookData, courseData, resultData } = await this.getCourseData(courseId, studentId);
    const { courseData, resultData } = await this.getCourseData(courseId, studentId);
    this.courseData = courseData;
    this.resultData = resultData;
    // this.courseBookData = courseBookData;

    this.initCourseTree({ courseData, resultData });

    this.initSidebar();
  }

  _initVariables() {
    this.courseId = this.options.courseId ?? null;
    this.isDemo = this.options.demo ?? false; // annonymous?
    this.userType = this.options.userId ?? null;
    this.studentId = this.options.studentId ?? null;
    this.isLogin = this.options.userLogin ?? false;
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

  urlGetCourseJsonField(id, field_type) {
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

  urlGetStudyResultProperties(courseId, userId) {
    try {
      const param = {
        student_id: userId,
        course_id: courseId,
        content_id: courseId,
      };

      return axios
        .get("../st/api/study_result/properties/", {
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
  ////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////// API  //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  async getCourseData(courseId, studentId) {
    try {
      const courseData = await this.urlGetCourse(courseId);
      /**
       * 지금은 로그인 하지 않은 경우 다 데모
       * 나중에는 코스의 체험판 여부를 통해 데모여부를 설정
       */
      let resultData;
      console.log(this.isLogin);
      if (this.isLogin === true) {
        resultData = await this.urlGetStudyResultProperties(courseId, studentId);
      } else {
        resultData = await this.urlGetDemoStudyResultProperties(courseId, studentId);
      }
      console.log(resultData);

      // return { courseBookData, courseData, resultData };
      return { courseData, resultData };
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
