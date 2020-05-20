<template>
  <div class="check-apply">
    <div class="form-title">
      <i class="icon"></i>实物资产验收申请
    </div>
    <el-form
      ref="ruleForm"
      :model="formData"
      :inline="true"
      :rules="rules"
      style="width:99%"
      class="check-form"
    >
      <el-row class="common-row row-list">
        <el-col :span="8">
          <el-form-item label="申请编号" label-width="107px" prop="processId">
            <el-input v-model="formData.processId" disabled></el-input>
            <!-- <span>{{formData.processId}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" label-width="107px" prop="status">
            <el-input v-model="formData.status" disabled></el-input>
            <!-- <span>{{formData.status}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间" label-width="107px" prop="applyDate">
            <el-input v-model="formData.applyDate" disabled></el-input>
            <!-- <span>{{formData.applyDate}}</span> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="row-list">
        <el-col :span="8">
          <el-form-item label="主题" label-width="107px" prop="subject">
            <el-input v-model.trim="formData.subject" :disabled="callFlag"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人" label-width="107px" prop="applyUser">
            <el-input v-model="formData.applyUser" disabled></el-input>
            <!-- <span>{{formData.applyUser}}</span> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话" label-width="107px" prop="telephone">
            <el-input v-model="formData.telephone" disabled></el-input>
            <!-- <span>{{formData.telephone}}</span> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse class="common-collapse" v-model="currentCollapse">
        <el-collapse-item name="1" disabled>
          <template slot="title">
            <div class="collapse-title">采购信息</div>
          </template>
          <el-row>
            <el-col :span="8">
              <el-form-item label="采购订单" label-width="107px" prop="order">
                <!-- <el-input v-model="formData.order" :disabled="callFlag" @focus="dialogOrder=true"></el-input> -->
                <el-select
                  v-model="formData.order"
                  filterable
                  placeholder="请选择"
                  @change="currentSel"
                  :disabled="callFlag"
                >
                  <el-option
                    v-for="(item) in orderTreeList"
                    :key="item.id"
                    :label="item.orderNum"
                    :value="item.orderNum"
                  >
                    <span style="float: left">{{ item.orderNum }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >&nbsp;-&nbsp;{{ item.providerName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商" label-width="107px" prop="provider">
                <el-input v-model="formData.provider" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目编号" label-width="107px" prop="projectNum">
                <!-- {{formData.projectNum}} -->
                <el-input v-model="formData.projectNum" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="two-line">
              <el-form-item label="验收成本中心（站/队/科/室)" label-width="107px" prop="participation">
                <el-input
                  v-model="formData.participation"
                  placeholder="请选择"
                  :disabled="callFlag"
                  readonly
                  @focus="dialogparticipation= true"
                >
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-search"
                    @click="dialogparticipation= true"
                  ></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="select-time">
              <el-form-item label="计划验收日期" label-width="107px" prop="planTime">
                <el-date-picker
                  width="180px"
                  v-model="formData.planTime"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                  :picker-options="pickerOptions"
                  :disabled="callFlag"
                  :clearable="clearable"
                  :editable="false"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称" label-width="107px" prop="projectName">
                <!-- {{formData.projectName}} -->
                <el-input v-model="formData.projectName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-row :span="8" style="position:relative;top:-5px;">
              <el-form-item label="安装运输费用" prop="installTransportFee" label-width="107px">
                <el-input
                  v-model="formData.installTransportFee"
                  @keyup.native="getNumber"
                  :disabled="callFlag"
                ></el-input>
                <span>元</span>
              </el-form-item>
            </el-row>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="2" disabled>
          <template slot="title">
            <div class="collapse-title">批量导入</div>
          </template>
          <el-row>
            <el-col>
              <!-- :action="importTemplateUrl" -->
              <el-form-item label="选择文件" prop="file" class="select-file" ref="templateFile">
                <el-upload
                  ref="template"
                  class="upload-demo"
                  :before-upload="beforeTemplateUpload"
                  :action="importTemplateUrl"
                  :on-preview="handleTemplatePreview"
                  :on-remove="handleTemplateRemove"
                  :before-remove="templatebeforeRemove"
                  :file-list="formData.file"
                  :on-success="templateImportSuccess"
                  :on-error="templateImportError"
                  :limit="1"
                  :headers="headers"
                  :disabled="callFlag"
                  :auto-upload="false"
                >
                  <el-button
                    :disabled="callFlag"
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
                    :disabled="callFlag"
                    :style="{'opacity':callFlag?0.6:1}"
                  >导入</el-button>
                </el-upload>
              </el-form-item>
              <el-button
                size="small"
                @click="dialogVisible=true"
                :disabled="callFlag"
                class="download"
                :style="{'opacity':callFlag?0.6:1}"
              >下载模板</el-button>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="3" class="active">
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
            <el-table-column :show-overflow-tooltip="true" width="55" label="序号" type="index"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="equipName"
              label="设备描述"
              width="140"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="specification"
              label="规格型号"
              width="100"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="manufacturNum"
              label="出厂序号"
              width="120"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="purchasePrice" label="采购价格"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="locationCode"
              label="位置编码"
              width="150"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="installLocDesc"
              label="安装地点"
              width="160"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="usingMan" width="110" label="使用人"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="usingManName"
              width="110"
              label="使用人名称"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="usingDept"
              width="110"
              label="使用部门"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="usingDeptName"
              width="140"
              label="使用部门名称"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="usingModure"
              label="使用模块"
              width="120"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="usingModureName"
              width="160"
              label="使用模块名称"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="belongSystem"
              label="所属系统"
              width="120"
            ></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="startDate"
              label="启用日期"
              width="120"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="comments" label="评论" width="140"></el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              background
              :style="{'opacity':callFlag?0.6:1}"
              layout="total,prev, pager, next,jumper"
              :page-size="10"
              @current-change="handleCurrentChange"
              :total="tableData.length"
              :disabled="callFlag"
            ></el-pagination>
          </div>
        </el-collapse-item>
        <el-collapse-item name="2" disabled>
          <template slot="title">
            <div class="collapse-title">技术资料文档</div>
          </template>
          <el-row class="import-file">
            <el-col :span="24">
              <span class="file-header">文件选择</span>
              <el-form-item prop="uploadFile">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :action="importFileUrl"
                  :on-remove="handleFileRemove"
                  :before-remove="beforeFileRemove"
                  :file-list="formData.uploadFile"
                  :on-success="handleFileSuccess"
                  :headers="headers"
                  :on-error="templateImportError"
                  multiple
                  :disabled="callFlag"
                >
                  <i class="el-icon-plus" v-if="callFlag==false"></i>
                </el-upload>
                <!-- <i class="el-icon-download" v-if="callFlag==false && fileRefIds.length>0" @click="acceptDownload"></i> -->
                <div v-show="fileRefIds.length==0" class="empty-des">
                  <div>暂无文件</div>
                  <div>使用 '+' 按钮 上传技术文件资料文档</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
        <div v-if="isHistory == true || isReject==true">
          <history :childId="childId" v-if="DestroyIncomeStatistics == true"></history>
        </div>
      </el-collapse>
      <el-form-item class="btn-group" v-if="isHistory == false && isReject==false">
        <el-button
          size="small"
          class="save-btn"
          :disabled="callFlag"
          :style="{'opacity':callFlag?0.6:1}"
          @click="submitVerifyForm('ruleForm')"
        >{{!callFlag?'验证':'已验证'}}</el-button>
        <el-button
          @click="submitForm('ruleForm',false)"
          size="small"
          class="save-btn"
          :disabled="callFlag"
          :style="{'opacity':callFlag?0.6:1}"
        >保存</el-button>
        <el-button
          @click="submitForm('ruleForm',true)"
          size="small"
          class="submit-btn"
          :disabled="submitCallFlag"
          :style="{'opacity':submitCallFlag?0.6:1}"
        >提交</el-button>
      </el-form-item>
      <el-form-item class="btn-group" v-if="isReject == true">
        <el-button
          @click="resetSubmitForm('ruleForm',false)"
          size="small"
          class="danger-btn"
          :disabled="callFlag"
          :style="{'opacity':callFlag?0.6:1}"
        >撤回</el-button>
        <el-button
          size="small"
          class="save-btn"
          :disabled="callFlag"
          :style="{'opacity':callFlag?0.6:1}"
          @click="submitVerifyForm('ruleForm')"
        >{{!callFlag?'验证':'已验证'}}</el-button>
        <el-button
          @click="resetSubmitForm('ruleForm',true)"
          size="small"
          class="submit-btn"
          :disabled="submitCallFlag"
          :style="{'opacity':submitCallFlag?0.6:1}"
        >提交</el-button>
      </el-form-item>
    </el-form>

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
        <el-button @click="getClickedTemplate('selected')" size="small" type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="70%"
      title="选择使用人"
      :visible.sync="dialogparticipation"
      class="pop-participation"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <orgstructure
        ref="getZiZuJianList"
        queryType="accept"
        :isRadio="true"
        v-on:childByValue="childByValue"
      ></orgstructure>
    </el-dialog>
    <!-- 模板字段错误操作 -->
    <el-dialog title="提示" :visible.sync="submitErrorVisible" width="30%">
      <div>{{submitErrorMessage}}</div>
      <div style="max-height:200px;overflow:auto;color:red">
        <div v-for="(item,index) in submitErrorList" :key="index">{{item}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitErrorVisible = false" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { axiosPost, axiosGet, constApi } from "@/api/index.js";
import history from "../../components/commonHistory";
import orgstructure from "@/components/orgstructure";
export default {
  props: {
    paramList: Object
  },
  components: { history, orgstructure },
  data() {
    return {
      searchName: "",
      DestroyIncomeStatistics: true,
      submitCallFlag: true,
      callFlag: false, //提交之后 所有按钮不可点
      submitFlag: true,
      clearable: false,
      submitSuccessId: "",
      isVerifySaveId: "",
      currentCollapse: ["1", "2", "3", "4", "5"],
      headers: {
        token: localStorage.getItem("token")
      },
      radio2: "",
      constApi: constApi,
      importTemplateUrl: constApi + "/process/acceptance/import",
      importFileUrl: constApi + "/common/file/upload",
      formData: {
        processId: "", //申请编号
        status: "",
        applyDate: "",
        subject: "",
        applicant: "",
        telephone: "",
        order: "",
        file: [],
        uploadFile: [],
        participation: "",
        planTime: "",
        provider: "", //供应商
        projectNum: "", //项目编号
        projectName: "", //项目名称
        installTransportFee: ""
      },
      fileRefIds: [],
      rules: {
        subject: [
          {
            required: true,
            message: "主题不能为空",
            trigger: ["blur", "change"]
          },
          {
            min: 6,
            max: 50,
            message: "申请主题长度为 6 - 50 个字符",
            trigger: ["blur", "change"]
          }
        ],
        installTransportFee: {
          required: true,
          message: "安装运输费用不能为空",
          trigger: "blur"
        },
        order: {
          required: true,
          message: "采购订单编号不能为空",
          trigger: ["blur", "change"]
        },
        file: {
          required: true,
          message: "上传模板为空或者不正确",
          trigger: "change"
        },
        participation: {
          required: true,
          message: "验收参与人员不能为空",
          trigger: ["blur", "change"]
        },
        planTime: {
          required: true,
          message: "计划验收时间不能为空",
          trigger: "change"
        }
      },
      orderInfo: [],
      selectedOrder: "",
      orderTreeList: [],
      dialogOrder: false,
      dialogVisible: false,
      dialogparticipation: false,
      submitErrorVisible: false,
      submitErrorMessage: "",
      submitErrorList: [],
      defaultExpandAll: true,
      defaultJoinId: [],
      joinUser: [],
      checkedtemplates: [],
      submitTemplate: [],
      mainTemplatecachedId: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      purchaseOrder: [],
      templateList: [],
      tableData: [],
      loading: false,
      selectedUser: [], //当前选中的
      currentPage: 1,
      pageSize: 10,
      total: 0,
      pageCount: 5,
      deptNum: 0,
      isHistory: false,
      isReject: false,
      childId: ""
    };
  },
  methods: {
    // acceptDownload(){
    //   // 下载
      
    // },
    // get子组件数据
    childByValue: function(childValue) {
      if (childValue !== "0") {
        let name = [];
        let id = [];
        for (var i = 0; i < childValue.length; i++) {
          name.push(childValue[i].name);
          id.push(childValue[i].id);
        }
        this.formData.participation = name[0];
        this.selectedUser = [
          {
            name: name[0],
            id: id[0]
          }
        ];
      }
      this.dialogparticipation = false;
    },
    getNumber() {
      if (
        this.formData.installTransportFee != "" &&
        this.formData.installTransportFee.substr(0, 1) == "."
      ) {
        this.formData.installTransportFee = "";
      }
      this.formData.installTransportFee = this.formData.installTransportFee.replace(
        /^0*(0\.|[1-9])/,
        "$1"
      ); //解决 粘贴不生效
      this.formData.installTransportFee = this.formData.installTransportFee.replace(
        /[^\d.]/g,
        ""
      ); //清除“数字”和“.”以外的字符
      this.formData.installTransportFee = this.formData.installTransportFee.replace(
        /\.{2,}/g,
        "."
      ); //只保留第一个. 清除多余的
      this.formData.installTransportFee = this.formData.installTransportFee
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      this.formData.installTransportFee = this.formData.installTransportFee.replace(
        /^(\-)*(\d+)\.(\d\d).*$/,
        "$1$2.$3"
      ); //只能输入两个小数
      if (
        this.formData.installTransportFee.indexOf(".") < 0 &&
        this.formData.installTransportFee != ""
      ) {
        //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (
          this.formData.installTransportFee.substr(0, 1) == "0" &&
          this.formData.installTransportFee.length == 2
        ) {
          this.formData.installTransportFee = this.formData.installTransportFee.substr(
            1,
            obj.value.length
          );
        }
      }
    },
    confirmOrder() {
      this.formData.order = this.selectedOrder;
      this.dialogOrder = false;
      axiosGet(
        "process/acceptance/order-detail?orderNum=" + this.selectedOrder
      ).then(result => {
        if (result.code == 200) {
          let resultData = result.data;
          this.formData.provider = resultData.providerName;
          this.formData.projectNum = resultData.projectNum;
          this.formData.projectName = resultData.projectName;
        }
      });
    },
    handleRadioOrder(row) {
      this.selectedOrder = row.orderNum;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 选择模板
    handleCheckedTemplates(value) {
      var _this = this;
      _this.checkedtemplates = value;
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
    handleTemplatePreview(file) {
      // console.log("点击文件列表中已上传的文件时的钩子");
    },
    submitTemplateUpload() {
      this.$refs.template.submit();
    },
    // 上传模板之前
    beforeTemplateUpload(file) {
      if (file) {
        this.loading = this.$loading({
          lock: true,
          text: "正在上传...",
          background: "rgba(0, 0, 0, 0.7)"
        });
      }
      this.tableData = [];
    },
    // 导入模板成功
    templateImportSuccess(response, file, filelist) {
      var _this = this;
      let code = response.code;
      this.loading.close();
      if (code === 200) {
        _this.formData.file = filelist;
        _this.mainTemplatecachedId = response.data.cacheId;
        _this.isVerifySaveId = "";
        _this.tableData = response.data.data;
        this.$refs.ruleForm.clearValidate("file");
        _this.$message({
          type: "success",
          message: "导入模板成功!"
        });
      } else if (code == 400) {
        // 模板字段错误
        const h = this.$createElement;
        _this
          .$msgbox({
            title: "提示",
            type: "error",
            beforeClose: (action, instance, done) => {
              _this.formData.file = [];
              instance.confirmButtonLoading = false;
              done();
            },
            message: h("p", null, [
              h("span", null, "共有"),
              h(
                "span",
                { style: "font-size: 16px;padding:0 4px;" },
                response.data.errorCount
              ),
              h("span", null, "条错误,"),
              h(
                "span",
                {
                  style: "color: teal;text-decoration:underline;cursor:pointer",
                  on: {
                    click() {
                      if (response.data.errorMessageDownloadUrl) {
                        axiosGet(response.data.errorMessageDownloadUrl).then(
                          result => {
                            if (result.code == 200) {
                              window.location.href =
                                _this.constApi + result.data;
                            }
                          }
                        );
                      } else {
                        // 没有可用链接
                      }
                    }
                  }
                },
                "点击下载"
              )
            ])
          })
          .then(() => {
            _this.formData.file = [];
          });
      } else if (code == 402) {
        // 模板错误
        this.$alert(response.message, "提示", {
          confirmButtonText: "确定",
          type: "error",
          callback: action => {
            _this.formData.file = [];
          }
        });
      } else {
      }
    },
    templateImportError(response, file, filelist) {
      this.loading.close();
      this.$alert(response.message, "提示", {
        confirmButtonText: "确定",
        type: "error"
      });
    },
    templatebeforeRemove(file, fileList) {
      var _this = this;
      return this.$confirm(`确定移除 ${file.name}？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.formData.file = [];
      });
    },
    handleTemplateRemove(file, fileList) {
      this.tableData = [];
      this.formData.file = [];
    },
    getTemplate() {
      this.$refs.template.clearFiles();
      this.tableData = [];
      this.formData.file = [];
    },
    /**
     * 验证表单
     */
    submitVerifyForm(ruleForm) {
      var _this = this;
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          // 提交保存提示确认
          this.$confirm("是否验证？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              _this.handleVerifyResult();
            })
            .catch(() => {
              _this.$message({
                type: "info",
                message: "已取消"
              });
            });
        }
      });
    },
    handleVerifyResult() {
      var _this = this;
      var cacheId = "";
      // 判断取值问题
      if (_this.isVerifySaveId) {
        cacheId = "";
      } else {
        cacheId = _this.mainTemplatecachedId;
      }
      axiosGet(
        "process/acceptance/verify?cacheId=" +
          cacheId +
          "&applyId=" +
          _this.isVerifySaveId +
          "&orderNum=" +
          _this.formData.order
      ).then(result => {
        if (result.code == 200) {
          _this.callFlag = true;
          this.$message({
            message: "验证成功！",
            type: "success"
          });
          _this.submitCallFlag = false;
        } else {
          if (result.data) {
            _this.submitErrorVisible = true;
            _this.submitErrorMessage = result.message;
            _this.submitErrorList = result.data;
          } else {
            _this.commonErrorTip(result.message);
          }
        }
      });
    },
    /**
     * 提交表单
     */
    submitForm(ruleForm, flag) {
      var _this = this;
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          let text = "";
          flag ? (text = "是否提交") : (text = "是否保存");
          let userIds = [];
          _this.selectedUser.forEach(item => {
            userIds.push(item.id);
          });
          let parmas = {
            id: _this.submitSuccessId, //id 是提交 没有id 是保存
            subject: _this.formData.subject,
            acceptanceDate: _this.formData.planTime,
            orderNum: _this.formData.order,
            cachedId: _this.mainTemplatecachedId,
            userIds: userIds,
            fileRefIds: _this.fileRefIds,
            submit: flag,
            showLoading: true,
            installTransportFee: _this.formData.installTransportFee
          };
          this.$confirm(text, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              _this.handleSubmitResult(parmas, flag);
            })
            .catch(() => {
              _this.$message({
                type: "info",
                message: "已取消"
              });
            });
        } else {
          _this.$message({
            type: "error",
            message: "请完善必填信息!"
          });
          return false;
        }
      });
    },
    /**
     * 重新撤销和提交
     */
    resetSubmitForm(ruleForm, flag) {
      var _this = this;
      let text = "";
      flag ? (text = "是否重新提交") : (text = "是否撤回");
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.$confirm(text, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              _this.handleResetSubmit(flag);
            })
            .catch(() => {
              _this.$message({
                type: "info",
                message: "已取消"
              });
            });
        }
      });
    },
    handleResetSubmit(flag) {
      var _this = this;
      let userIds = [];
      _this.selectedUser.forEach(item => {
        userIds.push(item.id);
      });
      this.DestroyIncomeStatistics = false;
      if (flag) {
        let params = {
          id: _this.submitSuccessId,
          subject: _this.formData.subject,
          acceptanceDate: _this.formData.planTime,
          orderNum: _this.formData.order,
          userIds: userIds,
          fileRefIds: _this.fileRefIds,
          installTransportFee: _this.formData.installTransportFee,
          taskId: this.$route.query.sapId
        };
        axiosPost("process/acceptance/resubmit", params).then(result => {
          if (result.code == 200) {
            _this.resetSuccessTip();
          } else {
            _this.commonErrorTip(result.message);
          }
        });
      } else {
        let params = {
          id: _this.submitSuccessId,
          processInstanceId: this.$route.query.instanceId,
          deleteReason: ""
        };
        axiosPost("process/acceptance/recall", params).then(result => {
          if (result.code == 200) {
            _this.resetSuccessTip();
            _this.$router.push({
              path: "/needdealt"
            });
          } else {
            _this.commonErrorTip(result.message);
          }
        });
      }
    },
    resetSuccessTip() {
      this.submitCallFlag = true;
      this.$message({
        message: "操作成功！",
        type: "success"
      });
      this.callFlag = true;
      this.$nextTick(() => {
        this.DestroyIncomeStatistics = true;
      });
    },
    handleSubmitResult(params, flag) {
      var _this = this;
      this.DestroyIncomeStatistics = false;
      axiosPost("process/acceptance/submit", params)
        .then(result => {
          if (result.code == 200) {
            this.$message({
              message: "操作成功！",
              type: "success"
            });
            this.$nextTick(() => {
              this.DestroyIncomeStatistics = true;
            });
            if (flag) _this.submitCallFlag = true;
            _this.submitSuccessId = result.data.id;
            _this.isVerifySaveId = _this.submitSuccessId;
            _this.submitFlag = false;
            _this.formData.processId = result.data.applicationNum;
            _this.formData.status = result.data.applicationStatus;
          } else if (result.code == 400) {
            _this.submitErrorVisible = true;
            _this.submitErrorMessage = result.message;
            _this.submitErrorList = result.data;
          } else if (result.code == 500) {
            _this.submitSuccessId = result.data.id;
            _this.isVerifySaveId = _this.submitSuccessId;
            _this.submitFlag = false;
            _this.commonErrorTip(result.message);
          } else if (result.code == 504) {
            _this.commonErrorTip("连接超时,请重试!");
          } else {
            _this.commonErrorTip(result.message);
          }
        })
        .catch(result => {
          _this.commonErrorTip(result.message);
        });
    },
    commonErrorTip(message) {
      var _this = this;
      _this.$alert(message, "提示", {
        type: "error",
        confirmButtonText: "确定"
      });
    },
    handleFileSuccess(response, file, filelist) {
      var _this = this;
      _this.fileRefIds.push(response.data[0].id);
      this.formData.uploadFile = filelist;
    },
    handleFileRemove(response, fileList) {
      var _this = this;
      _this.fileRefIds.forEach((item, index) => {
        if (item == response.response.data[0].id) {
          _this.fileRefIds.splice(index, 1);
        }
      });
    },
    beforeFileRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 采购订单选中时间
    currentSel(selVal) {
      for (var i = 0; i < this.orderTreeList.length; i++) {
        var cur = this.orderTreeList[i];
        if (cur.orderNum == selVal) {
          this.formData.provider = cur.providerName;
          this.formData.projectNum = cur.projectNum;
          this.formData.projectName = cur.projectName;
          break;
        }
      }
    },
    getInitData() {
      var _this = this;
      //验收申请初始化"
      axiosGet("process/acceptance/init-form", {
        showLoading: true
      }).then(result => {
        if (result.code == 200) {
          let resultData = result.data;
          _this.formData.applyUser = resultData.applyUser;
          _this.formData.subject = resultData.subject;
          _this.formData.applyDate = resultData.applyDate;
          _this.formData.telephone = resultData.telephone;
        }
      });
    },
    handleSetData(applicationNum) {
      var _this = this;
      //验收申请初始化"
      axiosGet("process/acceptance/init-form", { showLoading: true }).then(
        result => {
          if (result.code == 200) {
            let resultData = result.data;
            _this.formData.applyUser = resultData.applyUser;
            _this.formData.telephone = resultData.telephone;
          }
        }
      );
      axiosGet("process/acceptance/apply-detail/" + applicationNum, {
        showLoading: true
      }).then(result => {
        if (result.code == 200) {
          let resultData = result.data;
          _this.formData.processId = resultData.applicationNum; //
          _this.formData.status = resultData.applicationStatus;
          _this.formData.subject = resultData.subject;
          _this.formData.applyDate = resultData.applicationDate;
          _this.formData.order = resultData.orderNum;
          _this.selectedOrder = _this.formData.order;
          _this.formData.planTime = resultData.acceptanceDate; //计划验收时间
          _this.formData.installTransportFee = resultData.installTransportFee;
          if (_this.formData.order) {
            _this.confirmOrder();
          }
          if (resultData.partakeUsers.length > 0) {
            if (resultData.partakeUsers[0].userName) {
              _this.formData.participation =
                resultData.partakeUsers[0].userName;
              resultData.partakeUsers[0].id = resultData.partakeUsers[0].userId;
              _this.selectedUser.push(resultData.partakeUsers[0]);
            }
          }
          // 模板

          _this.tableData = resultData.equipInfos;
          _this.formData.file = [{ name: "" }];
          if (resultData.fileRefs.length > 0) {
            resultData.fileRefs.forEach(item => {
              _this.formData.uploadFile.push({
                name: item.fileName,
                id: item.id
              });
              _this.fileRefIds.push(item.id);
            });
          }
          _this.submitSuccessId = resultData.id; //id
          _this.isVerifySaveId = _this.submitSuccessId; //缓存id
        }
      });
    },
    getCommonAjax() {
      var _this = this;
      axiosGet("process/acceptance/order-list").then(result => {
        if (result.code == 200) {
          _this.orderTreeList = result.data;
        }
      });
      // 获取所有模板地址
      axiosGet("common/file/template-acc/list").then(result => {
        if (result.code == 200) {
          _this.templateList = result.data;
        }
      });
    }
  },
  created() {
    var _this = this;
    let formkey = this.$route.query.formKey;
    // 判断是审批历史 草稿 驳回 申请
    if (this.paramList && this.paramList.type == "history") {
      _this.callFlag = true;
      _this.isHistory = true;
      this.childId = this.$route.query.applicationNum;
      _this.handleSetData(_this.childId);
    } else if (this.paramList && this.paramList.type == "draft") {
      this.childId = this.$route.query.applicationNum;
      _this.handleSetData(_this.childId);
    } else if (formkey && formkey == "formkey_1") {
      this.childId = this.$route.query.applyformId;
      _this.isReject = true;
      _this.handleSetData(_this.childId);
    } else {
      _this.getInitData();
    }
    _this.getCommonAjax();
  }
};
</script>
<style lang="scss">
.check-apply {
  .el-form {
    .el-input__inner {
      width: 180px !important;
    }
  }
  .row-list {
    .el-form-item__content {
      width: 180px;
    }
    .el-form--inline .el-form-item__content,
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 180px !important;
    }
  }
  .el-date-editor.el-input {
    width: 180px;
  }
  .el-pagination__editor.el-input .el-input__inner {
    width: 40px !important;
  }
  .two-line {
    .el-form-item__label {
      white-space: pre-wrap;
      line-height: 20px;
      position: relative;
      top: -5px;
    }
  }
  .el-collapse-item__content,
  .el-form-item__content {
    .is-disabled {
      color: #555;
    }
  }
  // disable状态
  .check-form {
    .el-input.is-disabled .el-input__inner {
      color: #555;
    }
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
  .danger-btn.el-button {
    background: #ee5050;
    color: #fff;
  }
  .template-upload {
    height: 32px;
    margin-left: 18px;
  }
  // 折叠面板
  .common-collapse {
    .el-collapse-item__header {
      background: #eff2f9;
      padding-left: 8px;
      height: 30px;
      line-height: 30px;
      // margin-top:10px;
      //  border-top:1px solid #999;
    }
    .collapse-title {
      font-weight: 600;
      // margin-top:10px;
      // border-top:1px solid red;
    }
    .el-collapse-item__content {
      padding: 20px 0 2px;
    }
    .el-collapse-item__wrap {
      border-bottom-color: transparent;
    }
  }
  .pagination {
    text-align: center;
    margin: 10px 0 10px;
  }
  .select-file {
    height: 30px;
    margin-right: 20px;
    .el-form--inline {
      .el-form-item__content {
        width: 400px !important;
      }
    }
    .el-upload {
      margin-left: 20px;

      &:focus {
        border-color: #fff;
      }
    }
    .el-upload-list__item.is-success .el-upload-list__item-name:focus {
      border-color: #fff !important;
      outline-width: 0px !important;
    }
    .upload-demo {
      height: 28px;
      line-height: 28px !important;
      display: flex;
      flex-direction: row;
      .el-upload-list {
        order: -1;
        padding-right: 10px;
        border: 1px solid #dcdfe6;
        height: 28px;
        line-height: 28px;
        position: relative;
        border-radius: 4px;
        width: 298px;
        overflow: hidden !important;
        .el-upload-list__item:first-child {
          margin-top: 0px;
          height: 28px !important;
        }
        .el-upload-list__item:hover {
          background: #fff;
        }
      }
    }
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
  .common-collapse {
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
    // .el-icon-download {
    //   position: absolute;
    //   right: 30px;
    //   top: 7px;
    //   font-size:16px;
    //   cursor: pointer;
    // }
    .el-upload-dragger {
      width: 100%;
      border-color: transparent;
    }
  }
  .select-time {
    .el-input--prefix .el-input__inner {
      padding-left: 15px !important;
    }
    .el-input__prefix {
      left: 150px;
    }
  }
  .select-person {
    .el-radio-group {
      width: 100%;
      padding-left: 20px;
      box-sizing: border-box;
      .el-radio {
        width: 100%;
      }
    }
    .userId {
      display: inline-block;
      width: 33%;
      height: 48px;
      line-height: 48px;
    }
    .name {
      width: 33%;
    }
    .el-radio__input {
      width: 23%;
    }
    .title {
      padding-left: 20px;
      // border-bottom: 1px solid #999;
      > div {
        display: inline-block;
        width: 34%;
      }
      > div:first-child {
        width: 25%;
      }
    }
  }
  .head {
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      width: 18%;
    }
    div:first-child {
      width: 10%;
    }
  }
  .select-order {
    padding: 0 10px;
    .el-radio-group {
      width: 100%;
    }
    .el-radio {
      display: flex;
    }
    .el-radio__input {
      width: 10%;
    }
    .el-radio__label {
      width: 90%;
      display: flex;
      span {
        width: 20%;
      }
    }
  }
}
</style>
