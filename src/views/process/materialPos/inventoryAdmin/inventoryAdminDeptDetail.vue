<!--
 * @Description: 盘点管理=》点击部门查看部门详情弹框
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-25 10:44:00
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-26 14:49:21
 -->
<template>
  <div class="inventoryAdminDeptDetail">
    <el-dialog title="部门详情"
               :visible.sync="deptDetailVisible"
               :before-close="handleClose"
               style="width:100%">
      <el-row class="common-row">
        <el-col :span="24">
          <el-table :data="tableData"
                    border
                    highlight-current-row
                    class="table">

            <el-table-column :show-overflow-tooltip='true'
                             label="序号"
                             width="55"
                             type="index"></el-table-column>
            <el-table-column prop="deptName"
                             label="部门"
                             show-overflow-tooltip>

            </el-table-column>

            <el-table-column prop="inventoryTotal"
                             label="是否完成审批"
                             show-overflow-tooltip>
              <template slot-scope="scope">

                <span v-if="scope.row.inventoryProcessForm ||(scope.row.inventoryProcessForm && scope.row.inventoryProcessForm.applicationStatus==='PROCESS_FINISHED') ">
                  是
                </span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column prop="startTime"
                             label="查看审批结果"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <span class="deptTotal"
                      v-if="scope.row.inventoryProcessForm"
                      @click="toDetail(scope.row.inventoryProcessForm)">
                  去查看
                </span>
                <span v-else> - -</span>
              </template>

            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getViewDeptProcessInfo } from '@/api/swInventory.js'
export default {
  data () {
    return {
      tableData: []
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    managementId: String
  },

  computed: {
    deptDetailVisible: {
      get () {
        if (this.value) {
          this.getViewDeptProcessInfo()
        }
        return this.value
      },
      set () {
        this.$emit('input', false)
      }
    }
  },

  methods: {
    // 查看盘点任务中的部门盘点/审批信息
    getViewDeptProcessInfo () {
      getViewDeptProcessInfo({
        managementId: this.managementId
      }).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
        }
      })
    },
    handleClose () {
      this.deptDetailVisible = false
    },
    toDetail (row) {
      this.$router.push({
        path: '/draftDetails',
        query: { applicationType: 11, applicationNum: row.applicationNum, type: 'history' }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.inventoryAdminDeptDetail {
  /deep/.el-dialog {
    width: 50%;
  }
  .table {
    // min-width: 800px;
    height: 400px;
    overflow: hidden;
  }

  .deptTotal {
    color: #004ea2;
    cursor: pointer;
  }
}
</style>
