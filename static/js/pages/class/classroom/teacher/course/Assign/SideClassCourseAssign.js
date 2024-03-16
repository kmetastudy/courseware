import { isNumber, isHTMLNode } from "../../../../../core/utils/type";

import elem from "../../../../../core/utils/elem/elem";
import { MtuIcon } from "../../../../../core/mtu/icon/mtu-icon";
import { mtoEvents } from "../../../../../core/utils/mto-events";

import { extracts } from "../../../../../core/utils/array/extracts";

export class SideClassCourseAssign {
  constructor({ onSideItemClick }) {
    this.onSideItemClick = onSideItemClick;

    this.courseId = undefined;
    this.selectedItem = null;
    this.isActive = false;
    this.headerTitle = "뒤로가기";

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

    this.elMenu = elem("ul", { class: "menu" });
    this.elThis.append(this.elHeader, this.elTitle, this.elMenu);
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

    this.setTitle(courseTitle);
    this.setSchedulerMenu(schedulers);
  }

  setTitle(title) {
    this.elTitle.textContent = title;
  }

  setSchedulerMenu(schedulers) {
    const [startDate, endDate] = [schedulers.at(0)?.dateTitle, schedulers.at(-1)?.dateTitle];

    const totalPeriod = {
      period: 0,
      date: `${startDate}-${endDate}`,
      periodTitle: "전체",
      dateTitle: `${startDate} - ${endDate}`,
    };

    schedulers.unshift(totalPeriod);

    const elItems = schedulers.map((scheduler) => this.createMenuItem(scheduler));

    this.elMenu.append(...elItems);

    this.elItems = elItems;
  }

  composeSchedulers(classContentAssign) {
    const {
      json_data: { scheduler_list: schedulerList },
    } = classContentAssign;

    const schedulers = extracts(schedulerList, ["period", "date"]);

    const uniqueSchedulers = this.removeDuplicateObjects(schedulers);

    const result = uniqueSchedulers
      .filter((item) => isNumber(item.period))
      .map((assign) => {
        assign.periodTitle = `${assign.period} 차시`;
        assign.dateTitle = this.utcToLocalString(assign.date) ?? assign.date;
        return assign;
      });

    return result;
  }

  removeDuplicateObjects(array) {
    return [...new Map(array.map((obj) => [JSON.stringify(obj), obj])).values()];
  }

  createMenuItem(scheduler) {
    const { periodTitle, dateTitle } = scheduler;
    const elItem = elem("li", { on: { click: this.handleItemClick.bind(this, scheduler) } });

    const elTextWrapper = elem("a", { class: "grid-flow-row" });
    elItem.append(elTextWrapper);

    const elPeriod = elem("p", { class: "mb-0" }, periodTitle);
    const elDate = elem("p", { class: "mb-0 text-xs  font-bold text-base-content/50" }, dateTitle);
    elTextWrapper.append(elPeriod, elDate);

    return elItem;
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

  changeItemFocus(selectedItem) {
    this.elItems.forEach((elItem) => elItem.firstElementChild.classList.remove("focus"));

    selectedItem.firstElementChild.classList.add("focus");
  }

  getElement() {
    return this.elThis;
  }

  utcToLocalString(isoString, format = "YYYY-MM-DD") {
    return dayjs.utc(isoString).local().format(format);
  }
}
