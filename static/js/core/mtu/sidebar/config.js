import { isValidIconName } from "../icon/mtu-icon";
import { isElement } from "../_util/type-check";

export const sidebarConfig = {
  items: {
    defaultValue: [],
    validate: (value) => Array.isArray(value),
  },
  styles: {
    defaultValue: null,
    validate: (value) => Object.prototype.toString.call(value) === "[object Object]",
  },
  position: {
    defaultValue: "left",
    validate: (value) => ["right", "left"].includes(value),
  },
};

export const sidebarItemConfig = {
  title: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  icon: {
    defaultValue: null,
    validate: (value) => isValidIconName(value),
  },
  aside: {
    defaultValue: null,
    // validate: (value) => isElement(value),
    validate: (value) => {
      if (typeof value === "string") {
        return isElement(document.querySelector(value));
      } else {
        return isElement(value);
      }
    },
  },
};

// var items = [
//   { title: "학습하기", icon: "", key: "", target: document.createElement("div") || "#id" || ".className" },
//   { title: "학습하기", icon: "" },
// ];
