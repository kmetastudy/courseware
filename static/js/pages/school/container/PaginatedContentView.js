import View from "../../classroom/teacher/stat/core/View.js";

export default class CategoryPaginatedContentView extends View {
    constructor(target) {
        super(target)
    }

    template(state) {
        return `
            <div data-component="content" class="contentGrid grid" style="column-gap: 20px; row-gap: 40px;"></div>
            <div data-component="pagination" style="margin-top: 40px; margin-bottom: 80px;"></div>
        `
    }
}