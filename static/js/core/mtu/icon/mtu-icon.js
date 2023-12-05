import { iconData } from "./data";
import { isObject } from "../_util/type-check";
require("./mtu-icon.css");

const DEFAULT_CLASS_NAME = "mtuicon";

export function isValidIconName(name) {
  return iconData.hasOwnProperty(name);
}

function setStyle(element, style = {}) {
  Object.entries(style).forEach(([key, attribute]) => {
    element.style[key] = attribute;
  });
}

function getViewBoxAttribute(svgElement) {
  const { x, y, width, height } = svgElement?.viewBox?.baseVal;
  return { x, y, width, height };
}

function calculateAspectRatio(svgElement) {
  const viewBox = getViewBoxAttribute(svgElement);
  const aspectRatio = viewBox.width / viewBox.height;
  return aspectRatio;
}

function shouldApplyRotate(rotateOption) {
  return rotateOption === true;
}

function shouldApplySpin(spinOption) {
  return spinOption === true;
}

function createWrapperElement({ iconName, shouldRotate, shouldSpin }) {
  const wrapper = document.createElement("span");
  wrapper.classList.add(DEFAULT_CLASS_NAME, `${DEFAULT_CLASS_NAME}-${iconName}`);
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute("aria-label", iconName);

  if (shouldRotate) {
    wrapper.classList.add(`${DEFAULT_CLASS_NAME}-rotate`);
  }

  if (shouldSpin) {
    wrapper.classList.add(`${DEFAULT_CLASS_NAME}-spin`);
  }

  return wrapper;
}

function createSvgElement(iconName) {
  const svgString = iconData[iconName];
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");

  const svgElement = doc.documentElement;
  return svgElement;
}

export function MtuIcon(iconName, { style, className, rotate, spin } = {}) {
  if (!isValidIconName(iconName)) {
    throw new Error(`Invalid icon name: ${iconName}`);
  }

  const wrapperElement = createWrapperElement({
    iconName,
    shouldRotate: shouldApplyRotate(rotate),
    shouldSpin: shouldApplySpin(spin),
  });

  className ? wrapperElement.classList.add(className) : null;
  isObject(style) ? setStyle(wrapperElement, style) : null;

  const svgElement = createSvgElement(iconName);

  wrapperElement.appendChild(svgElement);
  return wrapperElement;
}
