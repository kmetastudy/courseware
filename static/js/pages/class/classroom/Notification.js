import elem from "../../../core/utils/elem/elem";
import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
export class Notification {
  constructor({ parent }) {
    this.parentElement = parent;
    this.init();
  }

  init() {
    this.create();

    if (this.parentElement) {
      this.parentElement.append(this.elThis);
    }
  }

  create() {
    this.elThis = elem("div", { class: "dropdown dropdown-end z-10" });
    this.elIndicatorWrapper = elem("div", { tabindex: "0", class: "btn btn-circle btn-ghost" });
    this.elIndicator = elem("div", { class: "indicator" });
    this.elBadge = elem("span", { class: "badge indicator-item badge-error badge-xs" });
    this.elIcon = MtuIcon("bell", { style: { fontSize: "20px" } });
    this.elIcon.classList.add("h-5");
    this.elIcon.classList.add("w-5");

    this.elContents = elem("ul", {
      tabindex: "0",
      class: "menu dropdown-content mt-3 w-80 rounded-box bg-base-100 p-2 shadow-2xl",
    });

    this.elThis.append(this.elIndicatorWrapper, this.elContents);
    this.elIndicatorWrapper.append(this.elIndicator);
    this.elIndicator.append(this.elBadge, this.elIcon);
  }

  //
}
