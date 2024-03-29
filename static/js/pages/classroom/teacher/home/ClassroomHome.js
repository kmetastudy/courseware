import elem from "../../../../core/utils/elem/elem";

import { store } from "../../student/Store";
import { apiClass } from "../../../../core/api/class";

import { MtuIcon } from "../../../../core/mtu/icon/mtu-icon";
import { StatCard } from "./status/StatCard";
import { TodayStudyStatus } from "./status/TodayStudyStatus";

export class ClassroomHome {
  constructor() {
    this.isActive = false;

    this.init();
  }

  init() {
    this.create();

    // for test
    this.render();
  }

  create() {
    this.elThis = elem("div", {
      class:
        "class-home classroom-content grid grid-cols-12 grid-rows-[min-content] gap-y-8 p-4 lg:gap-x-12 lg:p-10 hidden",
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

    this.elTitleWrapper = elem("div", { class: "grow" });
    this.elTitle = elem("h1", { class: "lg:text-2xl lg:font-light" }, this.title);

    this.elTitleWrapper.append(this.elTitle);
    this.elHeader.append(this.elLabel, this.elTitleWrapper);

    // Stat
    this.elStatContainer = elem("section", { class: "col-span-12 grid gap-4 xl:col-span-4" });
    this.elThis.append(this.elStatContainer);

    this.clMemberCountCard = new StatCard({ title: "사용자수" });
    this.elMemberCountCard = this.clMemberCountCard.getElement();

    this.clStartDateCard = new StatCard({ title: "시작일" });
    this.elStartDateCard = this.clStartDateCard.getElement();

    this.clEndDateCard = new StatCard({ title: "종료일" });
    this.elEndDateCard = this.clEndDateCard.getElement();

    this.elStatContainer.append(this.elMemberCountCard, this.elStartDateCard, this.elEndDateCard);

    // Tody Study Status
    this.clTodayStudyStatus = new TodayStudyStatus({ rootClassName: "col-span-12 shadow-sm xl:col-span-8" });
    this.elTodayStudyStatus = this.clTodayStudyStatus.getElement();
    this.elThis.append(this.elTodayStudyStatus);
  }

  activate() {
    console.log("activate home");
    this.elThis.classList.remove("hidden");
    this.isActive = true;
  }

  deactivate() {
    this.elThis.classList.add("hidden");
    this.isActive = false;
  }

  render() {
    this.renderMemberCountCard();
    this.renderStartDateCard();
    this.renderEndDateCard();

    this.renderTodayStudyStatus();
  }

  renderMemberCountCard() {
    this.clMemberCountCard.render({ value: "2명" });
  }

  renderStartDateCard() {
    this.clStartDateCard.render({ value: "2021-09-01" });
  }

  renderEndDateCard() {
    this.clEndDateCard.render({ value: "2021-12-31" });
  }

  renderTodayStudyStatus() {
    this.clTodayStudyStatus.render(2, 1);
  }

  getElement() {
    return this.elThis;
  }
}
