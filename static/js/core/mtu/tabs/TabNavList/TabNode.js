import { createElement, wrapElement } from "../../../utils/dom-utils";
import { classNames } from "../../../utils/class-names";
import isString from "../../../utils/type/isString";
import { genDataNodeKey, getRemovable } from "../utils";

export function TabNode(props) {
  const {
    prefixCls,
    id,
    active,
    tab: { key, label, disabled, closeIcon, icon },
    closable,
    renderWrapper,
    removeAriaLabel,
    editable,
    onClick,
    onFocus,
    style,
  } = props;

  const SPACE_KEY_CODE = " ";
  const ENTER_KEY_CODE = "Enter";

  const tabPrefix = `${prefixCls}-tab`;

  const removable = getRemovable(closable, closeIcon, editable, disabled);

  function onInternalClick(e) {
    if (disabled) {
      return;
    }
    onClick(e);
  }

  function onRemoveTab(event) {
    event.preventDefault();
    event.stopPropagation();
    editable.onEdit("remove", { key, event });
  }

  const labelNode = icon && isString(label) ? createElement("span", { text: label }) : label;

  const tabNode = createElement("div", {
    className: classNames(tabPrefix, {
      [`${tabPrefix}-with-remove`]: removable,
      [`${tabPrefix}-active`]: active,
      [`${tabPrefix}-disabled`]: disabled,
    }),
    attributes: {
      "data-node-key": genDataNodeKey(key),
    },
    styles: style,
  });

  tabNode.addEventListener("click", onInternalClick);

  const tabButton = createElement("div", {
    className: `${tabPrefix}-btn`,
    attributes: {
      role: "tab",
      "aria-selected": active,
      id: id && `${id}-tab-${key}`,
      "aria-controls": id && `${id}-panel-${key}`,
      "aria-disabled": disabled,
      tabIndex: disabled ? null : 0,
    },
  });

  tabButton.addEventListener("click", (evt) => {
    evt.stopPropagation();
    onInternalClick(evt);
  });

  tabButton.addEventListener("keydown", (evt) => {
    if (evt.key === SPACE_KEY_CODE || evt.key === ENTER_KEY_CODE) {
      evt.preventDefault();
      onInternalClick(evt);
    }
  });

  onFocus ? tabButton.addEventListener("focus", onFocus) : null;

  icon ? tabButton.append(icon) : null;
  label && labelNode ? tabButton.append(labelNode) : null;

  tabNode.append(tabButton);
  // Remove Button
  if (removable) {
    const removeBtn = createElement("button", {
      className: `${tabPrefix}-remove`,
      attributes: {
        type: "button",
        "aria-label": removeAriaLabel || "remove",
        tabIndex: 0,
      },
    });

    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      onRemoveTab(e);
    });

    tabNode.append(removeBtn);
  }

  return renderWrapper ? wrapElement(tabNode, renderWrapper) : tabNode;
}
