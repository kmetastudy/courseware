const CourseProgress = props => {
    console.log(props)
    const target = props.target
    const data = props.data
    
    let options = {
      series: data,
      chart: {
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        }
      },
    },
    labels: ['진행률'],
    };

    let chart = new ApexCharts(target, options);
    chart.render();

}

export default CourseProgress