import elem from "../../../../core/utils/elem/elem.js";
import { mtoEvents } from "../../../../core/utils/mto-events.js";

import { Scheduler } from "../scheduler/Scheduler.js";
import { Member } from "../member/Member.js";
import { CourseDetail } from "../course/Detail/CourseDetail.js";
import { courseStudyManager } from "./course-study-manager.js";

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

    this.clCourseStudy = courseStudyManager;
    this.elCourseStudy = this.clCourseStudy.getContent();
    this.elThis.append(this.elCourseStudy);

    this.contentMapper = {
      notification: null,
      community: null,
      course: this.clCourseDetail,
      courseStudy: this.clCourseStudy,
      scheduler: this.clScheduler,
      stats: null,
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
