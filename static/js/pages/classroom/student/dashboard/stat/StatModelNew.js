import { sum, extract } from "../../../../../core/utils/array/";
import isArray from "../../../../../core/utils/type/isArray.js";
import Model from "./core/Model.js";

export class StatModelNew extends Model {
  static CHAPTER_TYPE = 0;
  static QUESTION_TYPE = "q";

  constructor(state) {
    super(state);
  }

  getTodayResults() {
    const todayScheduler = this.getTodayScheduler();
    const contentIds = extract(todayScheduler, "id");

    const property = this.getProperty();

    const branches = filterBranch(property);

    const todayResults = contentIds.map((contentId) => {
      return branches.find((item) => item.id === contentId);
    });

    return todayResults;
  }

  getTodayChapter() {
    const todayScheduler = this.getTodayScheduler() ?? [];

    if (todayScheduler.length === 0) {
      return;
    }

    const schedulerList = this.getSchedulerList();

    const branchId = todayScheduler[0].id;

    const todayChapter = findChapterWithBranch(branchId, schedulerList);

    return todayChapter;
  }

  getPeriodInfo() {
    const property = this.getProperty();

    const todayPeriod = getTodayPeriod(property);

    const nestedProperty = groupPropertyByChapter(property);

    let totalPeriod = 0;
    let completedPeriod = 0;

    const { length } = nestedProperty;

    for (let i = 0; i < length; i++) {
      const chapter = nestedProperty[i];

      const { child } = chapter;
      let currentPeriod = 0;

      const { length: childLength } = child;

      for (let j = 0; j < childLength; j++) {
        const branch = child[j];
        const { period, progress } = branch;

        if (period !== currentPeriod) {
          totalPeriod += 1;
          currentPeriod = period;
        }

        if (progress === 100) {
          completedPeriod += 1;
        }
      }
    }

    return { totalPeriod, completedPeriod, todayPeriod };
  }

  getTodayScheduler() {
    const schedulerList = this.getSchedulerList();

    return filterToday(schedulerList);
  }

  /**
   * Get average percentage of student
   * @param {"progress"|"sum"} key
   * @returns {number} 80.92
   */
  getAverage(key) {
    const property = this.getProperty();

    const branches = filterBranch(property);

    const keyData = extract(branches, key);

    return calculateAverage(keyData);
  }

  getAverageUpToToday(key) {
    const property = this.getProperty();

    const branches = filterUntilToday(property);

    const keyData = extract(branches, key);

    return calculateAverage(keyData);
  }

  getProperty() {
    const studyResult = this.getState("studyResult");

    return studyResult?.json_data?.property ?? [];
  }

  getSchedulerList() {
    const classContentAssign = this.getState("classContentAssign");

    return classContentAssign?.json_data?.scheduler_list ?? [];
  }
}

function getTodayPeriod(property) {
  const todayProperty = property.find(({ date }) => isToday(date));
  return todayProperty?.period;
}

function filterUntilToday(property) {
  const properties = [];
  const { length } = property;

  for (let i = 0; i < length; i++) {
    const item = property[i];
    const { date } = item;

    if (dayjs(date).isBefore(dayjs(), "day")) {
      properties.push(item);
    }
  }

  return properties;
}

function filterToday(array) {
  return array.filter(({ date }) => isToday(date));
}

function filterBranch(array) {
  return array.filter((item) => isBranch(item));
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

function calculateAverage(array) {
  if (!isArray(array) || array.length === 0) {
    return 0;
  }

  const total = sum(array);
  const average = total / (array.length * 100);

  const percent = average * 100;
  return percent;
}

function findChapterWithBranch(branchId, data) {
  const { length } = data;
  let chapter;
  for (let i = 0; i < length; i++) {
    const target = data[i];

    if (target.type === 0) {
      chapter = target;
      continue;
    }

    if (target.id === branchId) {
      return chapter;
    }
  }
}

function isChapter(item) {
  return item.type === StatModelNew.CHAPTER_TYPE;
}

function isBranch(item) {
  return item.type !== StatModelNew.CHAPTER_TYPE;
}

function isToday(date) {
  return dayjs(date).isToday();
}
