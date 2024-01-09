import { dashboardTitle } from "./common/dashboard-title";
import { createElement } from "../../../core/utils/dom-utils";
import { DateStepper } from "./common/date-stepper";
import { classNames } from "../../../core/utils/class-names";

require("../../../../css/pages/main/dashboard/dashboard-monthly-subject-counts.css");
export class DashboardMonthlySubjectCounts {
  constructor({ className } = {}) {
    this.className = typeof className === "string" || Array.isArray(className) ? className : null;
    this.data = null;
    this.init();
  }

  init() {
    this.initVariables();
    this.create();

    this.renderChart();
  }

  initVariables() {
    this.prefixCls = "dashboard-monthly-subject-counts";
    this.title = "월별 수강 강의";
    this.yaxis = "개수";
    this.tooltip = {
      y: {
        formatter: function (val) {
          return val + " 개";
        },
      },
    };

    this.chartOptions = {
      series: [],
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      yaxis: {
        title: {
          text: this.yaxis,
        },
        min: 0,
        max: 10,
      },
      noData: {
        text: "통계를 계산중입니다...",
      },
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

      fill: {
        opacity: 1,
      },
      tooltip: this.tooltip,
    };
  }

  create() {
    this.elThis = createElement("div", { className: classNames(this.className, this.prefixCls) });

    this.elHeader = this.createHeader();
    this.elBody = this.createBody();

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

  // FIXME: rendering issue 2023.01.08
  // 차트가 rendering될 때, 아주 초반에 0.2초 정도, text가 이상하게 잡혀있다.
  // noData의 text가 왼쪽에 가있고, yaxis의 title이 중앙 위쪽에 가있다.
  // 가로 줄 또한 없다.
  renderChart() {
    this.clChart = new ApexCharts(this.elChart, this.chartOptions);

    this.clChart.render();
  }
  //////////// API ////////////
  getElement() {
    return this.elThis;
  }

  // Series format
  // const series = [
  //   { name: "국어", data: [20, 30, 50, 0, 10, 20, 30, 40, 60, 70, 50, 20] },
  //   { name: "수학", data: [10, 40, 20, 0, 100, 100, 60, 40, 20, 70, 50, 20] },
  //   { name: "영어", data: [100, 100, 100, 100, 10, 20, 30, 40, 20, 50, 60, 50] },
  //   { name: "과학", data: [100, 100, 100, 100, 100, 100, 30, 50, 60, 20, 50, 20] },
  // ];
  setData(data) {
    if (data && data === this.data) {
      return;
    }

    if (data && data.length > 0) {
      this.data = data;
      this.updateChartData(data);
    } else {
      this.setEmptyData();
    }
  }

  updateChartData(series) {
    setTimeout(() => {
      this.clChart.updateSeries(series);
    }, 300);
  }

  setEmptyData() {
    this.data = [];
    setTimeout(() => {
      this.clChart.updateOptions({
        noData: {
          text: "데이터가 없습니다.",
        },
      });
    });
  }

  getMaxY(series) {
    return series?.reduce((maxValue, item) => {
      const maxInItem = Math.max(...item.data);
      return Math.max(maxValue, maxInItem);
    }, 0);
  }
}
