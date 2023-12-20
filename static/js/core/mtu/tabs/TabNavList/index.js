import useState from "../../_util/useState";

export class TabNavList {
  constructor(params) {
    this.params = params;

    this.init();
  }

  init() {
    this.setup();
    this.setState();
    this.create();
  }

  setup() {
    const tabPositionTopOrBottom = this.tabPosition === "top" || this.tabPosition === "bottom";

    this.tabContentSizeValue = this.getUnitValue(this.tabContentSize, tabPositionTopOrBottom);
    this.addSizeValue = this.getUnitValue(this.addSize, tabPositionTopOrBottom);
    this.operationSizeValue = this.getUnitValue(this.operationSize, tabPositionTopOrBottom);

    const needScroll = this.containerExcludeExtraSizeValue < this.tabContentSizeValue + this.addSizeValue;

    if (needScroll) {
      this.visibleTabContentValue = this.containerExcludeExtraSizeValue - this.operationSizeValue;
    } else {
      this.visibleTabContentValue = this.containerExcludeExtraSizeValue - this.addSizeValue;
    }

    // ========================== Util =========================
    const operationsHiddenClassName = `${prefixCls}-nav-operations-hidden`;

    let transformMin = 0;
    let transformMax = 0;

    if (!tabPositionTopOrBottom) {
      transformMin = Math.min(0, visibleTabContentValue - tabContentSizeValue);
      transformMax = 0;
    } else if (rtl) {
      transformMin = 0;
      transformMax = Math.max(0, tabContentSizeValue - visibleTabContentValue);
    } else {
      transformMin = Math.min(0, visibleTabContentValue - tabContentSizeValue);
      transformMax = 0;
    }
  }

  setState() {
    this.transformLeft = 0;
    this.transformTop = 0;

    this.containerExcludeExtraSize;
    this.tabContentSize;
    addSize;
    operationSize;
    tabSizes;
    tabOffsets;
  }

  setTransformLeft() {
    // this.transformLeft =
  }

  // ============ Utils ============

  getTabSize(tab, containerRect) {
    const { offsetWidth, offsetHeight, offsetTop, offsetLeft } = tab;
    const { width, height, x, y } = tab.getBoundingClientRect();

    // Use getBoundingClientRect to avoid decimal inaccuracy
    if (Math.abs(width - offsetWidth) < 1) {
      return [width, height, x - containerRect.x, y - containerRect.y];
    }

    return [offsetWidth, offsetHeight, offsetLeft, offsetTop];
  }
  getSize(refObj) {
    const { offsetWidth = 0, offsetHeight = 0 } = refObj.current || {};

    // Use getBoundingClientRect to avoid decimal inaccuracy
    if (refObj.current) {
      const { width, height } = refObj.current.getBoundingClientRect();

      if (Math.abs(width - offsetWidth) < 1) {
        return [width, height];
      }
    }

    return [offsetWidth, offsetHeight];
  }

  getUnitValue(size, tabPositionTopOrBottom) {
    return size[tabPositionTopOrBottom ? 0 : 1];
  }

  alignInRange(value) {
    if (value < this.transformMin) {
      return this.transformMin;
    }
    if (value > this.transformMax) {
      return this.transformMax;
    }
    return value;
  }
}
