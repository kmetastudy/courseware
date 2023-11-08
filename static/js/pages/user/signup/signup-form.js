import { MtuInput } from "../../../core/mtu/input/mtu-input";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
import { MtuButton } from "../../../core/mtu/button/mtu-button";

import { InputPassword } from "../../../core/mtu/input/mtu-input-password";

require("../../../../css/pages/user/signup/signup-form.css");
export class SignUpForm {
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
    this.elThis.classList.add("mtu-signup-form");

    this.elNameLabel = document.createElement("div");
    this.elNameLabel.classList.add("mtu-form-label");
    this.elNameLabel.textContent = "닉네임";
    this.elThis.appendChild(this.elNameLabel);

    this.clName = new MtuInput({
      type: "text",
      size: "large",
      prefix: "smile",
      placeholder: "이름을 입력해 주세요.",
      name: "nickname",
    });
    this.elThis.appendChild(this.clName.getElement());

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

    // Password
    this.clPassword = new InputPassword({
      type: "password",
      size: "large",
      prefix: "lock",
      suffix: "eyeInvisible",
      placeholder: "영문자, 소문자, 특수문자 포함 최소 8~20자",
      name: "password",
      autocomplete: "",
    });

    this.elThis.appendChild(this.clPassword.getElement());

    // Password Confirm
    this.clPasswordConfirm = new InputPassword({
      type: "password",
      size: "large",
      prefix: "lock",
      suffix: "eyeInvisible",
      className: "password-confirm",
      placeholder: "비밀번호를 확인해주세요",
      name: "passwordConfirm",
      autocomplete: "",
    });

    this.elPasswordConfirm = this.clPasswordConfirm.getElement();
    this.elPasswordConfirm.classList.add("signup-password-confirm");

    this.elThis.appendChild(this.elPasswordConfirm);
    // Submit
    this.clSubmitButton = new MtuButton({
      text: "회원가입",
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
    const wrapper = document.createElement("form");
    wrapper.classList.add("social-login-button-wrapper");
    wrapper.setAttribute("action", `../user/signin/${name}/`);

    const clButton = new MtuButton({
      htmlType: "submit",
      size: "large",
      icon: name,
      // onSocialBtnClick: this.handleSocialLogin.bind(this, name),
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

    Array.from(this.elThis.elements).forEach((input) => {
      if (input.nodeName === "INPUT") {
        input.addEventListener("input", this.handleInput.bind(this));
      }
    });
  }

  // Handler
  handleSubmit(evt) {
    evt.preventDefault();

    const formData = new FormData(this.elThis);
    this.options.onSubmit(formData);
  }

  // TODO
  // Validatiy Message
  handleInput(evt) {}
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
