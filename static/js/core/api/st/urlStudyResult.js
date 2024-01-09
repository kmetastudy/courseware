import isString from "../../utils/type/isString";

/**
 * @typedef urlStudyResultInterface
 * @property {(pk: number) => Promise<{...}>} get
 * @property {(param: string) => Promise<{...}>} filter
 */

/**
 * @type {urlStudyResultInterface} todo list repository
 */
const urlStudyResult = (() => {
  function getRootUrl() {
    return window.location.origin;
  }
  return {
    get: (pk) => {
      const rootUrl = getRootUrl();
      return axios.get(`${rootUrl}/st/api/study_result/${pk}`);
    },

    filter: (param) => {
      const rootUrl = getRootUrl();
      return axios.get(`${rootUrl}/st/api/study_result/`, { params: param });
    },

    //
  };
})();

export default urlStudyResult;
