<template>
  <div>
    <chart :id="id" :option="option"></chart>
  </div>
</template>
<script>
import chart from '@/components/Chart.vue'
export default {
  name: "test",
  components: {
    chart
  },
  data() {
    return {
      id: 'test',
      option: {
        chart: {
          type: 'line' //指定图表的类型，默认是折线图（line）
        },
        credits: {
          enabled: false
        }, //去掉地址
        title: {
          text: '我的第一个图表' //指定图表标题
        },
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00',
          '#24CBE5'
        ],
        xAxis: {
          categories: ['1号', '2号', '3号', '4号', '5号'] //指定x轴分组
        },
        yAxis: {
          title: {
            text: '最近七天', //指定y轴的标题

          },
        },
        plotOptions: {
          column: {
            colorByPoint: true
          },
        },

        series: [
        // { //指定数据列
        //     name: '小明',
          //   data: [{
          //     y: 1000,
          //     color: "red"
          //   }, 5000, 4000, 5000, 2000] //数据
          // },
          { //指定数据列
            name: '小智',
            data: [20012, 50, 400, 50500, 27000] //数据
          },
          { //指定数据列
            name: '小红',
            data: [{
              y: 1000,
              color: "blue"
            }, 67, 400, 4400, 8000] //数据
          },
          { name: "全部", data: [{
              y: 32,
              color: "blue"
            }, 35, 3467, 3466, 335, 3432]}, 
          // { "name": "icon", "data": ["261828741", "278995652", "274156870", "274004486", "269591658", "272580548"], "_colorIndex": 1, "_symbolIndex": 1 }, { "name": "push", "data": ["47699699", "51099732", "53208879", "51405924", "50259632", "50955694"], "_colorIndex": 2, "_symbolIndex": 2 }, { "name": "qq", "data": ["1769880", "2694861", "2349631", "2247095", "2768020", "2369667"], "_colorIndex": 3, "_symbolIndex": 3 }, { "name": "weixin", "data": ["11351100", "16051606", "13136019", "12729867", "11668311", "13982178"], "_colorIndex": 4, "_symbolIndex": 4 }
        ]
      }
    }
  },

}

</script>
<style scoped>


</style>
