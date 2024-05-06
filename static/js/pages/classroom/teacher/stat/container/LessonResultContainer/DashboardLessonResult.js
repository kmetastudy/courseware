import Component from "../../core/Component.js";
import { statStore } from "../../core/Store.js";

import DashboardLessonResultView from "./DashboardLessonResultView.js"
import LessonStudentsList from "../../layout/templates/LessonStudentsList.js";
import SectionChange from "../../layout/organisms/SectionChange.js";
import CourseProgress from "../../layout/templates/CourseProgress.js";
import StackedBar from "../../layout/templates/StackedBar.js"
import ChapterSummaryLineColumnChart from "../../layout/templates/ChapterSummaryLineColumnChart.js";
import ChapterSummaryColumnChart from "../../layout/templates/ChapterSummaryColumnChart.js";
import ScheduleSummaryHeatMap from "../../layout/templates/ScheduleSummaryHeatMap.js";
import ScheduleStudentHeatMap from "../../layout/templates/ScheduleStudentHeatMap.js";
import LessonToday from "../../layout/organisms/LessonToday.js";

export default class DashboardLessonResult extends Component{
    constructor(target, model, props) {
        super(target, new DashboardLessonResultView(target), props)
        this._model = model
    }

    initState() {
        // statStore.setState({ selectedChapter: chapter})
        // statStore.setState({ selectedPeriod: period })
        // statStore.setState({ selectedSchedule: schedule })
    }

    mounted() {
        const {selectedSchedule, selectedSection, selectedStudent} = this
        const classStat = this._model.getClassStat(selectedSchedule.schedule, selectedSchedule.period)
        const studentStat = this._model.getStudentStat(selectedSchedule.schedule, selectedSchedule.period)
        console.log(selectedSchedule)
        console.log(classStat)
        console.log(studentStat)
        
        const $titleChapterLesson = this.$target.querySelector('[data-component="title-chapter-lesson"]')

        const $chartProgress = this.$target.querySelector('[data-component="chart-progress"]')
        const $chartSummary = this.$target.querySelector('[data-component="chart-summary"]')

        const $sectionSchedule = this.$target.querySelector('[data-component="section-schedule"]')
        const $sectionCorrect = this.$target.querySelector('[data-component="section-correct"]')
        const $chartStacked = this.$target.querySelector('[data-component="chart-stacked"]')
        
        const $summaryChapterLesson = this.$target.querySelector('[data-component="summary-chapter-lesson"]')
        const $listStudentsResult = this.$target.querySelector('[data-component="list-students-result"]')
        const $summaryStudentsResult = this.$target.querySelector('[data-component="summary-students-result"]')

        // 통계 제목 (전체, 단원, 단원+차시)
        const chapter = selectedSchedule.chapter?selectedSchedule.chapter:'전체 단원'
        const period = selectedSchedule.period==0?'전체 ':selectedSchedule.period
        $titleChapterLesson.innerHTML = `<ul>
                                            <li><button>${chapter}</button></li>
                                            ${period?`<li><button>${period}차시</button></li>`:``}
                                        </ul>`

        // 선택된 스케줄의 반 평균 진행률, 정답률
        CourseProgress({target:$chartProgress, data:[70]})
        this.$target.querySelector('.avg-progress').innerHTML = classStat.progress
        this.$target.querySelector('.avg-point').innerHTML = classStat.point
        ChapterSummaryLineColumnChart({target:$chartSummary, data:classStat.classSummary, type:selectedSchedule.period})

        // 선택된 스케줄의 문항별 정답률
        if(!selectedSchedule.period) {
            $sectionSchedule.style.display = 'none'
            $sectionCorrect.style.display = 'none'
        } else {
            $sectionSchedule.innerHTML = SectionChange({seq:selectedSection, courses:classStat.classSummary.scheduleBranches})
            StackedBar({target:$chartStacked})
        }
        // 전체 학생 결과
        $listStudentsResult.innerHTML = LessonStudentsList(studentStat)

        // if(!Number.isInteger(selectedSchedule.period)){
            
        // } else if(selectedSchedule.period == 0){
        //     // 선택된 스케줄의 요약
        //     ChapterSummaryLineColumnChart({target:$summaryChapterLesson, data:classStat.classSummary})

        //     // 선택된 학생의 요약
        //     let student = studentStat.find((obj) => obj.id_student == selectedStudent)
        //     if(!student || student.length == 0) student = studentStat[0]
        //     ChapterSummaryColumnChart({target:$summaryStudentsResult, class:classStat.classSummary, student:student.studentSummary})
        // } else {

        //     $summaryChapterLesson.innerHTML = ScheduleSummaryHeatMap({data:classStat.classSummary})
        //     let student = studentStat.find((obj) => obj.id_student == selectedStudent)
        //     if(!student || student.length == 0) student = studentStat[0]
        //     $summaryStudentsResult.innerHTML = ScheduleStudentHeatMap({data:student.studentSummary})
        // }
        
    }

    setEvent() {
        this.addEvent('click', '.selectStudent', ({target}) => {
            // console.log(target.closest('[data-seq]').dataset.seq)
            let student = target.closest('[data-id]').dataset.id
            this.selectStudentListener(student)
        })

        this.addEvent("click", ".selectSection", ({ target }) => {
            const selectedSection = parseInt(target.closest("[data-seq]").dataset.seq);
      
            // this.selectSectionListener(target.closest("[data-seq]").dataset.seq);
            this.selectSectionListener(selectedSection);
        });
    }
    
    get selectedSection() {
      const { selectedSection } = statStore.state;
      const { todayChartData } = this._props;

      const contentResults = todayChartData[selectedSection];

      const correct = contentResults.result.flat().map((x) => {
        return x[0];
      });

      const wrong = contentResults.result.flat().map((x) => {
        return x[1];
      });

      const fixed = contentResults.result.flat().map((x) => {
        return x[2];
      });

      const notStarted = contentResults.result.flat().map((x) => {
        return x[3];
      });

      const categories = [];
      const groups = [];
      contentResults.result.forEach((result, idx) => {
        const { length } = result;
        groups.push({ title: `수업${idx + 1}`, cols: length });
        for (let i = 1; i < length + 1; i++) {
          categories.push(`Q${i}`);
        }
      });

      return { seq: selectedSection, todayChartData, correct, wrong, fixed, notStarted, categories, groups };
    }

    selectSectionListener(seq) {
      statStore.setState({ selectedSection: seq });
    }

    get selectedSchedule() {
        const {selectedSchedule} = statStore.state
        return selectedSchedule
    }

    get selectedStudent() {
        const {selectedStudent} = statStore.state
        return selectedStudent
    }

    selectStudentListener(seq) {
        statStore.setState({ selectedStudent: seq })
    }

}