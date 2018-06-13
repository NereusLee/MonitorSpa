<template>
<div class="bigBody">
    <p class="big-title">{{title}}</p>
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
    <div id="c1" style="width:80%;"></div>
    <div id="slider"></div>
</div>
</template>

<script>
import G2 from "@antv/g2";
import DataSet from "@antv/data-set";
import Slider from "@antv/g2-plugin-slider";
import { mapState } from "vuex";
import { Icon } from "iview";

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

export default {
  props: {
      handleAjaxData:{}
  },
  data() {
    return {
      title: "",
      compare: [],
      time: "",
      current: "",
      des: ""
    };
  },
  components: {
    Icon
  },
  computed: {
    ...mapState(["bigChartData"])
    // chartOption() {
    //   return this.bigChartData;
    // }
  },
  watch: {
    bigChartData: {
      handler(n) {
        log(n);

        // let c1 = document.getElementById("c1");
        // let slid = document.getElementById("slider");
        // if (c1) {
        //   c1.innerHTML = "";
        //   slid.innerHTML = "";
        // }
        this.showChart();
      }
      // immediate: true
    }
  },
  methods: {
    // handleAjaxData(data) {
    //   return data.categories.map((element, index) => {
    //     let obj = {};
    //     data.data.forEach((item, key) => {
    //       let obj2 = {
    //         time: element
    //       };
    //       obj2[item.name.replace(/\d+\-0/, "").replace(/\-/, "月") + "日"] =
    //         item.data[index];
    //       obj = { ...obj, ...obj2 };
    //     });
    //     // chartData=[...chartData,...arr]
    //     return obj;
    //   });
    // },
    showChart() {
      //   let names = ['今天','1天前','7天前']
      let chartData = this.handleAjaxData(this.bigChartData.chartData);
      let names = [];
      this.bigChartData.chartData.data.forEach(item => {
        names.push(item.name.replace(/\d+\-0/, "").replace(/\-/, "月") + "日");
      });
      const ds = new DataSet({
        state: {
          start: "05:00",
          end: "07:00",
        }
      });
      const dv = ds.createView().source(chartData);

      dv
        .transform({
          type: "fold",
          fields: names, // 展开字段集
          key: "date", // key字段
          value: "value" // value字段
        })
        .transform({
          type: "filter",
          callback: obj => {
            return obj.time <= ds.state.end && obj.time >= ds.state.start;
          }
        });
    //   log(dv);
      const chart = new G2.Chart({
        container: "c1",
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
      chart.on("tooltip:change", ev => {
        let item = ev.items;
        if (item.length == 2) {
          item.unshift({ title:item[1].title,name: "今天", value: 0 });
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

      const slider = new Slider({
        container: "slider",
        start: "05:00",
        end: "07:00",
        data: chartData, // !!! 注意是原始数据，不要传入 dv
        xAxis: "time",
        yAxis: "value",
        height: 34,
        onChange: ({ startText, endText }) => {
          // !!! 更新状态量
          ds.setState("start", startText);
          ds.setState("end", endText);
        }
      });
      slider.render();
    }
  },
  created() {
    this.title = this.bigChartData.title;
    this.compare = this.bigChartData.compare;
    this.time = this.bigChartData.time;
    this.current = this.bigChartData.current;
    this.des = this.bigChartData.des;
  },
  mounted() {
    // this.$nextTick(() => {
      this.showChart();
    // });
  }
};
</script>

<style lang="scss" scoped>
.bigBody {
  margin: 0 auto;
  .big-title {
    text-align: center;
    font-size: 15px;
    font-weight: 800;
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
  #c1,
  #slider {
    margin: 0 auto;
  }
}
</style>
