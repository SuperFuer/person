<!--
 * @Description: 个人中心=》审批代理
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-09-07 15:42:33
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-11 16:08:41
 -->
<template>
  <div class="approvalSet">
    <div class="form-title">
      <i class="icon"></i>个人中心
    </div>
    <el-collapse class="common-collapse common-fold common-table mt10"
                 v-model="currentCollapse1">
      <el-collapse-item name="1"
                        class="active">
        <template slot="title">
          <div class="collapse-title">
            <span>查找审批代理人</span>
            <div style="float:right">
              <el-button @click.stop="subOrClose('ruleForm',false,'您确定要终止授权吗？')"
                         type="danger"
                         :disabled="approvalPeople"
                         size="small">终止授权</el-button>
              <el-button type="primary"
                         size="small"
                         @click.stop="subOrClose('ruleForm',true,tipInfo())">设 置</el-button>
            </div>
          </div>

        </template>

        <el-form ref="ruleForm"
                 :model="formData"
                 :inline="true"
                 :rules="rules">
          <el-row class="row-list">
            <el-col :span="8">
              <el-form-item label="代理人"
                            label-width="80px">
                <el-input style="width:202px"
                          @focus="getDeptAll"
                          v-model="formData.userName"></el-input>

                <!-- 使用人选择 -->
                <el-dialog width="70%"
                           title="选择使用人"
                           :visible.sync="innerVisible"
                           class="pop-participation"
                           append-to-body>

                  <orgstructure ref="getZiZuJianList"
                                queryType="my"
                                :isRadio="true"
                                v-on:childByValue="childByValue"></orgstructure>

                </el-dialog>
              </el-form-item>
            </el-col>
            <el-col :span="8"
                    class="select-time">
              <el-form-item label="开始日期"
                            label-width="107px"
                            prop="startTime">
                <el-date-picker v-model="formData.startTime"
                                type="date"
                                :clearable="false"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions"
                                placeholder="开始日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="结束日期"
                            label-width="107px"
                            prop="endTime">
                <el-date-picker v-model="formData.endTime"
                                :clearable="false"
                                type="date"
                                value-format="yyyy-MM-dd"
                                :picker-options="pickerOptions"
                                placeholder="结束日期"></el-date-picker>

              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <!-- 历史 -->
    <el-collapse class="common-collapse common-fold common-table mt10"
                 v-model="currentCollapse1">
      <el-collapse-item name="2"
                        class="active">
        <template slot="title">
          <div class="collapse-title">代理人设置历史</div>
        </template>

        <el-table :data="tableData"
                  border
                  v-loading="loading">
          <el-table-column :show-overflow-tooltip='true'
                           label="序号"
                           width="55"
                           type="index"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           prop="assigneeId"
                           label="账号"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           prop="assigneeUserName"
                           label="代理人"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           prop="deptName"
                           label="所属部门"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           prop="startTime"
                           label="开始日期"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           prop="endTime"
                           label="结束日期"></el-table-column>
          <el-table-column :show-overflow-tooltip='true'
                           prop="status"
                           label="状态">
            <template slot-scope="scope">

              <el-tag type="info"
                      v-if="scope.row.status==='1' ||  scope.row.isExpire===true">终止</el-tag>
              <el-tag v-else>正常</el-tag>
            </template>

          </el-table-column>
        </el-table>
        <div class="block pagination">
          <el-pagination @current-change="handleCurrentChange"
                         :current-page.sync="currentPage"
                         :page-size="pageSize"
                         background
                         layout="total, prev, pager, next, jumper"
                         :total="pageCount">
          </el-pagination>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import { saveTransferApproval, getTransferInfo } from '@/api/swApi.js'
import orgstructure from '@/components/orgstructure'
import dayjs from 'dayjs'
export default {
  data () {
    return {
      formData: {
        userId: '',
        userName: '',
        assigneeId: '',
        startTime: dayjs(Date.now()).format('YYYY-MM-DD'),
        endTime: dayjs(Date.now()).format('YYYY-MM-DD'),
        operation: 'update'
      },
      currentCollapse1: ['1', '2'],
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 默认每页显示的条数（可修改）
      pageSize: 10,
      pageCount: 0,
      loading: false,
      innerVisible: false,
      buMenList: [],
      rules: {
        startTime: [
          {
            message: '开始日期不能为空',
            trigger: 'blur'
          }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < dayjs(Date.now()).subtract(1, 'day').valueOf()
        }
      },
      approvalPeople: false // 是否有审批人
      // approvalUser: {
      //   approvalId: '',
      //   approvalName: ''
      // }
    }
  },
  mounted () {
    this.getTransferInfo()
  },

  components: {
    orgstructure
  },

  methods: {

    handleCurrentChange (val) {
      this.currentPage = val
      this.getTransferInfo()
    },
    getTransferInfo () {
      this.loading = true
      getTransferInfo({
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then((res) => {
        if (res.code === 200 && res.data.resultList) {
          this.tableData = res.data.resultList
          this.pageCount = res.data.total

          if (!res.data.approvalId) {
            this.approvalPeople = true
          } else {
            this.approvalPeople = false
          }

          this.formData.assigneeId = res.data.approvalId
          this.formData.userName = res.data.approvalName

          // this.approvalUser.approvalId = res.data.approvalId
          // this.approvalUser.approvalName = res.data.approvalName
        }
        this.loading = false
      })
    }, // 获取所有部门
    getDeptAll () {
      this.innerVisible = true
    },
    // get子组件数据
    childByValue: function (childValue) {
      if (childValue !== '0') {
        let name = []
        let id = []
        for (var i = 0; i < childValue.length; i++) {
          name.push(childValue[i].name)
          id.push(childValue[i].usrId)
        }

        this.formData.userId = id[0]
        this.formData.assigneeId = id[0]
        this.formData.userName = name[0]
      }
      this.innerVisible = false
    },
    // 提交保存确认
    subOrClose (ruleForm, flag, text) {
      if (!this.formData.assigneeId) {
        this.$message.error('请选择代理人！')
        return
      }

      if (dayjs(this.formData.startTime).isAfter(dayjs(this.formData.endTime))) {
        this.$message.error('结束时间必须大于开始时间！')
        return
      }

      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.$confirm(text, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.saveApproval(flag)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            })
          })
        }
      })
    },
    saveApproval (flag) {
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
        userId: user.usrId,
        assigneeId: this.formData.assigneeId,
        startTime: this.formData.startTime,
        endTime: this.formData.endTime,
        operation: flag === true ? 'update' : 'del'
      }
      saveTransferApproval(params).then((res) => {
        if (res.code === 200) {
          this.$message.success('设置代理人成功！')
          this.getTransferInfo()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    tipInfo () {
      return `是否设置${this.formData.userName}为审批代理?`
    }
  }
}
</script>

<style>
</style>
