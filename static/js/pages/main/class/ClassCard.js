import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
import elem from "../../../core/utils/elem/elem";

export class ClassCard {
  constructor({ id, title, memberNum, onClick }) {
    this.id = id;
    this.title = title;
    this.memberNum = memberNum;
    this.onClick = onClick;
    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("section", {
      class: "card card-bordered col-span-12 bg-base-100 shadow-sm lg:col-span-6 xl:col-span-4",
    });

    this.elBody = elem("div", { class: "card-body items-center text-center" });

    this.elTitle = elem("h2", { class: "card-title" }, this.title);

    this.elInformationWrapper = elem("div", { class: "flex justify-content" });

    this.elMemberNum = elem(
      "span",
      { class: "text-sm text-neutral-content" },
      MtuIcon("user"),
      ` ${this.memberNum} 명`,
    );
    this.elInformationWrapper.append(this.elMemberNum);

    this.elButtonWrapper = elem("div", { class: "card-actions" });
    this.elRedirectButton = elem(
      "button",
      { class: "btn btn-sm", on: { click: this.handleClick.bind(this) } },
      "바로가기",
    );
    this.elButtonWrapper.append(this.elRedirectButton);

    this.elBody.append(this.elTitle, this.elInformationWrapper, this.elButtonWrapper);

    this.elThis.append(this.elBody);
  }

  handleClick(evt) {
    evt.stopPropagation();

    if (this.onClick) {
      this.onClick(this.id);
    }
  }

  getElement() {
    return this.elThis;
  }
}
