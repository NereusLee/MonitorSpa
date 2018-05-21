import Vue from 'vue'
import Router from 'vue-router'
import pvuv from '@/components/pvuv'
import monitor from '@/components/monitor'
import test from '@/components/test'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/pvuv/:id',
      name: 'pvuv',
      component: pvuv
    },
   {
       path: '/monitor/:type',
       name: 'monitor',
       component: monitor
   },
   {
       path: '/test',
       name: 'test',
       component: test
   },
  ]
})
