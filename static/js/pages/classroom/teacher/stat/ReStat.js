import { extract } from "../../../../core/utils/array";

import { store } from "../Store.js";
import { statStore } from "./core/Store.js"
import { apiClass } from "../../../../core/api/class";
import { apiUser } from "../../../../core/api/user";
import { apiCp } from "../../../../core/api/cp";

import Component from "./core/Component.js"
import StatView from "./ReStatView.js"
import StatModel from "./StatModel.js";

import { ContentHeader } from "../../components/ContentHeader.js";

import DashboardCourse from "./container/CourseContainer/DashboardCourse.js"
import DashboardLessonResult from "./container/LessonResultContainer/DashboardLessonResult.js";

export default class Stat extends Component {
    constructor(target) {
        super(target, new StatView(target));
        this._model = new StatModel();
        store.subscribe("classId", this.initState.bind(this));
        store.subscribe("courseId", this.initState.bind(this));
    }

    async initState() {
        if (!store.hasState("classId") || !store.hasState("courseId")) {
            return;
        }
      
        const classId = store.getState("classId");
        const courseId = store.getState("courseId");

        await loadData({ classId, courseId })
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
        const schedules = this._model.composeSchedule()

        const $dashboardCourse = this.$target.querySelector('[data-component="dashboard-course"]');
        const $dashboardResult = this.$target.querySelector('[data-component="dashboard-result"]');

        // this.clHeader = new ContentHeader({ parent: this.elThis, title: this.title });

        new DashboardCourse($dashboardCourse, {schedules})
        new DashboardLessonResult($dashboardResult, this._model, {})
    }

    setEvent() {
        this.addEvent('click', '.selectSchedule', ({target}) => {
            // console.log(target.closest('[data-seq]').dataset.seq)
            let chapter = target.closest('[data-chapter]').dataset.chapter
            let period = target.closest('[data-period]').dataset.period
            let schedule = target.closest('[data-schedule]').dataset.schedule
            this.selectScheduleListener(chapter, period, schedule)
        })
    }

    get selectedStudent() {
        const { studentStat } = this._model.getAllStatByResult()
        const { selectedStudent } = statStore.state

        // console.log(selectedStudent)
        
        return studentStat.filter(({id}) => id == selectedStudent)[0] 
    }

    selectStudentListener(seq) {
        // console.log( seq )
        statStore.setState({ selectedStudent: seq })
    }

    selectScheduleListener(chapter, period, schedule) {
        console.log(chapter, period, schedule)
        statStore.setState({ selectedSchedule: {chapter:chapter, period:JSON.parse(period), schedule:JSON.parse(schedule)}})
    }

}

//--------------url---------------
// -------------api---------------
async function loadData({ classId, courseId }) {
    try {
      const course = apiCp.course.get(courseId);
      const classContentAssign = apiClass.classContentAssign.filter({ id_class: classId, id_course: courseId });
      const classStudyResults = apiClass.studyResult.filter({ id_class: classId, id_course: courseId });
  
      const promises = [course, classContentAssign, classStudyResults];
  
      const promiseNames = ["course", "classContentAssign", "studyResults"];
  
      const data = {};
  
      await Promise.allSettled(promises).then((results) => {
        results.forEach((result, index) => {
          if (result.status === "fulfilled" && result.value.data) {
            data[promiseNames[index]] = result.value.data;
          } else {
            data[promiseNames[index]] = [];
          }
        });
      });
  
      const studentIds = extract(data.studyResults, "id_student");
      console.log({studentIds});
  
      const usersResponse = await apiUser.user.filter({ id__in: studentIds.join(",") });
      data["users"] = usersResponse.data;
      console.log(data);
  
      return data;
    } catch (error) {
      console.log(error);
    }
  }
