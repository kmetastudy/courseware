import { isNumber } from "../../../../../core/utils/type";

import { Model } from "../../../../../shared/lib/components";

export class CourseStatusChartModel extends Model {
  static CHAPTER_TYPE = 0;
  DAISY_WINTER_HEX = {
    primary: "#491eff",
    secondary: "#ff41c7",
    accent: "#00cfbd",
    base300: "#e5e6e6",
  };
  chartOptions = {
    series: [],
    labels: ["완료", "진행중", "미시작"],
    colors: [this.DAISY_WINTER_HEX.primary, this.DAISY_WINTER_HEX.accent, this.DAISY_WINTER_HEX.base300],
    chart: {
      type: "donut",
      height: 400,
      // width: "100%",
      toolbar: {
        tools: {
          download: false,
        },
      },
      events: {
        // beforeMount: (chartContext, config) => {
        //   console.log("beforeMount");
        // },
        // mounted: (chartContext, config) => {
        //   console.log("mounted");
        // },
        // updated: (chartContext, config) => {
        //   console.log("updated");
        //   console.log("chartContext: ", chartContext);
        //   console.log("config: ", config);
        //   // chartContext.windowResizeHandler();
        // },
        // animationEnd: (chartContext, config) => {
        //   console.log("animationEnd");
        // },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              fontSize: "20px",
              fontWeight: 600,
            },
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => {
                return a + b;
              }, 0);
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            show: false,
          },
        },
      },
      {
        breakpoint: 360,
        options: {
          chart: {
            height: 250,
          },
          legend: {
            show: false,
          },
        },
      },
    ],
    tooltip: {
      enabled: true,
      x: {
        show: true,
      },
      y: {
        formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
          return value;
        },
      },
    },
    animations: {
      enabled: true,
      dynamicAnimation: {
        enabled: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    // noData: {
    //   text: "학습을 진행해주세요.",
    //   align: "center",
    //   verticalAlign: "middle",
    //   offsetX: 0,
    //   offsetY: 0,
    //   style: {
    //     // color: "",
    //     fontSize: "14px",
    //     // fontFamily: undefined,
    //   },
    // },
  };

  constructor() {
    super();
  }

  getCourseCount() {
    const properties = this.getPropertyList() ?? [];
    return properties.length;
  }

  getChartOptions() {
    // const series = this.getSeries();

    const defaultChartOptions = this.chartOptions;
    return defaultChartOptions;

    // return { ...defaultChartOptions, series };
  }

  getSeries() {
    const properties = this.getPropertyList();

    const series = composeSeries(properties);

    return series;
  }

  getPropertyList() {
    // dashboardServices에서, classStudyResult와 studyResult의 포맷을 통일시켰다.
    // 따라서, classStudyResult의 json_data 값을, properties로 변경하였다.
    const studyResults = this.getState("studyResults");
    const propertyList = [];

    studyResults.forEach((studyResult) => {
      if (studyResult?.properties?.property) {
        propertyList.push(studyResult.properties.property);
      }
    });

    return propertyList;
  }
}

function composeSeries(properties = []) {
  const series = [];
  let completed = 0;
  let inProgress = 0;
  let notStarted = 0;

  properties.forEach((property) => {
    const branches = property.filter((item) => isBranch(item));

    if (isCompleted(branches)) {
      completed++;
    } else if (isInProgress(branches)) {
      inProgress++;
    } else if (isNotStarted(branches)) {
      notStarted++;
    }
  });

  series.push(completed, inProgress, notStarted);

  return series;
}

function isCompleted(branches = []) {
  const { length } = branches;

  for (let i = 0; i < length; i++) {
    const branch = branches[i];
    const { progress } = branch;

    if (isNumber(progress) && progress !== 100) {
      return false;
    }
  }
  return true;
}

function isInProgress(branches = []) {
  const { length } = branches;

  for (let i = 0; i < length; i++) {
    const branch = branches[i];
    const { progress } = branch;

    if (isNumber(progress) && progress > 0 && progress < 100) {
      return true;
    }
  }

  return false;
}

function isNotStarted(branches = []) {
  const { length } = branches;

  for (let i = 0; i < length; i++) {
    const branch = branches[i];
    const { progress } = branch;

    if (isNumber(progress) && progress > 0 && progress <= 100) {
      return false;
    }
  }

  return true;
}

function isBranch(item) {
  return item.type !== CourseStatusChartModel.CHAPTER_TYPE;
}
