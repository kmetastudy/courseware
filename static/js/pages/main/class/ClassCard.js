import { MtuIcon } from "../../../core/mtu/icon/mtu-icon";
import elem from "../../../core/utils/elem/elem";

export class ClassCard {
  // id, title, member, thumbnail, school, grade, semester, subject, date
  constructor({ data, onClick } = {}) {
    this.data = data;
    this.onClick = onClick;

    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("section", {
      class:
        "card card-compact card-bordered col-span-12 bg-base-100 shadow-lg md:col-span-6 xl:col-span-4 2xl:col-span-3",
    });

    if (this.data?.thumbnail) {
      const thumbnail = this.data.thumbnail;
      this.elFigure = elem("figure");
      this.elThis.append(this.elFigure);

      this.elThumbnail = elem("img", { src: `/static/img/thumnail/${thumbnail}.png` });
      this.elFigure.append(this.elThumbnail);
    }

    this.elBadgeContainer = elem("div", { class: "flex flex-wrap justify-around items-center gap-2" });
    this.elThis.append(this.elBadgeContainer);

    const elBadges = this.createBadges(this.data);
    if (Array.isArray(elBadges) && elBadges.length > 0) {
      this.elBadgeContainer.append(...elBadges);
    }

    this.elBody = elem("div", { class: "card-body items-center" });

    this.elTitle = elem("h2", { class: "card-title" }, this.data.title ?? "클래스");

    this.elInformationWrapper = elem("div", { class: "flex flex-col gap-2 justify-content" });

    this.elMember = elem("span", { class: "text-sm" }, MtuIcon("user"), ` ${this.data.member} 명`);

    this.elInformationWrapper.append(this.elMember);

    if (this.data.date) {
      this.elDate = elem("span", { class: "text-sm" }, MtuIcon("calendar"), ` ${this.data.date}`);
      this.elInformationWrapper.append(this.elDate);
    }

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

  createBadges({ school, grade, semester, subject }) {
    const elBadges = [];
    for (let [key, value] of Object.entries({ school, grade, semester, subject })) {
      if (value) {
        const elBadge = elem("div", { class: "badge badge-outline" }, value);
        elBadges.push(elBadge);
      }
    }

    return elBadges;
  }

  handleClick(evt) {
    evt.stopPropagation();

    if (this.onClick) {
      this.onClick(this.data.id);
    }
  }

  getElement() {
    return this.elThis;
  }
}
