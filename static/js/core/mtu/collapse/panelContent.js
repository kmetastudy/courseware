import { classNames } from "../../utils/class-names";
import { createElement } from "../../utils/dom-utils";

export class PanelContent {
  static displayName = "PanelContent";
  constructor(props, ref) {
    const { prefixCls, forceRender, className, style, children, isActive, role } = props;

    Object.assign(this, props);
    this.ref = ref;

    this.init();
  }

  init() {
    this.initVariable();

    this.create();
  }

  initVariable() {
    this.rendered = this.getRendered();
  }

  create() {
    const elContent = createElement("div", {
      className: classNames(
        `${this.prefixCls}-content`,
        {
          [`${this.prefixCls}-content-active`]: this.isActive,
          [`${this.prefixCls}-content-inactive`]: !this.isActive,
        },
        this.className,
      ),
      styles: this.style,
      attributes: {
        role: this.role,
        ref: this.ref,
      },
    });

    const elContentBox = createElement("div", {
      className: `${this.prefixCls}-content-box`,
    });

    if (this.children) {
      elContent.append(this.children);
    }

    elContent.append(elContentBox);
    return elContent;
  }

  getRendered(forceRender, isActive) {
    if (forceRender || isActive) {
      this.rendered = true;
    }
  }
}

export default PanelContent;
