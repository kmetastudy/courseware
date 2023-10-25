// Ref
// Design) https://uiverse.io/JohnnyCSilva/bad-cheetah-74
// Function/Extra) https://ant.design/components/form
require("../../../../css/core/ui/form/mtu-signup-form.css");
export const mtuSignupForm = function (options) {
  this.options = options;
  this._init();
};

mtuSignupForm.prototype._init = function () {
  this._create();
  this._initEvents();
};

mtuSignupForm.prototype._create = function () {
  this.elThis = document.createElement("form");
  this.elThis.classList.add("form");
  this.elThis.classList.add("mtu-login-form");

  // username
  this.idLabelWrapper = document.createElement("div");
  this.idLabelWrapper.classList.add("flex-column");
  this.elThis.appendChild(this.idLabelWrapper);

  this.idLabel = document.createElement("label");
  this.idLabel.textContent = "Username";
  this.idLabelWrapper.appendChild(this.idLabel);

  this.elIdWrapper = document.createElement("div");
  this.elIdWrapper.classList.add("inputForm");
  this.elThis.appendChild(this.elIdWrapper);

  this.iconUser = document.createElement("svg");
  this.iconUser.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  this.iconUser.setAttribute("width", "20");
  this.iconUser.setAttribute("height", "20");
  this.iconUser.setAttribute("viewBox", "0 0 36 36");
  this.iconUser.setAttribute("fill", "none");
  this.elIdWrapper.appendChild(this.iconUser);

  const pathUser = document.createElement("path");
  pathUser.setAttribute("fill", "black");
  pathUser.setAttribute("fill-opacity", "0.85");
  pathUser.setAttribute(
    "d",
    "M31.9207 28.1039C31.1628 26.3086 30.0629 24.6779 28.6823 23.3026C27.3059 21.9233 25.6755 20.8236 23.881 20.0642C23.8649 20.0561 23.8488 20.0521 23.8328 20.0441C26.3359 18.2361 27.9631 15.291 27.9631 11.9682C27.9631 6.46373 23.5033 2.00391 17.9988 2.00391C12.4944 2.00391 8.03456 6.46373 8.03456 11.9682C8.03456 15.291 9.66179 18.2361 12.1649 20.0481C12.1488 20.0561 12.1328 20.0602 12.1167 20.0682C10.3167 20.8276 8.70152 21.9164 7.31536 23.3066C5.93607 24.683 4.83636 26.3134 4.07697 28.1079C3.33094 29.8647 2.92859 31.7483 2.8917 33.6566C2.89063 33.6995 2.89815 33.7421 2.91382 33.7821C2.9295 33.822 2.953 33.8584 2.98296 33.8891C3.01291 33.9198 3.04871 33.9442 3.08824 33.9608C3.12777 33.9775 3.17024 33.9861 3.21313 33.9861H5.62384C5.80063 33.9861 5.94126 33.8454 5.94527 33.6727C6.02563 30.5709 7.27117 27.666 9.47295 25.4642C11.7511 23.1861 14.7765 21.9325 17.9988 21.9325C21.2212 21.9325 24.2466 23.1861 26.5247 25.4642C28.7265 27.666 29.9721 30.5709 30.0524 33.6727C30.0564 33.8494 30.1971 33.9861 30.3738 33.9861H32.7846C32.8275 33.9861 32.8699 33.9775 32.9095 33.9608C32.949 33.9442 32.9848 33.9198 33.0147 33.8891C33.0447 33.8584 33.0682 33.822 33.0839 33.7821C33.0995 33.7421 33.1071 33.6995 33.106 33.6566C33.0658 31.7361 32.668 29.8678 31.9207 28.1039ZM17.9988 18.8789C16.1546 18.8789 14.4189 18.1597 13.1131 16.8539C11.8073 15.5481 11.0881 13.8124 11.0881 11.9682C11.0881 10.124 11.8073 8.38828 13.1131 7.08248C14.4189 5.77667 16.1546 5.05748 17.9988 5.05748C19.843 5.05748 21.5788 5.77667 22.8846 7.08248C24.1904 8.38828 24.9096 10.124 24.9096 11.9682C24.9096 13.8124 24.1904 15.5481 22.8846 16.8539C21.5788 18.1597 19.843 18.8789 17.9988 18.8789Z",
  );
  this.iconUser.appendChild(pathUser);

  this.idInput = document.createElement("input");
  this.idInput.setAttribute("placeholder", "Username");
  this.idInput.setAttribute("class", "input");
  this.idInput.setAttribute("type", "text");
  this.idInput.setAttribute("name", "username");
  this.elIdWrapper.appendChild(this.idInput);

  // Password Label
  this.pwLabelWrapper = document.createElement("div");
  this.pwLabelWrapper.classList.add("flex-column");
  this.elThis.appendChild(this.pwLabelWrapper);

  this.passwordLabel = document.createElement("label");
  this.passwordLabel.textContent = "Password";
  this.pwLabelWrapper.appendChild(this.passwordLabel);

  // password
  this.pwWrapper = document.createElement("div");
  this.pwWrapper.classList.add("inputForm");
  this.elThis.appendChild(this.pwWrapper);

  this.iconLock = document.createElement("svg");
  this.iconLock.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  this.iconLock.setAttribute("width", "20");
  this.iconLock.setAttribute("height", "20");
  this.iconLock.setAttribute("viewBox", "0 0 36 36");
  this.iconLock.setAttribute("fill", "none");
  this.pwWrapper.appendChild(this.iconLock);

  const pathLock = document.createElement("path");
  pathLock.setAttribute("fill", "black");
  pathLock.setAttribute("fill-opacity", "0.85");
  pathLock.setAttribute(
    "d",
    "M30.8574 16.0765H28.1253V7.07645C28.1253 4.23583 25.823 1.93359 22.9824 1.93359H13.0181C10.1775 1.93359 7.87528 4.23583 7.87528 7.07645V16.0765H5.14314C4.43198 16.0765 3.85742 16.651 3.85742 17.3622V32.7907C3.85742 33.5019 4.43198 34.0765 5.14314 34.0765H30.8574C31.5686 34.0765 32.1431 33.5019 32.1431 32.7907V17.3622C32.1431 16.651 31.5686 16.0765 30.8574 16.0765ZM10.7681 7.07645C10.7681 5.83493 11.7766 4.82645 13.0181 4.82645H22.9824C24.2239 4.82645 25.2324 5.83493 25.2324 7.07645V16.0765H10.7681V7.07645ZM29.2503 31.1836H6.75028V18.9693H29.2503V31.1836ZM16.8753 25.5988V27.7282C16.8753 27.905 17.0199 28.0497 17.1967 28.0497H18.8039C18.9806 28.0497 19.1253 27.905 19.1253 27.7282V25.5988C19.4569 25.3607 19.7045 25.0234 19.8323 24.6357C19.9601 24.2479 19.9616 23.8296 19.8365 23.4409C19.7114 23.0523 19.4663 22.7133 19.1363 22.4729C18.8063 22.2324 18.4086 22.1029 18.0003 22.1029C17.592 22.1029 17.1942 22.2324 16.8643 22.4729C16.5343 22.7133 16.2891 23.0523 16.164 23.4409C16.039 23.8296 16.0404 24.2479 16.1683 24.6357C16.2961 25.0234 16.5436 25.3607 16.8753 25.5988Z",
  );
  this.iconLock.appendChild(pathLock);

  this.pwInput = document.createElement("input");
  this.pwInput.setAttribute("placeholder", "Password");
  this.pwInput.setAttribute("class", "input");
  this.pwInput.setAttribute("type", "password");
  this.pwInput.setAttribute("name", "password");
  this.pwWrapper.appendChild(this.pwInput);

  // Password Label
  this.pwLabelWrapper = document.createElement("div");
  this.pwLabelWrapper.classList.add("flex-column");
  this.elThis.appendChild(this.pwLabelWrapper);

  this.passwordLabel = document.createElement("label");
  this.passwordLabel.textContent = "Password Confirm";
  this.pwLabelWrapper.appendChild(this.passwordLabel);
  // password Confirm
  this.pwConfirmWrapper = document.createElement("div");
  this.pwConfirmWrapper.classList.add("inputForm");
  this.elThis.appendChild(this.pwConfirmWrapper);

  this.pwConfirmWrapper.appendChild(this.iconLock);
  this.iconLock.appendChild(pathLock);

  this.pwConfirmInput = document.createElement("input");
  this.pwConfirmInput.setAttribute("placeholder", "Confirm Password");
  this.pwConfirmInput.setAttribute("class", "input");
  this.pwConfirmInput.setAttribute("type", "password");
  this.pwConfirmInput.setAttribute("name", "password-confirm");
  this.pwConfirmWrapper.appendChild(this.pwConfirmInput);

  // 광고동의?
  this.checkboxWrapper = document.createElement("div");
  this.checkboxWrapper.classList.add("flex-row");
  this.elThis.appendChild(this.checkboxWrapper);

  const container = document.createElement("div");
  this.checkboxWrapper.appendChild(container);

  this.elCheckBox = document.createElement("input");
  this.elCheckBox.setAttribute("type", "checkbox");
  this.elCheckBox.setAttribute("name", "is-subscribe");
  container.appendChild(this.elCheckBox);

  this.subscribeLabel = document.createElement("label");
  this.subscribeLabel.textContent = "Subscribe to the newletter";
  container.appendChild(this.subscribeLabel);

  // Sign up
  this.elSubmit = document.createElement("button");
  this.elSubmit.classList.add("button-submit");
  this.elSubmit.textContent = "Sign up";
  this.elThis.appendChild(this.elSubmit);

  // Sign in
  this.elSignIn = document.createElement("p");
  this.elSignIn.classList.add("p");
  this.elSignIn.classList.add("lines");
  this.elSignIn.textContent = "Already have an account? ";
  this.elThis.appendChild(this.elSignIn);

  this.elSignInText = document.createElement("span");
  this.elSignInText.classList.add("span");
  this.elSignInText.textContent = "Sign In";
  this.elSignIn.appendChild(this.elSignInText);
};

mtuSignupForm.prototype._initEvents = function () {
  this.elThis.addEventListener("submit", this.handleSubmit.bind(this));
};

mtuSignupForm.prototype.handleSubmit = function (event) {
  event.preventDefault();
  const data = new FormData(this.elThis);
  const objectData = this.formDataToObject(data);
  if (this.validateData(objectData) === true && this.options.onSubmit) {
    this.options.onSubmit(data);
  }
};

mtuSignupForm.prototype.validateData = function (data) {
  //
  if (data["password"] !== data["password-confirm"]) {
    console.log(data);
    console.log("password not confirmed");
    return false;
  }
  return true;
};
// TODO
// dynamic
mtuSignupForm.prototype._initVariable = function () {
  this.defaultItem = [
    { name: "Id", label: "Id", placeholder: "Id를 입력해주세요", icon: "" },
    { name: "Id", label: "password", placeholder: "Id를 입력해주세요" },
  ];
};

mtuSignupForm.prototype.formDataToObject = function (formData) {
  const obj = {};
  for (const [key, value] of formData.entries()) {
    obj[key] = value;
  }
  return obj;
};
