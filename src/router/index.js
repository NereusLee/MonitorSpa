import Vue from 'vue'
import Router from 'vue-router'
import pvuv from '@/views/pvuv'
import monitor from '@/views/monitor'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
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
