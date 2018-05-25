import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {showChart} from '@/js/chart'
import qs from 'qs'
import $ from 'jquery'

Vue.use(Vuex)

const log = console.log.bind(this)

function GetDateStr (AddDayCount) {
  var dd = new Date()
  dd.setDate(dd.getDate() + AddDayCount)// 获取AddDayCount天后的日期
  var y = dd.getFullYear()
  var m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)// 获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()// 获取当前几号，不足10补0
  return '' + y + m + d
}

function randomString (len) { // 随机生成字符串
  len = len || 32
  var $chars = 'abcdefhijkmnprstwxyz2345678' /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length
  var pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

function getDataNow (num) { // 拿到当前时间在后台数据中对应的序号
  let myDate = new Date()
  let hour = myDate.getHours()
  let min = myDate.getMinutes()
  if (min < num) {
    return (hour - 1) * 60 + min + 60 - num
  }
  return hour * 60 + min - num
}

export default new Vuex.Store({
  state: {
    loading: false, // 加载动画
    startingMode: [], // 启动方式的数据
    myChannels: `news_news_top,news_news_ent,news_news_finance,news_news_sports,news_news_tech,news_topic`,
    channelsData: [],
    opt: [
      {
        id: 'articlepv',
        cnName: '图文PV',
        series: []
      },
      {
        id: 'articleuv',
        cnName: '图文UV',
        series: []
      },
      {
        id: 'videouv',
        cnName: '视频UV',
        series: []
      },
      {
        id: 'videovv',
        cnName: '视频PV',
        series: []
      }
    ],
  },
  actions: {
    async getStartingMode (context, date) { // 获取启动方式分组的数据
      context.commit('changeLoading') // 加载动画
      let arg = arguments[1] || [GetDateStr(-7), GetDateStr(-1)]
      let url = `http://test.lg.webdev.com/accesslayer/NewsdailyPVUV/GetSimgleTrendChart?sdate=${arg[0]}&edate=${arg[1]}`
      let res = await axios(url)
      // let res = await axios('https://api.myjson.com/bins/zwdji')
      context.commit('changeStartingMode', res)
    },
    async getChannelsData (context) { // 获取按频道分组的数据
      context.commit('changeLoading')
      let seDate = [GetDateStr(-7), GetDateStr(-1)]
      let arg = arguments[1] || {date: seDate, channel: `news_news_top,news_news_ent,news_news_finance,news_news_sports,news_news_tech,news_topic`}
      // console.log(arg.date[0])
      let url = `http://test.lg.webdev.com/accesslayer/NewsdailyPVUV/GetChanelPvUvData?sdate=${arg.date[0]}&edate=${arg.date[1]}&channels=${arg.channel}`
      let data = await axios(url)
      // let data = await axios('https://api.myjson.com/bins/150pce')
      context.commit('changeChannelsData', data)
    },
    async getQualityData (context) {
      let res = await axios('https://api.myjson.com/bins/hsv7y') //新闻接入
      await axios('https://api.myjson.com/bins/18fde6') //快报接入
      await axios('https://api.myjson.com/bins/rr8ge') //

    }
  },
  mutations: {
    changeCompareData (state, v) {
      state.compareData[v.id] = v.data
    },
    changeLoading (state) {
      state.loading = !state.loading
    },
    changeMyChannels (state, v) {
      state.myChannels = v
    },
    changeStartingMode (state, res) { // 接入方式接口数据
      let firstTitle = []
      let sm = res.data.data
      let categories = res.data.categories.map(item => { // 时间,横坐标
        return `${item.slice(4, 6).match(/[1-9]+/)[0]}月${item.slice(6)}日`
      })
      let cnName = ['图文PV', '图文UV', '视频UV', '视频PV']
      let index = 0
      for (let k1 in sm) {
        let series = []
        for (let k2 in sm[k1]) {
          series.push({
            name: k2,
            data: sm[k1][k2]
          })
        }
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
      state.loading = false // 加载动画取消
    },
    changeChannelsData (state, v) { // 频道接口数据
      for (let value of state.opt) {
        value.series = []
      }
      let res = v.data.data
      let canvas = { // 四个图表
        'articlepv': {},
        'articleuv': {},
        'videouv': {},
        'videovv': {}
      }

      let CN = state.myChannels.split(',') // 各个频道的名字

      for (let key in canvas) {
        for (let value of CN) {
          // for(let kk in item){
          canvas[key][value] = {}
        }
      }

      let categories = res[CN[0]]['categories'].map(item => { // 时间,横坐标
        return `${item.slice(4, 6).match(/[1-9]+/)[0]}月${item.slice(6)}日`
      })

      for (let canvasKey in canvas) {
        for (let resKey in res) {
          canvas[canvasKey][resKey] = res[resKey].data[canvasKey]
        }
      }

      for (let key1 in canvas) {
        let index
        switch (key1) {
          case 'articlepv':
            index = 0
            break
          case 'articleuv':
            index = 1
            break
          case 'videouv':
            index = 2
            break
          case 'videovv':
            index = 3
            break
        }
        for (let key2 in canvas[key1]) {
          state.opt[index]['series'].push({
            name: key2,
            data: canvas[key1][key2]
          })
        }
      }
      state.channelsData = []
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
      state.loading = false
    }
  }
})
