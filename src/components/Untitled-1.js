showChart(){
    let that = this
      let opt = {
        chart: {
          type: chartType, // 指定图表的类型，默认是折线图（line）
          zoomType: 'x',
          events: {
            redraw: function () {
              let container = this.container
              let width = $(container).width()
              let height = Math.min(0.92 * width, 350) + 'px'
              if (0.92 * width < 330) height = '330px'
              $(this.container).height(height)
              $(container).children('.highcharts-root').height(height)
            }
          }
        },
        colors: ['#7070FF', '#FF5757', '#6AFF6A'],
        credits: {
          enabled: false
        }, // 去掉地址
        title: {
          text: '' // 指定图表标题
        },
        xAxis: {
          categories: categories, // 指定x轴分组
          labels: {
            rotation: 0// 调节倾斜角度偏移
          }
        },
        yAxis: {
          title: {
            text: '' // 指定y轴的标题

          }
        },
        plotOptions: {
          column: {
            colorByPoint: true
          },
          series: {
            lineWidth: 1
          }
        },
        series: series,

        getThis: () => { // 获取当前vue的this
          return this
        },
        tooltip: {
          shared: true,
          // valueSuffix: '分',
          formatter: function () {
            let that = opt.getThis()
            let points = this.points
            let s = `<p>${points[0].x}</p>`
            let words = ['当前时间', '一天前', '七天前']
            $.each(points, function (i, v) {
              s += `<span style="font-weight:bold;color:#7a85a2;display: block;">${words[i]}: ${v.point.y} </span>`
              that.$data.time = points[0].x
            })
            let day = comparison(points[0].y, points[1].y)
            let week = comparison(points[0].y, points[2].y)
            let arr = [
              {
                icon: day.icon,
                data: day.data,
                color: day.color
              },
              {
                icon: week.icon,
                data: week.data,
                color: week.color
              }
            ]
            that.$data.compare = arr
            that.$emit('compareFromBig', {
              arr,
              time: points[0].x,
              current: points[0].y
            }) // expand函数传过去时,that指向的还是原来小图的vue实例,因此只能手动再把compare的数值传过去
            that.$data.current = points[0].y
            return s
          },
          useHTML: true
        }
      }
      this.optionBig = opt
      return opt
}

expand() {
    // 放大效果
    this.$emit("expand", {
      opt: this.optionBig,
      title: this.title2,
      des: this.monitorData.describe,
      compareData: this.compareData
    });
  },


  <big-chart
  :option="optionBig"
  :initFlag="true"
  @closeIt="closeIt"
  :compareToBig="compareToBig"
></big-chart>