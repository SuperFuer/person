<!--
 * @Description: 盘点结果明细页面
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-19 20:16:05
 * @LastEditors: louisyi
 * @LastEditTime: 2019-10-10 17:11:11
 -->
<template>
  <div class="inventoryAdminDetail">
    <div class="form-title"><i class="icon"></i>盘点结果明细</div>

    <el-collapse class="common-fold common-collapse common-table"
                 v-model="currentCollapse">
      <el-collapse-item name="1"
                        class="active">
        <template slot="title">

          <div class="collapse-title">
            <span>盘点结果明细</span>
            <el-button style="float:right"
                       size="small"
                       @click.stop="toList"
                       type="primary">返回</el-button>
          </div>

        </template>

        <!-- table列表 -->
        <el-table :data="tableData"
                  border
                  highlight-current-row
                  style="width: 100%">
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
          <el-table-column prop="result"
                           label="盘点结果"
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.result===-1">
                待处理
              </span>
              <span v-if="scope.row.result===1">
                账实相符
              </span>
              <span v-if="scope.row.result===2">
                盘亏
              </span>
              <span v-if="scope.row.result===3">
                盘盈
              </span>

            </template>

          </el-table-column>

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
          <el-table-column prop="model"
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
          <el-table-column prop="usingMan"
                           label="使用人"
                           show-overflow-tooltip></el-table-column>
          <el-table-column prop="invType"
                           label="盘点方式"
                           show-overflow-tooltip>

            <template slot-scope="scope">
              <span v-if="scope.row.invType===0">
                扫码
              </span>
              <span v-if="scope.row.invType===1">
                非扫码
              </span>

            </template>
          </el-table-column>
          <el-table-column prop="remark"
                           label="备注"
                           show-overflow-tooltip></el-table-column>

        </el-table>

        <!-- 分页 -->
        <div class="block pagination">
          <el-pagination background
                         layout="total, prev, pager, next, jumper"
                         :total="pageCount"
                         :page-size="popPageSize"
                         :current-page.sync="popCurrentPage"
                         @current-change="handlePopPagination"></el-pagination>
        </div>

      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { getInventoryInfo } from '@/api/swInventory.js'
export default {
  data () {
    return {
      id: '',
      currentCollapse: ['1'],
      tableData: [],
      inventoryYear: '',
      usrId: '',
      deptList: [],
      popCurrentPage: 1,
      popPageSize: 10,
      pageCount: 0
    }
  },
  mounted () {
    this.id = this.$route.query.id
    this.usrId = this.$route.query.usrId
    this.inventoryYear = this.$route.query.inventoryYear
    if (this.$route.query.deptList) {
      this.deptList = this.$route.query.deptList.split(',')
    }

    this.getInventoryInfo()
  },

  methods: {
    // 获取盘点明细
    getInventoryInfo () {
      getInventoryInfo({
        managementId: this.id,
        status: '',
        usrId: this.usrId,
        inventoryYear: this.inventoryYear,
        deptList: this.deptList,
        current: this.popCurrentPage,
        size: this.popPageSize
      }).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.pageCount = res.data.total
        }
      })
    },
    handlePopPagination (val) {
      this.popCurrentPage = val
      this.getInventoryInfo()
    },
    toList () {
      this.$router.push({
        path: '/inventoryAdmin'

      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inventoryAdminDetail {
}
</style>
