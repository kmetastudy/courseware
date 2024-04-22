import elem from "../../../../../core/utils/elem/elem";
import { CourseStatusChartModel } from "./CourseStatusChartModel";

export class CourseStatusChart {
  constructor() {
    this.model = new CourseStatusChartModel();
    this.init();
  }

  init() {
    this.create();

    // this.renderChart();
  }

  create() {
    this.elThis = elem("section", {
      class: "card h-96 card-bordered bg-base-100 shadow-lg col-span-12 sm:col-span-6 2xl:col-span-4",
    });

    this.elCardBody = elem("div", { class: "card-body" });
    this.elThis.append(this.elCardBody);

    this.elHeader = elem("h2", { class: "card-title" }, "코스 현황");
    this.elCardBody.append(this.elHeader);

    this.elChartContainer = elem("div");
    this.elCardBody.append(this.elChartContainer);

    this.elChart = elem("div");
    this.elChartContainer.append(this.elChart);
  }

  renderChart() {
    const chartOptions = this.model.getChartOptions();
    const series = this.model.getSeries();
    chartOptions.series = series;

    const chart = new ApexCharts(this.elChart, chartOptions);

    chart.render();

    this.clChart = chart;
  }

  /**
   * @param {Array} data studyResults
   */
  setData(data) {
    if (data && data.length > 0) {
      this.data = data;
      this.model.setState({ studyResults: data });
      // this.updateChartData();
      this.renderChart();
    } else {
      this.setEmptyData();
    }
  }

  updateChartData() {
    const series = this.model.getSeries();

    this.clChart.updateSeries(series, true);
  }

  setEmptyData() {
    this.data = [];
    this.model.setState({ studyResults: [] });

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
