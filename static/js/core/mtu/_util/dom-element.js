import { isArray, isElement, isObject } from "./type-check";
// import {classNames}
function camelToDash(text) {
  const dashed = text.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
  return dashed;
}

export function setStyles(element, styles) {
  if (!isElement(element) || !isObject(styles)) {
    return;
  }

  Object.entries(styles).forEach(([property, value]) => {
    // TODO
    // Validate Style property
    element.style[property] = value;
  });

  return element;
  //
}

export function setAttributes(element, attributes) {
  if (!isElement(element) || !isObject(attributes)) {
    return;
  }

  // TODO
  // 어떤건 dash, 어떤건 camel(viewBox)
  for (let key in attributes) {
    const formattedKey = key === "viewBox" ? key : camelToDash(key);
    const attribute = attributes[key];
    element.setAttribute(formattedKey, attribute);
  }
  return element;
}

export function setClassName(element, className) {
  if (!isElement(element) || (typeof className !== "string" && !Array.isArray(className))) {
    return;
  }

  if (typeof className === "string") {
    element.classList.add(className);
  } else if (Array.isArray(className)) {
    element.classList.add(...className);
  }
}

export function createElement(tagName = "div", { className, attributes, styles }) {
  const element = document.createElement(tagName);

  setClassName(element, className);
  setAttributes(element, attributes);
  setStyles(element, styles);

  return element;
}

export function createElementNS(tagName = "div", { className, attributes, styles }) {
  const namespaceURI = "http://www.w3.org/2000/svg";

  const element = document.createElementNS(namespaceURI, tagName);

  setClassName(element, className);
  setAttributes(element, attributes);
  setStyles(element, styles);

  return element;
}
