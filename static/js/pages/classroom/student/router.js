/**
 * Router을 관리한다.
 * Router이 여러 곳에 뭉쳐있으면, 관리하기 어려우니까, 여기서 관리?
 */

import { mtoEvents } from "../../../core/utils/mto-events";

export function studentRouter(classId) {
  const pages = {
    home: () => {
      mtoEvents.emit("activateContent", { key: "home" });
      mtoEvents.emit("activateSide", { key: "main" });
      mtoEvents.emit("focusSide", { key: "home" });
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
      mtoEvents.emit("focusSide", { key: "course" });
    },
    scheduler: () => {
      mtoEvents.emit("activateContent", { key: "scheduler" });
      mtoEvents.emit("activateSide", { key: "main" });
      mtoEvents.emit("focusSide", { key: "scheduler" });
    },
    member: () => {
      mtoEvents.emit("activateContent", { key: "member" });
      mtoEvents.emit("activateSide", { key: "main" });
      mtoEvents.emit("focusSide", { key: "member" });
    },
    setting: () => {
      mtoEvents.emit("activateContent", { key: "setting" });
      mtoEvents.emit("activateSide", { key: "main" });
      mtoEvents.emit("focusSide", { key: "member" });
    },
    courseStudy: () => {
      mtoEvents.emit("activateContent", { key: "courseStudy" });
      mtoEvents.emit("activateSide", { key: "courseStudy" });
      // mtoEvents.emit("focusSide", { key: "" });
    },
  };

  const rootUrl = `class/classroom/student/${classId}`;

  const router = new Navigo(rootUrl);
  router.on("/", pages.home);
  router.on("/notification", pages.notification);
  router.on("/community", pages.community);
  router.on("/course", pages.course);
  router.on("/scheduler", pages.scheduler);
  router.on("/member", pages.member);
  router.on("/setting", pages.setting);
  router.on("/course/study", pages.courseStudy);

  return router;
}
