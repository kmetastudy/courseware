import { config, itemConfig } from "./config";
import { adjustConfig } from "../_util/adjust-config";
import { MtuIcon } from "../icon/mtu-icon";

require("./mtu-breadcrumb.css");
export class MtuBreadcrumb {
  constructor(options) {
    this.options = adjustConfig(config, options);
    this.separator = this.options.separator; // "/", ">", ":"

    this.elItems = [];
    this.itemOptions = this.validateItemConfig(itemConfig, this.options.items);

    this.init();
  }

  validateItemConfig(defaultConfig, items) {
    const validatedItems = [];

    if (items[items.length - 1].type === "separator") {
      items.pop();
    }

    items.forEach((config, i) => {
      const item = adjustConfig(defaultConfig, config);

      if (item.type !== "separator") {
        validatedItems.push(item);
      }

      if (i < items.length - 1) {
        if (items[i + 1].type === "separator") {
          validatedItems.push(items[i + 1]);
        } else {
          validatedItems.push({ type: "separator", separator: this.separator });
        }
      }
    });

    return validatedItems;
  }

  init() {
    this.render();
  }

  render() {
    this.elBreadcrumb = document.createElement("nav");
    this.elBreadcrumb.className = "mtu-breadcrumb";

    this.itemsWrapper = document.createElement("ol");
    this.elBreadcrumb.appendChild(this.itemsWrapper);

    this.createItems(this.itemOptions);
  }

  createItems(itemOptions) {
    itemOptions.forEach((itemOption) => {
      const elItem =
        itemOption.type === "separator" ? this.createSeparator(itemOption) : this.createLinkItem(itemOption);

      this.itemsWrapper.appendChild(elItem);
      this.elItems.push(elItem);
    });
  }

  createSeparator(separatorOptions) {
    const elSeparator = document.createElement("li");
    elSeparator.className = "mtu-breadcrumb-separator";
    elSeparator.setAttribute("aria-hidden", "true");
    elSeparator.textContent = separatorOptions.separator;

    return elSeparator;
  }

  // common link item;
  createLinkItem(itemConfig) {
    const elItemWrapper = document.createElement("li");

    const itemTagName = itemConfig.href ? "a" : "span";
    const elItem = document.createElement(itemTagName);
    elItem.classList.add("mtu-breadcrumb-link");
    this.applyItemConfig(elItem, itemConfig);

    elItemWrapper.appendChild(elItem);
    return elItemWrapper;
  }

  /**
   *
   * @param {HTMLElement} item
   * @param {Object} config
   */
  applyItemConfig(item, config) {
    config.className ? item.classList.add(config.className) : null;
    config.href ? item.setAttribute("href", config.href) : null;

    if (config.icon) {
      const iconElement = MtuIcon(config.icon);

      const elTitle = document.createElement("span");
      elTitle.textContent = config.title;

      item.appendChild(iconElement);
      item.appendChild(elTitle);
    } else {
      item.textContent = config.title;
    }
  }

  getElement() {
    return this.elBreadcrumb;
  }
}

// separator = ">";
// items = [{ title: "title" }, { title: "hello?", url: "", icon: "" }, { type: "separator", separator: ":" }];

// item = {
//   className,
//   href,
//   path,
//   onClick,
//   title,
//   icon,
//   path,
// };
