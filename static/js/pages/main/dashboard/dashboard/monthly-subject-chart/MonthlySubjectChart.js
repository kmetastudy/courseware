import elem from "../../../../../core/utils/elem/elem";
import { DateStepper } from "../../common/date-stepper";
import { MonthlySubjectChartModel } from "./MonthlySubjectChartModel";
export class MonthlySubjectChart {
  constructor() {
    this.model = new MonthlySubjectChartModel();
    this.data = null;
    this.init();
  }

  init() {
    this.create();

    this.renderChart();
  }

  create() {
    this.elThis = elem("section", {
      class: "card card-bordered bg-base-100 shadow-lg col-span-12 2xl:col-span-8",
    });

    this.elCardBody = elem("div", { class: "card-body" });
    this.elThis.append(this.elCardBody);

    this.elHeader = elem("h3", { class: "card-title" }, "월별 수강 강의");
    this.elCardBody.append(this.elHeader);

    this.elChart = elem("div");
    this.elCardBody.append(this.elChart);
  }

  setData(data) {
    if (data && data === this.data) {
      return;
    }

    if (data && data.length > 0) {
      this.data = data;
      this.model.setState({ series: data });
      this.updateChartData(data);
    } else {
      this.setEmptyData();
    }
  }

  renderChart() {
    const chartOptions = this.model.getChartOptions();

    const chart = new ApexCharts(this.elChart, chartOptions);

    chart.render();

    this.clChart = chart;
  }

  updateChartData(series) {
    this.clChart.updateSeries(series);
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

  getElement() {
    return this.elThis;
  }
}
