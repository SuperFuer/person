import axios from 'axios'

axios.defaults.baseURL = 'http://www.lovegf.cn:8888/api/private/v1/'
// export function login(params){
//     return axios.post('')
// }
// {username:'root',password:'123456'}

// 请求拦截器，给所有的请求加上token
// axios.interceptors.request.use(function (config) {
//     // 取出localStorage中存储的token值
//     let token = localStorage.getItem('mytoken')
//     // 设置到请求头中 Authorization这个名字是后台规定的
//     config.headers['Authorization'] = token
//     return config
//   }, function (error) {
//     return Promise.reject(error)
// })

export const login = (params)=>{ 
    return axios.post('login',params)
}

// 权限列表
export const getmenus = (params)=>{
    return axios.get('menus',params)
}

// 数据统计-销量统计
export const getsales = (params) => {
    return axios.get('reports/:type',params)
}

export const getuserlist = (params) => {
    return axios.get('users',params)
}