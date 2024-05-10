import { classNames } from "../../dom";
import { isHTMLNode } from "../../../core/utils/type";

let drawerCount = 0;

export function drawerHelper() {
  drawerCount++;

  let rootElement = null;
  let toggleElement = null;
  let contentElement = null;
  let sideElement = null;
  let overlayElement = null;
  let labelElements = [];
  let drawerId = null;

  function isValidTag(element, tagname) {
    return isHTMLNode(element) && element.tagName.toLowerCase() === tagname?.toLowerCase();
  }

  function setDrawerIdToLabels() {
    labelElements.forEach((label) => {
      label.setAttribute("for", drawerId);
    });
    drawerId;
  }

  return {
    /**
     * @param {object} param
     * @param {HTMLElement | HTMLDivElement} param.element - The root container
     * @param {"right" | "left"} param.position - drawer position
     * @param {boolean | false} param.forceOpen - Show drawer side by default. If false, the drawer will be hidden by default
     * @param {string | undefined} param.breakPoint - breakpoint to open the drawer (lg, md, ...). You need to set forceOpen to true to set breakpoint
     * @param {"right" | "left"} param.openPosition - drawer open position. Defaults to the value of param.position
     */
    Root: ({ element, position = "right", forceOpen = false, breakPoint } = {}) => {
      if (isHTMLNode(rootElement)) {
        return rootElement;
      }

      rootElement = isHTMLNode(element) ? element : document.createElement("div");
      const initialClassName = rootElement.className;

      const end = position === "right";

      const composedClassName = classNames(initialClassName, "drawer", {
        "drawer-end": end,
        "drawer-open": forceOpen && !breakPoint,
        [`${breakPoint}:drawer-open`]: forceOpen && breakPoint,
      });

      rootElement.className = ("class", composedClassName);

      return rootElement;
    },
    Toggle: ({ element, id } = {}) => {
      toggleElement = isValidTag(element, "input") ? element : document.createElement("input");

      toggleElement.setAttribute("type", "checkbox");

      toggleElement.classList.add("drawer-toggle");

      if (toggleElement.hasAttribute("id")) {
        drawerId = toggleElement.getAttribute("id");
      } else {
        drawerId = !!id ? id : `drawer-${drawerCount}`;

        toggleElement.setAttribute("id", drawerId);
      }

      if (rootElement && rootElement.contains(toggleElement) === false) {
        rootElement.prepend(toggleElement);
      }

      return toggleElement;
    },
    Content: ({ element } = {}) => {
      contentElement = isHTMLNode(element) ? element : document.createElement("main");
      contentElement.classList.add("drawer-content", "w-full", "flex", "justify-center", "fixed", "top-0", "z-10", "bg-[#175CBE]");

      if (rootElement && rootElement.contains(contentElement) === false) {
        rootElement.append(contentElement);
      }

      return contentElement;
    },
    Side: ({ element } = {}) => {
      sideElement = isHTMLNode(element) ? element : document.createElement("div");
      sideElement.classList.add("drawer-side");

      if (rootElement && rootElement.contains(sideElement) === false) {
        rootElement.append(sideElement);
      }

      return sideElement;
    },
    Overlay: ({ element } = {}) => {
      overlayElement = isHTMLNode(element) ? element : document.createElement("label");
      overlayElement.classList.add("drawer-overlay");
      overlayElement.setAttribute("for", drawerId);

      if (sideElement && sideElement.contains(overlayElement) === false) {
        sideElement.prepend(overlayElement);
      }

      setDrawerIdToLabels();

      return overlayElement;
    },

    // API
    /**
     * Set element as label for the drawer
     * @param {HTMLLabelElement} element
     * @returns
     */
    Label: ({ element } = {}) => {
      let labelElement;

      if (isHTMLNode(element) && element.tagName.toLowerCase() === "label") {
        labelElement = element;
      } else {
        labelElement = document.createElement("label");
      }

      if (drawerId) {
        labelElement.setAttribute("for", drawerId);
      }

      labelElements.push(labelElement);

      return labelElement;
    },

    getDrawerId: () => drawerId,
  };
}
