import { mtoEvents } from "../../../core/utils/mto-events";
import { MtuSidebar } from "../../../core/mtu/sidebar/mtu-sidebar";
import { StCourseTree } from "../st-course-tree";
import { StudyMobileInfo } from "./mobile/study-mobile-info";
import { TabBar } from "./mobile/tab-bar";
import { MtuMenu } from "../../../core/ui/menu/mtu-menu";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
/**
 *
 * Refactor mtmStudyContainer
 * @param {*} options
 */
require("../../../../css/pages/st/study/mobile/study-mobile.css");
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

    this.courseData ? (document.title = this.courseData.title) : null;
    this.resultData = resultData;
    // this.courseBookData = courseBookData;
    this.clMobileInfo = new StudyMobileInfo({
      headerText: this?.courseData?.title,
      // contentText
    });
    this.elMobileInfo = this.clMobileInfo.getElement();
    this.options.rootElement.append(this.elMobileInfo);

    this.initCourseTree({ courseData, resultData });

    this.initSidebar();

    const initialContentId = this.getDefaultInitialContentId(courseData, this.contentId);
    if (this.contentId) {
      this.clCourseTree.activateContent(courseData, this.contentId);
    }

    this.initTabBar();
  }

  _initVariables() {
    this.courseId = this.options.courseId ?? null;
    this.isDemo = this.options.demo ?? false; // annonymous?
    this.userType = this.options.userType ?? null;
    this.studentId = this.options.studentId ?? null;
    this.isLogin = this.options.userLogin ?? false;
    //
    this.contentId = this.options.contentId ?? null;
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
    this.options.rootElement.appendChild(this.elCourseTree);
  }

  initTabBar() {
    const items = [{ text: "학습하기", icon: MtuIcon("form"), onClick: this.handleTabBarLearnClick }];
    this.clTabBar = new TabBar(items);

    this.elTabBar = this.clTabBar.getElement();
    this.options.rootElement.appendChild(this.elTabBar);
  }
  ////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////// Handler  ////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  // Click Branch
  handleContentClick(data) {
    console.log(data);
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
    //
    mtoEvents.emit("OnChangeCourseContent", param);
  }
  ////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////// URL  //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
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

      if (this.isLogin === true) {
        resultData = await this.urlGetStudyResultProperties(courseId, studentId);
      } else {
        resultData = await this.urlGetDemoStudyResultProperties(courseId, studentId);
      }

      // return { courseBookData, courseData, resultData };
      return { courseData, resultData };
    } catch (err) {
      throw new Error(err);
    }
  }

  composeTreeData({ lists, contents, results }) {
    let treeData = [];
    let currentChapter = null;
    let chapterProgress = [];
    let chapterPoint = [];
    const { length } = lists;

    const clonedLists = structuredClone(lists);
    const clonedContents = structuredClone(contents);
    const clonedResults = structuredClone(results);

    for (let i = 0; i < length; i++) {
      const data = clonedLists[i];
      const content = clonedContents[i];
      const result = clonedResults ? clonedResults[i] : null;

      const progress = result?.progress ?? 0;
      const point = result?.point ?? 0;
      const type = data.type === 0 ? "chapter" : "branch";

      if (type === "chapter") {
        if (currentChapter) {
          currentChapter.progress = this.getPercentage(sum(chapterProgress), chapterProgress.length * 100, 0);
          currentChapter.point = this.getPercentage(sum(chapterPoint), chapterPoint.length * 100, 0);
        }
        chapterProgress = [];
        chapterPoint = [];

        data.children = [];
        treeData.push(data);
        currentChapter = data;
      } else if (type === "branch") {
        data.units.forEach((unit, idx) => {
          unit.contentIds = content.units[idx].ids;
          unit.contentTimes = content.units[idx].times;
        });

        data.results = result.results;
        data.progress = progress;
        data.point = point;

        chapterProgress.push(progress);
        chapterPoint.push(point);

        currentChapter.children.push(data);
      }
    }
    return treeData;
  }

  // ============ Utils ============
  getPercentage(numerator, denominator, digits = 2) {
    if (!denominator) {
      return 0;
    }

    return parseFloat(((numerator / denominator) * 100).toFixed(digits)); //e.g. 20.22
  }

  // setCompletedTime(listsData, resultsData) {
  //   const time = listsData.filter((data, idx) => resultsData[idx].progress === 100).map((data) => data.time).length;
  //   this.completedTime = time;
  //   return time;
  // }

  getDefaultInitialContentId(data, id) {
    console.log("data: ", data);
    console.log("id: ", id);

    if (id) {
      //
    }
  }
}
