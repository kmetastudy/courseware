import elem from "../../../../core/utils/elem/elem.js";
import { mtoEvents } from "../../../../core/utils/mto-events.js";

import { SideMain } from "../SideMain.js";

import { store } from "../Store.js";
import { courseAssignManager } from "./course-assign-manager.js";

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

    this.clSideCourseAssign = courseAssignManager;
    this.elSideCourseAssign = this.clSideCourseAssign.getSide();
    this.elThis.append(this.elSideCourseAssign);

    this.sideMapper = {
      main: this.clSideMain,
      courseAssign: this.clSideCourseAssign,
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
