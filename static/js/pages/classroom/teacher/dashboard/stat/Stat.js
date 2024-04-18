import { extract } from "../../../../../core/utils/array";

import { store } from "../../Store.js";
import { apiClass } from "../../../../../core/api/class";
import { apiUser } from "../../../../../core/api/user";
import { apiCp } from "../../../../../core/api/cp";

import Component from "./core/Component.js";
import { statStore } from "./StatStore.js";
import StatView from "./StatView.js";

import { StatModelNew } from "./StatModelNew.js";

import DashboardStat from "./container/StatContainer/DashboardStat.js";
import DashboardToday from "./container/TodayContainer/DashboardToday.js";
import DashboardLesson from "./container/LessonResultContainer/DashboardLesson.js";

export default class Stat extends Component {
  constructor(target, props) {
    super(target, new StatView(target), props);
    // this._model = new StatModel();
    this._model = new StatModelNew();
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
        this._model.setState(result);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  }

  mounted() {
    // DashboardStat
    const totalProgress = this._model.getClassAverage("progress");
    const totalPoint = this._model.getClassAverage("point");

    const progressLow = this._model.countStudentsBetween(-1, 30, "progress");
    const progressMiddle = this._model.countStudentsBetween(31, 70, "progress");
    const progressHigh = this._model.countStudentsBetween(71, 100, "progress");

    // DashboardToday
    const todayScheduler = this._model.getTodayScheduler();
    const todayChapter = this._model.getTodayChapter();
    const { completedStudents, inProgressStudents, notStartedStudents } = this._model.getTodayStudentProgressStatus();

    // DashboardLesson
    const todayChartData = this._model.getTodayChartData();

    const studentStatus = this._model.getTodayStudentStatus();
    const studentCount = this._model.getStudentCount();
    const questionCounts = this._model.getTodayQuestionCounts();

    const $dashboardStat = this.$target.querySelector('[data-component="dashboard-stat"]');
    const $dashboardToday = this.$target.querySelector('[data-component="dashboard-today"]');
    const $dashboardLesson = this.$target.querySelector('[data-component="dashboard-lesson"]');

    new DashboardStat($dashboardStat, { totalProgress, totalPoint, progressLow, progressMiddle, progressHigh });
    new DashboardToday($dashboardToday, {
      todayScheduler,
      todayChapter,
      completedStudents,
      inProgressStudents,
      notStartedStudents,
    });

    new DashboardLesson($dashboardLesson, { todayChartData, studentCount, studentStatus, questionCounts });
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

    const usersResponse = await apiUser.user.filter({ id__in: studentIds.join(",") });
    data["users"] = usersResponse.data;

    return data;
  } catch (error) {
    console.log(error);
  }
}
