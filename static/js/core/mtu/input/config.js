import { isValidIconName } from "../icon/mtu-icon";

export const config = {
  type: {
    defaultValue: "text",
    validate: (value) => typeof value === "string",
  },
  size: {
    defaultValue: "middle",
    validate: (value) => ["small", "middle", "large"].includes(value),
  },
  prefix: {
    defaultValue: null,
    validate: (value) => isValidIconName(value),
  },
  styles: {
    default: null,
    validate: (value) => value.constructor === Object,
  },
  suffix: {
    defaultValue: null,
    validate: (value) => isValidIconName(value),
  },
  name: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  value: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  fixedValue: {
    // value를 수정 못하게 고정해야되는 경우
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  placeholder: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  maxLength: {
    default: null,
    validate: (value) => typeof value === "number",
  },
  disabled: {
    defaultValue: false,
    validate: (value) => typeof value === "boolean",
  },
  className: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  onClick: {
    defaultValue: null,
    validate: (value) => typeof value === "function",
  },
  onBlur: {
    defaultValue: null,
    validate: (value) => typeof value === "function",
  },
  onFocus: {
    defaultValue: null,
    validate: (value) => typeof value === "function",
  },

  required: {
    defaultValue: false,
    validate: (value) => typeof value === "boolean",
  },
  autocomplete: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
};
