<template>
<div>
    <p>{{title}}</p>
    <div id="c1" style="width:80%;"></div>
    <div id="slider"></div>
    <div id="c2"></div>
    <div id="slider2"></div>
</div>
</template>

<script>
import axios from "axios";
import G2 from "@antv/g2";
import DataSet from "@antv/data-set";
import Slider from "@antv/g2-plugin-slider";

const log = console.log.bind(this);
export default {
  data() {
    return {
      title: ""
    };
  },
  methods: {
    handle1(data){
      return  data.categories.map((element, index) => {
        let obj = {};
        data.data.forEach((item, key) => {
          let obj2 = {
            time: element
          };
          obj2["lyd" + item.name] = item.data[index];
          obj = { ...obj, ...obj2 };
        });
        // chartData=[...chartData,...arr]
        return obj;
      })
    },
    handle2(data){
      let array =[]
      data.data.forEach((element,index)=>{
      let arr= data.categories.map((item,key)=>{
          return {
            time:'bb'+item,
            value:element.data[key],
            name:'lyd'+element.name
          }
        })
        array.push(...arr)
      })
        return array

    },
    async getData() {
      // let res = await axios("https://api.myjson.com/bins/ai9le")
      let res = await axios("https://api.myjson.com/bins/q8rni");
      let data = res.data;
      log(data);

      let names = [];
      data.data.forEach(item => {
        names.push("lyd" + item.name);
      });
      let chartData = this.handle1(data)

      const ds = new DataSet({
        state: {
          start: "00:00",
          end: "05:39"
        }
      });
      const dv = ds.createView().source(chartData);
      
      dv.transform({
        type: "fold",
        fields: names, // 展开字段集
        key: "date", // key字段
        value: "value", // value字段
      }).transform({
         type: "filter",
          callback: obj => {
            return obj.time <= ds.state.end && obj.time >= ds.state.start;
          }
      });
      log(dv);
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
      // const geom = chart.line()
      // log(geom)
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

      // chart.on('click', ev => {
      //     var tooltip = $("#"+ev.toElement.id).siblings(".g2-tooltip");
      //     var time = tooltip.find(".g2-tooltip-title").text();
      //     if(time == '') return;
      //     that.updateTrend(id,data,time);
      // });

      chart.render();

      const slider = new Slider({
        container: "slider",
        start: "05:00",
        end: "15:39",
        data:chartData, // !!! 注意是原始数据，不要传入 dv
        xAxis: "time",
        yAxis: "value",
        background:'black',
        onChange: ({ startText, endText }) => {
          // !!! 更新状态量
          ds.setState("start", startText);
          ds.setState("end", endText);
        }
      });
      slider.render();

      // let Frame = G2.Frame;
      // let frame = new Frame(chartData);
      // frame = Frame.combineColumns(
      //   frame,
      //   names,
      //   "value",
      //   "name",
      //   "time"
      // );
      // log(frame);
      // var chart = new G2.Chart({
      //   id: "c1",
      //   forceFit: true,
      //   height: 300,
      //   plotCfg: {
      //     margin: [20, 20, 100, 80]
      //   }
      // });

      // chart.source(frame, {
      //   time: {
      //     tickCount: 12,
      //     // alias: '时间'
      //   },
      //   value: {
      //     alias: "数值"
      //   }
      // });
      // chart.legend({
      //   position: "bottom",
      //   dy: 5,
      //   marker:'plus'
      // });
      // chart.axis("time", {
      //   tickLine: {
      //     stroke: "#000",
      //     value: 6 // 刻度线长度
      //   },
      //   tickLine:{
      //     color:'grey'
      //   }
      // });
      // chart.axis("value", {
      //   line: null,
      //   tickLine: {
      //     stroke: "#000",
      //     value: 6 // 刻度线长度
      //   },
      //   labels: {
      //     label: {
      //       fill: "#000"
      //     }
      //   },
      //   tickLine:null
      // });
      // chart.setMode("select");
      // chart.select('rangeX');
      // chart
      //   .line()
      //   .position("time*value")
      //   .color("name", ["#7070FF", "#FF5757", "#6AFF6A"])
      //   .shape("spline")
      //   .size(1)
      // chart.render();
      // // 监听双击事件，这里用于复原图表
      // chart.on("plotdblclick", function(ev) {
      //   chart.get("options").filters = {}; // 清空 filters
      //   chart.repaint();
      // });
      // chart.on('click',()=>{
      //   log(chart)
      //   log(chart.get('options'))
      //   chart.repaint()
      // })
      // $('#pp').on('click',()=>{
      //   log(chart)
      //   chart.repaint()
      // })
      chart.on("tooltip:change", ev => {
        this.title = ev.items[2].value;
      });
    }
  },
  created() {
    this.getData()
  }
};
</script>

<style lang="sass" scoped>

</style>
