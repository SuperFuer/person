<style lang="scss" scoped>
.sb-alloc {
  .sb-el-tree {
    min-width: 300px;
    height: 445px;
    overflow: auto;
  }
  .collapse-title {
    flex: 1 0 90%;
    order: 1;
  }
  .el-collapse-item__arrow {
    flex: 1 0 auto;
    order: -1;
  }
  .el-input__inner {
    width: 180px !important;
  }
  .el-collapse-item.is-disabled .el-collapse-item__header {
    color: #333;
  }
  .el-date-editor.el-input {
    width: 180px;
  }
  .el-collapse-item__header {
    background: #eff2f9;
    padding-left: 8px;
    height: 30px;
    line-height: 30px;
  }




  .el-pagination__editor.el-input .el-input__inner {
    width: 40px !important;
  }

  .btn-group {
    display: block;
    text-align: center;
    margin-top: 20px;
  }


  .el-input__icon {
    height: 30px;
    line-height: 30px !important;
  }

  .primary-btn.el-button {
    background: #3a8eff;
    color: #fff;
    border-color: #fff !important;
  }
  .download.el-button,
  .submit-btn.el-button {
    background: #004ea2;
    color: #fff;
  }
  .upload-btn.el-button {
    background: #df8715;
    color: #fff;
    outline: none;
    border-color: #fff !important;
    margin-left: 20px;
  }
  .save-btn.el-button {
    background: #2fce6a;
    color: #fff;
  }
  .template-upload {
    height: 32px;
    margin-left: 18px;
  }
  // 折叠面板
  .pagination {
    text-align: center;
    margin: 10px 0 10px;
  }

  .download.el-button {
    background: #004ea2;
    color: #fff;
  }
  .upload-btn.el-button {
    background: #df8715;
    color: #fff;
    outline: none;
    border-color: #fff !important;
  }
  .word-title {
    margin-top: 40px;
    margin-bottom: 20px;
    font-weight: 600;
  }
  .impor-file {
    margin-right: 20px;
    .el-input__inner {
      width: 298px !important;
    }
    .el-form--inline .el-form-item__content {
      width: 298px;
    }
  }
  .el-tree__empty-text {
    left: 0;
    top: 0;
    transform: translate(0, 0);
    color: #606266;
  }
  .el-table--fit {
    border: 1px solid #fff;
    width: 100%;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 0;
  }
  .import-file {
    border-bottom: 1px solid #aaa;
    padding-left: 7px;
    height: 30px;
    position: relative;
    .empty-des {
      padding-top: 40px;
      color: #666;
      text-align: center;
      > div:first-child {
        font-size: 20px;
      }
    }
    .file-header {
      position: absolute;
      left: 0;
      top: 0;
    }

    .el-upload {
      width: 100%;
    }
    .el-form-item {
      width: 100%;
      position: relative;
    }
    .el-form-item__label {
      width: 98%;
      text-align: left;
    }
    .el-form-item__content {
      position: none;
      width: 100%;
    }

    .el-icon-plus {
      position: absolute;
      right: 0;
      top: 8px;
    }
    .el-upload-dragger {
      width: 100%;
      border-color: transparent;
    }
  }
}
</style>
<template>
  <div class="sb-alloc">
    <div class="form-title">
      <i class="icon"></i>实物资产部门间调拨申请
    </div>
    <el-form ref="ruleForm" :model="formData" :inline="true" :rules="rules" style="width:99%">
      <el-row class="common-row">
        <el-col :span="8">
          <el-form-item label="申请编号" label-width="107px" prop="applicationNum">
            <el-input v-model="formData.applicationNum" disabled></el-input>
            <!-- <span>{{formData.processId}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" label-width="107px" prop="applicationStatus">
            <el-input v-model="formData.applicationStatus" disabled></el-input>
            <!-- <span>{{formData.status}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间" label-width="107px" prop="applicationDate">
            <el-input v-model="formData.applicationDate" disabled></el-input>
            <!-- <span>{{formData.applyDate}}</span> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="主题" label-width="107px" prop="subject">
            <el-input v-model="formData.subject" :disabled="callFlag" clearable style="width: 202px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人" label-width="107px" prop="applicant">
            <el-input v-model="formData.applicantName" disabled></el-input>
            <!-- <span>{{formData.applyUser}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" label-width="107px" prop="email">
            <el-input v-model="formData.email" disabled></el-input>
            <!-- <span>{{formData.telephone}}</span> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="调入部门" label-width="107px" prop="deptName">
        <el-input ref="deptIpt" v-model="formData.deptName" :disabled="callFlag" @focus="dialogParticipation=true"></el-input>
      </el-form-item>
      <el-collapse class="common-collapse" v-model="currentCollapse">
        <el-collapse-item name="1" class="active">
          <template slot="title">
            <div class="collapse-title">实物资产信息</div>
          </template>
          <div class="operate-btns mb10">
            <el-button size="small" type="primary" :disabled="mutual=='import' || callFlag" @click="addTable">新增</el-button>
            <el-button size="small" type="danger" :disabled="callFlag" @click="deleteTable">删除</el-button>
          </div>
          <!--tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)-->
          <el-table
            :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            style="width: 100%"
            @selection-change="changeTable"
            class="table-box"
            row-key="key"
            v-loading="loading"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="序号" type="index" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="assetNum" label="资产编码" width="120"></el-table-column> -->
            <el-table-column prop="equipNum" label="设备编码" width="160"></el-table-column>
            <el-table-column prop="equipName" label="设备名称" width="160"></el-table-column>
            <el-table-column prop="installLocDesc" label="原安装地点" width="160"></el-table-column>
            <el-table-column prop="usingMan" label="原使用人"></el-table-column>
            <el-table-column prop="usingDept" label="调出部门" width="150"></el-table-column>

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
        <el-collapse-item name="2" class="active">
          <template slot="title">
            <div class="collapse-title">批量导入</div>
          </template>
          <el-row>
            <el-col>
              <!-- :action="importTemplateUrl" -->
              <el-form-item label="选择文件" prop="file" class="select-file">
                <el-upload
                  ref="template"
                  class="upload-file"
                  :before-upload="beforeTemplateUpload"
                  :action="importTemplateUrl"
                  :on-preview="handleTemplatePreview"
                  :on-remove="handleTemplateRemove"
                  :before-remove="templatebeforeRemove"
                  :file-list="formData.file"
                  :on-success="templateImportSuccess"
                  :on-error="templateImportError"
                  :limit="1"
                  :on-exceed="handleTemplateExceed"
                  :headers="headers"
                  accept=".xlsx,.xls"
                  :disabled="callFlag"
                  :auto-upload="false"
                >
                  <el-button
                    :disabled="mutual=='add' || callFlag"
                    slot="trigger"
                    size="small"
                    height="28px"
                    class="primary-btn"
                    @click="getTemplate"
                  >浏览</el-button>
                  <el-button
                    size="small"
                    height="28px"
                    class="primary-btn template-upload"
                    @click="submitTemplateUpload"
                    :disabled="mutual=='add' || callFlag"
                  >导入</el-button>
                </el-upload>
              </el-form-item>
              <el-button
                size="small"
                @click="dialogVisible=true"
                :disabled="callFlag"
                class="download"
              >下载模板</el-button>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-form-item class="btn-group" v-if="draftList==true">
        <el-button
          @click="subOrClose('ruleForm',false,'是否保存？')"
          size="small"
          class="save-btn"
          :disabled="callFlag"
        >保存</el-button>
        <el-button
          @click="subOrClose('ruleForm',true,'是否提交？')"
          size="small"
          class="submit-btn"
          :disabled="callFlag"
        >提交</el-button>
      </el-form-item>
    </el-form>

    <div v-if="!draftList" style="margin:20px 0 10px;">审批历史</div>
    <el-table
        :data="approveHistory"
        tooltip-effect="dark"
        style="width: 100%"
        class="history"
        v-if="!draftList"
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
      <el-table-column prop="endTime" label="操作时间" show-overflow-tooltip></el-table-column>
      <el-table-column label="审批意见" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion}}</span>
        </template>
      </el-table-column>
    </el-table>



    <!-- 模板下载 -->
    <el-dialog
      title="模板"
      :visible.sync="dialogVisible"
      width="30%"
      @close="getClickedTemplate('cancel')"
    >
      <div class="template-list">
        <el-row>
          <el-radio-group v-model="checkedtemplates" @change="handleCheckedTemplates">
            <el-col
              :span="24"
              v-for="(item,index) in templateList"
              :key="index"
              style="margin-bottom:15px;"
            >
              <el-radio :label="item.url">{{item.name}}</el-radio>
            </el-col>
          </el-radio-group>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="getClickedTemplate('cancel')" size="small">取 消</el-button>
        <el-button @click="getClickedTemplate('selected')" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 参与人员popup    show-checkbox -->
    <el-dialog
      top="4vh"
      title="选择部门"
      width= "50%"
      :visible.sync="dialogParticipation"
    >
      <el-row>
        <el-col :span="12"><b>部门架构</b></el-col>
        <el-col :span="12" class="pl10"><b>当前选中部门</b></el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="sb-el-tree">
          <el-tree
            :data="participantList"
            :default-expand-all="defaultExpandAll"
            :default-expanded-keys="[2]"
            highlight-current
            node-key="id"
            :props="defaultProps"
            ref="tree"
            @node-click="handleNodeClick"
          ></el-tree>
        </el-col>
        <el-col :span="12">
          <div class="pl10">&emsp;{{currentDepartment.name}}</div>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogParticipation=false">取 消</el-button>
        <el-button type="primary" @click="getCheckedDept()" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getTime } from "../../../../common/until";
