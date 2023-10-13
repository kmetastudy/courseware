import { axiosCatchError } from "../utils/axios-catch-error";
import { axiosCatchError } from "../utils";
/**
 *
 * @param {*} id
 * @param {*} config
 * @returns [data, atomType];
 */
export const get = (id, config) => {
  const formData = new FormData();
  formData.append("id", id);
  return axios
    .post("../getAtom/", formData, config)
    .then((res) => {
      if (res.data) {
        return [res.data.result, res.data.atomType];
      }
    })
    .catch(axiosCatchError);
};
