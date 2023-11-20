export const config = {
  title: {
    defaultValue: "text",
    validate: (value) => typeof value === "string",
  },
  cover: {
    defaultValue: null,
    validate: (value) => typeof value === "object",
  },
  size: {
    defaultValue: "middle",
    validate: (value) => ["small", "middle", "large"].includes(value),
  },
  bordered: {
    defaultValue: true,
    validate: (value) => typeof value === "boolean",
  },

  hoverable: {
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