import { axiosPost, axiosGet, constApi } from "@/api/index.js";
export default {
  props: {
    paramList: {
      type: Object
    }
  },
  data() {
    return {
      approveHistory:[],  // 审批历史数据
      formData: {
        applicationNum: "", //申请编号
        applicationStatus: "",
        applicationDate: "",
        subject: "",
        applicant: "",
        applicantName: "",
        email: "",
        deptNum: "",
        deptName: "",
        flag: false
      },
      rules: {
        subject: {
          required: true,
          message: "主题不能为空",
          trigger: "blur"
        },
        deptName: {
          required: true,
          message: "调入部门不能为空",
          trigger: "focus"
        }
      },
      participantList: [],
      defaultExpandAll: true, // 默认展开所有节点
      defaultProps: {
        children: "children",
        label: "name"
      },
      dialogParticipation: false, //调入部门弹窗
      currentDepartment: {},
      tableData: [],
      selection: [],
      checkedtemplates: [],
      dialogVisible: false,
      templateList: [],
      callFlag: false, //提交之后 所有按钮不可点
      currentCollapse: ["1", "2"],
      headers: {
        token: localStorage.getItem("token")
      },


      submitFlag: true,
      constApi: constApi,
      importTemplateUrl: constApi + "/exdept/import",
      importFileUrl: constApi + "/common/file/upload",
      fileRefIds: [],
      defaultJoinId: [],
      joinUser: [],
      submitTemplate: [],
      mainTemplatecachedId: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      purchaseOrder: [],
      loading: false,
      draftList: false,
      userData: [],
      selectedUser: [], //当前选中的
      prevSelectedUser: [], //记录上次选中的
      numPrevCode: 0, //记录是不是第一次点击
      allSelectedUser: [], //
      MarkCurrentFlag: true,
      cancelSelectedUser: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageCount: 5,
      deptNum: 0,
      saveId: '',
      applicationNum: '',
      allotDept: '',
      mutual: '' // 是否互斥
    };
  },

  created() {
    var _this = this;
    // 从历史 草稿 历史记录不可操作 parmas
    console.log(this.paramList);
    if (_this.paramList.type == "draft") {
      this.draftList = true;
      console.log("草稿");
      // 草稿
    } else {
      // 历史
      console.log("历史");
      this.callFlag = true;
      this.draftList = false;
    };

    // if (this.$route.query.equipNum) {
      // let arr = this.$route.query.equipNum.split(',')
      // 新增协带参数请求数据
      // let params = {"equipNum":[],"usingMan":["王淑洁"],"flag":"true","deptNum":"C00","equipName":""};
      // let params = {
      //   equipNum: arr,
      //   usingMan: this.$route.query.usingMan,
      //   flag: this.formData.flag,
      //   deptNum: this.$route.query.deptNum,
      //   equipName: this.$route.query.equipName
      // };
      // axiosPost("process/changeProcess/getEquip", params
      // ).then(result => {
      //   if (result.code == 200) {
      //     this.tableData = result.data.slice(0,2)
      //   }
      // })
    // }

    this.getInitData();
    this.getDeptTree();
    this.getTemplateData(); // 获取所有模板地址
  },
  methods: {
    // get审批历史
    // get审批历史
    getShenPi(id) {
      let params = {
        "id": id
      }
      axiosPost("approval/history", params).then(result => {
        console.log(result)
        if (result.code === 200) {
          this.approveHistory = result.data;
        } else {

        }
      });
    },

    //初始化数据
    getInitData() {
      const loading = this.$loading({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axiosGet("exdept/init-form").then(result => { // 调拨初始化 /exdept/transfer/init-form
        if (result.code == 200) {
          console.log(result.data)
          this.formData = result.data;
          // this.getShenPi()
          if (this.allotDept.deptName) {
            this.formData.deptName = this.allotDept.deptName;
            this.formData.deptNum = this.allotDept.deptNum;
            this.formData.subject = this.allotDept.subject;
          }
          loading.close();
        }
      });
    },
    //获取模板
    getTemplateData(){
      axiosGet("common/file/template-oex/list").then(result => {
        if (result.code == 200) {
          // console.log("获取所有模板__________________");
          this.templateList = result.data;
        }
      });
    },
    //获取部门树结构
    getDeptTree() {
      axiosGet("base/dept/tree").then(result => {
        if (result.code == 200) {
          this.participantList = result.data;
        }
      });
    },
    //点击最左侧树结构
    handleNodeClick(data) {
      this.currentDepartment ={
        name: data.name,
        deptNum: data.deptNum
      }
    },
    // 部门选择确定
    getCheckedDept() {
      this.formData.deptNum = this.currentDepartment.deptNum;
      this.formData.deptName = this.currentDepartment.name;
      this.dialogParticipation = false;
      // localStorage.setItem('deptName', this.formData.deptName);
      // localStorage.setItem('deptNum', this.formData.deptNum);
    },
    changeTable(selection) {
      this.selection = selection;
    },
    deleteTable() {
      console.log(this.selection);
      if (!this.selection.length) {
        this.$message.warning('请选择删除项！');
        return;
      }
      this.$confirm('确认删除选中项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.tableData.forEach((item) => {
          this.selection.forEach((val) => {
            if (item.equipNum === val.equipNum) {
              this.tableData.splice(item, 1)
            }
          })
        })
        localStorage.setItem("equipList", JSON.stringify(this.tableData));
        this.$message.success('删除成功!');
      }).catch(()=>{})
    },
    addTable() {
      localStorage.setItem('allotDept', JSON.stringify(this.formData));
      this.mutual = 'add';
      this.$router.push({
        path:'allotEquipQuery',
        query: {
          usingMan: this.formData.applicant,
          isAdmin: this.formData.flag,
          usingManName: this.formData.applicantName,
        }
      });
    },
    // 选择单个模板进行下载
    getClickedTemplate(value) {
      var _this = this;
      if (value == "selected") {
        _this.submitTemplate = _this.checkedtemplates;
        axiosGet(_this.submitTemplate).then(result => {
          if (result.code == 200) {
            window.location.href = _this.constApi + result.data;
          }
        });
      } else {
        _this.checkedtemplates = _this.submitTemplate;
      }
      _this.dialogVisible = false;
    },
    // 选择模板
    handleCheckedTemplates(value) {
      var _this = this;
      _this.checkedtemplates = value;
      // console.log(_this.checkedtemplates);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    handleTemplatePreview(file) {
      // console.log("点击文件列表中已上传的文件时的钩子");
    },

    /***********分割线*************/
    submitTemplateUpload() {
      this.$refs.template.submit();
      this.tableData = [];
    },
    // 上传模板之前
    beforeTemplateUpload(file) {
      // console.log("beforeUpload");
      this.tableData = [];
    },
    // 导入模板成功
    templateImportSuccess(response, file, filelist) {
      var _this = this;
      // console.log("导入模板成功______________________");
      // console.log(response);
      if (response.code === 200) {
        _this.formData.file = filelist;
        _this.mainTemplatecachedId = response.data.cacheId;
        _this.tableData = response.data;
        this.$refs.ruleForm.clearValidate("file");
      } else if(response.code== 500) {
        this.$alert(response.data[0], "错误", {
          confirmButtonText: "确定",
          callback: action => {}
        });
      }else{

      }
    },
    templateImportError(response, file, filelist) {
      this.$message.error(`导入失败`);
    },
    templateLoding() {
      this.loading = false;
    },
    templatebeforeRemove(file, fileList) {
      var _this = this;
      return this.$confirm(`确定移除 ${file.name}？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
    },
    handleTemplateRemove(file, fileList) {
      this.tableData = [];
    },
    handleTemplateExceed(files, fileList) {
      this.$refs.template.clearFiles();
    },

    getTemplate() {
      this.mutual = "import";
      this.$refs.template.clearFiles();
      // this.tableData = [];
    },
    /**
     * 提交表单
     */
    submitForm(ruleForm, flag) {
      var _this = this;
      // this.formData.file.length > 0
      //   ? this.$refs.ruleForm.clearValidate("file")
      //   : "";
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.formData.inDeptId = _this.formData.deptNum;
          let params = {
            flag: flag,
            deptTransferApplyForm: _this.formData,
            deptTransferAssetInfos: _this.tableData,
            id: _this.saveId,
            applicationNum: _this.applicationNum,
          };
          axiosPost("/exdept/submit", params ).then(result => {
            if (result.code === 200) {
              _this.formData.applicationNum = result.data.applicationNum;
              _this.formData.applicationStatus = result.data.applicationStatus;
              _this.$message.success('保存成功');
              if (flag) {
                _this.callFlag = true;
              }
              _this.saveId = result.data.id;
              _this.applicationNum = result.data.applicationNum;

            } else {
              _this.$message(result.message);
            }
          });
        } else {
          this.$message({
            type: 'info',
            message: '请完善必填数据！'
          });
          return false;
        }
      });
    },

    // 提交保存提示确认
    subOrClose(ruleForm,flag,text) {
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.submitForm(ruleForm, flag)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },

    handleFilePreview(file) {
      console.log(file);
    },
    //文件上传成功
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleFileSuccess(response, file, filelist) {
      var _this = this;
      // console.log(response);
      _this.fileRefIds.push(response.data[0].id);
      // console.log(_this.fileRefIds);
      this.formData.uploadFile = filelist;
    },
    handleFileRemove(response, fileList) {
      var _this = this;
      _this.fileRefIds.forEach((item, index) => {
        if (item == response.response.data[0].id) {
          // console.log(item);
          _this.fileRefIds.splice(index, 1);
        }
      });
    },
    beforeFileRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm=>{
      if (from.path == '/allotEquipQuery') {
        vm.tableData = JSON.parse(localStorage.getItem('equipList'));
        vm.allotDept = JSON.parse(localStorage.getItem('allotDept'));
        vm.mutual = "add";
      } else {
        localStorage.setItem('equipList', '');
        localStorage.setItem('allotDept', '');
      }
    })
  }
};

</script>
