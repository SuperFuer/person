<template>
  <div class="seal-change">
    <div class="form-title">
      <i class="icon"></i>
      {{pageTitle}}
    </div>
    <el-form :model="formData" :inline="true" label-width="80px">
      <el-row :gutter="10" class="common-row">
        <el-col :span="8">
          <el-form-item label="申请编号" prop="applicationNum">
            <el-input v-model="formData.applicationNum" disabled></el-input>
            <!-- <span>{{formData.applicationNum}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="applicationStatus">
            <el-input v-model="formData.applicationStatus" disabled></el-input>
            <!-- <span>{{formData.applicationStatus}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请日期" prop="applicationDate">
            <el-input v-model="formData.applicationDate" disabled></el-input>
            <!-- <span>{{formData.applicationDate}}</span> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="主题" prop="subject">
            <el-input v-model="formData.subject" disabled></el-input>
            <!-- <span>{{formData.subject}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人" prop="applicantName">
            <el-input v-model="formData.applicantName" disabled></el-input>
            <!-- <span>{{formData.applicantName}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话" prop="applicantPhone">
            <!-- <span>{{formData.mobile}}</span> -->
            <el-input v-model="formData.applicantPhone" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse class="common-collapse" v-model="currentCollapse">
        <el-collapse-item name="1" class="active">
          <template slot="title">
            <div class="collapse-title">实物资产信息</div>
          </template>
          <el-table
            :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
          >
            <el-table-column :show-overflow-tooltip="true" label="序号" width="55" type="index"></el-table-column>
            <!-- <el-table-column :show-overflow-tooltip="true" prop="assetNum" label="资产编码" width="120"></el-table-column> -->
            <el-table-column :show-overflow-tooltip="true" prop="equipNum" label="设备编码" width="120"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="equipName"
              label="设备名称"
              width="120"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="useMan" label="使用人"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="useDept" label="使用人部门" width="120"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="locationCode" label="位置编码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="locationDesc" label="位置描述"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="archiveTime" label="封存时间"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="archiveSite" label="封存地点"></el-table-column>
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
      </el-collapse>
      <div class="query-title">封存申请备注</div>
      <el-row>
        <el-col>
          <el-input type="textarea" :row="2" resize="none" disabled v-model="comment"></el-input>
        </el-col>
      </el-row>
      <div>
        <!-- <div class="query-title" style="margin-top:15px;">审批历史</div> -->
        <history
           style="margin-top:30px;"
          :childId="childId"
          v-if="DestroyIncomeStatistics == true"
          ref="IncomeStatisticsChild"
        ></history>
      </div>
      <el-row v-if="finish=='no'" style="margin-top:30px;">
        <div class="query-title" style="margin-bottom:0px;" v-if="finish=='no'">审批意见</div>
        <el-col :span="24" :offset="0" style="text-align:right;">
          <el-button type="text" icon="el-icon-plus" :disabled="disabled" @click="ideaFill('同意')">同意</el-button>
          <el-button type="text" icon="el-icon-plus" :disabled="disabled" @click="ideaFill('不同意')">不同意</el-button>
          <el-button type="text" icon="el-icon-plus" :disabled="disabled" @click="ideaFill('设备已确认')">设备已确认</el-button>
        </el-col>
      </el-row>
      <el-row v-if="finish=='no'">
        <el-col>
          <el-input
            type="textarea"
            v-model="approvalOpinion"
            :row="2"
            resize="none"
            :disabled="disabled"
          ></el-input>
          <span class="current-word">{{currentWord}}/{{100}}</span>
        </el-col>
      </el-row>
      <el-form-item class="btn-group" v-if="finish=='no'">
        <el-button
          size="small"
          type="warning"
          @click="confirmSubmit(false)"
          :style="{'opacity':disabled?0.6:1}"
          :disabled="disabled"
        >驳回</el-button>
        <el-button
          type="primary"
          size="small"
          @click="confirmSubmit(true)"
          :disabled="disabled"
          :style="{'opacity':disabled?0.6:1}"
        >提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js";
import history from "../../../../components/commonHistory"; //公用审批历史
export default {
  data() {
    return {
      params: {},
      command: "", // 打印标签种类
      dialogFormVisible: false, // 控制打印是否显示框
      DestroyIncomeStatistics: true,
      childId: "",
      currentCollapse: ["1"],
      pageTitle: "实物资产封存审批",
      formData: {
        applicationNum: "",
        applicationStatus: "",
        applicationDate: "",
        subject: "",
        applicantName: "",
        applicantPhone: ""
      },
      tableData: [],
      approveHistory: [],
      disabled: false, // 是否编辑页
      finish: "no", //默认可显示
      currentPage: 1,
      pageSize: 10,
      addComment: "",
      comment: "",
      currentWord: 0,
      applyId: ""
    };
  },
  components: {
    history: history
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
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    confirmSubmit(flag) {
      // 确认/驳回 根据value判断
      var _this = this;
      if (!flag) {
        if (!_this.approvalOpinion) {
          _this.$message({
            message: "审批意见不能为空！",
            type: "error"
          });
          return;
        }
      }
      let text = "";
      flag ? (text = "是否提交？") : (text = "是否驳回？");
      _this
        .$confirm(text, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.DestroyIncomeStatistics = false;
          let params = {
            taskId: this.params.id,
            id: _this.applyId,
            groupTask: "false",
            circulationConditions: flag ? "Y" : "N",
            formKey: this.params.formKey,
            localVariablesParam: {
              approvalOpinion: _this.approvalOpinion
            },
            showLoading: true,
            type: "1" //封存
          };
          _this.handleSubmitResult(params);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    handleSubmitResult(params) {
      var _this = this;
      axiosPost("archive/equipment/approval", params).then(result => {
        if (result.code == 200 && result.data) {
          _this.disabled = true;
          _this.$message({
            type: "success",
            message: "操作成功"
          });
          this.$nextTick(() => {
            this.DestroyIncomeStatistics = true;
          });
        } else {
          _this.$message({
            type: "warning",
            message: result.message
          });
        }
      });
    },
    getInitData(applicationNum) {
      axiosGet(
        "archive/equipment/pending-approval?applicationNum=" + applicationNum,
        { showLoading: true }
      ).then(result => {
        if (result.code == 200) {
          var data = result.data.ArchiveProcess;
          this.formData.applicationNum = data.applicationNum;
          this.formData.applicationStatus = data.applicationStatus;
          this.formData.applicationDate = data.applicationDate;
          this.formData.subject = data.subject;
          this.formData.applicantName = data.applicantName;
          this.formData.applicantPhone = data.applicantPhone;
          this.comment = data.appComment ? data.appComment : "";
          this.applyId = data.id;
          this.tableData = result.data.ArchiveProcessAssetsList;
        } else {
          this.$message({
            type: "warning",
            message: result.message
          });
        }
      });
    },
    // 审批意见填充
    ideaFill(val) {
      this.approvalOpinion += val;
    }
  },
  created() {
    var _this = this;
    this.params = _this.$route.query;
    _this.finish = this.params.finish;
    // 上个页面获取的ture或false 是字符串
    if (this.params && this.params.disabled === "true") {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    this.getInitData(this.params.applicationNum);
    _this.childId = this.params.applicationNum;
  }
};
</script>
<style lang="scss">
.seal-change {
  padding-bottom: 0px !important;
  .el-form--inline .el-form-item__content,
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 202px !important;
  }
  // .el-input__inner {
  //   width: 180px !important;
  //   height: 30px;
  //   line-height: 30px;
  // }
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
      flex: 1 0 90%;
      order: 1;
    }
    .el-collapse-item__arrow {
      order: -1;
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
  .addLook {
    line-height: 42px;
    font-weight: 700;
  }
}
</style>
