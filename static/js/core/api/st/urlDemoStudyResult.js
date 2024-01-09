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
      return axios.get(`${rootUrl}/st/api/demo_study_result/${pk}`);
    },

    filter: (param) => {
      const rootUrl = getRootUrl();
      return axios.get(`${rootUrl}/st/api/demo_study_result/`, { params: param });
    },

    //
  };
})();
