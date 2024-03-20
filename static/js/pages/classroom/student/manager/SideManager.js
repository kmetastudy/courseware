import elem from "../../../../core/utils/elem/elem.js";
import { mtoEvents } from "../../../../core/utils/mto-events.js";
import { store } from "../Store.js";

import { SideMain } from "../SideMain.js";

import { courseStudyManager } from "./course-study-manager.js";
require("./SideManager.css");
export class SideManager {
  constructor() {
    this.currentSide = null;

    this.init();
  }

  init() {
    this.create();

    this.initSideComponents();

    this.initEvents();
  }

  create() {
    this.elThis = elem("aside", { class: "drawer-side z-10" });
    this.elOverlay = elem("label", { for: "drawer-classroom", class: "drawer-overlay" });
    this.elThis.append(this.elOverlay);
  }

  initSideComponents() {
    this.clSideMain = new SideMain();
    this.elSideMain = this.clSideMain.getElement();
    this.elThis.append(this.elSideMain);

    this.clSideStudy = courseStudyManager;
    this.elSideStudy = courseStudyManager.getSide();
    this.elThis.append(this.elSideStudy);

    this.sideMapper = {
      main: this.clSideMain,
      courseStudy: this.courseStudy,
    };
  }

  initEvents() {
    mtoEvents.on("activateSide", this.activateSide.bind(this));
  }

  activateSide({ key, ...rest }) {
    if (!this.sideMapper.hasOwnProperty(key) || this.currentSide === this.sideMapper[key]) {
      // this.currentSide?.deactivate?.();
      return;
    }

    this.currentSide?.deactivate(rest);
    this.currentSide = this.sideMapper[key];
    this.currentSide?.activate(rest);
  }

  getElement() {
    return this.elThis;
  }
}
