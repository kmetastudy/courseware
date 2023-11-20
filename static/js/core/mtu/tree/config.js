export const treeConfig = {
  treeData: {
    defaultValue: [],
    validate: (value) => Array.isArray(value),
  },
  sortable: {
    defaultValue: false,
    validate: (value) => typeof value === "boolean",
  },
  checkable: {
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
};
