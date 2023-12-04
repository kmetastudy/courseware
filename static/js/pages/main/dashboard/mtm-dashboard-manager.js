import { DashboardRecentCourse } from "./dashboard-recent-course";
import { DashboardTotalStats } from "./dashboard-total-stats";
import { DashboardCategoryStats } from "./dashboard-category-stats";
import { DashboardAnnualStats } from "./dashboard-annual-stats";
import { dashboardTitle } from "./common/dashboard-title";
import { createElement } from "../../../core/utils/dom-utils";

require("../../../../css/pages/main/dashboard/mtm-dashboard-manager.css");
export class MtmDashboardManager {
  constructor() {
    this.elContents = null; // [element]
    this.elCards = null; // [element]
    this.prefixCls = "mtm-dashboard-manager";

    this.init();
  }

  init() {
    this.initContents();
    this.create();
  }

  initContents() {
    const prefixCls = "dashboard-card";
    const gridSpan8 = "grid-span-8"; // grid-column : span 4;
    this.elContents = [];
    this.recentLecture = new DashboardRecentCourse({ className: prefixCls });
    this.elRecentLecture = this.recentLecture.getElement();

    this.totalStats = new DashboardTotalStats({
      progress: 75,
      questionCorrectRate: 40,
      videoCorrectRate: 50,
      className: prefixCls,
    });
    this.elTotalStats = this.totalStats.getElement();

    this.annualStats = new DashboardAnnualStats({ className: [prefixCls, gridSpan8] });
    this.elAnnualStats = this.annualStats.getElement();

    this.categoryStats = new DashboardCategoryStats({ className: [prefixCls, gridSpan8] });
    this.elCategoryStats = this.categoryStats.getElement();

    this.elContents.push(this.elRecentLecture, this.elTotalStats, this.elAnnualStats, this.elCategoryStats);
  }

  create() {
    this.elThis = document.createElement("div");
    this.elThis.classList.add(this.prefixCls);

    this.elWrapper = document.createElement("div");
    this.elWrapper.classList.add(`${this.prefixCls}-wrapper`);
    this.elThis.appendChild(this.elWrapper);

    this.elHeader = this.createHeader();
    this.elBody = this.createBody();

    this.elWrapper.append(this.elHeader, this.elBody);
  }

  createHeader() {
    const elHeader = createElement("div", { className: `${this.prefixCls}-header` });

    const elTitle = dashboardTitle({ title: this.title, className: `${this.prefixCls}-title` });
    elHeader.appendChild(elTitle);

    return elHeader;
  }

  createBody() {
    const elBody = createElement("div", { className: `${this.prefixCls}-body` });

    const elCards = this.createCards();

    if (Array.isArray(elCards) && elCards.length > 0) {
      elBody.append(...elCards);
      this.elCards = elCards;
    }

    return elBody;
  }

  createCards() {
    const elCards = [];
    this.elContents.forEach((elContent) => {
      const elCard = this.createCard(elContent);
      elCards.push(elCard);
    });

    return elCards;
  }

  createCard(child) {
    // child.classList.add("dashboard-card");
    return child;
  }

  getElement() {
    return this.elThis;
  }
}
