import elem from "../../../../core/utils/elem/elem";
import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";

export class CourseEmpty {
  constructor() {
    this.title = "코스가 없습니다";
    this.suggest = "다음이 필요하신가요?";
    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("section", {
      class: "hero col-span-12 bg-base-100 hidden",
    });

    this.elContent = elem("div", {
      class: "hero-content flex-col",
    });
    this.elThis.append(this.elContent);

    this.elWrapper = elem("div", {
      class: "max-w-md",
    });
    this.elContent.append(this.elWrapper);

    this.elTitle = elem("h1", { class: "text-xl font-bold" }, this.title);
    this.elIllustration = MtuIcon("EmptyBox", { style: { fontSize: "64px" } });
    this.elDivider = elem("div", { class: "divider" });
    this.elSuggest = elem("p", this.suggest);

    this.elContent.append(this.elTitle, this.elIllustration, this.elDivider, this.elSuggest);
  }

  getElement() {
    return this.elThis;
  }

  activate() {
    this.elThis.classList.add("activate");
  }

  deactivate() {
    this.elThis.classList.add("deactivate");
  }
}
