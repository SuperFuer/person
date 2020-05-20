/*
 * @Description: 公共api
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-23 14:00:34
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-23 20:28:56
 */
import { axiosGet, constApi } from '@/api/index.js'

// 获取部门树结构
export function getDeptList () {
  return axiosGet(`exdept/dept-tree?dept=true`)
}

// 文件上传
export const filelUrl = `${constApi}common/file/upload`
