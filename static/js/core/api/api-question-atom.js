import { axiosCatchError } from "../utils/axios-catch-error";

export const create = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../createQuestionAtom/", formData, config)
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
    .post("../getQuestionAtom/", formData, config)
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
    .post("../updateQuestionAtom/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};

export const filter = (condition, config) => {
  const formData = new FormData();
  formData.append("condition", JSON.stringify(condition));
  return axios
    .post("../question/filter/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};
