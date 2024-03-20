import { store } from "../Store";

import { apiClass } from "../../../../core/api/class";
import { apiStudent } from "../../../../core/api/st";
import { apiUser } from "../../../../core/api/user";
import { apiCp } from "../../../../core/api/cp";

import { CourseStudy } from "../course/study/CourseStudy";
import { SideCourseStudy } from "../course/study/SideCourseStudy";

export function createCourseStudyManager() {
  let isActive = false;
  let clContent, clSide;
  let elContent, elSide;

  let courseId, studentId;

  let studyResult, course;

  // api
  async function updateData() {
    try {
      const classId = store.getState("classId");

      const studyResults = await urlFilterStudyResult({ classId, studentId, courseId });

      console.log(studyResults);
      studyResult = studyResults[0];

      course = await urlGetCourse(courseId);

      return [studyResult, course];
    } catch (error) {
      console.error(error);
    }
  }

  async function changeContent(studyResultProperty) {
    const { id: contentId, type: contentType } = studyResultProperty;
    const content = await urlGetContent({ courseId, contentId, contentType });

    clContent.changeContent({ studyResultProperty, content });
  }

  // Handler
  async function handleSideItemClick(studyResultProperty) {
    await changeContent(studyResultProperty);
  }

  // TODO
  // API 변경..?
  async function urlGetContent({ courseId, contentId, contentType }) {
    try {
      const formData = new FormData();
      formData.append("course_id", courseId);
      formData.append("content_id", contentId);
      formData.append("content_type", contentType);

      const origin = window.location.origin;

      const response = await axios.post(`${origin}/st/get-content/`, formData);

      return response.data?.result;
    } catch (error) {
      console.log(error);
    }
  }

  // Requests
  async function urlFilterStudyResult({ classId, studentId, courseId }) {
    try {
      const response = await apiStudent.studyResult.filter({
        id_class: classId,
        id_student: studentId,
        id_course: courseId,
      });
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
      clContent = new CourseStudy();
      clSide = new SideCourseStudy({ onSideItemClick: handleSideItemClick });

      elContent = clContent.getElement();
      elSide = clSide.getElement();
    },

    async activate() {
      console.log(store.getState("courseId"));
      if (isActive === true) {
        return;
      }

      isActive = true;

      clContent.activate();
      clSide.activate();

      const nextCourseId = store.getState("courseId");
      const nextStudentId = store.getState("userId");

      if (!nextCourseId || !nextStudentId) {
        return;
      }

      if (nextCourseId === courseId && studentId === nextStudentId) {
        return;
      }

      courseId = nextCourseId;
      studentId = nextStudentId;

      [studyResult, course] = await updateData();
      console.log(studyResult);
      console.log(course);

      clContent.updateData({ studyResult, course });

      clSide.updateData({ studyResult, course });
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

export const courseStudyManager = createCourseStudyManager();
courseStudyManager.start();
