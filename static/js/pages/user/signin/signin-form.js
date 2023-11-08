import { MtuInput } from "../../../core/mtu/input/mtu-input";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
import { MtuButton } from "../../../core/mtu/button/mtu-button";

import { InputPassword } from "../../../core/mtu/input/mtu-input-password";

require("../../../../css/pages/user/signin/signin-form.css");
// require("../../../../css/core/ui/form/mtu-signup-form.css");
export class SignInForm {
  constructor(options = {}) {
    this.options = options;
    //
    this.#init();
  }

  #init() {
    this.create();
    this.setEvents();
  }

  create() {
    this.elThis = document.createElement("form");
    this.elThis.classList.add("mtu-form");
    this.elThis.classList.add("mtu-signin-form");

    this.elEmailLabel = document.createElement("div");
    this.elEmailLabel.classList.add("mtu-form-label");
    this.elEmailLabel.textContent = "이메일";
    this.elThis.appendChild(this.elEmailLabel);

    // Email
    this.clEmail = new MtuInput({
      type: "email",
      size: "large",
      prefix: "mail",
      placeholder: "이메일을 입력해주세요",
      name: "email",
    });
    this.elThis.appendChild(this.clEmail.getElement());

    this.elPasswordLabel = document.createElement("div");
    this.elPasswordLabel.textContent = "비밀번호";
    this.elPasswordLabel.classList.add("mtu-form-label");
    this.elThis.appendChild(this.elPasswordLabel);

    this.elPasswordForget = document.createElement("a");
    this.elPasswordForget.setAttribute("href", "");
    this.elPasswordForget.textContent = "비밀번호 재설정";
    this.elPasswordLabel.appendChild(this.elPasswordForget);

    // Password
    this.clPassword = new InputPassword({
      type: "password",
      size: "large",
      prefix: "lock",
      suffix: "eyeInvisible",
      placeholder: "비밀번호를 입력해주세요",
      name: "password",
      autocomplete: "",
    });

    this.elThis.appendChild(this.clPassword.getElement());

    // Submit
    this.clSubmitButton = new MtuButton({
      text: "로그인",
      type: "primary",
      size: "large",
      htmlType: "submit",
      onSubmit: this.handleSubmit.bind(this),
    });
    this.elThis.appendChild(this.clSubmitButton.getElement());

    // Social Login
    this.socialLogin = document.createElement("div");
    this.socialLogin.classList.add("social-login");
    this.elThis.appendChild(this.socialLogin);

    this.socialLoginTitle = document.createElement("div");
    this.socialLoginTitle.classList.add("social-login-title");
    this.socialLoginTitle.textContent = "다른 계정으로 로그인하기";
    this.socialLogin.appendChild(this.socialLoginTitle);

    // Social Login Buttons
    this.socialLoginButtons = document.createElement("div");
    this.socialLoginButtons.classList.add("social-login-buttons");
    this.socialLogin.appendChild(this.socialLoginButtons);

    this.socialLoginButtons.appendChild(this.createSocialLoginButton("google"));
    this.socialLoginButtons.appendChild(this.createSocialLoginButton("kakao"));
    this.socialLoginButtons.appendChild(this.createSocialLoginButton("naver"));
  }

  createSocialLoginButton(name) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("social-login-button-wrapper");

    const clButton = new MtuButton({
      size: "large",
      icon: name,
      onClick: this.handleSocialLogin.bind(this, name),
    });

    const button = clButton.getElement();
    button.classList.add("social-login-button");
    wrapper.appendChild(button);

    const buttonName = document.createElement("div");
    buttonName.classList.add("social-login-button-name");
    buttonName.textContent = this.capitalize(name);
    wrapper.appendChild(buttonName);

    return wrapper;
  }

  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  setEvents() {
    if (this.options.onSubmit) {
      this.elThis.addEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  // Handler
  handleSubmit(evt) {
    evt.preventDefault();

    const data = new FormData(this.elThis);
    this.options.onSubmit(data);
  }

  handleSocialLogin(name, evt) {
    evt.preventDefault();
    if (this.options.onSocialLogin) {
      this.options.onSocialLogin(name);
    }
  }

  // API
  getElement() {
    return this.elThis;
  }
}

// z34nKIkIUrRFo4Xa74bj
