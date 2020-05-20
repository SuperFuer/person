<!--
 * @Description: 资产闲置审批页面
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-08-27 14:29:40
 * @LastEditors: louisyi
 * @LastEditTime: 2019-09-20 14:22:32
 -->
<template>
  <div class="sb-change">
    <div class="form-title">
      <i class="icon"></i>
      资产闲置审批
    </div>
    <el-form :model="formData"
             :inline="true"
             :rules="rules"
             label-width="80px">
      <el-row :gutter="10"
              class="common-row">
        <el-col :span="8">
          <el-form-item label="申请编号"
                        prop="applyNum">
            <el-input v-model="formData.applyNum"
                      disabled></el-input>
            <!-- <span>{{formData.applicationNum}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态"
                        prop="status">
            <el-input v-model="formData.status"
                      disabled></el-input>
            <!-- <span>{{formData.applicationStatus}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间"
                        prop="applyTime">
            <el-input v-model="formData.applyTime"
                      disabled></el-input>
            <!-- <span>{{formData.applicationDate}}</span> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="主题"
                        prop="subject">
            <el-input v-model="formData.subject"
                      disabled></el-input>
            <!-- <span>{{formData.subject}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人"
                        prop="applicantName">
            <el-input v-model="formData.applicantName"
                      disabled></el-input>
            <!-- <span>{{formData.applicantName}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话"
                        prop="applicantPhone">
            <!-- <span>{{formData.mobile}}</span> -->
            <!--            <el-input v-model="formData.mobile" disabled></el-input>-->
            <el-input v-model="formData.applicantPhone"
                      disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse class="common-collapse"
                   v-model="currentCollapse">
        <el-collapse-item name="1"
                          class="active">
          <template slot="title">
            <div class="collapse-title">实物资产信息</div>
          </template>
          <el-table :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    style="width: 100%"
                    border
                    :header-cell-style="{
      'font-size':'14px',
      'padding': '8px 0',
      'font-family':'Microsoft YaHei'}"
                    :cell-style="{
       'height': '45px',
       'line-height':'45px',
       'overflow':'hidden',
        'text-overflow':'ellipsis',
        'white-space':'nowrap',
        'padding':'0',
        'font-family':'Microsoft YaHei',
        'font-size':'12px'
      }"
                    class="table-box"
                    row-key="key">
            <el-table-column :show-overflow-tooltip='true'
                             label="序号"
                             width="55"
                             type="index"></el-table-column>
            <!--            <el-table-column :show-overflow-tooltip='true' prop="assetNum" label="资产编码" width="140"></el-table-column>-->
            <el-table-column :show-overflow-tooltip='true'
                             prop="equipNum"
                             label="设备编码"
                             width="140"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="equipName"
                             label="设备名称"
                             width="140"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="installPosition"
                             label="安装地点"
                             width="140"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="useManName"
                             label="使用人"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="useDeptName"
                             label="使用人部门"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="locCode"
                             label="位置编码"
                             width="140"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="locName"
                             label="位置描述"
                             width="140"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="purchasePrice"
                             label="采购价格"
                             width="140"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="idleTime"
                             label="闲置日期"></el-table-column>
            <el-table-column :show-overflow-tooltip='true'
                             prop="idleReason"
                             label="闲置原因"></el-table-column>
          </el-table>
          <div class="pagination"
               v-if="tableData.length > 10">
            <el-pagination background
                           layout="total,prev, pager, next,jumper"
                           :page-size="10"
                           @current-change="handleCurrentChange"
                           :total="tableData.length"></el-pagination>
          </div>

          <el-row>
            <el-col :span="24">
              <div class="query-title">闲置备注</div>
            </el-col>
            <el-col :span="24">
              <el-input class="mb10"
                        v-model="formData.remark"
                        width="100%"
                        type="textarea"
                        show-word-limit
                        maxlength="100"
                        resize="none"
                        disabled></el-input>
            </el-col>
          </el-row>

          <!-- 历史 -->

          <common-history ref="commonHistory"
                          :childId="taskId"></common-history>
          <br />
          <el-row>
            <el-col :span="18"
                    class="addLook">审批意见:</el-col>
            <el-col :span="6"
                    :offset="0">
              <el-button type="text"
                         icon="el-icon-plus"
                         :disabled="disabled"
                         @click="ideaFill('可以')">可以</el-button>
              <el-button type="text"
                         icon="el-icon-plus"
                         :disabled="disabled"
                         @click="ideaFill('不可以')">不可以</el-button>
              <el-button type="text"
                         icon="el-icon-plus"
                         :disabled="disabled"
                         @click="ideaFill('设备已确认')">设备已确认</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-input v-model.trim="approvalOpinion"
                        width="100%"
                        type="textarea"
                        show-word-limit
                        maxlength="100"
                        resize="none"
                        :disabled="disabled"></el-input>

            </el-col>
          </el-row>

          <el-form-item class="btn-group">
            <el-button v-if="formkey!='formkey_5'"
                       size="small"
                       type="warning"
                       @click="subOrboHui(false,'确认驳回？')"
                       :disabled="disabled">驳回</el-button>
            <el-button type="primary"
                       size="small"
                       @click="subOrboHui(true,'确认提交？')"
                       :disabled="disabled">提交</el-button>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>
<script>
import { getApprovalData, getApprovalHistory, updateApprovalData } from '@/api/swApi.js'
import commonHistory from '@/components/commonHistory'
export default {
  data () {
    return {
      currentCollapse: ['1'],
      formkey: 1, // 假设1 是采购执行项目负责人 2是成本中心（站、队、科、室）
      pageTitle: '',
      taskId: '',
      formData: {
        applicationNum: '',
        applicationStatus: '',
        applicationDate: '',
        subject: '',
        applicantName: '',
        mobile: '',
        applicantPhone: ''
      },
      otherFormData: {},
      rules: {
        theme: [
          {
            message: '主题不能为空',
            trigger: 'blur'
          }
        ]
      },
      tableData: [

      ],
      approveHistory: [

      ],
      approvalOpinion: '', // 审批意见
      otherSuggest: '', // 其他意见
      productDetail: '', // 备品备件明细
      disabled: false, // 是否编辑页
      finish: 'no', // 默认可显示
      currentPage: 1,
      pageSize: 10,
      taskIdId: '',
      currentWord: 100,
      childId: '',
      currentCollapse1: ['1'],
      addComment: ''
    }
  },
  components: {
    commonHistory
  },

  methods: {
    // 获取初始化数据
    getApprovalData () {
      getApprovalData({
        applyNum: this.$route.query.applicationNum
      }).then((res) => {
        if (res.code === 200) {
          this.formData = res.data.assetsIdleApplyForm
          this.tableData = res.data.equipList
        }
      })
    },
    // 审批历史
    getApprovalHistory () {
      getApprovalHistory({
        applicationNum: this.$route.query.applicationNum
      }).then((res) => {
        this.approveHistory = res.data
      })
    },

    handleCurrentChange (val) {
      this.currentPage = val
    },
    confirmSubmit (flag) {
      // 确认/驳回 根据value判断
      var _this = this
      let status = flag ? 'Y' : 'N'
      if (status === 'N') {
        if (!_this.approvalOpinion) {
          _this.$message({
            message: '审批意见不能为空！',
            type: 'error'
          })
          return
        }
      }
      let params = {
        taskId: _this.$route.query.id,
        groupTask: 'false',
        circulationConditions: status,
        formKey: _this.$route.query.formKey,
        localVariablesParam: {
          approvalOpinion: _this.approvalOpinion
        },
        id: this.formData.id
      }

      // 审批/提交
      updateApprovalData(params).then((res) => {
        if (res.code === 200 && res.data) {
          _this.disabled = true
          this.$refs.commonHistory.getApprovalHistory()
          _this.$message({
            type: 'success',
            message: '操作成功'
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // 提交or驳回确认提示
    subOrboHui (flag, text) {
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.confirmSubmit(flag)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 审批意见填充
    ideaFill (val) {
      this.approvalOpinion += val
    }

  },

  created () {
    var _this = this
    _this.taskId = _this.$route.query.applicationNum
    _this.disabled = _this.$route.query.disabled !== 'false'

    // 页面初始化
    this.getApprovalData()
  }
}
</script>
<style lang="scss">
.sb-change {
  padding-bottom: 0px !important;
  .el-form--inline .el-form-item__content,
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 202px !important;
  }
  .el-input__inner {
    width: 180px !important;
    height: 30px;
    line-height: 30px;
  }
  .btn-group {
    display: block;
    text-align: center;
    margin-top: 20px;
    box-sizing: border-box;
    .el-form-item__content {
      width: auto !important;
    }
  }
  .table-box {
    .el-input__inner {
      border-color: transparent !important;
      border: 0 none;
      border-bottom: 1px solid #ccc;
      border-radius: 0px;
      height: 100%;
      background: #fff;
    }
  }
  .el-input.is-disabled .el-input__inner {
    color: #555;
  }
  // 折叠面板
  .common-collapse {
    margin-top: 10px;
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
      padding: 20px 0 20px;
    }
    .el-collapse-item__wrap {
      border-bottom-color: transparent;
    }
    .collapse-title {
      padding-left: 20px;
    }
    .el-collapse-item__arrow {
      margin: 0 0px 0 -74px;
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
  .pagination {
    text-align: center;
    margin: 10px 0 30px;
  }
  .editPOp {
    .el-col {
      padding-left: 2px;
      margin-bottom: 10px;
      box-sizing: border-box;
    }
  }
  .el-icon-success {
    color: #63b167;
    font-size: 18px;
  }
  .spares {
    padding: 10px 0;
  }
  .history .el-icon-s-help,
  .history .el-icon-error {
    color: red;
    font-size: 18px;
  }
  .history .el-icon-s-help {
    color: #e6a23c;
  }
}
.is-in-pagination .el-input__inner {
  width: 40px !important;
}
.addLook {
  line-height: 42px;
  font-weight: 700;
}
</style>
