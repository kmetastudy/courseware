import elem from "../../../core/utils/elem/elem";

export class Profile {
  constructor() {
    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("div", { class: "dropdown-end dropdown z-10" });
    this.elAvatar = elem("div", { tabindex: "0", class: "avatar btn btn-circle btn-ghost" });
    this.elImgWrapper = elem("div", { class: "w-10 rounded-full" });
    //s
  }
}
