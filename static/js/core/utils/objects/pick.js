/**
 *
 * @param {object} obj
 * @param {Array} keys
 * @returns
 */
export function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (obj.hasOwnProperty(key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}
