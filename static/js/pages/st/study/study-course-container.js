import { mtoEvents } from "../../../core/utils/mto-events";
import { MtuSidebar } from "../../../core/mtu/sidebar/mtu-sidebar";
import { StCourseTree } from "../st-course-tree";
import { mtmTabs } from "../../../core/ui/mtm-tabs";
import { StMobileContainer } from "./mobile/st-mobile-container";
import { sum } from "../../../core/utils/_utils";

require("../../../../css/pages/st/study/study-course-container.css");
export class StudyCourseContainer {
  /**
   *
   * Refactor mtmStudyContainer
   * @param {*} options
   * @param {HTMLElement} options.rootElement
   */
  constructor(options = {}) {
    this.options = options;
    this.rootElement = this.options.rootElement;

    this._init();
  }

  async _init() {
    this._initVariables();

    await this.initializeData();

    this.initializeCourseTree({ courseData: this.courseData, resultData: this.resultData });

    this.initializeSidebar();

    this.initializeMobileContainer();

    this.initEvents();
  }

  _initVariables() {
    this.courseId = this.options.courseId ?? null;
    this.isDemo = this.options.demo ?? false; // annonymous?
    this.userType = this.options.userType ?? null;
    this.studentId = this.options.studentId ?? null;
    this.isLogin = this.options.userLogin ?? false;
    this.contentId = this.options.contentId ?? null;
  }

  async initializeData() {
    const courseId = this.courseId;
    const studentId = this.studentId;

    const { courseData, resultData } = await this.getCourseData(courseId, studentId);
    this.courseData = courseData;
    this.resultData = resultData;

    this.treeData = this.composeTreeData({ courseData, resultData });

    this.courseData ? (document.title = this.courseData.title) : null;
  }

  initializeSidebar() {
    const learnTarget = this.elCourseTree;

    this.clSidebar = new MtuSidebar({
      position: "left",
      items: [
        { title: "학습하기", icon: "stCategory", aside: learnTarget },
        // { title: "통계", icon: "barChart" },
      ],
    });
    this.elSidebar = this.clSidebar.getElement();

    this.rootElement.prepend(this.elSidebar);
  }

  initializeCourseTree({ courseData, resultData }) {
    const title = "학습하기";
    this.clCourseTree = new StCourseTree({
      courseData,
      resultData,
      title,
      onBranchClick: this.handleContentClick.bind(this),
    });

    this.elCourseTree = this.clCourseTree.getElement();
    this.rootElement.prepend(this.elCourseTree);

    const initialContentId = this.contentId ?? this.getDefaultInitialContentId(resultData, courseData);
    if (initialContentId) {
      this.clCourseTree.activateContent(initialContentId);
    }
  }

  initializeMobileContainer() {
    this.clTab = new mtmTabs({
      tabs: [{ name: "학습하기", align: "left", active: true, panel: true }],
      eventActivateTab: this.handleLeftTabActivate.bind(this),
    });
    this.rootElement.append(this.clTab.elThis);

    this.clMobileContainer = new StMobileContainer({
      data: this.treeData,
      onSubItemClick: this.handleContentClick.bind(this),
    });
    this.clTab.appendPanel(0, this.clMobileContainer.getElement());
    this.tabActiveIndex = 0;
    this.clTab.showPanel(this.tabActiveIndex);
  }

  initEvents() {
    document.addEventListener("visibilitychange", this.handlePageLeave.bind(this));
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

    this.contentId = contentData.id;
    mtoEvents.emit("OnChangeCourseContent", param);
  }

  async handlePageLeave(evt) {
    if (document.visibilityState === "hidden" && this.studentId && this.courseId) {
      const data = {
        filter: { id_course: this.courseId, id_student: this.studentId },
        data: {
          recent_timestamp: new Date(),
        },
      };
      if (this.contentId) {
        data.data.recent_content = this.contentId;
      }

      this.urlUpdateResultInformation(data);
    }
  }

  handleLeftTabActivate = function (index) {
    if (this.tabActiveIndex == index) {
      return;
    }

    this.tabActiveIndex = index;

    this.clTab.showPanel(this.tabActiveIndex);
  };
  ////////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////// URL  //////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  urlGetCourse(id) {
    try {
      return axios
        .get(`/cp/api/course_n/${id}/`)
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
        .get("/st/api/study_result/properties/", {
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
        .get("/st/api/demo_study_result/properties/", {
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

  urlUpdateResultInformation(data) {
    data.csrfmiddlewaretoken = csrftoken;
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });

    navigator.sendBeacon("/st/api/study_result/information/", blob);
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

  composeTreeData({ courseData, resultData }) {
    console.log(resultData);
    const { lists, contents } = courseData.json_data;
    const results = resultData;

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

  getDefaultInitialContentId(result, course) {
    let { lists } = course.json_data;
    const recentBranch = this.getRecentBranch(result);
    if (recentBranch) {
      return recentBranch?.id;
    }
    const firstBranch = this.getFirstBranch(lists);
    return firstBranch?.id;
  }

  getRecentBranch(result) {
    try {
      let recentBranch = null;
      const branchData = result.filter((data) => data?.type !== 0 && data.updated_date);

      branchData.forEach((data) => {
        if (data.updated_date) {
          data.updated_date = new Date(data.updated_date);
        }
      });

      branchData.sort((a, b) => a.updated_date - b.updated_date);

      if (branchData.length > 0) {
        recentBranch = branchData[0];
        return recentBranch;
      }
    } catch (error) {
      console.log(error);
    } finally {
      return undefined;
    }
  }

  getFirstBranch(lists) {
    return lists.find((item) => item.units.length > 0);
  }
}
