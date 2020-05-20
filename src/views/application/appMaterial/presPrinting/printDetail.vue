<template>
  <div class="ys-printDetail common-table" id="printMe">
    <div>
      <div class="form-title">
        <i class="icon"></i>
        产品验收报告（设备）
      </div>
      <el-form :model="formData" :inline="true" label-width="100px" ref="ruleForm" class="sb-form">
        <el-row :gutter="10" class="common-row">
          <el-col :span="8">
            <el-form-item label="甲方" prop="partyA">
              <el-input v-model="formData.partyA" disabled></el-input>
              <!-- <span>{{formData.applicationNum}}</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="乙方" prop="partyB">
              <el-input v-model="formData.partyB" disabled></el-input>
              <!-- <span>{{formData.applicationStatus}}</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="验收时间" prop="applicationDate">
              <el-input v-model="formData.applicationDate" disabled></el-input>
              <!-- <span>{{formData.applicationDate}}</span> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="common-row">
          <el-col :span="8">
            <el-form-item label="项目编号" prop="projectNum">
              <el-input v-model="formData.projectNum" :disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购订单" prop="orderNum">
              <!-- <span>{{formData.applicantName}}</span> -->
              <el-input v-model="formData.orderNum" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品总费用" prop="productTotalFee">
              <el-input v-model="formData.productTotalFee" disabled></el-input>
              <!-- <span>{{formData.mobile}}</span> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-form-item label="安装运输费用" prop="installTransportFee">
              <el-input v-model="formData.installTransportFee" disabled></el-input>
              <!-- <span>{{formData.mobile}}</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="btn-group" style="text-align:right;width:280px;">
              <!-- @click="confirmSubmit('ruleForm',true)" -->
              <el-button type="primary" size="small" @click="confirmSubmit('ruleForm',true,'01')">打印</el-button>
              <el-button size="small" type="warning" @click="confirmSubmit('ruleForm',false,'00')">下载</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-collapse class="common-collapse" v-model="currentCollapse" disabled>
          <el-collapse-item name="1" disabled>
            <template slot="title">
              <div class="collapse-title">验收内容</div>
            </template>
            <div class="accept-content">
              <el-row>
                <el-col
                  :span="12"
                  v-for="(item,index) in acceptContentList"
                  :key="index"
                  :class="acceptContentList.length%2 ==0?'active':'inactive'"
                >
                  <el-row type="flex" class="row-bg" justify="center" align="middle">
                    <el-col :span="8" class="position-title">
                      <span>{{item.name}}</span>
                    </el-col>
                    <el-col :span="16" class="content-line">
                      <el-radio-group v-model="item.flag" :disabled="disabled">
                        <el-col :span="12" v-for="(n,current) in item.childList" :key="current">
                          <el-radio :label="n.id">{{n.name}}</el-radio>
                        </el-col>
                      </el-radio-group>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </el-collapse-item>
          <el-collapse-item name="2" disabled>
            <template slot="title">
              <div class="collapse-title">技术资料</div>
            </template>
            <el-row class="technical">
              <el-checkbox-group v-model="technicalChecked" :disabled="disabled">
                <el-col :span="8" v-for="(item,index) in technicalIInfoList" :key="index">
                  <el-checkbox :label="item">{{item.name}}</el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="3" disabled>
            <template slot="title">
              <div class="collapse-title">验收结论</div>
            </template>
            <el-row class="sb-border">
              <el-radio-group v-model="bindConclusion" :disabled="disabled">
                <el-col v-for="(item,index) in acceptConclusion" :key="index">
                  <el-radio :label="item.id">{{item.name}}</el-radio>
                </el-col>
              </el-radio-group>
            </el-row>
          </el-collapse-item>
          <history :childId="childId"></history>
          <el-collapse-item name="5" disabled>
            <template slot="title">
              <div class="collapse-title">验收明细</div>
            </template>
            <el-table ref="tableDataDetail" :data="tableDataDetail" tooltip-effect="dark">
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column prop="equipNum" label="设备编码" width="180"></el-table-column>
              <el-table-column prop="equipName" label="设备描述" width="100"></el-table-column>
              <el-table-column prop="specification" label="规格型号"></el-table-column>
              <el-table-column prop="manufacturNum" label="出厂序号" width="100"></el-table-column>
              <el-table-column prop="purchasePrice" label="采购价格"></el-table-column>
              <el-table-column prop="installLocDesc" label="安装地点" width="120"></el-table-column>
              <el-table-column prop="usingMan" label="使用人" width="100"></el-table-column>
              <el-table-column prop="usingManName" label="使用人姓名" width="100"></el-table-column>
              <el-table-column prop="usingDept" label="使用部门"></el-table-column>
              <el-table-column prop="usingDeptName" label="使用部门名称" width="120"></el-table-column>
              <el-table-column prop="usingModure" label="使用模块"></el-table-column>
              <el-table-column prop="usingModureName" label="使用模块名称" width="120"></el-table-column>
              <el-table-column prop="belongSystem" label="所属系统"></el-table-column>
              <el-table-column prop="startDate" label="启用日期" width="100"></el-table-column>
              <el-table-column prop="comments" label="验收结果"></el-table-column>
            </el-table>
            <div class="el-textarea">
              <textarea
                autocomplete="off"
                rows="2"
                placeholder="备品备件明细"
                class="el-textarea__inner"
                style="min-height: 33px;"
                disabled
              ></textarea>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>
  </div>
