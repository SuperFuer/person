<template>
  <div class="cg-change">
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
          <el-form-item label="电话" prop="mobile">
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
            <el-table-column :show-overflow-tooltip="true" prop="equipNum" label="设备编码" width="160"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="equipName"
              label="设备描述"
              width="120"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="specification" label="规格型号"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="manufacturNum" label="出厂序号"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="purchasePrice" label="采购价格"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="locationCode" label="位置编码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="locationName" label="位置描述"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="installLocDesc" label="安装地点"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="usingMan" label="使用人"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="usingManName"
              label="使用人姓名"
              width="100"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="usingDept" label="使用部门"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="usingDeptName"
              label="使用部门名称"
              width="120px"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="usingModureName" label="使用模块"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="belongSystem" label="所属系统"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="startDate" label="启用日期"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="comments" label="验收结果"></el-table-column>
          </el-table>
          <!-- <div class="spares">
            <div>备品备件明细</div>
            <el-input v-model="productDetail" type="textarea" disabled rows="1"></el-input>
          </div>-->
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
      <!-- 技术文档资料 -->
      <div class="fileRefs" v-if="fileRefs.length>0">
        <div class="query-title">技术资料文档</div>
        <el-row>
          <el-col v-for="(item,index) in fileRefs" :key="index">{{item.fileName}}</el-col>
        </el-row>
        <div style="text-align:center;">
          <el-button size="small" type="primary" :disabled="disabled" @click="downRileRef">下载文档</el-button>
        </div>
      </div>
      <!-- <div style="margin:0px 0 10px;">审批历史</div> -->
      <history
        :childId="childId"
        v-if="DestroyIncomeStatistics == true"
        ref="IncomeStatisticsChild"
      ></history>
      <br />
      <el-row v-if="finish=='no'" style="margin-top:30px">
        <div class="query-title" style="margin-bottom:0px;">审批意见</div>
        <el-col :span="24" :offset="0" style="text-align:right;">
          <el-button type="text" icon="el-icon-plus" :disabled="disabled" @click="ideaFill('同意')">同意</el-button>
          <el-button
            type="text"
            icon="el-icon-plus"
            :disabled="disabled"
            @click="ideaFill('不同意')"
          >不同意</el-button>
          <el-button
            type="text"
            icon="el-icon-plus"
            :disabled="disabled"
            @click="ideaFill('设备已确认')"
          >设备已确认</el-button>
        </el-col>
      </el-row>
      <el-row v-if="finish=='no'">
        <el-col :span="24">
          <el-input
            v-model.trim="approvalOpinion"
            width="100%"
            type="textarea"
            :row="2"
            resize="none"
            :disabled="disabled"
          ></el-input>
          <span class='current-word'>{{currentWord}}/{{100}}</span>
        </el-col>
      </el-row>

      <el-form-item class="btn-group" v-if="finish=='no'">
        <!--标签打印入口按钮-->
        <!--        <el-dropdown @command="handleCommand" style="margin-right: 40px">-->
        <!--          <el-button size="small" type="primary">-->
        <!--            打印标签-->
        <!--          </el-button>-->
        <!--          <el-dropdown-menu slot="dropdown">-->
        <!--            <el-dropdown-item command="00">大标签</el-dropdown-item>-->
        <!--            <el-dropdown-item command="01">小标签</el-dropdown-item>-->
        <!--          </el-dropdown-menu>-->
        <!--        </el-dropdown>-->

        <!--      打印弹出框-->
        <el-dialog title="选择打印设备" :visible.sync="dialogFormVisible">
          <el-tree
            :default-expand-all="true"
            :data="daYinData"
            :props="daYinDataProps"
            @node-click="handleNodeClick"
          ></el-tree>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="daYinGo()">打 印</el-button>
          </div>
        </el-dialog>

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
import { axiosPost, axiosGet, constApi } from "@/api/index.js";
import history from "../../../../../components/commonHistory";
export default {
  props: {
    params: {
      type: Object
    }
  }, //上个页面传参
  data() {
    return {
      daYinList: {}, // 打印提交的数据
      daYinData: [
        {
          label: "请选择打印机类型",
          children: [
            {
              label: "什么什么打印机"
            }
          ]
        }
      ], // 打印机类型
      daYinDataProps: {
        children: "children",
        label: "label"
      },
      constApi: constApi,
      command: "", // 打印标签种类
      dialogFormVisible: false, // 控制打印是否显示框
      childId: "",
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
      // approvalOpinion: "", //审批意见
      otherSuggest: "", //其他意见
      productDetail: "", //备品备件明细
      disabled: false, // 是否编辑页
      finish: "no", //默认可显示
      currentPage: 1,
      pageSize: 10,
      DestroyIncomeStatistics: true,
      currentWord: 0,
      addComment: "",
      fileRefs: []
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
    downRileRef() {
      axiosGet(
        "/process/acceptance/zip-download?applicationNum=" +
          this.formData.applicationNum
      ).then(result => {
        if (result.code == 200) {
          window.location.href = this.constApi + result.data;
        } else {
          this.$message({
            message: result.message,
            type: "error"
          });
        }
      });
    },
    // 选择什么打印机
    handleNodeClick(data) {
      this.daYinList.printName = data.label;
      this.daYinList.param = this.tableData;
    },

    // 打印标签测试
    daYinGo() {
      axiosPost("label/print", this.daYinList).then(result => {
        if (result.code == 200) {
          this.dialogFormVisible = false;
        } else {
          this.$message.error("出错啦！");
        }
      });
    },

    // 选择要打印类型
    handleCommand(command) {
      this.command = command;
      this.daYinList.small = command;
      axiosGet("label/print/list").then(result => {
        if (result.code == 200) {
          this.daYinData[0].children = resule.data;
        } else {
          this.$message.error(resule.message);
        }
      });
      this.dialogFormVisible = true;
    },

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
      let text = "";
      flag ? (text = "是否提交？") : (text = "是否驳回？");
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.DestroyIncomeStatistics = false;
          let params = {
            taskId: _this.taskId,
            groupTask: "false",
            circulationConditions: status,
            localVariablesParam: {
              approvalOpinion: _this.approvalOpinion
            },
            showLoading: true
          };
          axiosPost("approval/pass", params).then(result => {
            if (result.code == 200 && result.data) {
              _this.disabled = true;
              _this.$message({
                type: "success",
                message: "操作成功"
              });
              this.$nextTick(() => {
                this.DestroyIncomeStatistics = true;
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    // 审批意见填充
    ideaFill(val) {
      this.approvalOpinion += val;
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
        _this.fileRefs = _this.formData.fileRefs || [];
      }
    });

    // 审批历史  params.applyformId
    _this.childId = params.applyformId;
  }
};
</script>
<style lang="scss">
.cg-change {
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
  }
  .fileRefs {
    padding-bottom: 10px;
    .el-col {
      padding-left: 15px;
      padding: 5px;
    }
  }
}
</style>
