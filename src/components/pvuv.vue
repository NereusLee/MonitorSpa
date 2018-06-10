<template>
    <div id="pvuv">
        <div id="loading" v-show="loading">
          <Spin size="large" fix v-if="loading"></Spin>
        </div>
        <el-row style="margin-left: 17px;">
            <el-col :span="24">
                <query-condition :rou="this.$route.params.id"></query-condition>
            </el-col>
        </el-row>
            <div id="charts">
                <el-row :gutter="40">
                <el-col :span="12" v-for="(x,index) in list" :key="index">
                        <chart :id="ids[index]"
                               :option="x.option"
                               :describe="describe[index]"
                        ></chart>
                </el-col>
                </el-row>
            </div>
    </div>
</template>
<script>
import {mapState, mapActions, mapMutations} from 'vuex'
// 导入chart组件
import chart from '@/plug/Chart.vue'
import checkBox from '@/components/checkbox'
import QueryCondition from '@/plug/QueryCondition'
import axios from 'axios'
// import { LOADIPHLPAPI } from 'dns';
import { loadavg } from 'os';
import {Spin} from 'iview'

function GetDateStr (AddDayCount) {
  var dd = new Date()
  dd.setDate(dd.getDate() + AddDayCount)// 获取AddDayCount天后的日期
  var y = dd.getFullYear()
  var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)// 获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()// 获取当前几号，不足10补0
  return '' + y + m + d
}
const log = console.log.bind(this)
export default {
  name: 'app',
  data () {
    return {
      list: [],
      describe: ['图文PV', '图文UV', '视频UV', '视频PV'],
      title: ['图文PV', '图文UV', '视频UV', '视频PV'],
      ids: ['articlepv', 'articleuv', 'videouv', 'videovv'],
      loading:true,
      // first:true  //初次加载
    }
  },
  components: {
    QueryCondition,
    chart,
    checkBox,
    Date,
    Spin
  },
  computed: {
      ...mapState(['startingMode', 'channelsData','loading']),
    StartingMode () {
      return this.startingMode
    },
    ChannelsData () {
      return this.channelsData
    }
  },
  watch: {
    StartingMode (n) {
      this.list = this.startingMode
    },
    ChannelsData (n) {
      this.list = this.channelsData
    },
    $route (m) {
      let n = m.params.id
      this.repaint(n)
    }
  },
  methods: {
    ...mapActions(['getStartingMode', 'getChannelsData']),
    repaint (n) {
      if (n == 'startStyle') {
        let seDate = [GetDateStr(-7), GetDateStr(-1)]
        this.getStartingMode(seDate).then(() => {
          this.list = this.startingMode
          this.loading = false
        })
      } else if (n == 'channel') {
        this.getChannelsData().then(() => {
          this.list = this.channelsData
          this.loading = false
        })
        // this.first = false
        // this.list = this.channelsData
      }
    }
  },
  async created () {
    let n = this.$route.params.id
    this.repaint(n)
  }
}

</script>
<style lang="scss" scoped>
    #pvuv{
        padding-top: 9px;
        padding-left: 20px;
        #loading{
            width: 100%;
            height: 100%;
            background-color: #fff;
            opacity: 0.7;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 5;
        }
        // #loading>img{
        //     position: absolute;
        //     top: 50%;
        //     left: 55%;
        //     transform: translate(-50%, -50%);
        // }

    }
    #charts {
        list-style-type: none;
        overflow: hidden;
        /*width:80%;*/
        li {
            /*float: left;*/
            width: 95%;

            /*chart {*/
                /*height: 80%;*/
                /*border: none;*/
            /*}*/
        }
        li:nth-child(even) {
            /*单数序号的li*/
            /*margin-left: 30px;*/
        }
    }

    .el-row {
        margin-bottom: 5px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    #charts .el-col {
        border-radius: 4px;
        max-height: 425px;  //关键的样式
    }
    /*#charts>.el-col-12:nth-child(even){*/
        /*margin-left: 20px!important;*/
    /*}*/
</style>
