import { TYPE_CLASS, TYPE_MEMBER } from "../../../constants";
import store from "../../../common/Store";

import { extract, extracts } from "../../../../../core/utils/array";

import { apiClass } from "../../../../../core/api/class";
import { apiUser } from "../../../../../core/api/user";
import { apiCp } from "../../../../../core/api/cp";

import { ClassCourseAssign } from "./ClassCourseAssign";
import { SideClassCourseAssign } from "./SideClassCourseAssign";
import { CourseAssign } from "./CourseAssign";
import { SideCourseAssign } from "./SideCourseAssign";

export function createCourseAssignManager() {
  let currentCourseId = null;
  let isActive = false;
  let clContent, clSide;
  let elContent, elSide;

  let classContentAssign, studyResults, users, course;

  // api
  async function updateData(courseId) {
    try {
      const classId = store.getState("classId");

      classContentAssign = await urlFilterClassContentAssign(courseId, classId);

      studyResults = await urlFilterStudyResult(classId);

      const studentIds = extract(studyResults, "id_student");

      users = await urlBulkFilterUser(studentIds.join(","));

      course = await urlGetCourse(courseId);

      return [classContentAssign, studyResults, users, course];
    } catch (error) {
      console.error(error);
    }
  }

  // Handler
  function handleSideItemClick(scheduler) {
    clContent.initialize(scheduler);
  }

  // Requests

  async function urlFilterClassContentAssign(courseId, classId) {
    try {
      const response = await apiClass.classContentAssign.filter({ id_course: courseId, id_class: classId });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async function urlFilterStudyResult(classId) {
    try {
      const response = await apiClass.studyResult.filter({ id_class: classId });
      return response.data;
    } catch (error) {
      return response;
    }
  }

  async function urlBulkFilterUser(joinedUserId) {
    try {
      const response = await apiUser.user.filter({ id__in: joinedUserId });
      return response.data;
    } catch (error) {
      return response;
    }
  }

  async function urlGetCourse(courseId) {
    try {
      const response = await apiCp.course.get(courseId);
      return response.data;
    } catch (error) {
      return response;
    }
  }

  const manager = {
    start(CLASS_TYPE, MEMBER_TYPE) {
      console.log(CLASS_TYPE, MEMBER_TYPE);
      switch (MEMBER_TYPE) {
        case TYPE_MEMBER.TEACHER:
        case TYPE_MEMBER.ADMIN:
          if (CLASS_TYPE === TYPE_CLASS.CLASS) {
            clContent = new CourseAssign();
            clSide = new SideCourseAssign();
          } else if (CLASS_TYPE === TYPE_CLASS.SINGLE_COURSE) {
            clContent = new ClassCourseAssign();
            clSide = new SideClassCourseAssign({ onSideItemClick: handleSideItemClick });
          }
          break;
      }

      elContent = clContent.getElement();
      elSide = clSide.getElement();
    },
    async activate({ courseId } = {}) {
      if (isActive === true) {
        return;
      }

      isActive = true;

      clContent.activate({ courseId });
      clSide.activate({ courseId });

      if (courseId && courseId !== currentCourseId) {
        currentCourseId = courseId;

        [classContentAssign, studyResults, users, course] = await updateData(courseId);

        clContent.updateData({ studyResults, users, classContentAssign, course });

        clSide.updateData({ classContentAssign, course });
      }
    },
    deactivate() {
      if (isActive === false) {
        return;
      }
      isActive = false;

      clContent.deactivate();
      clSide.deactivate();
    },

    getContent() {
      return elContent;
    },

    getSide() {
      return elSide;
    },
  };

  return manager;
}
