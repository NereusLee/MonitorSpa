import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {showChart} from '@/js/chart'
import qs from 'qs'
import $ from 'jquery'

Vue.use(Vuex)

const log = console.log.bind(this)

function GetDateStr(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
    return '' + y + m + d;
}

function randomString(len) {   //随机生成字符串
    len = len || 32;
    var $chars = 'abcdefhijkmnprstwxyz2345678';  /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

export default new Vuex.Store({
    state: {
        startingMode: [], //启动方式的数据
        channels: `news_news_top,news_news_ent,news_news_finance,news_news_sports,news_news_tech,news_topic`,
        channelsData: [],
        opt: [{
            'id': 'articlepv',
            cnName: '图文PV',
            series: []
        },
            {
                'id': 'articleuv',
                'cnName': '图文UV',
                series: []
            },
            {
                'id': 'videovv',
                'cnName': '视频PV',
                series: []
            },
            {
                'id': 'videouv',
                'cnName': '视频UV',
                series: []
            }
        ],
        monitorData:[]
    },
    mutations: {
        changeStartingMdoe(state, res) {  //接入方式接口数据
            // console.log(v)
            let firstTitle = []
            let sm = res.data
            let categories = res.categories.map(item => { //时间,横坐标
                return `${item.slice(4, 6).match(/[1-9]+/)[0]}月${item.slice(6)}日`
            })
            let cnName = ['图文PV', '图文UV', '视频PV', '视频UV']
            let index = 0;
            for (let k1 in sm) {
                let series = []
                for (let k2 in sm[k1]) {
                    series.push({
                        name: k2,
                        data: sm[k1][k2]
                    })

                }
                // console.log('series:  '+JSON.stringify(series))
                firstTitle.push({
                    id: `${k1}`,
                    option: showChart(
                        series,
                        categories,
                        '',
                        '',
                        cnName[index],
                        'line', '', ''
                    )
                })
                index++
            }
            state.startingMode = firstTitle
        },
        changeChannelsData(state, v) {  //频道接口数据
            for (let value of state.opt) {
                value.series = []
            }
            let res = v.data.data
            let canvas = { //四个图表
                'articlepv': {},
                'articleuv': {},
                'videovv': {},
                'videouv': {}
            }


            let CN = state.channels.split(',') //各个频道的名字

            for (let key in canvas) {
                for (let value of CN) {
                    // for(let kk in item){
                    canvas[key][value] = {}
                }
            }
            let categories = res[CN[0]]['categories'].map(item => { //时间,横坐标
                return `${item.slice(4, 6).match(/[1-9]+/)[0]}月${item.slice(6)}日`
            })

            for (let canvasKey in canvas) {
                for (let resKey in res) {
                    canvas[canvasKey][resKey] = res[resKey].data[canvasKey]
                }

            }
            // console.log(canvas)

            for (let key1 in canvas) {
                let index;
                switch (key1) {
                    case 'articlepv':
                        index = 0;
                        break;
                    case 'articleuv':
                        index = 1;
                        break;
                    case 'videovv':
                        index = 2;
                        break;
                    case 'videouv':
                        index = 3;
                        break;
                }
                for (let key2 in canvas[key1]) {
                    state.opt[index]['series'].push({
                        name: key2,
                        data: canvas[key1][key2]
                    })
                }
            }
            // console.log(state.opt)
            if (state.channelsData.length == 0) {
                for (let value of state.opt) {
                    state.channelsData.push({
                        id: value.id,
                        option: showChart(
                            value.series,
                            categories,
                            '', '',
                            value.cnName,
                            'line',
                            '', ''
                        )
                    })
                }
            }
        },
        changeMonitorData(state,v){
            log(v,v.length)
            for(let kk in v){
                console.log(v[kk])
            }
            for(let i=0;i<v.length;i++){
                log(state.monitorData)

                state.monitorData.push({
                    id: randomString(4),
                    option: showChart(
                        v[i].data.data,
                        v[i].data.categories,
                        '', '',
                        '',
                        'line',
                        '', ''
                    ),
                    describe:`视图ID为${v[i].mixid},属性ID为${v[i].attrid}`
                })
            }
            // state.MonitorData.push({
            //     id: value.id,
            //     option: showChart(
            //         v.data,
            //         v.categories,
            //         '', '',
            //         '',
            //         'line',
            //         '', ''
            //     )
            // })
        }
    },
    actions: {
        getStartingMode(context, date) { //获取启动方式分组的数据
            //   let arg = arguments[1]||[GetDateStr(-5),GetDateStr(0)]
            // axios.post('http://test.lg.webdev.com/appnews/NewsdailyPVUV/GetSimgleTrendChart',
            //     qs.stringify(
            //        {
            //            sdate:arg[0],
            //            edate:arg[1],
            //        })
            axios('https://api.myjson.com/bins/zwdji').then(dat => {
                let res = dat.data

                context.commit('changeStartingMdoe', res)
            })
        },
        getChannelsData(context) { //获取按频道分组的数据
            // let seDate = [GetDateStr(-5),GetDateStr(0)]
            //   let arg = arguments[1]||{date:seDate ,channel:`news_news_top,news_news_ent,news_news_finance,news_news_sports,news_news_tech,news_topic`}
            //   console.log(arg.date[0])
            // axios.post('http://test.lg.webdev.com/appnews/NewsdailyPVUV/GetChanelPvUvData',
            //     qs.stringify(
            //          {
            //          sdate:arg.date[0],
            //          edate:arg.date[1],
            //          channels:arg.channel
            //      })
            axios('https://api.myjson.com/bins/150pce').then(data => {
                console.log(data)
                context.commit('changeChannelsData', data)
            })
        },
        getMonitorData(context,{mixid,attrid,title}) { //监视器数据
            var chartArr = []
            let v = 0
            for(let i=0;i<title.length;i++){
              axios('https://api.myjson.com/bins/q8rni').then(res=>{ 
                let obj = {
                        title:title[0],
                        data:res.data,
                        mixid,
                        attrid:attrid[0]
                    }
                    log(obj)
                    chartArr.push(obj)
              })
                   log(chartArr)  //此时的chartArr无长度,不能选中子元素
            }
            let all = Array.prototype.slice.call(chartArr)
                log(typeof chartArr)
            context.commit('changeMonitorData',chartArr.slice())
        }
    }
})
