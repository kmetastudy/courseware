import { MtuIcon } from "../icon/mtu-icon";
import { classNames } from "../../utils/class-names";
import { createElement } from "../../utils/dom-utils";
import { isArray, isObject, isString, isBoolean, isHTMLNode, isFunction } from "../../utils/type/index";
/**
 * @param {Number} a
 * @param {String} b
 */
export class Collapse {
  constructor(params = {}) {
    const props = {
      prefixCls: isString(params.prefixCls) ? params.prefixCls : "mtu-collapse",
      destroyInactivePanel: isBoolean(params.destroyInactivePanel) ? params.destroyInactivePanel : false,
      style: isObject(params.style) ? params.style : null,
      accordion: isBoolean(params.accordion) ? params.accordion : null,
      className: isString(params.className) ? params.className : null,
      // children: ,
      collapsible: ["header", "icon", "disabled"].includes(params.collapsible) ? params.collapsible : null,
      openMotion: isObject(params.openMotion) ? params.openMotion : null,
      expandIcon: isHTMLNode(params.expandIcon) ? params.expandIcon : null,
      // activeKey: rawActiveKey,
      activeKey: isString(params.activeKey) || isNumber(params.activeKey) ? params.activeKey : null,
      defaultActiveKey:
        isString(params.defaultActiveKey) || isNumber(params.defaultActiveKey) ? params.defaultActiveKey : null,
      onChange: isFunction(params.onChange) ? params.onChange : null,
      items: params.items,
    };

    this.init();
  }

  init() {
    this.initVariables();
    this.setup();
    this.create();
  }

  initVariables() {
    this.prefixCls = "mtu-collapse";
  }

  setup() {
    this.expandIconPosition = this.setExpandIconPosition();
  }

  // ============ State ============
  renderExpandIcon(panelProps) {
    if (this.expandIcon) {
      return this.expandIcon(panelProps);
    } else {
      const expandIcon = MtuIcon("right");
      //
    }
  }

  // ============ State ============
  setExpandIconPosition() {
    if (this.expandIconPosition === "left") {
      return "start";
    }
    return this.expandIconPosition === "right" ? "end" : this.expandIconPosition;
  }
}
