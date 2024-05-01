function isMap(value) {
  return value instanceof Map;
}

/**
 *
 * @param {Map} a
 * @param {Map} b
 * @returns
 */
export function isSameMap(a, b) {
  if (!isMap(a) || !isMap(b)) {
    console.error(`isSameMap: ${a} and ${b} must be Map instances`);
    return false;
  }

  if (a.size !== b.size) {
    return false;
  }

  for (let [key, value] of a) {
    if (!b.has(key) || b.get(key) !== value) {
      return false;
    }
  }

  return true;
}
