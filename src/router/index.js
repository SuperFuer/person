import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

import jsadmin from '@/views/jurisdiction/qxset/jsadmin.vue'
import login from '@/views/login/login.vue'
import index from '@/views/index.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/index' // 路由重定向
    },
    {
      path: '/jsadmin',
      name: 'jsadmin',
      component: jsadmin
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/index',
      name: 'index',
      component: index,
    }
  ]
})
export default router
