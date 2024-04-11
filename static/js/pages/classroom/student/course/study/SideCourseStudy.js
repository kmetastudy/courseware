import { isNumber, isHTMLNode } from "../../../../../core/utils/type";
import { TextOverflowTooltip } from "../../../../../core/component/FloatingUI/TextOverflowTooltip/TextOverflowTooptip";
import { extract, extracts } from "../../../../../core/utils/array";
import elem from "../../../../../core/utils/elem/elem";

import { MtuIcon } from "../../../../../core/mtu/icon/mtu-icon";

export class SideCourseStudy {
  static TYPE_CONTENT_KOR = {
    0: "챕터",
    11: "테스트",
    12: "레슨",
    13: "시험",
  };

  static TYPE_ELEMENT_STRING = {
    video: "v",
    question: "q",
  };

  constructor({ onSideItemClick }) {
    this.onSideItemClick = onSideItemClick;

    this.courseId = undefined;
    this.selectedItem = null;
    this.isActive = false;
    this.headerTitle = "뒤로가기";

    this.elItems = null;
    this.elContentItems = [];

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

    this.elMenu = elem("ul", { class: "menu menu-sm" });
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

  updateData({ studyResult, course }) {
    const courseTitle = course.title;
    const schedulers = this.composeSchedulers(studyResult);
    // const {
    //   json_data: { property },
    // } = studyResult;

    this.setTitle(courseTitle);

    this.renderMenu(schedulers);
  }

  setTitle(title) {
    this.elTitle.textContent = title;
  }

  composeSchedulers(studyResult) {
    const {
      json_data: { property: schedulerList },
    } = studyResult;

    // const schedulers = extracts(schedulerList, ["id", "period", "type", "date", "title", "show"]);

    const nestedSchedulers = this.composeNestedSchedulers(schedulerList);

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

      // chapter
      if (type === 0) {
        const title = scheduler.title;
        const child = [];
        nestedSchedulers.push({ title, child });

        currentPeriod = period;
        continue;
      }

      // 차시
      if (period !== currentPeriod) {
        const title = `${period} 차시`;
        const dateTitle = this.utcToLocalString(date) ?? date;
        const branchCount = schedulers.filter((item) => item.date === date).length;

        nestedSchedulers.at(-1)?.child?.push({ title, date, dateTitle, period, branchCount, child: [] });

        currentPeriod = period;
      }

      // branch
      const id = scheduler.id;
      const title = scheduler.title;
      const typeString = SideCourseStudy.TYPE_CONTENT_KOR[type];
      const typeTitle = typeString ? `유형: ${typeString}` : "";

      nestedSchedulers
        .at(-1)
        ?.child?.at(-1)
        ?.child?.push({ ...scheduler, typeTitle });
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

  renderMenu(schedulers) {
    this.elChapters = [];
    this.elPeriods = [];
    this.elBranches = [];

    const elChapters = schedulers.map((scheduler) => this.createChapter(scheduler));

    this.elMenu.append(...elChapters);

    this.elChapters = elChapters;
  }

  createChapter(scheduler) {
    const { title, child, disabled } = scheduler;

    if (child.length > 0 && disabled !== true) {
      const elChapter = elem("li", { on: { click: this.handleToggle.bind(this) } });

      const elTitle = elem("span", { class: "menu-dropdown-toggle" }, title);

      const elPeriodContainer = elem("ul", { class: "menu-dropdown" });

      elChapter.append(elTitle, elPeriodContainer);

      const elPeriods = child.map((child) => this.createPeriod(child));
      elPeriodContainer.append(...elPeriods);

      this.elPeriods = elPeriods;

      return elChapter;
    }
  }

  createPeriod(periodData) {
    const { title, dateTitle, child, disabled } = periodData;
    if (child.length > 0 && disabled !== true) {
      const elPeriod = elem("li", { on: { click: this.handleToggle.bind(this) } });

      const elToggle = elem("span", { class: "menu-dropdown-toggle" });

      const elTitleContainer = elem("a", { class: "grid-flow-row" });
      elToggle.append(elTitleContainer);

      const elPeriodTitle = elem("p", { class: "mb-0" }, title);
      const elDateTitle = elem("p", { class: "mb-0 text-xs  font-bold text-base-content/50" }, dateTitle);
      elTitleContainer.append(elPeriodTitle, elDateTitle);

      const elBranchContainer = elem("ul", { class: "menu-dropdown" });

      elPeriod.append(elToggle, elBranchContainer);

      const elBranches = child.map((child) => this.createBranch(child));

      elBranchContainer.append(...elBranches);

      this.elBranches = elBranches;

      return elPeriod;
    }

    const elPeriod = elem("li");

    const elTitle = elem("a", { class: "grid-flow-row" });
    elPeriod.append(elTitle);

    const elPeriodTitle = elem("p", { class: "mb-0 text-sm" }, title);
    const elDateTitle = elem("p", { class: "mb-0 text-xs  font-bold text-base-content/50" }, dateTitle);
    elTitle.append(elPeriodTitle, elDateTitle);

    return elPeriod;
  }

  createBranch(branchData) {
    const { title, typeTitle } = branchData;

    const elBranch = elem("li", { on: { click: this.handleItemClick.bind(this, branchData) } });

    const elTitleContainer = elem("a", { class: "grid-flow-row" });
    elBranch.append(elTitleContainer);

    const elTitle = elem("p", { class: "mb-0 text-sm overflow-hidden whitespace-nowrap text-ellipsis" }, title);
    const elTypeTitle = elem("p", { class: "mb-0 text-xs  font-bold text-base-content/50" }, typeTitle);
    elTitleContainer.append(elTitle, elTypeTitle);

    TextOverflowTooltip({ targetElement: elBranch, textElement: elTitle, content: title });

    return elBranch;
  }

  // createContentItem(content) {
  //   const { title, type: contentType, units } = content;

  //   const elContentItem = elem("li", { on: { click: this.handleItemClick.bind(this, content) } });

  //   const elContainer = elem("a", { class: "flex flex-col" });
  //   elContentItem.append(elContainer);

  //   const elTextContainer = elem("div", { class: "overflow-hidden" });
  //   elContainer.append(elTextContainer);

  //   const elContentTitle = elem("span", { class: "text-ellipsis text-xs" }, title);

  //   const infoText = this.composeInfoText(contentType, units);
  //   const elContentInfo = elem("span", { class: "text-ellipsis text-xs" }, infoText);
  //   elTextContainer.append(elContentTitle, elContentInfo);
  //   // elContainer.append(elContentTitle, elContentInfo);

  //   this.elContentItems.push(elContentItem);

  //   return elContentItem;

  //   //
  // }

  // composeInfoText(contentType, units) {
  //   const contentTypeString = this.formatContentType(contentType);

  //   const elementTypes = extract(units, "type").flat();

  //   const questionNum = this.countQuestion(elementTypes);
  //   const videoNum = this.countVideo(elementTypes);

  //   let infoText = `유형: ${contentTypeString}`;

  //   if (questionNum) {
  //     infoText += ` 문제: ${questionNum}`;
  //   }

  //   if (videoNum) {
  //     infoText += ` 비디오: ${videoNum}`;
  //   }

  //   return infoText;
  // }

  handleItemClick(content, evt) {
    evt.stopPropagation();

    const selectedItem = evt.currentTarget;

    if (!isHTMLNode(selectedItem) || selectedItem === this.selectedItem) {
      return;
    }

    this.changeItemFocus(selectedItem);

    if (this.onSideItemClick) {
      this.onSideItemClick(content);
    }
  }

  handleToggle(evt) {
    evt.stopPropagation();

    const target = evt.currentTarget;

    for (const child of target.children) {
      child.classList.toggle("menu-dropdown-show");
    }
  }

  changeItemFocus(selectedItem) {
    // this.elItems.forEach((elItem) => elItem.firstElementChild.classList.remove("focus"));
    // this.elContentItems.forEach((elItem) => elItem.firstElementChild.classList.remove("focus"));
    // selectedItem.firstElementChild.classList.add("focus");
  }

  getElement() {
    return this.elThis;
  }

  // ========= utils =========
  utcToLocalString(isoString, format = "YYYY-MM-DD") {
    return dayjs.utc(isoString).local().format(format);
  }

  formatContentType(type) {
    return SideCourseStudy.TYPE_CONTENT_KOR[type] ?? "콘텐츠";
  }

  countVideo(types) {
    return types.filter((type) => type === SideCourseStudy.TYPE_ELEMENT_STRING.video).length;
  }

  countQuestion(types) {
    return types.filter((type) => type === SideCourseStudy.TYPE_ELEMENT_STRING.video).length;
  }
}
