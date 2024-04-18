import { isArray, isHTMLNode } from "../../../../../core/utils/type";
import { classNames } from "../../../../../core/utils/class-names";
import { TextOverflowTooltip } from "../../../../../core/component/FloatingUI/TextOverflowTooltip/TextOverflowTooptip";
import { removeChildNodes } from "../../../../../core/utils/dom";
import { CourseStudyModel } from "./CourseStudyModel";
import elem from "../../../../../core/utils/elem/elem";
import { mtoEvents } from "../../../../../core/utils/mto-events";

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
    this.model = new CourseStudyModel();
    this.onSideItemClick = onSideItemClick;

    this.chapterNodeMap = null;
    this.branchNodeMap = null;

    this.courseId = undefined;
    this.selectedItem = null;
    this.isActive = false;
    this.headerTitle = "뒤로가기";

    this.elItems = null;

    this.create();
    this.initEvents();
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

  initEvents() {
    mtoEvents.on("onClassStudyResultUpdate", this.handleUpdate.bind(this));
    mtoEvents.on("OnChangeProgressPoint", this.handleChangeProgressPoint.bind(this));
  }

  handleUpdate(studyResult) {
    this.model.setState({ studyResult });
  }

  handleChangeProgressPoint({ point, progress, content_id } = {}) {
    const contentId = content_id;
    if (!this.branchNodeMap.has(contentId)) {
      return;
    }

    const elBranch = this.branchNodeMap.get(contentId);
    const elBranchTitle = elBranch.querySelector(".branch-title");
    const elInfoTitle = elBranch.querySelector(".branch-info");

    elInfoTitle.textContent = `진행도: ${progress ?? 0}% | 점수: ${point ?? 0}점`;

    if (progress === 100) {
      elBranchTitle.classList.add("bg-neutral-content");
    }
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
    this.chapterNodeMap = new Map();
    this.branchNodeMap = new Map();

    this.model.setState({ studyResult });
    this.model.setState({ course });

    const courseTitle = course.title;
    this.setTitle(courseTitle);

    const schedulers = this.model.composeSchedulers(studyResult);

    console.log("schedulers: ", schedulers);

    this.renderMenu(schedulers);

    const todayProperties = this.model.getTodayProperties();
    const todayChapters = this.model.getTodayChapters();
    const todayChapter = todayChapters[0];
    const todayPeriod = this.model.getTodayPeriod();

    if (this.hasTodayStudy(todayProperties)) {
      this.openTodayMenu(todayChapter, todayPeriod);
      this.startTodayStudy(todayProperties);
    }
  }

  setTitle(title = "") {
    this.elTitle.textContent = title;
  }

  renderMenu(schedulers) {
    removeChildNodes(this.elMenu);

    const elChapters = [];
    schedulers.forEach((scheduler) => {
      const elChapter = this.createChapter(scheduler);
      elChapters.push(elChapter);
      this.chapterNodeMap.set(scheduler.id, elChapter);
    });

    this.elMenu.append(...elChapters);
  }

  createChapter(scheduler) {
    const { title, child, disabled, completed } = scheduler;

    if (child.length > 0 && disabled !== true) {
      const elChapter = elem("li", {
        on: { click: this.handleToggle.bind(this) },
      });

      const elTitle = elem(
        "span",
        { class: classNames("menu-dropdown-toggle", { "bg-neutral-content": completed }) },
        title,
      );

      const elPeriodContainer = elem("ul", { class: "menu-dropdown" });

      elChapter.append(elTitle, elPeriodContainer);

      const elPeriods = child.map((child) => this.createPeriod(child));
      elPeriodContainer.append(...elPeriods);

      return elChapter;
    }

    const elChapter = elem("li", { class: "disabled" });
    const elTitle = elem("a", title);

    elChapter.append(elTitle);

    return elChapter;
  }

  createPeriod(periodData) {
    const { title, dateTitle, child, disabled, completed, period } = periodData;
    if (child.length > 0 && disabled !== true) {
      const elPeriod = elem("li", {
        "data-period": period,
        on: { click: this.handleToggle.bind(this) },
      });

      const elToggle = elem("span", { class: classNames("menu-dropdown-toggle", { "bg-neutral-content": completed }) });

      const elTitleContainer = elem("a", { class: "grid-flow-row" });
      elToggle.append(elTitleContainer);

      const elPeriodTitle = elem("p", { class: "mb-0" }, title);
      const elDateTitle = elem("p", { class: "mb-0 text-xs font-bold" }, dateTitle);
      elTitleContainer.append(elPeriodTitle, elDateTitle);

      const elBranchContainer = elem("ul", { class: "menu-dropdown" });

      elPeriod.append(elToggle, elBranchContainer);

      const elBranches = child.map((child) => this.createBranch(child));

      elBranchContainer.append(...elBranches);

      return elPeriod;
    }

    const elPeriod = elem("li", { "data-period": period });

    const elTitle = elem("a", { class: "grid-flow-row" });
    elPeriod.append(elTitle);

    const elPeriodTitle = elem("p", { class: "mb-0 text-sm" }, title);
    const elDateTitle = elem("p", { class: "mb-0 text-xs font-bold" }, dateTitle);
    elTitle.append(elPeriodTitle, elDateTitle);

    return elPeriod;
  }

  createBranch(branchData) {
    const { title, typeTitle, progress, point, completed, id } = branchData;

    const elBranch = elem("li", {
      class: "py-1",
      on: { click: this.handleItemClick.bind(this, branchData) },
    });

    // const elTitleContainer = elem("a", { class: "grid-flow-row" });
    const elTitleContainer = elem("a", {
      class: classNames("branch-title grid-flow-row", { "bg-neutral-content": completed }),
    });
    elBranch.append(elTitleContainer);

    const elTitle = elem("p", { class: "mb-0 text-sm overflow-hidden whitespace-nowrap text-ellipsis" }, title);

    const elInfoTitle = elem(
      "p",
      { class: "branch-info mb-0 text-xs font-bold" },
      `진행도: ${progress ?? 0}% | 점수: ${point ?? 0}점`,
    );
    elTitleContainer.append(elTitle, elInfoTitle);

    TextOverflowTooltip({ targetElement: elBranch, textElement: elTitle, content: title });

    this.branchNodeMap.set(id, elBranch);

    return elBranch;
  }

  handleItemClick(content, evt) {
    evt.stopPropagation();

    const selectedItem = evt.currentTarget;

    if (!isHTMLNode(selectedItem) || selectedItem === this.selectedItem) {
      return;
    }

    this.changeItemFocus(selectedItem);
    this.selectedItem = selectedItem;

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
    if (!this.selectedItem) {
      selectedItem.firstChild.classList.add("active");
      return;
    }

    this.selectedItem.firstChild.classList.remove("active");

    selectedItem.firstChild.classList.add("active");
  }

  openTodayMenu(todayChapter, todayPeriod) {
    const { id } = todayChapter;

    const elChapter = this.chapterNodeMap.get(id);

    if (!elChapter) {
      return;
    }

    const elPeriod = elChapter.querySelector(`[data-period="${todayPeriod}"]`);

    this.openMenu(elChapter);
    this.openMenu(elPeriod);
  }

  startTodayStudy(todayProperties) {
    const property = todayProperties.filter(({ completed }) => !completed)[0] ?? todayProperties[0];

    if (!property) {
      return;
    }

    const selectedItem = this.branchNodeMap.get(property.id);

    this.changeItemFocus(selectedItem);

    this.selectedItem = selectedItem;

    if (this.onSideItemClick) {
      this.onSideItemClick(property);
    }
  }

  /**
   * open Menu
   * https://daisyui.com/components/menu/#collapsible-submenu-that-works-with-class-names
   * @param {HTMLLIElement} parent
   */
  openMenu(parent) {
    const children = parent.children;

    const { length } = children;
    for (let i = 0; i < length; i++) {
      const child = children[i];
      child.classList.add("menu-dropdown-show");
    }
  }

  /**
   * close Menu
   * https://daisyui.com/components/menu/#collapsible-submenu-that-works-with-class-names
   * @param {HTMLLIElement} parent
   */
  closeMenu(parent) {
    const children = parent.children;

    const { length } = children;
    for (let i = 0; i < length; i++) {
      const child = children[i];
      child.classList.remove("menu-dropdown-show");
    }
  }

  hasTodayStudy(properties) {
    console.log(properties);
    return isArray(properties) && properties.length > 0;
  }

  getElement() {
    return this.elThis;
  }
}
