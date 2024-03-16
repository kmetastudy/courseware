import { isObject } from "../type";

function check(schema, param) {
  const validatedParam = {};
  Object.keys(schema).forEach((key) => {
    const arg = param[key];
    const { type, defaultValue, allowedValues } = schema[key];

    if (arg === undefined || arg === null) {
      validatedParam[key] = defaultValue;
    } else if (type && typeof arg !== type) {
      throw new Error(`Argument '${key}' is expected to be a ${type}, but received a ${typeof arg}`);
    } else if (allowedValues && !allowedValues.includes(arg)) {
      throw new Error(`Argument '${key}' should be one of ${allowedValues.join(", ")}, but received '${arg}'`);
    } else {
      validatedParam[key] = arg;
    }
  });
  return validatedParam;
}
