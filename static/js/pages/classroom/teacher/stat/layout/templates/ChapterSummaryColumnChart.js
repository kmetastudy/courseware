const ChapterSummaryColumnChart = props => {
    console.log(props)
    const target = props.target
    const classPoint = props.class.schedulePoint
    const studentPoint = props.student.schedulePoint
    const categories = classPoint.map((obj, index) => (index+1) +'차시')
    
    let options2 = {
      width:'100%',
      height:'100%',
      series: [{
        name: '선택 학생',
        data: studentPoint
      }, {
        name: '전체 평균',
        data: classPoint
      }],
      chart: {
        type: 'bar',
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0]
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      title:{
        text:'성취도(수업 + 평가 결과)'
      },
      legend: {
        show: true,
        position:'top',
        horizontalAlign:'right'
      },
      xaxis: {
        categories: categories,
      },
      yaxis: {
        tickAmount: 2,
        min: 0,
        max: 100,
        labels: {
            formatter: function(val) {
                return val.toFixed(0)
            }
        }
      },
      fill: {
        opacity: 1
      },
    };

      let chart2 = new ApexCharts(target, options2);
      chart2.render();

}

export default ChapterSummaryColumnChart