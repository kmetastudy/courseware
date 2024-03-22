import Component from "../../core/Component.js";
import { store } from "../../core/Store.js";

import DashboardLessonView from "./DashboardLessonView.js"

export default class DashboardLesson extends Component{
    constructor(target, props) {
        super(target, new DashboardLessonView(target), props)
    }

    mounted() {
        const {selectedLessonResult} = this
        
        const $lessonResult = this.$target.querySelector('[data-component="lesson-result"]')

        const correct = selectedLessonResult[0].result.map((x) => {return x[0]})
        const wrong = selectedLessonResult[0].result.map((x) => {return x[1]})
        const etc = selectedLessonResult[0].result.map((x) => {return x[2]})
        

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
                width: 400,
                height: 250,
                stacked: true,
            },
            responsive: [{
                breakpoint: 480,
                options: {
                legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                }
                }
            }],
            xaxis: {
                categories: ['Q1', 'Q2', 'Q1', 'Q2', 'Q1', 'Q2', 'Q1', 'Q2'],
                group: {
                    style: {
                    fontSize: '10px',
                    fontWeight: 700
                    },
                    groups: [
                    { title: '수업1', cols: 2 },
                    { title: '수업2', cols: 2 },
                    { title: '수업3', cols: 2 },
                    { title: '수업4', cols: 2 },
                    ]
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
                position: 'right',
                offsetX: 0,
                offsetY: 50
            },
            theme: {
                palette: 'palette2' // upto palette10
            }
        };
  
        var chart = new ApexCharts($lessonResult, options);
        chart.render();

        // new LessonResult($lessonResult, {})

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

        // console.log(selectedLessonResult)
        
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