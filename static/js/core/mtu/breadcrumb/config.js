import { isValidIconName } from "../icon/mtu-icon";
import { validateUrl } from "../_util/validate-url";

export const config = {
  separator: {
    defaultValue: ">",
    validate: (value) => typeof value === "string",
  },
  items: {
    defaultValue: [],
    validate: (value) => Array.isArray(value),
  },
};

export const itemConfig = {
  title: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  className: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  href: {
    defaultValue: null,
    validate: (value) => validateUrl(value),
  },
  icon: {
    defaultValue: null,
    validate: (value) => isValidIconName(value),
  },
  onClick: {
    defaultValue: null,
    validate: (value) => typeof value === "function",
  },

  // configuring the separator independently
  type: {
    defaultValue: null,
    validate: (value) => value === "separator",
  },
  separator: {
    defaultValue: "/",
    validate: (value) => typeof value === "string",
  },
};
