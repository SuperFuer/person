<!--
 * @Description: 资产闲置申请页面
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-08-26 16:06:52
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-23 19:01:43
 -->
<template>
  <div class="swInventory">
    <div class="form-title">
      <i class="icon"></i>资产闲置申请
    </div>
    <el-form ref="ruleForm"
             :model="formData"
             :inline="true"
             label-width="80px"
             :rules="rules">
      <el-row class="common-row row-list"
              :gutter="10">
        <el-col :span="8">
          <el-form-item label="申请编号"
                        label-width="107px"
                        prop="submitSuccessId">
            <el-input v-model="submitSuccessId"
                      disabled></el-input>
            <!-- <span>{{formData.processId}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态"
                        label-width="107px"
                        prop="status">
            <el-input v-model="formData.status"
                      disabled></el-input>
            <!-- <span>{{formData.status}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间"
                        label-width="107px"
                        prop="applyTime">
            <el-input v-model="formData.applyTime"
                      disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="common-row"
              :gutter="10">
        <el-col :span="8">
          <el-form-item label="主题"
                        label-width="107px"
                        prop="subject">
            <el-input v-model.trim="formData.subject"
                      class="subject"
                      :disabled="callFlag || isTodo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人"
                        label-width="107px"
                        prop="applicantName">
            <el-input v-model="formData.applicantName"
                      disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话"
                        label-width="107px"
                        prop="applicantPhone">
            <el-input v-model="formData.applicantPhone"
                      disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse class="common-fold common-collapse common-table mt10"
                   v-model="currentCollapse">
        <el-collapse-item name="1"
                          class="active">
          <template slot="title">
            <div class="collapse-title">实物资产信息</div>
          </template>

          <div class="pb20">
            <el-button @click="addPopDialogOpen"
                       type="primary"
                       size="small"
                       :disabled="callFlag || addFlag">新 增</el-button>
            <el-button type="danger"
                       size="small"
                       @click="delData"
                       :disabled="callFlag">删 除</el-button>
          </div>
          <el-table :data="tableDataList"
                    border
                    :row-key="popRowKey"
                    v-loading="loading"
                    @selection-change="selectionChange">
            <el-table-column :show-overflow-tooltip='true'
                             type="selection"
                             width="45"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             label="序号"
                             width="55"
                             type="index"></el-table-column>
            <!-- <el-table-column prop="assetNum"
                             label="资产编码"
                             width="100"></el-table-column> -->
            <el-table-column :show-overflow-tooltip='true'
                             prop="equipNum"
                             label="设备编码"
                             width="160"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="equipName"
                             label="设备名称"
                             width="140"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="installPosition"
                             label="安装地点"
                             width="160"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="useManName"
                             label="使用人"
                             width="120"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="useDeptName"
                             label="使用人部门"
                             width="130"></el-table-column>

            <el-table-column prop="locCode"
                             label="位置编码"
                             width="150">
              <template slot-scope="scope">
                <el-select v-model="scope.row.locCode"
                           filterable
                           :disabled="callFlag"
                           @change="changeSelect($event,scope.row)"
                           placeholder="请选择">
                  <el-option v-for="item in positionCode"
                             :key="item.label"
                             :label="item.locationCode"
                             :value="item.locationCode">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="locName"
                             label="位置描述"
                             width="220">
              <template slot-scope="scope">
                <el-input v-model="scope.row.locName"
                          :disabled="true"
                          placeholder="请输入内容"></el-input>
              </template></el-table-column>
            <el-table-column prop="purchasePrice"
                             label="采购价格"
                             width="120">

            </el-table-column>
            <el-table-column label="闲置日期"
                             width="220">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.idleTime"
                                type="date"
                                :disabled="callFlag"
                                :clearable="false"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                </el-date-picker>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             label="闲置原因"
                             prop="idleReason"
                             width="150">
              <template slot-scope="scope">
                <el-input v-model.trim="scope.row.idleReason"
                          :disabled="callFlag"
                          maxlength="30"
                          placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>

          </el-table>

          <!-- 分页 -->
          <div class="block pagination">
            <el-pagination @current-change="handleCurrentChange"
                           :current-page.sync="currentPage"
                           :page-size="pageSize"
                           background
                           layout="total, prev, pager, next, jumper"
                           :total="tableData.length">
            </el-pagination>

            <span class="select-info">已选择：{{popNumbers}}</span>
          </div>

        </el-collapse-item>
      </el-collapse>

      <!-- 备注 -->
      <el-collapse class="common-collapse common-fold mt10"
                   v-model="currentCollapse">
        <el-collapse-item name="3"
                          disabled
                          class="active">
          <template slot="title">
            <div class="collapse-title">添加备注</div>
          </template>
          <div style="position: relative">
            <el-input class="mb10"
                      v-model.trim="filterAddComment"
                      width="100%"
                      type="textarea"
                      maxlength="100"
                      resize="none"
                      show-word-limit
                      :disabled="callFlag"></el-input>
            <!-- <span style="position: absolute;right: 15px;bottom: 10px">{{currentWord}}/{{100}}</span> -->
          </div>
        </el-collapse-item>
      </el-collapse>

      <!-- 历史 -->
      <common-history v-if="isHistory || isTodo"
                      ref="commonHistory"
                      :childId="childId"></common-history>

      <el-form-item v-if="!isHistory"
                    class="btn-group">
        <el-button @click="subOrClose('ruleForm',false,'是否保存？')"
                   size="small"
                   class="save-btn"
                   :disabled="callFlag">保存
        </el-button>
        <el-button @click="subOrClose('ruleForm',true,'是否提交？')"
                   size="small"
                   class="submit-btn"
                   :disabled="callFlag">提交
        </el-button>
      </el-form-item>

      <el-form-item v-if="isTodo"
                    class="btn-group">
        <el-button @click="subOrCancel('ruleForm',false)"
                   size="small"
                   type="danger"
                   :disabled="callFlag">撤回</el-button>
        <el-button @click="subOrCancel('ruleForm',true)"
                   size="small"
                   class="submit-btn"
                   :disabled="callFlag">提交</el-button>
      </el-form-item>

    </el-form>
    <swInventoryDialog v-model="addPopDialog"
                       ref="swDialog"
                       @getSelectList="getSelectList"></swInventoryDialog>
  </div>
</template>

<script>
import swInventoryDialog from './dialog/swInventoryDialog'
import { updateResubmit, updateCloseProcess, getApprovalData, getInitData, getPositionCode, saveAssetsIdleForm } from '@/api/swApi.js'
import commonHistory from '@/components/commonHistory'
// import dayjs from 'dayjs'
export default {
  props: {
    paramList: {
      type: Object
    }
  },
  data () {
    return {
      formData: {},
      remark: '', // 封存备注
      rules: {
        subject: [{
          required: true,
          message: '主题不能为空',
          trigger: 'blur'
        }, {
          min: 6,
          max: 50,
          message: '申请主题长度为 6 - 50 个字符',
          trigger: ['blur', 'change']
        }],

        idleReason: {
          required: true,
          message: '闲置原因不能为空',
          trigger: 'blur'
        }
      },
      popRowKey (row) {
        return row.equipNum
      },
      callFlag: false,
      currentCollapse: ['1', '2', '3', '4'],
      loading: false,
      tableData: [],
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 默认每页显示的条数（可修改）
      pageSize: 10,
      currentWord: 100,
      pageCount: 5,
      pages: {}, // 结构树分页数据
      addFlag: false, // 新增 （新增和导入互斥）
      positionCode: [], // 位置编码
      submitSuccessId: '', // 保存成功后id
      childId: '',
      isHistory: false,
      submitFlag: false,
      popNumbers: 0,
      isTodo: false, // 撤回
      selectedEquip: [], // 表格删除选中
      addPopDialog: false // 新增弹框展示
    }
  },
  components: {
    swInventoryDialog,
    commonHistory
  },
  computed: {
    // 数据分页
    tableDataList () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    filterAddComment: {
      get () {
        return this.remark || this.formData.remark
      },
      set (val) {
        this.remark = val.slice(0, 100)
        this.currentWord = 100 - this.remark.length
      }
    }
  },
  created () {
    let formkey = this.$route.query.formKey
    // 如果有参数 说明是从草稿或历史进来 历史 history 禁用 草稿 draft 申请页
    if (this.paramList && this.paramList.type === 'history') {
      this.childId = this.$route.query.applicationNum
      this.isHistory = true
      this.callFlag = true
      this.getApprovalData()
    } else if (this.paramList && this.paramList.type === 'draft') {
      this.isHistory = false
      this.childId = this.$route.query.applicationNum
      this.getApprovalData()
    } else if (formkey && formkey === 'formkey_1') {
      this.childId = this.$route.query.applicationNum
      this.isHistory = true
      this.isTodo = true
      this.getApprovalData()
    } else {
      this.getInitData()
    }
  },
  mounted () {
    this.getPositionCode()
  },
  methods: {

    addPopDialogOpen () {
      this.addPopDialog = !this.addPopDialog
    },
    // 历史、草稿获取初始化数据
    getApprovalData () {
      getApprovalData({
        applyNum: this.childId
      }).then((res) => {
        if (res.code === 200) {
          this.formData = res.data.assetsIdleApplyForm

          this.submitSuccessId = res.data.assetsIdleApplyForm.applyNum
          this.tableData = res.data.equipList
        }
      })
    },
    // 第一次申请获取初始化数据
    getInitData () {
      getInitData({
        processJavaMapping: 'physicalAssetsUnused'
      }).then((res) => {
        if (res.code === 200) {
          this.formData = res.data
        }
      })
    },
    // 获取位置编码列表
    getPositionCode () {
      getPositionCode().then((res) => {
        if (res.code === 200) {
          this.positionCode = res.data
        }
      })
    },
    // 位置编码
    changeSelect (event, index) {
      let obj = {}
      obj = this.positionCode.find(e => e.locationCode === event)
      this.tableData.forEach(item => {
        if (item.locCode === index.locCode) {
          item.locName = obj.locationDesc
        }
      })
      for (var i = 0; i < this.tableData.length; i++) {
        if (!this.tableData[i].locCode) {
          this.tableData[i].locCode = event
        }
      }
    },
    // 提交保存确认
    subOrClose (ruleForm, flag, text) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (this.tableValid()) {
            this.$confirm(text, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.submitForm(ruleForm, flag)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消'
              })
            })
          }
        }
      })
    },
    // 保存、提交功能
    async submitForm (ruleForm, flag) {
      var _this = this

      if (_this.tableData.length <= 0) return
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
        flag: flag,
        applicationNum: _this.formData.applyNum,
        id: _this.formData.id,
        assetsIdleApplyForm: {
          applyTime: _this.formData.applyTime,
          subject: _this.formData.subject,
          applicant: user.id,
          applicantName: _this.formData.applicantName,
          applicantPhone: _this.formData.applicantPhone,
          remark: _this.filterAddComment
        },
        assetsIdleFormAssets: Object.assign(_this.tableData, {
          id: _this.submitSuccessId
        })
      }

      // 提交保存
      saveAssetsIdleForm(params).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功！',
            type: 'success'
          })

          _this.submitSuccessId = res.data.applicationNum
          _this.submitFlag = false
          _this.formData.applicationNum = res.data.applicationNum
          _this.formData.status = res.data.applicationStatus
          if (flag) {
            _this.callFlag = true
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 删除数据
    delData () {
      if (this.selectedEquip.length > 0) {
        this.selectedEquip.forEach(item => {
          this.tableData.forEach((val, index) => {
            if (item === val.equipNum) {
              this.tableData.splice(index, 1)
            }
          })
        })

        this.$refs.swDialog.delData()

        // this.$confirm('确定删除选中项？', '提示', {
        //   confirmButtonText: '确定？',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {

        // })
      } else {
        this.$message.warning('请勾选要删除的设备！')
      }
    },
    selectionChange (rows) {
      this.selectedEquip = []
      rows.forEach(item => {
        this.selectedEquip.push(item.equipNum)
      })
      this.popNumbers = rows.length
    },

    getSelectList (list) {
      let dedupe = (arr) => {
        return Array.from(new Set(arr))
      }
      this.tableData = dedupe([...list, ...this.tableData])
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // 闲置信息必填
    tableValid () {
      if (!this.tableData.length) {
        this.$message.warning('请选择闲置设备信息！')
        return
      }
      for (let i = 0; i < this.tableData.length; i++) {
        let item = this.tableData[i]
        if (!item.idleReason) {
          this.$alert(`第${i + 1}行闲置原因不能为空`, '提示')
          return
        }
        if (!item.locName) {
          this.$alert(`第${i + 1}行位置描述不能为空`, '提示')
          return
        }
      }
      return true
    },
    subOrCancel (ruleForm, flag) { // 提交或者撤回
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          let tableValid = this.tableValid()
          if (tableValid) {
            let tips = flag ? '提交' : '撤回'
            this.$confirm(`确定要${tips}吗？`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (flag) {
                // 重新提交
                this.reSubmit(flag)
              } else {
                // 撤回
                this.cancelSubmit(ruleForm, flag)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    // 新的重新提交
    reSubmit (flag) {
      var _this = this
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
        taskId: this.$route.query.id,
        assetsIdleApplyForm: {
          applicationDate: _this.formData.applicationDate,
          subject: _this.formData.subject,
          applicant: user.id,
          id: _this.formData.id,
          applicantName: _this.formData.applicantName,
          applicantPhone: _this.formData.email,
          applyNum: _this.submitSuccessId
        },
        assetsIdleFormAssets: _this.tableData
      }
      updateResubmit(params).then((result) => {
        if (result.code === 200) {
          this.$message.success('操作成功！')
          if (flag) _this.callFlag = true
          this.$refs.commonHistory.getApprovalHistory()
          _this.submitSuccessId = result.data.id
          _this.$set(_this.formData, 'applicationNum', result.data.applicationNum)
          _this.$set(_this.formData, 'applicationStatus', result.data.applicationStatus)
        } else {
          this.$message.warning(result.message)
        }
      })
    },
    // 撤回
    cancelSubmit () {
      var _this = this
      let params = {
        processInstanceId: this.$route.query.instanceId,
        id: _this.submitSuccessId,
        deleteReason: _this.filterAddComment,
        applicationNum: _this.formData.applicationNum
      }

      updateCloseProcess(params).then((result) => {
        if (result.code === 200) {
          _this.$message.success('操作成功！')
          _this.$router.push({ path: 'needdealt' })
          _this.callFlag = true
        } else {
          _this.$message.warning(result.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.swInventory {
  .subject {
    width: 180px;
  }

  .common-table {
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100%;
    }
  }

  .btn-group {
    display: block;
    text-align: center;
    margin-top: 20px;

    .el-button.is-disabled {
      opacity: 0.6;
    }

    .save-btn.el-button {
      background: #2fce6a;
      color: #fff;
    }

    .submit-btn.el-button {
      background: #004ea2;
      color: #fff;
    }
  }
}
</style>
