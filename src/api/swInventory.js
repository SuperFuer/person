/*
 * @Description: 盘点接口
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-19 16:47:36
 * @LastEditors: louisyi
 * @LastEditTime: 2019-10-13 18:15:51
 */
import { axiosGet, axiosPost, axiosDownPost, constApi } from '@/api/index.js'

// 盘点任务=》获取盘点任务列表
export function getListInventory (params) {
  return axiosPost(`process/Inventory/listInventory`, params)
}

// 盘点任务=》获取盘点名称下拉框
export function getInventoryNames (params) {
  return axiosPost(`process/Inventory/getInventoryNames`, params)
}

// 盘点任务=》结束盘点
export function updateFinishInventory (params) {
  return axiosPost(`process/Inventory/finishInventory/${params.id}`)
}

// 盘点任务=》获取盘点管理记录下的盘点明细
export function getInventoryInfo (params) {
  return axiosPost(`process/Inventory/getInventoryInfo`, params)
}

// 盘点任务=》生成盘点任务
export function addInventory (params) {
  return axiosPost(`process/Inventory/addInventory`, params)
}

// 盘点管理=》设备使用人任务列表
export function getinventoryUsingMan (params) {
  return axiosPost(`process/Inventory/inventoryUsingMan`, params)
}

// 盘点管理=》信息统计
export function getinventorySingleStatistics (params) {
  return axiosPost(`process/Inventory/inventorySingleStatistics`, params)
}

// 盘点管理=》新增盘盈设备
export function addInventoryDetail (params) {
  return axiosPost(`process/Inventory/addInventoryDetail`, params)
}

// 盘点管理=》删除盘点设备
export function removeInventory (params) {
  return axiosPost(`process/Inventory/removeInventoryDetail`, params)
}

// 盘点管理=》保存设备
export function doInventoryUsingMan (params) {
  return axiosPost(`process/Inventory/doInventoryUsingMan`, params)
}

// 盘点管理=》查看盘点任务中的部门盘点/审批信息
export function getViewDeptProcessInfo (params) {
  return axiosPost(
    `process/Inventory/viewDeptProcessInfo/${params.managementId}`
  )
}

// 部门盘点=》盘点结果列表
export function getInventoryDeptInfo (params) {
  return axiosPost(`process/Inventory/getInventoryDeptInfo`, params)
}

// 部门盘点=》获取部门列表
export function getDeptList (params) {
  return axiosGet(`process/common/init-query`, params)
}

// 部门盘点=》资产盘点下载
export function downloadFile (params) {
  return axiosDownPost(`process/Inventory/downloadFile`, params)
}

// 抽盘=》获取盘点任务
export function getInventoryListByPage (params) {
  return axiosGet(`process/extractInventory/getInventoryListByPage`, {
    params
  })
}

// 抽盘=》生成抽盘任务
export function addGenerateExtractTask (params) {
  return axiosPost(`process/extractInventory/generateExtractTask`, params)
}

// 抽盘=》获取抽盘任务列表
export function getExtractTaskListByPage (params) {
  return axiosGet(`process/extractInventory/getExtractTaskListByPage`, {
    params
  })
}

// 抽盘=》获取抽盘明细
export function getExtractTaskEquipDetail (params) {
  return axiosGet(`process/extractInventory/getExtractTaskEquipDetail`, {
    params
  })
}

// 发起审批=》初始化
export function inventoryInitForm (params) {
  return axiosGet(`/process/inventoryProcessForm/init-form`, {
    params
  })
}

// 发起审批=》列表数据
export function iInventoryResult (params) {
  return axiosGet(`/process/inventoryProcessForm/iInventoryResult`, {
    params
  })
}

// 发起审批=》提交
export function inventorySubmit (params) {
  return axiosPost(`/process/inventoryProcessForm/submit`, params)
}

// 申请历史=》获取审批数据
export function getApproval (params) {
  return axiosGet(`/process/inventoryProcessForm/getApproval`, {
    params
  })
}

// 盘点审批=》提交 驳回
export function inventoryApproval (params) {
  return axiosPost(`/process/inventoryProcessForm/passOrReject`, params)
}

// 盘点申请=》重新提交
export function resubmit (params) {
  return axiosPost(`/process/inventoryProcessForm/resubmit`, params)
}

// 盘点申请=》撤回
export function closeProcess (params) {
  return axiosPost(`/process/inventoryProcessForm/closeProcess`, params)
}

// 抽盘=》结束盘点任务
export function endExtractTask (params) {
  return axiosPost(`process/extractInventory/endExtractTask`, params)
}

// 抽盘=》抽盘明细根据id下载
export function downLoadExtractDetail (params) {
  return axiosDownPost(`process/extractInventory/downLoadExtractDetail`, params)
}

// 抽盘=》文档下载
export const downLoadCheckReport = `${constApi}common/file/template-qcbg/list`

// 公共接口 =》获取模板
export function getTemplateList () {
  return axiosGet(`common/file/template-qcbg/list`)
}
