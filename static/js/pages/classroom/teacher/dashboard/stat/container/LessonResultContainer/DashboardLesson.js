import Component from "../../core/Component.js";
import { statStore } from "../../StatStore.js";
import { MtuIcon } from "../../../../../../../core/mtu/icon/mtu-icon.js";
import DashboardLessonView from "./DashboardLessonView.js";
import SectionChange from "../../layout/organisms/SectionChange.js";

export default class DashboardLesson extends Component {
  constructor(target, props) {
    super(target, new DashboardLessonView(target), props);
  }

  mounted() {
    // const { selectedSection } = this;
    const { studentCount, todayChartData: charts } = this._props;

    const $sectionStatus = this.$target.querySelector('[data-component="section-status"]');
    const $sectionEmpty = this.$target.querySelector('[data-component="section-empty"]');
    const $sectionEmptyLesson = this.$target.querySelector('[data-component="empty-card"]');

    if (!studentCount) {
      $sectionStatus.classList.add("hidden");
      $sectionEmpty.classList.remove("hidden");
      return;
    } else if (charts.length === 0) {
      $sectionStatus.classList.add("hidden");
      $sectionEmptyLesson.classList.remove("hidden");
      return;
    }
    const { selectedSection } = this;

    $sectionStatus.classList.remove("hidden");
    $sectionEmpty.classList.add("hidden");

    const $sectionChange = this.$target.querySelector('[data-component="section-change"]');
    const $sectionResult = this.$target.querySelector('[data-component="section-result"]');

    const { seq, todayChartData, correct, wrong, fixed, notStarted, categories, groups } = selectedSection;

    $sectionChange.innerHTML = SectionChange({ seq, todayChartData });

    const options = {
      series: [
        {
          name: "정답",
          data: correct,
        },
        {
          name: "오답",
          data: wrong,
        },
        {
          name: "오답완료",
          data: fixed,
        },
        {
          name: "미응시",
          data: notStarted,
        },
      ],
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          tools: {
            download: false,
          },
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "left",
              offsetX: 0,
              offsetY: 0,
            },
          },
        },
      ],
      xaxis: {
        // categories: ["Q1", "Q2", "Q1", "Q2", "Q1", "Q2", "Q1", "Q2"],
        categories,
        group: {
          style: {
            fontSize: "10px",
            fontWeight: 700,
          },
          groups,
          // groups: [
          //   { title: "수업1", cols: 2 },
          //   { title: "수업2", cols: 2 },
          //   { title: "수업3", cols: 2 },
          //   { title: "수업4", cols: 2 },
          // ],
        },
      },
      yaxis: {
        type: "numeric",
        min: 0,
        // max: 30,
        max: studentCount,
        tickAmount: 3,
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        offsetX: 0,
        offsetY: 0,
      },
      theme: {
        palette: "palette2", // upto palette10
      },
    };

    const chart = new ApexCharts($sectionResult, options);
    chart.render();
  }

  setEvent() {
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

  selectLessonListener(seq) {
    statStore.setState({ selectedLesson: seq });
  }

  get selectedLessonResult() {
    const { selectedLesson } = statStore.state;
    const { scheduledCourse, studentsResult } = this._props;
    // console.log(studentsResult)

    let lessonResult = [];
    let lessonResultList = [];
    let selectedLessonResult = [];

    scheduledCourse[selectedLesson].courses.forEach((course) => {
      studentsResult.forEach((obj) => {
        let results = obj.result.filter((value) => value.id == course.id);
        // console.log(results)
        results[0].results.forEach((r) => {
          lessonResult.push(r.result);
        });
        let lessonResultVec = lessonResult.flat().map((x) => {
          if (x == "O") {
            return [1, 0, 0];
          } else if (x == "X") {
            return [0, 1, 0];
          } else {
            return [0, 0, 1];
          }
        });
        lessonResultList.push(lessonResultVec);
        lessonResult = [];
      });
      // console.log(lessonResultList)
      const result = lessonResultList.reduce((acc, cur) => {
        if (acc.length == 0) {
          acc = cur;
          return acc;
        }
        acc = this.matrixAdition(acc, cur);
        return acc;
      }, []);
      selectedLessonResult.push({ result, ...course });
      lessonResultList = [];
    });

    console.log(selectedLessonResult);

    return selectedLessonResult;
  }

  matrixAdition(a, b) {
    let resultArr = [];
    for (let i = 0; i < a.length; i += 1) {
      resultArr.push(a[i].map((x, y) => a[i][y] + b[i][y]));
    }
    return resultArr; // [[3, 6, 8,], [5, 7, 12,]]
  }
}
