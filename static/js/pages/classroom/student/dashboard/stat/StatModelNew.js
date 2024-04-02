import { sum, sumByKey, extract } from "../../../../../core/utils/array/";
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

    const { studyResults } = this.get();

    const properties = studyResults.map(({ json_data: { property } }) => property);

    const branches = properties.map((property) => filterBranch(property));

    const todayResults = contentIds.map((contentId) => {
      return branches.map((branch) => {
        const result = branch.find((item) => item.id === contentId);
        return result;
      });
    });

    return todayResults;
  }

  getTodayScheduler() {
    const { classContentAssign } = this.get();

    const {
      json_data: { scheduler_list: schedulerList },
    } = classContentAssign;

    return filterToday(schedulerList);
  }

  countStudentsBetween(min, max, key) {
    // 10, 20
    const low = this.countStudentsAboveThreshold(min, key);
    const high = this.countStudentsAboveThreshold(max, key);

    return low - high;
  }

  /**
   * 특정 기준을 넘는, 학생의 수를 반환
   * @param {number} threshold 0-100
   * @returns
   */
  countStudentsAboveThreshold(threshold, key) {
    const studyResults = this.getState("studyResults");
    const count = studyResults.reduce((acc, { json_data: { property } }) => {
      const branches = filterBranch(property);
      const arrayOfKey = extract(branches, key);
      const average = calculateAverage(arrayOfKey);
      if (average > threshold) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return count;
  }

  /**
   * Get average percentage of student
   * @param {object} studyResult
   * @param {"progress"|"sum"} key
   * @returns {number} 80.92
   */
  getStudentAverage(studyResult, key) {
    const {
      json_data: { property },
    } = studyResult;

    const branches = this.filterBranch(property);

    const arrayOfKey = extract(branches, key);

    return calculateAverage(arrayOfKey);
  }

  /**
   *
   * @param {"progress"|"sum"} key
   * @returns
   */
  getClassAverage(key) {
    const studyResults = this.getState("studyResults");

    const properties = studyResults.map(({ json_data: { property } }) => property);

    const branches = properties.map((property) => filterBranch(property)).flat();

    const keyData = extract(branches, key);

    return calculateAverage(keyData);
  }
}

function filterToday(array) {
  return array.filter(({ date }) => dayjs(date).isToday());
}

function filterChapter(array) {
  return array.filter((item) => item.type === StatModelNew.CHAPTER_TYPE);
}

function filterBranch(array) {
  return array.filter((item) => item.type !== StatModelNew.CHAPTER_TYPE);
}

function findUser(userId, users) {
  return users.find((user) => user.id === userId);
}

function calculateAverage(array) {
  const total = sum(array);
  const average = total / (array.length * 100);
  const percent = average * 100;
  return percent;
}
