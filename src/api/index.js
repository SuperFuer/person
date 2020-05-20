/*
 * @Description:
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-08-26 17:56:12
 * @LastEditors: louisyi
 * @LastEditTime: 2019-10-10 10:28:33
 */
import axios from 'axios'
import router from '@/router'
import Vue from 'vue'
import { hostEnv, SapUrl, Port } from './config'
import { Message, MessageBox } from 'element-ui'
// 配置根域名
axios.defaults.baseURL = hostEnv // 域名地址
axios.defaults.headers.post['Content-Type'] = 'application/json,charset=utf-8'

axios.defaults.timeout = 15000
// let token = localStorage.getItem('token')
// axios.defaults.headers.common['token'] = token
// console.log(token)

// loading框设置局部刷新，且所有请求完成后关闭loading框
let loading
let loginFlag = 'other'
let needLoadingRequestCount = 0 // 声明一个对象用于存储请求个数
function startLoading () {
  loading = Vue.prototype.$loading({
    lock: true,
    text: loginFlag === 'other' ? '数据加载中...' : '正在登录，请稍后...',
    background: 'rgba(0,0,0,0.5)',
    target: document.querySelector('.loading-area') // 设置加载动画区域
  })
}
function endLoading () {
  loading.close()
}
function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}
function hideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    endLoading()
  }
}

// 请求拦截器，给所有的请求加上token
axios.interceptors.request.use(
  function (config) {
    // 取出localStorage中存储的token值
    let token = localStorage.getItem('token')
    // 设置到请求头中 token这个名字是后台规定的
    config.headers['token'] = token
    return config
  },
  function (error) {
    // Message.error({
    //   message: '加载失败'
    // })
    return Promise.reject(error)
  }
)
// 响应拦截器
axios.interceptors.response.use(
  function (response) {
    return response
    // if (response.status === 200) {
    //   if (response.data && response.data.code === 200) {
    //     return response
    //   } else {
    //     alert(response.data.message, '提示', {
    //       confirmButtonText: '确定',
    //       callback: action => {
    //       }
    //     });
    //   }

    // } else {
    //   alert(response.message, '提示', {
    //     confirmButtonText: '确定',
    //     callback: action => {
    //     }
    //   });
    // }
  },
  function (error) {
    // console.log('a', error.response.status)
    // 464 无效token重新登录
    console.log(error)
    if (error.response.status === 464) {
      MessageBox('登录失效，请重新登录', '提示', {
        confirmButtonText: '确定'
      }).then(() => {
        router.push('/login')
      })
    } else if (error.response.status === 404) {
      Message({
        type: 'error',
        message: '网络异常，请重试'
      })
    } else if (error.response.status === 500) {
      Message({
        type: 'error',
        message: '服务器内部错误，请重试'
      })
    }
    return Promise.reject(error)
  }
)

// 封装axios的get请求
// let showLoading=true;

export function axiosGet (url, params = {}) {
  params.loginFlag ? (loginFlag = 'login') : (loginFlag = 'other')
  return new Promise((resolve, reject) => {
    params.showLoading && showFullScreenLoading() // 显示等待框
    axios
      .get(url, params)
      .then(response => {
        params.showLoading && hideFullScreenLoading() // 隐藏等待框
        resolve(response.data)
      })
      .catch(error => {
        params.showLoading && hideFullScreenLoading() // 隐藏等待框
        reject(error)
      })
  })
}

// 封装axios的post请求
export function axiosPost (url, params = {}) {
  params.loginFlag ? (loginFlag = 'login') : (loginFlag = 'other')
  return new Promise((resolve, reject) => {
    params.showLoading && showFullScreenLoading() // 显示等待框
    axios
      .post(url, params)
      .then(response => {
        params.showLoading && hideFullScreenLoading() // 隐藏等待框
        resolve(response.data)
      })
      .catch(error => {
        params.showLoading && hideFullScreenLoading() // 隐藏等待框
        reject(error)
      })
  })
}

// 封装axios的文件下载 post请求 =>用于后台流输出的方式下载
export function axiosDownPost (url, params = {}) {
  params.loginFlag ? (loginFlag = 'login') : (loginFlag = 'other')
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'post',
      data: params,
      headers: {
        Accept: 'application/vnd.ms-excel'
      },
      responseType: 'arraybuffer'
    })
      .then(response => {
        params.showLoading && hideFullScreenLoading() // 隐藏等待框
        resolve(response.data)
      })
      .catch(error => {
        params.showLoading && hideFullScreenLoading() // 隐藏等待框
        reject(error)
      })
  })
}

export let constApi = hostEnv
export let sapUrl = SapUrl
export let port = Port // 域名地址
