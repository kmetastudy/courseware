// reference
// https://stackoverflow.com/questions/24107288/creating-an-svg-dom-element-from-a-string

import { data as fontawesomeData } from "../data/data-fontawesome";

/**
 *
 * @param {string} type default or custom
 * @param {*} options provider, attribute
 */
export const mtoSVGBuilder = function (type, options) {
  this.options = options || {};
  this.type = null;
  this.provider = null;
  this.attribute = {
    height: "1rem",
  };
  this.data = {
    fontawesome: fontawesomeData,
  };

  this.setType(type);
  this._init();
};

mtoSVGBuilder.prototype._init = function () {
  this._initOptions();
};

mtoSVGBuilder.prototype._initOptions = function () {
  if (!this.options.provider) {
    const defaultProvider = "fontawesome"; // 나중에 바꾸자
    this.provider = defaultProvider;
  } else {
    this.setProvider(this.options.provider);
  }

  if (this.options.attribute) {
    this.setSVGAttribute(this.attribute, this.options.attribute);
  }
};

mtoSVGBuilder.prototype.create = function (value) {
  const svgString = this.getDataMapper(value, this.type);
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const element = doc.documentElement;
  this.setElementAttribute(element);
  return element;
};

mtoSVGBuilder.prototype.getDataMapper = function (value, type) {
  if (type === "default") {
    const svgStringData = this.getDefaultData(value);
    return svgStringData;
  } else if (type === "custom") {
    const svgStringData = this.getCustomData(value);
    return svgStringData;
  } else {
    throw new Error("check type");
  }
};

mtoSVGBuilder.prototype.getDefaultData = function (classname) {
  const targetData = this.data[this.provider];
  if (this._validateKey(classname, targetData)) {
    return targetData[classname]["svgString"];
  }
};

mtoSVGBuilder.prototype.getCustomData = function (svgString) {
  // need to validate?
  return svgString;
};

mtoSVGBuilder.prototype.setType = function (type) {
  this._validateType(type);
  this.type = type;
};

mtoSVGBuilder.prototype.setProvider = function (provider) {
  this._validateProvider(provider);
  this.provider = provider;
};

mtoSVGBuilder.prototype.setSVGAttribute = function (attribute) {
  this.attribute = {
    ...this.attribute,
    attribute,
  };
};

mtoSVGBuilder.prototype.setElementAttribute = function (svgElement) {
  for (let [key, value] of Object.entries(this.attribute)) {
    svgElement.setAttribute(key, value);
  }
};
// validate

mtoSVGBuilder.prototype._validateType = function (type) {
  const validType = {
    default: true,
    custom: true,
  };
  if (!this._validateKey(type, validType)) {
    throw new Error(`invalid Type ${type}: . use "default" or "custom"`);
  }
};

mtoSVGBuilder.prototype._validateProvider = function (provider) {
  const validProvider = {
    fontawesome: true,
  };
  if (!this._validateKey(provider, validProvider)) {
    throw new Error('invalid Provider. use "fontawesome"');
  }
};

mtoSVGBuilder.prototype._validateKey = function (key, obj) {
  return obj[key];
};

mtoSVGBuilder.prototype.removeCommentsFromSVG = function (svgElement) {
  var nodes = svgElement.childNodes;

  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i].nodeType === Node.COMMENT_NODE) {
      svgElement.removeChild(nodes[i]);
      // Decrement the counter as the childNodes list gets updated
      i--;
    } else if (nodes[i].childNodes.length) {
      this.removeCommentsFromSVG(nodes[i]);
    }
  }
};

mtoSVGBuilder.prototype.getData = function (provider) {
  return this.data[provider];
};

mtoSVGBuilder.prototype.getIconNames = function (provider) {
  return Object.keys(this.data[provider]);
};
