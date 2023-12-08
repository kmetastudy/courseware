import { SignInManager } from "./signin/signin-manager";
import { SignUpManager } from "./signup/signup-manager";

// require("./mtm-manager-learn.css");
export class UserManager {
  constructor(options) {
    this.options = options;
    this.elThis = null;
    this.#init();
  }

  #init() {
    this.elThis = document.createElement("div");
    this.elThis.classList.add("user-app");

    this.SignInManager = new SignInManager({
      onClickRenderSignup: this.activateSignup.bind(this),
    });
    this.SignUpManager = new SignUpManager({
      onClickRenderSignIn: this.activateSignIn.bind(this),
    });

    this.elSignInManager = this.SignInManager.getElement();
    this.elSignUpManager = this.SignUpManager.getElement();

    this.elThis.append(this.elSignInManager, this.elSignUpManager);

    this.activateSignIn();
  }

  activateSignup() {
    this.elSignInManager.classList.remove("activate");
    this.elSignUpManager.classList.add("activate");
  }

  activateSignIn() {
    this.elSignUpManager.classList.remove("activate");
    this.elSignInManager.classList.add("activate");
  }
}
