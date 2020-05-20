<style lang="scss">
  .apply-approval {
    padding-bottom: 20px;
    .tipError {
      color: red;
    }
  }
  .F_baoFei{
    .el-form--inline .common-row .el-form-item__content{
      width: 202px;
    }
  }
  .addLook {
    line-height: 42px;
  }
</style>
<template>
  <div class="apply-approval common-table F_baoFei">
    <div class="form-title">
      <i class="icon"></i>
      实物资产报废审批
    </div>
    <el-form :model="formData" :inline="true" label-width="80px">
      <el-row :gutter="10" class="common-row">
        <el-col :span="8">
          <el-form-item label="申请编号" prop="applicationNum">
            <el-input style="width: 202px" v-model="formData.applicationNum" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="applicationStatus">
            <el-input style="width: 202px" v-model="formData.applicationStatus" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间" prop="applicationDate">
            <el-input style="width: 202px" v-model="formData.applicationDate" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="主题" prop="subject">
            <el-input style="width: 202px" v-model="formData.subject" :disabled="!cangQiLai"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人" prop="applicantName">
            <el-input style="width: 202px" v-model="formData.applicantName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话" prop="applicantPhone">
            <el-input style="width: 202px" v-model="formData.applicantPhone" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-collapse class="common-collapse common-fold" v-model="currentCollapse">
      <el-collapse-item name="1" class="active" >
        <template slot="title">
          <div class="collapse-title">实物资产信息</div>
        </template>
        <div v-if="isCaiWuYuan == 'formkey_6'" style="margin-bottom: 15px">
          <!--          <el-button @click="getHeBingList()" type="primary" size="medium">导出报废明细</el-button>-->
          <el-button :disabled="finish || disabled" @click="getHeBingList()" type="primary" size="medium">选择合并流程</el-button>
        </div>
        <!-- 合流弹框 star-->
        <el-dialog title="合并流程" width="60%" :visible.sync="dialogTableVisible">
          <el-table
              ref="multipleTable"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              @selection-change="handleSelectionChange">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="name"
                label="序号"
                type="index"
                width="65">
            </el-table-column>
            <el-table-column
                prop="applicationNum"
                label="申请单号"
                width="160">
            </el-table-column>
            <el-table-column
                prop="subject"
                label="主题"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="applicantName"
                label="申请人"
                width="100"
                show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                prop="applicationDate"
                label="申请时间"
                show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取 消</el-button>
            <el-button type="primary" @click="setHeBingLiuCheng()">合 并</el-button>
          </div>
        </el-dialog>
        <!-- 合流弹窗 end-->

        <el-table
            :data="sealDetailList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%"
            border
            class="table-box"
            row-key="key"
        >
          <el-table-column :reserve-selection="true" :show-overflow-tooltip="true" type="selection" width="45"></el-table-column>
          <el-table-column label="序号" width="55" type="index"></el-table-column>


          <el-table-column v-if="cangQiLai" :show-overflow-tooltip="true" prop="applicationNum" width="140" label="申请单号"></el-table-column>
          <el-table-column v-if="cangQiLai" :show-overflow-tooltip="true" prop="subject" width="140" label="主题"></el-table-column>
          <el-table-column v-if="cangQiLai" :show-overflow-tooltip="true" prop="applicationStatus" width="100" label="状态"></el-table-column>
          <el-table-column v-if="cangQiLai" :show-overflow-tooltip="true" prop="applicationDate" width="140" label="申请时间"></el-table-column>
          <el-table-column v-if="cangQiLai" :show-overflow-tooltip="true" prop="usingManName" width="100" label="申请人"></el-table-column>


          <el-table-column :show-overflow-tooltip="true" prop="equipNum" width="140" label="设备编码"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="equipName" label="设备名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="usingManName" label="使用人"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="belongDeptText" label="使用人部门" width="110"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="installLocDesc" label="安装地点"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="locCode" width="140" label="位置编码"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="installLocDesc" label="位置描述"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="specification" width="80" label="规格型号"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="purchasePrice" width="80" label="采购价格"></el-table-column>
          <el-table-column label="报废原因" :show-overflow-tooltip="true" width="160" prop="reason"></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
              background
              layout="total,prev, pager, next,jumper"
              :page-size="10"
              @current-change="handleCurrentChange"
              :total="sealDetailList.length"
          ></el-pagination>
        </div>
      </el-collapse-item>
    </el-collapse><br />
    <el-collapse class="common-collapse common-fold" v-model="currentCollapse1">
      <el-collapse-item name="2" class="active" disabled>
                <template slot="title">
                  <div class="collapse-title">报废备注</div>
                </template>
        <el-col :span="24">
          <el-input class="mb10" v-model="formData.remark" width="100%" type="textarea" disabled></el-input>
        </el-col>
      </el-collapse-item>
      <common-history :childId="childId" v-if="DestroyIncomeStatistics == true"></common-history>

      <el-collapse-item name="3" class="active" style="margin-top: 20px" disabled>
        <template slot="title">
          <div class="collapse-title">审批意见</div>
        </template>
        <el-row v-if="!finish">
          <el-col :span="18"><div style="color:rgba(0,0,0,0)">1</div></el-col>
          <el-col :span="6" >
            <el-button :disabled="disabled" type="text" icon="el-icon-plus" @click="ideaFill('可以')">可以</el-button>
            <el-button :disabled="disabled" type="text" icon="el-icon-plus" @click="ideaFill('不可以')">不可以</el-button>
            <el-button :disabled="disabled" type="text" icon="el-icon-plus" @click="ideaFill('设备已确认')">设备已确认</el-button>
          </el-col>
        </el-row>
        <el-row v-if="!finish">
          <el-col :span="24" style="position: relative">
            <el-input v-model.trim="approvalOpinion" width="100%" type="textarea" :disabled="disabled"></el-input>
            <span style="position: absolute;right: 15px;bottom: 5px">{{currentWord}}/{{100}}</span>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <br />
