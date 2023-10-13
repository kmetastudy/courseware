import { axiosCatchError } from "../utils/axios-catch-error";

export const create = (data, config) => {
  const formData = new FormData();
  formData.append("data", JSON.stringify(data));
  return axios
    .post("../createVideoAtom/", formData, config)
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
    .post("../getVideoAtom/", formData, config)
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
    .post("../updateVideoAtom/", formData, config)
    .then((res) => {
      if (res.data.result) {
        return res.data.result;
      }
    })
    .catch(axiosCatchError);
};
