import { createElement, createElementNS } from "../../utils/dom-utils";

export function CircleLegend({ title, color }) {
  const prefixCls = "circle-legend";

  const wrapper = createElement("span", {
    className: `${prefixCls}-wrapper`,
    styles: {
      position: "relative",
      "line-height": 1,
      width: "100%",
    },
  });

  const svg = createElementNS("svg", {
    className: `${prefixCls}`,
  });
  svg.setAttribute("viewBox", "0 0 100 100");

  const circle = createElementNS("circle", {
    className: `${prefixCls}-circle`,
    attributes: { cx: 10, cy: 10, r: 7 },
    styles: { fill: color },
  });
  svg.appendChild(circle);

  const label = createElement("span", {
    className: `${prefixCls}-label`,
    styles: { color },
  });
  label.textContent = title;

  wrapper.append(svg, label);

  return wrapper;
}
