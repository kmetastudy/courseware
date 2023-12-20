import { isElement, isObject } from "../mtu/_util/type-check";
import isString from "./type/isString";

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
    if (className.includes(" ")) {
      element.classList.add(...className.split(" "));
    } else {
      element.classList.add(className);
    }
  } else if (Array.isArray(className)) {
    element.classList.add(...className);
  }
}

export function createElement(tagName = "div", { className, attributes, styles, text } = {}) {
  const element = document.createElement(tagName);

  setClassName(element, className);
  setAttributes(element, attributes);
  setStyles(element, styles);

  isString(text) ? (element.textContent = text) : null;

  return element;
}

export function createElementNS(tagName = "div", { className, attributes, styles } = {}) {
  const namespaceURI = "http://www.w3.org/2000/svg";

  const element = document.createElementNS(namespaceURI, tagName);

  setClassName(element, className);
  setAttributes(element, attributes);
  setStyles(element, styles);

  return element;
}

export function wrapElement(toWrap, wrapper) {
  if (!isElement(toWrap) || !isElement(wrapper)) {
    console.error("invalid type");
    return null;
  }
  wrapper = wrapper ?? document.createElement("div");
  toWrap.parentNode.insertBefore(wrapper, toWrap);
  return wrapper.appendChild(toWrap);
}
