import elem from "../../../../core/utils/elem/elem";
import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";

export class Notification {
  constructor() {
    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("div", {
      class: "classroom-content grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 lg:gap-x-12 lg:p-10",
    });

    this.elHeader = elem("header", { class: "col-span-12 flex items-center gap-2 lg:gap-4" });

    this.elLabel = elem(
      "label",
      {
        for: "drawer-classroom",
        class: "btn btn-square btn-ghost drawer-button lg:hidden",
      },
      MtuIcon("menu"),
    );

    this.elHeader.apepnd(this.elLabel);

    this.elTitleWrapper = elem("div", { class: "grow" });
    this.elTitle = elem("h1", { class: "lg:text-2xl lg:font-light" }, this.title);
    this.elTitleWrapper.append(this.elTitle);
  }
}
