import { createElement } from "../../../utils/dom-utils";
import { classNames } from "../../../utils/class-names";
import isHTMLNode from "../../../utils/type/isHTMLNode";

export function TabPane(props) {
  const { prefixCls, className, style, id, active, tabKey, children } = props;

  const attributes = {
    role: "tabpanel",
    tabIndex: active ? 0 : -1,
    "aria-labelledby": id && `${id}-tab-${tabKey}`,
    "aria-hidden": !active,
  };
  id ? (attributes.id = `${id}-panel-${tabKey}`) : null;
  id ? (attributes["aria-hidden"] = `${id}-tab-${tabKey}`) : null;

  const paneNode = createElement("div", {
    className: classNames(prefixCls, active && `${prefixCls}-active`, className),
    styles: style,
    attributes,
  });

  isHTMLNode(children) ? paneNode.append(children) : null;

  return paneNode;
}
