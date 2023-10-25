import { mtuButton } from "./button/mtu-button";
import { mtuInput } from "./input/mtu-input";
import { mtuForm } from "./form/mtu-form";

import { mtuButton } from "./button/mtu-button";
class Mtu {
  static Button = mtuButton;
  static Input = mtuInput;
  static Form = mtuForm;

  static componentMapping = {
    button: "Button",
  };

  static createComponent(type, options) {
    const componentType = this.componentMapping[type];
    if (!componentType) {
      throw new Error(`Component type ${type} is not supported`);
    }
    return this[component2Type].create(options);
  }
}

// Mtu.prototype.
2;
