<template>
  <div :option="option">
    <div class="chart-head">
      <!--介绍文字和图标-->
      <el-tooltip class="item" effect="light" :content="describe" placement="right-start">
        <el-button class='el-but'><Icon type="information-circled"></Icon></el-button>
      </el-tooltip>
      <div class="headTitle">{{title}}</div>
    </div>
    <ul class="comparison">
      <li>
        <p>{{current}}</p>
        当前({{time}})
      </li>
      <li>
        <p :style="{color:compare[1].color}"><Icon :type="compare[1].icon"></Icon>{{compare[1].data}}</p>
        相比七天前
      </li>
      <li>
        <p :style="{color:compare[0].color}"><Icon :type="compare[0].icon"></Icon>{{compare[0].data}}</p>
        相比一天前
      </li>
    </ul>
    <div class="x-bar">
      <p :id="id"></p>
    </div>
  </div>
</template>
<script>
  import Highcharts from 'highcharts'
  import $ from 'jquery'
  import {Icon} from 'iview'
  import {mapState} from 'vuex'

  const log = console.log.bind(this)
  function comparison(num1,num2) {  //计算变化率
    let rate = Math.round((num1 - num2)/num2*10000)/100+"%"
    if(num1>num2){
      return {
        color:'green',
        data:rate,
        icon:'arrow-up-a'
      }
    }else {
      return {
        color:'red',
        data:rate,
        icon:'arrow-down-a'
      }
    }
  }
  export default {
    // 验证类型
    props: {
      id: {
        type: String
      },
      option: {
        type: Object
      },
      describe: {
        type: String
      }
    },
    components:{
      Icon
    },
    data() {
      return {
        title: '',
        compare:[],
        time:'',
        current:0//初始值
      }
    },
    methods:{
      compareInit(){
        let arr = this.compareData[this.describe]
        let day = comparison(arr[0],arr[1])
        let week = comparison(arr[0],arr[2])
        this.compare = [
          {
            icon: day.icon,
            data:day.data,
            color:day.color
          },
          {
            icon: week.icon,
            data:week.data,
            color:week.color
          },
        ]
        this.current = arr[0]
      },
      now(){
        let myDate = new Date()
        let hour = myDate.getHours()
        let min = myDate.getMinutes()
        if(min<5){
          return `${(hour-1)}:${min+55}`
        }
        return `${hour}:${min-5}`
      },
      showChart(series, categories, title, chartType){
        let that = this
        return {
          chart: {
            type: chartType, //指定图表的类型，默认是折线图（line）
            zoomType: 'x'
          },
          credits: {
            enabled: false
          }, //去掉地址
          title: {
            text: '' //指定图表标题
          },
          xAxis: {
            categories: categories, //指定x轴分组
            labels: {
              rotation: 0//调节倾斜角度偏移
            },
          },
          yAxis: {
            title: {
              text: '', //指定y轴的标题

            },
          },
          plotOptions: {
            column: {
              colorByPoint: true
            },
          },
          series: series,
          tooltip:{
            shared: true,
            valueSuffix: '分',
            formatter: function () {
              let points = this.points
              let s = `<p>${points[0].x}</p>`;
              let words = ['当前时间','一天前','七天前']
              $.each(points, function (i, v) {
                s += `<span style="font-weight:bold;color:#7a85a2;display: block;">${words[i]}: ${v.point.y} </span>`;
                that.$data.time = points[0].x
              });
              let day = comparison(points[0].y,points[1].y)
              let week = comparison(points[0].y,points[2].y)
              let arr = [
                {
                  icon: day.icon,
                  data:day.data,
                  color:day.color
                },
                {
                  icon: week.icon,
                  data:week.data,
                  color:week.color
                },
              ]
              that.$data.compare = arr
              that.$data.current = points[0].y
              return s;
            },
            useHTML: true
          }
        }
      }
    },
    computed:{
      ...mapState(['compareData']),

    },
    // mounted() {
    //     // console.log(typeof(this.option.series[0]['data'][0]))
    //     Highcharts.chart(this.id, this.option)
    // },
    created() {
      // console.log(this)
      this.compareInit()
      this.time = this.now()
      this.title = this.option.title
      this.$nextTick(() => {
        let opt = this.option
        let optObj = this.showChart(
          opt.series,
          opt.categories,
          opt.title,
          opt.type,
        )
        Highcharts.chart(this.id, optObj)
      })

    }
  }



</script>

<style lang="scss" scoped>
  .x-bar {
    border: none;
  }

  .chart-head {
    position: relative;
    margin: 0;
    padding: 0;
    height: 50px;
    text-align: center;
    font-size: 15px;
    overflow: hidden;
    align-items:center;
    .headTitle{
      display: inline-block;
      line-height: 50px;
    }
  }
  .el-button {
    float: left;
    border: none;
    font-size: 18px;
    .ivu-icon {
      color: rgb(43,133,228);
    }
    .el-tooltip__popper is-light {
      background-color: rgb(255, 231, 147);
    }
  }
  .comparison{
    li{
      float:right;
      margin-left: 15px;
      p{
        text-align: center;
        color:rgb(55,34,255);
      }
    }
    li:nth-child(1){
      float:left;
    }
  }
</style>
