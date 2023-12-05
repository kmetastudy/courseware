let hasOwn = {}.hasOwnProperty;

export function classNames() {
  let classes = [];
  const { length } = arguments;

  for (let i = 0; i < length; i++) {
    let arg = arguments[i];
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === "string" || argType === "number") {
      classes.push(arg);
    } else if (Array.isArray(arg) && arg.length) {
      const inner = classNames.apply(null, arg);
      if (inner) {
        classes.push(inner);
      }
    } else if (argType === "object") {
      if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
        classes.push(arg.toString());
        continue;
      }

      for (let key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(" ");
}
