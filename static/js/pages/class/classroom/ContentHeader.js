import elem from "../../../core/utils/elem/elem";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
import { Notification } from "./Notification";

export class ContentHeader {
  constructor({ parent, title = "Dashboard", placeholder = "Search" } = {}) {
    this.parentElement = parent;
    this.placeholder = placeholder;
    this.title = title;

    this.create();
    this.parentElement.append(this.elThis);
  }

  create() {
    this.elThis = elem("header", { class: "col-span-12 flex items-center gap-2 lg:gap-4" });
    this.elLabel = elem(
      "label",
      {
        for: "drawer-classroom",
        class: "btn btn-square btn-ghost drawer-button lg:hidden",
      },
      MtuIcon("menu"),
    );

    this.elTitleWrapper = elem("div", { class: "grow" });
    this.elTitle = elem("h1", { class: "lg:text-2xl lg:font-light" }, this.title);
    this.elTitleWrapper.append(this.elTitle);

    this.elSearch = elem(
      "div",
      elem("input", { type: "text", placeholder: this.placeholder, class: "input input-sm rounded-full max-sm:w-24" }),
    );

    this.elThis.append(this.elLabel, this.elTitleWrapper, this.elSearch);

    this.clNotification = new Notification({ parent: this.elThis });
  }

  setTitle(title) {
    if (title === this.title) {
      return;
    }

    this.title = title;
    this.elTitle.textContent = title;
  }
}
