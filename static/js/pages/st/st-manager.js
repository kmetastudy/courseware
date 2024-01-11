import { StudyCourseContainer } from "./study/study-course-container.js";
import { StudyCourseBuilder } from "./study/study-course-builder.js";

require("../../../css/pages/st/st-manager.css");
/**
 *  Learn Manager
 * @constructor
 * @param {object} options - options for constructor
 */
export class StManager {
  constructor(options) {
    console.log("StManager > options: ", options);
    this.id = "id-mtm-manager-learn-" + StManager.id++;
    this.options = options;
    this.elThis = null;

    this.init();
  }

  init() {
    this.elThis = document.createElement("div");
    this.elThis.classList.add("st-manager");

    this.options.rootElement = this.elThis;
    this.clStudyContainer = new StudyCourseContainer(this.options);
    this.clStudyBuilder = new StudyCourseBuilder(this.options);

    this.elThis.appendChild(this.clStudyContainer.elThis);
    this.elThis.appendChild(this.clStudyBuilder.elThis);
  }
}

StManager.id = 0;
