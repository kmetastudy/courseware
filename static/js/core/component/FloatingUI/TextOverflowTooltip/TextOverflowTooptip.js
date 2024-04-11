import elem from "../../../utils/elem/elem";
import { computePosition, flip, shift, offset, arrow } from "../../FloatingUI";

/**
 * Ellipsis text overflow tooltip
 * @param {object} param
 * @param {HTMLElement} param.targetElement - The element that triggers the tooltip
 * @param {HTMLElement} param.textElement - The element that contains the text
 * @param {string} param.content - The content of the tooltip
 */
export function TextOverflowTooltip({ targetElement: element, textElement, content }) {
  const tooltip = elem(
    "div",
    {
      class: "hidden z-40 bg-info-content text-white font-bold p-1 rounded text-sm w-max absolute top-0 left-0",
      role: "tooltip",
    },
    content ?? element.textContent,
  );

  const arrowElement = elem("div", {
    class: "absolute bg-info-content w-2 h-2 rotate-45",
  });

  document.body.append(tooltip);
  tooltip.append(arrowElement);

  [
    ["mouseenter", showTooltip],
    ["mouseleave", hideTooltip],
    ["focus", showTooltip],
    ["blur", hideTooltip],
  ].forEach(([event, listener]) => {
    element.addEventListener(event, listener);
  });

  function showTooltip() {
    const isOverflowing = textElement.offsetWidth < textElement.scrollWidth;
    if (!isOverflowing) {
      return;
    }

    tooltip.classList.remove("hidden");
    update();
  }

  function hideTooltip() {
    tooltip.classList.add("hidden");
  }

  function update() {
    computePosition(element, tooltip, {
      placement: "right",
      middleware: [offset(6), flip(), shift(), arrow({ element: arrowElement })],
    }).then(({ x, y, placement, middlewareData }) => {
      Object.assign(tooltip.style, {
        left: `${x}px`,
        top: `${y}px`,
      });

      const { x: arrowX, y: arrowY } = middlewareData.arrow;

      const staticSide = {
        top: "bottom",
        right: "left",
        bottom: "top",
        left: "right",
      }[placement.split("-")[0]];

      Object.assign(arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : "",
        top: arrowY != null ? `${arrowY}px` : "",
        right: "",
        bottom: "",
        [staticSide]: "-4px",
      });
    });
  }
}
