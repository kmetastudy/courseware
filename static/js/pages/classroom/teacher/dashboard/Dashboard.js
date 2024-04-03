import elem from "../../../../core/utils/elem/elem";

import { store } from "../Store";

import Stat from "../stat/Stat";

export class Dashboard {
  constructor() {
    this.title = "대시보드";
    this.init();
  }

  init() {
    this.userData = store.getState("userData");
    this.create();
  }

  create() {
    this.elThis = elem("div", {
      class: "classroom-content grid grid-cols-12 grid-rows-[min-content] gap-y-4 p-4 lg:gap-x-4 lg:p-10 hidden",
    });

    const name = this.userData?.full_name;
    new Stat(this.elThis, { name });
  }

  activate(context = {}) {
    this.elThis?.classList.remove("hidden");
    this.isActive = true;
  }

  deactivate(context = {}) {
    this.elThis?.classList.add("hidden");
    this.isActive = false;
  }

  getElement() {
    return this.elThis;
  }
}
