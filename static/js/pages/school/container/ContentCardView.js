import View from "../../classroom/teacher/stat/core/View.js";

export default class ContentCardView extends View {
    constructor(target) {
        super(target)
    }

    template(state) {
        const {filteredContents, currentPage, countPerPage} = state

        let start = countPerPage*(currentPage-1)
        let end = (countPerPage*currentPage)

        const contents = filteredContents.slice(start,end)

        return `
            ${contents.map((content) => {
                return `
                    <div class="cursor-pointer">
                        <img class="rounded-[8px]" src="/static/img/thumnail/${content.course.thumnail}.png">
                        <div class="text-[14px] text-[#474747]" style="padding-top: 20px;">${content.course.courseTitle}</div>
                    </div>
                `
            }).join('')}
        `
    }
}

// ${startURL}/courses/${course.course.school}/${course.course.subject}/${course.id}