</template>
<script>
import { axiosPost, axiosGet, constApi } from "@/api/index.js";
import history from "../../../../components/commonHistory";
export default {
  data() {
    return {
      constApi: constApi,
      childId: "",
      currentCollapse: ["1", "2", "3", "4", "5"],
      loading: true,
      pageTitle: "产品验收报告（设备）",
      disabled: true, // 是否编辑页
      formData: {
        partyA: "北京首都机场股份有限公司",
        partyB: "",
        applicationNum: "",
        applicationStatus: "",
        applicationDate: "",
        subject: "",
        orderNum: "",
        mobile: "",
        installTransportFee: "",
        equipNum: "",
        productTotalFee: "",
        projectNum:''
      },
      otherFormData: {},
      dialogEdit: false,
      acceptContentList: [],
      technicalIInfoList: [],
      technicalChecked: [],
      acceptConclusion: [],
      bindConclusion: "",
      recordTableData: [],
      tableData: [],
      tableDataDetail: [],
      categoryContentId: "", //验收内容id
      selectedContentList: [],
      categoryTechnologyId: "", //技术资料id
      selectedTechnologyList: [],
      categoryConclusionyId: "", //验收理论id
      selectedConclusionList: [],
      categoryDetailgyId: "", //验收明细id
      applyformId: "",
      reportUrl: "",
      detailUrl: ""
    };
  },
  components: {
    history: history
  },
  methods: {
    confirmSubmit(ruleForm, value,num) {
      var _this = this;
      //  this.$message('待开发');
      if (value) {
        this.handleOperation(value,num);
      } else {
        this.handleOperation(value,num);
      }
    },
    handleOperation(value,num) {
      let _this = this;
      let parmas = {
        applicationNum: _this.formData.applicationNum,
        orderNum: _this.formData.orderNum,
        printType:num
      };
      if (value) {
        axiosPost("pdf/pdf-report-download", parmas).then(result => {
          if (result.code == 200) {
            window.open(result.data);
            //  window.location.href = result.data;
          } else {
            _this.commonErrorTip(result.message);
          }
        });
      } else {
        axiosPost("pdf/pdf-report-download", parmas).then(result => {
          if (result.code == 200) {
             window.location.href = _this.constApi + result.data;
          } else {
            _this.commonErrorTip(result.message);
          }
        });
      }
    },
    commonErrorTip(message) {
      var _this = this;
      _this.$alert(message, "提示", {
        type: "error",
        confirmButtonText: "确定"
      });
    },
    handleDoEvent(params) {
      var _this = this;
      axiosGet("approval/report?applyformId=" + params, { showLoading: true })
        .then(result => {
          if (result.code == 200) {
            let data = result.data;
            _this.formData.applicationNum = data.applyForm.applicationNum; //项目编号
            _this.formData.projectNum=data.applyForm.projectNum
            _this.formData.applicationStatus = data.applyForm.applicationStatus; //申请状态
            _this.formData.applicationDate = data.applyForm.applicationDate; //申请日期
            _this.formData.subject = data.applyForm.subject;
            _this.formData.orderNum = data.applyForm.orderNum; //采购订单
            //
            _this.formData.installTransportFee = data.applyForm
              .installTransportFee
              ? data.applyForm.installTransportFee
              : "0"; //运输费用
            _this.formData.partyB = data.applyForm.providerName;
            _this.formData.productTotalFee = data.applyForm.productTotalFee
              ? data.applyForm.productTotalFee
              : "0";
          }
        })
        .catch(result => {

        });
      axiosPost("approval/viewdic", {
        id: params
      }).then(result => {
        let data = result.data;
        if (result.code == 200) {
          _this.loading = false;
          // 技术资料
          _this.technicalIInfoList = data.newDic[1].dics;
          _this.categoryTechnologyId = data.newDic[1].categoryId;
          _this.technicalIInfoList.forEach(item => {
            if (item.select) {
              _this.technicalChecked.push(item);
            }
          });
          // 验收理论
          _this.acceptConclusion = data.newDic[2].dics;
          _this.categoryConclusionyId = data.newDic[2].categoryId;
          _this.acceptConclusion.forEach(item => {
            if (item.select) {
              _this.bindConclusion = item.id;
            }
          });

          // 验收内容
          let contentList = [];
          contentList = data.newDic[0].dics;
          contentList.forEach(item => {
            item.childList.forEach(list => {
              if (list.select) {
                item.flag = list.id;
              }
            });
            _this.acceptContentList.push(item);
            _this.selectedContentList.push({
              dicId: item.id,
              childId: item.flag
            });
          }); //默认选中第一个
          _this.categoryContentId = data.newDic[0].categoryId;
        } else {
          this.$message.console.error();
          ("请求错误");
          _this.loading = false;
        }
      });
    },
    handleStartData(params) {
      var _this = this;
      axiosGet("accEquip/report/detail-list?applicationNum=" + params, {
        showLoading: true
      }).then(result => {
        _this.tableDataDetail = result.data;
      });
    }
  },
  created() {
    var _this = this;
    let params = this.$route.query.applyformId;
    _this.handleDoEvent(params);
    _this.childId = params;
    // 验收明细
    this.handleStartData(params);
  }
};
</script>

