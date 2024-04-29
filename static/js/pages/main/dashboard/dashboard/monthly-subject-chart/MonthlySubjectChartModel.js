import { Model } from "../../../../../shared/lib/components";

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
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        borderRadiusApplication: "end", // 'around', 'end'
        borderRadiusWhenStacked: "last", // 'all', 'last'
      },
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
