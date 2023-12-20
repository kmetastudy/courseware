import isBoolean from "../../utils/type/isBoolean";
import isFunction from "../../utils/type/isFunction";
import { classNames } from "../../utils/class-names";
import { createElement } from "../../utils/dom-utils";
import { omit, pick } from "../../utils/_utils";

export function CollapsePanel(props = {}) {
  const {
    showArrow = true,
    headerClass,
    isActive,
    onItemClick,
    forceRender,
    className,
    prefixCls,
    collapsible,
    accordion,
    panelKey,
    extra,
    header,
    expandIcon,
    openMotion,
    destroyInactivePanel,
    children,
    ...restProps
  } = props;

  const disabled = collapsible === "disabled";
  const collapsibleHeader = collapsible === "header";
  const collapsibleIcon = collapsible === "icon";

  const isExtraExist = extra !== null && extra !== undefined && typeof extra !== "boolean";

  const handleItemClick = () => {
    onItemClick?.(panelKey);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.keyCode === KeyCode.ENTER || e.which === KeyCode.ENTER) {
      handleItemClick();
    }
  };

  let iconNode = isFunction(expandIcon) ? expandIcon(props) : createElement("i", { className: "arrow" });

  if (iconNode) {
    const realIconNode = createElement("div", { className: `${prefixCls}-expand-icon` });
    realIconNode.addEventListener("click", () => {
      ["header", "icon"].includes(collapsible) ? handleItemClick : undefined;
    });
    realIconNode.append(iconNode);

    iconNode = realIconNode;
  }

  const collapsePanelClassNames = classNames(
    {
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-item-active`]: isActive,
      [`${prefixCls}-item-disabled`]: disabled,
    },
    className,
  );

  const headerClassName = classNames(headerClass, {
    [`${prefixCls}-header`]: true,
    [`${prefixCls}-header-collapsible-only`]: collapsibleHeader,
    [`${prefixCls}-icon-collapsible-only`]: collapsibleIcon,
  });

  const headerProps = {
    className: headerClassName,
    "aria-expanded": isActive,
    "aria-disabled": disabled,
    onKeyDown: handleKeyDown,
  };

  if (!collapsibleHeader && !collapsibleIcon) {
    headerProps.onClick = handleItemClick;
    headerProps.role = accordion ? "tab" : "button";
    headerProps.tabIndex = disabled ? -1 : 0;
  }

  // ============ Render ============
  const panelNode = createElement("div", {
    className: collapsePanelClassNames,
    attributes: { ...restProps },
  });

  const headerNode = createElement("div", {
    className: headerProps.className,
  });

  showArrow && iconNode ? headerNode.append(iconNode) : null;

  const headerTextNode = createElement("span", {
    className: `${prefixCls}-header-text`,
    attributes: pick(headerProps, ["aria-expanded", "aria-disabled", "role", "tabIndex"]),
  });

  headerTextNode.append(header);

  if (isExtraExist) {
    const extraNode = createElement("div", { className: `${prefixCls}-extra` });
    extraNode.append(extra);
    headerNode.append(extraNode);
  }
}
