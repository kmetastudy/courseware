import { isElement, isObject } from "../_util/type-check";
import { createElement, createElementNS } from "../../utils/dom-utils";
import { classNames } from "../../utils/class-names";

function getPtgColors(color, scale) {
  return Object.keys(color).map((key) => {
    const parsedKey = parseFloat(key);
    const ptgKey = `${Math.floor(parsedKey * scale)}%`;

    return `${color[key]} ${ptgKey}`;
  });
}

export function ptgCircle({
  prefixCls,
  color,
  gradientId,
  radius,
  style: circleStyleForStack,
  ptg,
  strokeLinecap,
  strokeWidth,
  size,
  gapDegree,
  ...restProps
}) {
  const isGradient = color && typeof color === "object";

  const stroke = isGradient ? `#FFF` : undefined;

  const halfSize = size / 2;

  const circleNode = createElementNS("circle", {
    className: `${prefixCls}-circle-path`,
    attributes: {
      r: radius,
      cx: halfSize,
      cy: halfSize,
      stroke,
      strokeLinecap,
      strokeWidth,
      opacity: ptg === 0 ? 0 : 1,
      // ref: restProps?.ref}
    },
    styles: circleStyleForStack,
  });

  if (!isGradient) {
    return circleNode;
  }

  // ======== render ========
  const maskId = `${gradientId}-conic`;

  const fromDeg = gapDegree ? `${180 + gapDegree / 2}deg` : `0deg`;

  const conicColors = getPtgColors(color, (360 - gapDegree) / 360);
  const linearColors = getPtgColors(color, 1);

  const conicColorBg = `conic-gradient(from ${fromDeg}, ${conicColors.join(", ")})`;
  const linearColorBg = `linear-gradient(to ${gapDegree ? "bottom" : "top"}, ${linearColors.join(", ")})`;

  // wrapper
  const ptgCircle = document.createElement("div");

  const mask = createElement("div", { attributes: { id: maskId } });
  mask.appendChild(circleNode);

  const foreignObject = createElementNS("foreignObject", {
    attributes: { x: 0, y: 0, width: size, height: size, mask: `url(#${maskId})` },
  });

  const linearBlock = createElement("div", {
    styles: { width: "100%", height: "100%", background: linearColorBg },
  });
  isElement(restProps.children) ? linearBlock.append(restProps.children) : null;
  foreignObject.appendChild(linearBlock);

  const conicBlock = createElement("div", {
    styles: { width: "100%", height: "100%", background: conicColorBg },
  });
  isElement(restProps.children) ? conicBlock.append(restProps.children) : null;
  linearBlock.appendChild(conicBlock);

  //
  ptgCircle.append(mask, foreignObject);
  return ptgCircle;
}
