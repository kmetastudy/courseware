import View from "../../core/View.js";
import Section from "../../layout/molecules/Section.js";
import RankingList from "../../layout/template/RankingList.js";
import LessonStudentsList from "../../layout/template/LessonStudentsList.js";
import { EmptyStudent } from "../../layout/template/EmptyStudent.js";
import { statStore } from "../../StatStore.js";

export default class DashboardLessonView extends View {
  constructor(target) {
    super(target);
  }

  template({ questionCounts, studentCount, studentStatus, todayChartData }) {
    const { selectedSection } = statStore.state;
    const index = selectedSection ?? 0;
    const targetStatus = studentStatus[index];

    targetStatus.sort(this.sortAscendingByCorrect);

    const numberOfStudentToShow = Math.min(targetStatus.length, 2) ?? 0;

    const status = targetStatus.slice(0, numberOfStudentToShow);

    // compose RankingList Data
    // {type, index, correct, questionCounts}
    const targetChartData = todayChartData[index];
    const { result } = targetChartData;
    // ADD index to inner array
    const results = result.flat().map((item, questionIndex) => [...item, questionIndex + 1]);

    results.sort(this.sortAscendingByWrong);

    const numberOfQuestionToShow = Math.min(questionCounts, 2) ?? 0;

    const slicedResults = results.slice(0, numberOfQuestionToShow);
    const CORRECT_INDEX = 0;
    const questions = slicedResults.map((result) => {
      const correct = result[CORRECT_INDEX];
      const questionIndex = result.at(-1);
      return { questionIndex, correct, studentCount };
    });

    // let questions = [
    //   { type: "test", q: "2", num: "10" },
    //   { type: "lesson", q: "2", num: "15" },
    // ];
    return `
            <div class="card-body grow-0">
                <h2 class="card-title">오늘 수업 결과</h2>
            </div>
            <div class="p-8 pt-0 min-h-[300px] xl:min-h-[400px] gap-4">
                ${EmptyStudent()}
                <div class="p-2 flex" data-component="section-status">
                    <div class="flex-1 flex flex-col gap-2">
                        <div data-component="section-change"></div>
                        <div class="">
                            <div class="badge badge-outline">많이 틀린 문제</div>
                            ${RankingList(questions)}
                        </div>
                        <div class="">
                            <div class="badge badge-outline">도움이 필요한 학생</div>
                            ${LessonStudentsList({ status })}
                        </div>
                    </div>
                    <div class="p-2 w-1/2 flex justify-center" data-component="section-result"></div>    
                </div>
            </div>
        `;
  }

  sortAscendingByCorrect(a, b) {
    return a.correct - b.correct;
  }

  sortAscendingByWrong(a, b) {
    // [correct, wrong, fixed, unsolved]
    const WRONG_INDEX = 1;
    return a[WRONG_INDEX] - b[WRONG_INDEX];
  }
}
