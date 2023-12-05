import { ptgCircle } from "./ptg-circle";
import { createElementNS } from "../_util/dom-element";
import { getCircleStyle, toArray } from "./utils";
import { classNames } from "../../utils/class-names";
import { isObject } from "../_util/type-check";

const VIEW_BOX_SIZE = 100;
export function circleContent({
  id,
  prefixCls = "mtu-progress",
  steps,
  strokeWidth = 1,
  trailWidth = 1,
  gapDegree = 0,
  gapPosition = "bottom",
  trailColor = "D9D9D9",
  strokeLinecap = "round",
  style,
  className,
  strokeColor = "#2db7f5",
  percent = 0,
  ...restProps
} = {}) {
  const halfSize = VIEW_BOX_SIZE / 2;

  // const mergedId = useId(id);
  const mergedId = id;

  const gradientId = `${mergedId}-gradient`;

  const radius = halfSize - strokeWidth / 2;
  const perimeter = Math.PI * 2 * radius;
  const rotateDeg = gapDegree > 0 ? 90 + gapDegree / 2 : -90;
  const perimeterWithoutGap = perimeter * ((360 - gapDegree) / 360);

  let stepCount, stepSpace;
  if (isObject(steps)) {
    stepCount = steps?.count;
    stepSpace = steps?.space;
  } else {
    stepCount = steps;
    stepSpace = 2;
  }

  const percentList = toArray(percent);
  const strokeColorList = toArray(strokeColor);
  const gradient = strokeColorList.find((color) => color && typeof color === "object");
  const isConicGradient = gradient && typeof sgradient === "object";
  const mergedStrokeLinecap = isConicGradient ? "butt" : strokeLinecap;

  const circleStyle = getCircleStyle({
    perimeter,
    perimeterWithoutGap,
    offset: 0,
    percent: 100,
    rotateDeg,
    gapDegree,
    gapPosition,
    strokeColor: trailColor,
    strokeLinecap: mergedStrokeLinecap,
    strokeWidth: strokeWidth,
  });

  // const paths = useTransitionDuration();

  const getStokeList = () => {
    let stackPtg = 0;
    return percentList
      .map((ptg, index) => {
        const color = strokeColorList[index] || strokeColorList[strokeColorList.length - 1];

        const circleStyleForStack = getCircleStyle({
          perimeter,
          perimeterWithoutGap,
          offset: stackPtg,
          percent: ptg,
          rotateDeg,
          gapDegree,
          gapPosition,
          strokeColor: color,
          strokeLinecap: mergedStrokeLinecap,
          strokeWidth,
        });

        stackPtg += ptg;
        return ptgCircle({
          key: index,
          color,
          ptg,
          radius: radius,
          prefixCls,
          gradientId,
          style: circleStyleForStack,
          strokeLinecap,
          strokeWidth,
          gapDegree,
          // ref: (element) => {
          //   paths[index] = element;
          // },
          size: VIEW_BOX_SIZE,
        });
      })
      .reverse();
  };

  const getStepStokeList = () => {
    // only show the first percent when pass steps
    const current = Math.round(stepCount * (percentList[0] / 100));
    const stepPtg = 100 / stepCount;

    let stackPtg = 0;
    return new Array(stepCount).fill(null).map((_, index) => {
      const color = index <= current - 1 ? strokeColorList[0] : trailColor;
      const stroke = color && typeof color === "object" ? `url(#${gradientId})` : undefined;
      const circleStyleForStack = getCircleStyle({
        perimeter,
        perimeterWithoutGap,
        offset: stackPtg,
        percent: stepPtg,
        rotateDeg,
        gapDegree,
        gapPosition,
        strokeColor: color,
        strokeLinecap: "butt",
        strokeWidth,
        stepSpace,
      });
      stackPtg +=
        ((perimeterWithoutGap - circleStyleForStack.strokeDashoffset + stepSpace) * 100) / perimeterWithoutGap;

      return createElementNS("circle", {
        className: classNames(`${prefixCls}-circle-trail`, className),
        attributes: {
          key: index,
          r: radius,
          cx: halfSize,
          cy: halfSize,
          stroke,
          strokeWidth,
          opacity: 1,
          // ref: elem=>{paths[index]=elem}
        },
        styles: circleStyleForStack,
      });
    });
  };

  const circleContent = createElementNS("svg", {
    className: classNames(`${prefixCls}-circle-content`, className),
    attributes: { viewBox: `0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`, id, role: "presentation", ...restProps },
    styles: style,
  });

  if (!stepCount) {
    const elTrail = createElementNS("circle", {
      className: classNames(`${prefixCls}-circle-trail`, className),
      attributes: {
        r: radius,
        cx: halfSize,
        cy: halfSize,
        stroke: trailColor,
        strokeLinecap: mergedStrokeLinecap,
        strokeWidth: trailWidth ?? strokeWidth,
      },
      styles: circleStyle,
    });
    circleContent.appendChild(elTrail);
  }

  const stokeList = stepCount ? getStepStokeList() : getStokeList();

  circleContent.append(...stokeList);
  return circleContent;
}
