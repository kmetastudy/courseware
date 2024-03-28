import { BaseApi } from "../core/BaseApi";

export const apiClass = {
  class: new BaseApi("/class/api/class/"),
  singleCourseClass: new BaseApi("/class/api/single-course-class/"),
  classMember: new BaseApi("/class/api/class-member/"),
  classPost: new BaseApi("/class/api/class-post/"),
  comment: new BaseApi("/class/api/comment/"),
  reaction: new BaseApi("/class/api/reaction/"),
  classContentAssign: new BaseApi("/class/api/class-content-assign/"),
  classInvitation: new BaseApi("/class/api/class-invitation/"),
  studyResult: new BaseApi("/class/api/study-result/"),
};
