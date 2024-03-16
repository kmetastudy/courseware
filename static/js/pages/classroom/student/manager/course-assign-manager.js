import { store } from "../Store";

import { extract } from "../../../../core/utils/array";

import { apiClass } from "../../../../core/api/class";
import { apiStudent } from "../../../../core/api/st";
import { apiUser } from "../../../../core/api/user";
import { apiCp } from "../../../../core/api/cp";

import { CourseAssign } from "../course/Assign/CourseAssign";
import { SideCourseAssign } from "../course/Assign/SideCourseAssign";

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
    console.log(scheduler);
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
      const response = await apiStudent.studyResult.filter({ id_class: classId });
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
    start() {
      clContent = new CourseAssign();
      clSide = new SideCourseAssign({ onSideItemClick: handleSideItemClick });

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

export const courseAssignManager = createCourseAssignManager();
courseAssignManager.start();
