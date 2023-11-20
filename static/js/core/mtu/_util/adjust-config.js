export function adjustConfig(defaultConfig, userConfig) {
  const adjustedConfig = {};

  for (let key in defaultConfig) {
    if (userConfig.hasOwnProperty(key) && defaultConfig[key].validate(userConfig[key])) {
      adjustedConfig[key] = userConfig[key];
    } else {
      adjustedConfig[key] = defaultConfig[key].defaultValue;
    }
  }

  return adjustedConfig;
}

// Example
// const componentConfigSchema = {
//   type: {
//     defaultValue: "text",
//     validate: (value) => typeof value === "string",
//   },
//   size: {
//     defaultValue: "middle",
//     validate: (value) => ["small", "middle", "large"].includes(value),
//   },
// };

// const userProvidedConfig = {
//   type: "hi",
//   size: "medium",
// };

// const adjustedConfig = adjustUserConfig(componentConfigSchema, userProvidedConfig);
