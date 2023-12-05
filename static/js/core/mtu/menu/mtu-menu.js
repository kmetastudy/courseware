import { isArray, isObject, isElement } from "../_util/type-check";
import { MtuIcon, isValidIconName } from "../icon/mtu-icon";
import { omit } from "../../utils/_utils";
import { createElement } from "../_util/dom-element";

export class MtuMenu {
  constructor({
    prefixCls,
    className,
    style,
    theme = "light",
    expandIcon,
    _internalDisableMenuItemTitleTooltip,
    inlineCollapsed,
    siderCollapsed,
    items,
    rootClassName,
    mode,
    selectable,
    onClick,
    overflowedIndicatorPopupClassName,
    ...restProps
  } = {}) {
    const props = {
      prefixCls: typeof prefixCls === "string" ? prefixCls : "mtu-menu",
      className: typeof className === "string" || isArray(className) ? className : null,
      style: isObject(style) ? style : null,
      theme: ["light, dark"].includes(theme) ? theme : "light",
      expandIcon: isValidIconName(expandIcon) ? expandIcon : null,
      inlineCollapsed: typeof inlineCollapsed === "boolean" ? inlineCollapsed : null,
      siderCollapsed: typeof siderCollapsed === "boolean" ? siderCollapsed : false,
      items: isArray(items) ? items : null,
      children: isArray(children) ? children : null,
      mode: ["vertical", "horizontal", "inline"].includes(mode) ? mode : "inline",
      selectable: typeof selectable === "boolean" ? selectable : true,
      onClick: typeof onClick === "function" ? onClick : null,
      overflowedIndicatorPopupClassName:
        typeof overflowedIndicatorPopupClassName === "string" ? overflowedIndicatorPopupClassName : null,
    };

    this.props = props;
    this.restProps = restProps;
    Object.assign(this, props);

    this.init();
  }

  init() {
    this.initVariables();
    this.render();
  }

  initVariables() {
    this.passedProps = omit(this.restProps, ["collapsedWidth"]);
    this.mergedChildren = items;
    this.mergedMode = mode;
    this.mergedSelectable = this.selectable;
    this.mergedInlineCollapsed = this.getInlineCollapsed();
    this.defaultMotions = {
      horizontal: { motionName: `${this.prefixCls}-slide-up` },
      inline: initCollapseMotion(this.prefixCls),
      other: { motionName: `${this.prefixCls}-zoom-big` },
    };
  }

  render() {
    this.elMenu = this.createRootMenu();
    this.elItems = this.createItems();

    this.elMenu.append(...this.elItems);
    //
  }

  createRootMenu() {
    const elMenu = createElement("ul", {
      className: [this.prefixCls, `${this.prefixCls}-root`],
      attributes: { role: "menu" },
    });

    return elMenu;
  }

  getInlineCollapsed() {
    if (this.siderCollapsed !== undefined) {
      return this.siderCollapsed;
    }
    return this.inlineCollapsed;
  }
}

// create
// createItems

// submenu
// item
//  divider
//  group
//    title
//    list
