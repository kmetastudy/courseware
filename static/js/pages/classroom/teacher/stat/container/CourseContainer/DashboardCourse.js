import Component from "../../core/Component.js";

import DashboardCourseView from "./DashboardCourseView.js"

export default class DashboardCourse extends Component{
    constructor(target, props) {
        super(target, new DashboardCourseView(target), props)
    }

    mounted() {


    }

    get selectedLesson() {
        const {scheduledCourse} = this._props
        
        return scheduledCourse
    }

}