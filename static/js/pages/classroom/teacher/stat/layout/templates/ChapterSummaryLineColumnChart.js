const ChapterSummaryLineColumnChart = props => {
    console.log(props)
    const target = props.target
    const data = props.data
    const type = props.type
    const progress = data.scheduleProgress
    const point = data.schedulePoint

    let categoryName = null
    if(!Number.isInteger(type)) categoryName = '단원'
    else if(type == 0) categoryName = '차시'
    else categoryName = '수업'

    const categories = progress.map((obj, index) => (index+1) + categoryName)
    
    let options = {
      widgh:'100%',
      height:'100%',
        series: [{
        name: '정답률',
        type: 'column',
        data: progress
      }, {
        name: '진행률',
        type: 'line',
        data: point
      }],
        chart: {
        type: 'line',
      },
      stroke: {
        width: [0, 4]
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1]
      },
      chart: {
        toolbar: {
          show: false,
        }
      },
      legend: {
        show: true,
        position:'top',
        horizontalAlign:'right'
      },
      xaxis: {
        categories:categories
      },
      yaxis: [{
        tickAmount: 2,
        min: 0,
        max: 100,
        labels: {
            formatter: function(val) {
                return val.toFixed(0)
            }
        }
      
      }]
      };

      let chart = new ApexCharts(target, options);
      chart.render();

}

export default ChapterSummaryLineColumnChart