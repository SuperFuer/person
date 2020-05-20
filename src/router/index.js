import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'

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
      component: () => import('@/views/jurisdiction/qxset/jsadmin.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/login.vue')
    },
    {
      path: '/load',
      name: 'load',
      component: () => import('@/views/login/load.vue')
    },
    {
      path: '/changePassword',
      name: 'changePassword',
      component: () => import('@/views/home/changePassword.vue')
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('@/views/index.vue'),
      children: [
        {
          path: '/home',
          component: () => import('@/views/home/home.vue')
        },
        {
          path: '/seeDetails',
          component: () => import('@/views/home/see/seeDetails.vue')
        },
        {
          path: '/collDetails',
          component: () => import('@/views/home/coll/collDetails.vue')
        }
      ]
    }
  ]
})
if (store.state.routes.data) {
  store.state.routes.data.forEach(v1 => {
    // v1一级菜单
    // console.log(v.url)
    let route = {}
    route.path = '/' + v1.apiUrl
    // 使用路由懒加载拼接路由路径获取组件
    route.component = () => import(`@/views/${v1.apiUrl}/${v1.apiUrl}.vue`)
    route.children = []
    router.options.routes[4].children.push(route)
    v1.childMenu.forEach(v2 => {
      // v2二级菜单
      // if(v1.apiUrl == 'process' || v1.apiUrl == 'task' || v1.apiUrl == 'application' || v1.apiUrl == 'jurisdiction') {
      let route = {}
      route.path = '/' + v2.apiUrl
      // 使用路由懒加载拼接路由路径获取组件
      route.component = () => import(`@/views/${v1.apiUrl}/${v1.apiUrl}-v3.vue`)
      route.children = []
      router.options.routes[4].children.push(route)
      v2.childMenu.forEach(v3 => {
        // v3三级菜单
        let route = {}
        route.path = '/' + v3.apiUrl
        // 使用路由懒加载拼接路由路径获取组件
        route.component = () => import(`@/views/${v1.apiUrl}/${v2.apiUrl}/${v3.apiUrl}.vue`)
        route.children = []
        router.options.routes[4].children.push(route)
        v3.childMenu.forEach(v4 => {
          // v3三级菜单
          let route = {}
          route.path = '/' + v4.apiUrl
          // console.log(v4.apiUrl)
          // 使用路由懒加载拼接路由路径获取组件
          route.component = () => import(`@/views/${v1.apiUrl}/${v2.apiUrl}/${v3.apiUrl}/${v4.apiUrl}.vue`)
          route.children = []
          router.options.routes[4].children.push(route)
        })
      })
      // }
    })
  })
}
router.addRoutes(router.options.routes)
// localStorage.setItem('router', JSON.stringify(router.options.routes))

// router.beforeEach((to, from, next) => {
  // const token = localStorage.getItem('token')
  // if (token) {
  //   // token存在表示用户已经登录,可以访问任意页面
  //   next()
  // } else {
  //   // token不存在表示用户还没有登录,此时需要重新跳转到登录界面
  //   if (to.path === '/login') {
  //     next()
  //   } else {
  //     next('/login')
  //   }
  //   next('/login')
  // }
  // 确保跳转到下一个路由的时候router.addRoutes的方法加载完毕
  // next({
  //   ...to,
  //   replace: true
  // })
// })
export default router
