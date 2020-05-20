<template>
  <div class="seal-change">
    <div class="form-title">
      <i class="icon"></i>
      {{pageTitle}}
    </div>
    <el-form :model="formData" :inline="true" :rules="rules" label-width="80px">
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
          <el-form-item label="电话" prop="mobile">
            <!-- <span>{{formData.mobile}}</span> -->
            <el-input v-model="formData.mobile" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse class="common-collapse" v-model="currentCollapse">
        <el-collapse-item name="1" class="active">
          <template slot="title">
            <div class="collapse-title">封存信息</div>
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
            <el-table-column :show-overflow-tooltip="true" prop="equipNum" label="资产编码" width="120"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="equipNum" label="设备编码" width="120"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="equipName"
              label="设备名称"
              width="120"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="specification" label="使用人"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="manufacturNum"
              label="使用人部门"
              width="120"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="purchasePrice" label="位置编码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="locationName" label="位置描述"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="installLocDesc" label="封存时间"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="usingMan" label="封存地点"></el-table-column>
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
          <el-input type="textarea" :row="2" resize="none" disabled></el-input>
        </el-col>
      </el-row>
      <div class="query-title" style="margin-top:15px;">审批意见</div>
      <el-row>
        <el-col>
          <el-input type="textarea" v-model="filterAddComment" :row="2" resize="none"></el-input>
        </el-col>
        <el-col style="text-align:right;">
          <span>{{currentWord}}/{{100}}</span>
        </el-col>
      </el-row>
      <div v-if="finish=='no'">
        <div class="query-title" style="margin-top:15px;">审批历史</div>
        <history
          :childId="childId"
          v-if="DestroyIncomeStatistics == true"
          ref="IncomeStatisticsChild"
        ></history>
      </div>
      <el-form-item class="btn-group" v-if="finish=='no'">
        <el-button
          v-if="formkey!='formkey_5'"
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
import history from "../../../../components/history";
export default {
  props: {
    params: {
      type: Object
    }
  }, //上个页面传参
  data() {
    return {
      command: "", // 打印标签种类
      dialogFormVisible: false, // 控制打印是否显示框
      childId: "",
      currentCollapse: ["1"],
      pageTitle: "实物资产启封审批",
      taskId: "",
      formData: {
        applicationNum: "",
        applicationStatus: "",
        applicationDate: "",
        subject: "",
        applicantName: "",
        mobile: ""
      },
      otherFormData: {},
      rules: {
        theme: [
          {
            message: "主题不能为空",
            trigger: "blur"
          }
        ]
      },
      tableData: [],
      approvalOpinion: "", //审批意见
      otherSuggest: "", //其他意见
      productDetail: "", //备品备件明细
      disabled: false, // 是否编辑页
      finish: "no", //默认可显示
      currentPage: 1,
      pageSize: 10,
      addComment: "",
      currentWord: 100
    };
  },
  components: {
    history: history
  },
  computed: {
    filterAddComment: {
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
    handleCurrentChange(val) {
      console.log(val);
      console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    confirmSubmit(flag) {
      // 确认/驳回 根据value判断
      var _this = this;
    }
  },
  created() {
    var _this = this;
    let params = _this.params;
    params.showLoading = true;
    _this.finish = params.finish;
    // 上个页面获取的ture或false 是字符串
    if (params.disabled === "true") {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
    this.formkey = params.formKey;

    this.taskId = params.sapId;
    // 页面初始化 验收明细
    axiosPost("approval/enter", params).then(result => {
      if (result.code == 200) {
        _this.pageTitle = result.data.title;
        _this.formData = result.data.applyForm;
        _this.formData.mobile = result.data.user.mobile;
        _this.tableData = result.data.applyForm.equipInfos;
        _this.productDetail = _this.formData.spareDetail;
      }
    });

    // 审批历史  params.applyformId
    _this.childId = params.applyformId;
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
      padding-left: 20px;
    }
    .el-collapse-item__arrow {
      margin: 0 0px 0 -73px;
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
</style>
