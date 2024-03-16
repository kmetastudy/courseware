import { isHTMLNode, isFunction, isObject, isArray, isNull } from "../type";

function addChild(element, child) {
  if (isNull(child)) {
    return;
  }

  if (isArray(child)) {
    child.map((subChild) => addChild(element, subChild));
  } else {
    if (!elem["isNode"](child)) {
      child = document.createTextNode(child);
    }
    element.appendChild(child);
  }
}

function elem(element, config) {
  let args = arguments,
    index = 1,
    key,
    attribute;

  element = isHTMLNode(element) ? element : document.createElement(element);

  if (isObject(config) && !elem["isNode"](config) && !isArray(config)) {
    index++;
    for (key in config) {
      attribute = config[key];
      key = elem.attrMap[key] || key;

      if (isFunction(key)) {
        key(element, attribute);
      } else if (isFunction(attribute)) {
        element[key] = attribute;
      } else {
        if (attribute !== false && attribute !== undefined && attribute !== null) {
          element.setAttribute(key, attribute);
        }
      }
    }
  }

  for (; index < args.length; index++) {
    addChild(element, args[index]);
  }

  return element;
}

elem.attrMap = {};
elem.isElement = (object) => object instanceof Element;
elem["isNode"] = (object) => object instanceof Node;

if (typeof Proxy != "undefined") {
  elem.proxy = new Proxy(elem, {
    get: (target, key) => {
      !(key in elem) && (elem[key] = elem.bind(null, key));
      return elem[key];
    },
  });
}

elem.attrMap["on"] = (element, value) => {
  for (let eventName in value) {
    element.addEventListener(eventName, value[eventName]);
  }
};

export default elem;
