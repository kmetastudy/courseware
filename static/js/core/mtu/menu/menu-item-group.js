import { parseChildren } from "./utils/common-util";
import { createElement } from "../_util/dom-element";
import { isElement } from "../_util/type-check";
import { omit } from "../../utils/_utils";

export class MenuItemGroup {
  constructor({ children, ...props }) {
    // const groupPrefixCls = `${prefixCls}-item-group`;
    this.children = children;
    this.props = props;

    this.init();
  }

  init() {
    this.initVariables();
    //
  }

  initVariables() {
    // this.connectedKeyPath = useFullPath(this.props.eventKey);
    this.connectedKeyPath = [];
  }

  render() {
    this.elMenuItemGroup = this.create({ ...omit(this.props, ["warnKey"]) });
    const childList = parseChildren(this.children, this.connectedKeyPath);
    childList ? this.elMenuItemGroup.append(...childList) : null;
  }

  create({ prefixCls, className, title, eventKey, children, ...restProps }) {
    const groupPrefixCls = `${prefixCls}-item-group`;

    const elItemGroup = this.createItemGroup({ groupPrefixCls, className, ...restProps });
    const elItemGroupTitle = this.createItemGroupTitle(groupPrefixCls, title);
    const elItemGroupList = this.createItemGroupList(groupPrefixCls, children);

    elItemGroup.appendChild(elItemGroupTitle);
    elItemGroup.appendChild(elItemGroupList);
    return elItemGroup;
  }

  createItemGroup({ groupPrefixCls, className, ...restProps }) {
    const elItemGroup = createElement("li", {
      className: [groupPrefixCls, ...className],
      attributes: { role: "presentation", ...omit({ ...restProps }, ["style"]) },
      onClick: (e) => e.stopPropagation(),
      styles: restProps?.style,
    });

    return elItemGroup;
  }

  createItemGroupTitle(className, title) {
    const elItemGroupTitle = createElement("div", {
      className,
      attributes: { role: "presentation", title: typeof title === "string" ? title : undefined },
    });

    if (isElement(title)) {
      elItemGroupTitle.appendChild(title);
    } else if (typeof title === "string") {
      elItemGroupTitle.textContent = title;
    }

    return elItemGroupTitle;
  }

  createItemGroupList(className, children) {
    const elItemGroupList = createElement("ul", {
      className,
      attributes: { role: "presentation" },
    });

    isElement(children) ? elItemGroupList.appendChild(children) : null;

    return elItemGroupList;
  }

  getElement() {
    return this.elMenuItemGroup;
  }
}
