import { dashboardTitle } from "./common/dashboard-title";
import { createElement } from "../../../core/utils/dom-utils";
import { DateStepper } from "./common/date-stepper";
import { classNames } from "../../../core/utils/class-names";

require("../../../../css/pages/main/dashboard/dashboard-monthly-subject-counts.css");
export class DashboardMonthlySubjectCounts {
  static testProgressData = [
    { name: "국어", data: [20, 30, 50, 0, 10, 20, 30, 40, 60, 70, 50, 20] },
    { name: "수학", data: [10, 40, 20, 0, 100, 100, 60, 40, 20, 70, 50, 20] },
    { name: "영어", data: [100, 100, 100, 100, 10, 20, 30, 40, 20, 50, 60, 50] },
    { name: "과학", data: [100, 100, 100, 100, 100, 100, 30, 50, 60, 20, 50, 20] },
  ];
  static testAccuracyRateData = [
    { name: "국어", data: [100, 100, 100, 100, 100, 100, 30, 50, 60, 20, 50, 20] },
    { name: "수학", data: [20, 30, 50, 0, 10, 20, 30, 40, 60, 70, 50, 20] },
    { name: "영어", data: [10, 40, 20, 0, 100, 100, 60, 40, 20, 70, 50, 20] },
    { name: "과학", data: [100, 100, 100, 100, 10, 20, 30, 40, 20, 50, 60, 50] },
  ];

  constructor({ data, className } = {}) {
    this.className = typeof className === "string" || Array.isArray(className) ? className : null;
    this.init();
  }

  init() {
    this.initVariables();
    this.create();

    this.renderChart();

    this.getData();
  }

  initVariables() {
    this.prefixCls = "dashboard-category-stats";
    this.title = "과목별 상세 통계";
    this.yaxis = "성취도 (%)";
    this.tooltip = {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    };

    this.chartOptions = {
      series: [],
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded",
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      yaxis: {
        title: {
          text: this.yaxis,
        },
        min: 0,
        max: 100,
      },
      fill: {
        opacity: 1,
      },
      tooltip: this.tooltip,
      noData: {
        text: "통계를 계산중입니다...",
      },
    };
  }

  getData() {
    if (!this.data) {
      this.data = DashboardMonthlySubjectCounts.testProgressData;
    }

    // this.series = this.composeSeries();
    setTimeout(() => {
      this.updateChartData(this.data);
    }, 3000);
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

    this.elChart = createElement("div", { className: `${this.prefixCls}-chart` });

    elBody.appendChild(this.elChart);
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

  renderChart() {
    this.clChart = new ApexCharts(this.elChart, this.chartOptions);

    this.clChart.render();
  }

  updateChartData(series) {
    if (!this.clChart || !series) {
      return;
    }

    console.log(series);
    this.clChart.updateSeries(series);
  }
}
