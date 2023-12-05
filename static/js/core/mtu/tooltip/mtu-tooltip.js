import { isObject, isElement } from "../../utils/type-check";
import { tooltip } from "./tooltip";
import { classNames } from "../../utils/class-names";
import { createElement } from "../../utils/dom-utils";
export class MtuTooltip {
  constructor({
    target,
    title,
    align,
    arrow = true,
    autoAdjustOverflow,
    color,
    defaultOpen,
    destroyTooltipOnHide,
    fresh,
    getPopupContainer,
    mouseEnterDelay = 0.1,
    mouseLeaveDelay = 0.1,
    overlayClassName,
    overlayStyle,
    placement,
    trigger,
    open,
    zIndex,
    onOpenChange,
    ...restProps
  } = {}) {}

  initVariables() {
    const prefixCls = "mtu-tooltip";

    const rootCls = classNames(prefixCls, { [`${prefixCls}-${placement}`]: placement });

    let elTooltip = createElement("div", {
      className: classNames(prefixCls, { [`${prefixCls}-${placement}`]: placement }),
    });

    let elArrow;
    if (arrow) {
      elArrow = createElement("div", {
        className: `${prefixCls}-arrow`,
      });
      elTooltip.append(elArrow);
    }
  }

  render() {
    const elTooltip = createElement("div", {
      className: classNames(prefixCls, { [`${prefixCls}-${placement}`]: placement }),
    });
    return elTooltip;
  }

  createArrow() {}

  createContent() {
    const content = createElement("div", { className: `${this.prefixCls}-content` });

    const contentInner = createElement("div", {
      className: `${this.prefixCls}-inner`,
      attributes: { role: "tooltip" },
    });

    contentInner.textContent = this.title;

    content.appendChild(contentInner);

    return content;
  }

  handleMouseEnter(evt) {
    //
  }

  handleMouseLeave() {
    //
  }
}
