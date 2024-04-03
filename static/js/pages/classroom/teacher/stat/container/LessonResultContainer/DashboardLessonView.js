import View from "../../core/View.js"
import Section from "../../layout/molecules/Section.js"
import RankingList from "../../layout/templates/RankingList.js"
import LessonStudentsList from "../../layout/templates/LessonStudentsList.js";

export default class DashboardLessonView extends View {
    constructor(target) {
        super(target);
    }

    template(state) {

        let students = [
            {name:'이서영', progress:77.5, point:1, numOfQuestion:18},
            {name:'임세희', progress:78.5, point:3, numOfQuestion:18},
            // {name:'김가연', learningRate:20, correct:2},
            // {name:'송한나', learningRate:40, correct:8},
            // {name:'전수현', learningRate:70, correct:12},
            // {name:'한소연', learningRate:20, correct:4},
        ]
        let questions = [
            {type:'lesson', q:'1', num:'13'},
            {type:'test', q:'3', num:'12'},
        ]
        return `
            <div class="card-body grow-0">
                <h2 class="card-title">오늘 수업 결과</h2>
            </div>
            <div class="p-8 pt-0 md:h-[450px] gap-4">
                <div class="p-2 flex flex-col md:flex-row">
                    <div class="flex-1 flex flex-col gap-2">
                        <div data-component="section-change"></div>
                        <div class="">
                            <div class="badge badge-outline">많이 틀린 문제</div>
                            ${RankingList(questions)}
                        </div>
                        <div class="">
                            <div class="badge badge-outline">도움이 필요한 학생</div>
                            ${LessonStudentsList(students)}
                        </div>
                    </div>
                    <div class="p-2 w-full md:w-1/2 flex justify-center" data-component="section-result"></div>    
                </div>
            </div>
        `
    }
}