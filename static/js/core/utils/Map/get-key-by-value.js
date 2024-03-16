export function getKeyByValue(map, value) {
  for (let [key, val] of map) {
    if (val === value) {
      return key;
    }
  }

  return undefined;
}
