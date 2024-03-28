import { store } from "./Store";

import elem from "../../../core/utils/elem/elem";
import { apiClass } from "../../../core/api/class";
import { apiCp } from "../../../core/api/cp";
import { apiUser } from "../../../core/api/user";
import { apiStudent } from "../../../core/api/st";

import { mtoEvents } from "../../../core/utils/mto-events";
import { studentRouter } from "./router";

import { SideManager } from "./manager/SideManager";
import { ContentManager } from "./manager/ContentManager";

export class AppClassroomStudent {
  /**
   *
   * @param {object} options
   * @property {number} userType
   * @property {string} userId
   * @property {boolean} userLogin
   */
  constructor({ userType, userId, classId } = {}) {
    this.userType = userType;
    this.userId = userId;
    this.classId = classId;

    this.init();
  }

  async init() {
    await this.prepareData();

    this.router = this.createRouter(this.classId);

    this.storeStates();

    this.create();

    const body = document.getElementById("body");
    body.append(this.elThis);

    // this.activateInitial();
    this.router.navigate("/");
  }

  async prepareData() {
    try {
      this.classData = await this.urlGetClass(this.classId);

      this.classContentAssignData = await this.urlGetClassContentAssign(this.classId);

      this.courseId = this.classData.id_course;

      this.courseData = await this.urlGetCourse(this.courseId);

      this.studyResultData = await this.urlFilterStudyResult({
        courseId: this.courseId,
        userId: this.userId,
        classId: this.classId,
      });

      this.userData = await this.urlGetUser(this.userId);

      return;
    } catch (error) {
      throw new Error(error);
    }
  }

  createRouter(classId) {
    const router = studentRouter(classId);
    return router;
  }

  storeStates() {
    store.setState("userId", this.userId);
    store.setState("userType", this.userType);
    store.setState("classId", this.classId);
    store.setState("courseId", this.courseId);
    store.setState("router", this.router);

    store.setState("classData", this.classData);
    store.setState("courseData", this.courseData);
    store.setState("userData", this.userData);
    store.setState("studyResultData", this.studyResultData);
    store.setState("classContentAssignData", this.classContentAssignData);
  }

  create() {
    this.elThis = elem("div", { class: "app-class drawer min-h-screen bg-base-200 lg:drawer-open" });

    this.elDrawerToggle = elem("input", { id: "drawer-classroom", type: "checkbox", class: "drawer-toggle" });
    this.elThis.append(this.elDrawerToggle);

    this.clSideManager = new SideManager();
    this.elSideManager = this.clSideManager.getElement();
    this.elThis.append(this.elSideManager);

    this.clContentManager = new ContentManager();
    this.elContentManager = this.clContentManager.getElement();
    this.elThis.append(this.elContentManager);
  }

  activateInitial() {
    mtoEvents.emit("activateSide", { key: "main" });
  }

  async urlGetClass(classId) {
    try {
      const response = await apiClass.singleCourseClass.get(classId);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async urlGetClassContentAssign(classId) {
    try {
      const response = await apiClass.classContentAssign.filter({ id_class: classId });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async urlGetCourse(courseId) {
    try {
      const response = await apiCp.course.get(courseId);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async urlFilterStudyResult({ courseId: id_course, userId: id_student, classId: id_class }) {
    try {
      const response = await apiClass.studyResult.filter({ id_course, id_student, id_class });
      return response.data[0];
    } catch (error) {
      console.log(error);
    }
  }

  async urlGetUser(userId) {
    try {
      const response = await apiUser.user.get(userId);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  getElement() {
    return this.elThis;
  }
}
