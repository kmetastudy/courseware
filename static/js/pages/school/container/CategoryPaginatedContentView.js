import View from "../../classroom/teacher/stat/core/View.js";
import Category from "../layout/CategoryPaginatedContentView/Category.js";
import CategoryWithLine from "../layout/CategoryPaginatedContentView/CategoryWithLine.js";

export default class CategoryPaginatedContentView extends View {
    constructor(target) {
        super(target)
    }

    template(state) {
        const {sections} = state
        // console.log(sections)
        return `
            <div class="">
                ${this.isCoursePage()?CategoryWithLine(sections):Category(sections)}
                <div data-component="paginatedContent" class="px-[20px] min-[744px]:px-[15px]"></div>
            </div>
        `
    }

    isCoursePage() {
        let pathname = window.location.pathname
        let splitedPath = pathname.split('/')
        if (splitedPath.includes('school')) return false
        else return true
    }
}