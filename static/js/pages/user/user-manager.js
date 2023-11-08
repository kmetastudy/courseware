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

    this.SignInManager = new SignInManager();
    this.SignUpManager = new SignUpManager();

    this.elThis.appendChild(this.SignInManager.getElement());
    this.elThis.appendChild(this.SignUpManager.getElement());
  }
}
