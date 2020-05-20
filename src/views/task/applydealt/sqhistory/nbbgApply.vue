<template>
  <div class="sb-change">
    <div class="form-title">
      <i class="icon"></i>
      实物资产内部变更审批
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
          <el-form-item label="申请时间" prop="applicationDate">
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
          <el-form-item label="邮箱" prop="mobile">
            <!-- <span>{{formData.mobile}}</span> -->
            <el-input v-model="formData.mobile" disabled></el-input>
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
            class="table-box"
            row-key="key"
          >
            <el-table-column label="序号" type="index" show-overflow-tooltip></el-table-column>
            <el-table-column prop="assetNum" label="资产编码" width="100"></el-table-column>
            <el-table-column prop="equipNum" label="设备编码" width="160"></el-table-column>
            <el-table-column prop="equipName" label="设备名称" width="100"></el-table-column>
            <el-table-column prop="installLocDesc" label="原安装地点" width="200"></el-table-column>
            <el-table-column prop="usingMan" label="原使用人"></el-table-column>
            <el-table-column prop="usingDept" label="所属部门"></el-table-column>
            <el-table-column prop="positionCode" label="位置编码" width="200"></el-table-column>
            <el-table-column prop="locationName" label="位置名称" width="200"></el-table-column>
            <el-table-column prop="nowInstallLocDesc" label="现安装地点" width="200"></el-table-column>
            <el-table-column prop="nowUsingMan" label="现使用人"></el-table-column>
            <el-table-column prop="usingModure" label="所属模块"></el-table-column>
          </el-table>
          <div class="pagination" v-if="tableData.length > 10">
            <el-pagination
              background
              layout="total,prev, pager, next,jumper"
              :page-size="10"
              @current-change="handleCurrentChange"
              :total="tableData.length"
            ></el-pagination>
          </div>
          <div style="margin:20px 0 10px;">审批历史</div>
          <el-table
            :data="approveHistory"
            tooltip-effect="dark"
            style="width: 100%"
            class="history"
          >
            <el-table-column width="120">
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
            <el-table-column prop="name" label="节点" width="120"></el-table-column>
            <el-table-column prop="assignee" label="操作人" width="120"></el-table-column>
            <el-table-column prop="formKey" label="操作" width="120"></el-table-column>
            <el-table-column prop="startTime" label="操作时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="审批意见" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion}}</span>
              </template>
            </el-table-column>
          </el-table>
          <br />
          <el-row v-if="!disabled">
            <el-col :span="24">审批意见:</el-col>
            <el-col :span="24">
              <el-input v-model="approvalOpinion" width="100%" type="textarea" :disabled="disabled"></el-input>
            </el-col>
          </el-row>
          <el-form-item class="btn-group">
            <el-button
              type="primary"
              size="small"
              @click="confirmSubmit(true)"
              :disabled="disabled"
            >提交</el-button>
            <el-button
              v-if="formkey!='formkey_5'"
              size="small"
              type="warning"
              @click="confirmSubmit(false)"
              :disabled="disabled"
            >驳回</el-button>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js";

export default {
  data() {
    return {
      currentCollapse: ["1"],
      formkey: 1, //假设1 是采购执行项目负责人 2是成本中心（站、队、科、室）
      pageTitle: "",
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
      tableData: [
        // {
        //   equipNum: "", //设备编码：
        //   equipName: "", // 设备描述:
        //   specification: "", // 规格型号:
        //   manufacturNum: "", // 出厂序号：
        //   purchasePrice: "", // 采购价格:
        //   locationCode: "", // 位置编码:
        //   // 位置描述:
        //   installLocDesc: "", // 安装地点：
        //   usingMan: "", // 使用人:
        //   usingDept: "", // 使用部门:
        //   usingModure: "", // 使用模块:
        //   belongSystem: "", // 所属系统：
        //   purchaseDate: "", // 购置日期:
        //   comments: "" // 验收结果:
        // }
      ],
      approveHistory: [
        // {
        //   name: "", //节点
        //   assignee: "", //操作人
        //   startTime: "", //时间
        //   formKey: "", //操作
        //   mapVOS: {
        //     approvalOpinion: ''
        //   }
        // }
      ],
      approvalOpinion: "", //审批意见
      otherSuggest: "", //其他意见
      productDetail: "", //备品备件明细
      disabled: false, // 是否编辑页
      finish: "no", //默认可显示
      currentPage: 1,
      pageSize: 10,
      taskIdId: ''
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    confirmSubmit(flag) {
      // 确认/驳回 根据value判断
      var _this = this;
      let status = flag ? "Y" : "N";
      if (status === "N") {
        if (!_this.approvalOpinion) {
          _this.$message({
            message: "审批意见不能为空！",
            type: "error"
          });
          return;
        }
      }
      // let params = {
      //   taskId: _this.taskId,
      //   groupTask: "false",
      //   circulationConditions: status,
      //   localVariablesParam: {
      //     approvalOpinion: _this.approvalOpinion
      //   }
      // };
      let params = {
        taskId: _this.taskIdId,
        groupTask: "false",
        circulationConditions: status,
        formKey: _this.$route.query.formKey,
        localVariablesParam: {
          approvalOpinion: _this.approvalOpinion
        },
        id: this.formData.id
      };
      axiosPost("process/changeProcess/passOrReject", params).then(result => {
        if (result.code == 200 && result.data) {
          // _this.isDisabled = true;
          _this.disabled = true;

          var applicationNum = this.$route.query.applicationNum
          // 审批历史  params.applyformId
          axiosPost("approval/history", {
            id: applicationNum
          }).then(result => {
            console.log(result);
            _this.approveHistory = result.data;
          });

          _this.$message({
            type: "success",
            message: "操作成功"
          });
        }
      });
    }
  },
  created() {
    var _this = this
    _this.taskId = _this.$route.query.applicationNum
    _this.taskIdId = _this.$route.query.id
    // _this.taskId = 'BG20190000008'
    // let params = _this.taskId
    // _this.finish = params.finish;
    // 上个页面获取的ture或false 是字符串
    // if (params.disabled === "true") {
    //   this.disabled = true;
    // } else {
    //   this.disabled = false;
    // }
    // this.formkey = params.formKey;

    // this.taskId = params.sapId;
    // 页面初始化
    axiosGet("process/changeProcess/getApproval?applicationNum=" + _this.taskId).then(result => {
      if (result.code == 200) {
        console.log(result)
        _this.formData = result.data.changeProcess
        _this.tableData = result.data.changeProcessAssetsList
      }
    });

    // 页面初始化 验收明细
    // axiosPost("approval/enter", params).then(result => {
    //   if (result.code == 200) {
    //     _this.pageTitle = result.data.title;
    //     _this.formData = result.data.applyForm;
    //     _this.formData.mobile = result.data.user.mobile;
    //     _this.tableData = result.data.applyForm.equipInfos;
    //     _this.productDetail = _this.formData.spareDetail;
    //   }
    // });
    var applicationNum = this.$route.query.applicationNum
    // 审批历史  params.applyformId
    axiosPost("approval/history", {
      id: applicationNum
    }).then(result => {
      console.log(result);
      _this.approveHistory = result.data;
    });
  }
};
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
      margin: 0 0px 0 -100px;
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
