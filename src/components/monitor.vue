<template>
    <div class="monitor">
        <myMenu
                :theme="theme"
                :menuList="menuList"
                @switchCharts="switchCharts"
                :myStyle="{width:'240px'}"
                :activeName="menuSelection"
        ></myMenu>
        <!--图表设置的属性-->
        <Modal
        v-model="viewAttr"
        :width=30
        @on-ok="viewSetting"
        >
          <div class="big-chart">
              <view-attribute-setting v-if="viewAttr" ref="va"></view-attribute-setting>
              <p>注意:取消勾选复选框会删除该参数</p>
            </div>
        </Modal>
        <div class="charts">
            <!--放大后的图表位置-->
            <!-- <div  class="bigBackground" > -->
                <Modal
                v-model="showBig"
                :width=80
                >
                  <div class="big-chart">
                      <big-chart v-if="showBig" :handleAjaxData='handler'></big-chart>
                    </div>
                </Modal>
            <!-- </div> -->
            <el-row :gutter="40">
                <el-col
                        :span="8"
                        v-for="(x,index) in listOption"
                        :key="'chart'+index"
                >
                    <chart2 style="max-height: 370px"
                            class="animated bounceInUp"
                            :option="x"
                            :initFlag="false"
                            @expand="bigger"
                            v-if="menuSelection=='接入层'||menuSelection=='push'"
                            :handleAjaxData='handler'
                            @viewAttr="viewAttribute"
                    ></chart2>

                </el-col>
                <!--接入层质量接口-->
                <el-col :span="8" v-for="(x,index) in accessList" :key="'access'+index">
                    <chart2
                            class="animated bounceInUp"
                            @expand="bigger"
                            style="max-height: 370px"
                            :option="x"
                            v-if="menuSelection=='接入层'"
                            :handleAjaxData='handler'
                    ></chart2>
                </el-col>
                <!-- APP质量 -->
                <el-col
                        v-if="menuSelection=='APP质量'"
                        :span="8" v-for="(x,index) in appQualityList"
                        :key="'app'+index">
                    <chart2
                            class="animated bounceInUp"
                            @expand="bigger"
                            style="max-height: 370px"
                            :option = 'x'
                            :handleAjaxData='handler'
                    ></chart2>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import chart2 from '@/plug/Chart2'
import myMenu from '@/plug/myMenu'
import { Button, Modal } from 'iview'
import bigChart from '@/plug/bigChart'
import axios from 'axios'
import ViewAttributeSetting from '../plug/viewAttributeSetting'

const log = console.log.bind(this)

