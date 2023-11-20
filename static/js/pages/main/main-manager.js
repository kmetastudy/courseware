import { CourseView } from "./course/course-view";

require("../../../css/pages/main/main-manager.css");
export class MainManager {
  constructor(options) {
    this.options = options;
    this.elThis = null;
    this.clCourseView = null;

    this.#init();
  }

  #init() {
    this.elThis = this.createElement();
    this.clCourseView = this.initCourseView();

    this.elThis.appendChild(this.clCourseView.getElement());

    this.clCourseView.render();
  }

  createElement() {
    const element = document.createElement("div");
    element.classList.add("main-manager");
    return element;
  }

  initCourseView() {
    const clCourseView = new CourseView();
    return clCourseView;
  }

  getElement() {
    return this.elThis;
  }
}
