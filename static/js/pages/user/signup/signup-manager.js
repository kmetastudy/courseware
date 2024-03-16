import { SignUpForm } from "./SignupForm";
import elem from "../../../core/utils/elem/elem";
// require("./signup-manager.css");
export class SignUpManager {
  constructor(options = {}) {
    this.options = options;
    // this.api = new ApiUser("user", "");
    this.#init();
  }

  #init() {
    const options = {
      onSubmit: this.handleSignUp.bind(this),
      onSocialLogin: this.handleSocialLogin.bind(this),
      onClickRenderSignIn: this.handleRenderSignin.bind(this),
    };
    this.clSignUpForm = new SignUpForm(options);
    this.elSignupForm = this.clSignUpForm.getElement();
  }
  // ============ Handler ============
  async handleSignUp(evt, data) {
    try {
      const res = await axios
        // .post("../user/api/sign-up/", data)
        .post("../user/signup/", data)
        .then((res) => {
          if (res.data?.next_url) {
            this.redirect(res.data.next_url);
          }
        })
        .catch((err) => {
          console.log(err);
          console.error("urlSignUp error: ", err.response.data);
        });
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
    return this.elSignupForm;
  }

  redirect(redirect_uri) {
    if (typeof redirect_uri === "string") {
      window.location.href = redirect_uri;
    }
  }
}
