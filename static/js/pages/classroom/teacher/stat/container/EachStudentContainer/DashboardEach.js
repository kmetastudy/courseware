import Component from "../../core/Component.js";

import DashboardEachView from "./DashboardEachView.js"

export default class DashboardEach extends Component{
    constructor(target, props) {
        super(target, new DashboardEachView(target), props)
    }

    mounted() {
        const student = this._props.selectedStudent
        const chapterStat = student.studentChapterStat
        const chapter = []
        const progressData = []
        const pointData = []

        chapterStat.forEach(({progress, point}, index) => {
            chapter.push(index+1)
            progressData.push(progress)
            pointData.push(point)
        })

        // console.log(chapter)
        // console.log(progressData)
        // console.log(pointData)

        var options2 = {
            series: [
                {
                    name: '학습량',
                    type: 'column',
                    data: progressData
                },
                {
                    name: '정답률',
                    type: 'line',
                    data: pointData
                }
            ],
            chart: {
                width:500,
                height: 350,
                type: 'line',
                zoom:{
                    enabled: false,
                }
            },
            stroke: {
                width: [0, 4]
            },
            title: {
                text: '학생별 성취도 분석'
            },
            dataLabels: {
                enabled: true,
                enabledOnSeries: [1],
                formatter: function(value) {
                    return value.toFixed(0)
                }
            },
            labels: chapter,
            xaxis: {
                type:'category',
                labels: {
                    formatter: function(value) {
                        if(!value) return
                        return value + '단원'
                    }
                }
            },
            yaxis: [{
                type:'numeric',
                min: 0,
                max: 100,
                tickAmount: 5,
                title: {
                    text: '학습량',
                },
                labels: {
                    formatter: function(value) {
                        return value.toFixed(0)+'%'
                    }
                },
            
            }, {
                opposite: true,
                type:'numeric',
                min: 0,
                max: 100,
                tickAmount: 5,
                title: {
                    text: '정답률'
                },
                labels: {
                    formatter: function(value) {
                        return value.toFixed(0)+'%'
                    }
                },
            }]
        };
  
          const $barLine = this.$target.querySelector('[data-component="barLine-each"]')

          var chart2 = new ApexCharts($barLine, options2);
          chart2.render();
    }
}