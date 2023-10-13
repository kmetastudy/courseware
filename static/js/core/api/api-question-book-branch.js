import { axiosCatchError } from "../utils/axios-catch-error";

export const create = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../createCourseBook/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const get = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../getCourseBook/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const getAll = (config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../getAllCourseBook/", formData, config)
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
    .post("../updateCourseBook/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const remove = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../deleteCourseBook/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const filter = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../filterCourseBook/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const shiftBranchIds = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../shiftCourseBookBranchIds/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const deleteBranchIds = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../deleteCourseBookBranchIds/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const clone = (courseBookId, config) => {
  const formData = new FormData();
  formData.append("id", courseBookId);
  return axios
    .post("../cloneCourse/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};
