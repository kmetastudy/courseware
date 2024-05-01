import View from "../../core/View.js"

import LessonToday from "../../layout/organisms/LessonToday.js";

export default class DashboardCourseView extends View {
    constructor(target) {
        super(target);
    }

    template(state) {
        const {schedules} = state
        console.log(schedules)
        return `
            <div class="card-body grow-0">
                <h2 class="card-title">단원 선택</h2>
            </div>
            <div class="pt-0 flex flex-col gap-8 overflow-y-auto" data-component="menu-chapter">
                <ul class="menu w-full">
                    <li>
                        <button class='selectSchedule' data-chapter='전체 단원' data-schedule='null' data-period='null'>전체 단원</button>
                    </li>
                    ${schedules.map((chapter, index) => {
                        return `<li>
                                    <details ${index==0?'open':''}>
                                        <summary>${chapter["chapter"][0].title}</summary>
                                        <ul>
                                            ${Object.keys(chapter).map((key,index) => {
                                                return `<li><button class='selectSchedule' data-chapter='${chapter["chapter"][0].title}' data-schedule='${JSON.stringify(chapter[key].map((item) => item.id))}' data-period='${index}'>${index==0?'전체':index+'차시'} <span class="text-end text-sm text-gray-400">${key}</span></button></li>`
                                            }).join('')}
                                        </ul>
                                    </details>
                                </li>
                        `
                    }).join('')}
                </ul>
            </div>
        `
    }
}