import { isElement, isArray, isObject } from "../_util/type-check";
import { createElement } from "../_util/dom-element";

export class MenuItem {
  constructor({
    className,
    children,
    icon,
    title,
    danger,
    prefixCls,
    firstLevel,
    direction,
    disableMenuItemTitleTooltip,
    inlineCollapsed: isInlineCollapsed,
    siderCollapsed,
  }) {
    //
    this.init();
  }

  init() {
    this.initVariables();
    this.render();
  }

  initVariables() {
    let tooltopTitle;
    let childrenLength;
    // let
  }

  renderItemChildren() {
    const wrapNode = this.createWrapNode();
    if (!icon || (isElement(children) && children.type === "span")) {
      if (children && inlineCollapsed && firstLevel && typeof children === "string") {
        const replacedWrapNode = this.createReplacedWrapNode();
        // return <div className={`${prefixCls}-inline-collapsed-noicon`}>{children.charAt(0)}</div>;
        return replacedWrapNode;
      }
    }
    return wrapNode;
  }
}
