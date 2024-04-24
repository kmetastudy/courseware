function isSet(value) {
  return value instanceof Set;
}

/**
 *
 * @param {Set} a
 * @param {Set} b
 * @returns
 */
export function isSameSet(a, b) {
  if (!isSet(a) || !isSet(b)) {
    console.error(`isSameSet: ${a} and ${b} must be Set instances`);
    return false;
  }

  if (a.size !== b.size) {
    return false;
  }

  for (let item of a) {
    if (!b.has(item)) {
      return false;
    }
  }

  return true;
}
