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
    .post("../createTestum/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

/**
 *
 * @param {String} testumId
 * @param {Object} config
 * @returns
 */
export const get = (testumId, config) => {
  const formData = new FormData();
  formData.append("id", testumId);
  return axios
    .post("../getTestum/", formData, config)
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
    .post("../getAllTestum/", formData, config)
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
export const update = (testumId, data, config) => {
  const formData = new FormData();
  formData.append("id", testumId);
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../updateTestum/", formData, config)
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
export const deleteTestum = (testumId, config) => {
  const formData = new FormData();
  formData.append("id", testumId);
  return axios
    .post("../deleteTestum/", formData, config)
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
    .post("../filterTestum/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

/**
 *
 * @param {String} TestumId
 * @param {String} unitId
 * @param {Object} config
 * @returns
 */
export const updateUnitIds = (testumId, unitId, config) => {
  const formData = new FormData();
  formData.append("id", testumId);
  formData.append("unit_id", unitId);
  return axios
    .post("../updateTestumUnitIds/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

/**
 *
 * @param {*} TestumId
 * @param {*} unitId
 * @param {*} config
 * @returns
 */
export const removeUnitIds = (testumId, unitId, config) => {
  const formData = new FormData();
  formData.append("id", testumId);
  formData.append("unit_id", unitId);
  return axios
    .post("../removeTestumUnitIds/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

/**
 *
 * @param {Object} data
 * @param {Object} config
 * @returns
 */
export const shiftUnitIds = (testumId, oldIndex, newIndex, config) => {
  const formData = new FormData();
  formData.append("id", testumId);
  formData.append("oldIndex", oldIndex);
  formData.append("newIndex", newIndex);
  return axios
    .post("../shiftTestumUnitIds/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};
