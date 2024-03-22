import elem from "../../../../../core/utils/elem/elem";

export class NotificationCard {
  constructor() {
    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = elem("section", { class: "card col-span-12 overflow-hidden bg-base-100 shadow-sm xl:col-span-4" });

    // Title
    this.elCardBody = elem("div", { class: "card-body grow-0" });
    this.elThis.append(this.elCardBody);

    this.elCardTitle = elem("h2", { class: "card-title" }, "공지사항");
    this.elCardBody.append(this.elCardTitle);

    this.elCardEmpty = elem("p", "등록된 공지사항이 없습니다.");
    this.elCardBody.append(this.elCardEmpty);
  }

  getElement() {
    return this.elThis;
  }

  updateData(data) {
    if (!data) {
      return;
    }

    this.data = data;
    return;
  }
}
