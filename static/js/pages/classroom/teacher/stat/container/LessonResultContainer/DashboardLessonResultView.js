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
            <div class="p-8 pt-0 grid grid-cols-12 gap-2">
                <div class="p-4 col-span-6 2xl:col-span-3 bg-base-100 border rounded-xl shadow-xl">
                    <h2>수업 진행률</h2>
                    <div data-component="chart-progress"></div>
                    <div class="">
                        <p class="text-end">※ 1단원 1차시 진행중</p>
                    </div>
                </div>
                <div class="col-span-6 2xl:col-span-3 flex flex-col gap-2">
                    <div class="h-1/2 p-4 bg-base-100 border rounded-xl shadow-xl">
                        <h2>평균 참여도</h2>
                        <p class="text-end text-bold text-xl"><span class="avg-progress">0</span> %</p>
                    </div>
                    <div class="h-1/2 p-4 bg-base-100 border rounded-xl shadow-xl">
                        <h2>평균 점수</h2>
                        <p class="text-end text-bold text-xl"><span class="avg-point">0</span> 점</p>
                    </div>
                </div>
                <div class="col-span-12 2xl:col-span-6 p-4 bg-base-100 border rounded-xl shadow-xl">
                    <h2>요약</h2>
                    <div data-component="chart-summary"></div>
                </div>
                <div class="p-4 col-span-3 bg-base-100 border rounded-xl shadow-xl" data-component="section-schedule">
                    <h2>수업</h2>
                </div>
                <div class="p-4 col-span-9 bg-base-100 border rounded-xl shadow-xl" data-component="section-correct">
                    <h2>문항별 정답률</h2>
                    <div class="" data-component="chart-stacked"></div>
                </div>
                <div class="p-4 col-span-12 bg-base-100 border rounded-xl shadow-xl">
                    <h2>전체 학생</h2>
                    <div class="" data-component="list-students-result">
                                
                    </div>
                </div>
            </div>
            
            
        `
    }
}