import { isValidIconName } from "../icon/mtu-icon";
export const config = {
  text: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  htmlType: {
    defaultValue: "button",
    validate: (value) => ["button", "submit", "rest"].includes(value),
  },
  type: {
    defaultValue: "default",
    validate: (value) => ["default", "primary", "dashed", "link", "text"].includes(value),
  },
  shape: {
    defaultValue: "default",
    validate: (value) => ["default", "circle", "round"].includes(value),
  },
  size: {
    defaultValue: "middle",
    validate: (value) => ["small", "middle", "large"].includes(value),
  },
  loading: {
    defaultValue: false,
    validate: (value) => typeof value === "boolean",
  },
  disabled: {
    defaultValue: false,
    validate: (value) => typeof value === "boolean",
  },
  icon: {
    defaultValue: null,
    validate: (value) => isValidIconName(value),
  },
  onClick: {
    defaultValue: null,
    validate: (value) => typeof value === "function",
  },
  onSubmit: {
    defaultValue: null,
    validate: (value) => typeof value === "function",
  },
};
