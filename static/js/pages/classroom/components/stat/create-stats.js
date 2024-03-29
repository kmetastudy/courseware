import { isHTMLNode, isFalsy } from "../../../../core/utils/type";
import elem from "../../../../core/utils/elem/elem";
import { classNames } from "../../../../core/utils/class-names";

export function createStats() {
  function addChild(parent, child) {
    if (!isHTMLNode(parent) || isFalsy(child)) {
      return;
    }

    isHTMLNode(child) ? parent.append(child) : (parent.textContent = child);
    return parent;
  }

  function createItem({ rootCls, class: className, child, ...rest } = {}) {
    const cls = classNames(rootCls, className);

    const elItem = elem("div", { class: cls, ...rest });
    addChild(elItem, child);

    return elItem;
  }

  const Stats = {
    Root(attributes = {}) {
      const elRoot = createItem({ rootCls: "stats", ...attributes });
      return elRoot;
    },

    Stat(attributes = {}) {
      const elStat = createItem({ rootCls: "stat", ...attributes });
      return elStat;
    },

    Title(attributes = {}) {
      const elTitle = createItem({ rootCls: "stat-title", ...attributes });
      return elTitle;
    },

    Value(attributes = {}) {
      const elValue = createItem({ rootCls: "stat-value", ...attributes });
      return elValue;
    },

    Desc(attributes = {}) {
      const elDesc = createItem({ rootCls: "stat-desc", ...attributes });
      return elDesc;
    },

    Figure(attributes = {}) {
      const elFigure = createItem({ rootCls: "stat-figure", ...attributes });
      return elFigure;
    },

    Actions(attributes = {}) {
      const elFigure = createItem({ rootCls: "stat-actions", ...attributes });
      return elFigure;
    },
  };

  return Stats;
}
