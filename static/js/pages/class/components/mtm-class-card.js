import elem from "../../../core/utils/elem/elem";
import mtmAnchor from "./mtm-anchor";
import { classNames } from "../../../core/utils/class-names";

require("../../../../css/pages/class/components/mtm-class-card.css");
export default class MtmClassCard {
  constructor(options = {}) {
    this.options = options;
    this.elThis = elem("section", { class: "mtm-class-card" });
    this.elWrapper = elem("div", { class: "mtm-class-card-wrapper" });

    this.elThis.append(this.elWrapper);
  }

  createHeader({ rootClassname }) {
    return elem("div", { class: classNames(rootClassname, "mtm-class-card-header-title") });
  }

  createHeaderTitle({ rootClassname, title }) {
    elem("span", { class: classNames(rootClassname, "mtm-class-card-header-title") }, title);
  }

  /**
   *
   * @param {object} anchorConfig
   * @returns {HTMLAnchorElement}
   */
  createHeaderAnchor({ anchorConfig }) {
    return mtmAnchor(anchorConfig);
  }
}
