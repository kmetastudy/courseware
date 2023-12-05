// https://github.com/react-component/progress/blob/master/src/Circle/index.tsxhttps://github.com/react-component/progress/blob/master/src/Circle/index.tsx
// https://ant.design/components/progress

import { getSize, getPercentage, getStrokeColor } from "./utils";
import { isObject, isElement } from "../_util/type-check";
import { circleContent } from "./circle-content";
import { classNames } from "../../utils/class-names";
import { createElement } from "../_util/dom-element";
import { MtuTooltip } from "../tooltip/mtu-tooltip";

const CIRCLE_MIN_STROKE_WIDTH = 3;

function getRealGapDegree(gapDegree = gapDegree, type = type) {
  if (gapDegree || gapDegree === 0) {
    return gapDegree;
  }

  if (type === "dashboard") {
    return 75;
  }
  return null;
}

export function progressCircle({
  prefixCls,
  trailColor = null,
  strokeLinecap = "round",
  gapPosition,
  gapDegree,
  width: originWidth = 120,
  type,
  children,
  success,
  size = originWidth,
  ...restProps
} = {}) {
  const [width, height] = getSize(size, "circle");

  let { strokeWidth } = restProps;
  if (strokeWidth === null || strokeWidth === undefined) {
    strokeWidth = Math.max((CIRCLE_MIN_STROKE_WIDTH / width) * 100, 6);
  }
  const circleStyle = { width: `${width}px`, height: `${height}px`, fontSize: `${width * 0.15 + 6}px` };

  const realGapDegree = getRealGapDegree(gapDegree, type);

  const gapPos = gapPosition || (type === "dashboard" && "bottom") || undefined;

  const isGradient = isObject(restProps.strokeColor);
  const strokeColor = getStrokeColor(success, restProps.strokeColor);

  const wrapperClassName = classNames(`${prefixCls}-inner`, {
    [`${prefixCls}-circle-gradient`]: isGradient,
  });

  const circleContentNode = circleContent({
    percent: getPercentage({ percent: restProps.percent, success }),
    strokeWidth,
    trailWidth: strokeWidth,
    strokeColor,
    strokeLinecap,
    trailColor,
    prefixCls,
    gapDegree: realGapDegree,
    gapPosition: gapPos,
  });

  const progressCircle = createElement("div", { className: wrapperClassName, styles: circleStyle });
  // TODO
  // ToolTip

  progressCircle.append(circleContentNode);
  isElement(children) ? progressCircle.append(children) : null;

  return progressCircle;
}
