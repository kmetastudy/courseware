import { BaseApi } from "../core/BaseApi";

export const apiCp = {
  course: new BaseApi("/cp/api/course_n/"),
  element: new BaseApi("/cp/api/element_n/"),
};
