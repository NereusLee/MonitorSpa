import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/main'
import Test from '@/components/test'
import monitor from '@/components/monitor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/hello/:id',
      name: 'main',
      component: HelloWorld
    },
    {
      path: '/test',
      name: 'test',
      component: Test
    },
   {
       path: '/monitor',
       name: 'monitor',
       component: monitor
   },
  ]
})
