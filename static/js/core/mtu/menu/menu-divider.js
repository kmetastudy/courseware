import { isElement, isArray, isObject } from "../_util/type-check";
import { classNames } from "../../utils/class-names";
import { createElement } from "../_util/dom-element";

export class MenuDivider {
  constructor({ className, prefixCls, style, dashed, style }) {
    const props = {
      prefixCls: typeof prefixCls === "string" ? prefixCls : "mtu-menu",
      style: isObject(style) ? style : null,
      dashed: typeof dashed === "boolean" ? dashed : false,
      className: typeof className === "string" ? className : null,
      style: isObject(style) ? style : null,
    };

    const classString = classNames(
      {
        [`${props.prefixCls}-item-divider-dashed`]: !!props.dashed,
      },
      props.className,
    );
    props.classString = classString;

    this.props = props;
    this.init();
  }

  init() {
    this.render({ ...this.props });
  }

  render({ classString, style }) {
    this.elDivider = this.createDivider(classString, style);
  }

  createDivider(className, style) {
    const elDivider = createElement("li", {
      attributes: { role: "separator" },
      className,
      styles: style,
    });

    return elDivider;
  }

  getElement() {
    return this.elDivider;
  }
}
