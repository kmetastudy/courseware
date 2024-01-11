import { isHTMLNode, isFunction } from "../utils/type";

function elem(node, config) {
  let args = arguments,
    index = 1,
    key,
    attribute;

  node = isHTMLNode(node) ? node : document.createElement(node);

  index++;

  for (key in config) {
    attribute = config[key];
    key = elem.attrMap[key] || key;

    if (isFunction(key)) {
      key(node, attribute);
    } else if (isFunction(attribute)) {
      //
    } else {
      node.setAttribute(key, attribute);
    }
  }

  for (; index < args.length; index++) {
    // append
  }
}

elem.isElement = () => {};
