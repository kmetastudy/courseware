import elem from "../../../../core/utils/elem/elem";

import { ContentHeader } from "../../components/ContentHeader";
import { SchedulerCalendar } from "./SchedulerCalendar";
import { store } from "../Store";
export class Scheduler {
  constructor() {
    this.isActive = false;
    this.title = "일정";
    this.init();
  }

  init() {
    this.getData();

    this.create();

    this.initCalendar();
  }

  getData() {
    this.studyResultData = store.getState("studyResultData");
  }

  create() {
    this.elThis = elem("div", {
      class: "classroom-content grid grid-cols-12 grid-rows-[min-content] gap-y-12 p-4 lg:gap-x-12 lg:p-10",
    });
    this.clHeader = new ContentHeader({ parent: this.elThis, title: this.title });

    this.elMembers = elem("section", {
      class: "scheduler-member card col-span-12 overflow-hidden bg-base-100 shadow-sm xl:col-span-3",
    });
    this.elThis.append(this.elMembers);

    this.elCard = elem("section", {
      class: "card col-span-12 overflow-hidden bg-base-100 shadow-sm xl:col-span-9",
    });
    this.elThis.append(this.elCard);

    this.elCardBody = elem(
      "div",
      { class: "card-body grow-0" },
      elem("h2", { class: "card-title" }, "일정관리"),
      elem("a", { class: "link-hover link text-xs" }, "자세히보기"),
    );
    this.elCard.append(this.elCardBody);

    // Calendar
    this.elCalendarWrapper = elem("div", { class: "overflow-x-auto grid grid-cols-12 grid-rows-[min-content]" });
    this.elCard.append(this.elCalendarWrapper);

    this.elCalendar = elem("div", { class: "col-span-12", id: "scheduler-calendar" });
    this.elCalendarWrapper.append(this.elCalendar);
  }

  initCalendar() {
    this.clCalendar = new SchedulerCalendar(this.elCalendar);
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
