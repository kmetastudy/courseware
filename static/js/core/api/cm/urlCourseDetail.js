/**
 * @typedef urlCourseDetailInterface
 * @property {(pk: number) => Promise<{...}>} get
 * @property {(param: string) => Promise<{...}>} filter
 */

/**
 * @type {urlCourseDetailInterface} todo list repository
 */
const urlCourseDetail = (() => {
  function getRootUrl() {
    return window.location.origin;
  }
  return {
    getList: (courseIds) => {
      const rootUrl = getRootUrl();
      const formData = new FormData();
      formData.append("course_ids", JSON.stringify(courseIds));
      return axios.post(`${rootUrl}/cm/get-detail-list/`, formData);
    },

    //
  };
})();

export default urlCourseDetail;
