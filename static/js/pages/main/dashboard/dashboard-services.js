import urlStudyResult from "../../../core/api/st/urlStudyResult";
import urlCourseDetail from "../../../core/api/cm/urlCourseDetail";

import { apiClass } from "../../../core/api/class";
import { apiStudent } from "../../../core/api/st";

import { isString, isNumber, isArray } from "../../../core/utils/type";
import { sum, pipe } from "../../../core/utils/_utils";

export const dashboardServices = (function () {
  const CHAPTER_TYPE = 0;
  const QUESTION_TYPE = "q";
  const VIDEO_TYPE = "v";

  const subjectMap = {
    kor: "국어",
    eng: "영어",
    math: "수학",
    sci: "과학",
    info: "정보",
  };

  let studentId = null;
  let courseIds = null;
  let results = null;
  let details = null;

  // fetch
  async function setData(studentId) {
    const studyResults = await getResults(studentId);
    const classStudyResults = await getClassResults(studentId);

    // TODO
    // 임시로 classStudyResult와 studyResult의 포맷을 일치시킴
    // classStudyResult에는 없는 information 정보도 제공해야함
    const temporaryClassStudyResults = classStudyResults.map((result) => {
      result.properties = result.json_data; // change key name to properties
      delete result.json_data;

      const recentProperty =
        result.properties.property.filter((property) => property.type !== 0 && property.progress !== 0).at(-1) ??
        result.properties.property.find((property) => property.type !== 0);

      const now = dayjs();

      let randomMinutes = Math.floor(Math.random() * 301);

      let randomRecentTimestamp = now.subtract(randomMinutes, "minutes");

      result.properties.information = {
        recent_timestamp: randomRecentTimestamp.toISOString(),
        recent_content: recentProperty.id,
      };

      return result;
    });

    results = [...studyResults, ...temporaryClassStudyResults];

    courseIds = composeIds(results);
    details = await getDetails(courseIds);
  }

  async function getResults(studentId) {
    try {
      const response = await apiStudent.studyResult.filter({ id_student: studentId });
      const result = response.data;

      if (!result) {
        return [];
      }

      if (!isArray(result)) {
        const emptyArray = [];
        emptyArray.push(result);
        return emptyArray;
      }

      return result;
    } catch (error) {
      return [];
    }

    // return urlStudyResult.filter({ id_student: studentId }).then((res) => {
    //   if (!res.data) {
    //     return [];
    //   }

    //   if (!isArray(res.data)) {
    //     const emptyArray = [];
    //     emptyArray.push(res.data);
    //     return emptyArray;
    //   }

    //   return res.data;
    // });
  }

  async function getClassResults(studentId) {
    try {
      const response = await apiClass.studyResult.filter({ id_student: studentId });
      const result = response.data;

      if (!result) {
        return [];
      }

      if (!isArray(result)) {
        const emptyArray = [];
        emptyArray.push(result);

        return emptyArray;
      }

      return result;
    } catch (error) {
      return [];
    }
  }

  function getDetails(courseIds) {
    return urlCourseDetail
      .getList(courseIds)
      .then((res) => {
        return res?.data?.data ? res.data.data : [];
      })
      .catch((err) => {
        console.error(err);
        return [];
      });
  }

  // ============ Utils ============
  function parseAll(array) {
    return array?.map((data) => {
      if (isString(data.properties)) {
        data.properties = JSON.parse(data.properties);
        return data;
      }
    });
  }

  function filterResultsHavingYear(results) {
    return results.filter((result) => result?.properties?.information?.recent_timestamp);
  }

  function sortResultsByStudyDate(results) {
    return results.sort(
      (a, b) => a.properties.information.recent_timestamp - b.properties.information.recent_timestamp,
    );
  }

  function composeRecentResultsData(result, digits = 0) {
    const { id_course: id, properties } = result;
    const { property, information } = properties;

    const { courseTitle: title } = findDetailWithCourseId(id);

    const branches = filterBranch(property);

    const progress = getProgressPercent(branches, digits);
    const lectureCount = branches.length;
    const completedLectureCount = branches.filter((data) => data?.progress === 100).length;
    const link = `${getRootUrl()}/st/?course_id=${id}&content_id=${information.recent_content}`;

    return { id, title, progress, lectureCount, completedLectureCount, information, link };
  }

  function getRootUrl() {
    return window.location.origin;
  }

  function composeIds(data) {
    return data?.map((item) => item.id_course);
  }

  function flatBranch(results) {
    return pipe(getResultsPropertyList, filterBranches, flatArray)(results);
  }

  // [result1, result2] => [result]
  function getResultsPropertyList(results) {
    return results.map((data) => data.properties.property);
  }

  function filterBranches(propertyList) {
    return propertyList.map((property) => filterBranch(property));
  }

  function filterBranch(property) {
    return property.filter(({ type }) => type !== CHAPTER_TYPE);
  }

  function flatArray(arr) {
    return Array.prototype.flat.call(arr);
  }

  function getProgressPercent(branches, digits) {
    const maxProgress = getMaxProgress(branches);
    const progressSum = sumProgress(branches);

    if (maxProgress === 0) {
      return 0;
    }

    return parseFloat(((progressSum / maxProgress) * 100).toFixed(digits));
  }

  function sumProgress(data) {
    return sum(data.map(({ progress }) => progress ?? 0));
  }

  function getMaxProgress(data) {
    return data.length * 100;
  }

  function getQuestionAccuracy(branches) {
    let attemptedQuestionCount = 0;
    let solvedQuestionCount = 0;

    branches.forEach(({ units, results }) => {
      const types = flatArray(units.map((unit) => unit.types));
      const resultsFlattened = flatArray(results.map((res) => res.result));
      const repeatsFlattened = flatArray(results.map((res) => res.repeat));

      resultsFlattened.forEach((result, index) => {
        const type = types[index];

        if (type !== QUESTION_TYPE) {
          return;
        }

        const repeat = repeatsFlattened[index];

        if (isNumber(repeat) && repeat > 0) {
          attemptedQuestionCount++;
        }

        if (isCorrectOnFirstAttempt(result, repeat)) {
          solvedQuestionCount++;
        }
      });
    });

    return attemptedQuestionCount === 0 ? 0 : (solvedQuestionCount / attemptedQuestionCount) * 100;
  }

  function isCorrectOnFirstAttempt(result, repeat) {
    return result === "O" && repeat === 1;
  }

  // categoryStats
  function filterResultsWithYear(results, year) {
    return results.filter((result) => {
      return new Date(result?.properties?.information?.recent_timestamp).getFullYear() === year;
    });
  }

  function composeSubjectStats(results) {
    const stats = createEmptySubjectStats();
    results.forEach((result) => {
      const month = new Date(result.properties.information.recent_timestamp).getMonth();
      const subject = findFormattedSubject(result.id_course);

      stats.find(({ name }) => name === subject).data[month]++;
    });
    return stats;
  }

  function createEmptySubjectStats() {
    const stats = [];
    for (let key in subjectMap) {
      const stat = {
        name: subjectMap[key],
        data: Array(12).fill(0),
      };
      stats.push(stat);
    }
    return stats;
  }

  function findFormattedSubject(courseId) {
    const subject = findSubject(courseId);
    return subjectMap[subject];
  }

  function findSubject(courseId) {
    return findDetailWithCourseId(courseId)?.subject;
  }

  function findDetailWithCourseId(courseId) {
    return details.find((detail) => detail.courseId === courseId);
  }

  // ============ API ============
  return {
    set: async function (id) {
      if (id === studentId) {
        return;
      }

      studentId = id;
      await setData(id);
    },

    getStudyResults() {
      return results;
    },

    // Recent course
    getRecentCourses(num, digits = 0) {
      const end = isNumber(num) && num > 0 ? num : 1;

      let sortedResults = pipe(filterResultsHavingYear, sortResultsByStudyDate)(results);
      if (sortedResults.length === 0) {
        sortedResults = results.slice(0, end);
      }
      const slicedResults = sortedResults.slice(0, end);

      return slicedResults.map((result) => composeRecentResultsData(result, digits));
    },

    // Course Stats
    getTotalProgress(digits = 0) {
      const flattenedBranches = flatBranch(results);

      return getProgressPercent(flattenedBranches, digits);
    },

    getTotalCourseCount() {
      return results.length;
    },

    getCompletedCourseCount() {
      console.log(pipe(getResultsPropertyList, filterBranches)(results));
    },

    getTotalQuestionAccuracy(digits = 0) {
      const flattenedBranches = flatBranch(results);
      return getQuestionAccuracy(flattenedBranches).toFixed(digits);
    },

    // Monthly courses
    getMonthlySubjectCounts(year) {
      const targetYear = year ? year : new Date().getFullYear();

      return pipe(filterResultsWithYear, composeSubjectStats)(results, targetYear);
    },
  };
})();
