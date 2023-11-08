import { iconData } from "./data";
require("./mtu-icon.css");

const DEFAULT_CLASS_NAME = "mtuicon";

export function isValidIconName(name) {
  return iconData.hasOwnProperty(name);
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
  return doc.documentElement;
}

export function MtuIcon(iconName = null, options = {}) {
  if (!isValidIconName(iconName)) {
    throw new Error(`Invalid icon name: ${iconName}`);
  }

  const wrapperElement = createWrapperElement({
    iconName,
    shouldRotate: shouldApplyRotate(options.rotate),
    shouldSpin: shouldApplySpin(options.spin),
  });

  const svgElement = createSvgElement(iconName);
  wrapperElement.appendChild(svgElement);

  return wrapperElement;
}
