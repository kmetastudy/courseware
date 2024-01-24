require("../../../static/css/css-reset.css");
require("../css/class.css");
export function start_class(context, csrf_token) {
  console.log(csrf_token);
  setConfig(csrf_token);

  initClass(context);
}

function setConfig(csrf_token) {
  const defaultAxiosConfig = {
    headers: { "X-CSRFTOKEN": csrf_token },
  };

  axios.defaults.headers = defaultAxiosConfig.headers;
}

function initClass(context) {
  const parsedContext = JSON.parse(context);

  const options = {
    userType: parsedContext.userType,
    studentId: parsedContext.userId,
    userLogin: parsedContext.userLogin,
  };

  const body = document.getElementById("body");
}
