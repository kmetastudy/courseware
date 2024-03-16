import { SignInForm } from "./SignInForm";

require("./signin-manager.css");
export class SignInManager {
  constructor(options = {}) {
    this.options = options;
    this.#init();
  }

  #init() {
    // this.elThis = document.createElement("div");
    // this.elThis.classList.add("sign-in-manager");
    // this.elThis.setAttribute("style", "width:450px;margin:200px 400px;");

    this.clSignInForm = new SignInForm({
      onSubmit: this.handleLogin.bind(this),
      onSocialLogin: this.handleSocialLogin.bind(this),
      onClickRenderSignup: this.handleRenderSignup.bind(this),
    });

    this.elSignInForm = this.clSignInForm.getElement();
    // this.elThis.appendChild(this.clSignInForm.getElement());
  }
  //////////////// HANDLER ////////////////

  async handleLogin(data) {
    try {
      const res = await this.urlLogin(data);
      if (res.success === true && res.next_url) {
        window.location.href = res.next_url;
      } else {
        this.handleLoginFail(res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async handleSocialLogin(socialName) {
    try {
      const res = await this.urlSocialLogin(socialName);
    } catch (err) {
      // console.log(err);
    }
  }

  handleLoginFail(res) {
    console.log("Login Fail!", res);
  }

  handleRenderSignup() {
    if (this.options.onClickRenderSignup) {
      this.options.onClickRenderSignup();
    }
  }
  //////////////// URL ////////////////

  urlLogin(data) {
    return axios
      .post("../user/api/login/", data)
      .then((res) => {
        console.log(res);
        if (res?.data.result) {
          return res.data.result;
        }
      })
      .catch((err) => console.error("urlLogin error: ", err.response.data));
  }

  // get url of authcode
  urlSocialLogin(socialName) {
    // const url = `../user/signin/${socialName}/`;
    const url = socialName === "google" ? `../user/signin/google/test/` : `../user/signin/${socialName}/`;

    return axios.get(url).then((res) => {
      if (res.data && res.data.url) {
        window.location.href = res.data.url;
        return;
      } else {
        console.log("social fail");
        return;
      }
    });
  }

  //////////////// API ////////////////
  getElement() {
    return this.elSignInForm;
  }
}
