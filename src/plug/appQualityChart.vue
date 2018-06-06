<template>
    <div class="chart-body" :option="option">
        <Spin size="large" fix v-if="loading"></Spin>
        <div class="error" v-if="error"><p>网络请求错误或超时!</p></div>
        <div class="chart-head">
            <!--介绍文字和图标-->
            <el-tooltip class="item" effect="light" content="qualityData.describe" placement="right-start">
                <el-button class='el-but'>
                    <Icon type="information-circled"></Icon>
                </el-button>
            </el-tooltip>
            <div class="headTitle">{{title}}总体耗时(95分位)</div>
            <Icon type="arrow-expand" @click="linkTo"></Icon>
        </div>
        <ul class="comparison" v-if="compare">
            <li>
                <p>{{current}}</p>
                当前({{time}})
            </li>
            <li>
                <p >
                    <Icon :style="{color:compare[1].color}" :type="compare[1].icon"></Icon>
                    <span :style="{color:compare[1].color}">{{compare[1].data}}</span>
                </p>
                相比七天前
            </li>
            <li>
                <p >
                    <Icon :style="{color:compare[0].color}" :type="compare[0].icon"></Icon>
                    <span :style="{color:compare[0].color}">{{compare[0].data}}</span>
                </p>
                相比一天前
            </li>
        </ul>
        <div class="x-bar" style="height: 320px;">
            <p :id="id" style="height: 320px;box-sizing: border-box;"></p>
        </div>
    </div>
</template>
<script>
// import Highcharts from 'highcharts'
// import $ from 'jquery'
import {Icon, Spin} from 'iview'
import {mapState} from 'vuex'
import axios from 'axios'

const log = console.log.bind(this)

function comparison (num1, num2) { // 计算变化率
  let rate = Math.round((num1 - num2) / num2 * 10000) / 100 + '%'
  if (num1 > num2) {
    return {
      color: 'green',
      data: rate,
      icon: 'arrow-up-a'
    }
  } else {
    return {
      color: 'red',
      data: rate,
      icon: 'arrow-down-a'
    }
  }
}

