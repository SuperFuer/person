<style lang="scss" scoped>
.db-approval {
  .sb-el-tree {
    min-width: 300px;
    height: 445px;
    overflow: auto;
  }
  .collapse-title {
    color: #333;
    flex: 1 0 90%;
    order: 1;
  }
  .el-collapse-item__arrow {
    flex: 1 0 auto;
    order: -1;
  }
  .el-input__inner {
    width: 180px !important;
  }
  .el-date-editor.el-input {
    width: 180px;
  }
  .common-collapse {
    .el-collapse-item__header.is-active {
      background: #eff2f9;
      padding-left: 8px;
      height: 30px;
      line-height: 30px;
    }
  }
  .el-pagination__editor.el-input .el-input__inner {
    width: 40px !important;
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
  .save-btn.el-button {
    background: #2fce6a;
    color: #fff;
  }
  .submit-btn.el-button {
    background: #004ea2;
    color: #fff;
  }
  .pagination {
    text-align: center;
  }
  .el-icon-success {
    color: #63b167;
    font-size: 18px;
  }
  .history .el-icon-s-help,
  .history .el-icon-error {
    color: red;
    font-size: 18px;
  }
  .history .el-icon-s-help {
    color: #e6a23c;
  }
  .addLook {
    line-height: 42px;
    font-weight: 700;
  }
  .addWidthinged {
    width: 203px!important;
  }
}
</style>
<template>
  <div class="db-approval">
    <div class="form-title">
      <i class="icon"></i>实物资产部门间调拨审批
    </div>
    <el-form ref="ruleForm" :model="formData" :inline="true" style="width:99%">
      <el-row class="common-row">
        <el-col :span="8">
          <el-form-item label="申请编号" label-width="107px" prop="applicationNum">
            <el-input v-model="formData.applicationNum" disabled class="addWidthinged"></el-input>
            <!-- <span>{{formData.processId}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" label-width="107px" prop="applicationStatus">
            <el-input v-model="formData.applicationStatus" disabled class="addWidthinged"></el-input>
            <!-- <span>{{formData.status}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间" label-width="107px" prop="applicationDate">
            <el-input v-model="formData.applicationDate" disabled class="addWidthinged"></el-input>
            <!-- <span>{{formData.applyDate}}</span> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="主题" label-width="107px" prop="subject">
            <el-input v-model="formData.subject" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人" label-width="107px" prop="applicant">
            <el-input v-model="formData.applicantName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话" label-width="107px" prop="email">
            <el-input v-model="formData.email" disabled></el-input>
            <!-- <span>{{formData.telephone}}</span> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="调入部门" label-width="107px" prop="deptName">
        <el-input v-model="formData.deptName" disabled></el-input>
        </el-form-item>
      <el-collapse class="common-collapse" v-model="currentCollapse">
        <el-collapse-item name="1">
          <template slot="title">
            <div class="collapse-title">实物资产信息</div>
          </template>
          <el-table
            :data="tableData.slice((currentPage-1)*pageSize, currentPage*pageSize)"
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
            row-key="key"
            v-loading="loading"
          >
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column :show-overflow-tooltip='true' label="序号" type="index" width="55"></el-table-column>
            <!-- <el-table-column prop="assetNum" label="资产编码" width="130"></el-table-column> -->
            <el-table-column :show-overflow-tooltip='true' prop="equipNum" label="设备编码" width="200"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="equipName" label="设备名称" width="160"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="installLocDesc" label="原安装地点" width="200"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="usingManName" label="原使用人"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="usingDeptName" label="调出部门" width="150"></el-table-column>
            <!--调入-->
            <template v-if="formKey == 'formkey_3' || formKey == 'formkey_4' || formKey == 'formkey_5' || formKey == 'formkey_6' || formKey == 'formkey_7'">
              <el-table-column prop="inDeptName" label="调入部门" width="150"></el-table-column>
              <el-table-column prop="inModuleName" label="调入模块" width="150"></el-table-column>
              <el-table-column label="位置编码" width="150">
                <template slot-scope="scope">
                  <el-select :disabled="formFlag" v-model="scope.row.locCode" @change="changeSelectCode($event,scope.$index)" placeholder="请选择">
                    <el-option
                      v-for="item in locNumList"
                      :key="item.locationCode"
                      :label="item.locationCode"
                      :value="item.locationCode">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="locName" label="位置名称" width="150">
              </el-table-column>
              <el-table-column prop="newInstallLoc" label="现安装地点" width="200">
                <template slot-scope="scope">
                  <el-input v-model.trim="scope.row.newInstallLoc" type="text" :disabled="formFlag"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="newUser" label="现使用人" width="150">
                 <template slot-scope="scope">
                  <el-select :disabled="formFlag" v-model="scope.row.newUser" @change="changeSelect($event,scope.$index)" placeholder="请选择">
                    <el-option
                      v-for="item in newUserList"
                      :key="item.usrId"
                      :label="item.name"
                      :value="item.usrId">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
            </template>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              layout="total,prev, pager, next,jumper"
              :page-size="pageSize"
              @current-change="handleCurrentChange"
              :total="tableData.length"
            ></el-pagination>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2" class="noCollapse">
          <template slot="title">
            <div class="collapse-title">审批历史</div>
          </template>
          <el-table
            :data="tableDataHistory"
            style="width: 100%"
            class="history"
            row-key="key"
            v-loading="loading1"
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
          >
            <el-table-column width="50">
              <template slot-scope="scope">
                <i
                  class="el-icon-success"
                  v-if="scope.row.mapVOS[0].circulationConditions=='Y' && scope.row.endTime"
                ></i>
                <i v-else-if="!scope.row.mapVOS[0].circulationConditions && !scope.row.endTime "></i>
                <i v-else-if="scope.row.mapVOS[0].circulationConditions=='N'" class="el-icon-error"></i>
                <i v-else class="el-icon-s-help"></i>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="name" label="节点" width="180"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="assigneeName" label="操作人" width="120"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="formKey" label="操作" width="150"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="endTime" label="操作时间" width="160"></el-table-column>
            <el-table-column label="审批意见" show-overflow-tooltip>
<!--              <template slot-scope="scope">-->
<!--                <span>{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion}}</span>-->
<!--              </template>-->
              <template slot-scope="scope" >
                <div v-if="!scope.row.mapVOS[0].approvalOpinion && scope.row.formKey!='待审批'">
                  — —
                </div>
                <a
                    v-else
                    :title="scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion"
                >{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion | ellipsis}}</a>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>

      <el-row v-if="finish">
        <el-col :span="18" class="addLook">审批意见:</el-col>
        <el-col :span="6" :offset="0">
          <el-button type="text" icon="el-icon-plus" v-if="finish" :disabled="callFlag" @click="ideaFill('同意')">同意</el-button>
          <el-button type="text" icon="el-icon-plus" v-if="finish" :disabled="callFlag" @click="ideaFill('不同意')">不同意</el-button>
          <el-button type="text" icon="el-icon-plus" v-if="finish" :disabled="callFlag" @click="ideaFill('设备已确认')">设备已确认</el-button>
        </el-col>
      </el-row>
      <el-row v-if="finish">
        <el-col :span="24">
          <el-input v-model.trim="approvalOpinion" width="100%" type="textarea" :disabled="callFlag"></el-input>
          <span style="position: absolute;right: 15px;bottom: 5px">{{currentWord}}/{{100}}</span>
        </el-col>
      </el-row>

      <el-form-item class="btn-group">
        <el-button v-if="finish"
          @click="subOrboHui(false,'是否驳回？')"
          size="small"
          type="warning"
          :disabled="callFlag"
        >驳回</el-button>
        <el-button v-if="finish"
          @click="subOrboHui(true,'是否提交？')"
          size="small"
          type="primary"
          :disabled="callFlag"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { axiosPost, axiosGet, constApi } from "@/api/index.js";
export default {
  data() {
    return {
      formData: {
        applicationNum: "", //申请编号
        applicationStatus: "",
        applicationDate: "",
        subject: "",
        applicant: "",
        applicantName: "",
        email: "",
        deptNum: "",
        deptName: "",
        id: ''
      },
      inDeptName: '',
      formKey: '',
      formFlag: false, // formKey 为4不可编辑
      participantList: [],
      defaultExpandAll: true, // 默认展开所有节点
      defaultProps: {
        children: "children",
        label: "name"
      },
      taskId: '',
      dialogParticipation: false, //调入部门弹窗
      currentDepartment: {},
      tableData: [],
      tableDataHistory: [],
      selection: [],
      callFlag: false,
      finish: true,
      // approvalOpinion: '',
      currentCollapse: ["1", "2"],
      loading: false,
      loading1: false,
      currentPage: 1,
      pageSize: 10,
      locName: '',
      newUserList: [],
      locNumList: [],
      currentWord: 100,
      addComment: ''
    };
  },
  created() {
    this.finish = this.$route.query.finish == 'ok' ? false: true;
    this.applicationNum = this.$route.query.applicationNum;
    this.taskId = this.$route.query.id;
    this.formKey = this.$route.query.formKey;
    if (this.formKey == 'formkey_4' || this.formKey == 'formkey_5' || this.formKey == 'formkey_6' || this.formKey == 'formkey_7') {
      this.formFlag = true;
    }
    this.getInitData();
    this.getTableHistory();
    this.getPosCode();
  },
  computed: {
    approvalOpinion: {
      get: function() {
        return this.addComment;
      },
      set: function(val) {
        this.addComment = val.slice(0, 100);
        this.currentWord = 100 - this.addComment.length;
      }
    }
  },
  methods: {
    //初始化数据
    getInitData() {
      const loading = this.$loading({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axiosGet("exdept/getApproval?applicationNum=" + this.applicationNum).then(result => {
        if (result.code == 200) {
          this.formData = result.data.deptTransferApplyForm;
          this.tableData = result.data.deptTransferAssetInfoList;
          this.formData = result.data.deptTransferApplyForm;

          this.formData.deptName = result.data.deptTransferApplyForm.inDeptName;
          this.formData.deptNum = result.data.deptTransferApplyForm.inDeptId;
          loading.close();
          if (this.tableData.length > 0) {
            this.getUseMan();
          }
        }else{
          loading.close();
          this.$message.error(result.message);
        }
      });
    },

    getUseMan() {
      var deptNum = this.tableData[0].inDept;
      axiosGet("base/user/list?deptNum=" + deptNum + "&current=1&size=9999"
      ).then(result => {
        if (result.code = 200) {
          this.newUserList = result.data.records;
        }
      });
    },

    getPosCode() {
      axiosGet("process/changeProcess/getPositionCode"
      ).then(result => {
        if (result.code = 200) {
          this.locNumList = result.data; // 待联调
        }
      });
    },

    changeSelect(val, index) {
      let obj = this.newUserList.find(item => {
        return item.usrId == val;
      })
      this.tableData[index].newUser = val || '';
      this.$set(this.tableData[index], "inModule", obj.moduleId);
      this.$set(this.tableData[index], "inModuleName", obj.moduleName);
    },

    changeSelectCode(val, index) {
      let obj = this.locNumList.find(item => {
        return item.locationCode == val
      });
      this.tableData[index].locCode = val;
      this.tableData[index].locName = obj.locationDesc;
    },

    //获取历史列表
    getTableHistory() {
      axiosGet("approvalHistoryController/history?applicationNum=" + this.applicationNum).then(result => {
        if (result.code === 200) {
          this.tableDataHistory = result.data;
        } else {
          this.$message.error(result.message)
        }
      });
    },
    /**
     * 提交表单
     */
    submitForm(flag) {
      var _this = this;
      // 如果formKey3 增加提交判断 如果是提交审批则判断(驳回不判断)
      if (this.formKey == "formkey_3" && flag) {
        for(let i = 0; i < this.tableData.length; i++) {
          let item = this.tableData[i];
          // if (!item.inModule) {
          //   this.$alert(`实物资产信息第${i + 1}列调入模块不能为空`, '提示')
          //   return;
          // }
          if (!item.locCode) {
            this.$alert(`实物资产信息第${i + 1}列位置编码不能为空`, '提示')
            return;
          }
          if (!item.newInstallLoc) {
            this.$alert(`实物资产信息第${i + 1}列现安装地点不能为空`, '提示')
            return;
          }
          if (!item.newUser) {
            this.$alert(`实物资产信息第${i + 1}列现使用人不能为空`, '提示')
            return;
          }
        }
      }
      // const loading = this.$loading({
      //   lock: true,
      //   text: '提交中...',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // });
      let status = flag ? "Y" : "N";
      if (status === "N") {
        if (!_this.approvalOpinion) {
          _this.$message.warning("审批意见不能为空！");
          return;
        }
      }
      let params = {
        deptTransferApplyForm: _this.formData,
        deptTransferAssetInfos: _this.tableData,
        formKey: _this.formKey,
        changeResultDto: {
          id: _this.formData.id,
          taskId: _this.taskId,
          groupTask: "false",
          circulationConditions: status,
          localVariablesParam: {
            approvalOpinion: _this.approvalOpinion
          }
        },
        showLoading: true
      };
      axiosPost("exdept/managerPassOrReject", params).then(result => {
        if (result.code == 200 && result.data) {
          _this.callFlag = true;
          _this.$message.success('操作成功');
          this.getTableHistory()
        }
        loading.close();
      });
    },

    // 提交和驳回确认提示
    subOrboHui(flag,text) {
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitForm(flag)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },

    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 审批意见填充
    ideaFill(val) {
      this.approvalOpinion+= val;
    }
  }
};
</script>
