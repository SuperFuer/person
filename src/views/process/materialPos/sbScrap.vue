<!--

 -->

<template>
  <div class="sb-allocation">
    <div class="form-title">
      <i class="icon"></i>实物资产归还申请（各部门）
    </div>
    <el-form ref="ruleForm"
             :model="formData"
             :inline="true"
             :rules="rules"
             style="width:99%">
      <el-row class="common-row row-list">
        <el-col :span="8">
          <el-form-item label="申请编号"
                        label-width="107px"
                        prop="processId">
            <el-input v-model="formData.applicationNum"
                      disabled></el-input>
            <!-- <span>{{formData.processId}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态"
                        label-width="107px"
                        prop="status">
            <el-input v-model="formData.applicationStatus"
                      disabled></el-input>
            <!-- <span>{{formData.status}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间"
                        label-width="107px"
                        prop="applyDate">
            <el-input v-model="formData.applicationDate"
                      disabled></el-input>
            <!-- <span>{{formData.applyDate}}</span> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-list">
        <el-col :span="8">
          <el-form-item label="主题"
                        label-width="107px"
                        prop="subject">
            <el-input v-model="formData.subject"
                      :disabled="callFlag"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人"
                        label-width="107px"
                        prop="applyUser">
            <el-input v-model="formData.applicantName"
                      disabled></el-input>
            <!-- <span>{{formData.applyUser}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话"
                        label-width="107px"
                        prop="telephone">
            <el-input v-model="formData.applicantPhone"
                      disabled></el-input>
            <!-- <span>{{formData.telephone}}</span> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse class="common-collapse"
                   v-model="currentCollapse">
        <el-collapse-item name="4"
                          class="active">
          <template slot="title">
            <div class="collapse-title">实物资产信息</div>
          </template>
          <div class="pb20">
            <el-button @click="addrouter"
                       type="primary"
                       size="small"
                       :disabled="callFlag || addFlag">新 增</el-button>
            <el-button type="danger"
                       size="small"
                       @click="delList"
                       :disabled="callFlag">删 除</el-button>
          </div>
          <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    style="width: 100%"
                    class="table-box"
                    row-key="key"
                    v-loading="loading"
                    @selection-change="SelectionChange">
            <el-table-column type="selection"
                             width="55"></el-table-column>
            <el-table-column label="序号"
                             type="index"
                             show-overflow-tooltip></el-table-column>
            <el-table-column prop="equipNum"
                             label="设备编码"
                             width="160"></el-table-column>
            <el-table-column prop="equipName"
                             label="设备名称"
                             width="150"></el-table-column>
            <el-table-column prop="usingMan"
                             label="使用人"></el-table-column>
            <el-table-column prop="usingDept"
                             label="所属部门"
                             width="150"></el-table-column>
            <el-table-column prop="module"
                             label="所属模块"
                             width="100"></el-table-column>
            <el-table-column prop="borrowDept"
                             label="借用部门"
                             width="150"></el-table-column>
            <el-table-column prop="borrowMan"
                             label="借用人"
                             width="150"></el-table-column>
            <el-table-column prop="borrowDate"
                             label="借用日期"
                             width="100"></el-table-column>
            <el-table-column prop="returnDate"
                             label="归还日期"
                             width="160">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.returnDate"
                                type="date"
                                :picker-options="returnDate"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期"
                                :clearable="clearable" />
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block pagination">
            <el-pagination @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-size="pageSize"
                           background
                           layout="total, prev, pager, next, jumper"
                           :total="totalCount">
            </el-pagination>
          </div>
          <el-row>
            <el-col :span="24">备注:</el-col>
            <el-col :span="24">
              <el-input v-model="approvalOpinion"
                        width="100%"
                        type="textarea"
                        :disabled="callFlag"></el-input>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-form-item class="btn-group">
        <el-button @click="subOrClose('ruleForm',false,'是否保存？')"
                   size="small"
                   class="save-btn"
                   :disabled="callFlag">保存</el-button>
        <el-button @click="subOrClose('ruleForm',true,'是否提交？')"
                   size="small"
                   class="submit-btn"
                   :disabled="callFlag">提交</el-button>
      </el-form-item>
    </el-form>
    <!-- 模板下载 -->
    <el-dialog title="模板"
               :visible.sync="dialogVisible"
               width="30%"
               @close="getClickedTemplate('cancel')">
      <div class="template-list">
        <el-row>
          <el-radio-group v-model="checkedtemplates"
                          @change="handleCheckedTemplates">
            <el-col :span="24"
                    v-for="(item,index) in templateList"
                    :key="index"
                    style="margin-bottom:15px;">
              <el-radio :label="item.url">{{item.name}}</el-radio>
            </el-col>
          </el-radio-group>
        </el-row>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="getClickedTemplate('cancel')">取 消</el-button>
        <el-button @click="getClickedTemplate('selected')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getTime } from '@/common/until'
import { axiosPost, axiosGet, constApi } from '@/api/index.js'
export default {
  props: {
    paramList: {
      type: Object
    }
  },
  data () {
    return {
      callFlag: false, // 提交之后 所有按钮不可点
      addFlag: false, // 新增 （新增和导入互斥）
      innerVisible: false, // 使用人选择弹出显示
      department: [], // 使用人
      flag: false, // 是否是管理员 true是 false否
      submitFlag: true,
      nowTime: '',
      submitSuccessId: '',
      borrowMan: [{
        name: '保山',
        usrId: 'huangnh'
      }],
      currentCollapse: ['1', '2', '3', '4'],
      headers: {
        token: localStorage.getItem('token')
      },
      constApi: constApi,
      importTemplateUrl: constApi + '/process/changeProcess/import',
      importFileUrl: constApi + '/common/file/upload',
      approveHistory: [],
      formData: {
        applicationNum: '', // 申请编号
        applicationStatus: '',
        applyDate: '',
        subject: '',
        applicant: '',
        telephone: '',
        order: '',
        file: [],
        dept: '',
        uploadFile: [],
        participation: '',
        planTime: '',
        provider: '', // 供应商
        projectNum: '', // 项目编号
        projectName: '' // 项目名称
      },
      fileRefIds: [],
      rules: {
        subject: {
          required: true,
          message: '主题不能为空',
          trigger: 'blur'
        }
      },
      arr: [],
      dialogVisible: false,
      defaultExpandAll: true,
      defaultJoinId: [],
      joinUser: [],
      checkedtemplates: [],
      submitTemplate: [],
      mainTemplatecachedId: '',
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() < Date.now() - 8.64e7;
      //   }
      // },
      purchaseOrder: [],
      templateList: [],
      tableData: [],
      loading: false,
      participantList: [],
      emptyText: '正在加载...',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      userData: [],
      selectedUser: [], // 当前选中的
      prevSelectedUser: [], // 记录上次选中的
      numPrevCode: 0, // 记录是不是第一次点击
      allSelectedUser: [], //
      MarkCurrentFlag: true,
      cancelSelectedUser: [],
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 默认每页显示的条数（可修改）
      pageSize: 100,
      pageCount: 5,
      deptNum: 0,
      positionCode: [],
      value: '',
      equipNum: '',
      disabled: false,
      approvalOpinion: '',
      clearable: false,
      returnDate: {
        disabledDate: time => {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  methods: {
    // 保存后初始数据
    getSaveData () {
      var _this = this
      const loading = this.$loading({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      _this.taskId = _this.$route.query.applicationNum
      axiosGet('process/returnProcessForm/getApproval?applicationNum=' + 'WG20190000005').then(result => {
        if (result.code == 200) {
          console.log(result)
          loading.close()
          _this.formData = result.data.returnProcessForm
          _this.tableData = result.data.returnEquipInfoList
          _this.approvalOpinion = result.data.returnProcessForm.reason
          _this.nowTime = getTime()
        }
      })
    },

    // 申请初始化数据
    getInitData () {
      var _this = this
      const loading = this.$loading({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      _this.nowTime = getTime()
      sessionStorage.clear()
      // 申请初始化 processId: "physicalAssetsAcceptance"
      axiosGet('process/returnProcessForm/init-form?processId=14320').then(result => {
        console.log('申请初始化---------')
        console.log(result)
        if (result.code == 200) {
          loading.close()
          let resultData = result.data
          _this.formData = resultData
          _this.flag = resultData.flag
          if (_this.$route.query.subject) {
            _this.formData.subject = _this.$route.query.subject
          } else {
            _this.formData.subject = resultData.subject
          }
        }
      })
    },
    // 勾选的表格
    SelectionChange (val) {
      console.log(val)
      val.forEach(item => {
        this.arr.push(item.index)
      })
      // this.equipNum = this.arr.join(',')
    },
    // 分页
    handleCurrentChange (val) {
      this.currentPage = val
    },
    // 选择模板
    handleCheckedTemplates (value) {
      var _this = this
      _this.checkedtemplates = value
      console.log(_this.checkedtemplates)
    },
    // 选择单个模板进行下载
    getClickedTemplate (value) {
      var _this = this
      if (value == 'selected') {
        _this.submitTemplate = _this.checkedtemplates
        axiosGet(_this.submitTemplate).then(result => {
          if (result.code == 200) {
            window.location.href = _this.constApi + result.data
          }
        })
      } else {
        _this.checkedtemplates = _this.submitTemplate
      }
      _this.dialogVisible = false
    },
    handleTemplatePreview (file) {
      console.log('点击文件列表中已上传的文件时的钩子')
    },
    submitTemplateUpload () {
      this.$refs.template.submit()
    },
    // 上传模板之前
    beforeTemplateUpload (file) {
      console.log('beforeUpload')
      this.tableData = []
    },
    // 导入模板成功
    templateImportSuccess (response, file, filelist) {
      var _this = this
      console.log('导入模板成功______________________')
      console.log(response)
      if (response.code === 200) {
        _this.formData.file = filelist
        _this.mainTemplatecachedId = response.data.cacheId
        _this.tableData = response.data.data
        this.$refs.ruleForm.clearValidate('file')
        this.addFlag = true
      } else {
        this.$alert(response.data[0], response.message, {
          confirmButtonText: '确定',
          callback: action => {
            // this.$message({
            //   type: "info",
            //   message: `action: ${action}`
            // });
          }
        })
      }
    },
    templateImportError (response, file, filelist) {
      this.$message.error(`导入失败`)
    },
    templateLoding () {
      this.loading = false
    },
    templatebeforeRemove (file, fileList) {
      var _this = this
      this.addFlag = false
      return this.$confirm(`确定移除 ${file.name}？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    handleTemplateRemove (file, fileList) {
      this.tableData = []
    },
    handleTemplateExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次已选择了 1 个文件`)
    },
    handleTemplatechange (file, fileList) {
    },
    dialogClick (val) {
      this.innerVisible = true
      this.equipNum = val
    },
    // 提交保存确认
    subOrClose (ruleForm, flag, text) {
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
    },
    // 提交表单
    submitForm (ruleForm, flag) {
      var _this = this
      let user = JSON.parse(localStorage.getItem('user'))
      _this.tableData.forEach(item => {
        item.borrowDept = _this.formData.dept
      })
      let params = {
        flag: flag,
        applicationNum: _this.formData.applicationNum || '',
        id: _this.submitSuccessId,
        returnProcessForm: {
          applicationDate: _this.formData.applyDate,
          subject: _this.formData.subject,
          applicant: user.id,
          applicantName: _this.formData.applyUser,
          applicantPhone: _this.formData.telephone,
          remark: _this.approvalOpinion
        },
        returnProcessFormAssetList: _this.tableData
      }
      if (_this.tableData.length > 0) {
        axiosPost('process/returnProcessForm/submit', params).then(result => {
          if (result.code === 200) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            if (flag) {
              _this.callFlag = true
            }
            _this.submitSuccessId = result.data.id
            _this.submitFlag = false
            _this.$set(_this.formData, 'applicationNum', result.data.applicationNum)
            _this.$set(_this.formData, 'applicationStatus', result.data.applicationStatus)
          } else if (result.code === 400) {
            console.log(result.message)
            this.$message(result.message)
          }
        })
      } else {
        this.$message.error('请完善信息！')
      }
    },

    // 表格删除
    delList () {
      console.log(this.arr)
      if (this.arr) {
        this.arr.forEach(item => {
          if (this.tableData) {
            this.tableData.forEach((val, index) => {
              if (item === val.index) {
                this.tableData.splice(index, 1)
                this.formData.file = []
                if (this.tableData.length === 0) {
                  this.$router.push({ path: '/swUnseal' })
                  this.addFlag = false
                }
              }
            })
          }
        })
      }
    },
    // 新增按钮跳转
    addrouter () {
      if (this.paramList) {
        this.$router.push({ path: '/addQuery?flag=true' + '&subject=' + this.formData.subject + '&type=' + this.paramList.type + '&applicationType=' + this.paramList.applicationType })
        // this.formData.flag
        localStorage.setItem('eqarr', JSON.stringify(this.tableData))
      } else {
        this.$router.push({ path: '/returnQuery?flag=true' + '&subject=' + this.formData.subject })
        // this.formData.flag
        localStorage.setItem('eqarr', JSON.stringify(this.tableData))
      }
    }
  },
  created () {
    var _this = this

    // 如果有参数 说明是从草稿或历史进来 历史 history 禁用 草稿 draft 申请页
    if (this.paramList && this.paramList.type == 'history') {
      this.isHistory = true
      this.callFlag = true
      this.getSaveData()
    } else if (this.paramList && this.paramList.type == 'draft') {
      this.isHistory = false
      this.getSaveData()
    } else {
      this.getSaveData()
    }

    // 使用人
    let user = JSON.parse(localStorage.getItem('user'))
    axiosGet('base/user/list?size=9999&deptNum=' + user.deptNum).then(result => {
      console.log(result)
      if (result.code === 200) {
        this.borrowMan = result.data.records
      }
    })

    // 新增协带表格数据
    if (_this.$route.query.flag) {
      _this.tableData = JSON.parse(localStorage.getItem('eqarr'))
      _this.tableData.forEach(item => {
        console.log(_this.formData.dept)
        item.borrowDate = _this.nowTime
        item.borrowDept = _this.formData.dept
      })
      for (let i = 0, len = _this.tableData.length; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (_this.tableData[i].equipNum == _this.tableData[j].equipNum) {
            _this.tableData.splice(j, 1)
            len--
            j--
          }
        }
      }
      console.log(_this.tableData)
      _this.totalCount = _this.tableData.length
      _this.tableData.forEach((item, index) => {
        item.index = index
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.sb-allocation {
  .row-list {
    .el-form-item__content {
      width: 180px;
    }
    .el-form--inline .el-form-item__content,
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 100% !important;
    }
  }
  .el-date-editor.el-input {
    width: 140px;
  }
  .el-pagination__editor.el-input .el-input__inner {
    width: 40px !important;
  }
  .btn-group {
    display: block;
    text-align: center;
    margin-top: 20px;
  }
  .el-input__icon {
    height: 30px;
    line-height: 30px !important;
  }
  .primary-btn.el-button {
    background: #3a8eff;
    color: #fff;
    border-color: #fff !important;
  }
  .primary-btn.el-button.is-disabled,
  .download.el-button.is-disabled {
    opacity: 0.6;
  }
  .download.el-button,
  .submit-btn.el-button {
    background: #004ea2;
    color: #fff;
  }
  .upload-btn.el-button {
    background: #df8715;
    color: #fff;
    outline: none;
    border-color: #fff !important;
    margin-left: 20px;
  }
  .save-btn.el-button {
    background: #2fce6a;
    color: #fff;
  }
  .template-upload {
    height: 32px;
    margin-left: 18px;
  }
  // 折叠面板
  .common-collapse {
    .el-collapse-item__header {
      background: #eff2f9;
      padding-left: 8px;
      height: 30px;
      line-height: 30px;
    }
    .collapse-title {
      font-weight: 600;
    }
    .el-collapse-item__content {
      padding: 20px 0 2px;
    }
    .el-collapse-item__wrap {
      border-bottom-color: transparent;
    }
  }
  .pagination {
    text-align: center;
    margin: 10px 0 10px;
  }
  .pop-participation {
    .el-dialog {
      width: 1000px;
      height: 615px;
      .p-heading {
        .el-col-8 {
          padding-left: 5px;
          box-sizing: border-box;
        }
      }
      .participation-info {
        > div {
          height: 445px;
          box-sizing: border-box;
          border-left: 2px solid #eee;
          overflow: auto;
        }
      }
    }
    .sb-join {
      position: absolute;
      left: 50%;
      bottom: 30px;
      transform: translateX(-50%);
    }
  }

  .select-file {
    height: 30px;
    margin-right: 20px;
    .el-form--inline {
      .el-form-item__content {
        width: 400px !important;
      }
    }
    .el-upload {
      margin-left: 20px;

      &:focus {
        border-color: #fff;
      }
    }
    .el-upload-list__item.is-success .el-upload-list__item-name:focus {
      border-color: #fff !important;
      outline-width: 0px !important;
    }
    .upload-demo {
      height: 28px;
      line-height: 28px !important;
      display: flex;
      flex-direction: row;
      .el-upload-list {
        order: -1;
        padding-right: 10px;
        border: 1px solid #dcdfe6;
        height: 28px;
        line-height: 28px;
        position: relative;
        border-radius: 4px;
        width: 298px;
        overflow: hidden !important;
        .el-upload-list__item:first-child {
          margin-top: 0px;
          height: 28px !important;
        }
        .el-upload-list__item:hover {
          background: #fff;
        }
      }
    }
  }
  .download.el-button {
    background: #004ea2;
    color: #fff;
  }
  .upload-btn.el-button {
    background: #df8715;
    color: #fff;
    outline: none;
    border-color: #fff !important;
  }
  .word-title {
    margin-top: 40px;
    margin-bottom: 20px;
    font-weight: 600;
  }
  .impor-file {
    margin-right: 20px;
    .el-input__inner {
      width: 298px !important;
    }
    .el-form--inline .el-form-item__content {
      width: 298px;
    }
  }
  .el-tree__empty-text {
    left: 0;
    top: 0;
    transform: translate(0, 0);
    color: #606266;
  }
  .el-table--fit {
    border: 1px solid #fff;
    width: 100%;
  }
  .common-collapse {
    .collapse-title {
      padding-left: 20px;
    }
    .el-collapse-item__arrow {
      margin: 0 0px 0 -97px;
      display: none;
    }
    .el-collapse-item.is-disabled .el-collapse-item__header {
      color: #333;
    }
    .active {
      .el-collapse-item__arrow {
        display: block;
      }
    }
  }
  .import-file {
    border-bottom: 1px solid #eee;
    padding-left: 7px;
    height: 30px;
    position: relative;
    .empty-des {
      padding-top: 40px;
      color: #666;
      text-align: center;
      > div:first-child {
        font-size: 20px;
      }
    }
    .file-header {
      position: absolute;
      left: 0;
      top: 0;
    }

    .el-upload {
      width: 100%;
    }
    .el-form-item {
      width: 100%;
      position: relative;
    }
    .el-form-item__label {
      width: 98%;
      text-align: left;
    }
    .el-form-item__content {
      position: none;
      width: 100%;
    }

    .el-icon-plus {
      position: absolute;
      right: 0;
      top: 8px;
    }
    .el-upload-dragger {
      width: 100%;
      border-color: transparent;
      // display: none;
    }
  }
  .el-table__body-wrapper {
    max-height: 480px;
    overflow-y: auto;
  }
  .ment-input {
    width: 90%;
    height: 30px;
    position: absolute;
    top: 10px;
  }
}
.diaMan {
  .el-tree {
    height: 300px;
    overflow-y: auto;
  }
}
.error {
  color: red;
}
</style>
