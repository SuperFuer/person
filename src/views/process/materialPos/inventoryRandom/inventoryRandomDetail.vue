<!--
 * @Description: 盘点结果明细页面
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-19 20:16:05
 * @LastEditors: louisyi
 * @LastEditTime: 2019-10-13 15:21:31
 -->
<template>
  <div class="inventoryRandomDetail">
    <div class="form-title"><i class="icon"></i>抽盘设备明细</div>

    <el-collapse class="common-fold common-collapse common-table"
                 v-model="currentCollapse">
      <el-collapse-item name="1"
                        class="active">
        <template slot="title">
          <div class="collapse-title">抽盘设备列表</div>
        </template>
        <div class="tableList">
          <el-button type="success"
                     size="small"
                     class="zBtn">返回</el-button>
          <el-button type="success"
                     size="small"
                     class="zBtn"
                     @click="downLoadExtractDetail">下载</el-button>

          <!-- table列表 -->
          <el-table :data="tableData"
                    border
                    highlight-current-row
                    style="width: 100%">
            <el-table-column :show-overflow-tooltip='true'
                             label="序号"
                             width="55"
                             type="index"></el-table-column>
            <el-table-column prop="inventoryName"
                             label="盘点名称"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="inventoryYear"
                             label="盘点年度"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="resultName"
                             label="盘点结果"
                             show-overflow-tooltip></el-table-column>

            <el-table-column prop="equipNum"
                             label="设备编码"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="equipName"
                             label="设备名称"
                             show-overflow-tooltip></el-table-column>

            <el-table-column prop="positionCode"
                             label="位置编码"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="locationName"
                             label="位置描述"
                             show-overflow-tooltip></el-table-column>

            <el-table-column prop="installLocDesc"
                             label="安装地点"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="module"
                             label="规格型号"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="factoryNum"
                             label="出厂序号"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="usingDeptName"
                             label="使用部门"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="moduleName"
                             label="使用模块"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="usingManName"
                             label="使用人"
                             show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="invType"
                           label="盘点方式"
                           show-overflow-tooltip></el-table-column> -->
            <el-table-column prop="remark"
                             label="备注"
                             show-overflow-tooltip></el-table-column>

          </el-table>
        </div>
        <!-- 分页 -->
        <div class="block pagination">
          <el-pagination background
                         layout="total, prev, pager, next, jumper"
                         :total="popPageCount"
                         :page-size="popPageSize"
                         :current-page.sync="popCurrentPage"
                         @current-change="handlePopPagination"></el-pagination>
        </div>

      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { getExtractTaskEquipDetail, downLoadExtractDetail } from '@/api/swInventory.js'
export default {
  data () {
    return {
      id: '',
      currentCollapse: ['1'],
      tableData: [],
      popCurrentPage: 1,
      popPageSize: 10,
      popPageCount: 0
    }
  },
  mounted () {
    this.id = this.$route.query.id
    this.getExtractTaskEquipDetail()
  },

  methods: {
    // 获取盘点明细
    getExtractTaskEquipDetail () {
      getExtractTaskEquipDetail({
        pageNum: this.popCurrentPage,
        pageSize: this.popPageSize,
        extractId: this.id
      }).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.popPageCount = res.data.total
        }
      })
    },
    handlePopPagination (val) {
      this.popCurrentPage = val
      this.getExtractTaskEquipDetail()
    },

    // 盘点下载
    downLoadExtractDetail (status) {
      if (!this.id) {
        this.$message({
          message: '请先选择您要查询抽盘id!',
          type: 'error'
        })
        return
      }
      downLoadExtractDetail({
        extractId: this.id
      }).then((res) => {
        const content = res
        const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' })
        const fileName = '导出信息.xls'
        if ('download' in document.createElement('a')) { // 非IE下载
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)

          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        } else { // IE10+下载
          navigator.msSaveBlob(blob, fileName)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inventoryRandomDetail {
  .tableList {
    overflow: hidden;
    .zBtn {
      float: right;
      margin-left: 6px;
      margin-bottom: 14px;
      background: #004ea2;
      border: 1px solid #004ea2;
    }
  }
}
</style>
