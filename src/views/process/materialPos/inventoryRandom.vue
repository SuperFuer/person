<!--
 * @Description: 抽盘
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-19 14:07:32
 * @LastEditors: louisyi
 * @LastEditTime: 2019-10-13 18:29:55
 -->

<template>
  <div class="inventoryRandom">
    <div class="form-title"><i class="icon"></i>抽盘</div>

    <el-collapse class="common-fold common-collapse common-table"
                 v-model="currentCollapse">
      <el-collapse-item name="1"
                        class="active">
        <template slot="title">
          <div class="collapse-title">盘点任务</div>
        </template>

        <div class="tableList">

          <!-- table列表 -->
          <el-table :data="tableData"
                    border
                    highlight-current-row
                    max-height="250"
                    style="width: 100%">
            <!-- <el-table-column label="单选"
                             width="65">
              <template slot-scope="scope">
                <el-radio class="radio"
                          v-model="templateSelection"
                          :label="scope.$index">&nbsp;</el-radio>
              </template>
            </el-table-column> -->
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

            <el-table-column prop="inventoryTotal"
                             label="盘点总量"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="startTime"
                             label="开始时间"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="finishTime"
                             label="结束时间"
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

                <div v-if="scope.row.canExtract">
                  <el-button type="primary"
                             v-if="scope.row.isExtract===0"
                             @click="taskDialogShow(scope.row)"
                             size="mini">
                    生成抽盘任务
                  </el-button>
                </div>

                <el-button v-else
                           size="mini">
                  已超期
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="block pagination">
            <el-pagination @current-change="handleCurrentChange"
                           :current-page.sync="inventoryPage.pageNum"
                           :page-size="inventoryPage.pageSize"
                           background
                           layout="total, prev, pager, next, jumper"
                           :total="inventoryPage.pageCount">
            </el-pagination>
          </div>

        </div>
      </el-collapse-item>
    </el-collapse>

    <el-collapse class="common-fold common-collapse common-table"
                 v-model="currentCollapse">
      <el-collapse-item name="2"
                        class="active">
        <template slot="title">
          <div class="collapse-title division-left">
            <span>抽盘任务</span>
            <div class="division-right">
              <el-button size="small"
                         type="primary"
                         @click.stop="createReport">生成报告</el-button>
            </div>
          </div>
        </template>

        <div class="tableList">

          <!-- table列表 -->
          <el-table :data="taskData"
                    border
                    highlight-current-row
                    max-height="250"
                    style="width: 100%">
            <!-- <el-table-column label="单选"
                             width="65">
              <template slot-scope="scope">
                <el-radio class="radio"
                          v-model="templateSelection"
                          :label="scope.$index">&nbsp;</el-radio>
              </template>
            </el-table-column> -->
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

            <el-table-column prop="inventoryTotal"
                             label="设备数量"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="extractTotal"
                             label="抽盘数量"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="extractStatus"
                             label="抽盘状态"
                             show-overflow-tooltip>

              <template slot-scope="scope">
                <span v-if="scope.row.extractStatus===0">
                  进行中
                </span>
                <span v-if="scope.row.extractStatus===1">
                  结束
                </span>

              </template>
            </el-table-column>
            <el-table-column prop="createTime"
                             label="开始时间"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.createTime | formatDate}}
              </template>
            </el-table-column>

            <el-table-column fixed="right"
                             width="196"
                             label="操作">
              <template slot-scope="scope">
                <el-button v-if="scope.row.extractStatus===0"
                           @click="deleteRow(scope.row)"
                           size="mini"
                           type="danger">
                  结束抽盘
                </el-button>
                <el-button type="success"
                           v-if="scope.row.extractStatus===1"
                           @click="fileDown(scope.row)"
                           size="mini">
                  下载报告
                </el-button>
                <el-button type="primary"
                           @click.native.prevent="inventoryDetailed(scope.row)"
                           size="mini">
                  查看明细
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="block pagination">
            <el-pagination @current-change="taskCurrentChange"
                           :current-page.sync="taskPage.pageNum"
                           :page-size="taskPage.pageSize"
                           background
                           layout="total, prev, pager, next, jumper"
                           :total="taskPage.pageCount">
            </el-pagination>
          </div>

        </div>
      </el-collapse-item>
    </el-collapse>
    <el-dialog title="生成抽盘任务"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="30%"
               :before-close="dialogOpen">
      <div>
        <el-form ref="ruleForm"
                 :model="formData"
                 :inline="false">
          <el-form-item label="抽盘设备数量"
                        label-width="80px"
                        prop="sortNum"
                        :rules="[
      { required: true, message: '抽盘设备数量不能为空'},
      { type: 'number', message: '抽盘设备数量必须为数字值'}
    ]">

            <el-input class="sortNum"
                      v-model.number="formData.sortNum"></el-input>
            <p v-html="queryTotal"
               class="sortNum__tip"> </p>
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogVisible=false"
                   size="small">取 消</el-button>
        <el-button type="primary"
                   @click="saveInfo('ruleForm')"
                   size="small">确 定</el-button>
      </div>
    </el-dialog>
    <randomTaskDialog v-model="taskDialog"
                      @update="getExtractTaskListByPage"
                      :extractId="selectExtractId"></randomTaskDialog>
  </div>
