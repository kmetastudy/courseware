import { SignUpForm } from "./signup-form";

require("./signup-manager.css");
export class SignUpManager {
  constructor(options = {}) {
    this.options = options;
    // this.api = new ApiUser("user", "");
    this.#init();
  }

  #init() {
    this.elThis = document.createElement("div");
    this.elThis.classList.add("sign-up-manager");
    // this.elThis.setAttribute("style", "width:450px;margin:200px 400px;");

    const options = {
      onSubmit: this.handleSignUp.bind(this),
      onSocialLogin: this.handleSocialLogin.bind(this),
      onClickRenderSignIn: this.handleRenderSignin.bind(this),
    };
    this.clSignUpForm = new SignUpForm(options);
    this.elThis.appendChild(this.clSignUpForm.getElement());
  }
  //////////////// HANDLER ////////////////
  async handleSignUp(data) {
    try {
      const res = await this.urlSignUp(data);
      if (res.success && res.next_url) {
        this.redirect(res.next_url);
      } else {
        this.handleSignUpFail(res);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async handleSocialLogin(name) {
    try {
      const res = await this.urlGetAuthCode(name);
      if (res) window.location.href = res.data.url;
    } catch (err) {
      // console.log(err);
    }
  }
  //
  handleSignUpFail(res) {
    console.log("SignUp Fail: ", res);
  }

  handleRenderSignin() {
    if (this.options.onClickRenderSignIn) {
      this.options.onClickRenderSignIn();
    }
  }

  //////////////// URL ////////////////
  urlSignUp(data) {
    return axios
      .post("../user/api/sign-up/", data)
      .then((res) => {
        console.log(res);
        if (res?.data.result) {
          return res.data.result;
        }
      })
      .catch((err) => console.error("urlSignUp error: ", err.response.data));
  }

  urlGetAuthCode(name) {
    const url = `../user/signin/${name}/`;
    return axios
      .get(url)
      .then((res) => {
        if (res.data && res.data.url) {
          return res.data.url;
        }
      })
      .catch((err) => console.log(err));
  }

  urlGetSocialInfo(redirect_uri) {
    return axios
      .get(redirect_uri)
      .then((res) => {
        if (res.data) {
          return res.data;
        }
      })
      .catch((err) => console.log(err));
  }

  //////////////// API ////////////////
  getElement() {
    return this.elThis;
  }

  redirect(redirect_uri) {
    if (typeof redirect_uri === "string") {
      window.location.href = redirect_uri;
    }
  }
}
