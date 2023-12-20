import isHTMLNode from "../../utils/type/isHTMLNode";
import isString from "../../utils/type/isString";
import isObject from "../../utils/type/isObject";
import isFunction from "../../utils/type/isFunction";
import isArray from "../../utils/type/isArray";
import isBoolean from "../../utils/type/isBoolean";
import isNumber from "../../utils/type/isNumber";

import { isValidIconName } from "../icon/mtu-icon";

export const tabsConfig = {
  type: {
    defaultValue: "line",
    validate: (value) => ["line", "card", "editable-card"].includes(value),
  },
  size: {
    defaultValue: "middle",
    validate: (value) => ["large", "middle", "small"].includes(value),
  },
  centered: {
    defaultValue: false,
    validate: (value) => typeof value === "boolean",
  },
  items: {
    defaultValue: [],
    validate: (value) => Array.isArray(value),
  },
  onChange: {
    defaultValue: null,
    validate: (value) => typeof value === "function",
  },
  tabPosition: {
    defaultValue: "top",
    validate: (value) => ["top", "right", "bottom", "left"].includes(value),
  },
  onTabClick: {
    defaultValue: null,
    validate: (value) => typeof value === "function",
  },
};

export const itemConfig = {
  title: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  target: {
    defaultValue: null,
    validate: (value) => {
      if (typeof value === "string") {
        return isElement(document.querySelector(value));
      } else {
        return isElement(value);
      }
    },
  },
  disabled: {
    defaultValue: false,
    validate: (value) => typeof value === "boolean",
  },
  key: {
    defaultValue: null,
    validate: (value) => typeof value === "string",
  },
  icon: {
    defaultValue: null,
    validate: (value) => isValidIconName(value),
  },
};

export const defaultConfig = {
  activeKey: (value) => (isString(value) ? value : null),
  addIcon: (value) => (isHTMLNode(value) ? value : null),
  animated: (value) => {
    if (value === false) {
      return value;
    }

    if (isObject(value)) {
      value.inkBar = isBoolean(value.inkBar) ? value.inkBar : true;
      value.tabPane = isBoolean(value.tabPane) ? value.tabPane : false;
      return value;
    }

    return { inkBar: true, tabPane: false };
  },
  centered: (value) => (isBoolean(value) ? value : false),
  defaultActiveKey: (value) => (isString(value) ? value : null),
  hideAdd: (value) => (isBoolean(value) ? value : false),
  indicatorSize: (value) => (isNumber(value) ? value : null),
  items: (value) => (Array.isArray(value) ? value : null),
  moreIcon: (value) => (isHTMLNode(value) ? value : null),
  popupClassName: (value) => (isString(value) ? value : null),
  // renderTabBar,
  size: (value) => (["large", "middle", "small"].includes(value) ? value : "middle"),
  // tabBarExtraContent,
  // tabBarGutter,
  tabBarStyle: (value) => (isObject(value) ? value : null),
  tabPosition: (value) => (["top", "right", "bottom", "left"].includes(value) ? value : "top"),
  destroyInactiveTabPane: (value) => (isBoolean(value) ? value : false),
  type: (value) => (["line", "card", "editable-card"].includes(value) ? value : "line"),
  onChange: (value) => (typeof value === "function" ? value : null),
  onEdit: (value) => (typeof value === "function" ? value : null),
  onTabClick: (value) => (typeof value === "function" ? value : null),
  onTabScroll: (value) => (typeof value === "function" ? value : null),

  prefixCls: (value) => (isString(value) ? value : null),
  className: (value) => (isString(value) ? value : null),
  style: (value) => (isObject(value) ? value : null),
};
