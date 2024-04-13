import { isArray } from "../../../../../core/utils/type";
import { sum, extract } from "../../../../../core/utils/array/";
import Model from "./core/Model.js";

export class StatModelNew extends Model {
  static CHAPTER_TYPE = 0;
  static QUESTION_TYPE = "q";

  constructor(state) {
    super(state);
  }

  /**
   * 각 학습에 대한 학생들의 결과데이터
   * [[{수업1에대한 학생1의 결과}, {수업1에 대한 학생2의 결과}], [{수업2에대한 학생1의 결과}, {수업2에 대한 학생2의 결과}]]
   * [[{name, progress, point, correct, id_student, id_content}]]
   * @returns {[[object]]} content들에 대한 결과들
   */
  getTodayStudentStatus() {
    const todayScheduler = this.getTodayScheduler();
    const contentIds = extract(todayScheduler, "id");

    const users = this.getState("users");
    const studyResults = structuredClone(this.getState("studyResults"));

    const studyResultsWithName = addStudentNameToStudyResults(users, studyResults);

    studyResultsWithName.map((studyResult) => filterTodayProperty(studyResult));

    const status = [];

    contentIds.forEach((contentId) => {
      const contentStatus = [];

      studyResultsWithName.forEach((studyResult) => {
        const {
          id_student,
          name,
          json_data: { property },
        } = studyResult;

        const targetProperty = property.find((item) => item.id === contentId);

        const { progress, point } = targetProperty;

        const correct = countCorrect([targetProperty]);

        contentStatus.push({ name, progress, point, correct, id_student, id_content: contentId });
      });

      status.push(contentStatus);
    });

    return status;
  }

  getStudentCount() {
    const { users } = this.get();
    return users.length;
  }

  getTodayQuestionCounts() {
    const todayScheduler = this.getTodayScheduler();

    return countQuestionNum(todayScheduler);
  }

  getTodayChartData() {
    const todayScheduler = this.getTodayScheduler();
    const studyResults = structuredClone(this.getState("studyResults"));

    studyResults.map((studyResult) => fillEmptyResults(studyResult));
    const properties = studyResults.map(({ json_data: { property } }) => property);
    const todayProperties = properties.map((property) => filterToday(property)).flat();

    todayScheduler.map((scheduler) => {
      const { id } = scheduler;
      const properties = todayProperties.filter((property) => property.id === id);
      addResultToScheduler(scheduler, properties);
    });

    return todayScheduler;
  }

  getTodayStudentProgressStatus() {
    let completedStudents = 0;
    let inProgressStudents = 0;
    let notStartedStudents = 0;

    const todayStudentResults = this.getTodayStudentResults();

    if (!todayStudentResults || todayStudentResults.length === 0) {
      return { completedStudents, inProgressStudents, notStartedStudents };
    }

    todayStudentResults.forEach((studentResult) => {
      const completed = studentResult.property.every((result) => result.progress === 100);
      const inProgress = studentResult.property.some((result) => result.progress > 0 && result.progress < 100);
      const notStarted = studentResult.property.every((result) => result.progress === 0);

      if (completed) {
        completedStudents++;
      }

      if (inProgress) {
        inProgressStudents++;
      }

      if (notStarted) {
        notStartedStudents++;
      }
    });

    return { completedStudents, inProgressStudents, notStartedStudents };
  }

  /**
   * 오늘 학습에 대한 결과데이터
   * [[{수업1에대한 학생1의 결과}, {수업2에 대한 학생1의 결과}], [{수업1에대한 학생2의 결과}, {수업2에 대한 학생2의 결과}]]
   * @returns {[[object]]} content들에 대한 결과들
   */
  getTodayStudentResults() {
    const { users } = this.get();

    const todayScheduler = this.getTodayScheduler();
    const contentIds = extract(todayScheduler, "id");

    const studyResults = structuredClone(this.getState("studyResults"));

    const studyResultsWithName = addStudentNameToStudyResults(users, studyResults);

    const properties = studyResultsWithName.map(({ json_data, name }) => {
      return { property: json_data.property, name };
    });

    const branches = properties.map((data) => {
      data.property = filterBranch(data.property);
      return data;
    });

    const todayStudentResults = branches.map((studentResult) => {
      studentResult.property = studentResult.property.filter((branch) => contentIds.includes(branch.id));
      return studentResult;
    });

    return todayStudentResults;
  }

  getTodayScheduler() {
    const { classContentAssign } = this.get();

    const {
      json_data: { scheduler_list: schedulerList },
    } = classContentAssign;

    return filterToday(schedulerList);
  }

