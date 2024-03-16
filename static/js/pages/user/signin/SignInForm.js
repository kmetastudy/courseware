import { MtuInput } from "../../../core/mtu/input/mtu-input";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
import { MtuButton } from "../../../core/mtu/button/mtu-button";

import { InputPassword } from "../../../core/mtu/input/mtu-input-password";
import elem from "../../../core/utils/elem/elem";

export class SignInForm {
  constructor(options = {}) {
    this.options = options;
    this.title = "로그인";
    this.#init();
  }

  #init() {
    this.create();
    this.setEvents();
  }

  create() {
    this.elThis = elem("sectoin", {
      class: "card rounded-3xl m-auto bg-base-100 py-4 px-8 w-max sm:px-24 sm:w-[540px] hidden",
    });

    this.elForm = elem("form", { class: "card-body text-center" });
    this.elThis.append(this.elForm);

    this.elTitleWrapper = elem("div", { class: "self-center mb-4" });
    this.elTitle = elem("h1", { class: "text-xl card-title" }, this.title);
    this.elTitleWrapper.append(this.elTitle);

    // 이메일
    this.elEmailWrapper = elem("div", { class: "form-control" });
    this.elEmailLabel = elem("label", { class: "label" });
    this.elEmailLabelText = elem("span", { class: "label-text" }, "이메일");
    this.clEmailInput = new MtuInput({
      type: "email",
      size: "large",
      prefix: "smile",
      name: "email",
      placeholder: "abc@abc.com",
      required: true,
    });

    this.elEmailInput = this.clEmailInput.getElement();

    this.elEmailWrapper.append(this.elEmailLabel);
    this.elEmailLabel.append(this.elEmailLabelText);
    this.elEmailWrapper.append(this.elEmailInput);

    // Password
    this.elPasswordWrapper = elem("div", { class: "form-control mb-8" });
    this.elPasswordLabel = elem("label", { class: "label" });
    this.elPasswordLabelText = elem("span", { class: "label-text" }, "비밀번호");
    this.clPasswordInput = new InputPassword({
      type: "password",
      size: "large",
      prefix: "lock",
      suffix: "eyeInvisible",
      placeholder: "영문자, 소문자, 특수문자 포함 최소 8~20자",
      name: "password",
      autocomplete: "on",
      required: true,
    });
    this.elPasswordInput = this.clPasswordInput.getElement();

    this.elPasswordWrapper.append(this.elPasswordLabel);
    this.elPasswordLabel.append(this.elPasswordLabelText);
    this.elPasswordWrapper.append(this.elPasswordInput);

    // submit
    this.elSubmitWrapper = elem("div", { class: "form-control mt-4" });
    this.elButtonWrapper = elem("div", { class: "flex items-end py-4" });
    this.elSubmitButton = elem("button", { class: "btn btn-primary grow rounded-lg" }, "로그인");
    this.elSubmitWrapper.append(this.elButtonWrapper);
    this.elButtonWrapper.append(this.elSubmitButton);

    // Sinup
    this.clSignupButton = new MtuButton({
      text: "course-12가 처음이신가요?",
      type: "text",
      size: "default",
      // htmlType: "button",
      onClick: this.handleSignupClick.bind(this),
    });
    this.elSignupButton = this.clSignupButton.getElement();

    // Social Login
    this.socialLogin = elem("div");
    this.socialLogin.classList.add("social-login");
    // TODO
    // 임시로 socail login은 막아둔다.
    // this.elForm.appendChild(this.socialLogin);

    this.socialLoginTitle = elem("div");
    this.socialLoginTitle.classList.add("social-login-title");
    this.socialLoginTitle.textContent = "다른 계정으로 로그인하기";
    this.socialLogin.appendChild(this.socialLoginTitle);

    // Social Login Buttons
    this.socialLoginButtons = elem("div");
    this.socialLoginButtons.classList.add("social-login-buttons");
    this.socialLogin.appendChild(this.socialLoginButtons);

    this.socialLoginButtons.appendChild(this.createSocialLoginButton("google"));
    this.socialLoginButtons.appendChild(this.createSocialLoginButton("kakao"));
    this.socialLoginButtons.appendChild(this.createSocialLoginButton("naver"));

    this.elForm.append(
      this.elTitleWrapper,
      this.elEmailWrapper,
      this.elPasswordWrapper,
      this.elSubmitWrapper,
      this.elSignupButton,
    );
  }

  createSocialLoginButton(name) {
    const wrapper = elem("div");
    wrapper.classList.add("social-login-button-wrapper");

    const clButton = new MtuButton({
      size: "large",
      icon: name,
      onClick: this.handleSocialLogin.bind(this, name),
    });

    const button = clButton.getElement();
    button.classList.add("social-login-button");
    wrapper.appendChild(button);

    const buttonName = elem("div");
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
      this.elForm.addEventListener("submit", this.handleSubmit.bind(this));
    }
  }

  // Handler
  handleSubmit(evt) {
    evt.preventDefault();

    const data = new FormData(this.elForm);
    this.options.onSubmit(data);
  }

  handleSocialLogin(name, evt) {
    evt.preventDefault();
    if (this.options.onSocialLogin) {
      this.options.onSocialLogin(name);
    }
  }

  handleSignupClick(evt) {
    evt.preventDefault();
    if (this.options.onClickRenderSignup) {
      this.options.onClickRenderSignup();
    }
  }

  // API
  getElement() {
    return this.elThis;
  }
}

// z34nKIkIUrRFo4Xa74bj
