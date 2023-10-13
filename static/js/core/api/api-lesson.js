import { axiosCatchError } from "../utils/axios-catch-error";

/**
 *
 * @param {Object} data
 * @param {Object} config
 * @returns
 */
export const create = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../createLesson/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

/**
 *
 * @param {String} id
 * @param {Object} config
 * @returns
 */
export const get = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../getLesson/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

/**
 *
 * @param {Object} data
 * @param {Object} config
 * @returns
 */
export const getALl = (data, config) => {
  const formData = new FormData();
  return axios
    .post("../getAllLesson/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

/**
 *
 * @param {Object} data
 * @param {Object} config
 * @returns
 */
export const update = (id, data, config) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../updateLesson/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

/**
 *
 * @param {Object} data
 * @param {Object} config
 * @returns
 */
export const deleteLesson = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../deleteLesson/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

/**
 *
 * @param {Object} data
 * @param {Object} config
 * @returns
 */
export const filter = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../filterLesson/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

/**
 *
 * @param {String} id
 * @param {String} unitId
 * @param {Object} config
 * @returns
 */
export const updateUnitIds = (id, unitId, config) => {
  const formData = new FormData();
  formData.append("lesson_id", id);
  formData.append("unit_id", unitId);
  return axios
    .post("../updateLessonUnitIds/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

/**
 *
 * @param {*} id
 * @param {*} unitId
 * @param {*} config
 * @returns
 */
export const removeUnitIds = (id, unitId, config) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("unit_id", unitId);
  return axios
    .post("../removeLessonUnitIds/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

/**
 *
 * @param {Object} data
 * @param {Object} config
 * @returns
 */
export const shiftUnitIds = (id, oldIndex, newIndex, config) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("oldIndex", oldIndex);
  formData.append("newIndex", newIndex);
  return axios
    .post("../shiftLessonUnitIds/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};
