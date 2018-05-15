<template>
  <ul id="charts">
    <li v-for="x in list">
      <chart :id="x.id" :option="x.option"></chart>
      {{x.option.series}}
    </li>
  </ul>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// 导入chart组件
import chart from '@/components/Chart.vue'

export default {
  name: 'app',
  data() {
    return {
        list:{}
    }
  },
  components: {
    chart
  },
  computed: {
    ...mapState(['startingMode']),
    StartingMode() {
      // .map(item=>{
      //     for(let key in item){
      //         item.option = this.$showChart(key,res.data,res.categories,'','','','line');
      //     }
      //
      // })
      let firstTitle = []
      let sm = this.startingMode.data
      for (let k1 in sm) {
        let series = []
        for (let k2 in sm[k1]) {
          series.push({
            name: k2,
            data: sm[k1][k2]
          })

        }

        firstTitle.push({
          id: `#${k1}`,
          // option: {
          //   chart: {
          //     type: 'line', //指定图表的类型，默认是折线图（line）
          //     zoomType: 'x'
          //   },
          //   credits: {
          //     enabled: false
          //   }, //去掉地址
          //   title: {
          //     text: k1 //指定图表标题
          //   },
          //   colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00',
          //     '#24CBE5'
          //   ],
          //   xAxis: {
          //     categories: this.startingMode.categories //指定x轴分组
          //   },
          //   yAxis: {
          //     title: {
          //       text: '流量', //指定y轴的标题

          //     },
          //   },
          //   plotOptions: {
          //     column: {
          //       colorByPoint: true
          //     },
          //   },

          //   series: series
          // },
          option: this.$showChart(
                 series,
                 this.startingMode.categories,
                 '',
                 '',
                 k1,
                 'line','',''

             )
        })

      }
      // console.log(firstTitle[0].option)
      this.list = firstTitle
    }
  },
  watch: {
    StartingMode(n) {
      console.log(n)
    }
  },
  methods: {
    ...mapActions(['getStartingMode'])
  },
  created() {
    this.getStartingMode()
    // this.$axios('https://api.myjson.com/bins/h878m').then(dat=>{
    //     let res = dat.data
    //     console.log(res)
    //     this.option = this.$showChart('test',res.data,res.categories,'','','','line');
    //     console.log(this.option)
    // })


  }
}

</script>
<style>
#test {
  width: 400px;
  height: 400px;
  margin: 40px auto;
}

ul {
  /*list-style-type: none;*/
}

ul li {
  /*float:left;*/
}

</style>
