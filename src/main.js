// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
import {showChart} from './js/chart'
import axios from 'axios'
import store from './vuex'

Vue.config.productionTip = false

Vue.prototype.$showChart = showChart
Vue.prototype.$axios = axios


new Vue({
  el: '#app',
  router,
    store,
  components: { App },
  template: '<App/>'
})
