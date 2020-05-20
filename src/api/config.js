/*
 * @Description: 打包配置
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-02 14:31:22
 * @LastEditors: louisyi
 * @LastEditTime: 2019-10-10 19:51:05
 */

/** *******打包注意事项*********/
/*
 * 由于引入了SAP页面 打包端口和引入地址对应关系如下
 * SapUrl 对应三个环境 三个地址
 * Port 对应三个环境 两个地址 （预生产和生产端口一致）
 */

const configEnv = process.env.NODE_ENV
let hostEnv = 'http://10.34.34.24:8080/'
let SapUrl = 'http://10.40.19.40:8000/' // SAP开发地址
let Port = 300 // SAP开发端口
if (configEnv === 'development') {
  // hostEnv = 'http://10.34.31.187:8080/' // 张立本机
  hostEnv = 'http://127.0.0.1:8080/'
  // hostEnv = 'http://10.34.36.173:8080/'   // 马文成地址
  // hostEnv = 'http://192.168.1.109:8080/' // 马文成地址
  // hostEnv = 'http://10.40.19.41:7006/' // 北京本地
  // hostEnv = 'http://10.40.19.41:7002/' // 周长本机
} else if (configEnv === 'production') {
  hostEnv = '/asset/'
  // Port = 800 // 预生产和生产端口
  // SapUrl = 'http://10.40.19.98:8000/' // 98预生产
  // SapUrl = 'http://10.40.19.93:8000/' // 93生产
}

export { hostEnv, SapUrl, Port }
