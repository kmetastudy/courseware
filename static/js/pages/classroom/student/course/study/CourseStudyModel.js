import { extract } from "../../../../../core/utils/array";
import { utcToLocalString } from "../../../../../core/utils/date/dayjs";
import { isArray } from "../../../../../core/utils/type";

export class CourseStudyModel {
  static TYPE_CONTENT_KOR = {
    0: "챕터",
    11: "테스트",
    12: "레슨",
    13: "시험",
  };

  static TYPE_ELEMENT_STRING = {
    video: "v",
    question: "q",
  };

  #state;

  constructor(state) {
    this.#state = state;
  }

  setState(newState) {
    this.#state = { ...this.#state, ...newState };
  }

  getState = (key) => this.#state[key];

  getProperty() {
    return this.getState("studyResult")?.json_data?.property ?? [];
  }

  composeSchedulers() {
    const studyProperty = structuredClone(this.getProperty());

    const nestedSchedulers = composeNestedSchedulers(studyProperty);

    const formattedScheduler = nestedSchedulers.map((scheduler) => formatScheduler(scheduler));

    return formattedScheduler;
  }

  getTodayProperties() {
    const studyProperty = this.getProperty();

    const todayProperties = studyProperty.filter((item) => item.date && isToday(item.date));

    return todayProperties;
  }

  getTodayPeriod() {
    const todayProperties = this.getTodayProperties();
    const todayPeriod = todayProperties.length > 0 ? todayProperties[0].period : 0;

    return todayPeriod;
  }

  getTodayChapters() {
    let todayChapters = [];

    const propertyList = this.getProperty();

    const { length } = propertyList;

    let chapter = undefined;

    for (let i = 0; i < length; i++) {
      const property = propertyList[i];

      if (property.type === 0) {
        chapter = property;
        continue;
      }

      const { date } = property;

      if (isToday(date)) {
        if (todayChapters.length === 0) {
          todayChapters.push(chapter);
        } else if (todayChapters.at(-1).id !== chapter.id) {
          todayChapters.push(chapter);
        }
      }
    }

    return todayChapters;
  }
}

function composeNestedSchedulers(studyProperty) {
  const nestedSchedulers = [];

  let currentPeriod = 0;

  const { length } = studyProperty;

  for (let i = 0; i < length; i++) {
    const scheduler = studyProperty[i];
    const { type, period, date, units, id } = scheduler;

    // chapter
    if (type === 0) {
      const title = scheduler.title;
      const child = [];
      nestedSchedulers.push({ title, child, id });

      currentPeriod = period;
      continue;
    }

    // 차시
    if (period !== currentPeriod) {
      const title = `${period} 차시`;
      const dateTitle = utcToLocalString(date) ?? date;
      const branchCount = studyProperty.filter((item) => item.date === date).length;

      nestedSchedulers.at(-1)?.child?.push({ title, date, dateTitle, period, branchCount, child: [] });

      currentPeriod = period;
    }

    // branch
    const typeString = formatContentType(type);
    const typeTitle = typeString ? `유형: ${typeString}` : "";
    const completed = isCompleted(scheduler);

    const elementTypes = flattenElementTypes(units);
    const questionNum = countQuestion(elementTypes);
    const videoNum = countVideo(elementTypes);

    nestedSchedulers
      .at(-1)
      ?.child?.at(-1)
      ?.child?.push({ ...scheduler, typeTitle, questionNum, videoNum, completed });
  }

  return nestedSchedulers;
}

function formatScheduler(scheduler) {
  const { child } = scheduler;
  if (child.length === 0) {
    scheduler.disabled = true;
    return scheduler;
  }

  const childResults = extract(scheduler.child, "child").flat();

  const completed = isCompleted(childResults);

  const startDate = child.at(0)?.dateTitle;
  const endDate = child.at(-1)?.dateTitle;
  const period = child.length;

  let date;
  if (startDate && endDate) {
    date = `${startDate} - ${endDate}`;
  } else {
    date = "";
  }

  scheduler.completed = completed;
  scheduler.disabled = false;
  scheduler.date = date;
  scheduler.period = period;

  // 차시
  child.map((period) => {
    const results = period.child;
    const completed = isCompleted(results);
    period.completed = completed;

    return period;
  });

  return scheduler;
}

function formatContentType(type) {
  return CourseStudyModel.TYPE_CONTENT_KOR[type] ?? "콘텐츠";
}

function countVideo(elementTypes) {
  return elementTypes.filter((type) => type === CourseStudyModel.TYPE_ELEMENT_STRING.video).length;
}

function countQuestion(elementTypes) {
  return elementTypes.filter((type) => type === CourseStudyModel.TYPE_ELEMENT_STRING.question).length;
}

function flattenElementTypes(units = []) {
  return extract(units, "types").flat();
}

function isCompleted(results = []) {
  if (isArray(results)) {
    return results.every((result) => result.progress === 100);
  }

  return results.progress === 100;
}

function isToday(date) {
  return dayjs(date).isToday();
}
