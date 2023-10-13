import { AppCp } from "../../../static/js/pages/cp/AppCp";
require("../css/cp.css");

const defaultAxiosConfig = {
  headers: { "X-CSRFTOKEN": csrftoken },
};
axios.defaults.headers = defaultAxiosConfig.headers;

const clAppCp = new AppCp();
const elAppCp = clAppCp.elThis;
document.body.appendChild(elAppCp);
