import elem from "../../../../core/utils/elem/elem";
import Stat from "./Stat";



export class StatConverter {
  constructor() {
    this.title = "통계";
    this.init();
  }

  init() {
    this.create();

  }

  create() {
    this.elThis = elem("div", {
      class: "classroom-content grid grid-cols-12 grid-rows-[min-content] gap-y-8 p-4 lg:gap-x-8 lg:p-10 hidden",
    });

    new Stat(this.elThis)
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
