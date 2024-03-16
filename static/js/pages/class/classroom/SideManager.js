import elem from "../../../core/utils/elem/elem";
import { mtoEvents } from "../../../core/utils/mto-events";

import { SideMain } from "./SideMain";
import { SideCourseAssign } from "./course/Assign/SideCourseAssign";
import { SideClassCourseAssign } from "./course/Assign/SideClassCourseAssign";
import { courseAssignManager } from "./course/Assign/ClassCourseAssignManager";

import store from "../common/Store";
import { TYPE_CLASS, TYPE_MEMBER } from "../constants";

require("./SideManager.css");
export class SideManager {
  constructor() {
    this.currentSide = null;

    this.init();
  }

  init() {
    const MEMBER_TYPE = store.getState("memberType");
    const CLASS_TYPE = store.getState("classType");

    this.create();

    this.initSideComponents(MEMBER_TYPE, CLASS_TYPE);

    this.initEvents();
  }

  create() {
    this.elThis = elem("aside", { class: "drawer-side z-10" });
    this.elOverlay = elem("label", { for: "drawer-classroom", class: "drawer-overlay" });
    this.elThis.append(this.elOverlay);
  }

  initSideComponents(MEMBER_TYPE, CLASS_TYPE) {
    this.clSideMain = new SideMain();
    this.elSideMain = this.clSideMain.getElement();

    this.clSideCourseAssign = store.getState("courseAssignManager");
    this.elSideCourseAssign = this.clSideCourseAssign.getSide();

    // switch (CLASS_TYPE) {
    //   case TYPE_CLASS.CLASS:
    //     this.clSideCourseAssign = new SideCourseAssign();
    //     this.elSideCourseAssign = this.clSideCourseAssign.getElement();
    //     break;
    //   case TYPE_CLASS.SINGLE_COURSE:
    //     this.clSideCourseAssign = new SideClassCourseAssign();
    //     this.elSideCourseAssign = this.clSideCourseAssign.getElement();
    //     break;

    //   default:
    //     break;
    // }

    this.elThis.append(this.elSideMain);
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
