export const treeNodeConfig = {
  title: {
    defaultValue: "treeNode",
    validate: (value) => typeof value === "string",
  },
  data: {
    defaultValue: "treeNode",
    validate: (value) => typeof value === "object",
  },
  icon: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  className: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  key: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  sortable: {
    defaultValue: false,
    validate: (value) => typeof value === "boolean",
  },
  checkable: {
    defaultValue: true,
    validate: (value) => typeof value === "boolean",
  },
  disableCheckBox: {
    defaultValue: false,
    validate: (value) => typeof value === "boolean",
  },
  disabled: {
    defaultValue: false,
    validate: (value) => typeof value === "boolean",
  },
  onClick: {
    defaultValue: null,
    validate: (value) => typeof value === "function",
  },
};