function randomString (len) { // 随机生成字符串  用来做id
  len = len || 32
  var $chars = 'abcdefhijkmnprstwxyz2345678'
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length
  var pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

export default {
  // 验证类型
  props: {
    initFlag: {
      type: Boolean
    },
    option: {
      type: Object
    },
    compareToBig: {
      // type: Object
    }
  },
  components: {
    Icon, Spin
  },
  data () {
    return {
      id: '',
      title: '',
      title2: '', // 真正的标题
      compare: [],
      time: '',
      current: 0, // 初始值
      optionBig: {}, // 用来传给大图的值
      qualityData: {},
      compareData: [],
      first: true, // 用于判断数据是否第一次更新
      loading: false,
      error: false

    }
  },
  watch: {
    compareToBig (n) {
      this.compare = n.arr
      this.time = n.time
      this.current = n.current
    },
    option (n) {
      this.reflash()
    }
  },
  computed: {
    expandIcon () {
      if (this.initFlag) {
        return {
          type: 'close-round',
          method: this.closeIt
        }
      } else {
        return {
          type: 'arrow-expand',
          method: this.expand
        }
      }
    }
  },
  methods: {
    reflash () {
      this.time = this.now()
      this.title = this.option.title
      this.compareInit()
      this.getQualityData().then(() => { // 保证在compareInit执行时this.compareData有值
        this.$nextTick(() => {
          this.compareInit()
        })
      })
    },
    compareInit () { // 数据给的是昨天,一周前,今天
      let arr = this.compareData
      let day = comparison(arr[2], arr[0])
      let week = comparison(arr[2], arr[1])
      this.compare = [
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
      this.current = arr[2]
    },
    now () {
      let myDate = new Date()
      let hour = myDate.getHours()
      let min = myDate.getMinutes()
      if (min < 5) {
        return `${(hour - 1)}:${min + 55}`
      }
      return `${hour}:${min - 5}`
    },
    GetDateStr (AddDayCount) {
      var dd = new Date()
      dd.setDate(dd.getDate() + AddDayCount)// 获取AddDayCount天后的日期
      var y = dd.getFullYear()
      var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)// 获取当前月份的日期，不足10补0
      var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()// 获取当前几号，不足10补0
      return `${y}-${m}-${d}`
    },
    getDataNow (num) { // 拿到当前时间在后台数据中对应的序号
      let myDate = new Date()
      let hour = myDate.getHours()
      let min = myDate.getMinutes()
      if (min < num) {
        return (hour - 1) * 60 + min + 60 - num
      }
      return hour * 60 + min - num
    },
    linkTo () {
      let platform = this.title.split(' ')[0].match(/[a-z]+/)[0]
      let host = window.location.host
      // let host = 'http://test.lg.webdev.com'
      let url = `http://${host}/accesslayer/${this.option.param.link}/?platform=${platform}`
      window.location.href = url
    },
    closeIt () {
      this.$emit('closeIt')
    },
    async getQualityData () {
      this.loading = true
      let options = this.option
      let param = options.param
      let index = this.getDataNow(5) // 以当前时间的五分钟前为序号
      let res
      let url = `/appnews/News99_95/GetThreedailyCmpData?appid=${param.appid}&t_type=${param.t_type}&uri=${param.uri}&code=1000&sdate=${this.GetDateStr(0)}&stime=00:00&etime=23:59&edate=${this.GetDateStr(-1)}&data_type=${param.data_type}&pushmark=${param.pushmark}`
      axios.defaults.timeout = 60000
      try {
        res = await axios(url)
        // res = await axios('https://api.myjson.com/bins/q8rni')
      } catch (e) {
        res = {}
        this.error = true
        log(this.loading)
      }
      this.loading = false
      let obj = {
        title: options[3],
        data: res.data,
        mixid: options.mixid,
        attrid: options.attrid
      }
      this.changeQualityData(obj)

      let array = [] // 存放当前时间的值
      res.data.data.forEach((value, num) => {
        array[num] = value.data[index]
      })
      this.compareData = array
    },
    changeQualityData (obj) {
      if (obj.data) {
        let series = obj.data.data
        let categories = obj.data.categories
        this.qualityData = {
          option: {
            series,
            categories,
            // title: this.option,
            type: 'line'
          }
          // describe: `视图ID为${obj.mixid},属性ID为${obj.attrid}`
        }
      }
    },
    showChart (series, categories, title, chartType) {
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
            that.$data.current = points[0].y
            return s
          },
          useHTML: true
        }
      }
      this.optionBig = opt
      return opt
    }
  },
  created () {
    // log(this.option, this.option.param.uri)
    if (this.initFlag !== true) {
      this.id = randomString(4)
      this.reflash()
    } else {
      this.compareInit()
      this.id = randomString(4)
      this.title2 = this.option.title
      this.qualityData.describe = this.option.des
      this.$nextTick(() => {
        // log(this.compareToBig)
        // this.compareInit()
        this.compareData = this.option.compareData
        Highcharts.chart(this.id, this.option.opt)
      })
    }
  },
  updated () {
    if (this.first) {
      this.$nextTick(() => {
        let opt = this.qualityData.option
        let optObj = this.showChart(
          opt.series,
          opt.categories,
          opt.title,
          opt.type
        )
        Highcharts.chart(this.id, optObj)
      })
      this.first = false
    }
  }
}

</script>

<style lang="scss" scoped>
    @mixin center() {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .chart-body {
        width: 100%;
        margin: 0 auto 35px;
        background-color: white;
        padding: 0 18px 0 0;
        max-height: 433px;
        overflow: hidden;
        position: relative;
        .error{
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 6;
            text-align: center;
            align-items:center;
            line-height: 100%;
            background-color: rgba(60,63,65,0.6);
            color:#ccc;
            p{
                font-size: 14px;
                @include center();
            }
        }
    }

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
        align-items: center;
        .headTitle {
            display: inline-block;
            line-height: 50px;
            font-weight: 800;
        }
        .ivu-icon-arrow-expand {
            font-size: 18px;
            color: rgb(43, 133, 228);
            float: left;
            position: relative;
            left: 2px;
            line-height: 50px;
        }
        .ivu-icon-close-round {
            font-size: 18px;
            float: right;
            line-height: 50px;
        }
    }

    .el-button {
        float: left;
        border: none;
        font-size: 18px;
        position: relative;
        top: 8px;
        left: 5px;
        .ivu-icon {
            color: rgb(43, 133, 228);
        }
        .el-tooltip__popper is-light {
            background-color: rgb(255, 231, 147);
        }
    }

    .comparison {
        overflow: hidden;
        li {
            float: right;
            margin-left: 15px;
            overflow: hidden;
            p {
                text-align: center;
                color: rgb(55, 34, 255);
            }
        }

        li:nth-child(1) {
            float: left;
        }
    }
    .highcharts-root{
        max-height: 320px!important;
    }
    .highcharts-container{
        height: 320px;
    }
</style>
