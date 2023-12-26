import { createElement } from "../../../core/utils/dom-utils";
import { isNumber, isObject } from "../../../core/utils/type/index";
import { classNames } from "../../../core/utils/class-names";
import { dashboardHeader } from "../dashboard/common/dashboard-header";

export class ChapterStatsChart {
  static #CHAPTER_TYPE = 0;
  static #QUESTION_TYPE = "q";
  constructor(prefixCls) {
    this.prefixCls = prefixCls;
    this.className = "dashboard-chapter-stats";
    this.title = "통계 보기";

    this.init();
  }

  init() {
    this.create();
  }

  create() {
    this.elThis = createElement("div", { className: classNames(this.prefixCls, this.className) });

    this.elHeader = dashboardHeader({ className: `${this.className}-header`, title: { title: this.title } });

    this.elBody = createElement("div", { className: `${this.className}-body` });

    this.elChart = createElement("div", { className: `${this.className}-body-chart` });
    this.elBody.append(this.elChart);

    this.elThis.append(this.elHeader, this.elBody);
  }

  setData(data) {
    if (isObject(data) === false) {
      return;
    }

    this.data = data;

    this.composeChartData(data);
    this.setChartConfig();

    this.render(this.elChart, this.chartConfig);
  }

  composeChartData(data) {
    this.data = data;

    this.categories = this.composeCategories(data);
    this.progressData = this.composeProgressData(data);
    this.accuracyRateData = this.composeAccuracyRateData(data);

    this.chartConfig = this.setChartConfig();
  }

  setChartConfig() {
    const categories = this.categories;
    const series = [
      { name: "성취도", data: this.progressData },
      { name: "정답률", data: this.accuracyRateData },
    ];

    const chartConfig = {
      series,
      chart: {
        type: "bar",
        height: 480, //FIXME: responsive height, width
        toolbar: {
          show: false,
        },
      },
      noData: {
        text: "통계를 계산중입니다...",
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        categories,
      },
      // yaxis: {
      //   title: {
      //     text: "%",
      //   },
      // },
      fill: {
        opacity: 1,
      },
      // tooltip: {
      //   y: {
      //     formatter: function (value) {
      //       return `${value} %`;
      //     },
      //   },
      // },
    };
    return chartConfig;
  }

  render(node, chartConfig) {
    var clChart = new ApexCharts(node, chartConfig);
    clChart.render();
  }

  getElement() {
    return this.elThis;
  }

  // ============ Compose Data ============
  composeCategories(resultData) {
    const categories = resultData
      .filter((data) => data.type === ChapterStatsChart.#CHAPTER_TYPE)
      .map((chapter) => chapter.title);

    return categories;
  }

  composeProgressData(resultData) {
    const chapterData = resultData.filter((data) => data.type === ChapterStatsChart.#CHAPTER_TYPE);
    const { length } = chapterData;

    const progressSum = new Array(length).fill(0);
    const branchCounts = new Array(length).fill(0);

    let chapterIndex = -1;

    resultData.forEach((data) => {
      if (data.type === ChapterStatsChart.#CHAPTER_TYPE) {
        chapterIndex++;
      } else {
        progressSum[chapterIndex] += data.progress;
        branchCounts[chapterIndex]++;
      }
    });

    const progressData = progressSum.map((totalProgress, index) => {
      const branchCount = branchCounts[index];
      return branchCount === 0 ? 0 : Math.floor(totalProgress / branchCount);
    });

    return progressData;
  }

  composeAccuracyRateData(resultData) {
    /**
     * 계산 방법
     * 한번에 맞춘게 아니면, 틀렸다고 간주한다.
     * 비디오는 제외하고, 문제만 계산한다.
     */
    const chapterData = resultData.filter((data) => data.type === ChapterStatsChart.#CHAPTER_TYPE);
    const { length } = chapterData;

    const attemptedQuestions = new Array(length).fill(0);
    const solvedQuestions = new Array(length).fill(0);

    let chapterIndex = -1;

    resultData.forEach((data) => {
      if (data.type === ChapterStatsChart.#CHAPTER_TYPE) {
        chapterIndex++;
      } else {
        if (data.results.length === 0) {
          return;
        }

        let attemptedQuestionCount = 0; // 풀어본 문제의 수
        let solvedQuestionCount = 0; // 그 중 맞춘 문제의 수

        const { units, results } = data;

        const flattenedTypes = units.map((unit) => unit.types).flat();
        const flattendResults = results.map((res) => res.result).flat();
        const flattendRepeat = results.map((res) => res.repeat).flat();

        const { length } = flattendResults;

        for (let i = 0; i < length; i++) {
          const result = flattendResults[i];
          const type = flattenedTypes[i];
          const repeat = flattendRepeat[i];

          // 일단은 비디오는 고려하지 않고, 문제만 고려한다.
          if (type !== ChapterStatsChart.#QUESTION_TYPE) {
            continue;
          }

          if (isNumber(repeat) && repeat > 0) {
            attemptedQuestionCount++;
          }

          if (this.isCorrectOnFirstAttempt(result, repeat)) {
            solvedQuestionCount++;
          }
        }

        attemptedQuestions[chapterIndex] += attemptedQuestionCount;
        solvedQuestions[chapterIndex] += solvedQuestionCount;
      }
    });

    return solvedQuestions.map((solvedQuestionCount, idx) => {
      const attemptedQuestionCount = attemptedQuestions[idx];
      if (attemptedQuestionCount === 0) {
        return 0;
      } else {
        return Math.floor((solvedQuestionCount / attemptedQuestionCount) * 100);
      }
    });
  }

  isCorrectOnFirstAttempt(result, repeat) {
    return result === "O" && repeat === 1;
  }
}
