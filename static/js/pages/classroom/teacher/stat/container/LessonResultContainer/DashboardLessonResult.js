import Component from "../../core/Component.js";
import { store } from "../../core/Store.js";

import DashboardLessonResultView from "./DashboardLessonResultView.js"
import LessonStudentsList from "../../layout/templates/LessonStudentsList.js";
import SectionChange from "../../layout/organisms/SectionChange.js";

export default class DashboardLessonResult extends Component{
    constructor(target, props) {
        super(target, new DashboardLessonResultView(target), props)
    }

    mounted() {
        const {selectedLesson} = this
        const {selectedLessonStat, progress, correct} = this.getSelectedLessonStat(selectedLesson)
        const {scheduledCourse} = this._props

        const chapter = scheduledCourse[selectedLesson].chapter
        const lesson = scheduledCourse[selectedLesson].lesson
        
        const $titleChapterLesson = this.$target.querySelector('[data-component="title-chapter-lesson"]')
        const $statChapterLesson = this.$target.querySelector('[data-component="stat-chapter-lesson"]')
        const $listStudentsResult = this.$target.querySelector('[data-component="list-students-result"]')

        $titleChapterLesson.innerHTML = `<ul>
                                            <li><button>${chapter}</button></li>
                                            <li><button>${lesson}차시</button></li>
                                        </ul>`
        this.$target.querySelector('[data-component="progress"]').style.setProperty('--value', `${progress}`)
        this.$target.querySelector('[data-component="progress"]').innerHTML = `${progress.toFixed(0)}%`
        this.$target.querySelector('[data-component="correct"]').style.setProperty('--value', `${correct}`)
        this.$target.querySelector('[data-component="correct"]').innerHTML = `${correct.toFixed(0)}%`

        $listStudentsResult.innerHTML = LessonStudentsList(selectedLessonStat)
    }

    get selectedLesson() {
        const {selectedLesson} = store.state
        return selectedLesson
    }

    getSelectedLessonStat(selectedLesson) {
        const {scheduledCourse, studentStat, studentsResult} = this._props
        const selectedLessonIds = scheduledCourse[selectedLesson].courses.map((obj) => {
            return obj.id
        })

        // console.log(scheduledCourse[selectedLesson])
        let progress = 0
        let correct = 0

        const selectedLessonStat = studentsResult.map((obj) => {
            let id = obj.id
            let name = obj.name
            let result = obj.result.filter(({id}) => selectedLessonIds.includes(id))
            let progress = result.reduce((a, b) => a + b.progress, 0) / result.length
            let point = result.reduce((a, b) => a + b.point, 0)
            let numOfQuestion = result.reduce((a,b) => a + b.results.reduce((a,b) => a + b.result.length, 0),0)
            let correct = point / numOfQuestion
            return {id, name, result, progress, point, correct, numOfQuestion}
        })
        // console.log(selectedLessonStat)

        progress = selectedLessonStat.reduce((a, b) => a + b.progress, 0) / selectedLessonStat.length
        correct = selectedLessonStat.reduce((a, b) => a + b.correct, 0) / selectedLessonStat.length * 100
        // console.log(correct)
        return {selectedLessonStat, progress, correct}
    }

}