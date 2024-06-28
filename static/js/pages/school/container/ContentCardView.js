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

        let pathname = window.location.pathname
        let splitedPath = pathname.split('/')
        let startURL = ''
        if(splitedPath.includes('school')) startURL = '.'
        else startURL = ''

        return `
            ${contents.map((content) => {
                return `
                    <div class="cursor-pointer" onclick="window.location='${startURL}/courses/${content.course.courseId}'">
                        <img class="thumnailMobile rounded-[8px]" src="/static/img/thumnail/${content.course.thumnail}.png">
                        <div class="text-[14px] text-[#474747] break-keep" style="padding-top: 20px; height:62px;">${content.course.courseTitle}</div>
                    </div>
                `
            }).join('')}
        `
    }
}

// ${startURL}/courses/${course.course.school}/${course.course.subject}/${course.id}