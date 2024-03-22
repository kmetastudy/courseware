import Component from "../../core/Component.js";

import DashboardEveryView from "./DashboardEveryView.js"

export default class DashboardEvery extends Component{
    constructor(target, props) {
        super(target, new DashboardEveryView(target), props)
    }

    mounted() {
        const {selectStudentListener} = this._props
        const series = []
        this._props.studentStat.forEach((obj) => {
            series.push({name:'1반', data:[{name:obj.name, x:obj.studentProgress, y:obj.studentPoint}]})
        })

        var options = {
            series,
            chart: {
                width: 300,
                height:300,
                type: 'scatter',
                zoom: {
                    enabled: false,
                    type: 'xy'
                },
                events: {
                    markerClick: function(event, chartContext, { seriesIndex, dataPointIndex, config}) {
                        selectStudentListener(seriesIndex)
                    }
                }
            },
            title: {
                text: '학생 분포도'
            },
            grid: {
                show:true,
                xaxis: {
                    lines: {
                        show: true
                    }
                },   
                yaxis: {
                    lines: {
                        show: true
                    }
                },  
            },
            legend: {show:false},
            dataLabels: {
                enabled:false,
            },
            tooltip: {
                x: {
                    show:false
                },
                y: {
                    show:false,
                    title:{
                        formatter: function(val, { seriesIndex, dataPointIndex, w }) {
                            return w.config.series[seriesIndex].data[dataPointIndex].name
                        },
                    }
                }
            },
            xaxis: {
                type: 'numeric',
                min: 0,
                max: 100,
                tickAmount: 2,
                labels: {
                    formatter: function(value) {
                        return value.toFixed(1)+'%'
                    }
                },
                title: {
                    text: '학습량',
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: undefined,
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        cssClass: 'apexcharts-xaxis-title',
                    },
                }
                
            },
            yaxis: {
                min: 0,
                max: 100,
                tickAmount: 10,
                labels: {
                    formatter: function(value) {
                        return value.toFixed(0)+'점'
                    }
                },
                title: {
                    text: '정답률',
                    rotate: -90,
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: undefined,
                        fontSize: '12px',
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 600,
                        cssClass: 'apexcharts-xaxis-title',
                    },
                }
            },
        };

        const $scatter = this.$target.querySelector('[data-component="scatter-every"]')

        var chart = new ApexCharts($scatter, options);
        chart.render();
    }
}