<style lang="scss" scoped>
.inv-apply {
  .btns {
    padding-bottom: 20px;
  }
}
</style>
<template>
  <div class="inv-apply common-table">
    <div class="form-title">
      <i class="icon"></i>发起盘点申请流程
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
            <el-input v-model.trim="formData.subject" :disabled="callFlag || isHistory"></el-input>
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

    <div v-if="isHistory || isTodo">
      <common-history ref="commonHistory" :childId="childId"></common-history>
    </div>

    <div class="btns" v-show="!isHistory">
      <el-button @click="onSubmit('ruleForm')" size="small" class="submit-btn" :disabled="callFlag" >提交</el-button>
    </div>
    <div class="btns" v-show="isTodo">
      <el-button @click="cancelSubmit('ruleForm',false)" size="small" type="danger" :disabled="callFlag" >撤回</el-button>
      <el-button @click="reSubmit('ruleForm',true)" size="small" class="submit-btn" :disabled="callFlag" >提交</el-button>
    </div>

  </div>
</template>
<script>
import { inventoryInitForm,  iInventoryResult, inventorySubmit, getApproval, resubmit, closeProcess } from "@/api/swInventory.js"
import commonHistory from "@/components/commonHistory"
export default {
  props: {
    paramList: {
      type: Object
    },
    managementId: {
      type: String
    }
  },
  components: {
    commonHistory
  },
  data() {
    return {
      callFlag: false,
      childId: '',
      isTodo: false,
      isHistory: false,
      formData: {
        id: '',
        applicationNum: '',
        applicationStatus: '',
        applicationDate: '',
        subject: '',
        applicantName: '',
        applicantPhone: ''
      },
      tableData: [],
      currentCollapse: ["1"],
      approveHistory: [],
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
    // this.managementId = this.$route.query.managementId;
    let formkey = this.$route.query.formKey || '';
    if (this.paramList) { //从历史或者待办（驳回）
      this.childId = this.paramList.applicationNum;
      let type = this.paramList.type;
      if (type === 'history') { // 从历史进来
        this.isHistory = true
      } else if (formkey == 'formkey_1') { // 从待办
        this.isTodo = true;
        this.isHistory = true;
      } else { 
        console.log('后端参数未知错误');
      }
      this.getSaveData();
    }else { // 申请页
      this.getInitForm();
      this.getInventoryInfo();
    }
  },
  methods: {
    //初始化数据
    getInitForm() {
      let params = {
        processId: 13402
      }
      inventoryInitForm(params).then(res => {
        if(res.code === 200) {
          this.formData = res.data;
        } else {
          this.$message.warning(res.message);
        }
      })
    },
    //获取表格数据
    getInventoryInfo() {
      let params = {
        managementId: this.managementId
      }     
      iInventoryResult(params).then(res => {
        if(res.code === 200) {
          this.tableData.splice(0, 0, res.data);
        } else {
          this.$message.warning(res.message);
        }
      })
    },
    //提交
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$confirm(`确定要提交吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let params = this.formData;
            params.managementId = this.managementId
            inventorySubmit(params).then(res => {
              if(res.code === 200) {
                this.callFlag = true;
                this.formData.applicationNum = res.data.applicationNum;
                this.formData.applicationStatus = res.data.applicationStatus;
                this.$message.success('提交成功！');
              } else {
                this.$message.warning(res.message);
              }
            }) 
          }) 
        } else {
          console.log('error submit!!');
          return false;
        }
      })    
    },
    //重新提交
    reSubmit(ruleForm) {
      var _this = this;
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$confirm(`确定要提交吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let user = JSON.parse(localStorage.getItem('user'))
            let params = {
              taskId: this.$route.query.id,
              id: _this.formData.id,
              subject: _this.formData.subject
            }

            resubmit(params).then(res => {
              if(res.code === 200) {
                this.callFlag = true;
                this.$refs.commonHistory.getApprovalHistory();
                this.$message.success('提交成功！');
              } else {
                this.$message.warning(res.message);
              }
            }) 

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 撤回
    cancelSubmit() {
      var _this = this;
      this.$confirm(`确定要撤回吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let user = JSON.parse(localStorage.getItem('user'))
        let params = {
            processInstanceId: _this.$route.query.instanceId,
            deleteReason: _this.applyReason,
            id: _this.formData.id
          }
 
        closeProcess(params).then(res => {
          if(res.code === 200) {
            _this.$message.success("操作成功！");
            _this.$router.push({path: 'needdealt'})
            _this.callFlag = true;
          } else {
            this.$message.warning(res.message);
          }
        }) 
      })
    },
    //获取初始化
    getSaveData() {
      let params = {
        applicationNum: this.paramList.applicationNum
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

