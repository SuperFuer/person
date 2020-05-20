<style lang="scss" scoped>
.inv-approval {

}
</style>
<template>
  <div class="inv-approval common-table">
    <div class="form-title">
      <i class="icon"></i>部门领导审批
    </div>
    <el-form ref="ruleForm" :model="formData" :inline="true" :rules="rules" label-width="107px">
      <el-row class="common-row">
        <el-col :span="8">
          <el-form-item label="申请编号" prop="applicationNum">
            <el-input v-model="formData.applicationNum" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="applicationStatus">
            <el-input v-model="formData.applicationStatus" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请日期" prop="applicationDate">
            <el-input v-model="formData.applicationDate" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="common-row">
        <el-col :span="8">
          <el-form-item label="主题" prop="subject">
            <el-input v-model.trim="formData.subject" :disabled="callFlag"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人" prop="applicantName">
            <el-input v-model="formData.applicantName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话" prop="applicantPhone">
            <el-input v-model="formData.applicantPhone" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-collapse class="common-fold common-collapse common-table mt10" v-model="currentCollapse">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="collapse-title">实物资产信息</div>
        </template>
        <el-table :data="tableData" border tooltip-effect="dark" row-key="key">
          <el-table-column label="序号" type="index" width="60" show-overflow-tooltip></el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="盘点名称"></el-table-column>
          <el-table-column show-overflow-tooltip prop="inventoryYear" label="盘点年度"></el-table-column>
          <el-table-column prop="deptTotal" label="使用部门数"></el-table-column>
          <el-table-column show-overflow-tooltip prop="inventoryTotal" label="盘点总量"></el-table-column>
          <el-table-column show-overflow-tooltip prop="match" label="账实相符数"></el-table-column>
          <el-table-column show-overflow-tooltip prop="surplus" label="盘盈"></el-table-column>
          <el-table-column show-overflow-tooltip prop="deficit" label="盘亏"></el-table-column>
          <el-table-column
            width="110"
            label="操作">
            <template slot-scope="scope">
              <el-button plain
                type="success"
                @click.native.prevent="inventoryDetail(scope.row)"
                size="mini">
                查询明细
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>

    <el-row v-if="!finish">
      <el-col :span="24" class="addLook query-title">审批意见:</el-col>
      <el-col :span="24" :offset="0" class="text-right">
        <el-button type="text" icon="el-icon-plus" @click="ideaFill('同意')" :disabled="callFlag">同意</el-button>
        <el-button type="text" icon="el-icon-plus" @click="ideaFill('不同意')" :disabled="callFlag">不同意</el-button>
        <el-button type="text" icon="el-icon-plus" @click="ideaFill('设备已确认')" :disabled="callFlag">设备已确认</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-input class="mb10" type="textarea"
          resize="none"
          v-model.trim="approvalOpinion"
          maxlength="100"
          show-word-limit 
          :disabled="finish || callFlag"></el-input>
      </el-col>
    </el-row>

    <common-history ref="commonHistory" :childId="childId"></common-history>

    <div class="btns" v-if="!finish">
      <el-button
        size="small"
        type="warning"
        @click="onSubmit(false)"
        :disabled="callFlag"
      >驳回</el-button>
      <el-button @click="onSubmit(true)" size="small" class="submit-btn" :disabled="callFlag">提 交</el-button>
    </div>

  </div>
</template>
<script>
import { getApproval, inventoryApproval } from "@/api/swInventory.js"
import commonHistory from "@/components/commonHistory"
export default {
  props: {
    paramList: {
      type: Object
    }
  },
  components: {
    commonHistory
  },
  data() {
    return {
      callFlag: false,
      finish: false,
      childId: '',
      formData: {
        id: '',
        applicationNum: '',
        applicationStatus: '',
        applicationDate: '',
        subject: '',
        applicantName: '',
        applicantPhone: ''
      },
      managementId: '',
      tableData: [],
      approvalOpinion: '',
      currentCollapse: ["1"],
      rules: {
        subject: [{
          required: true,
          message: "主题不能为空",
          trigger: ["blur", "change"]
        },
        {
          min: 6,
          max: 50,
          message: "主题长度为 6 - 50 个字符",
          trigger: ["blur", "change"]
        }]
      }
    };
  },
  computed: {
  },
  created() {
    this.childId = this.$route.query.applicationNum;
    if (this.$route.query.finish === 'no') { // 待办
      this.getApprovalData();
    } else { //已办
      this.finish = true;
    }
  },
  methods: {
    //初始化数据
    getApprovalData() {
      let params = {
        applicationNum: this.childId
      }
      getApproval(params).then(res => {
        if(res.code === 200) {
          this.formData = res.data.form;
          this.tableData.splice(0, 1, res.data.inventoryManagement);
        } else {
          this.$message.warning(res.message);
        }
      }) 
    },
    //提交
    onSubmit(flag) {
      let status = flag ? "Y" : "N";
      if (status === "N" && !this.approvalOpinion) {
        this.$message.warning("审批意见不能为空！");
        return;
      }
      let params = {
        taskId: this.$route.query.id,
        id: this.formData.id,
        groupTask: "false",
        circulationConditions: status,
        formKey: this.$route.query.formKey,
        localVariablesParam: {
          approvalOpinion: this.approvalOpinion
        }
      };

      let tips = status === 'Y' ? '提交' : '驳回';
      this.$confirm(`确定要${tips}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.sendPost(params);
      })
    },
    sendPost(params) {
      const loading = this.$loading();
      inventoryApproval(params).then(res => {
        if(res.code === 200) {
          this.callFlag = true;
          this.$message.success("操作成功！");
          this.$refs.commonHistory.getApprovalHistory();
        } else {
          this.$message.warning(res.message);
        }
        loading.close();
      })     
    },
    // 审批意见填充
    ideaFill(val) {
      this.approvalOpinion += val;
    },
    inventoryDetail (row) {
      let user = JSON.parse(localStorage.getItem('user'))
      this.$router.push({
        path: '/inventoryAdminDetail',
        query: {
          id: row.id,
          usrId: user.usrId
        }
      })
    }
  }
};
</script>

