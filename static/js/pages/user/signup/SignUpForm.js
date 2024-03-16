import elem from "../../../core/utils/elem/elem";
import { MtuInput } from "../../../core/mtu/input/mtu-input";
import { TYPE_USER } from "../constants";
import { InputPassword } from "../../../core/mtu/input/mtu-input-password";
import { MtuButton } from "../../../core/mtu/button/mtu-button";

export class SignUpForm {
  constructor({ onSubmit, onClickRenderSignIn }) {
    this.onSubmit = onSubmit;
    this.onClickRenderSignIn = onClickRenderSignIn;
    this.title = "회원가입";

    this.init();
  }

  init() {
    this.create();
    this.initEvents();
  }

  create() {
    this.elThis = elem("section", {
      class: "card rounded-3xl m-auto bg-base-100 py-4 px-8 w-max sm:px-24 sm:w-[540px] hidden",
    });

    this.elForm = elem("form", { class: "card-body text-center" });
    this.elThis.append(this.elForm);

    this.elTitleWrapper = elem("div", { class: "self-center mb-4" });
    this.elTitle = elem("h1", { class: "text-xl card-title" }, this.title);
    this.elTitleWrapper.append(this.elTitle);

    // 이름
    this.elNameWrapper = elem("div", { class: "form-control" });
    this.elNameLabel = elem("label", { class: "label" });
    this.elNameLabelText = elem("span", { class: "label-text" }, "이름");
    this.clNameInput = new MtuInput({
      type: "text",
      size: "large",
      prefix: "smile",
      placeholder: "홍길동",
      name: "full_name",
      required: true,
    });
    this.elNameInput = this.clNameInput.getElement();

    this.elNameWrapper.append(this.elNameLabel);
    this.elNameLabel.append(this.elNameLabelText);
    this.elNameWrapper.append(this.elNameInput);

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
    console.log("signup-form");
    this.elPasswordInput = this.clPasswordInput.getElement();

    this.elPasswordWrapper.append(this.elPasswordLabel);
    this.elPasswordLabel.append(this.elPasswordLabelText);
    this.elPasswordWrapper.append(this.elPasswordInput);

    // 유형 선택
    this.elChoiceTextWrapper = elem("div", { class: "form-control" });
    this.elChoiceLabel = elem("div", { class: "label justify-start gap-2" });
    this.elChoiceText = elem(
      "span",
      { class: "label-text text-xs font-bold text-base-content/50" },
      "사용자 유형을 선택해주세요.",
    );
    this.elChoiceTextWrapper.append(this.elChoiceLabel);
    this.elChoiceLabel.append(this.elChoiceText);

    this.elChoiceContainer = elem("div", { class: "form-control" });

    // 학생
    this.elChoiceStudentWrapper = elem("div", { class: "form-control" });
    this.elChoiceStudentLabel = elem("label", { class: "label cursor-pointer" });
    this.elChoiceStudentLabelText = elem("span", { class: "label-text" }, "학생");
    this.elChoiceStudentInput = elem("input", {
      type: "radio",
      name: "type",
      value: TYPE_USER.STUDENT,
      class: "radio radio-sm",
    });

    this.elChoiceStudentWrapper.append(this.elChoiceStudentLabel);
    this.elChoiceStudentLabel.append(this.elChoiceStudentLabelText);
    this.elChoiceStudentLabel.append(this.elChoiceStudentInput);

    // 선생님
    this.elChoiceTeacherWrapper = elem("div", { class: "form-control" });
    this.elChoiceTeacherLabel = elem("label", { class: "label cursor-pointer" });
    this.elChoiceTeacherLabelText = elem("span", { class: "label-text" }, "선생님");
    this.elChoiceTeacherInput = elem("input", {
      type: "radio",
      name: "type",
      value: TYPE_USER.TEACHER,
      class: "radio radio-sm",
    });

    this.elChoiceTeacherWrapper.append(this.elChoiceTeacherLabel);
    this.elChoiceTeacherLabel.append(this.elChoiceTeacherLabelText);
    this.elChoiceTeacherLabel.append(this.elChoiceTeacherInput);

    // 기타
    this.elChoiceExtraWrapper = elem("div", { class: "form-control" });
    this.elChoiceExtraLabel = elem("label", { class: "label cursor-pointer" });
    this.elChoiceExtraLabelText = elem("span", { class: "label-text" }, "기타");
    this.elChoiceExtraInput = elem("input", {
      type: "radio",
      name: "type",
      class: "radio radio-sm",
      name: "type",
      value: TYPE_USER.USER,
      checked: "",
    });

    this.elChoiceExtraWrapper.append(this.elChoiceExtraLabel);
    this.elChoiceExtraLabel.append(this.elChoiceExtraLabelText);
    this.elChoiceExtraLabel.append(this.elChoiceExtraInput);

    this.elChoiceContainer.append(this.elChoiceStudentWrapper, this.elChoiceTeacherWrapper, this.elChoiceExtraWrapper);

    // submit
    this.elSubmitWrapper = elem("div", { class: "form-control mt-4" });
    this.elButtonWrapper = elem("div", { class: "flex items-end py-4" });
    this.elSubmitButton = elem("button", { class: "btn btn-primary grow rounded-lg" }, "생성하기");
    this.elSubmitWrapper.append(this.elButtonWrapper);
    this.elButtonWrapper.append(this.elSubmitButton);

    this.clSignInButton = new MtuButton({
      text: "이미 계정이 있으신가요?",
      type: "text",
      size: "default",
      onClick: this.handleSignInClick.bind(this),
    });
    this.elSignInButton = this.clSignInButton.getElement();

    this.elForm.append(
      this.elTitleWrapper,
      this.elNameWrapper,
      this.elEmailWrapper,
      this.elPasswordWrapper,
      this.elChoiceTextWrapper,
      this.elChoiceContainer,
      this.elSubmitWrapper,
      this.elSignInButton,
    );
  }

  initEvents() {
    this.elForm.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const formData = new FormData(this.elForm);
    console.log(formData);

    if (this.onSubmit) {
      this.onSubmit(evt, formData);
    }
  }

  handleSignInClick(evt) {
    evt.preventDefault();
    this.onClickRenderSignIn?.();
  }

  getElement() {
    return this.elThis;
  }
}
