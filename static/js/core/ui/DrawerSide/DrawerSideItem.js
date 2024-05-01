import { Component } from "../../../shared/lib/components";
import { MtuIcon } from "../../mtu/icon/mtu-icon";

export class DrawerSideItem extends Component {
  /**
   * @deprecated currently not used
   * @param {object} param
   * @param {HTMLElement} param.target
   * @param {object} param.props
   * @param {string} param.props.text
   * @param {string} param.props.icon
   * @param {string} param.props.color
   * @param {object} param.props.on
   * @param {boolean} param.props.disabled
   */
  constructor({ target, props }) {
    super({ target, props });
  }

  template() {
    const { text, icon, child = [], on, disabled } = this.$props;
    const hasChild = child.length > 0;

    return `
      <li class="menu-item ${disabled ? "disabled" : ""}">
          ${hasChild ? `<h2 class="menu-title">${icon ? icon.outerHTML : ""}${text}</h2>` : `<a>${text}</a>`}
          ${hasChild}
      </li>
    `;
  }

  render() {
    return this.template();
  }

  createItem({ text, icon, child = [], on, disabled }) {
    const hasChild = child.length > 0;

    return `
      <li class="menu-item ${disabled ? "disabled" : ""}">
          ${hasChild ? `<h2 class="menu-title">${icon ? icon.outerHTML : ""}${text}</h2>` : `<a>${text}</a>`}
          ${hasChild ? `<ul>${child.map((item) => this.createItem(item)).join("")}</ul>` : ""}
      </li>
    `;
  }
}
