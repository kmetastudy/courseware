import elem from "../../../core/utils/elem/elem";
import { mtoEvents } from "../../../core/utils/mto-events";

import store from "../common/Store";
import { TYPE_CLASS, TYPE_MEMBER } from "../constants";

import { Course } from "./course/Course";
import { CourseAssign } from "./course/Assign/CourseAssign";
import { ClassCourseAssign } from "./course/Assign/ClassCourseAssign";
import { Scheduler } from "./scheduler/Scheduler";
import { Member } from "./member/Member";
import { CourseDetail } from "./course/Detail/CourseDetail";
import { courseAssignManager } from "./course/Assign/ClassCourseAssignManager";
// import {Sche}
export class ContentManager {
  constructor({ userId, classId, parent }) {
    this.userId = userId;
    this.classId = classId;
    this.parentElement = parent;

    this.title = null;
    this.currentContent = null;

    this.init();
  }

  init() {
    const MEMBER_TYPE = store.getState("memberType");
    const CLASS_TYPE = store.getState("classType");

    this.create();

    this.initContents(MEMBER_TYPE, CLASS_TYPE);

    this.initEvents();
  }

  initContents(MEMBER_TYPE, CLASS_TYPE) {
    const { userId, classId } = this;
    this.contentMapper = {};
    this.clScheduler = new Scheduler({ userId, classId });
    this.elScheduler = this.clScheduler.getElement();
    this.elThis.append(this.elScheduler);

    this.clMember = new Member();
    this.elMember = this.clMember.getElement();
    this.elThis.append(this.elMember);

    this.clCourseDetail = new CourseDetail();
    this.elCourseDetail = this.clCourseDetail.getElement();
    this.elThis.append(this.elCourseDetail);

    this.clCourseAssign = store.getState("courseAssignManager");
    console.log(this.clCourseAssign);
    this.elCourseAssign = this.clCourseAssign.getContent();
    this.elThis.append(this.elCourseAssign);

    // switch (MEMBER_TYPE) {
    //   case TYPE_MEMBER.TEACHER:
    //   case TYPE_MEMBER.ADMIN:
    //     if (CLASS_TYPE === TYPE_CLASS.CLASS) {
    //       this.clCourseAssign = new CourseAssign();
    //     } else if (CLASS_TYPE === TYPE_CLASS.SINGLE_COURSE) {
    //       this.clCourseAssign = new ClassCourseAssign();
    //     }
    //     break;
    // }

    switch (CLASS_TYPE) {
      case TYPE_CLASS.CLASS:
        this.clCourse = new Course();
        this.elCourse = this.clCourse.getElement();
        break;
      case TYPE_CLASS.SINGLE_COURSE:
        this.clCourse = this.clCourseDetail;
        this.elCourse = this.elCourseDetail;
        break;
    }
    this.elThis.append(this.elCourse);

    this.contentMapper = {
      notification: null,
      community: null,
      course: this.clCourse,
      courseAssign: this.clCourseAssign,
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

  create() {
    this.elThis = elem("main", { class: "drawer-content" });
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

  handleSideMenuClick(key) {
    this.setContent(key);
  }

  getElement() {
    return this.elThis;
  }

  // Utils
  capitalize(str) {
    return str.replace(/\b\w/g, (match) => match.toUpperCase());
  }
}
