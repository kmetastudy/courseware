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

    const { studyResult } = this.get();

    const property = getProperty(studyResult);

    const branches = filterBranch(property);

    const todayResults = contentIds.map((contentId) => {
      return branches.find((item) => item.id === contentId);
    });

    // studyResult의 results는, 학습을 하지 않은 경우 빈 배열이다.
    // 이 경우, 빈 배열을 채워주어야될까?
    // 데이터가 없는 경우, 의미가 없을거같음
    // 채워주지 말자.
    // const composedTodayResults = todayResults.map((result) => this.fillResult(result));

    return todayResults;
  }

  getTodayChapter() {
    const todayScheduler = this.getTodayScheduler() ?? [];

    if (todayScheduler.length === 0) {
      return;
    }

    const { classContentAssign } = this.get();

    const schedulerList = getSchedulerList(classContentAssign);

    const branchId = todayScheduler[0].id;

    console.log(schedulerList);

    const todayChapter = findChapterWithBranch(branchId, schedulerList);

    return todayChapter;
  }

  getPreiodInfo() {
    const { studyResult } = this.get();

    let totalPeriod = 0;
    let completedPeriod = 0;
    let todayPeriod;

    const todayScheduler = this.getTodayScheduler();

    if (todayScheduler.length > 0) {
      todayPeriod = todayScheduler[0].period;
    }

    const property = getProperty(studyResult);

    const branches = filterBranch(property);
    const periodSet = new Set(extract(branches, "period"));
    const periods = [...periodSet];
    totalPeriod = periods.length;

    const { length } = periods;

    for (let i = 0; i < length; i++) {
      const period = periods[i];

      const periodBranches = branches.filter((branch) => branch.period === period);

      const completed = periodBranches.filter((branch) => branch.progress === 100).length;

      if (periodBranches.length === completed) {
        completedPeriod++;
      }
    }

    return { totalPeriod, completedPeriod, todayPeriod };
  }

  /**
   * Get StudyResult Information, related with progress
   * @returns {{total:number, completed:number, ongoing:number}}
   */
  getResultProgressInfo() {
    const { studyResult } = this.get();
    const property = getProperty(studyResult);
    const branches = filterBranch(property);

    const total = branches.length;
    const completed = branches.filter((branch) => branch.progress === 100).length;
    const incomplete = branches.filter((branch) => branch.progress < 100).length;

    return { total, completed, incomplete };
  }

  getTodayScheduler() {
    const { classContentAssign } = this.get();

    const {
      json_data: { scheduler_list: schedulerList },
    } = classContentAssign;

    return filterToday(schedulerList);
  }

  /**
   * Get average percentage of student
   * @param {"progress"|"sum"} key
   * @returns {number} 80.92
   */
  getAverage(key) {
    const studyResult = this.getState("studyResult");
    console.log(studyResult);

    const {
      json_data: { property },
    } = studyResult;

    const branches = filterBranch(property);

    const keyData = extract(branches, key);

    return calculateAverage(keyData);
  }
}

function getProperty(studyResult) {
  return studyResult?.json_data?.property;
}

function getSchedulerList(classContentAssign) {
  return classContentAssign?.json_data?.scheduler_list;
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

function utcToLocalString(isoString, format = "YYYY-MM-DD") {
  return dayjs.utc(isoString).local().format(format);
}
