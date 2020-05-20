/*
 * @Description: 接口请求
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-08-28 11:28:24
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-23 20:28:41
 */
import { axiosPost, axiosGet, constApi } from '@/api/index.js'

// 闲置申请=》获取设备列表接口
export function getEquipList (params) {
  return axiosPost(`process/assetsIdleProcess/getEquipList`, params)
}

// 闲置申请=》加载数据接口
export function getInitData (params) {
  return axiosGet(
    `/process/common/init-form?processJavaMapping=${params.processJavaMapping}`
  )
}

// 公共接口=》获取弹框页面初始化数据
export function getDialogInitData () {
  return axiosGet(`process/common/init-query`)
}

// 获取所有部门列表
export function getDeptAll (params) {
  return axiosGet(`process/scrap/dept/all?prentId=${params.id}`)
}

// 根据部门获取部门人员
export function getDeptUser (params) {
  return axiosGet(`process/scrap/dept/allUser?deptNum=${params.id}`)
}

// 闲置申请=》获取位置编码
export function getPositionCode () {
  return axiosGet(`process/changeProcess/getPositionCode`)
}

// 闲置申请=》保存提交变更申请接口
export function saveAssetsIdleForm (params) {
  return axiosPost(`process/assetsIdleProcess/submitAssetsIdleForm`, params)
}

// 闲置申请=》撤回接口
export function updateCloseProcess (params) {
  return axiosPost(`/process/assetsIdleProcess/closeProcess`, params)
}

// 闲置申请=》撤回后重新上传接口
export function updateResubmit (params) {
  return axiosPost(`/process/assetsIdleProcess/resubmit`, params)
}

// 闲置申请=》 审批 =》审批或者驳回接口
export function updateApprovalData (params) {
  return axiosPost(`process/assetsIdleProcess/approvalFormData`, params)
}

// 闲置申请=》 审批 =》获取审批历史接口
export function getApprovalHistory (params) {
  return axiosGet(
    `approvalHistoryController/history?applicationNum=${params.applicationNum}`
  )
}

// 闲置申请=》 审批 =》获取审批数据接口
export function getApprovalData (params) {
  return axiosGet(
    `process/assetsIdleProcess/getApprovalData?applyNum=${params.applyNum}`
  )
}

// 文件导入
export const importTemplateUrl = `${constApi}process/assetsIdleHandle/import`

// 公共接口 =》获取模板
export function getTemplateList () {
  return axiosGet(`common/file/template-xzcz/list`)
}

// 闲置处置申请=》获取设备列表接口
export function getDisposalEquipList (params) {
  return axiosPost(`process/assetsIdleHandle/getEquipList`, params)
}

// 闲置处置申请=》保存提交变更申请接口
export function saveDisposalAssetsIdleForm (params) {
  return axiosPost(
    `process/assetsIdleHandle/submitAssetsIdleHandleForm`,
    params
  )
}

// 闲置处置=》 审批 =》获取审批数据接口
export function getDisposalApprovalData (params) {
  return axiosGet(
    `process/assetsIdleHandle/getApprovalData?applyNum=${params.applyNum}`
  )
}

// 闲置处置申请=》 审批 =》审批或者驳回接口
export function updateDisposalApprovalData (params) {
  return axiosPost(`process/assetsIdleHandle/approvalFormData`, params)
}

// 闲置处置申请=》撤回接口
export function updateDisposalCloseProcess (params) {
  return axiosPost(`/process/assetsIdleHandle/closeProcess`, params)
}

// 闲置处置申请=》撤回后重新上传接口
export function updateDisposalResubmit (params) {
  return axiosPost(`/process/assetsIdleHandle/resubmit`, params)
}

// 个人中心=》 审批代理获取历史列表
export function getTransferInfo (params) {
  return axiosGet(`/base/user/queryTransferInfo`, { params })
}

// 个人中心=》 审批代理设置
export function saveTransferApproval (params) {
  return axiosPost(`/base/user/transferApproval`, params)
}

// 文件上传=》 文件上传
export function saveCommonUpload (params) {
  return axiosGet(`/common/file/upload`, { params })
}

// 文件上传=》 获取文件清单
export function getFileListByType (params) {
  return axiosGet(`/common/file/getFileListByType`, { params })
}

// 文件上传=》 文件删除、编辑
export function updateFile (params) {
  return axiosPost(`/common/file/updateFile`, params)
}

// 日志=》 获取日志
export function getLogList (params) {
  return axiosPost(`/base/log/list`, params)
}
