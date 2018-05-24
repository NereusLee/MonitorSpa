<template>
    <div class="chart-body" :option="option">
        <div class="chart-head">
            <!--介绍文字和图标-->
            <el-tooltip class="item" effect="light" :content="monitorData.describe" placement="right-start">
                <el-button class='el-but'>
                    <Icon type="information-circled"></Icon>
                </el-button>
            </el-tooltip>
            <div class="headTitle">{{title2}}</div>
            <Icon :type="rightTopIcon.type" @click="rightTopIcon.method"></Icon>
        </div>
        <ul class="comparison">
            <li>
                <p>{{current}}</p>
                当前({{time}})
            </li>
            <li>
                <p :style="{color:compare[1].color}">
                    <Icon :type="compare[1].icon"></Icon>
                    {{compare[1].data}}
                </p>
                相比七天前
            </li>
            <li>
                <p :style="{color:compare[0].color}">
                    <Icon :type="compare[0].icon"></Icon>
                    {{compare[0].data}}
                </p>
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
    import axios from 'axios'

    const log = console.log.bind(this)

    function comparison(num1, num2) {  //计算变化率
        let rate = Math.round((num1 - num2) / num2 * 10000) / 100 + "%"
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

    function randomString(len) {   //随机生成字符串  用来做id
        len = len || 32;
        var $chars = 'abcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        var maxPos = $chars.length;
        var pwd = '';
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
            compareToBig: {
              type: Array
            }
        },
        components: {
            Icon
        },
        data() {
            return {
                id: '',
                title: '',
                title2: '',//真正的标题
                compare: [],
                time: '',
                current: 0,//初始值
                optionBig: {},
                monitorData: {},
                compareData: []
            }
        },
        watch:{
          compareToBig(n){
              this.compare = n.arr
              this.time = n.time
          },
          option(n){
              this.reflash()
          }
        },
        computed:{
          rightTopIcon(){
              if(this.initFlag){
                  return {
                      type:'close-round',
                      method:this.closeIt
                  }
              }else{
                  return {
                      type:'arrow-expand',
                      method:this.expand
                  }
              }
          }
        },
        methods: {
            reflash(){
                this.id = randomString(4)
                this.time = this.now()
                // this.compareInit()
                this.getMonitorData().then(() => {   //保证在compareInit执行时this.compareData有值
                    this.compareInit()
                    this.$nextTick(() => {
                        this.title = this.monitorData.option.title
                        this.title2 = this.monitorData.option.title.split(' ')[2]
                        let opt = this.monitorData.option
                        let optObj = this.showChart(
                            opt.series,
                            opt.categories,
                            opt.title,
                            opt.type,
                        )
                        Highcharts.chart(this.id, optObj)
                    })
                })
            },
            compareInit() {
                let arr = this.compareData
                let day = comparison(arr[0], arr[1])
                let week = comparison(arr[0], arr[2])
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
                    },
                ]
                this.current = arr[0]
            },
            now() {
                let myDate = new Date()
                let hour = myDate.getHours()
                let min = myDate.getMinutes()
                if (min < 5) {
                    return `${(hour - 1)}:${min + 55}`
                }
                return `${hour}:${min - 5}`
            },
            getDataNow(num) {  //拿到当前时间在后台数据中对应的序号
                let myDate = new Date()
                let hour = myDate.getHours()
                let min = myDate.getMinutes()
                if (min < num) {
                    return (hour - 1) * 60 + min + 60 - num
                }
                return hour * 60 + min - num
            },
            closeIt(){
              this.$emit('closeIt')
            },
            async getMonitorData() { //监视器数据
                // context.commit('changeLoading')
                let ids = this.option
                var chartArr = []
                let index = this.getDataNow(5)  //以当前时间的五分钟前为序号
                let res
                let url = `http://yd.lg.webdev.com/accesslayer/NewsMonitorAccesslayer/GetThreeDailyData?type=1&mixid=${ids.mixid}&attrid=${ids.attrid}`
                try {
                    // res=await axios(url)

                    res = await axios('https://api.myjson.com/bins/q8rni')
                } catch (e) {
                    res = {}
                }
                let obj = {
                    title: ids.title,
                    data: res.data,
                    mixid: ids.mixid,
                    attrid: ids.attrid
                }
                this.changeMonitorData(obj)


                let array = []  //存放当前时间的值
                res.data.data.forEach((value, num) => {
                    array[num] = value.data[index]
                })
                this.compareData = array;
            },
            changeMonitorData(obj) {
                if (obj.data) {
                    let series = obj.data.data
                    let categories = obj.data.categories
                    this.monitorData = {
                        option: {
                            series,
                            categories,
                            title: obj.title,
                            type: 'line',
                        },
                        describe: `视图ID为${obj.mixid},属性ID为${obj.attrid}`
                    }
                }

            },
            expand() {  //放大效果
                this.$emit('expand', {
                    opt: this.optionBig,
                    title: this.title,
                    des: this.monitorData.describe,
                    compareData:this.compareData
                })
            },
            showChart(series, categories, title, chartType) {
                let that =this
                let opt = {
                    chart: {
                        type: chartType, //指定图表的类型，默认是折线图（line）
                        zoomType: 'x',
                        events: {
                            redraw: function () {
                                let container = this.container
                                let width = $(container).width()
                                let height = Math.min(0.92 * width, 350) + 'px'
                                log(height)
                                $(this.container).height(height)
                                $(container).children('.highcharts-root').height(height)
                            }
                        }
                    },
                    colors: ['#7070FF', '#FF5757', '#6AFF6A'],
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

                    getThis:()=>{
                        return this
                    },
                    tooltip: {
                        shared: true,
                        // valueSuffix: '分',
                        formatter: function(){
                            let that = opt.getThis()
                            let points = this.points
                            let s = `<p>${points[0].x}</p>`;
                            let words = ['当前时间', '一天前', '七天前']
                            $.each(points, function (i, v) {
                                s += `<span style="font-weight:bold;color:#7a85a2;display: block;">${words[i]}: ${v.point.y} </span>`;
                                that.$data.time = points[0].x
                            });
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
                                },
                            ]
                            that.$data.compare = arr
                            that.$emit('compareFromBig',{arr,time:points[0].x})  //expand函数传过去时,that指向的还是原来小图的vue实例,因此只能手动再把compare的数值传过去
                            that.$data.current = points[0].y
                            return s;
                        },
                        useHTML: true
                    }
                }
                this.optionBig = opt
                return opt
            }
        },
        created() {
            if (this.initFlag !== true) {
                this.reflash()
            } else {
                log(this.option)
                this.id = randomString(4)
                this.title2 = this.option.title
                this.monitorData.describe = this.option.des
                this.compareData = this.option.compareData
                this.compareInit()
                this.$nextTick(() => {
                    Highcharts.chart(this.id, this.option.opt)
                })
            }
        }
    }


</script>

<style lang="scss" scoped>
    .chart-body {
        width: 100%;
        margin: 0 auto 35px;
        background-color: white;
        padding: 0 18px 0 0;
        max-height: 433px;
    }

    .x-bar {
        border: none;
    }

    @mixin center() {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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
            float: right;
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
</style>
