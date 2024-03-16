/**
 * Router을 관리한다.
 * Router이 여러 곳에 뭉쳐있으면, 관리하기 어려우니까, 여기서 관리?
 */

import { mtoEvents } from "../../../core/utils/mto-events";
import { createRouter } from "../../../core/utils/router/create-router";
import { TYPE_CLASS, TYPE_MEMBER } from "../constants";

export function classroomRouter(CLASS_TYPE, MEMBER_TYPE) {
  const pages = {
    home: () => {
      mtoEvents.emit("activateContent", { key: "home" });
      mtoEvents.emit("activateSide", { key: "main" });
    },
    notification: () => {
      mtoEvents.emit("activateContent", { key: "notification" });
      mtoEvents.emit("activateSide", { key: "main" });
    },
    community: () => {
      mtoEvents.emit("activateContent", { key: "community" });
      mtoEvents.emit("activateSide", { key: "main" });
    },
    course: () => {
      mtoEvents.emit("activateContent", { key: "course" });
      mtoEvents.emit("activateSide", { key: "main" });
    },
    scheduler: () => {
      mtoEvents.emit("activateContent", { key: "scheduler" });
      mtoEvents.emit("activateSide", { key: "main" });
    },
    member: () => {
      mtoEvents.emit("activateContent", { key: "member" });
      mtoEvents.emit("activateSide", { key: "main" });
    },
    setting: () => {
      mtoEvents.emit("activateContent", { key: "setting" });
      mtoEvents.emit("activateSide", { key: "main" });
    },
    courseAssign: (params) => {
      mtoEvents.emit("activateContent", { key: "courseAssign", courseId: params.courseId });
      mtoEvents.emit("activateSide", { key: "courseAssign", courseId: params.courseId });
    },
    // courseDetail: (params) => {
    //   mtoEvents.emit("activateContent", { key: "courseDetail", courseId: params.courseId });
    //   mtoEvents.emit("activateSide", { key: "courseDetail" });
    // },
    // courseStatus: (params) => {
    //   // mtoEvents.emit("activateContent", { key: "courseStatus", courseID: params.courseId });
    //   mtoEvents.emit("activateSide", { key: "courseStatus", courseId: params.courseId });
    // },
  };

  const router = createRouter();
  router
    .addRoute("#/", pages.home)
    .addRoute("#/notification", pages.notification)
    .addRoute("#/community", pages.community)
    .addRoute("#/course", pages.course)
    .addRoute("#/scheduler", pages.scheduler)
    .addRoute("#/member", pages.member)
    .addRoute("#/setting", pages.setting)
    .addRoute("#/course/assign/:courseId", pages.courseAssign)

    .start();

  return router;
}
