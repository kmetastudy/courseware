import { createElement } from "../../../utils/dom-utils";

export function AddButton({ prefixCls, editable, locale, style }) {
  if (!editable || editable.showAdd === false) {
    return null;
  }

  const buttonNode = createElement("button", {
    className: `${prefixCls}-nav-add`,
    styles: style,
    attributes: {
      type: "button",
      "aria-label": locale?.addAriaLabel || "Add tab",
    },
  });

  buttonNode.addEventListener("click", (event) => {
    editable.onEdit("add", { event });
  });

  editable?.addIcon ? buttonNode.append(editable.addIcon) : (buttonNode.textContent = "+");

  return buttonNode;
}
