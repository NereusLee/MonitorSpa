<template>
    <div class="monitor">
        <myMenu
                :theme="theme"
                :menuList="menuList"
                @switchCharts="switchCharts"
                :myStyle="{width:'240px'}"
                :activeName="menuSelection"
        ></myMenu>

        <div class="charts">
            <!--放大后的图表位置-->
            <div class="bigBackground" v-if="showBig">
                <div class="big-chart">
                    <chart2
                            :option="optionBig"
                            :initFlag="true"
                            @closeIt="closeIt"
                            :compareToBig="compareToBig"
                    ></chart2>
                </div>
            </div>
            <el-row :gutter="40">
                <el-col
                        :span="8"
                        v-for="(x,index) in list"
                        :key="x.id"
                >
                    <chart2 style="max-height: 430px"
                            :option="x"
                            :initFlag="false"
                            @expand="bigger"
                            @compareFromBig="compareFromBig"
                            v-if="menuSelection=='接入层'||menuSelection=='push'"
                    ></chart2>

                </el-col>
                <!--接入层质量接口-->
                <el-col :span="8" v-for="(x,index) in accessQualityList.metric" :key="x">
                    <accessQuality-chart
                            style="max-height: 430px"
                            :option="x"
                            :queryMethod="accessQualityList.queryMethod"
                            v-if="menuSelection=='接入层'"
                    ></accessQuality-chart>
                </el-col>
                <el-col
                        v-if="menuSelection=='APP质量'"
                        :span="8" v-for="(x,index) in appQualityList"
                        :key="index">
                    <appQuality-chart
                            style="max-height: 430px"
                            :option = 'x'
                    ></appQuality-chart>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import chart2 from '@/plug/Chart2'
import myMenu from '@/plug/myMenu'
import {Button} from 'iview'
import accessQualityChart from '@/plug/accessQualityChart'
import appQualityChart from '@/plug/appQualityChart'

const log = console.log.bind(this)

export default {
  name: 'monitor',
  components: {
    Button, myMenu, chart2, accessQualityChart, appQualityChart
  },
  data () {
    return {
      kuaibao: {
        list: [
          {mixid: 7997, attrid: 463214, title: '快报 golang接入层 内搜推荐兜底数'},
          {mixid: 7997, attrid: 456035, title: '快报 golang接入层 请求总量'},
          {mixid: 7997, attrid: 455985, title: '快报 golang接入层 请求成功量'},
          {mixid: 7997, attrid: 475112, title: '快报 golang接入层 推荐条数少于请求条数'}
        ],
        appid: [1200679360, 1100679360], // 快报ios,快报Android
        accessQualityList: {
          metric: ['num', 'avg_response_time', 'percent95'], // 质量 metric 质量指标 num 请求量，avg_response_time 平均耗时， percent95 95分位耗时
          queryMethod: 'KuaibaoQuality'

        },
        menuList: ['接入层', 'APP质量']

      },
      news: {
        list: [
          {mixid: 7364, attrid: 435024, title: '新闻 接入层 列表页总调用量'},
          {mixid: 7364, attrid: 435027, title: '新闻 接入层 要闻频道调用量'},
          {mixid: 8891, attrid: 484451, title: '新闻 接入层 要闻推荐兜底调用量'},
          {mixid: 8891, attrid: 484452, title: '新闻 接入层 二级频道推荐兜底调用量'},
          {mixid: 7383, attrid: 435498, title: '新闻 push推送 地域推送数请求总量'}
        ],
        appid: [1200032544, 1100032544], // 新聞ios,新聞Android
        accessQualityList: {
          metric: ['num', 'avg_response_time', 'percent95'], // 质量 metric 质量指标 num 请求量，avg_response 平均耗时， percent95 95分位耗时
          queryMethod: 'InewsQuality'

        },
        menuList: ['接入层', 'push', 'APP质量']
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
      appQualityName: { // 每个表的名字,根据参数组合
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
      optionBig: {},
      compareToBig: [],
      list: '',
      menuSelection: '接入层'
    }
  },
  computed: {
    menuList () {
      let ids = this.$route.params.type == 'kuaibao' ? this.kuaibao : this.news
      return ids.menuList
    },
    accessQualityList () {
      let ids = this.$route.params.type == 'kuaibao' ? this.kuaibao : this.news
      return ids.accessQualityList
    },
    appQualityList () {
      let ids = this.$route.params.type == 'kuaibao' ? this.kuaibao : this.news
      // if(this.menuSelection!=='APP质量') return {}
      let page = this.$route.params.type == 'kuaibao' ? 'KuaibaoQuality' : 'InewsQuality'
      let type = ids.appid
      let params = this.appQualityParams
      let quality = []
      type.forEach(item => {
        params.forEach(it => {
          // 表名
          let chartName
          if (it.pushmark === 1) {
            chartName = this.appQualityName[item] + ' push页'
          } else {
            chartName = this.appQualityName[item] + ' ' + this.appQualityName[it.t_type]
          }
          quality.push({
            title: chartName,
            param: {
              appid: item,
              t_type: it.t_type,
              pushmark: it.pushmark,
              data_type: it.data_type,
              uri: this.appUri[chartName],
              link: `${page}/cnews${it.cnews}`
            }
          })
        })
      })
      return quality
    }
  },
  watch: {
      '$route': {
          handler: function(){
              this.switchCharts('接入层')
              let pageTitle = this.$route.params.type == 'kuaibao' ? '快报关键指标监控' : '新闻关键指标监控'
              document.title = pageTitle
          },
          immediate: true
      }
    // $route () {
    //
    // }
  },
  methods: {
    ...mapActions(['getMonitorData']),
    switchCharts (n) { // 只负责传递menu选中的数据,由computed来进行筛选
      this.menuSelection = n
      let ids = this.$route.params.type == 'kuaibao' ? this.kuaibao : this.news
      let arr = ids.list.filter(item => {
        return item.title.match(n)
      })
      this.list = arr
    },
    bigger (opt) {
      this.showBig = true
      this.optionBig = opt
    },
    closeIt () {
      this.showBig = false
    },
    compareFromBig (n) {
      this.compareToBig = n
    }

  },
  created () {
    this.switchCharts('接入层')
  }
}
</script>

<style lang="scss" scoped>
    @mixin center { //居中
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    html, body {
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
            .bigBackground{
                background-color: rgba(243, 243, 243,0.8);
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
                    width: .1px;
                    vertical-align: middle;
                }
            }
        }
    }
</style>
