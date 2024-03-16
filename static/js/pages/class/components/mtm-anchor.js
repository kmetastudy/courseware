import elem from "../../../core/utils/elem/elem";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";

require("../../../../css/pages/class/components/mtm-anchor.css");

/**
 *
 * @param {string} text
 * @param {string} href
 * @param {object} attr
 * @returns
 */
export default function mtmAnchor({ text = "더보기", href = "#", ...attr }) {
  const anchor = elem("a", { class: "mtm-anchor", href: href, ...attr }, text, elem(MtuIcon("right")));

  return anchor;
}
