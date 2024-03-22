import elem from "../../../../core/utils/elem/elem.js";
import { mtoEvents } from "../../../../core/utils/mto-events.js";

import { Scheduler } from "../scheduler/Scheduler.js";
import { Member } from "../member/Member.js";
import { CourseDetail } from "../course/Detail/CourseDetail.js";
import { courseAssignManager } from "./course-assign-manager.js";
import { StatConverter } from "../stat/StatConverter.js";

export class ContentManager {
  constructor() {
    this.currentContent = null;

    this.init();
  }

  init() {
    this.create();

    this.initContents();

    this.initEvents();
  }

  create() {
    this.elThis = elem("main", { class: "drawer-content" });
  }

  initContents() {
    this.clScheduler = new Scheduler();
    this.elScheduler = this.clScheduler.getElement();
    this.elThis.append(this.elScheduler);

    this.clMember = new Member();
    this.elMember = this.clMember.getElement();
    this.elThis.append(this.elMember);

    this.clCourseDetail = new CourseDetail();
    this.elCourseDetail = this.clCourseDetail.getElement();
    this.elThis.append(this.elCourseDetail);

    this.clCourseAssign = courseAssignManager;
    this.elCourseAssign = this.clCourseAssign.getContent();
    this.elThis.append(this.elCourseAssign);

    this.clStat = new StatConverter();
    this.elStat = this.clStat.getElement();
    this.elThis.append(this.elStat);

    this.contentMapper = {
      notification: null,
      community: null,
      course: this.clCourseDetail,
      courseAssign: this.clCourseAssign,
      scheduler: this.clScheduler,
      stats: this.clStat,
      member: this.clMember,
      setting: null,
    };

    for (let key in this.contentMapper) {
      if (this.contentMapper[key]) {
        this.contentMapper[key]?.deactivate();
      }
    }
  }

  initEvents() {
    mtoEvents.on("activateContent", this.activateContent.bind(this));
  }

  activateContent({ key, ...rest }) {
    if (!this.contentMapper.hasOwnProperty(key) || this.currentContent === this.contentMapper[key]) {
      return;
    }

    this.currentContent?.deactivate(rest);
    this.currentContent = this.contentMapper[key];
    this.currentContent?.activate(rest);
  }

  getElement() {
    return this.elThis;
  }
}
