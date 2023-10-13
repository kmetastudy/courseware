import { mtoSVGBuilder } from "../component/mto-svg-builder";

export const uiHoverMenu = function (target, options) {
  if (!document.contains(target)) {
    throw new Error("invalid target: ", target);
  }

  this.defaultOptions = {
    style: {},
    position: {
      top: "default",
      left: "default",
    },
    items: [
      "name1",
      "name2",
      {
        name: "name3",
        index: 2,
        icon: null,
        events: null,
      },
    ],
  };

  this.target = target;
  this.userOptions = options || null;
  this._init();
};

uiHoverMenu.prototype._init = function () {
  this._initSVGCreator();
  this._validateUserOptions();
  this._setOptions();
  this._create();
};

uiHoverMenu.prototype._initSVGCreator = function () {
  this.clSVGCreator = new mtoSVGBuilder("default");
  this.defaultIcons = {
    youtube: "fa-brand fa-youtube",
    "file-lines": "fa-regular fa-file-lines",
    "trash-can": "fa-regular fa-trash-can",
  };
};

uiHoverMenu.prototype._setOptions = function () {};

uiHoverMenu.prototype._validateUserOptions = function (options) {
  if (Object.keys(options) === 0) {
    // use default options
    return;
  }

  if (options.items && !Array.isArray(options.items)) {
    throw new Error("Options must be an object and contain an items array.");
  }

  options.items.forEach((item, index) => {
    if (typeof item !== "string" && typeof item !== "object") {
      throw new Error(`Item at index ${index} must be a string or object.`);
    }

    if (typeof item === "object" && (typeof item.index !== "number" || item.index !== index)) {
      throw new Error(`Item at index ${index} has an invalid index value.`);
    }

    if (typeof item === "object" && (typeof item.icon !== "string" || Object.keys(this.defaultIcons === false))) {
      throw new Error(`Item at index ${index} has an invalid index value.`);
    }
  });
};

uiHoverMenu.prototype.deepCopy = function (object) {
  if (object === null || typeof object !== "object") {
    return object;
  }
  // 객체인지 배열인지 판단
  const copy = Array.isArray(object) ? [] : {};

  for (let key of Object.keys(object)) {
    copy[key] = this.deepCopy(object[key]);
  }

  return copy;
};

uiHoverMenu.prototype.deepMerge = function (defaultObject, userObject) {
  for (let key in userObject) {
    if (userObject.hasOwnProperty(key)) {
      if (
        typeof userObject[key] === "object" &&
        userObject[key] !== null &&
        defaultObject.hasOwnProperty(key) &&
        typeof defaultObject[key] === "object"
      ) {
        this.deepMerge(defaultObject[key], userObject[key]);
      } else {
        defaultObject[key] = this.deepCopy(userObject[key]);
      }
    }
  }
};
