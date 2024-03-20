import { isNumber, isHTMLNode } from "../../../../../core/utils/type";

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
    const {
      properties: { property },
    } = studyResult;

    this.setTitle(courseTitle);

    this.renderMenu(schedulers, property);
  }

  setTitle(title) {
    this.elTitle.textContent = title;
  }

  composeSchedulers(studyResult) {
    const {
      properties: { property: schedulerList },
    } = studyResult;

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

  renderMenu(schedulers, property) {
    const elItems = schedulers.map((scheduler) => this.createMenuItem(scheduler, property));

    this.elMenu.append(...elItems);

    this.elItems = elItems;
  }

  createMenuItem(scheduler, property) {
    const { periodTitle, dateTitle, period, date } = scheduler;
    const elItem = elem("li");

    const elContainer = elem("details");
    elItem.append(elContainer);

    const elSummary = this.createSummaryItem(periodTitle, dateTitle);

    // Submenu
    const elSubMenu = elem("ul");

    const contents = property.filter((data) => data.period === period && data.show === true);

    const elContents = contents.map((content) => this.createContentItem(content));

    elSubMenu.append(...elContents);

    elContainer.append(elSummary, elSubMenu);

    return elItem;
  }

  createSummaryItem(periodTitle, dateTitle) {
    const elSummary = elem("summary");

    const elTextContainer = elem("a");
    elSummary.append(elTextContainer);

    const elPeriod = elem("p", { class: "mb-0" }, periodTitle);
    const elDate = elem("p", { class: "mb-0 text-xs  font-bold text-base-content/50" }, dateTitle);
    elTextContainer.append(elPeriod, elDate);

    return elSummary;
  }

  createContentItem(content) {
    const { title, type: contentType, units } = content;

    const elContentItem = elem("li", { on: { click: this.handleItemClick.bind(this, content) } });

    const elContainer = elem("a", { class: "flex flex-col" });
    elContentItem.append(elContainer);

    const elTextContainer = elem("div", { class: "overflow-hidden" });
    elContainer.append(elTextContainer);

    const elContentTitle = elem("span", { class: "text-ellipsis text-xs" }, title);

    const infoText = this.composeInfoText(contentType, units);
    const elContentInfo = elem("span", { class: "text-ellipsis text-xs" }, infoText);
    elTextContainer.append(elContentTitle, elContentInfo);
    // elContainer.append(elContentTitle, elContentInfo);

    return elContentItem;

    //
  }

  composeInfoText(contentType, units) {
    const contentTypeString = this.formatContentType(contentType);

    const elementTypes = extract(units, "type").flat();

    const questionNum = this.countQuestion(elementTypes);
    const videoNum = this.countVideo(elementTypes);

    let infoText = `유형: ${contentTypeString}`;

    if (questionNum) {
      infoText += ` 문제: ${questionNum}`;
    }

    if (videoNum) {
      infoText += ` 비디오: ${videoNum}`;
    }

    return infoText;
  }

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

  changeItemFocus(selectedItem) {
    this.elItems.forEach((elItem) => elItem.firstElementChild.classList.remove("focus"));

    selectedItem.firstElementChild.classList.add("focus");
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
