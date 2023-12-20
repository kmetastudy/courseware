import isObject from "../../../utils/type/isObject";
import isHTMLNode from "../../../utils/type/isHTMLNode";
import isString from "../../../utils/type/isString";

import { createElement } from "../../../utils/dom-utils";

export function ExtraContent(props) {
  const { position, prefixCls, extra } = props;
  if (!extra) {
    return null;
  }

  let content;

  // Parse extra
  let assertExtra = {};

  if (isObject(extra) && !isHTMLNode(extra)) {
    assertExtra = extra;
  } else {
    assertExtra.right = extra;
  }

  if (position === "right") {
    content = assertExtra.right;
  }

  if (position === "left") {
    content = assertExtra.left;
  }

  if (content) {
    const extraContent = createElement("div", { className: `${prefixCls}-extra-content` });
    extraContent.append(content);
    return extraContent;
  } else {
    return null;
  }
}