  getTodayChapter() {
    const { classContentAssign } = this.get();
    const {
      json_data: { scheduler_list: schedulerList },
    } = classContentAssign;

    const { length } = schedulerList;

    let currentChatper;

    for (let i = 0; i < length; i++) {
      const scheduler = schedulerList[i];
      if (scheduler.type === 0) {
        currentChatper = scheduler;
        continue;
      }

      const date = scheduler.date;
      if (dayjs(date).isToday()) {
        return currentChatper;
      }
    }
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

function filterTodayProperty(studyResult) {
  // filter today property
  const { json_data } = studyResult;
  const { property } = json_data;
  const todayProperty = filterToday(property);
  json_data.property = todayProperty;
  return studyResult;
}

function filterBranch(array) {
  return array.filter((item) => item.type !== StatModelNew.CHAPTER_TYPE);
}

function findUser(users, userId) {
  return users.find((user) => user.id === userId);
}

function calculateAverage(array) {
  if (!isArray(array) || array.length === 0) {
    return 0;
  }

  const total = sum(array);
  const average = total / (array.length * 100);
  console.log(average);
  const percent = average * 100;
  return percent;
}

function addStudentNameToStudyResults(users, studyResults) {
  return studyResults.map((studyResult) => {
    const studentId = studyResult.id_student;
    const user = findUser(users, studentId);

    if (user?.full_name) {
      studyResult.name = user.full_name;
    }

    return studyResult;
  });
}

function countCorrect(property) {
  let correct = 0;

  property.forEach((item) => {
    const { results } = item;

    results.forEach((data) => {
      const { result, repeat, first } = data;
      const { length } = result;
      for (let i = 0; i < length; i++) {
        const firstAnswer = first ? first[i] : null;
        if (isCorrect({ result: result[i], repeat: repeat[i], first: firstAnswer })) {
          correct++;
        }
      }
    });
  });

  return correct;
}

function countQuestionNum(property) {
  let questionNum = 0;

  if (!Array.isArray(property)) {
    return questionNum;
  }

  property.forEach(({ units }) => {
    const elements = extract(units, "types").flat();
    const questions = elements.filter((element) => element === "q");
    questionNum += questions.length;
  });

  return questionNum;
}

function addResultToScheduler(scheduler, properties) {
  const schedulerResult = [];
  scheduler.result = schedulerResult;

  const { units } = scheduler;
  const { length } = units;

  for (let unitIdx = 0; unitIdx < length; unitIdx++) {
    const unit = units[unitIdx];
    const unitResults = [];
    schedulerResult.push(unitResults);

    const { types } = unit;
    const typesLength = types.length;

    for (let typeIdx = 0; typeIdx < typesLength; typeIdx++) {
      const type = types[typeIdx];
      if (type === "v") {
        continue;
      }

      // [correct, wrong, fixed, unsolved ]
      const elementResults = [0, 0, 0, 0];

      properties.forEach((property) => {
        const { result, repeat, first } = property.results[unitIdx];
        const elementResult = result[typeIdx];
        const elementRepeat = repeat[typeIdx];
        const elementFirst = first ? first[typeIdx] : null;

        [isCorrect, isWrong, isFixed, isUnsolved].forEach((fn, idx) => {
          if (fn({ result: elementResult, repeat: elementRepeat, first: elementFirst })) {
            elementResults[idx]++;
            return;
          }
        });
      });

      unitResults.push(elementResults);
    }
  }

  return scheduler;
}

function fillEmptyResults(studyResult) {
  const {
    json_data: { property: properties },
  } = studyResult;

  const { length } = properties;
  for (let i = 0; i < length; i++) {
    const property = properties[i];
    const { type } = property;

    switch (type) {
      case 0:
        break;
      case 11:
      case 13:
        fillTestumResults(property);
      case 12:
        fillLessonResults(property);
        break;
      default:
        break;
    }
  }
}

function fillLessonResults(property) {
  const { units, results } = property;

  const diff = units.length - results.length;
  for (let i = 0; i < diff; i++) {
    results.push({ result: [], repeat: [] });
  }

  const { length } = units;
  for (let i = 0; i < length; i++) {
    const { types } = units[i];
    const { result, repeat } = results[i];

    if (result.length !== repeat.length) {
      continue;
    }

    const diff = types.length - result.length;

    for (let j = 0; j < diff; j++) {
      result.push("?");
      repeat.push(0);
    }
  }

  return property;
}

function fillTestumResults(property) {
  const { units, results } = property;

  const { length: resultsLength } = results;
  const { length: unitsLength } = units;

  for (let i = resultsLength; i < unitsLength; i++) {
    const { types } = units[i];
    const questionNum = types.length;

    results.push({
      repeat: Array(questionNum).fill(0),
      result: Array(questionNum).fill("?"),
      first: Array(questionNum).fill("?"),
      second: Array(questionNum).fill(""),
    });
  }

  return property;
}

function isCorrect({ result, repeat, first }) {
  // type-> 11
  if (first) {
    return first === "O";
  }

  return result === "O" && repeat === 1;
}

function isWrong({ result, first }) {
  if (first) {
    return first === "x";
  }
  return result === "X";
}

function isFixed({ result, repeat, first }) {
  if (first) {
    return first === "X" && result === "O";
  }

  return result === "O" && repeat > 1;
}

function isUnsolved({ result }) {
  return result === "?";
}
