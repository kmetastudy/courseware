import { axiosCatchError } from "../utils/axios-catch-error";

export const create = (data = {}, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../createLessonUnit/", formData, config)
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
    .post("../getLessonUnit/", formData, config)
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
    .post("../getAllLessonUnit/", formData, config)
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
    .post("../updateLessonUnit/", formData, config)
    .then((res) => {
      console.log(res.data.result);
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
    .post("../deleteLessonUnit/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

export const filter = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../filterLessonUnit/", formData, config)
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
    .post("../updateLessonUnitContentIds/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

export const shiftContentIds = (id, oldIndex, newIndex, config) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("oldIndex", oldIndex);
  formData.append("newIndex", newIndex);
  return axios
    .post("../shiftLessonUnitContentIds/", formData, config)
    .then((res) => {})
    .catch(axiosCatchError);
};

export const removeContentIds = (id, contentId, config) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("content_id", contentId);
  return axios
    .post("../deleteLessonUnitContentIds/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};