export default {
  name: 'monitor',
  components: {
    ViewAttributeSetting,
    Button,
    myMenu,
    chart2,
    Modal,
    bigChart
  },
  data () {
    return {
      kuaibao: {
        list: [
          {
            mixid: 7997,
            attrid: 463214,
            title: '快报 golang接入层 内搜推荐兜底数'
          },
          { mixid: 7997, attrid: 456035, title: '快报 golang接入层 请求总量' },
          {
            mixid: 7997,
            attrid: 455985,
            title: '快报 golang接入层 请求成功量'
          },
          {
            mixid: 7997,
            attrid: 475112,
            title: '快报 golang接入层 推荐条数少于请求条数'
          }
        ],
        appid: [1200679360, 1100679360], // 快报ios,快报Android
        accessQualityList: {
          metric: ['num', 'avg_response_time', 'percent95'], // 质量 metric 质量指标 num 请求量，avg_response_time 平均耗时， percent95 95分位耗时
          queryMethod: 'KuaibaoQuality'
        },
        menuList: ['接入层', 'APP质量'],
        viewid: [7997] // 用于获取视图设置的信息
      },
      news: {
        list: [
          { mixid: 7364, attrid: 435024, title: '新闻 接入层 列表页总调用量' },
          { mixid: 7364, attrid: 435027, title: '新闻 接入层 要闻频道调用量' },
          {
            mixid: 8891,
            attrid: 484451,
            title: '新闻 接入层 要闻推荐兜底调用量'
          },
          {
            mixid: 8891,
            attrid: 484452,
            title: '新闻 接入层 二级频道推荐兜底调用量'
          },
          {
            mixid: 7383,
            attrid: 435498,
            title: '新闻 push推送 地域推送数请求总量'
          }
        ],
        appid: [1200032544, 1100032544], // 新聞ios,新聞Android
        accessQualityList: {
          metric: ['num', 'avg_response_time', 'percent95'], // 质量 metric 质量指标 num 请求量，avg_response 平均耗时， percent95 95分位耗时
          queryMethod: 'InewsQuality'
        },
        menuList: ['接入层', 'push', 'APP质量'],
        viewid: [7364, 8891, 7383]
      },
      CName: {
        num: '请求量',
        avg_response_time: '平均耗时',
        percent95: '95分位耗时'
      },
      appQualityParams: [
        {
          t_type: 'liebiao',
          pushmark: ' ',
          data_type: 'totaltime_95',
          cnews: 'liebiao'
        },
        {
          t_type: 'diceng', // 底层页
          pushmark: 0,
          data_type: 'totaltime_95',
          cnews: 'diceng'
        },
        {
          t_type: 'diceng', // push页
          pushmark: 1,
          data_type: 'totaltime_95',
          cnews: 'push'
        }
      ],
      appQualityName: {
        // 每个表的名字,根据参数组合
        '1200032544': '新闻ios',
        '1100032544': '新闻android',
        '1200679360': '快报ios',
        '1100679360': '快报android',
        diceng: '底层页',
        liebiao: '列表页'
      },
      appUri: {
        '快报ios 列表页': 'getSubNewsInterest',
        '快报android 列表页': 'getSubNewsInterest',
        '快报ios 底层页': '/getSubNewsContent',
        '快报android 底层页': 'getSubNewsContent',
        '快报ios push页': '/getFullNews',
        '快报android push页': 'getFullNews',
        '新闻ios 列表页': 'getQQNewsUnreadList',
        '新闻android 列表页': 'getQQNewsUnreadList',
        '新闻ios 底层页': '/getSimpleNews',
        '新闻android 底层页': 'getSimpleNews',
        '新闻ios push页': '',
        '新闻android push页': 'getFullNews'
      },
      describe: '',
      id: 'asd',
      option: {},
      theme: 'dark',
      showBig: false,
      viewAttr: false,
      list: '',
      menuSelection: '接入层',
      handler: function (data) {
        return data.categories.map((element, index) => {
          let obj = {}
          data.data.forEach((item, key) => {
            let obj2 = {
              time: element
            }
            obj2[item.name.replace(/\d+\-0/, '').replace(/\-/, '月') + '日'] =
              item.data[index]
            obj = { ...obj, ...obj2 }
          })
          // chartData=[...chartData,...arr]
          return obj
        })
      }
    }
  },
  computed: {
    menuList () {
      let ids = this.$route.params.type == 'kuaibao' ? this.kuaibao : this.news
      return ids.menuList
    },
    listOption () {
      let array = []
      this.list.forEach(item => {
        array.push({
          title: item.title.split(' ')[2],
          url: `http://test.lg.webdev.com/accesslayer/NewsMonitorAccesslayer/GetThreeDailyData?type=1&mixid=${
            item.mixid
          }&attrid=${item.attrid}`,
          describe: `视图ID为${item.mixid},属性ID为${item.attrid} \n  双击图表恢复原尺寸`,
          attrid: item.attrid,
          mixid: item.mixid
        })
      })
      return array
    },
    accessList () {
      let ids = this.$route.params.type == 'kuaibao' ? this.kuaibao : this.news
      let host = window.location.host
      // let host = 'test.lg.webdev.com'
      let baseUrl = `http://${host}/accesslayer/${ids.accessQualityList.queryMethod}/`
      let type = this.$route.params.type == 'kuaibao' ? 'cnewscode' : 'inewscode'
      let arr = []
      ids.accessQualityList.metric.forEach(item => {
        arr.push({
          title: '接入层整体' + this.CName[item],
          url: `/accesslayer/${
            ids.accessQualityList.queryMethod
          }/getConnTrend?metric=${item}&etime=23:59`,
          link: baseUrl + type + `?metric=${item}`,
          describe: '双击图表恢复原尺寸'
        })
      })
      return arr
    },
    appQualityList () {
      let ids = this.$route.params.type == 'kuaibao' ? this.kuaibao : this.news
      // if(this.menuSelection!=='APP质量') return {}
      let page =
        this.$route.params.type == 'kuaibao'
          ? 'KuaibaoQuality'
          : 'InewsQuality'
      let type = ids.appid
      let host = window.location.host
      // let host = "test.lg.webdev.com";

      let params = this.appQualityParams
      let quality = []

      type.forEach(item => {
        params.forEach(it => {
          // 表名
          let chartName
          if (it.pushmark === 1) {
            chartName = this.appQualityName[item] + ' push页'
          } else {
            chartName =
              this.appQualityName[item] + ' ' + this.appQualityName[it.t_type]
          }
          let url2 = `http://${host}/accesslayer/${page}/cnews${
            it.cnews
          }/?platform=${chartName.split(' ')[0].match(/[a-z]+/)[0]}`
          quality.push({
            title: chartName + '总体耗时(95分位)',
            url: `/appnews/News99_95/GetThreedailyCmpData?appid=${item}&t_type=${
              it.t_type
            }&uri=${this.appUri[chartName]}&code=1000&sdate=${this.GetDateStr(
              0
            )}&stime=00:00&etime=23:59&edate=${this.GetDateStr(-1)}&data_type=${
              it.data_type
            }&pushmark=${it.pushmark}`,
            describe: '双击图表恢复原尺寸',
            link: url2
          })
        })
      })
      return quality
    }
  },
  watch: {
    $route: {
      handler: function () {
        let n = sessionStorage['menuSelect'] ? sessionStorage['menuSelect'] : '接入层'
        this.switchCharts(n)
        let pageTitle =
          this.$route.params.type == 'kuaibao'
            ? '快报关键指标监控'
            : '新闻关键指标监控'
        document.title = pageTitle
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getMonitorData']),
    switchCharts (n) {
      sessionStorage['menuSelect'] = n
      // 只负责传递左边menu选中的数据,由computed来进行筛选
      this.menuSelection = n
      let ids = this.$route.params.type == 'kuaibao' ? this.kuaibao : this.news
      let arr = ids.list.filter(item => {
        return item.title.match(n)
      })
      this.list = arr
    },
    bigger (opt) {
      this.showBig = true
    },
    GetDateStr (AddDayCount) {
      var dd = new Date()
      dd.setDate(dd.getDate() + AddDayCount) // 获取AddDayCount天后的日期
      var y = dd.getFullYear()
      var m =
        dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
      var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
      return `${y}-${m}-${d}`
    },
    viewAttribute () {
      this.viewAttr = true
    },
    viewSetting () {
      this.$refs.va.sendSetting()
    },
    getViewAttribute () { // 获取视图的设置属性
      let ids = this.$route.params.type == 'kuaibao' ? this.kuaibao : this.news
      log(this.list)
      ids.viewid.forEach(item => {
        axios({
          method: 'post',
          url: 'http://itil.webdev.com/php/monitor_webdev_com/MonitorGraphPimp.php',
          data: {
            viewid: item,
            dateint: 1406017920,
            action: 'loadfillmyviewattr'
          }
        }).then(res => {
          log(res)
          // res.data.alertdata.forEach(it=>{

          // })
          // list.forEach(it=>{
          //   if(it.attrid===res.data)
          // })
        })
      })
    }
  },
  created () {
    let n = sessionStorage['menuSelect'] ? sessionStorage['menuSelect'] : '接入层'
    this.switchCharts(n)
    this.getViewAttribute()
  }
}
</script>

<style lang="scss" scoped>
@mixin center {
  //居中
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

html,
body {
  height: 100%;
}
.monitor {
  display: flex;
  flex-direction: row;
  height: 100%;
  background-color: rgb(243, 243, 243);
  position: relative;
  .charts {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    flex: 1;
    /*overflow: auto;*/
    min-height: 968px;
    margin-top: 35px;
    padding: 0 30px;
    .bigBackground {
      background-color: rgba(243, 243, 243, 0.8);
      z-index: 12;
      width: 100%;
      height: 100%;
      position: absolute;
      .big-chart {
        @include center;
        width: 80%;
        height: 74%;
        z-index: 6;
      }
    }

    el-row {
      .el-col {
        padding-top: 20%;
        margin-bottom: 40px;
        overflow: hidden;
        /*max-height: 400px!important;*/
      }
      .el-col:before {
        content: "";
        display: inline-block;
        padding-bottom: 100%;
        width: 0.1px;
        vertical-align: middle;
      }
    }
  }
}
</style>
