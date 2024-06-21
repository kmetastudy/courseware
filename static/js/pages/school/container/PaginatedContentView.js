import View from "../../classroom/teacher/stat/core/View.js";

export default class CategoryPaginatedContentView extends View {
    constructor(target) {
        super(target)
    }

    template(state) {
        return `
            <div data-component="content" class="grid grid-cols-6" style="column-gap: 20px; row-gap: 40px;"></div>
            <div data-component="pagination" style="margin: 80px 0;"></div>
        `
    }
}