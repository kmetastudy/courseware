import { store } from "./Store";

import elem from "../../../core/utils/elem/elem";
import { apiClass } from "../../../core/api/class";

import { mtoEvents } from "../../../core/utils/mto-events";
import { teacherRouter } from "./router";

import { SideManager } from "./manager/SideManager";
import { ContentManager } from "./manager/ContentManager";
import { apiUser } from "../../../core/api/user";

export class AppClassroomTeacher {
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
    this.classData = await this.urlGetClass(this.classId);
    this.courseId = this.classData.id_course;

    this.classesData = await this.urlFilterClass(this.userId);

    this.userData = await this.urlGetUser(this.userId);

    this.router = this.createRouter(this.classId);

    this.storeStates();

    this.create();

    const body = document.getElementById("body");
    body.append(this.elThis);

    this.router.resolve();
    // this.router.navigate("/");
  }

  createRouter(classId) {
    const router = teacherRouter(classId);
    return router;
  }

  storeStates() {
    store.setState("userId", this.userId);
    store.setState("userType", this.userType);
    store.setState("classId", this.classId);
    store.setState("courseId", this.courseId);
    store.setState("classData", this.classData);
    store.setState("userData", this.userData);
    store.setState("classesData", this.classesData);
    store.setState("router", this.router);
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

  async urlGetClass(classId) {
    try {
      const response = await apiClass.singleCourseClass.get(classId);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async urlFilterClass(userId) {
    try {
      const response = await apiClass.singleCourseClass.filter({ id_owner__in: userId });
      return response.data;
    } catch (error) {
      return;
    }
  }

  async urlGetUser(userId) {
    try {
      const response = await apiUser.user.get(userId);
      return response.data;
    } catch (error) {
      return;
    }
  }

  getElement() {
    return this.elThis;
  }
}
