import { MtuInput } from "./mtu-input";
import { MtuIcon } from "../icon/mtu-icon";

// 상속으로 구현해봤다
// 근데 맘에 안든다..
export class InputPassword extends MtuInput {
  constructor(options) {
    options.type = "password";
    super({
      ...options,
      ...{
        type: "password",
        size: "large",
        prefix: "lock",
        suffix: "eyeInvisible",
      },
    });
    this.isPasswordVisible = false;
  }

  setDefaultOptions() {
    super.setDefaultOptions();
  }

  setEvents() {
    super.setEvents();

    const eyeInvisibleIcon = this.elSuffix;
    eyeInvisibleIcon.addEventListener("click", this.handlePasswordToggle.bind(this));
  }

  handlePasswordToggle(evt) {
    if (this.isPasswordVisible === false) {
      this.setPasswordVisible();
    } else if (this.isPasswordVisible === true) {
      this.setPasswordInVisible();
    }
  }

  setPasswordVisible() {
    this.input.setAttribute("type", "text");
    this.isPasswordVisible = true;

    this.elSuffix.removeChild(this.elSuffix.firstChild);
    this.elSuffix.appendChild(MtuIcon("eye"));
  }

  setPasswordInVisible() {
    this.input.setAttribute("type", "password");
    this.isPasswordVisible = false;

    this.elSuffix.removeChild(this.elSuffix.firstChild);
    this.elSuffix.appendChild(MtuIcon("eyeInvisible"));
  }
}