<style lang="scss">
.ys-printDetail {
  padding-bottom: 0px !important;
  .el-input__icon {
    line-height: 30px;
  }
  .el-input.is-disabled .el-input__inner {
    color: #555;
    width: 180px;
  }
  .sb-form {
    white-space: nowrap;
    // .el-input__inner {
    //   width: 180px !important;
    // }
  }
  .el-date-editor.el-input {
    width: 100% !important;
  }
  .accept-content {
    margin: 0 10px 0;
    border: 1px solid #dcdfe6;
    border-bottom-color: transparent !important;
    border-left-color: transparent !important;
    white-space: pre-wrap;
    > .el-row {
      > .el-col-12 {
        border-bottom: 1px solid #dcdfe6;
        &.inactive:last-child {
          border-bottom-color: transparent !important;
        }
      }
    }
    .row-bg {
      .el-col {
        // border-bottom: 1px solid #dcdfe6;
        text-align: center;
        height: 62px;
        position: relative;
        // &:last-child {
        //   border-bottom-color: transparent !important;
        // }
      }
      .el-radio-group {
        width: 100%;
        .el-radio {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .position-title {
        background: rgba(230, 236, 241, 1);
        span {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          line-height: 18px;
        }
      }
    }
  }
  .sb-border {
    padding-left: 10px;
    .el-col {
      padding: 10px 0;
    }
  }
  // .btn-group {
  //   display: block;
  //   text-align: center;
  //   margin-top: 20px;
  //   box-sizing: border-box;
  //   .el-form-item__content {
  //     width: auto !important;
  //   }
  // }
  .technical {
    padding-left: 10px;
    .el-col-8 {
      margin-bottom: 15px;
      &:last-child {
        margin-bottom: 0;
      }
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
  }
  .common-collapse {
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
  .content-line {
    > div {
      > div:first-child {
        border-right: 1px solid #eee;
      }
    }
  }
}
</style>