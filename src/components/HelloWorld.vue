<template>
  <div>
    <date></date>
    <check-box></check-box>
    <ul id="charts">
      <li v-for="x in list">
        <p class="chart-head">
          <el-tooltip class="item" effect="light" content="Right Top 提示文字" placement="right-start">
            <el-button class='el-but'><i class="iconfont">&#xe735;</i></el-button>
          </el-tooltip>
        </p>
        <chart :id="x.id" :option="x.option"></chart>
      </li>
    </ul>
  </div>
</template>
<script>
const log = console.log.bind(this)
import { mapState, mapActions, mapMutations } from 'vuex'
// 导入chart组件
import chart from '@/components/Chart.vue'
import checkBox from '@/components/checkbox.vue'
import Date from '@/plug/datePicker'

export default {
  name: 'app',
  data() {
    return {
      list: []
    }
  },
  components: {
    chart,
    checkBox,
    Date
  },
  computed: {
    ...mapState(['startingMode', 'channelsData']),
    StartingMode() {
      return this.startingMode.length==0?sessionStorage['style']:this.startingMode
    },
    ChannelsData() {
      return this.channelsData.length==0?sessionStorage['channel']:this.channelsData
    }
  },
  watch: {
    StartingMode(n) {
      log(n)
      sessionStorage.setItem('style', JSON.stringify(this.startingMode))
      this.list = this.startingMode
    },
    ChannelsData(n) {
      log(n)
      sessionStorage.setItem('channel', JSON.stringify(this.channelsData))
      this.list = this.channelsData
    },
    $route(m) {
      let n = m.params.id
      this.list = this.repaint(n)
    }
  },
  methods: {
    ...mapActions(['getStartingMode', 'getChannelsData']),
    repaint(n) {
      console.log(n)
      if (n == 'startStyle') {
        if (sessionStorage['style'] === undefined || sessionStorage['style'] == '[]' || sessionStorage['style'] == '') {
          this.getStartingMode()
        }
        return this.startingMode.length==0?JSON.parse(sessionStorage['style']):this.startingMode
      } else if (n == 'channel') {
        if (sessionStorage['channel'] === undefined || sessionStorage['channel'] == '[]' || sessionStorage['channel'] == '') {
          this.getChannelsData()
          sessionStorage.setItem('channel', JSON.stringify(this.channelsData))
        }
        return this.channelsData.length==0?JSON.parse(sessionStorage['channel']):this.channelsData
      }
    }
  },
  created() {
    log('start')
    this.list = this.repaint(this.$route.params.id)
    log(this.list)
  }
}

</script>
<style lang="scss" scoped>
ul {
  list-style-type: none;
  overflow: hidden;
  /*width:80%;*/
  li {
    float: left;
    width: 48%;
    .chart-head {
      height: 30px;
      position: relative;
      .item {
        position: absolute;
        top: 0;
        left: 10px;
      }
      .el-but {
        border: none;
        .iconfont {
          color: rgb(245, 181, 58);
        }
        .el-tooltip__popper is-light {
          background-color: rgb(255, 231, 147);
        }
      }
    }
    chart {
      height: 80%;
      border: none;
    }
  }
  li:nth-child(even) {
    /*单数序号的li*/
    margin-left: 30px;
  }
}

</style>
