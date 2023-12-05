import { dashboardTitle } from "./common/dashboard-title";
import { LineChart } from "../../../core/component/d3/line-chart";
import { createElement } from "../../../core/utils/dom-utils";
import { DateStepper } from "./common/date-stepper";
import { classNames } from "../../../core/utils/class-names";
import { CircleLegend } from "../../../core/component/d3/circle-legend";

require("../../../../css/pages/main/dashboard/dashboard-category-stats.css");
export class DashboardCategoryStats {
  static testData = [
    { category: "math", month: 1, achievement: 100 },
    { category: "math", month: 2, achievement: 20 },
    { category: "math", month: 3, achievement: 50 },
    { category: "math", month: 4, achievement: 90 },
    { category: "math", month: 5, achievement: 70 },
    { category: "math", month: 6, achievement: 30 },
    { category: "math", month: 7, achievement: 0 },
    { category: "math", month: 8, achievement: 10 },
    { category: "math", month: 9, achievement: 60 },
    { category: "math", month: 10, achievement: 30 },
    { category: "math", month: 11, achievement: 80 },
    { category: "math", month: 12, achievement: 40 },
    { category: "science", month: 1, achievement: 50 },
    { category: "science", month: 2, achievement: 10 },
    { category: "science", month: 3, achievement: 30 },
    { category: "science", month: 4, achievement: 20 },
    { category: "science", month: 5, achievement: 80 },
    { category: "science", month: 6, achievement: 10 },
    { category: "science", month: 7, achievement: 100 },
    { category: "science", month: 8, achievement: 80 },
    { category: "science", month: 9, achievement: 20 },
    { category: "science", month: 10, achievement: 60 },
    { category: "science", month: 11, achievement: 20 },
    { category: "science", month: 12, achievement: 35 },
    { category: "english", month: 1, achievement: 10 },
    { category: "english", month: 2, achievement: 0 },
    { category: "english", month: 3, achievement: 0 },
    { category: "english", month: 4, achievement: 20 },
    { category: "english", month: 5, achievement: 0 },
    { category: "english", month: 6, achievement: 30 },
    { category: "english", month: 7, achievement: 60 },
    { category: "english", month: 8, achievement: 100 },
    { category: "english", month: 9, achievement: 80 },
    { category: "english", month: 10, achievement: 90 },
    { category: "english", month: 11, achievement: 100 },
    { category: "english", month: 12, achievement: 70 },
  ];

  constructor({ data, className } = {}) {
    this.data = Array.isArray(data) ? data : DashboardCategoryStats.testData;
    this.className = typeof className === "string" || Array.isArray(className) ? className : null;
    this.init();
  }

  init() {
    this.initVariables();
    this.prepareData();
    this.create();

    if (this.data) {
      this.drawChart(this.data);
    }
  }

  initVariables() {
    this.prefixCls = "dashboard-category-stats";
    this.title = "학습별 상세 통계";
  }

  prepareData() {
    // if (!this.data) {
    //   this.data = DashboardCategoryStats.testData;
    // }
  }

  create() {
    this.elThis = createElement("div", { className: classNames(this.className, this.prefixCls) });

    this.elHeader = this.createHeader();
    this.elBody = this.createBody();
    this.elFooter = this.createFooter();

    // this.elThis.append(this.elHeader, this.elBody, this.elFooter);
    this.elThis.append(this.elHeader, this.elBody);
  }

  createHeader() {
    const elHeader = createElement("div", { className: `${this.prefixCls}-header` });
    const elTitle = dashboardTitle({ title: this.title, className: `${this.prefixCls}-title` });

    const clDateStepper = new DateStepper({ format: "year" });
    const elDateStepper = clDateStepper.getElement();

    elHeader.append(elTitle, elDateStepper);

    return elHeader;
  }

  createBody() {
    const elBody = createElement("div", { className: `${this.prefixCls}-body` });

    this.elChartContainer = createElement("div", { className: `${this.prefixCls}-chart-wrapper` });
    this.elLegendContainer = createElement("div", { className: `${this.prefixCls}-chart-legend` });

    elBody.appendChild(this.elChartContainer);
    elBody.appendChild(this.elLegendContainer);

    return elBody;
  }

  createFooter() {}

  //////////// API ////////////
  changeDateFormat(data) {
    return data.forEach((data) => (data.month = `${data.month}월`));
  }

  getElement() {
    return this.elThis;
  }

  drawChart(data) {
    data.forEach((data) => {
      data.month = new Date(2023, data.month - 1);
    });

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    this.elChart = LineChart(data, {
      x: (d) => d.month,
      y: (d) => d.achievement,
      z: (d) => d.category,
      yLabel: "학업 성취도",
      height: 500,
      color,
    });

    const categories = [...new Set(data.map((value) => value.category))];

    // this.elLegend = categories.CircleLegend({ keys: categories, color: d3.scaleOrdinal(d3.schemeCategory10) });
    // categories.forEach((category) => {
    //   const elLegend = CircleLegend({ title: category, color: color(category) });
    //   this.elLegendContainer.appendChild(elLegend);
    // });

    this.elChart ? this.elChartContainer.appendChild(this.elChart) : null;
    // this.elLegend ? this.elLegendContainer.appendChild(this.elLegend) : null;
  }
}
