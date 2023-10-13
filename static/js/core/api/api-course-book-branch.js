import { axiosCatchError } from "../utils/axios-catch-error";

export const create = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../createCourseBookBranch/", formData, config)
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
    .post("../getCourseBookBranch/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const getBranches = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../getCourseBookBranches/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const getAll = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../getAllCourseBookBranch/", formData, config)
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
    .post("../updateCourseBookBranch/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const deleteBranch = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../deleteCourseBookBranch/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const filter = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../filterCourseBookBranch/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const getFromBook = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../getCourseBookChapterFromBook/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const getFromChapter = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../getCourseBookBranchFromChapter/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const shiftChapterBranchIds = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../shiftCourseChapterBranchIds/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const deleteChapterBranchIds = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../deleteCourseChapterBranchIds/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};
