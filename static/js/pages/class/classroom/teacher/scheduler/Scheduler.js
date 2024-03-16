import elem from "../../../../core/utils/elem/elem";

import { AbstractContent } from "../AbstractContent";
import { ContentHeader } from "../ContentHeader";
import { MtmCalendar } from "./mtmCalendar";
import { classNames } from "../../../../core/utils/class-names";

export class Scheduler extends AbstractContent {
  constructor({ userId, classId }) {
    super({ userId, classId });
    // this.userId = userId;
    // this.classId = classId;

    this.title = "일정";
    this.init();
  }

  init() {
    this.create();
    this.initCalendar();
  }

  create() {
    this.elThis = elem("div", {
      class: "classroom-content grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 lg:gap-x-12 lg:p-10",
    });
    this.clHeader = new ContentHeader({ parent: this.elThis, title: this.title });

    this.elMembers = elem("section", {
      class: "scheduler-member card col-span-12 overflow-hidden bg-base-100 shadow-sm xl:col-span-3",
    });

    this.elCalendarCard = elem("section", {
      class: "card col-span-12 overflow-hidden bg-base-100 shadow-sm xl:col-span-9",
    });

    this.elCalendarCardBody = elem(
      "div",
      { class: "card-body grow-0" },
      elem("h2", { class: "card-title" }, "일정관리"),
      elem("a", { class: "link-hover link text-xs" }, "자세히보기"),
    );

    this.elCalendar = elem("div", { class: "scheduler-calendar p-4", id: "scheduler-calendar" });
    this.elCalendarCardBody.append(this.elCalendar);

    this.elCalendarCard.append(this.elCalendarCardBody);

    this.elThis.append(this.elMembers, this.elCalendarCard);
    // this.elThis.append(this.elCalendarCard);
  }

  initCalendar() {
    this.clCalendar = new MtmCalendar(this.elCalendar);
  }
}
