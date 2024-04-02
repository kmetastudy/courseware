/**
 * Router을 관리한다.
 * Router이 여러 곳에 뭉쳐있으면, 관리하기 어려우니까, 여기서 관리?
 */

import { mtoEvents } from "../../../core/utils/mto-events";

export function teacherRouter(classId) {
  let currentRoute;
  const pages = {
    home: () => {
      // if (currentRoute === "home") {
      //   return;
      // }
      currentRoute = "home";
      mtoEvents.emit("activateContent", { key: "home" });
      mtoEvents.emit("activateSide", { key: "main" });
      mtoEvents.emit("focusSide", { key: "home" });
    },
    notification: () => {
      // if (currentRoute === "notification") {
      //   return;
      // }
      currentRoute = "notification";
      mtoEvents.emit("activateContent", { key: "notification" });
      mtoEvents.emit("activateSide", { key: "main" });
    },
    community: () => {
      // if (currentRoute === "home") {
      //   return;
      // }
      currentRoute = "home";
      mtoEvents.emit("activateContent", { key: "community" });
      mtoEvents.emit("activateSide", { key: "main" });
    },
    course: () => {
      // if (currentRoute === "home") {
      //   return;
      // }
      currentRoute = "home";
      mtoEvents.emit("activateContent", { key: "course" });
      mtoEvents.emit("activateSide", { key: "main" });
      mtoEvents.emit("focusSide", { key: "course" });
    },
    scheduler: () => {
      // if (currentRoute === "home") {
      //   return;
      // }
      currentRoute = "home";
      mtoEvents.emit("activateContent", { key: "scheduler" });
      mtoEvents.emit("activateSide", { key: "main" });
      mtoEvents.emit("focusSide", { key: "scheduler" });
    },
    member: () => {
      // if (currentRoute === "home") {
      //   return;
      // }
      currentRoute = "home";
      mtoEvents.emit("activateContent", { key: "member" });
      mtoEvents.emit("activateSide", { key: "main" });
    },
    stats: () => {
      // if (currentRoute === "home") {
      //   return;
      // }
      currentRoute = "home";
      mtoEvents.emit("activateContent", { key: "stats" });
      mtoEvents.emit("activateSide", { key: "main" });
      mtoEvents.emit("focusSide", { key: "stats" });
    },
    setting: () => {
      // if (currentRoute === "home") {
      //   return;
      // }
      currentRoute = "home";
      mtoEvents.emit("activateContent", { key: "setting" });
      mtoEvents.emit("activateSide", { key: "main" });
      mtoEvents.emit("focusSide", { key: "setting" });
    },
    courseAssign: ({ data }) => {
      // if (currentRoute === "home") {
      //   return;
      // }
      currentRoute = "home";
      mtoEvents.emit("activateContent", { key: "courseAssign", courseId: data.courseId });
      mtoEvents.emit("activateSide", { key: "courseAssign", courseId: data.courseId });
    },
  };

  const rootUrl = `class/classroom/teacher/${classId}`;

  const router = new Navigo(rootUrl);
  router
    .on("/", pages.home)
    .on("/notification", pages.notification)
    .on("/community", pages.community)
    .on("/course", pages.course)
    .on("/scheduler", pages.scheduler)
    .on("/member", pages.member)
    .on("/stats", pages.stats)
    .on("/setting", pages.setting)
    .on("/course/assign/:courseId", pages.courseAssign);

  router.hooks({
    before: (done, params) => {
      console.log(params.url);
    },
  });

  return router;
}
