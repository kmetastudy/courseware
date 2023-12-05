import { getSize } from "./utils";
import { createElement } from "../_util/dom-element";
import { isElement } from "../_util/type-check";

export class ProgressSteps {
  constructor({ size, steps, percent = 0, strokeWidth = 8, strokeColor, trailColor = null, prefixCls, children }) {
    const props = {
      size: typeof size === "number" || Array.isArray(size) || ["default, small"].includes(size) ? size : "default",
      steps: typeof steps === "number" ? steps : null,
      percent: typeof percent === "number" ? percent : 0,
      strokeWidth: typeof strokeWidth === "number" ? strokeWidth : 8,
      strokeColor: strokeColor,
      trailColor,
      prefixCls: typeof prefixCls === "string" ? prefixCls : "mtu-progress",
      children: children,
    };

    this.props = { ...props };
    Object.assign(this, props);

    this.variables = null; // assigned after initVariables

    this.init();
  }

  init() {
    this.initVariables({ ...this.props });

    this.render();
  }

  initVariables({ steps, percent, size, strokeWidth }) {
    const current = Math.round(steps * (percent / 100));
    const stepWidth = size === "small" ? 2 : 14;
    const mergedSize = size ?? [stepWidth, strokeWidth];
    const [width, height] = getSize(mergedSize, "step", { steps, strokeWidth });

    const unitWidth = width / steps;

    this.variables = { current, width, height, unitWidth };
  }

  render() {
    this.elOuter = this.createOuter({ ...this.props });
    const styledSteps = this.createStyledSteps({ ...this.props });

    this.elOuter.append(...styledSteps);

    if (this.children) {
      this.elOuter.appendChild(this.children);
    }
  }

  createOuter({ prefixCls }) {
    const className = `${prefixCls}-steps-outer`;
    const elOuter = createElement("div", { className });

    return elOuter;
  }

  createStyledSteps({ steps, strokeColor }) {
    const styledSteps = [];
    for (let i = 0; i < steps; i++) {
      const elStyledStep = this.createStyledStep(i, strokeColor);
      isElement(elStyledStep) ? styledSteps.push(elStyledStep) : null;
    }

    return styledSteps;
  }

  createStyledStep(index, strokeColor) {
    const color = Array.isArray(strokeColor) ? strokeColor[i] : strokeColor;

    const className = this.getStepClassName({ index, ...this.props, ...this.variables });
    const styles = this.getStepStyles({ color, index, ...this.props, ...this.variables });
    const attributes = { key: index };

    const elStyledStep = createElement("div", { className, styles, attributes });
    return elStyledStep;
  }

  getStepClassName({ index, prefixCls, current }) {
    const classList = [];
    const defaultClassName = `${prefixCls}-steps-item`;
    classList.push(defaultClassName);

    if (index <= current - 1) {
      const activeClassName = `${prefixCls}-steps-item-active`;
      classList.push(activeClassName);
    }

    return classList;
  }

  getStepStyles({ index, current, color, trailColor, unitWidth, height }) {
    const stepStyles = {
      backgroundColor: index <= current - 1 ? color : trailColor,
      width: `${unitWidth}px`,
      height: `${height}px`,
    };

    return stepStyles;
  }

  // API
  getElement() {
    return this.elOuter;
  }
}
