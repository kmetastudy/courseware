const CourseProgress = props => {
    console.log(props)
    const target = props.target
    const data = props.data
    
    let options = {
      series: [{
          name: '정답',
          data: [5,5,6,6,5]
      }, {
          name: '오답',
          data: [4,4,4,3,2]
      }, {
          name: '미응시',
          data: [1,1,0,1,3]
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
          categories: ['문항1', '문항2', '문항3', '문항4', '문항5'],
          group: {
              style: {
              fontSize: '10px',
              fontWeight: 700
              },
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

  let chart = new ApexCharts(target, options);
  chart.render();

}

export default CourseProgress