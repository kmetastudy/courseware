import View from "../../core/View.js"
import Section from "../../layout/molecules/Section.js"
import RankingList from "../../layout/templates/RankingList.js"
import LessonStudentsList from "../../layout/templates/LessonStudentsList.js";

export default class DashboardLessonResultView extends View {
    constructor(target) {
        super(target);
    }

    template(state) {

        return `
            <div class="card-body grow-0">
                <h2 class="card-title breadcrumbs p-0" data-component="title-chapter-lesson"></h2>
            </div>
            <div class="p-8 pt-0 flex" data-component="stat-chapter-lesson">
                <div class="stat">
                    <div class="stat-title">평균 진행률</div>
                    <div class="flex justify-around items-center">
                        <p></p>
                        <div class="radial-progress bg-base-200 border-4 border-base-200" style="--value:10;" role="progressbar" data-component="progress">0%</div>
                    </div>
                </div>
                <div class="stat">
                    <div class="stat-title">평균 정답률</div>
                    <div class="flex justify-around items-center">
                        <p></p>
                        <div class="radial-progress bg-base-200 border-4 border-base-200" style="--value:10;" role="progressbar" data-component="correct">0%</div>
                    </div>
                </div>
            </div>
            <p class="px-8">전체 학생</p>
            <div class="p-8 pt-0 overflow-y-auto">
                <div class="p-2 flex">
                    <div class="flex-1 flex flex-col gap-2 ">
                        <div class="" data-component="list-students-result">
                            
                        </div>
                    </div>   
                </div>
            </div>
        `
    }
}