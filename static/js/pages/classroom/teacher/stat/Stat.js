import Component from "./core/Component.js"
import { store } from "./core/Store.js"
import StatView from "./StatView.js"
import StatModel from "./StatModel.js";

import { ContentHeader } from "../../components/ContentHeader";

import DashboardInfo from "./container/InfoContainer/DashboardInfo.js";
import DashboardStat from "./container/StatContainer/DashboardStat.js";
import DashboardToday from "./container/TodayContainer/DashboardToday.js";
import DashboardLesson from "./container/LessonResultContainer/DashboardLesson.js";
import DashboardEvery from "./container/EveryStudentContainer/DashboardEvery.js"
import DashboardEach from "./container/EachStudentContainer/DashboardEach.js"

export default class Stat extends Component {
    constructor(target) {
        super(target, new StatView(target));
        this._model = new StatModel();
    }

    async initState() {
        await loadData(0)
            .then((result) => {
                this._model.setState(result)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {

            })
    }

    mounted() {
        const { studentStat } = this._model.getAllStatByResult()
        const { totalProgress, totalPoint } = this.totalAverage(studentStat)
        const { todayLessonResult } = this._model.getTodayLessonResult()
        const { scheduledCourse, selectedStudent, selectedClass, selectStudentListener } = this
        const selectClassListener = this.selectClass.bind(this)


        // const $dashboardInfo = this.$target.querySelector('[data-component="dashboard-info"]');
        const $dashboardStat = this.$target.querySelector('[data-component="dashboard-stat"]');
        const $dashboardToday = this.$target.querySelector('[data-component="dashboard-today"]');
        const $dashboardLesson = this.$target.querySelector('[data-component="dashboard-lesson"]');
        const $dashboardEvery = this.$target.querySelector('[data-component="dashboard-every"]');
        const $dashboardEach = this.$target.querySelector('[data-component="dashboard-each"]');

        // this.clHeader = new ContentHeader({ parent: this.elThis, title: this.title });

        // new DashboardInfo($dashboardInfo, {})
        new DashboardStat($dashboardStat, { totalProgress, totalPoint, selectedClass, selectClassListener})
        new DashboardToday($dashboardToday, {scheduledCourse})
        new DashboardLesson($dashboardLesson, {todayLessonResult})
        // new DashboardEvery($dashboardEvery, { studentStat, selectStudentListener })
        // new DashboardEach($dashboardEach, { selectedStudent })

    }

    totalAverage (studentStat) {
        let totalProgress = studentStat.reduce((a, b) => a + b.studentProgress, 0) / studentStat.length
        let totalPoint = studentStat.reduce((a, b) => a + b.studentPoint, 0) / studentStat.length

        return { totalProgress, totalPoint }
    }

    get allStudentStat() {
        const { chapterStat, progressStat, pointStat } = this._model.getAllStatByResult()
        const { totalProgress, totalPoint } = this.totalAverage(progressStat, pointStat)
    }

    get scheduledCourse() {
        return this._model.getScheduledCourse()
    }


    selectStudentListener(seq) {
        // console.log( seq )
        store.setState({ selectedStudent: seq })
    }

    get selectedStudent() {
        const { studentStat } = this._model.getAllStatByResult()
        const { selectedStudent } = store.state

        // console.log(selectedStudent)
        
        return studentStat.filter(({id}) => id == selectedStudent)[0] 
    }

    async selectClass(seq) {
        await loadData(seq)
            .then((result) => {
                this._model.setState(result)
            }).then(() => {
                store.setState({selectedClass:seq})
            })

    }

    get selectedClass() {
        const { selectedClass } = store.state

        return selectedClass
    }
}

//--------------url---------------
async function urlGetCourse() {
    try{
        const data = await fetch('/static/js/pages/classroom/teacher/stat/data/data.json');
        const result = await data.json();

        return result
    } catch(error) {
        console.log(error)
    }
}

async function urlGetStudentResult() {
    try{
        let studentsResult = []
        let studentName = ['강우석', '윤상아', '김예훈', '정혜미', '전신혜', '서영호', '임성희', '강지영', '문영빈', '정기용', '남궁지윤', '백현기', '복희아', '조규환', '황진수', '강상식', '이대성', '송은혁', '정영숙', '백채영', '설윤석', '임민선', '박연희', '송용현', '오주아', '최희훈', '홍선우', '심창민', '강승재', '홍기하']
        for(let i = 0; i < 30; i++){
            const data = await fetch(`../../data/student${i+1}.json`);
            const result = await data.json();

            studentsResult.push({id:i, name:studentName[i], result:result})
        }

        return studentsResult
    } catch(error) {
        console.log(error)
    }
}

async function urlGetClassResult(seq) {
    try{
        // const { selectedClass } = store.state
        const data = await fetch(`/static/js/pages/classroom/teacher/stat/data/class${seq}.json`);
        const result = await data.json();
        
        return result
    } catch(error) {
        console.log(error)
    }
}

// -------------api---------------
async function loadData(seq) {
    try{
        let getCoursePromise = urlGetCourse()
        let getClassResultPromise = urlGetClassResult(seq)

        let course = await getCoursePromise
        let studentsResult = await getClassResultPromise

        return {course, studentsResult}
    } catch(error) {
        console.log(error)
    }
}
