import { isArray } from "../../../../../../../core/utils/type";

import { sum, extract } from "../../../../../../../core/utils/array";
import { round } from "../../../../../../../core/utils/number";

import { Model } from "../../../../../../../shared/lib/components";

export class ChapterStatChartModel extends Model {
  static CHAPTER_TYPE = 0;
  static DAISY_CUPCAKE_HEX = {
    primary: "#65c3c8",
    secondary: "#ef9fbc",
    accent: "#eeaf3a",
  };

  chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        tools: {
          download: false,
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    noData: {
      text: "학습을 진행해주세요.",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        // color: "",
        fontSize: "14px",
        // fontFamily: undefined,
      },
    },
  };

  /**
   *
   * @param {object} state
   * @param {object} state.course
   * @param {object} state.classContentAssign
   * @param {object} state.studyResult
   * @param {object} state.user
   * @param {object} state.selectedTabValue
   */
  constructor(state) {
    super(state);
  }

  getChartOptions() {
    const property = this.getProperty();
    const tabValue = this.getState("selectedTabValue");

    const series = composeSeries(property, tabValue);

    const categories = composeCategories(property);

    const xaxis = { categories };

    const tooltip = composeTooltip(tabValue);

    const colors = composeColors(tabValue);

    const defaultOption = this.chartOptions;

    return { ...defaultOption, series, xaxis, tooltip, colors };
  }

  getProperty() {
    const studyResult = this.getState("studyResult");
    return studyResult?.json_data.property;
  }
}

/**
 *
 * @param {'progress'|'point'} tabValue
 * @returns
 */
function composeTooltip(tabValue) {
  const tooltipName = tabValue === "progress" ? "성취도" : "점수";
  const suffix = tabValue === "progress" ? "%" : "점";

  const tooltip = {
    enabled: true,
    x: {
      show: true,
      // formatter: (value) => `${tooltipName}: ${value} ${suffix}`,
    },
    y: {
      formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
        return `${value} ${suffix}`;
      },
      title: {
        formatter: () => tooltipName,
      },
    },
  };

  return tooltip;
}

function composeCategories(property) {
  const chapters = property.filter(({ type }) => type === ChapterStatChartModel.CHAPTER_TYPE);
  return extract(chapters, "title");
}

/**
 *
 * @param {Array.<object>} property
 * @param {'progress'|'point'} name
 */
function composeSeries(property, name) {
  const chapters = groupPropertyByChapter(property);

  const data = [];

  chapters.forEach(({ child }) => {
    const values = extract(child, name);
    const average = round(calculateAverage(values), 1);

    data.push(average);
  });

  return [{ data }];
}

function groupPropertyByChapter(property) {
  const chapters = [];

  const propertyWithChapterId = addChapterIdToBranch(property);

  propertyWithChapterId.forEach((item, index) => {
    if (isChapter(item)) {
      chapters.push({ ...item, child: [] });
    } else if (isBranch(item)) {
      const { chapterId } = item;
      const parent = chapters.find(({ id }) => id === chapterId);

      parent?.child ? parent.child.push(item) : null;
    }
  });

  return chapters;
}

/**
 *
 * @param {[{}]} property studyResult.json_data.property
 * @returns [{..., chapterId: uuid}]
 */
function addChapterIdToBranch(property) {
  const properties = [];
  let currentChatperId;

  const cloneProperty = structuredClone(property);

  cloneProperty.forEach((item, index) => {
    if (isChapter(item)) {
      currentChatperId = item.id;
      properties.push(item);
    } else if (isBranch(item)) {
      properties.push({ ...item, chapterId: currentChatperId });
    }
  });

  return properties;
}

function composeColors(selectedTabValue) {
  const colorKey = selectedTabValue === "progress" ? "primary" : "secondary";
  return [ChapterStatChartModel.DAISY_CUPCAKE_HEX[colorKey]];
}

function isChapter(item) {
  return item.type === ChapterStatChartModel.CHAPTER_TYPE;
}

function isBranch(item) {
  return item.type !== ChapterStatChartModel.CHAPTER_TYPE;
}

function isSumZero(array) {
  return sum(array) === 0;
}

function calculateAverage(array) {
  if (!isArray(array) || array.length === 0) {
    return 0;
  }

  const total = sum(array);
  const average = total / (array.length * 100);

  const percent = average * 100;
  return percent;
}
