import Component from "../../../classroom/teacher/stat/core/Component.js";

import CourseModel from "./CourseModel.js"
import CourseView from "./CourseView.js"

import CourseImport from "./CourseImport.js";

export default class Course extends Component {
    constructor(target) {
        super(target, new CourseView(target))
        this._model = new CourseModel()
    }

    mounted() {
        const $courseImport = this.$target.querySelector('[data-component="course-import"]')
        const $courseList = this.$target.querySelector('[data-component="course-list"]')

        new CourseImport($courseImport, {})
    }

    setEvent() {

    }
}