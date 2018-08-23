<template>
  <div class="chart-body" :option="option">
    <div class="chart-head">
      <!--介绍文字和图标-->
        <el-tooltip class="item" effect="light" :content="describe" placement="right-start">
          <el-button class='el-but'><Icon type="information-circled"></Icon></el-button>
        </el-tooltip>
        <div class="headTitle">{{title}}</div>
    </div>
    <div class="x-bar">
      <p :id="id"></p>
    </div>
  </div>
</template>
<script>
import Highcharts from 'highcharts'
import {Icon} from 'iview'
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
  components: {
    Icon
  },
  data () {
    return {
      title: ''
    }
  },
  watch: {
    option (n) {
      this.title = this.option.title
      // this.$nextTick(()=>{
      Highcharts.chart(this.id, this.option.option)
      // })
    }
  },
  // mounted() {
  //     // console.log(typeof(this.option.series[0]['data'][0]))
  //     Highcharts.chart(this.id, this.option)
  // },
  mounted () {
    // console.log(this.id)
    this.title = this.option.title
    this.$nextTick(() => {
      Highcharts.chart(this.id, this.option.option)
    })
  }
}
</script>

<style lang="scss">
  .chart-body{
    width: 90%;
    /*margin: auto;*/
    max-width: 600px;
    /*height: 420px;*/
  }
  .chart-root{
    height: 420px;
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
    font-weight: 600;
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
    position: relative;
    top: 8px;
    left: 5px;
    .ivu-icon {
      color: rgb(43,133,228);
    }
    .el-tooltip__popper is-light {
      background-color: rgb(255, 231, 147);
    }
  }
</style>
