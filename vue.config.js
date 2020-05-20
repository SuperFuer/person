/*
 * @Description:
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-08-29 10:56:01
 * @LastEditors: louisyi
 * @LastEditTime: 2019-08-29 18:19:44
 */
const path = require('path')
const resolve = dir => path.join(__dirname, dir)

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@s', resolve('src'))
      .set('@v', resolve('src/views'))
      .set('@materialPos', resolve('src/views/process/materialPos'))
  },
  // 基本路径
  baseUrl: './',
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // 服务器端口号
  devServer: {
    port: 8081,
    disableHostCheck: true,
    headers: {
      'Access-Contorol-Allow-Origin': '*'
    },
    hotOnly: false,
    hot: true,
    overlay: {
      warnings: false,
      errors: false
    }
  },
  lintOnSave: false
}
