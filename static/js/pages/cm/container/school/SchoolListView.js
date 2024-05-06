import View from "../../../classroom/teacher/stat/core/View"

export default class SchoolListView extends View {
    constructor(target) {
        super(target)
    }

    template(state) {
        const {school} = state
        return `
            <ul class="h-full menu bg-base-100 rounded-box">
                <li class="menu-title">학교</li>
                <button class="addSchool btn">추가</button>
                ${school.map(({title}, index) => {
                    return `
                        <li>
                            <button class="selectSchool" data-seq="${index}">${title}</button>
                        </li>
                    `
                }).join("")}
            </ul>
        `
    }
}
