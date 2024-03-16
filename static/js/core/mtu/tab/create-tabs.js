// Reference
// https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/
// https://github.com/radix-ui/primitives/blob/main/packages/react/tabs/src/Tabs.tsx

import elem from "../../utils/elem/elem";
import { omit } from "../../utils/objects";
import { composeEventHandlers } from "../../utils/event";
import { getKeyByValue, getAdjacentKey } from "../../utils/Map";
require("./tab.css");

let tabCnt = 0;

function makeTabId(baseId, value) {
  return `${baseId}-tab-${value}`;
}

function makePanelId(baseId, value) {
  return `${baseId}-panel-${value}`;
}

export function createTabs() {
  let context = {
    baseId: null,
    value: null,
    onValueChange: null,
    orientation: null,
    dir: null,
    activationMode: null,
    currentTabElement: null,
    currentPanelElement: null,
  };

  let tabMap = new Map();
  let panelMap = new Map();

  let firstTab = null;
  let lastTab = null;

  /* EVENT HANDLERS */

  function onKeydown(event) {
    const target = event.currentTarget;
    const targetValue = getKeyByValue(tabMap, target);
    let value;
    let flag = false;

    switch (event.key) {
      case "ArrowLeft":
        value = target === firstTab ? getKeyByValue(tabMap, lastTab) : getAdjacentKey(tabMap, targetValue, "prev");
        context.onValueChange(value);
        flag = true;
        break;

      case "ArrowRight":
        value = target === lastTab ? getKeyByValue(tabMap, firstTab) : getAdjacentKey(tabMap, targetValue, "next");
        context.onValueChange(value);
        flag = true;
        break;

      case "Home":
        value = getKeyByValue(tabMap, firstTab);
        context.onValueChange(value);
        flag = true;
        break;

      case "End":
        value = getKeyByValue(tabMap, lastTab);
        context.onValueChange(value);
        flag = true;
        break;

      default:
        break;
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function changeTabAttributes(value, tabElement) {
    const isSelected = value === context.value;
    tabElement.setAttribute("aria-selected", isSelected);
    tabElement.setAttribute("data-state", isSelected ? "active" : "inactive");
    tabElement.setAttribute("tabindex", isSelected ? "0" : "-1");

    if (isSelected) {
      tabElement.focus();
    }

    return tabElement;
  }

  function changePanelAttributes(value, panelElement) {
    const isSelected = value === context.value;
    panelElement.setAttribute("data-state", isSelected ? "active" : "inactive");
    if (isSelected) {
      panelElement.removeAttribute("hidden");
    } else {
      panelElement.setAttribute("hidden", "");
    }
    return panelElement;
  }

  function changeValue(value) {
    if (context.value && value && context.value === value) {
      return;
    }

    context.value = value;

    for (const [key, element] of tabMap) {
      changeTabAttributes(key, element);
    }

    for (const [key, element] of panelMap) {
      changePanelAttributes(key, element);
    }
  }

  const Tabs = {
    Root({
      value: valueProp,
      onValueChange: userOnValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    }) {
      const direction = dir ?? "ltr";
      const rootElement = elem("div", {
        dir: direction,
        "data-orientation": orientation,
        ...tabsProps,
      });

      context.baseId = tabCnt;
      context.orientation = orientation;
      context.dir = direction;
      context.defaultValue = defaultValue;
      context.onValueChange = (value) => {
        userOnValueChange?.(value);
        changeValue(value);
      };

      tabCnt++;

      return rootElement;
    },

    List({ ...attributes } = {}) {
      const tabListElement = elem("div", {
        role: "tablist",
        "aria-orientation": context.orientation,
        tabindex: 0,
        "data-orientation": context.orientation,
        style: "outline: none;",
        ...attributes,
      });

      return tabListElement;
    },

    Tab({ value, child, disabled = false, ...rest } = {}) {
      const isSelected = value === context.value;
      const events = rest?.on ? omit(rest?.on, ["mouseDown", "keyDown", "focus"]) : {};
      const tabProps = omit(rest, ["on"]);

      events.mouseDown = composeEventHandlers(rest?.mouseDown, (event) => {
        if (!disabled && event.button === 0 && event.ctrlKey === false) {
          context.onValueChange(value);
        } else {
          event.preventDefault();
        }
      });

      events.keydown = composeEventHandlers(rest?.keydown, (event) => {
        if ([" ", "Enter"].includes(event.key)) {
          context.onValueChange(value);
        }
        onKeydown(event);
      });

      events.focus = composeEventHandlers(rest?.focus, () => {
        const isAutomaticActivation = context.activationMode !== "manual";
        const isSelected = value === context.value;
        if (!isSelected && !disabled && isAutomaticActivation) {
          context.onValueChange(value);
        }
      });

      const tabId = makeTabId(context.baseId, value);
      const panelId = makePanelId(context.baseId, value);
      const tabElement = elem(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": isSelected,
          "aria-controls": panelId,
          "data-state": isSelected ? "active" : "inactive",
          "data-disabled": disabled ? "" : undefined,
          disabled: disabled,
          tabindex: 0,
          "data-orientation": context.orientation,
          id: tabId,
          on: events,
          ...tabProps,
        },
        child,
      );

      // tabMap[value] = tabElement;
      tabMap.set(value, tabElement);
      if (!firstTab) {
        firstTab = tabElement;
      } else {
        lastTab = tabElement;
      }

      return tabElement;
    },

    Panel({ child, value, forceMount, ...panelProps } = {}) {
      const tabId = makeTabId(context.baseId, value);
      const panelId = makePanelId(context.baseId, value);
      const isSelected = value === context.value;
      // const isMountAnimationPrevented = isSelected;

      const panelElement = elem(
        "div",
        {
          "data-state": isSelected ? "active" : "inactive",
          "data-orientation": context.orientation,
          role: "tabpanel",
          "aria-labelledby": tabId,
          hidden: !isSelected,
          id: panelId,
          tabIndex: 0,
          ...panelProps,
        },
        child,
      );

      panelMap.set(value, panelElement);
      return panelElement;
    },

    init() {
      if (context.defaultValue) {
        context.onValueChange(context.defaultValue);
      }
    },
  };

  return Tabs;
}