</template>

<script>
import { axiosGet, constApi } from '@/api/index.js'
import { getTemplateList, getInventoryListByPage, getExtractTaskListByPage, addGenerateExtractTask, downLoadCheckReport } from '@/api/swInventory.js'
import dayjs from 'dayjs'
import randomTaskDialog from './inventoryRandom/randomTaskDialog'
export default {
  data () {
    return {
      searchInput: {
        name: '',
        inventoryYear: dayjs(Date.now()).format('YYYY')
      },

      inventoryPage: {
        pageNum: 1,
        pageSize: 10,
        pageCount: 0
      },
      taskPage: {
        pageNum: 1,
        pageSize: 10,
        pageCount: 0
      },
      taskData: [], // 抽盘列表

      templateSelection: '', // table 列表当选
      dialogVisible: false, // 弹框
      taskDialog: false, // 结束抽盘弹框
      tableData: [], // 盘点列表
      currentCollapse: ['1', '2'],
      formData: {
        id: '',
        sortNum: 0,
        total: 0
      },
      selectExtractId: '',
      templateList: []
    }
  },
  mounted () {
    this.getInventoryListByPage()
    this.getExtractTaskListByPage()
  },
  components: {
    randomTaskDialog
  },
  filters: {
    formatDate (value) {
      if (!value) return ''
      return dayjs(value).format('YYYY-MM-DD')
    }
  },
  computed: {
    queryTotal () {
      let total = `设备总量: ${this.formData.total}`
      if (this.formData.sortNum > this.formData.total) {
        total = `<span class='red'>超出规定数量</span>`
      }
      return total
    }
  },
  methods: {
    taskDialogShow (row) {
      this.formData.id = row.id
      this.formData.sortNum = 0
      this.formData.total = row.inventoryTotal
      this.dialogVisible = true
    },
    // 生成抽盘任务
    saveInfo (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.formData.sortNum <= 0) {
            this.$message({
              type: 'error',
              message: '抽盘数量不能为0!'
            })
            return
          }
          if (this.formData.sortNum > this.formData.total) {
            this.$message({
              type: 'error',
              message: '超出规定数量!'
            })
            return
          }

          addGenerateExtractTask({
            inventoryId: this.formData.id,
            extractTotal: this.formData.sortNum
          }).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '生成抽盘任务成功!'
              })
              this.dialogVisible = false
              this.getExtractTaskListByPage()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }
      })
    },

    // 文件下载
    fileDown (row) {
      if (!row.downloadUrl) {
        this.$message.error(`文件下载地址为空，不可以下载！`)
        return
      }
      let loading = this.$loading({
        lock: true,
        text: '下载中，请稍后...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      axiosGet(row.downloadUrl).then(result => {
        if (result.code === 200) {
          window.location.href = constApi + result.data
          loading.close()
        }
      })
    },
    dialogOpen () {
      this.formData.id = ''
      this.formData.sortNum = 0
      this.dialogVisible = !this.dialogVisible
    },
    handleChange () {

    },
    // 盘点任务分页
    handleCurrentChange (val) {
      this.inventoryPage.pageNum = val
      this.getInventoryListByPage()
    },

    // 抽盘列表分页
    taskCurrentChange (val) {
      this.taskPage.pageNum = val
      this.getExtractTaskListByPage()
    },
    // 获取盘点任务列表
    getInventoryListByPage () {
      getInventoryListByPage(this.inventoryPage).then((res) => {
        if (res.code === 200) {
          this.tableData = res.data.records
          this.inventoryPage.pageCount = res.data.total
        }
      })
    },

    // 获取抽盘任务列表
    getExtractTaskListByPage () {
      getExtractTaskListByPage(this.inventoryPage).then((res) => {
        if (res.code === 200) {
          this.taskData = res.data.records

          this.taskPage.pageCount = res.data.total
        }
      })
    },
    // 生成盘点确认按钮
    produceInventory () {

    },

    // table 结束盘点
    deleteRow (row) {
      this.selectExtractId = row.extractId
      this.taskDialog = !this.taskDialog
    },
    inventoryDetailed (row) {
      this.$router.push({
        path: '/inventoryRandomDetail',
        query: {
          id: row.extractId
        }
      })
    },
    // 获取模板列表
    getTemplateList () {
      getTemplateList().then((res) => {
        if (res.code === 200) {
          this.templateList = res.data
        }
      })
    },
    // 生成报告
    createReport () {
      getTemplateList().then((res) => {
        if (res.code === 200) {
          this.templateList = res.data

          if (this.templateList.length > 0) {
            let loading = this.$loading({
              lock: true,
              text: '下载中，请稍后...',
              background: 'rgba(0, 0, 0, 0.7)'
            })

            axiosGet(this.templateList[0].url).then(result => {
              if (result.code === 200) {
                window.location.href = constApi + result.data
                loading.close()
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.inventoryRandom {
  .sortNum {
    width: 180px;
    margin: 0 30px;

    &__tip {
      text-align: right;
    }
  }

  .division-right {
    float: right;
  }

  .red {
    color: red;
    font-size: 18px;
    font-weight: bold;
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
