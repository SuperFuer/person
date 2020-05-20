<!--
 * @Description: 台账盘点管理列表
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-19 14:07:32
 * @LastEditors: louisyi
 * @LastEditTime: 2019-10-13 15:22:43
 -->

<template>
  <div class="inventory">
    <div class="form-title"><i class="icon"></i>台账盘点管理</div>

    <div class="query-title">查询台账盘点</div>

    <el-form :inline="true">
      <el-form-item label="盘点名称"
                    label-width="100px">
        <el-select v-model="searchInput.name"
                   placeholder="请选择"
                   class="add">
          <el-option v-for="(item,index) in nameList"
                     :key="index"
                     :label="item"
                     :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="盘点年度"
                    label-width="100px">
        <el-date-picker v-model="searchInput.inventoryYear"
                        type="year"
                        value-format="yyyy"
                        placeholder="选择年">
        </el-date-picker>
      </el-form-item>
      <el-form-item label=""
                    label-width="5px">
        <el-button type="success"
                   size="small"
                   @click="getListInventory">搜索</el-button>
      </el-form-item>
    </el-form>

    <div class="division">
      <div class="query-title__auto">台账盘点</div>

      <div class="division-right">
        <el-button size="small"
                   type="primary"
                   @click="dialogOpen">生成盘点任务</el-button>
      </div>
    </div>
    <div class="tableList">

      <el-button type="success"
                 size="small"
                 @click="downloadFile(item.status)"
                 class="zBtn"
                 v-for="(item,index) in downList"
                 :key="index">{{item.name}}</el-button>

      <!-- table列表 -->
      <el-table :data="tableData"
                border
                highlight-current-row
                max-height="400"
                style="width: 100%">
        <el-table-column label="单选"
                         width="65">
          <template slot-scope="scope">
            <el-radio class="radio"
                      v-model="templateSelection"
                      :label="scope.row.id">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip='true'
                         label="序号"
                         width="55"
                         type="index"></el-table-column>
        <el-table-column prop="name"
                         label="盘点名称"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="inventoryYear"
                         label="盘点年度"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="deptTotal"
                         label="盘点部门"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="deptTotal"
                  @click="deptDetailOpen(scope.row)">{{scope.row.deptTotal}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="inventoryTotal"
                         label="盘点总量"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="notInventoryTotal"
                         label="未盘设备"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="match"
                         label="账实相符设备"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="surplus"
                         label="盘盈设备"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="deficit"
                         label="盘亏设备"
                         show-overflow-tooltip></el-table-column>
        <el-table-column prop="status"
                         label="盘点状态"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.status===-1">
              未开始
            </span>
            <span v-if="scope.row.status===0">
              盘点中
            </span>
            <span v-if="scope.row.status===1">
              已结束
            </span>

          </template>
        </el-table-column>
        <el-table-column fixed="right"
                         width="196"
                         label="操作">
          <template slot-scope="scope">
            <el-button type="danger"
                       :disabled="scope.row.status===1"
                       @click.native.prevent="deleteRow(scope.row)"
                       size="mini">
              结束盘点
            </el-button>
            <el-button type="primary"
                       @click.native.prevent="inventoryDetailed(scope.row)"
                       size="mini">
              盘点明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="block pagination">
        <el-pagination @current-change="handleCurrentChange"
                       :current-page.sync="searchInput.current"
                       :page-size="searchInput.size"
                       background
                       layout="total, prev, pager, next, jumper"
                       :total="totalCount">
        </el-pagination>
      </div>

    </div>

    <!-- 生成盘点任务弹框弹框 -->
    <inventoryAdminDialog v-model="dialogVisible"
                          ref="swDialog"
                          @updateList="getListInventory"></inventoryAdminDialog>

    <!-- 查看部门详情弹框 -->
    <inventoryAdminDeptDetail v-if="managementId"
                              :managementId="managementId"
                              v-model="deptDetailVisible"></inventoryAdminDeptDetail>
  </div>
</template>

<script>
import { downloadFile, getListInventory, getInventoryNames, updateFinishInventory } from '@/api/swInventory.js'
import dayjs from 'dayjs'
import inventoryAdminDialog from './inventoryAdmin/inventoryAdminDialog'
import inventoryAdminDeptDetail from './inventoryAdmin/inventoryAdminDeptDetail'
export default {
  data () {
    return {
      searchInput: {
        current: 1,
        size: 10,
        name: '',
        inventoryYear: dayjs(Date.now()).format('YYYY')
      },
      totalCount: 0,
      nameList: [], // 盘点名称下拉框
      templateSelection: '', // table 列表当选
      dialogVisible: false, // 生成盘点任务弹框弹框
      deptDetailVisible: false, // 点击部门查看部门详情弹框
      managementId: '', // 点击部门查看部门ID
      tableData: [],
      downList: [
        {
          status: '-1',
          name: '未盘资产明细下载'
        }, {
          status: '1',
          name: '帐实相符资产明细表下载'
        }, {
          status: '3',
          name: '盘盈明细表下载'
        }, {
          status: '2',
          name: '盘亏明细表下载'
        }
      ]
    }
  },
  mounted () {
    this.getInventoryNames()
    this.getListInventory()
  },
  components: {
    inventoryAdminDialog,
    inventoryAdminDeptDetail
  },

  methods: {
    dialogOpen () {
      this.dialogVisible = !this.dialogVisible
    },
    deptDetailOpen (row) {
      this.managementId = row.id
      this.deptDetailVisible = !this.deptDetailVisible
    },
    handleCurrentChange (val) {
      this.searchInput.current = val
      this.getListInventory()
    },
    // 获取盘点任务列表
    getListInventory () {
      getListInventory(this.searchInput).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.totalCount = res.data.total
        }
      })
    },
    // 获取盘点名称下拉框
    getInventoryNames () {
      getInventoryNames().then((res) => {
        if (res.code === 200) {
          this.nameList = res.data
        }
      })
    },

    // 盘点下载
    downloadFile (status) {
      if (!this.templateSelection) {
        this.$message({
          message: '请先选择您要查询的盘点单!',
          type: 'error'
        })
        return
      }
      downloadFile({
        managementId: this.templateSelection,
        status: status,
        type: '0'
      }).then((res) => {
        const content = res
        const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' })
        const fileName = 'detail.xls'
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
    },
    // 结束盘点调用接口
    updateFinishInventory (id) {
      updateFinishInventory(
        {
          id: id
        }
      ).then((res) => {
        if (res.code === 200) {
          this.tableData = this.tableData.filter(e => e.id !== id)

          this.$message({
            message: '操作成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },

    // 生成盘点确认按钮
    produceInventory () {

    },

    // table 结束盘点
    deleteRow (row) {
      if (row.notInventoryTotal > 0) {
        this.$message({
          type: 'error',
          message: '结束盘点任务失败，当前有未完成盘点设备!'
        })
        return
      }

      this.$confirm('点击确定终止此盘点项', '是否终止该盘点？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.updateFinishInventory(row.id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },

    // 跳转盘点明细
    inventoryDetailed (row) {
      this.$router.push({
        path: '/inventoryAdminDetail',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inventory {
  /deep/ .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }

  .query-title__auto {
    background: #eff2f9;
    padding-left: 30px;
    height: 30px;
    margin-bottom: 15px;
    font-weight: 600;
  }

  .deptTotal {
    color: #004ea2;
    cursor: pointer;
  }

  .division {
    width: auto;
    height: 42px;
    line-height: 40px;
    background-color: #eff2f9;
    border-radius: 4px;
    padding: 0 20px 0 0px;
    overflow: hidden;
    margin-bottom: 16px;
    position: relative;
    .division-right {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
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
  .form-decollate {
    margin: 12px 0 12px 0;
  }
  .sb-el-tree {
    height: 445px;
    overflow: auto;
  }
  .el-date-editor.el-input {
    width: auto;
  }
}
</style>