<!--    <el-row v-if="!finish">-->
<!--      <el-col :span="18" class="addLook">审批意见:</el-col>-->
<!--      <el-col :span="6" :offset="0">-->
<!--        <el-button type="text" icon="el-icon-plus" @click="ideaFill('可以')">可以</el-button>-->
<!--        <el-button type="text" icon="el-icon-plus" @click="ideaFill('不可以')">不可以</el-button>-->
<!--        <el-button type="text" icon="el-icon-plus" @click="ideaFill('设备已确认')">设备已确认</el-button>-->
<!--      </el-col>-->
<!--    </el-row>-->
<!--    <el-row v-if="!finish">-->
<!--      <el-col :span="24" style="position: relative">-->
<!--        <el-input v-model.trim="approvalOpinion" width="100%" type="textarea" :disabled="disabled"></el-input>-->
<!--        <span style="position: absolute;right: 15px;bottom: 5px">{{currentWord}}/{{100}}</span>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <div class="btns" v-if="!finish">
      <el-button
          size="small"
          type="warning"
          @click="confirmSubmit(false,'是否驳回？')"
          :disabled="disabled"
      >驳回</el-button>
      <el-button
          type="primary"
          size="small"
          @click="confirmSubmit(true,'是否提交？')"
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
      tableData: [],  // 所有报废待审批数据
      multipleSelection: [],
      dialogTableVisible: false,
      currentCollapse: ["1"],
      currentCollapse1: ["1",'2','3'],
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
      sealDetailList: [],
      approveHistory: [],
      // approvalOpinion: "", //审批意见
      disabled: false, // 是否编辑页
      currentPage: 1,
      pageSize: 10,
      DestroyIncomeStatistics:true,  // 控制子页面刷新
      cangQiLai: false,  // 合流前和合流后需要的隐藏
      isCaiWuYuan: '',   // 是否为财务人员
      currentWord: 100,  // 审批中字数限制
      addComment: '',  // 不知道什么东西
    }
  },
  components: {
    commonHistory
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
  created() {
    this.childId = this.$route.query.applicationNum;
    this.taskId = this.$route.query.id;
    this.formKey = this.$route.query.formKey;
    this.finish = this.$route.query.finish == 'ok' ? true : false;
    this.getApprovalData();
  },
  methods: {
    // 获取当前登录人名下的带办的报废申请
    getHeBingList(){
      let url = 'scrap/finance/combine-apply-form/scrapApply'
      axiosGet(url,{showLoading:true}).then(result => {
        if (result.code == 200) {
          this.tableData = result.data.data;   // 基础数据信息
          this.dialogTableVisible = true;
        }else{
          this.$message.error(result.message);
        }
      });
    },

    // 合并流程发起
    setHeBingLiuCheng(){
      let url = 'scrap/finance/combine-apply-form/equipmentList'
      let arr = []
      for(var i=0;i<this.multipleSelection.length;i++){
        arr.push(this.multipleSelection[i].id)
      }
      arr.push(this.formData.id);        // 添加当前申请
      arr = Array.from(new Set(arr));    // 去重所要提交的申请集合
      let getList = {
        showLoading:true,
        ids: arr.join(',')
      }
      if(arr.length == 0){
        this.$message({
          message: '请选择要合并的流程！',
          type: 'warning'
        });
        return;
      }
      axiosPost(url,getList).then(result => {
        if (result.code == 200) {
          this.dialogTableVisible = false;
          arr = [];
          this.cangQiLai = true;
          this.$set(this.formData,'applicationNum',result.data.appplicationNum)
          this.$set(this.formData,'subject',result.data.subject)
          this.sealDetailList = result.data.data
        }else{
          arr = [];
          this.$message.error(result.message);
        }
      });
    },

    // 选中的要合并的东西
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val;
    },

    // 页面初始化
    getApprovalData() {
      let url = "process/scrap/apply-detail/" + this.$route.query.applicationNum;
      axiosGet(url).then(result => {
        if (result.code == 200) {
          this.formData = result.data.applyForm;   // 基础数据信息
          this.sealDetailList = result.data.applyForm.scrapAssetInfos;
          this.isCaiWuYuan = this.$route.query.formKey
        }
      });
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      // this.getApprovalData();
    },

    // 确认/驳回 根据value判断
    confirmSubmit(flag,text) {
      let status = flag ? "Y" : "N";
      if (status === "N" && !this.approvalOpinion) {
        this.$message.error("审批意见不能为空！");
        return;
      }
      // 全部必填信息完成
      this.$confirm(text, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if(this.cangQiLai){
            this.setHeLiuTiJiao(status)
          }else{
            this.setWeiHeLiuTiJiao(status)
          }
        })
        .catch(() => {
          this.messageTip("已取消");
        });
    },

    // 合流后的提交Or驳回
    setHeLiuTiJiao(status){
      let applicationNumId = [];  // 设备数据id
      let applicationNumArr = []; // 申请单申请编号 合流后所有  备用
      for(var i=0;i<this.sealDetailList.length;i++){
        applicationNumId.push(this.sealDetailList[i].id);
        applicationNumArr.push(this.sealDetailList[i].applicationNum);  // 申请单申请编号 合流后所有  备用
      }
      let postList = {
        remarks: this.approvalOpinion,
        currentId: this.formData.id,
        taskId: this.$route.query.id,
        flag: status,
        equipment: this.sealDetailList,
        combine: applicationNumId.join(','),
        applicationNums: applicationNumArr.join(','),   // 申请单申请编号 合流后所有  备用
        applicationNum: this.formData.applicationNum,
        showLoading: true,
        subject: this.formData.subject,
        tele: this.formData.tele,
        orgapplicationNum: this.$route.query.applicationNum,
      }
      axiosPost("scrap/finance/combine-apply-form/submit", postList).then(result => {
        if (result.code == 200 && result.data) {
          this.DestroyIncomeStatistics = false;  // 销毁审批历史组件
          this.disabled = true;
          this.$message.success("操作成功！");
          this.$nextTick(() => {         // 重新获取审批历史组件 => 做到实时刷新
            this.DestroyIncomeStatistics = true;
          });
        } else {
          this.$message.warning(result.message);
        }
        applicationNumId = [];
        applicationNumArr = []
      })
    },

    // 不合流提交Or驳回
    setWeiHeLiuTiJiao(status){
      let postList = {
        "taskId": this.$route.query.id,
        "formKey": this.$route.query.formKey,
        "applicationNum": this.$route.query.applicationNum,
        "circulationConditions": status,   // status 是提交还是驳回 N => 驳回  Y => 通过
        localVariablesParam: {              // 审批意见
          approvalOpinion: this.approvalOpinion
        },
        "groupTask":"false",
        "showLoading": true
      }
      axiosPost("process/scrap/passOrReject", postList).then(result => {
        if (result.code == 200 && result.data) {
          this.DestroyIncomeStatistics = false;  // 销毁审批历史组件
          this.disabled = true;
          this.$message.success("操作成功！");
          this.$nextTick(() => {         // 重新获取审批历史组件 => 做到实时刷新
            this.DestroyIncomeStatistics = true;
          });
        } else {
          this.$message.warning(result.message);
        }
      })
    },

    // 审批意见填充
    ideaFill(val) {
      this.approvalOpinion+= val;
    }
  }
};
</script>

