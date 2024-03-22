import View from "../../core/View.js"
import LessonChange from "../../layout/organisms/LessonChange.js"
import RankingList from "../../layout/templates/RankingList.js"
import LessonStudentsList from "../../layout/templates/LessonStudentsList.js";

export default class DashboardLessonView extends View {
    constructor(target) {
        super(target);
    }

    template(state) {
        const {scheduledCourse} = state

        let students = [
            {name:'김민지', learningRate:90, correct:16},
            {name:'김가네', learningRate:50, correct:10},
            // {name:'김가연', learningRate:20, correct:2},
            // {name:'송한나', learningRate:40, correct:8},
            // {name:'전수현', learningRate:70, correct:12},
            // {name:'한소연', learningRate:20, correct:4},
        ]
        let questions = [
            {type:'test', q:'2', num:'10'},
            {type:'lesson', q:'2', num:'15'},
        ]
        return `
            <div class="card-body grow-0">
                <h2 class="card-title">수업 결과</h2>
            </div>
            <div class="p-8 pt-0 flex h-[300px] xl:h-[400px] gap-4">
                <div class="p-2 w-1/2">
                    ${LessonChange(scheduledCourse[0])}
                    <div class="p-2 w-full flex justify-center" data-component="lesson-result"></div>    
                </div>
                <div class="w-1/2 flex flex-col justify-around">
                    <div>
                        <div class="badge badge-outline">많이 틀린 문제</div>
                        ${RankingList(questions)}
                    </div>
                    <div>
                        <div class="badge badge-outline">도움이 필요한 학생</div>
                        ${LessonStudentsList(students)}
                    </div>
                    
                </div>
            </div>
        `
    }
}