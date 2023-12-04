import { isObject } from "../_util/type-check";

export function validProgress(progress) {
  if (!progress || progress < 0) {
    return 0;
  }
  if (progress > 100) {
    return 100;
  }
  return progress;
}

export function getSuccessPercent(success) {
  let percent;
  if (success && "percent" in success) {
    percent = success.percent;
  }
  return percent;
}

export const getPercentage = ({ percent, success }) => {
  const realSuccessPercent = validProgress(getSuccessPercent(success));
  return [realSuccessPercent, validProgress(validProgress(percent) - realSuccessPercent)];
};

export const getStrokeColor = (success = {}, strokeColor) => {
  const successColor = success?.strokeColor;
  // const {strokeColor: successColor}
  return [successColor || "green", strokeColor || null];
};

export const getSize = (size, type, extra) => {
  let width = -1;
  let height = -1;
  if (type === "step") {
    const steps = extra.steps ?? null;
    const strokeWidth = extra.strokeWidth ?? null;
    if (typeof size === "string" || typeof size === "undefined") {
      width = size === "small" ? 2 : 14;
      height = strokeWidth ?? 8;
    } else if (typeof size === "number") {
      [width, height] = [size, size];
    } else {
      [width = 14, height = 8] = size;
    }
    width *= steps;
  } else if (type === "line") {
    const strokeWidth = extra ? extra.strokeWidth : undefined;
    if (typeof size === "string" || typeof size === "undefined") {
      height = strokeWidth !== undefined ? strokeWidth : size === "small" ? 6 : 8;
    } else if (typeof size === "number") {
      [width, height] = [size, size];
    } else {
      width = size && size[0] ? size[0] : -1;
      height = size && size[1] ? size[1] : 8;
    }
  } else if (type === "circle" || type === "dashboard") {
    if (typeof size === "string" || typeof size === "undefined") {
      width = size === "small" ? 60 : 120;
      height = size === "small" ? 60 : 120;
    } else if (typeof size === "number") {
      width = size;
      height = size;
    } else {
      width = size && size[0] ? size[0] : 120;
      height = size && size[1] ? size[1] : 120;
    }
  }
  return [width, height];
};

export const getCircleStyle = ({
  perimeter,
  perimeterWithoutGap,
  offset,
  percent,
  rotateDeg,
  gapDegree,
  gapPosition,
  strokeColor,
  strokeLinecap,
  strokeWidth,
  stepSpace = 0,
  VIEW_BOX_SIZE = 100,
}) => {
  const offsetDeg = (offset / 100) * 360 * ((360 - gapDegree) / 360);
  const positionDeg =
    gapDegree === 0
      ? 0
      : {
          bottom: 0,
          top: 180,
          left: 90,
          right: -90,
        }[gapPosition];

  let strokeDashoffset = ((100 - percent) / 100) * perimeterWithoutGap;
  // Fix percent accuracy when strokeLinecap is round
  // https://github.com/ant-design/ant-design/issues/35009
  if (strokeLinecap === "round" && percent !== 100) {
    strokeDashoffset += strokeWidth / 2;
    // when percent is small enough (<= 1%), keep smallest value to avoid it's disappearance
    if (strokeDashoffset >= perimeterWithoutGap) {
      strokeDashoffset = perimeterWithoutGap - 0.01;
    }
  }

  const halfSize = VIEW_BOX_SIZE / 2;

  return {
    stroke: typeof strokeColor === "string" ? strokeColor : undefined,
    strokeDasharray: `${perimeterWithoutGap}px ${perimeter}`,
    strokeDashoffset: strokeDashoffset + stepSpace,
    transform: `rotate(${rotateDeg + offsetDeg + positionDeg}deg)`,
    transformOrigin: `${halfSize}px ${halfSize}px`,
    transition:
      "stroke-dashoffset .3s ease 0s, stroke-dasharray .3s ease 0s, stroke .3s, stroke-width .06s ease .3s, opacity .3s ease 0s",
    fillOpacity: 0,
  };
};

export function toArray(value) {
  const mergedValue = value !== undefined && value !== null ? value : [];
  return Array.isArray(mergedValue) ? mergedValue : [mergedValue];
}

export function camelToDash(text) {
  const dashed = text.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
  return dashed;
}

export function isValidSuccess(success) {
  return isObject(success) && typeof success.percent === "number" && typeof success.strokeColor === "string";
}
