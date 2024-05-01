import { isHTMLNode } from "../../../utils/type";

import { computePosition } from "../../FloatingUI";

/**
 * @typedef { 'top'| 'top-start'| 'top-end'| 'right'| 'right-start'| 'right-end'| 'bottom'| 'bottom-start'| 'bottom-end'| 'left'| 'left-start'| 'left-end'} Placement
 */

/**
 *
 * @param {Object} param
 * @param {Placement | 'bottom'} param.placement
 * @param {'absolute'|'fixed'} param.strategy
 * @param {boolean | true} param.transform
 * @param {Array | []} [param.middleware=[]]
 * @param {Object} param.elements
 * @param {HTMLElement | undefined} param.elements.reference elements must be held in state
 * @param {HTMLElement | undefined} param.elements.floating elements must be held in state
 * @param {HTMLElement | undefined} param.arrowElement arrow element of floating
 * @param {boolean | false} param.open - initial state of the floating
 *
 */
export function useFloating({
  placement = "bottom",
  strategy = "absolute",
  transform = true,
  middleware = [],
  elements,
  arrowElement,
  open = false,
}) {
  let reference = elements?.reference;
  let floating = elements?.floating;

  function setContentPosition({ floating, x, y }) {
    Object.assign(floating.style, {
      left: `${x}px`,
      top: `${y}px`,
    });

    return floating;
  }

  function setArrowPosition({ arrowElement, middlewareData, placement }) {
    const arrowX = middlewareData.arrow?.x ?? 0;
    const arrowY = middlewareData.arrow?.y ?? 0;

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

    return arrowElement;
  }

  function update() {
    computePosition(reference, floating, {
      placement,
      strategy,
      middleware,
    }).then(({ x, y, placement, strategy, middlewareData }) => {
      setContentPosition({ floating, x, y });

      if (isHTMLNode(arrowElement)) {
        setArrowPosition({ arrowElement, middlewareData, placement });
      }
    });
  }

  function computePositionPromise() {
    return computePosition(reference, floating, {
      placement,
      strategy,
      middleware,
    });
  }

  const floatingApi = {
    show: () => {
      floating.classList.remove("hidden");
      update();
    },
    hide: () => {
      floating.classList.add("hidden");
    },
    placement: computePositionPromise().then(({ placement }) => {
      return placement;
    }),
    strategy: computePositionPromise().then(({ strategy }) => {
      return strategy;
    }),
    x: computePositionPromise().then(({ x }) => {
      return x;
    }),
    y: computePositionPromise().then(({ x }) => {
      return x;
    }),
    middlewareData: computePositionPromise().then(({ middlewareData }) => {
      return middlewareData;
    }),
    update,
    refs: {
      setReference: (element) => {
        elements.reference = element;
      },
      setFloating: (element) => {
        floating = element;
      },
      floating,
      reference,
    },

    elements: {
      floating,
      reference,
    },
  };

  return floatingApi;
}
