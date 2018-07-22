import Vue from 'vue'
import Router from 'vue-router'
import App from '@/views/app/App'
import pvuv from '@/views/pvuv/pvuv'
import monitor from '@/views/monitor/monitor'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'app',
      component: App
    },
    {
      path: '/pvuv/:id',
      name: 'pvuv',
      component: pvuv
    },
    {
      path: '/monitor/:type',
      component: monitor,
      name: 'monitor'
    }
  ]
})
