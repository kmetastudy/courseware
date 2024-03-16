import { TeacherManager } from "./teacher/teacher-manager";
import { StudentManager } from "./student/student-manager";

import elem from "../../core/utils/elem/elem";
require("../../../css/pages/class/AppClass.css");

export class AppClass {
  /**
   *
   * @param {object} options
   * @property {number} userType
   * @property {string} userId
   * @property {boolean} userLogin
   */
  constructor({ userType, userId, userLogin } = {}) {
    this.userType = userType;
    this.userId = userId;

    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("div", { class: "app-class" });

    this.manager = new TeacherManager(this.elThis, { userType: this.userType, userId: this.userId });
  }

  getElement() {
    return this.elThis;
  }
}
