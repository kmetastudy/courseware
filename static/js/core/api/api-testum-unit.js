import { axiosCatchError } from "../utils/axios-catch-error";

export const create = (data = {}, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../createTestumUnit/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const get = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../getTestumUnit/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const getAll = (data, config) => {
  const formData = new FormData();
  return axios
    .post("../getAllTestumUnit/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const update = (id, data, config) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../updateTestumUnit/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const deleteUnit = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../deleteTestumUnit/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

export const filter = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../filterTestumUnit/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const updateContentIds = (id, contentId, config) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("content_id", contentId);
  return axios
    .post("../updateTestumUnitContentIds/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

export const shiftContentIds = (id, oldIndex, newIndex, config) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("oldIndex", oldIndex);
  formData.append("newIndex", newIndex);
  return axios
    .post("../shiftTestumUnitContentIds/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

export const removeContentIds = (id, contentId, config) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("content_id", contentId);
  return axios
    .post("../deleteTestumUnitContentIds/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};
