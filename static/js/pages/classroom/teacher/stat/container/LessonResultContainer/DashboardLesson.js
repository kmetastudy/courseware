import Component from "../../core/Component.js";
import { store } from "../../core/Store.js";

import DashboardLessonView from "./DashboardLessonView.js"
import SectionChange from "../../layout/organisms/SectionChange.js";

export default class DashboardLesson extends Component{
    constructor(target, props) {
        super(target, new DashboardLessonView(target), props)
    }

    mounted() {
        const {selectedSection} = this
        
        const $sectionChange = this.$target.querySelector('[data-component="section-change"]')
        const $sectionResult = this.$target.querySelector('[data-component="section-result"]')

        const {seq, todayLessonResult, correct, wrong, etc, categories, groups} = selectedSection


        $sectionChange.innerHTML = SectionChange({seq, todayLessonResult})

        var options = {
            series: [{
                name: '정답',
                data: correct
            }, {
                name: '오답',
                data: wrong
            }, {
                name: '미응시',
                data: etc
            }],
                chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                toolbar: {
                    tools: {
                        download: false
                    }
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                legend: {
                    position: 'left',
                    offsetX: 0,
                    offsetY: 0
                }
                }
            }],
            xaxis: {
                categories: categories,
                group: {
                    style: {
                    fontSize: '10px',
                    fontWeight: 700
                    },
                    groups: groups
                }
            },
            yaxis: {
                type:'numeric',
                min: 0,
                max: 30,
                tickAmount: 3,
            },
            fill: {
                opacity: 1
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                offsetX: 0,
                offsetY: 0
            },
            theme: {
                palette: 'palette2' // upto palette10
            },
        };

        console.log(options)
  
        var chart = new ApexCharts($sectionResult, options);
        chart.render();

        // new LessonResult($lessonResult, {})

    }

    setEvent() {
        this.addEvent('click', '.selectSection', ({target}) => {
            // console.log(target.closest('[data-seq]').dataset.seq)
            this.selectSectionListener(target.closest('[data-seq]').dataset.seq)
        })
    }

    get selectedSection() {
        const {selectedSection} = store.state
        const {todayLessonResult} = this._props

        const correct = todayLessonResult[selectedSection].result.map((x) => {return x[0]})
        const wrong = todayLessonResult[selectedSection].result.map((x) => {return x[1]})
        const etc = todayLessonResult[selectedSection].result.map((x) => {return x[2]})

        const categories = selectedSection==1?['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'Q9', 'Q10']:['Q1', 'Q2', 'Q1', 'Q2', 'Q1', 'Q2', 'Q1', 'Q2']
        const groups = selectedSection==1?[{ title: '단원평가', cols: 10 }]:[
                                { title: '수업1', cols: 2 },
                                { title: '수업2', cols: 2 },
                                { title: '수업3', cols: 2 },
                                { title: '수업4', cols: 2 },
                                ]

        return {seq:selectedSection, todayLessonResult, correct, wrong, etc, categories, groups}
    }

    selectSectionListener(seq) {
        // console.log(seq)
        store.setState({ selectedSection: seq })
    }

    selectLessonListener(seq) {
        store.setState({ selectedLesson: seq })
    }

    get selectedLessonResult() {
        const {selectedLesson} = store.state
        const {scheduledCourse, studentsResult} = this._props
        // console.log(studentsResult)

        let lessonResult = []
        let lessonResultList = []
        let selectedLessonResult = []


        scheduledCourse[selectedLesson].courses.forEach((course) => {
            studentsResult.forEach((obj) => {
                let results = obj.result.filter((value) => value.id == course.id)
                // console.log(results)
                results[0].results.forEach((r)=>{
                    lessonResult.push(r.result)
                })
                let lessonResultVec = lessonResult.flat().map((x)=>{
                    if(x == 'O') {
                        return [1,0,0]
                    } else if(x == 'X') {
                        return [0,1,0]
                    } else {
                        return [0,0,1]
                    }
                })
                lessonResultList.push(lessonResultVec)
                lessonResult = []
            })
            // console.log(lessonResultList)
            const result = lessonResultList.reduce((acc, cur) => {
                if(acc.length == 0) {
                    acc = cur
                    return acc
                }
                acc = this.matrixAdition(acc, cur)
                return acc
            }, [])
            selectedLessonResult.push({result, ...course})
            lessonResultList = []
        })

        console.log(selectedLessonResult)
        
        return selectedLessonResult
    }

    matrixAdition(a, b){
        let resultArr = [];
        for(let i = 0; i < a.length; i += 1){
          resultArr.push(a[i].map((x, y) => a[i][y] + b[i][y]));
        }
        return resultArr; // [[3, 6, 8,], [5, 7, 12,]]
    }

}