import View from "../../core/View.js"

import LessonToday from "../../layout/organisms/LessonToday.js";

export default class DashboardCourseView extends View {
    constructor(target) {
        super(target);
    }

    template(state) {
        const {scheduledCourse, allChapter} = state
        console.log(allChapter)
        console.log(scheduledCourse)

        return `
            <div class="card-body grow-0">
                <h2 class="card-title">단원 선택</h2>
            </div>
            <div class="pt-0 flex flex-col gap-8 overflow-y-auto" data-component="menu-chapter">
                <ul class="menu w-full">
                    ${allChapter.map((chapter, index) => {
                        return `<li>
                                    <details ${index==0?'open':''}>
                                        <summary>${chapter.title}</summary>
                                        <ul>
                                            ${scheduledCourse.filter((course) => course.chapter == chapter.title)
                                                .map((obj, index) => {
                                                    return `<li><button class="selectLesson" data-seq="${obj.seq}">${obj.lesson}차시 <span class="text-end text-sm text-gray-400">${obj.date}</span></button></li>`
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