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
            <div class="p-8 pt-0 flex">
                <div class="flex-1 flex" data-component="stat-chapter-lesson">
                    <div class="stat">
                        <div class="stat-title">평균 진행률</div>
                        <div class="flex justify-around items-center">
                            <div class="radial-progress bg-base-200 border-4 border-base-200" style="--value:10;" role="progressbar" data-component="progress">0%</div>
                        </div>
                    </div>
                    <div class="stat">
                        <div class="stat-title">평균 정답률</div>
                        <div class="flex justify-around items-center">
                            <p></p>
                            <div class="radial-progress bg-base-200 border-4 border-base-200" style="--value:10;" role="progressbar" data-component="point">0%</div>
                        </div>
                    </div>
                </div>
                <div class="p-2 w-1/2">
                    <div class="card card-compact w-full bg-base-100 shadow-xl">
                        <div class="card-body">
                            <h2 class="card-title" data-component="title-class-summary">단원 요약</h2>
                            <div class="" data-component="summary-chapter-lesson"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-8 pt-0 h-full flex">
                <div class="h-full flex-1 overflow-y-auto">
                    <p class="">전체 학생</p>
                    <div class="p-2 flex">
                        <div class="flex-1 flex flex-col gap-2 ">
                            <div class="" data-component="list-students-result">
                                
                            </div>
                        </div>   
                    </div>
                </div>
                <div class="p-2 w-1/2 h-full ">
                    <div class="card card-compact w-full h-full bg-base-100 shadow-xl">
                        <div class="card-body">
                            <h2 class="card-title" data-component="title-student-summary">김민지</h2>
                            <div class="" data-component="summary-students-result"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            
        `
    }
}