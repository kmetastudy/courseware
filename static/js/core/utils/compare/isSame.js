import { isSameMap } from "./isSameMap";
import { isSameSet } from "./isSameSet";

export function isSame(a, b) {
  if (a === b) {
    return true;
  }

  if (a instanceof Set && b instanceof Set) {
    return isSameSet(a, b);
  }

  if (a instanceof Map && b instanceof Map) {
    return isSameMap(a, b);
  }

  if (JSON.stringify(a) === JSON.stringify(b)) {
    return true;
  }
}
