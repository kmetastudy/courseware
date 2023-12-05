import { isElement } from "../_util/type-check";
import { isValidIconName } from "../icon/mtu-icon";

export const tabsConfig = {
  type: {
    defaultValue: "line",
    validate: (value) => ["line", "card", "editable-card"].includes(value),
  },
  size: {
    defaultValue: "middle",
    validate: (value) => ["large", "middle", "small"].includes(value),
  },
  centered: {
    defaultValue: false,
    validate: (value) => typeof value === "boolean",
  },
  items: {
    defaultValue: [],
    validate: (value) => Array.isArray(value),
  },
  onChange: {
    defaultValue: null,
    validate: (value) => typeof value === "function",
  },
  tabPosition: {
    defaultValue: "top",
    validate: (value) => ["top", "right", "bottom", "left"].includes(value),
  },
  onTabClick: {
    defaultValue: null,
    validate: (value) => typeof value === "function",
  },
};

export const itemConfig = {
  title: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  target: {
    defaultValue: null,
    validate: (value) => {
      if (typeof value === "string") {
        return isElement(document.querySelector(value));
      } else {
        return isElement(value);
      }
    },
  },
  disabled: {
    defaultValue: false,
    validate: (value) => typeof value === "boolean",
  },
  key: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  icon: {
    defaultValue: null,
    validate: (value) => isValidIconName(value),
  },
};
