import { SignInManager } from "./signin/signin-manager";
import { SignUpManager } from "./signup/signup-manager";
import elem from "../../core/utils/elem/elem";
// require("./mtm-manager-learn.css");
export class UserManager {
  constructor(options) {
    this.options = options;
    this.elThis = null;
    this.#init();
  }

  #init() {
    this.elThis = elem("div", { class: "h-screen bg-base-200 flex justify-center item-center" });

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
    this.elSignInManager.classList.add("hidden");
    // this.elSignUpManager.classList.add("activate");
    this.elSignUpManager.classList.remove("hidden");
  }

  activateSignIn() {
    // this.elSignUpManager.classList.remove("activate");
    this.elSignUpManager.classList.add("hidden");
    this.elSignInManager.classList.remove("hidden");
  }

  getElement() {
    return this.elThis;
  }
}
