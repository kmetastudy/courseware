import { isNumber } from "../../../../core/utils/type/index";
import { sum } from "../../../../core/utils/_utils";

export class StudyResultServices {
  static #CHAPTER_TYPE = 0;
  static #QUESTION_TYPE = "q";
  constructor(data) {
    if (!data) {
      throw new Error("Require data");
    }

    this.data = data;
  }

  composeTotalAccuracyRate() {
    let [attemptedQuestionCount, solvedQuestionCount] = [0, 0];

    const branchData = this.data.filter((data) => data.type !== StudyResultServices.#CHAPTER_TYPE);

    branchData.forEach((item) => {
      const flattenedTypes = item.units.map((unit) => unit.types).flat();
      const flattendResults = item.results.map((res) => res.result).flat();
      const flattendRepeat = item.results.map((res) => res.repeat).flat();

      const { length } = flattendResults;

      for (let i = 0; i < length; i++) {
        const result = flattendResults[i];
        const type = flattenedTypes[i];
        const repeat = flattendRepeat[i];

        // 일단은 비디오는 고려하지 않고, 문제만 고려한다.
        if (type !== StudyResultServices.#QUESTION_TYPE) {
          continue;
        }

        if (isNumber(repeat) && repeat > 0) {
          attemptedQuestionCount++;
        }

        if (this.isCorrectOnFirstAttempt(result, repeat)) {
          solvedQuestionCount++;
        }
      }
    });

    if (attemptedQuestionCount === 0) {
      return 0;
    } else {
      return Math.floor((solvedQuestionCount / attemptedQuestionCount) * 100);
    }
  }

  composeChapterAccuracyRates() {
    /**
     * 계산 방법
     * 한번에 맞춘게 아니면, 틀렸다고 간주한다.
     * 비디오는 제외하고, 문제만 계산한다.
     */
    const chapterData = this.data.filter((data) => data.type === StudyResultServices.#CHAPTER_TYPE);
    const { length } = chapterData;

    const attemptedQuestions = new Array(length).fill(0);
    const solvedQuestions = new Array(length).fill(0);

    let chapterIndex = -1;

    this.data.forEach((data) => {
      if (data.type === StudyResultServices.#CHAPTER_TYPE) {
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
          if (type !== StudyResultServices.#QUESTION_TYPE) {
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

  // Utils

  composeTotalProgress() {
    const branchData = this.data.filter((data) => data.type !== StudyResultServices.#CHAPTER_TYPE);

    const maxProgressSum = branchData.length * 100;
    const progressSum = sum(branchData.map((data) => data.progress ?? 0));

    console.log(maxProgressSum, progressSum);

    if (maxProgressSum === 0) {
      return 0;
    }

    return Math.floor((progressSum / maxProgressSum) * 100);
  }

  isCorrectOnFirstAttempt(result, repeat) {
    return result === "O" && repeat === 1;
  }

  isAttempted(repeat) {
    return isNumber(repeat) && repeat > 0;
  }
}
