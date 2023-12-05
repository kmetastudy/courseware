import { isObject, isElement } from "../_util/type-check";
import { getSuccessPercent, isValidSuccess, getSize, validProgress } from "./utils";
import { createElement } from "../_util/dom-element";
export class ProgressLine {
  constructor({
    prefixCls,
    direction: directionConfig,
    percent,
    size,
    strokeWidth,
    strokeColor,
    strokeLinecap = "round",
    children,
    trailColor = null,
    success,
  }) {
    const props = {
      prefixCls: typeof prefixCls === "string" ? prefixCls : "mtu-progress",
      directionConfig: ["ltr", "rtl"].includes(directionConfig) ? directionConfig : null,
      percent: typeof percent === "number" && percent >= 0 && percent <= 100 ? percent : 0,
      size: typeof size === "number" || Array.isArray(size) || ["default, small"].includes(size) ? size : "default",
      strokeWidth: typeof strokeWidth === "number" ? strokeWidth : undefined,
      strokeColor: typeof strokeColor === "string" || Array.isArray(strokeColor) ? strokeColor : null,
      strokeLinecap: ["butt", "square", "round"].includes(strokeLinecap) ? strokeLinecap : "round",
      children: isElement(children) ? children : null,
      trailColor: typeof trailColor === "string" ? trailColor : null,
      success: isValidSuccess(success) ? success : null,
    };

    this.props = props;
    Object.assign(this, props);

    console.log(props);
    this.init();
  }

  init() {
    this.initVariables();

    this.render();
  }

  initVariables() {
    const backgroundProps = this.getBackgroundProps(this.strokeColor, this.directionConfig);
    const borderRadius = this.getBorderRadius(this.strokeLinecap);

    const mergedSize = this.size ?? [-1, this.strokeWidth || (this.size === "small" ? 6 : 8)];
    const [width, height] = getSize(mergedSize, "line", { strokeWidth: this.strokeWidth });

    this.outerStyle = this.getOuterStyle(width, height);
    this.trailStyle = this.getTrailStyle(this.trailColor, borderRadius);
    this.percentStyle = this.getPercentStyle({ percent: this.percent, height, borderRadius, backgroundProps });

    this.successPercent = getSuccessPercent(this.success);
    this.successPercentStyle = this.getSuccessPercentStyle({
      successPercent: this.successPercent,
      height,
      borderRadius,
      success: this.success,
    });
  }

  getBackgroundProps(strokeColor, directionConfig) {
    if (strokeColor && typeof strokeColor !== "string") {
      return this.handleGradient(strokeColor, directionConfig);
    } else {
      return { backgroundColor: strokeColor };
    }
  }

  getBorderRadius(strokeLinecap) {
    return strokeLinecap === "square" || strokeLinecap === "butt" ? 0 : null;
  }

  getTrailStyle(trailColor, borderRadius) {
    return { backgroundColor: trailColor || null, borderRadius };
  }

  getMergedSize(size, strokeWidth) {
    return size ?? [-1, strokeWidth || size === "small" ? 6 : 8];
  }

  getPercentStyle({ percent, height, borderRadius, backgroundProps }) {
    const percentStyle = {
      width: `${validProgress(percent)}%`,
      height: `${height}px`,
      borderRadius,
      ...backgroundProps,
    };
    return percentStyle;
  }

  getSuccessPercentStyle({ successPercent, height, borderRadius, success }) {
    const successPercentStyle = {
      width: `${validProgress(successPercent)}%`,
      height: `${height}px`,
      borderRadius,
      backgroundColor: success?.strokeColor,
    };
    return successPercentStyle;
  }

  getOuterStyle(width, height) {
    const outerStyle = {
      width: width < 0 ? "100%" : width,
      height: `${height}px`,
    };
    return outerStyle;
  }

  handleGradient(strokeColor, directionConfig) {
    const {
      from = "blue",
      to = "blue",
      direction = directionConfig === "rtl" ? "to left" : "to right",
      ...rest
    } = strokeColor;

    if (Object.keys(rest).length !== 0) {
      const sortedGradients = this.sortGradient(rest);
      return { backgroundImage: `linear-gradient(${direction}, ${sortedGradients})` };
    }
    return { backgroundImage: `linear-gradient(${direction}, ${from}, ${to})` };
  }

  /**
   * example
   * {
   *   "0%": "#afc163",
   *   "75%": "#009900",
   *   "50%": "green", // ====> '#afc163 0%, #66FF00 25%, #00CC00 50%, #009900 75%, #ffffff 100%'
   *   "25%": "#66FF00",
   *   "100%": "#ffffff"
   * }
   * @param {*} gradients
   * @returns
   */
  sortGradient(gradients) {
    let tempArr = [];
    Object.keys(gradients).forEach((key) => {
      const formattedKey = parseFloat(key.replace(/%/g, ""));
      if (!isNaN(formattedKey)) {
        tempArr.push({
          key: formattedKey,
          value: gradients[key],
        });
      }
    });
    tempArr = tempArr.sort((a, b) => a.key - b.key);
    return tempArr.map(({ key, value }) => `${value} ${key}%`).join(", ");
  }

  render() {
    console.log(this.outerStyle, this.trailStyle, this.percentStyle);
    // this.elWrapper = this.createDivElement();

    this.elOuter = this.createDivElement(`${this.prefixCls}-outer`, this.outerStyle);
    // this.elWrapper.appendChild(this.elOuter);

    this.elInner = this.createDivElement(`${this.prefixCls}-inner`, this.trailStyle);
    this.elOuter.appendChild(this.elInner);

    this.elBackground = this.createDivElement(`${this.prefixCls}-bg`, this.percentStyle);
    this.elInner.appendChild(this.elBackground);

    if (this.successPercent) {
      this.elSuccessBackground = this.createDivElement(`${this.prefixCls}-success-bg`, this.successPercentStyle);
      this.elBackground.appendChild(this.elSuccessBackground);
    }

    if (this.children) {
      this.elWrapper.appendChild(this.children);
    }
  }

  createDivElement(className, styles) {
    const TAG_NAME = "div";
    const element = createElement(TAG_NAME, { className, styles });
    return element;
  }

  getElement() {
    // return this.elWrapper;
    return this.elOuter;
  }
}
