import { store } from "./Store";

import elem from "../../../core/utils/elem/elem";
import { apiClass } from "../../../core/api/class";

import { mtoEvents } from "../../../core/utils/mto-events";

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
    this.classData = await this.urlGetClass(this.classId);
    this.courseId = this.classData.id_course;

    this.storeStates();

    this.create();

    const body = document.getElementById("body");
    body.append(this.elThis);

    this.activateInitial();
  }

  storeStates() {
    store.setState("userId", this.userId);
    store.setState("userType", this.userType);
    store.setState("classId", this.classId);
    store.setState("courseId", this.courseId);
    store.setState("classData", this.classData);
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

  getElement() {
    return this.elThis;
  }
}
