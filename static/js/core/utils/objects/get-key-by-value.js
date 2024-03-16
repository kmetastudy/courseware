export function getKeyByValue(obj, value) {
  return Object.keys(obj)[Object.values(obj).indexOf(value)];
}
