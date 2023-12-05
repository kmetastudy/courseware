import { progressCircle } from "./progress-circle";
import { ProgressLine } from "./progress-line";
import { ProgressSteps } from "./progress-steps";
import { getSuccessPercent, validProgress, isValidSuccess } from "./utils";
import { isObject } from "../_util/type-check";

require("./mtu-progress.css");
export class MtuProgress {
  constructor({
    prefixCls = "mtu-progress",
    className,
    rootClassName,
    steps,
    strokeColor, // array | string
    percent = 0,
    size = "default",
    showInfo = true,
    type = "circle",
    status,
    format, //func
    style,
    success,
    ...restProps
  }) {
    const props = {
      prefixCls: typeof prefixCls === "string" ? prefixCls : "mtu-progress",
      className: typeof className === "string" ? className : null,
      rootClassName: typeof className === "string" ? className : null,
      steps: typeof steps === "number" ? steps : null,
      strokeColor: typeof strokeColor === "string" || Array.isArray(strokeColor) ? strokeColor : null,
      percent: typeof percent === "number" ? percent : 0,
      size: typeof size === "number" || Array.isArray(size) || ["default", "small"].includes(size) ? size : "default",
      showInfo: typeof showInfo === "boolean" ? showInfo : true,
      type: ["line", "circle", "dashboard"].includes(type) ? type : "circle",
      status: ["normal", "exception", "active", "success"].includes(status) ? status : "normal",
      format: typeof format === "function" ? format : this.defaultFormat,
      style: isObject(style) ? style : null,
      success: isValidSuccess(success) ? success : null,
    };

    this.props = { ...props, ...restProps };
    this.restProps = restProps;
    Object.assign(this, props);

    this.init();
  }

  init() {
    this.initVariables();

    this.create();
  }

  initVariables() {
    this.percentNumber = this.composePercentNumber(this.percent);
    this.progressStatus = this.getProgressStatus(this.status, this.steps, this.percentNumber);
    this.strokeColorNotArray = this.composeStrokeColorNotArray(this.strokeColor);
    this.strokeColorNotGradient = this.composeStrokeColorNotGradient(this.strokeColor);
  }

  create() {
    this.elProgressWrapper = this.createProgressWrapper({ ...this.props });

    // Which Type?
    this.elProgress = this.createProgress({ ...this.props });
    this.elProgressWrapper.appendChild(this.elProgress);

    const elProgressInfo = this.createProgressInfo({ ...this.props });
    if (this.type === "line" && this.steps === null) {
      this.elProgressWrapper.appendChild(elProgressInfo);
    } else {
      this.elProgress.appendChild(elProgressInfo);
    }
  }

  getElement() {
    return this.elProgressWrapper;
  }

  createProgressWrapper({ size, type, showInfo, status, percent }) {
    const elProgressWrapper = document.createElement("div");
    elProgressWrapper.classList.add("mtu-progress");
    size ? elProgressWrapper.classList.add(`mtu-progress-${size}`) : null;
    type ? elProgressWrapper.classList.add(`mtu-progress-${type}`) : null;
    elProgressWrapper.classList.add(`mtu-progress-status-${status}`);

    if (showInfo) {
      elProgressWrapper.classList.add("mtu-progress-show-info");
    }

    elProgressWrapper.setAttribute("role", "progressbar");
    elProgressWrapper.setAttribute("aria-valuenow", percent);
    return elProgressWrapper;
  }

  createProgress({ type, steps }) {
    let elProgress;
    if (type === "line") {
      elProgress = steps ? this.createSteps() : this.createLine();
    } else if (type === "circle" || type === "dashboard") {
      elProgress = this.createCircle();
    }

    return elProgress;
  }

  createLine() {
    const config = {
      ...this.props,
      strokeColor: this.strokeColorNotArray,
      prefixCls: this.prefixCls,
      // direction: this.direction
    };

    const clProgressLine = new ProgressLine(config);
    const elProgressLine = clProgressLine.getElement();
    return elProgressLine;
  }

  createSteps() {
    const config = {
      ...this.props,
      strokeColor: this.strokeColorNotGradient,
      prefixCls: this.prefixCls,
      steps: this.steps,
    };

    const clProgressSteps = new ProgressSteps(config);
    const elProgressSteps = clProgressSteps.getElement();

    return elProgressSteps;
  }

  createCircle() {
    const elProgressCircle = progressCircle({
      ...this.props,
      strokeColor: this.strokeColorNotArray,
      prefixCls: this.prefixCls,
      progressStatus: this.progressStatus,
    });
    return elProgressCircle;
  }

  createProgressInfo({ showInfo, success, format, type, progressStatus, percent }) {
    if (!showInfo) {
      return null;
    }
    const successPercent = getSuccessPercent(success);
    let text;
    const textFormatter = format || ((number) => `${number}%`);
    const isLineType = type === "line";
    if (format || (progressStatus !== "exception" && progressStatus !== "success")) {
      text = textFormatter(validProgress(percent), validProgress(successPercent));
    } else if (progressStatus === "exception") {
      // text = isLineType ? this.closeCircleFilled : closeOutlined;
    } else if (progressStatus === "success") {
      // text = isLineType ? this.closeCircleFilled : closeOutlined;
    }

    return this.createInfoElement(text);
  }

  createInfoElement(text) {
    const elInfo = document.createElement("span");
    elInfo.classList.add(`${this.prefixCls}-text`);
    elInfo.setAttribute("title", typeof text === "string" ? text : undefined);
    elInfo.textContent = text;
    return elInfo;
  }
  // UTILS
  composePercentNumber(percent) {
    return parseInt((percent ?? 0)?.toString(), 10);
  }

  getProgressStatus(status = this.status, percentNumber = this.percentNumber) {
    return status && percentNumber >= 100 ? "success" : "normal";
  }

  composeStrokeColorNotArray(strokeColor) {
    return Array.isArray(strokeColor) ? strokeColor[0] : strokeColor;
  }

  composeStrokeColorNotGradient(strokeColor) {
    return typeof strokeColor === "string" || Array.isArray(strokeColor) ? strokeColor : null;
  }

  defaultFormat(percent) {
    return percent + "%";
  }
}
