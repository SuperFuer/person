<style lang="scss" scoped>
.bmj-apply {
  /deep/ .el-form-item__label {
    width: 107px;
  }
  .sb-el-tree {
    height: 415px;
    overflow: auto;
  }
  .borrow-title {
    display: flex;
    justify-content: space-between;
    span {
      width: 40%;
    }
    span:first-child {
      width: 20%;
    }
  }

  .row-list {
    padding: 0 10px;
    .el-table th {
      border-bottom: none;
      padding: 6px 0;
      background: #fff;
    }
    .el-table td {
      border-bottom: none;
      padding: 7px 0;
    }
  }
  .pagination {
    margin-left: -15%;
  }
  .btns {
    padding: 20px 0;
    margin: 0;
  }
  .el-dialog {
    margin: 0 auto 20px;
  }
  .common-fold .el-input {
    font-size: 12px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 123px;
  }
  .el-date-editor.el-input.is-disabled .el-input__inner {
    width: 130px;
  }
  .el-input__icon {
    line-height: auto;
  }
  /deep/ .el-date-editor.el-input .el-input__prefix {
    right: 5px;
  }
}
</style>
<template>
  <div class="bmj-apply common-table">
    <div class="form-title">
      <i class="icon"></i>实物资产归还申请（各部门）
    </div>
    <el-form ref="ruleForm" :model="formData" :inline="true" :rules="rules" style="width:99%">
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
          <el-form-item label="申请时间" prop="applicationDate">
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
        <div class="pb20">
          <el-button @click="addData" type="primary" size="small" :disabled="callFlag || addFlag">新 增</el-button>
          <el-button type="danger" size="small" @click="delList" :disabled="callFlag">删 除</el-button>
        </div>
        <el-table :data="tableDataList"
          tooltip-effect="dark" border row-key="key" @selection-change="selectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="序号" type="index" width="60"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="equipNum" label="设备编码"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="equipName" label="设备名称"></el-table-column>
          <el-table-column prop="usingManName" label="使用人"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="usingDeptName" label="所属部门"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="moduleName" label="所属模块"></el-table-column>
          <el-table-column show-overflow-tooltip prop="borrowDeptName" label="借用部门"></el-table-column>
          <el-table-column show-overflow-tooltip prop="borrowManName" label="借用人"></el-table-column>
          <el-table-column prop="borrowDate" label="借用日期"></el-table-column>
          <el-table-column prop="returnDate" label="归还日期" width="140">
            <template slot-scope="scope">
              <el-date-picker :clearable="false" :disabled="callFlag" v-model="scope.row.returnDate" type="date" placeholder="选择日期"></el-date-picker>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="common-pagination">
          <el-pagination @current-change="handleCurrentChange"  :current-page="currentPage" :page-size="pageSize"  background
            layout="total, prev, pager, next, jumper" :total="tableData.length">
          </el-pagination>
          <div class="have-choice">已选择：{{selectedEquip.length}}</div>
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-row>
      <el-col :span="24"><div class="query-title mt20">添加备注</div></el-col>
      <el-col :span="24">
        <el-input class="mb10" v-model.trim="remark" resize="none" maxlength="100" show-word-limit type="textarea" :disabled="callFlag"></el-input>
      </el-col>
    </el-row>

    <div v-if="isHistory">
      <common-history ref="commonHistory" :childId="childId"></common-history>
    </div>

    <div class="btns" v-show="!isHistory">
      <el-button  @click="subOrClose('ruleForm',false)" size="small" class="save-btn" :disabled="callFlag" >保存</el-button>
      <el-button @click="subOrClose('ruleForm',true)" size="small" class="submit-btn" :disabled="callFlag" >提交</el-button>
    </div>
    <div class="btns" v-show="isTodo">
      <el-button @click="subOrCancel('ruleForm',false)" size="small" type="danger" :disabled="callFlag" >撤回</el-button>
      <el-button @click="subOrCancel('ruleForm',true)" size="small" class="submit-btn" :disabled="callFlag" >提交</el-button>
    </div>
    <!--新增弹窗-->
    <el-dialog title="添加设备" top="2vh" width="80%" :visible.sync="dialogQuery">
      <div class="bmjquery common-table">
        <!-- <div class="form-title"><i class="icon"></i>查询可借用设备明细</div> -->
        <!-- 查询条件 -->
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="设备名称" label-width="107px">
            <el-input v-model="formInline.eqName"></el-input>
            <el-button class="ml10" type="primary" @click="getEquipData()" icon="el-icon-search" size="small">查 询</el-button>
            <el-button type="primary" @click="reset" icon="el-icon-search" size="small">重 置</el-button>
          </el-form-item>
        </el-form>
        <div class="query-title">已借用设备明细</div>
        <!-- 表格 -->
        <el-table ref="queryTable" :data="tableDataEquip" max-height="280" border tooltip-effect="dark" :row-key="getRowKeys" @selection-change="handleChange">
          <el-table-column type="selection" :reserve-selection="true" width="55" :selectable="checkSelectable"></el-table-column>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="equipNum" label="设备编码"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="equipName" label="设备名称"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="installLocDesc" label="安装地点"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="usingManName" label="使用人"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="usingDeptName" label="所属部门"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="moduleName" label="所属模块"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="borrowDeptName" label="借用部门"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="borrowManName" label="借用人"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="borrowDate" label="借用日期"></el-table-column>
        </el-table>
        <div>已选择：{{selectedNum}}</div>
        <!-- 分页 -->
        <div class="pagination">
          <el-pagination  @current-change="handleCurrentEquipChange" :current-page="currentPageE" :page-size="pageSizeE" background
            layout="total, prev, pager, next, jumper" :total="totalCountE">
          </el-pagination>
        </div>
        <div slot="footer" class="btns">
          <el-button type="primary" @click="applyEquipConfirm()" size="small">添加</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { axiosPost, axiosGet, constApi } from "@/api/index.js"
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
      callFlag: false, // 提交之后 所有按钮不可点
      addFlag: false, // 新增 （新增和导入互斥）
      today: new Date(),
      selectedNum: 0,
      formData: {
        flag: '',
        applicationNum: '',
        applicationStatus: '',
        applicationDate: '',
        subject: '',
        applicantName: '',
        applicantPhone: '',
        dept: '',
        deptName: ''
      },
      getRowKeys(row) {
        return row.equipNum;
      },
      tableData: [],
      isHistory: false,
      isTodo: false,
      flag: false, // 是否是管理员 true是 false否
      selectedEquip: [],
      remark: '',
      submitSuccessId: "",
      // totalCount: 0,
      pageSize: 10,
      currentPage: 1,
      childId: '',
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
      },
      /***设备弹窗**/
      dialogQuery: false,
      formInline: { // 搜索内容
        eqName: ''
      },
      selectedRows: [],
      tableDataEquip: [],
      currentPageE: 1,
      pageSizeE: 5,
      totalCountE: 0
    };
  },
  computed: {
     // 数据分页
    tableDataList () {
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
  },
  created() {
    let formkey = this.$route.query.formKey;
    // 如果有参数 说明是从草稿或历史进来 历史 history 禁用 草稿 draft 申请页
    if (this.paramList && this.paramList.type == 'history') {
      this.childId = this.$route.query.applicationNum;
      this.isHistory = true;
      this.callFlag = true;
      this.getSaveData();
    } else if (this.paramList && this.paramList.type == 'draft') {
      this.isHistory = false;
      this.getSaveData();
    } else if (formkey && formkey == 'formkey_1') { // 驳回的数据从待办进来
      this.childId = this.$route.query.applicationNum;
      this.isHistory = true;
      this.isTodo = true;
      this.getSaveData();
    }  else {
      this.getInitData();
    }

    // 使用人
    let user = JSON.parse(localStorage.getItem('user'))

  },
  methods: {

    //申请初始化数据
    getInitData() {
      var _this = this;
      const loading = this.$loading({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axiosGet("process/returnProcessForm/init-form?processId=14320").then(result => {
        if (result.code == 200) {
          loading.close();
          let resultData = result.data
          _this.formData = resultData
          _this.formData.dept = resultData.dept
        }
      });
    },

    // 已借用状态不可选 禁用 (1-不可借用，2-可借用，3-已借出，4-流转中)
    checkSelectable (row, index) {
      if(row.status === 3) {
        return true
      } else {
        return false
      }
    },
    // 表格删除
    delList () {
      if (this.selectedEquip.length > 0) {
        // this.$confirm('确定删除选中项？', '提示', {
        //   confirmButtonText: '确定？',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
          this.selectedEquip.forEach(item => {
            this.tableData.forEach((val, index) => {
              if (item === val.equipNum) {
                this.tableData.splice(index, 1);
              }
            })
          })
        // })     
      } else {
        this.$message.warning('请勾选要删除的设备！')
      }

    },
    // 新增
    addData() {
      this.dialogQuery = true;
      this.$nextTick(() => {
        this.$refs.queryTable.clearSelection();
      })
    },

    // 勾选的表格
    selectionChange(rows) {
      this.selectedEquip = [];
      rows.forEach(item => {
        this.selectedEquip.push(item.equipNum)
      })
    },
    // 分页
    handleCurrentChange(val) {
      this.currentPage = val
    },

    // 提交保存确认
    subOrClose(ruleForm, flag) {
      let tips = flag ? '提交' : '保存';
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          // 设备信息必填
          if (!this.tableData.length) {
            this.$message.warning('请选择归还设备信息！');
            return;
          }
          //归还日期
          if (flag) {
            for(let i = 0; i < this.tableData.length; i++) {
              let item = this.tableData[i];
              if (!item.returnDate) {
                this.$alert(`借用信息第${i + 1}行归还日期不能为空`, '提示')
                return;
              }
            }            
          }

          this.$confirm(`确定要${tips}吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.submitForm(ruleForm, flag);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
  
    },
    // 提交表单
    submitForm(ruleForm, flag) {
      var _this = this;
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
          flag: flag,
          applicationNum: _this.formData.applicationNum || '',
          id: _this.submitSuccessId,
          returnProcessForm: {
            applicationDate: _this.formData.applicationDate,
            subject: _this.formData.subject,
            applicant: user.id,
            applicantName: _this.formData.applicantName,
            applicantPhone: _this.formData.email,
            remark: _this.remark
          },
          returnProcessFormAssetList: _this.tableData
        }
 
       axiosPost("process/returnProcessForm/submit", params).then(result => {
        if (result.code === 200) {
          this.$message.success("操作成功！");
          if (flag) _this.callFlag = true;
          _this.submitSuccessId = result.data.id;
          _this.$set(_this.formData, "applicationNum", result.data.applicationNum);
          _this.$set(_this.formData, "applicationStatus", result.data.applicationStatus);
        } else {
          this.$message.warning(result.message);
        }
      })
    },
    subOrCancel(ruleForm, flag) { // 提交或者撤回
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          if (flag) { // 提交才校验
            if (!this.tableData.length) {
              this.$message.warning('请选择设备信息！');
              return;
            }
            for(let i = 0; i < this.tableData.length; i++) {
              let item = this.tableData[i];
              if (!item.borrowDate) {
                this.$alert(`实物资产信息第${i + 1}行借用日期不能为空`, '提示')
                return;
              }
            }
          }

          let tips = flag ? '提交' : '撤回';
          this.$confirm(`确定要${tips}吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            if (flag) { // 如果是撤回
              this.reSubmit(ruleForm, flag);
            } else {
              this.cancelSubmit(ruleForm, flag);
            }
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    reSubmit(ruleForm, flag) {
      var _this = this;
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
          taskId: this.$route.query.id,
          returnProcessForm: {
            applicationDate: _this.formData.applicationDate,
            subject: _this.formData.subject,
            applicant: user.id,
            id: _this.submitSuccessId,
            applicantName: _this.formData.applicantName,
            applicantPhone: _this.formData.email,
            applicationNum: _this.formData.applicationNum || '',
            remark: _this.remark
          },
          returnProcessFormAssetList: _this.tableData
        }
 
       axiosPost("process/returnProcessForm/resubmit", params).then(result => {
        if (result.code === 200) {
          this.$message.success("操作成功！");
          if (flag) _this.callFlag = true;
          this.$refs.commonHistory.getApprovalHistory();
          _this.submitSuccessId = result.data.id;
          _this.$set(_this.formData, "applicationNum", result.data.applicationNum);
          _this.$set(_this.formData, "applicationStatus", result.data.applicationStatus);
        } else {
          this.$message.warning(result.message);
        }
      })
    },
    // 撤回
    cancelSubmit() {
      var _this = this;
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
          processInstanceId: this.$route.query.instanceId,
          deleteReason: '',
          id: _this.submitSuccessId,
          applicationNum: _this.formData.applicationNum,
        }
 
       axiosPost("process/returnProcessForm/closeProcess", params).then(result => {
        if (result.code === 200) {
          _this.$message.success("操作成功！");
          _this.$router.push({path: 'needdealt'})
          _this.callFlag = true;

        } else {
          _this.$message.warning(result.message);
        }
      })
    },
    //获取查询设备数据
    getEquipData() {
      axiosGet('process/borrowReturn/list?flag=true&current=' + this.currentPageE + '&size=' + this.pageSizeE + '&equipName=' + this.formInline.eqName + '&status=3').then(result => {
        if (result.code == 200) {
          this.tableDataEquip = result.data.records;
          this.totalCountE = result.data.total
        } else {
          this.$message.error(result.message)
        }
      })
    },
    //获取借用人
    getCheckedUser() {
      this.tableData[this.borrowIndex].borrowMan = this.selectedUser.usrId;
      this.tableData[this.borrowIndex].borrowManName = this.selectedUser.name;
      this.dialogBorrower = false;
    },
    showUserDialog(index) {
      this.borrowIndex = index;
      this.dialogBorrower = true;
    },
    // 确定 
    applyEquipConfirm() {
      this.dialogQuery = false;
      // 从草稿进来则需要累加
      this.selectedRows.forEach(item => {
        this.tableData.push(item);
      })
      // 去重
      var hash ={};
      this.tableData = this.tableData.reduce((item, next) => {
        hash[next.equipNum] ? '' : hash[next.equipNum] = true && item.push(next)
        return item;
      }, [])
      
      this.tableData.forEach(item => {
        item.borrowDept = this.formData.dept;
        item.borrowDeptName = this.formData.deptName;
        item.returnDate = this.today;
      })
    },
    currentChange(row, oldRow) {
      this.selectedUser = row;
      this.radio = row.usrId;
    },
    // 重置
    reset () {
      this.formInline.eqName = ''
    },
    // 勾选的表格
    handleChange(rows) {
      this.selectedRows = [];
      if (rows) {
        this.selectedRows = JSON.parse(JSON.stringify(rows));
      }
      this.selectedNum = this.selectedRows.length;
    },
    handleCurrentEquipChange(val) {
      this.currentPageE = val;
      this.getEquipData();
    },

    //保存后初始数据
    getSaveData() {
      var _this = this;
      const loading = this.$loading({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      _this.taskId = _this.$route.query.applicationNum
      axiosGet("process/returnProcessForm/getApproval?applicationNum=" + _this.taskId).then(result => {
        if (result.code == 200) {
          _this.submitSuccessId = result.data.returnProcessForm.id;
          _this.formData = result.data.returnProcessForm;
          _this.tableData = result.data.borrowEquipInfoList;
          _this.remark = result.data.returnProcessForm.remark;
        }
        loading.close();
      })
    }
  }
};
</script>

