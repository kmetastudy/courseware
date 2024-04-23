import View from "../../../classroom/teacher/stat/core/View.js";

export default class CourseImportView extends View {
    constructor(target) {
        super(target)
    }

    template() {
        return `
            <section data-component='course-import'></section>
            <section data-component='course-list'></section>
        `
    }
}