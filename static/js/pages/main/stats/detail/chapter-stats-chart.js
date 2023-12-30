import { createElement } from "../../../../core/utils/dom-utils";
import { isNumber, isObject } from "../../../../core/utils/type/index";
import { classNames } from "../../../../core/utils/class-names";
import { dashboardHeader } from "../../dashboard/common/dashboard-header";

export class ChapterStatsChart {
  static #CHAPTER_TYPE = 0;
  static #QUESTION_TYPE = "q";
  constructor(prefixCls) {
    this.prefixCls = prefixCls;
    this.className = "dashboard-chapter-stats";
    this.title = "통계 보기";

    this.categories = null;
    this.progressData = null;
    this.accuracyRateData = null;

    this.init();
  }

  init() {
    this.create();

    this.initChart();
  }

  create() {
    this.elThis = createElement("div", { className: classNames(this.prefixCls, this.className) });

    this.elHeader = dashboardHeader({ className: `${this.className}-header`, title: { title: this.title } });

    this.elBody = createElement("div", { className: `${this.className}-body` });

    this.elChart = createElement("div", { className: `${this.className}-body-chart` });
    this.elBody.append(this.elChart);

    this.elThis.append(this.elHeader, this.elBody);
  }

  // Initial render
  initChart() {
    this.chartConfig = this.setChartConfig();

    this.clChart = new ApexCharts(this.elChart, this.chartConfig);
    this.clChart.render();
  }

  // ============ API ============

  setData(data) {
    if (isObject(data) === false) {
      return;
    }

    this.data = data;

    const [categories, series] = this.composeCategoriesAndSeries(data);
    console.log(categories, series);

    const config = this.setChartConfig({ categories, series });

    this.updateChart(config);
  }

  composeCategoriesAndSeries(data) {
    const categories = this.composeCategories(data);
    const series = this.composeSeries(data);

    return [categories, series];
  }

  updateChart(config) {
    this.clChart.updateOptions(config);
  }

  setChartConfig({ categories, series = [] } = {}) {
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
      fill: {
        opacity: 1,
      },
    };

    if (categories) {
      chartConfig.xaxis = { categories };
    }

    return chartConfig;
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

  composeSeries(data) {
    const progress = this.composeProgressData(data);
    const accuracyRate = this.composeAccuracyRateData(data);

    if (!progress || !accuracyRate) {
      return [];
    }

    return [
      { name: "성취도", data: progress },
      { name: "정답률", data: accuracyRate },
    ];
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
