<template>
    <div class="chart-body" :option="option">
        <div class="error" v-if="error">
          <p>网络请求错误或超时!</p>
          <Icon type="refresh" class="refresh" @click='refresh'></Icon>
        </div>
        <Spin size="large" fix v-if="loading"></Spin>
        <div class="chart-head">
            <!--介绍文字和图标-->
            <el-tooltip class="item" effect="light" :content="option.describe" placement="right-start">
                <el-button class='el-but'>
                    <Icon type="information-circled"></Icon>
                </el-button>
            </el-tooltip>
            <Icon type="arrow-expand" @click="expand"></Icon>
            <div class="headTitle">{{option.title}}</div>

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
import { Icon, Spin } from "iview";
import { mapMutations } from "vuex";
import axios from "axios";
import G2 from "@antv/g2";
import DataSet from "@antv/data-set";

const log = console.log.bind(this);

function comparison(num1, num2) {
  num1 = Number(num1);
  num2 = Number(num2);
  // 计算变化率
  let rate = Math.round((num1 - num2) / num2 * 10000) / 100 + "%";
  if (num1 > num2) {
    return {
      color: "green",
      data: rate,
      icon: "arrow-up-a"
    };
  } else {
    return {
      color: "red",
      data: rate,
      icon: "arrow-down-a"
    };
  }
}

function randomString(len) {
  // 随机生成字符串  用来做id
  len = len || 32;
  var $chars = "abcdefhijkmnprstwxyz2345678";
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = "";
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
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
    handleAjaxData: {}
    // queryUrl:{
    //   type:String
    // }
  },
  components: {
    Icon,
    Spin
  },
  data() {
    return {
      id: "",
      title: "",
      title2: "", // 真正的标题
      compare: [],
      time: "",
      current: 0, // 初始值
      optionBig: {}, // 用来传给大图的值
      monitorData: {},
      compareData: [],
      loading: false,
      error: false
    };
  },
  watch: {
    option(n) {
      this.refresh();
    }
  },
  computed: {
    // expandIcon() {
    //   if (this.initFlag) {
    //     return {
    //       type: "close-round",
    //       method: this.closeIt
    //     };
    //   } else {
    //     return {
    //       type: "arrow-expand",
    //       method: this.expand
    //     };
    //   }
    // }
  },
  methods: {
    ...mapMutations(["changeBigChartData"]),
    refresh() {
      this.id = randomString(4);
      this.time = this.now();
      this.compareInit();
      this.getMonitorData().then(() => {
        // 保证在compareInit执行时this.compareData有值
        this.$nextTick(() => {
          this.compareInit();
          this.showChart(this.monitorData);
        });
      });
    },
    compareInit() {
      let arr = this.option.compareData
        ? this.option.compareData
        : this.compareData;
      let day = comparison(arr[0], arr[1]);
      let week = comparison(arr[0], arr[2]);
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
      ];
      this.current = arr[0];
    },
    now() {
      //当前时间
      let myDate = new Date();
      let hour = myDate.getHours();
      let min = myDate.getMinutes();
      if (min < 5) {
        return `${hour - 1}:${min + 55}`;
      }
      return `${hour}:${min - 5}`;
    },
    getDataNow(num) {
      // 拿到当前时间在后台数据中对应的序号
      let myDate = new Date();
      let hour = myDate.getHours();
      let min = myDate.getMinutes();
      if (min < num) {
        return (hour - 1) * 60 + min + 60 - num;
      }
      return hour * 60 + min - num;
    },
    closeIt() {
      this.$emit("closeIt");
    },
    async getMonitorData() {
      // 监视器数据
      // context.commit('changeLoading')
      this.loading = true;
      let ids = this.option;
      var chartArr = [];
      let index = this.getDataNow(5); // 以当前时间的五分钟前为序号
      let res;
      axios.defaults.timeout = 60000;
      try {
        res = await axios(this.option.url);
        // res = await axios("https://api.myjson.com/bins/q8rni");
        if(typeof(res.data) == 'string'){
          this.error = true
        } 
      } catch (e) {
        res = {};
        this.error = true;
      }
      this.loading = false; 
      this.monitorData = res.data
    
      let array = []; // 存放当前时间的值
      res.data.data.forEach((value, num) => {
        array[num] = value.data[index];
      });
      this.compareData = array;
    },
    expand() {
      // 放大效果
      this.$emit("expand");
      this.changeBigChartData({
        chartData: this.monitorData,
        title: this.option.title,
        des: this.option.describe,
        current: this.current,
        time: this.time,
        compare: this.compare
      });
    },
    showChart(data) {
      let names = [];
      data.data.forEach(item => {
        names.push(item.name.replace(/\d+\-0/, "").replace(/\-/, "月") + "日");
      });
      let chartData = this.handleAjaxData(data);
      const ds = new DataSet();
      const dv = ds.createView().source(chartData);
      dv.transform({
        type: "fold",
        fields: names, // 展开字段集
        key: "date", // key字段
        value: "value" // value字段
      });
      const chart = new G2.Chart({
        container: this.id,
        forceFit: true,
        height: 300
      });
      chart.source(dv);
      chart.scale("time", {
        min: 0,
        max: 1440,
        tickCount: 10
      });
      chart.tooltip({
        crosshairs: {
          type: "line"
        }
      });
      chart.axis("value", {
        label: {
          formatter: val => {
            return val;
          }
        }
      });
      chart.legend("date", {
        textStyle: { fill: "#333" }
      });
      chart.scale("x", {
        sync: true
      });

      chart
        .line()
        .position("time*value")
        .color("date", ["#7070FF", "#FF5757", "#6AFF6A"])
        .shape("smooth")
        .size(1)
        .select("rangeX");

      chart.render();
      chart.on('plotdblclick',()=>{
        window.location.href = this.option.link
      })
      chart.on("tooltip:change", ev => {
        let item = ev.items;
        if (item.length == 2) {
          item.unshift({ title: item[1].title, name: "今天", value: 0 });
        }
        let day = comparison(item[0].value, item[1].value);
        let week = comparison(item[0].value, item[2].value);
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
        ];
        this.compare = arr;
        this.current = item[0].value;
        this.time = item[1].title;
      });
    }
  },
  created() {
    this.refresh();
  }
};
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
  .ivu-icon-arrow-expand{
    cursor: pointer;
  }
  .error {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 6;
    text-align: center;
    align-items: center;
    line-height: 100%;
    background-color: rgba(60, 63, 65, 0.6);
    color: #ccc;
    p {
      font-size: 14px;
      @include center();
    }
    .refresh{
      cursor: pointer;
      position: absolute;
      left: 50%;
      bottom: 20%;
      transform: translate(-50%,0);
      font-size: 28px;
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
    height: 50px;
    line-height: 50px;
    font-weight: 800;
    position: relative;
    overflow: hidden;
  }
  .headTitle::after {
    content: "...";
    font-weight: bold;
    position: absolute;
    bottom: 0;
    right: -32;
    padding: 0 20px 1px 45px;
    background: #fff;
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
.highcharts-root {
  max-height: 320px !important;
}
.highcharts-container {
  height: 320px;
}
</style>
