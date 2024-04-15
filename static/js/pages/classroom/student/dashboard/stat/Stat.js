import { extract } from "../../../../../core/utils/array";

import { store } from "../../Store.js";
import { apiClass } from "../../../../../core/api/class";
import { apiUser } from "../../../../../core/api/user";
import { apiCp } from "../../../../../core/api/cp";

import Component from "./core/Component.js";
import { statStore } from "./StatStore.js";
import StatView from "./StatView.js";
import StatModel from "./StatModel.js";
import { StatModelNew } from "./StatModelNew.js";

import DashboardStat from "./container/StatContainer/DashboardStat.js";
import DashboardToday from "./container/TodayContainer/DashboardToday.js";
import DashboardLesson from "./container/LessonResultContainer/DashboardLesson.js";
import { mtoEvents } from "../../../../../core/utils/mto-events.js";

export default class Stat extends Component {
  constructor(target, props) {
    super(target, new StatView(target), props);
    // this._model = new StatModel();
    this._model = new StatModelNew();
    mtoEvents.on("onClassStudyResultUpdate", (data) => {
      console.log(data);
      console.log(data.json_data.property);
      this._model.setState("studyResult", data);
      this.mounted();
    });
    store.subscribe("userId", this.initState.bind(this));
    store.subscribe("classId", this.initState.bind(this));
    store.subscribe("courseId", this.initState.bind(this));
  }

  async initState() {
    const requiredStates = ["userId", "classId", "courseId"];
    const { length } = requiredStates;

    for (let i = 0; i < length; i++) {
      if (!store.hasState(requiredStates[i])) {
        return;
      }
    }

    const userId = store.getState("userId");
    const classId = store.getState("classId");
    const courseId = store.getState("courseId");

    await loadData({ userId, classId, courseId })
      .then((result) => {
        this._model.setState(result);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  }

  mounted() {
    const totalProgress = this._model.getAverageUpToToday("progress");
    const totalPoint = this._model.getAverageUpToToday("point");

    const { totalPeriod, completedPeriod, todayPeriod } = this._model.getPeriodInfo();

    const todayChapter = this._model.getTodayChapter(); // 오늘 차시에 해당하는 챕터 ({id, type:0, title:"", ...})

    const todayScheduler = this._model.getTodayScheduler();

    const todayStudyResults = this._model.getTodayResults();
    console.log(todayStudyResults);

    const $dashboardStat = this.$target.querySelector('[data-component="dashboard-stat"]');
    const $dashboardToday = this.$target.querySelector('[data-component="dashboard-today"]');
    const $dashboardLesson = this.$target.querySelector('[data-component="dashboard-lesson"]');
    // const $dashboardChapterChart = this.$target.querySelector('[data-component="dashboard-chapter-chart"]');

    new DashboardStat($dashboardStat, { totalProgress, totalPoint, totalPeriod, completedPeriod, todayPeriod });
    new DashboardToday($dashboardToday, { todayScheduler, todayChapter });
    // new DashboardLesson($dashboardLesson, { todayLessonResult: todayStudyResults });
  }

  totalAverage(studentStat) {
    let totalProgress = studentStat.reduce((a, b) => a + b.studentProgress, 0) / studentStat.length;
    let totalPoint = studentStat.reduce((a, b) => a + b.studentPoint, 0) / studentStat.length;

    return { totalProgress, totalPoint };
  }

  get allStudentStat() {
    const { chapterStat, progressStat, pointStat } = this._model.getAllStatByResult();
    const { totalProgress, totalPoint } = this.totalAverage(progressStat, pointStat);
  }

  get scheduledCourse() {
    return this._model.getScheduledCourse();
  }

  selectStudentListener(seq) {
    // console.log( seq )
    statStore.setState({ selectedStudent: seq });
  }

  get selectedStudent() {
    const { studentStat } = this._model.getAllStatByResult();
    const { selectedStudent } = statStore.state;

    // console.log(selectedStudent)

    return studentStat.filter(({ id }) => id == selectedStudent)[0];
  }

  async selectClass(seq) {
    await loadData(seq)
      .then((result) => {
        this._model.setState(result);
      })
      .then(() => {
        statStore.setState({ selectedClass: seq });
      });
  }

  get selectedClass() {
    const { selectedClass } = statStore.state;

    return selectedClass;
  }
}

// -------------api---------------
async function loadData({ userId, classId, courseId }) {
  try {
    const course = apiCp.course.get(courseId);
    const classContentAssign = apiClass.classContentAssign.filter({ id_class: classId, id_course: courseId });
    const classStudyResult = apiClass.studyResult.filter({
      id_class: classId,
      id_course: courseId,
      id_student: userId,
    });
    const user = apiUser.user.get(userId);

    const promises = [course, classContentAssign, classStudyResult, user];

    const promiseNames = ["course", "classContentAssign", "studyResult", "user"];

    const data = {};

    await Promise.allSettled(promises).then((results) => {
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value.data) {
          if (Array.isArray(result.value.data) && result.value.data.length > 0) {
            data[promiseNames[index]] = result.value.data[0];
          } else {
            data[promiseNames[index]] = result.value.data;
          }
        } else {
          data[promiseNames[index]] = {};
        }
      });
    });

    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
}
