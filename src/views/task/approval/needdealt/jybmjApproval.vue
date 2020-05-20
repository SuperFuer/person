<style lang="scss" scoped>
.apply-approval {
  padding-bottom: 20px;
  .tipError {
    color: red;
  }
}
.addLook {
  line-height: 42px;
  font-weight: 700;
}
</style>
<template>
  <div class="apply-approval common-table">
    <div class="form-title">
      <i class="icon"></i>
      实物资产借用审批
    </div>
    <el-form :model="formData" :inline="true" label-width="80px">
      <el-row :gutter="10" class="common-row">
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
          <el-form-item label="申请时间" prop="applicationDate">
            <el-input v-model="formData.applicationDate" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="common-row">
        <el-col :span="8">
          <el-form-item label="主题" prop="subject">
            <el-input v-model="formData.subject" disabled></el-input>
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

    <el-collapse class="common-collapse common-fold" v-model="currentCollapse">
      <el-collapse-item name="1" class="active">
        <template slot="title">
          <div class="collapse-title">实物资产信息</div>
        </template>
        <el-table
          :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          style="width: 100%"
          class="table-box"
          row-key="key"
        >
          <el-table-column label="序号" type="index" show-overflow-tooltip></el-table-column>
          <el-table-column prop="equipNum" label="设备编码" show-overflow-tooltip></el-table-column>
          <el-table-column prop="equipName" label="设备名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="usingManName" label="使用人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="usingDeptName" label="所属部门" show-overflow-tooltip></el-table-column>
          <el-table-column prop="moduleName" label="所属模块" show-overflow-tooltip></el-table-column>
          <el-table-column prop="borrowDeptName" label="借用部门" show-overflow-tooltip></el-table-column>
          <el-table-column prop="borrowManName" label="借用人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="borrowDate" label="借用日期" show-overflow-tooltip></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="total,prev, pager, next,jumper"
            :page-size="10"
            @current-change="handleCurrentChange"
            :total="tableData.length"
          ></el-pagination>
        </div>
      </el-collapse-item>
    </el-collapse><br />


    <el-row>
      <el-col :span="24"><div class="query-title">添加备注</div></el-col>
      <el-col :span="24">
        <el-input class="mb10" v-model.trim="formData.reason" width="100%" type="textarea" disabled></el-input>
      </el-col>
    </el-row>

    <!--审批历史-->
    <div><common-history ref="commonHistory" :childId="childId"></common-history></div>


    <br />
    <el-row v-if="!finish">
      <el-col :span="18" class="addLook">审批意见:</el-col>
      <el-col :span="6" :offset="0">
        <el-button type="text" icon="el-icon-plus" @click="ideaFill('同意')" :disabled="disabled">同意</el-button>
        <el-button type="text" icon="el-icon-plus" @click="ideaFill('不同意')" :disabled="disabled">不同意</el-button>
        <el-button type="text" icon="el-icon-plus" @click="ideaFill('设备已确认')" :disabled="disabled">设备已确认</el-button>
      </el-col>
    </el-row>
    <el-row v-if="!finish">
      <el-col :span="24">
        <el-input v-model.trim="approvalOpinion" width="100%" maxlength="100" type="textarea" resize="none" :disabled="disabled"></el-input>
        <span style="position: absolute;right: 15px;bottom: 5px">{{currentWord}}/{{100}}</span>
      </el-col>
    </el-row>
    <div class="btns" v-if="!finish">
      <el-button
        size="small"
        type="warning"
        @click="confirmSubmit(false)"
        :disabled="disabled"
      >驳回</el-button>
      <el-button
        type="primary"
        size="small"
        @click="confirmSubmit(true)"
        :disabled="disabled"
      >提交</el-button>
    </div>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js";
import commonHistory from "@/components/commonHistory"

export default {
  data() {
    return {
      currentCollapse: ["1"],
      formKey: '', //假设1 是采购执行项目负责人 2是成本中心（站、队、科、室）
      taskId: "",
      childId: '',
      finish: false,
      formData: {
        applicationNum: "",
        applicationStatus: "",
        applicationDate: "",
        subject: "",
        applicantName: "",
        mobile: ""
      },
      tableData: [],
      approveHistory: [],
      // approvalOpinion: "", //审批意见
      disabled: false, // 是否编辑页
      currentPage: 1,
      pageSize: 10,
      currentWord: 100,  // 审批意见最大可输入
      addComment: ""  // 审批意见
    };
  },
  components: {
    commonHistory
  },
  created() {
    this.childId = this.$route.query.applicationNum;
    this.taskId = this.$route.query.id;
    this.formKey = this.$route.query.formKey;
    this.finish = this.$route.query.finish==='ok' ? true : false;
    this.getApprovalData();
  },
  computed: {
    approvalOpinion: {
      get: function() {
        return this.addComment;
      },
      set: function(val) {
        this.addComment = val.slice(0, 100);
        this.currentWord = this.addComment.length;
      }
    }
  },
  methods: {
     // 页面初始化
    getApprovalData() {
      let applicationNum = this.$route.query.applicationNum;
      axiosGet("process/borrowProcessForm/getApproval?applicationNum=" + applicationNum).then(result => {
        if (result.code == 200) {
          this.formData = result.data.borrowProcessForm;
          this.tableData = result.data.borrowEquipInfoList;
        }
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getApprovalData();
    },
    // 确认/驳回 根据value判断
    confirmSubmit(flag) {
      let status = flag ? "Y" : "N";
      if (status === "N" && !this.approvalOpinion) {
        this.$message.error("审批意见不能为空！");
        return;
      }
      let params = {
        taskId: this.taskId,
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
      const loading = this.$loading({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axiosPost("process/borrowProcessForm/passOrReject", params).then(result => {
        if (result.code == 200 && result.data) {
          this.disabled = true;
          this.$message.success("操作成功！");
          this.$refs.commonHistory.getApprovalHistory();
        } else {
          this.$message.warning(result.message);
        }
        loading.close()
      });    
    },
    // 审批意见填充
    ideaFill(val) {
      this.approvalOpinion += val;
    }
  }
};
</script>

