import { isNumber, isHTMLNode } from "../../../../../core/utils/type";

import elem from "../../../../../core/utils/elem/elem";
import { MtuIcon } from "../../../../../core/mtu/icon/mtu-icon";
import { mtoEvents } from "../../../../../core/utils/mto-events";

import { extracts } from "../../../../../core/utils/array/extracts";

export class SideCourseAssign {
  constructor({ onSideItemClick, onTitleItemClick }) {
    this.onSideItemClick = onSideItemClick;
    this.onTitleItemClick = onTitleItemClick;

    this.courseId = undefined;
    this.selectedItem = null;
    this.isActive = false;
    this.headerTitle = "뒤로가기";
    this.elSubMenuItems = [];

    this.create();
  }

  create() {
    this.elThis = elem("nav", {
      class: "min-h-screen w-72 flex-col gap-2 overflow-x-hidden overflow-y-auto bg-base-100 px-6 py-10 hidden",
    });
    this.elHeader = elem(
      "div",
      { class: "mx-4 mb-8 flex items-center gap-2 font-black", style: "cursor:pointer;" },
      this.headerTitle,
    );

    const goBackIcon = MtuIcon("leftCircle", { style: { fontSize: "20px" } });
    this.elHeader.addEventListener("click", () => {
      window.history.back();
    });
    this.elHeader.prepend(goBackIcon);

    this.elTitle = elem("div", { class: "mx-4 mb-4 flex items-center gap-2 font-black" });
    this.elTitleButton = elem("button", {
      class: "btn btn-ghost btn-block justify-normal font-bold text-lg mb-4",
      on: { click: this.handleTitleItemClick.bind(this) },
    });

    this.elMenu = elem("ul", { class: "menu p-0" });
    // this.elThis.append(this.elHeader, this.elTitle, this.elMenu);
    this.elThis.append(this.elHeader, this.elTitleButton, this.elMenu);
  }

  activate() {
    this.elThis.classList.remove("hidden");
    this.isActive = true;
  }

  deactivate(context = {}) {
    this.elThis.classList.add("hidden");
    this.isActive = false;
  }

  updateData({ classContentAssign, course }) {
    const courseTitle = course.title;
    const schedulers = this.composeSchedulers(classContentAssign);
    console.log(schedulers);

    // this.setTitle(courseTitle);
    this.renderTitleButton(courseTitle);

    this.renderSchedulerMenu(schedulers);

    // initially, show all
    this.handleTitleItemClick();
  }

  setTitle(title) {
    this.elTitle.textContent = title;
  }

  renderTitleButton(title) {
    this.elTitleButton.textContent = title;
  }

  renderSchedulerMenu(schedulers) {
    // 전체보기 데이터 추가
    const firstChild = schedulers.find((scheduler) => scheduler.disabled === false).child.at(0);
    const lastChild = schedulers.findLast((scheduler) => scheduler.disabled === false).child.at(-1);

    let periodCount = 0;
    schedulers.forEach((scheduler) => {
      periodCount += scheduler.child.length;
    });

    // const fullScheduler = {
    //   title: "전체보기",
    //   date: `${firstChild.date} - ${lastChild.date}`,
    //   period: periodCount,
    //   isFull: true,
    // };

    console.log(schedulers);
    const elItems = schedulers.map((scheduler) => this.createMenuItem(scheduler));

    this.elMenu.append(...elItems);

    // this.elItems = elItems;
  }

  composeSchedulers(classContentAssign) {
    const {
      json_data: { scheduler_list: schedulerList },
    } = classContentAssign;

    const schedulers = extracts(schedulerList, ["period", "type", "date", "title", "show"]);

    const nestedSchedulers = this.composeNestedSchedulers(schedulers);

    const formattedScheduler = nestedSchedulers.map((scheduler) => this.formatScheduler(scheduler));

    return formattedScheduler;
  }

  composeNestedSchedulers(schedulers) {
    const nestedSchedulers = [];

    let currentPeriod = 0;

    const { length } = schedulers;

    for (let i = 0; i < length; i++) {
      const scheduler = schedulers[i];
      const { type, period, date } = scheduler;

      if (type === 0) {
        const title = scheduler.title;
        const child = [];
        nestedSchedulers.push({ title, child });

        currentPeriod = period;
        continue;
      }

      if (period !== currentPeriod && scheduler.show === true) {
        const title = `${period} 차시`;
        const dateTitle = this.utcToLocalString(date) ?? date;
        const branchCount = schedulers.filter((item) => item.date === date).length;

        nestedSchedulers.at(-1)?.child?.push({ title, date, dateTitle, period, branchCount });

        currentPeriod = period;
      }
    }

    return nestedSchedulers;
  }

  formatScheduler(scheduler) {
    const { child } = scheduler;
    if (child.length === 0) {
      scheduler.disabled = true;
      return scheduler;
    }

    const startDate = child.at(0)?.dateTitle;
    const endDate = child.at(-1)?.dateTitle;
    const period = child.length;

    let date;
    if (startDate && endDate) {
      date = `${startDate} - ${endDate}`;
    } else {
      date = "";
    }

    scheduler.disabled = false;
    scheduler.date = date;
    scheduler.period = period;

    return scheduler;
  }

  createMenuItem(scheduler) {
    const { title, child, disabled } = scheduler;

    if (child.length > 0 && disabled !== true) {
      const elItem = elem("li");

      const elDetails = elem("details");
      elItem.append(elDetails);

      const elSummary = elem("summary", title);
      const elSubMenuContainer = elem("ul");
      elDetails.append(elSummary, elSubMenuContainer);

      const elSubMenuItems = child.map((child) => this.createSubMenuItem(child));
      elSubMenuContainer.append(...elSubMenuItems);

      this.elSubMenuItems.push(...elSubMenuItems);

      return elItem;
    }

    const elItem = elem("li", { class: "disabled" });

    const elTitle = elem("a", { class: "grid-flow-row" }, title);
    elItem.append(elTitle);

    return elItem;
  }

  createSubMenuItem(childScheduler) {
    // 차시
    const { title, dateTitle } = childScheduler;

    const elSubMenu = elem("li", { on: { click: this.handleItemClick.bind(this, childScheduler) } });

    const elTextContainer = elem("a", { class: "grid-flow-row" });
    elSubMenu.append(elTextContainer);

    const elTitle = elem("p", { class: "mb-0" }, title);
    const elDate = elem("p", { class: "mb-0 text-xs font-bold text-base-content/50" }, dateTitle);
    elTextContainer.append(elTitle, elDate);

    return elSubMenu;
  }

  handleItemClick(scheduler, evt) {
    evt.stopPropagation();

    const selectedItem = evt.currentTarget;

    if (!isHTMLNode(selectedItem) || selectedItem === this.selectedItem) {
      return;
    }

    this.changeItemFocus(selectedItem);

    if (this.onSideItemClick) {
      this.onSideItemClick(scheduler);
    }
  }

  handleTitleItemClick(evt) {
    this.elTitleButton.classList.add("btn-active");
    this.changeItemFocus();
    if (this.onTitleItemClick) {
      this.onTitleItemClick();
    }
  }

  changeItemFocus(selectedItem) {
    this.elSubMenuItems.forEach((elItem) => elItem.firstElementChild.classList.remove("focus"));

    if (selectedItem) {
      this.elTitleButton.classList.remove("btn-active");
      selectedItem.firstElementChild.classList.add("focus");
    }
  }

  getElement() {
    return this.elThis;
  }

  utcToLocalString(isoString, format = "YYYY-MM-DD") {
    return dayjs.utc(isoString).local().format(format);
  }
}
