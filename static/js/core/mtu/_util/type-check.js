export function isObject(obj) {
  return Object.prototype.toString.call(obj) === "[object Object]";
}

export function isArray(array) {
  return Array.isArray(array);
}

export function isElement(element) {
  return element instanceof Element;
}
