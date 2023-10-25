import { mtuSignupForm } from "../../../core/ui/form/mtu-signup-form";

export const mtmSignupManager = function (options = {}) {
  this.options = options;
  this._init();
};

mtmSignupManager.prototype._init = function () {
  const options = {
    onSubmit: this.handleSubmit.bind(this),
  };
  this.clLoginForm = new mtuSignupForm(options);
};

mtmSignupManager.prototype.handleSubmit = async function (data) {
  console.log(data);
  this.urlSignUp(data);
};

mtmSignupManager.prototype.getElement = function () {
  return this.clLoginForm.elThis;
};

mtmSignupManager.prototype.urlSignUp = function (data) {
  return axios
    .post("../api/sign-up/", data)
    .then((res) => {
      console.log(res);
      if (res.data) {
        return res.data;
      }
    })
    .catch((err) => console.error("urlLogin error: ", err.response.data));
};
