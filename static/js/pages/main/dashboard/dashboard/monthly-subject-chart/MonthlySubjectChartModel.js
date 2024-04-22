import { Model } from "../../../../../shared/component/Model";

export class MonthlySubjectChartModel extends Model {
  static CHAPTER_TYPE = 0;
  chartOptions = {
    series: [],
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    yaxis: {
      title: {
        text: "개수",
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
        // columnWidth: "0%",
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
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " 개";
        },
      },
    },
  };

  getChartOptions() {
    // const series = this.getState("series") ?? [];

    // return { ...this.chartOptions, series };
    return this.chartOptions;
  }
}
