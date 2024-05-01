import {
  useFloating,
  autoUpdate,
  offset,
  shift,
  limitShift,
  hide,
  arrow as floatingUIarrow,
  flip,
  size,
} from "../../component/FloatingUI";
import elem from "../../utils/elem/elem";

import { useSize } from "../utils/use-size";
import { useState } from "../../utils/state";

import { Arrow as ArrowElement } from "../arrow";

export function Popper() {
  const OPPOSITE_SIDE = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  };

  const state = {
    root: {
      props: null,
      element: null,
    },
    content: {
      props: null,
      wrapper: null, // root
      element: null, // content
      child: null, // main content that user passes
    },
    arrow: {
      props: null,
      element: null,
      child: null,
    },
  };

  let floatingApi;

  const [contentContext, setContext] = {
    placedSide: null,
    arrowX: null,
    arrowY: null,
    shouldHideArrow: null,
    onArrowChange: setArrow,
  };

  function setFloatingApi(props) {
    const {
      element, // content element
      side = "bottom",
      sideOffset = 0,
      align = "center",
      alignOffset = 0,
      arrowPadding = 0,
      avoidCollisions = true,
      collisionBoundary = [],
      collisionPadding: collisionPaddingProp = 0,
      sticky = "partial",
      hideWhenDetached = false,
      updatePositionStrategy = "optimized",
      onPlaced,
      ...contentProps
    } = props;

    const arrow = state.arrow.element;

    const arrowSize = useSize(arrow);
    const arrowWidth = arrowSize?.width ?? 0;
    const arrowHeight = arrowSize?.height ?? 0;

    const desiredPlacement = side + (align !== "center" ? "-" + align : "");

    const collisionPadding =
      typeof collisionPaddingProp === "number"
        ? collisionPaddingProp
        : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };

    const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
    const hasExplicitBoundaries = boundary.length > 0;

    const detectOverflowOptions = {
      padding: collisionPadding,
      boundary: boundary.filter(isNotNull),
      // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
      altBoundary: hasExplicitBoundaries,
    };

    const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
      // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
      strategy: "fixed",
      placement: desiredPlacement,
      middleware: [
        offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
        avoidCollisions &&
          shift({
            mainAxis: true,
            crossAxis: false,
            limiter: sticky === "partial" ? limitShift() : undefined,
            ...detectOverflowOptions,
          }),
        avoidCollisions && flip({ ...detectOverflowOptions }),
        size({
          ...detectOverflowOptions,
          apply: ({ elements, rects, availableWidth, availableHeight }) => {
            const { width: anchorWidth, height: anchorHeight } = rects.reference;
            const contentWrapperStyle = elements.floating.style;
            contentWrapperStyle.setProperty("--mtu-popper-available-width", `${availableWidth}px`);
            contentWrapperStyle.setProperty("--mtu-popper-available-height", `${availableHeight}px`);
            contentWrapperStyle.setProperty("--mtu-popper-anchor-width", `${anchorWidth}px`);
            contentWrapperStyle.setProperty("--mtu-popper-anchor-height", `${anchorHeight}px`);
          },
        }),
        arrow && floatingUIarrow({ element: arrow, padding: arrowPadding }),
        transformOrigin({ arrowWidth, arrowHeight }),
        hideWhenDetached && hide({ strategy: "referenceHidden", ...detectOverflowOptions }),
      ],
    });
  }

  function isNotNull(value) {
    return value !== null;
  }

  function getSideAndAlignFromPlacement(placement) {
    const [side, align = "center"] = placement.split("-");
    return [side, align];
  }

  /**
   *
   * @param {object} options
   * @param {number} options.arrowWidth
   * @param {number} options.arrowHeight
   * @returns
   */
  const transformOrigin = (options) => ({
    name: "transformOrigin",
    options,
    fn(data) {
      const { placement, rects, middlewareData } = data;

      const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
      const isArrowHidden = cannotCenterArrow;
      const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;

      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];

      const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
      const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;

      let x = "";
      let y = "";

      if (placedSide === "bottom") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${-arrowHeight}px`;
      } else if (placedSide === "top") {
        x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${rects.floating.height + arrowHeight}px`;
      } else if (placedSide === "right") {
        x = `${-arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      } else if (placedSide === "left") {
        x = `${rects.floating.width + arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      }
      return { data: { x, y } };
    },
  });

  const popper = {
    Root({ children }) {
      return;
    },
    Content(props = {}) {
      const {
        element, // content element
        side = "bottom",
        sideOffset = 0,
        align = "center",
        alignOffset = 0,
        arrowPadding = 0,
        avoidCollisions = true,
        collisionBoundary = [],
        collisionPadding: collisionPaddingProp = 0,
        sticky = "partial",
        hideWhenDetached = false,
        updatePositionStrategy = "optimized",
        onPlaced,
        ...contentProps
      } = props;

      state.content.child = element;
      state.content.props = props;

      const [arrow, setArrow] = useState();
      state.arrow.element = arrow;
      contentContext.onArrowChange = setArrow;

      const arrowSize = useSize(arrow);
      const arrowWidth = arrowSize?.width ?? 0;
      const arrowHeight = arrowSize?.height ?? 0;

      const desiredPlacement = side + (align !== "center" ? "-" + align : "");

      const collisionPadding =
        typeof collisionPaddingProp === "number"
          ? collisionPaddingProp
          : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };

      const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
      const hasExplicitBoundaries = boundary.length > 0;

      const detectOverflowOptions = {
        padding: collisionPadding,
        boundary: boundary.filter(isNotNull),
        // with `strategy: 'fixed'`, this is the only way to get it to respect boundaries
        altBoundary: hasExplicitBoundaries,
      };

      const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
        // default to `fixed` strategy so users don't have to pick and we also avoid focus scroll issues
        strategy: "fixed",
        placement: desiredPlacement,
        middleware: [
          offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
          avoidCollisions &&
            shift({
              mainAxis: true,
              crossAxis: false,
              limiter: sticky === "partial" ? limitShift() : undefined,
              ...detectOverflowOptions,
            }),
          avoidCollisions && flip({ ...detectOverflowOptions }),
          size({
            ...detectOverflowOptions,
            apply: ({ elements, rects, availableWidth, availableHeight }) => {
              const { width: anchorWidth, height: anchorHeight } = rects.reference;
              const contentWrapperStyle = elements.floating.style;
              contentWrapperStyle.setProperty("--mtu-popper-available-width", `${availableWidth}px`);
              contentWrapperStyle.setProperty("--mtu-popper-available-height", `${availableHeight}px`);
              contentWrapperStyle.setProperty("--mtu-popper-anchor-width", `${anchorWidth}px`);
              contentWrapperStyle.setProperty("--mtu-popper-anchor-height", `${anchorHeight}px`);
            },
          }),
          arrow && floatingUIarrow({ element: arrow, padding: arrowPadding }),
          transformOrigin({ arrowWidth, arrowHeight }),
          hideWhenDetached && hide({ strategy: "referenceHidden", ...detectOverflowOptions }),
        ],
      });

      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);

      contentContext.placedSide = placedSide;

      contentContext.arrowX = middlewareData.arrow?.x;
      contentContext.arrowY = middlewareData.arrow?.y;
      contentContext.cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;

      // const [contentZIndex, setContentZIndex] = React.useState();
      // useLayoutEffect(() => {
      //   if (element) setContentZIndex(window.getComputedStyle(element).zIndex);
      // }, [element]);

      //
      const popperContentWrapperStyle = {
        ...floatingStyles,
        transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)", // keep off the page when measuring
        minWidth: "max-content",
        zIndex: "auto",
        ["--mtu-popper-transform-origin"]: [middlewareData.transformOrigin?.x, middlewareData.transformOrigin?.y].join(
          " ",
        ),

        // hide the content if using the hide middleware and should be hidden
        // set visibility to hidden and disable pointer events so the UI behaves
        // as if the PopperContent isn't there at all
        ...(middlewareData.hide?.referenceHidden && {
          visibility: "hidden",
          pointerEvents: "none",
        }),
      };

      const popperContentWrapper = elem("div", {
        "data-mtu-popper-content-wrapper": "",
        dir: props.dir,
      });
      popperContentWrapper.style = popperContentWrapperStyle;

      const popperContentStyle = {
        ...contentProps.style,
        animation: !isPositioned ? "none" : undefined,
      };

      const popperContent = elem("div", {
        "data-side": placedSide,
        "data-align": placedAlign,
        ...contentProps,
      });
      popperContent.style = popperContentStyle;

      popperContentWrapper.append(popperContent);

      if (element) {
        popperContent.append(element);
      }

      return popperContentWrapper;
    },

    Arrow(props) {
      const { ...arrowProps } = props;

      const baseSide = OPPOSITE_SIDE[contentContext.placedSide];

      const arrowStyle = {
        position: "absolute",
        left: `${contentContext.arrowX}px`,
        top: `${contentContext.arrowY}px`,
        [baseSide]: 0,
        "transform-origin": {
          top: "",
          right: "0 0",
          bottom: "center 0",
          left: "100% 0",
        }[contentContext.placedSide],
        transform: {
          top: "translateY(100%)",
          right: "translateY(50%) rotate(90deg) translateX(-50%)",
          bottom: `rotate(180deg)`,
          left: "translateY(50%) rotate(-90deg) translateX(50%)",
        }[contentContext.placedSide],
        visibility: contentContext.shouldHideArrow ? "hidden" : undefined,
      };

      const arrow = elem("span");
      arrow.style = arrowStyle;

      const arrowSvg = ArrowElement({ style: { ...arrowProps.style, display: block } });
      arrow.append(arrowSvg);

      setArrow(arrow);

      return arrow;
    },

    init() {
      //
    },
  };

  return popper;
}
