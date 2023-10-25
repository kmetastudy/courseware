import { mtuLoginForm } from "../../../core/ui/form/mtu-login-form";

export const mtmLoginManager = function (options = {}) {
  this.options = options;
  this._init();
};

mtmLoginManager.prototype._init = function () {
  const options = {
    onSubmit: this.handleSubmit.bind(this),
  };
  this.clLoginForm = new mtuLoginForm(options);
};

mtmLoginManager.prototype.handleSubmit = async function (data) {
  const res = this.urlLogin(data);
  console.log(res);
};

mtmLoginManager.prototype.getElement = function () {
  return this.clLoginForm.elThis;
};

mtmLoginManager.prototype.urlLogin = function (data) {
  return axios
    .post("../api/login/", data)
    .then((res) => {
      console.log(res);
      if (res.data) {
        return res.data;
      }
    })
    .catch((err) => console.error("urlLogin error: ", err.response.data));
};
