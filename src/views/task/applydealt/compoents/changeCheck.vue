<template>
  <div class="sb-allocation">
    <div class="form-title">
      <i class="icon"></i>实物资产部门内变更申请
    </div>
    <el-form ref="ruleForm" :model="formData" :inline="true" :rules="rules" style="width:99%">
      <el-row class="common-row row-list">
        <el-col :span="8">
          <el-form-item label="申请编号" label-width="107px" prop="processId">
            <el-input v-model="formData.applicationNum" disabled></el-input>
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
            <el-input v-model="formData.subject" :disabled="callFlag"></el-input>
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
        <el-collapse-item name="4" class="active">
          <template slot="title">
            <div class="collapse-title">实物资产信息</div>
          </template>
<!--          isModule-->
<!--          <el-form-item v-if="draftList" style='width: 200px !important;' label="变更模块业务经理" label-width="150px" prop="cgOrder">-->
<!--            <el-input :disabled="!isModule" placeholder="请选择..." @focus="innerVisible = true"-->
<!--                      v-model="BGJingLi.name"></el-input>-->
<!--            &lt;!&ndash; 变更模块业务经理 &ndash;&gt;-->
<!--            <el-dialog-->
<!--                title="选择变更模块经理"-->
<!--                :visible.sync="innerVisible"-->
<!--                width="50%"-->
<!--            >-->
<!--              <el-row :gutter="20">-->
<!--                <el-col :span="12">-->
<!--                  <div class="grid-content bg-purple">-->
<!--                    组织架构-->
<!--                    <el-tree-->
<!--                        v-if="innerVisible"-->
<!--                        :data="data"-->
<!--                        :props="defaultProp"-->
<!--                        @node-click="handleNodeClicks"-->
<!--                        node-key="ids"-->
<!--                        :default-expanded-keys="[1]"-->
<!--                    ></el-tree>-->
<!--                  </div>-->
<!--                </el-col>-->
<!--                <el-col :span="12">-->
<!--                  <div class="grid-content bg-purple">-->
<!--                    人员-->
<!--                    <p class="bgBian" v-for="(it, i) in mokuaiRen" :key="i" @click="searchRen(it)">{{it.name}}</p>-->
<!--                  </div>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--              <span slot="footer" class="dialog-footer" style="height: 30px">-->
<!--  </span>-->
<!--            </el-dialog>-->

<!--          </el-form-item>-->
          <el-form-item v-if="draftList || isTodo" style='width: 200px !important;' label="变更模块业务经理" label-width="150px" prop="cgOrder">
            <el-input :disabled="!isModule" placeholder="请选择..." @focus="innerVisible = true"
                      v-model="BGJingLi.name"></el-input>
            <!-- 变更模块业务经理 -->
            <el-dialog
                title="选择变更模块经理"
                :visible.sync="innerVisible"
                width="60%"
            >
              <el-row :gutter="20">
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    组织架构
                    <el-tree
                        v-if="innerVisible"
                        :data="data"
                        :props="defaultProp"
                        @node-click="handleNodeClicks"
                        node-key="ids"
                        :default-expanded-keys="[1]"
                    ></el-tree>
                  </div>
                </el-col>
                <el-col :span="16">
                  <div class="grid-content bg-purple">
                    人员
                    <p class="bgBian" v-for="(it, i) in mokuaiRen" :key="i" @click="searchRen(it)">{{it.name}}</p>
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="pages.total"
                        :page-size=15
                        @current-change="getTreeJingLi">
                    </el-pagination>
                  </div>
                </el-col>
              </el-row>
              <span slot="footer" class="dialog-footer" style="height: 30px">
<!--    <el-button @click="dialogVisible = false">取 消</el-button>-->
                <!--    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>-->
  </span>
            </el-dialog>

          </el-form-item>


          <div class="pb20">
            <el-button @click="addrouter" type="primary" size="small" :disabled="callFlag || addFlag">新 增</el-button>
            <el-button type="danger" size="small" @click="delList" :disabled="callFlag">删 除</el-button>
          </div>
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
              v-loading="loading"
              @selection-change="SelectionChange">
            <el-table-column :show-overflow-tooltip='true' type="selection" width="45"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' label="序号" width="55" type="index" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="assetNum" label="资产编码" width="100"></el-table-column> -->
            <el-table-column :show-overflow-tooltip='true' prop="equipNum" label="设备编码" width="160"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="equipName" label="设备名称" width="140"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="installLocDesc" label="原安装地点" width="140"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="usingManName" label="原使用人"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="usingDeptName" label="所属部门" width="150"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="positionCode" label="位置编码" width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.positionCode" :disabled="callFlag"
                           @change="changeSelect($event,scope.row.index)" placeholder="请选择">
                  <el-option
                      v-for="item in positionCode"
                      :key="item.label"
                      :label="item.value"
                      :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="locationName" label="位置名称" width="160"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' label="现安装地点" width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.nowInstallLocDesc" :disabled="callFlag" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true' label="现使用人" width="140">
              <template slot-scope="scope">
                <el-select v-model="scope.row.nowUsingMan" :disabled="callFlag"
                           @change="changepeoSelect($event,scope.row.index)" placeholder="请选择">
                  <el-option
                      v-for="item in nowUsingMan"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                  >
                  </el-option>
                </el-select>
                <!-- <el-input v-model="scope.row.nowUsingMan" style="position: relative;" placeholder="请选择"></el-input>
                <p @click="dialogClick(scope.row.index)" class="ment-input"></p> -->
                <!-- 使用人选择 -->
                <!-- <el-dialog
                width="30%"
                title="使用人选择"
                :visible.sync="innerVisible"
                append-to-body
                class="diaMan">
                  <el-tree
                    :data="department"
                    ref="tree"
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[2, 3]"
                    :default-checked-keys="[5]"
                    :props="defaultProps"
                    @check-change="handleNodeClick">
                  </el-tree>
                  <div class="el-dialog__footer">
                    <el-button @click="innerVisible = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="departmentOk(scope.row.index)" size="small">确 定</el-button>
                  </div>
              </el-dialog> -->
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="module" label="所属模块" width="140"></el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block pagination">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="pageSize"
                background
                layout="total, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
          </div>

          <el-collapse-item name="2" disabled v-if="draftList || isTodo">
            <template slot="title">
              <div class="collapse-title">批量导入</div>
            </template>
            <el-row>
              <el-col>
                <!-- :action="importTemplateUrl" -->
                <el-form-item label="选择文件" class="select-file">
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
                      :on-exceed="handleTemplateExceed"
                      :on-change="handleTemplatechange"
                      :headers="headers"
                      accept=".xls"
                      :disabled="callFlag"
                      :auto-upload="false"
                  >
                    <el-button
                        slot="trigger"
                        size="small"
                        height="28px"
                        class="primary-btn"
                        :disabled="callFlag || importFlag"
                    >浏览
                    </el-button>

                    <el-button
                        size="small"
                        height="28px"
                        class="primary-btn template-upload"
                        @click="submitTemplateUpload"
                        :disabled="callFlag || importFlag"
                    >导入
                    </el-button>
                  </el-upload>
                </el-form-item>
                <el-button
                    size="small"
                    @click="dialogVisible=true"
                    :disabled="callFlag"
                    class="download"
                >下载模板
                </el-button>
              </el-col>
            </el-row>
          </el-collapse-item>


          <div v-if="!draftList" class="query-title">审批历史</div>
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
            <el-table-column prop="assigneeName" label="操作人" width="120"></el-table-column>
            <el-table-column prop="formKey" label="操作" width="120"></el-table-column>
            <el-table-column prop="endTime" label="操作时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="审批意见" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <!--            @click.stop="subOrCloses('ruleForm',false,'是否保存？')"-->
      <!--            @click="submitForm('ruleForm', false)"-->
      <el-form-item class="btn-group" v-if="draftList==true">
        <el-button
            @click="subOrCloses('ruleForm',false,'是否保存？')"
            size="small"
            class="save-btn"
            :disabled="callFlag"
        >保存
        </el-button>
<!--        @click.stop="subOrCloses('ruleForm',true,'是否提交？')"-->
        <!--            @click="submitForm('ruleForm', true)"-->
        <el-button
        @click="subOrCloses('ruleForm',true,'是否提交？')"
            size="small"
            class="submit-btn"
            :disabled="callFlag"
        >提交
        </el-button>
      </el-form-item>
      <el-form-item class="btn-group" v-if="isTodo">
        <el-button
            @click="subOrCancel('ruleForm',false,'是否撤回？')"
            size="small"
            type="danger"
            :disabled="callFlag"
        >撤回
        </el-button>
<!--        @click.stop="subOrCloses('ruleForm',true,'是否提交？')"-->
        <!--            @click="submitForm('ruleForm', true)"-->
        <el-button
        @click="subOrCancel('ruleForm',true,'是否提交？')"
            size="small"
            class="submit-btn"
            :disabled="callFlag"
        >提交
        </el-button>
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
        <el-button @click="getClickedTemplate('cancel')">取 消</el-button>
        <el-button @click="getClickedTemplate('selected')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  // import { getTime } from "../../../common/until"
  import {axiosPost, axiosGet, constApi} from "@/api/index.js"

  export default {
    props: {
      paramList: {
        type: Object
      }
    },
    data() {
      return {
        mokuaiRen: [],  // 选择模块 => 下面的人集合
        data: [],       // 选择模块的组织架构
        defaultProp: {
          children: 'children',
          label: 'displayName'
        },
        isTodo: false, // 从待办进来
        isModule: false,  // 是否存在模块  初始化给的
        BGJingLi: {}, // 变更经理
        innerVisible: false, // 使用人选择弹出显示
        callFlag: false, // 提交之后 所有按钮不可点
        addFlag: false, // 新增 （新增和导入互斥）
        importFlag: false, // 导入 （新增和导入互斥）
        innerVisible: false, // 使用人选择弹出显示
        draftList: false,
        department: [], // 使用人
        flag: '', // 是否是管理员 true是 false否
        submitFlag: true,
        submitSuccessId: "",
        currentCollapse: ["1", "2", "3", "4"],
        headers: {
          token: localStorage.getItem("token")
        },
        constApi: constApi,
        importTemplateUrl: constApi + "/process/changeProcess/import",
        importFileUrl: constApi + "/common/file/upload",
        approveHistory: [],
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
          projectName: "" //项目名称
        },
        fileRefIds: [],
        rules: {
          subject: {
            required: true,
            message: "主题不能为空",
            trigger: "blur"
          },
          order: {
            required: true,
            message: "项目编号不能为空",
            trigger: ["blur", "change"]
          },
          file: {
            required: true,
            message: "上传文件不能为空",
            trigger: "change"
          },
          participation: {
            required: true,
            message: "验收参与人员不能为空",
            trigger: "change"
          },
          participation: {
            required: true,
            message: "验收参与人员不能为空",
            trigger: "change"
          },
          planTime: {
            required: true,
            message: "计划验收时间不能为空",
            trigger: "change"
          }
        },
        arr: [],
        dialogVisible: false,
        defaultExpandAll: true,
        defaultJoinId: [],
        joinUser: [],
        checkedtemplates: [],
        submitTemplate: [],
        mainTemplatecachedId: "",
        // pickerOptions: {
        //   disabledDate(time) {
        //     return time.getTime() < Date.now() - 8.64e7;
        //   }
        // },
        purchaseOrder: [],
        templateList: [],
        tableData: [],
        loading: false,
        participantList: [],
        emptyText: "正在加载...",
        defaultProps: {
          children: "children",
          label: "name"
        },
        userData: [],
        selectedUser: [], //当前选中的
        prevSelectedUser: [], //记录上次选中的
        numPrevCode: 0, //记录是不是第一次点击
        allSelectedUser: [], //
        MarkCurrentFlag: true,
        cancelSelectedUser: [],
        // 默认显示第几页
        currentPage: 1,
        // 总条数，根据接口获取数据长度(注意：这里不能为空)
        totalCount: 1,
        // 默认每页显示的条数（可修改）
        pageSize: 100,
        pageCount: 5,
        deptNum: 0,
        positionCode: [{
          value: 'BCIA-01',
          label: '机场'
        }],
        nowUsingMan: [{
          value: '保山',
          label: '机场'
        }],
        value: '',
        equipNum: '',
        pages: {},
      };
    },
    methods: {
      // get组织架构数据
      getTreeJingLi() {
        var that = this;
        axiosGet("base/dept/myTree").then(result => {
          if (result.code == 200) {
            that.data = result.data
            that.data[0].ids = 1
            console.log(that.data)
          } else {

          }

        });
      },

      // 选择使用人-确定
      handleNodeClicks(data) {
        var url = "base/user/list?deptNum=" + data.deptNum + '&size=10&current=1'
        axiosGet(url).then(result => {
          console.log(result.data);
          if (result.code == 200) {
            if (result.data.records.length) {
              this.mokuaiRen = result.data.records
              this.pages.total = result.data.total
              this.pages.deptNum = data.deptNum
            } else {
              this.$message({
                message: '此模块为空！',
                type: 'warning'
              });
            }
          }
        });
      },
        // data.deptNum
      //   var url = "base/user/list?deptNum=" + data.deptNum + '&size=9999'
      //   axiosGet(url).then(result => {
      //     console.log(result.data);
      //     if (result.code == 200) {
      //       if (result.data.records.length) {
      //         this.mokuaiRen = result.data.records
      //       } else {
      //         alert('此模块为空！')
      //       }
      //     }
      //   });
      // },

      // 模块选择人
      searchRen(data) {
        console.log(data);
        this.BGJingLi = data
        this.innerVisible = false
        this.mokuaiRen = []
      },

      // get审批历史
      getShenPi(id) {
        var url = 'process/changeProcess/history?applicationNum=' + id;
        axiosGet(url).then(result => {
          console.log(result.data)
          if (result.code == 200) {
            this.approveHistory = result.data;
          }
        });
        // axiosPost("approval/history", params).then(result => {
        //   console.log(result)
        //   if (result.code === 200) {
        //     this.approveHistory = result.data;
        //   } else {
        //
        //   }
        // });
      },
      // 选择使用人-确定
      departmentOk(index) {
        let res = this.$refs.tree.getCheckedNodes()
        console.log(index)
        this.tableData.forEach(item => {
          if (item.index === index) {
            item.nowUsingMan = res[0].name
            item.module = res[0].deptName
          }
        })
        // 关闭部门选择
        this.innerVisible = false
      },
      // 勾选的表格
      SelectionChange(val) {
        console.log(val)
        val.forEach(item => {
          this.arr.push(item.index)
        })
        // this.equipNum = this.arr.join(',')
      },
      // 分页
      handleCurrentChange(val) {
        this.currentPage = val
      },
      // 选择模板
      handleCheckedTemplates(value) {
        var _this = this;
        _this.checkedtemplates = value;
        console.log(_this.checkedtemplates);
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
        console.log("点击文件列表中已上传的文件时的钩子");
      },
      submitTemplateUpload() {
        this.$refs.template.submit()
      },
      // 上传模板之前
      beforeTemplateUpload(file) {
        console.log("beforeUpload");
        this.tableData = [];
      },
      // 导入模板成功
      templateImportSuccess(response, file, filelist) {
        var _this = this;
        if (response.code === 200) {
          _this.formData.file = filelist;
          _this.mainTemplatecachedId = response.data.cacheId;
          _this.tableData = response.data.data;
          this.$refs.ruleForm.clearValidate("file");
          this.addFlag = true
        } else {
          this.$alert(response.data[0], response.message, {
            confirmButtonText: "确定",
            callback: action => {
              // this.$message({
              //   type: "info",
              //   message: `action: ${action}`
              // });
            }
          });
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
        this.addFlag = false
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
        this.$message.warning(`当前限制选择 1 个文件，本次已选择了 1 个文件`);
      },
      handleTemplatechange(file, fileList) {
      },
      dialogClick(val) {
        this.innerVisible = true
        this.equipNum = val
      },

      // 提交表单
      // submitForm(ruleForm, flag) { // flag == true 提交  or 保存
      //   var _this = this;
      //   this.formData.file.length > 0
      //     ? this.$refs.ruleForm.clearValidate("file")
      //     : "";
      //   this.$refs[ruleForm].validate(valid => {
      //     if (_this.tableData.length > 0) {
      //       let user = JSON.parse(localStorage.getItem('user'))
      //       let params = {
      //         flag: flag,
      //         applicationNum: _this.formData.applicationNum,
      //         id: _this.submitSuccessId,
      //         changeProcess: {
      //           applicationDate: _this.formData.applyDate,
      //           subject: _this.formData.subject,
      //           applicant: user.id,
      //           applicantName: _this.formData.applyUser,
      //           applicantPhone: _this.formData.telephone
      //         },
      //         assetsList: _this.tableData
      //       }
      //       if (_this.isModule && flag) {
      //         if (this.BGJingLi.usrId) {
      //           params.changeProcess.businessManager = this.BGJingLi.usrId
      //           params.changeProcess.businessName = this.BGJingLi.name
      //         } else {
      //           this.$message.error('请您选择模块业务经理！');
      //           return
      //         }
      //       }
      //       if (flag) {
      //         for (var i = 0; i < params.assetsList.length; i++) {
      //           if (!params.assetsList[i].positionCode || !params.assetsList[i].nowUsingMan || !params.assetsList[i].nowInstallLocDesc) {
      //             this.$message.error('请您完善提交数据！');
      //             return
      //           }
      //         }
      //       }
      //       if (_this.submitFlag) {
      //         axiosPost("process/changeProcess/submit", params).then(result => {
      //           if (result.code === 200) {
      //             this.$message({
      //               message: "操作成功！",
      //               type: "success"
      //             });
      //             _this.submitSuccessId = result.data.id;
      //             _this.submitFlag = false;
      //             _this.formData.applicationNum = result.data.applicationNum;
      //             _this.formData.status = result.data.applicationStatus;
      //             if (flag) {
      //               _this.callFlag = true;
      //             }
      //           } else if (result.code === 400) {
      //             console.log(result.message);
      //             this.$message(result.message);
      //           } else {
      //           }
      //         });
      //       } else {
      //         axiosPost("process/changeProcess/submit", params).then(result => {
      //           if (result.code === 200) {
      //             this.$message({
      //               message: "操作成功！",
      //               type: "success"
      //             });
      //             if (flag) {
      //               _this.callFlag = true;
      //             }
      //             _this.formData.applicationNum = result.data.applicationNum;
      //             _this.formData.status = result.data.applicationStatus;
      //           } else if (result.code === 400) {
      //             this.$message(result.message);
      //           } else {
      //             this.$message(result.message);
      //             // 其他问题
      //           }
      //         });
      //       }
      //     } else {
      //       this.$message.error('请完善信息！');
      //       return false;
      //     }
      //   })
      // },
      submitForm(ruleForm, flag) {
        var _this = this;
        this.formData.file.length > 0
          ? this.$refs.ruleForm.clearValidate("file")
          : "";
        this.$refs[ruleForm].validate(valid => {
          if (_this.tableData.length > 0) {
            console.log(_this.tableData)
            // let userIds = [];
            // _this.allSelectedUser.forEach(item => {
            //   userIds.push(item.id);
            // });
            let user = JSON.parse(localStorage.getItem('user'))
            let params = {
              flag: flag,
              applicationNum: _this.formData.applicationNum,
              id: _this.submitSuccessId,
              changeProcess: {
                applicationDate: _this.formData.applyDate,
                subject: _this.formData.subject,
                applicant: user.id,
                applicantName: _this.formData.applyUser,
                applicantPhone: _this.formData.telephone
              },
              assetsList: _this.tableData
            }

            if (_this.isModule && flag) {
              if (this.BGJingLi.name) {
                params.changeProcess.businessManager = this.BGJingLi.usrId
                params.changeProcess.businessName = this.BGJingLi.name
              } else {
                this.$message.error('请您选择模块业务经理！');
                return
              }
            }else if(_this.isModule){
              if (this.BGJingLi.name) {
                params.changeProcess.businessManager = this.BGJingLi.usrId
                params.changeProcess.businessName = this.BGJingLi.name
              }
            }
            for (var i = 0; i < params.assetsList.length; i++) {
              if(flag){
              if (!params.assetsList[i].positionCode || !params.assetsList[i].nowUsingMan) {
                alert('请完善数据！')
                return
              }
              }
            }

            if (_this.submitFlag) {
              axiosPost("process/changeProcess/submit", params).then(result => {
                if (result.code === 200) {
                  this.$message({
                    message: "操作成功！",
                    type: "success"
                  });
                  _this.submitSuccessId = result.data.id;
                  _this.submitFlag = false;
                  _this.formData.applicationNum = result.data.applicationNum;
                  _this.formData.status = result.data.applicationStatus;
                  if (flag) {
                    _this.callFlag = true;
                  }
                } else if (result.code === 400) {
                  console.log(result.message);
                  this.$message(result.message);
                } else {
                }
              });
            } else {
              axiosPost("process/changeProcess/submit", params).then(result => {
                if (result.code === 200) {
                  this.$message({
                    message: "操作成功！",
                    type: "success"
                  });
                  if (flag) {
                    _this.callFlag = true;
                  }
                  _this.formData.applicationNum = result.data.applicationNum;
                  _this.formData.status = result.data.applicationStatus;
                } else if (result.code === 400) {
                  this.$message(result.message);
                } else {
                  this.$message(result.message);
                  // 其他问题
                }
              })
            }
          } else {
            this.$message.error('请完善信息！');
            return false;
          }
        })
      },

      // 提交保存确认
      subOrCloses(ruleForm, flag, text) {
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitForm(ruleForm, flag)
        }).catch(() => {
        })
      },

      // 提交撤回确认
      subOrCancel(ruleForm, flag, text) {
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.reSubmit(ruleForm, flag)
        }).catch(() => {
        })
      },
      reSubmit() {
        var _this = this;
        this.formData.file.length > 0
          ? this.$refs.ruleForm.clearValidate("file")
          : "";
        this.$refs[ruleForm].validate(valid => {
          console.log(1)
          if (_this.tableData.length > 0) {

            var user = JSON.parse(localStorage.getItem('user'))
            if (flag) { // 提交
              let params = {
                changeProcess: {
                  applicationNum: _this.formData.applicationNum,
                  id: _this.submitSuccessId,
                  applicationDate: _this.formData.applyDate,
                  subject: _this.formData.subject,
                  applicant: user.id,
                  applicantName: _this.formData.applyUser,
                  applicantPhone: _this.formData.telephone,
                  businessManager: _this.BGJingLi.usrId,
                  businessName: _this.BGJingLi.name
                },
                assetsList: _this.tableData
              }
              if (_this.isModule && !this.BGJingLi.name) {
                this.$message.error('请您选择模块业务经理！');
                return
              }
              console.log(2)
              for (var i = 0; i < params.assetsList.length; i++) {
                if (!params.assetsList[i].positionCode || !params.assetsList[i].nowUsingMan) {
                  alert('请完善数据！')
                  return
                }
              }
              console.log(3)
              axiosPost("process/changeProcess/resubmit", params).then(result => {
                if (result.code === 200) {
                  this.$message.success("操作成功！");
                  _this.submitSuccessId = result.data.id;
                  // _this.submitFlag = false;
                  _this.formData.applicationNum = result.data.applicationNum;
                  _this.formData.status = result.data.applicationStatus;
                  _this.callFlag = true;
                } else {
                  this.$message(result.message);
                }
              });
            } else { // 撤回
              let params = {
                processInstanceId: this.$route.query.instanceId,
                deleteReason: '',
                id: _this.submitSuccessId,
                applicationNum: _this.formData.applicationNum
              }
              axiosPost("process/changeProcess/closeProcess", params).then(result => {
                if (result.code === 200) {
                  this.$message.success("操作成功！");
                  this.$router.push({path: 'needdealt'})
                } else {
                  this.$message(result.message);
                }
              })
            }
          } else {
            this.$message.error('请选择设备信息！');
            return false;
          }
        })
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
        console.log(response);
        _this.fileRefIds.push(response.data[0].id);
        console.log(_this.fileRefIds);
        this.formData.uploadFile = filelist;
      },

      handleFileRemove(response, fileList) {
        var _this = this;
        _this.fileRefIds.forEach((item, index) => {
          if (item == response.response.data[0].id) {
            console.log(item);
            _this.fileRefIds.splice(index, 1);
          }
        });
      },

      beforeFileRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },

      // 现使用人单选
      handleNodeClick(data, checked, node) {
        if (checked === true) {
          this.checkedId = data.id;
          this.$refs.tree.setCheckedKeys([data.id]);
        } else {
          if (this.checkedId == data.id) {
            this.$refs.tree.setCheckedKeys([data.id]);
          }
        }
      },

      // 表格删除
      delList() {
        if (this.arr) {
          this.arr.forEach(item => {
            if (this.tableData) {
              this.tableData.forEach((val, index) => {
                if (item === val.index) {
                  this.tableData.splice(index, 1)
                  this.formData.file = []
                  localStorage.setItem('eqarr', JSON.stringify(this.tableData))
                  if (this.tableData.length === 0) {
                    this.$router.push({path: '/sbChange'})
                    this.addFlag = false
                    this.importFlag = false
                  }
                }
              })
            }
          })
        }
      },

      // 位置编码
      changeSelect(event, index) {
        console.log(event, index)
        let obj = {}
        obj = this.positionCode.find((item) => {
          return item.value === event
        })
        this.tableData.forEach(item => {
          if (item.index === index) {
            item.locationName = obj.label
          }
        })
        console.log(obj.value)
        console.log(obj.label)
      },

      // 使用人
      changepeoSelect(event, index) {
        console.log(event, index)
        let obj = {}
        obj = this.nowUsingMan.find((item) => {
          return item.name === event
        })
        this.tableData.forEach(item => {
          if (item.index === index) {
            item.module = obj.deptName
          }
        })
        for (var i = 0; i < this.tableData.length; i++) {
          if (!this.tableData[i].nowUsingMan) {
            this.tableData[i].nowUsingMan = event
            this.tableData[i].module = obj.deptName
          }
        }
      },

      // 新增按钮跳转
      addrouter() {
        // ' + this.flag + '
        // &applicationNum='+this.paramList.applicationNum
        this.$router.push({path: '/equipmentQuery?flag=' + this.flag + '&subject=' + this.formData.subject + '&isCaoGao=true'})
        localStorage.setItem('eqarr', JSON.stringify(this.tableData));
        localStorage.setItem('applicationNum', JSON.stringify(this.paramList.applicationNum));
      }
    },

    created() {
      var _this = this;
      // 从历史 草稿 历史记录不可操作 parmas
      // console.log(this.paramList);
      let formkey = this.$route.query.formKey;
      if (_this.paramList.type == "draft") {
        this.draftList = true;
        _this.getTreeJingLi()
        // 草稿
      } else if(formkey == 'formkey_1') { //撤回 从待办进来
        this.getTreeJingLi();
        this.isTodo = true;
      } else {
        // 历史
        // console.log("历史");
        this.callFlag = true;
        this.draftList = false;
      }

      sessionStorage.clear();
      //申请初始化 processId: "physicalAssetsAcceptance"
      const loading = this.$loading({
        lock: true,
        text: '正在加载...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      if (_this.paramList.applicationNum) {
        _this.applicationNum = _this.paramList.applicationNum
      } else {
        _this.applicationNum = JSON.parse(localStorage.getItem('applicationNum'))
      }
      axiosGet("process/changeProcess/getApproval?applicationNum=" + _this.applicationNum).then(result => {
        if (result.code == 200) {
          loading.close();
          let resultData = result.data
          _this.BGJingLi.name = resultData.changeProcess.businessName
          _this.BGJingLi.usrId = resultData.changeProcess.businessManager
          _this.isModule = resultData.isModule
          console.log(resultData)
          // 新增协带表格数据
          // _this.$route.query.flag
          if (localStorage.getItem('eqarr')) {
            _this.tableData = JSON.parse(localStorage.getItem('eqarr'))
            for (let i = 0, len = _this.tableData.length; i < len; i++) {
              for (let j = i + 1; j < len; j++) {
                if (_this.tableData[i].equipNum == _this.tableData[j].equipNum) {
                  _this.tableData.splice(j, 1)
                  len--;
                  j--;
                }
              }
            }
            console.log(_this.tableData)
            _this.totalCount = _this.tableData.length
            _this.importFlag = true
            _this.tableData.forEach((item, index) => {
              item.index = index
            })
          } else {
            _this.tableData = resultData.changeProcessAssetsList;
          }
          _this.formData.processId = resultData.changeProcess.applicationNum;
          _this.formData.applicationNum = resultData.changeProcess.applicationNum;
          _this.formData.status = resultData.changeProcess.applicationStatus;
          _this.formData.applyDate = resultData.changeProcess.applicationDate;
          _this.formData.subject = resultData.changeProcess.subject;
          _this.formData.applyUser = resultData.changeProcess.applicantName;
          _this.formData.telephone = resultData.changeProcess.applicantPhone;
          _this.flag = resultData.flag;
          _this.submitSuccessId = resultData.changeProcess.id;
          this.getShenPi(_this.formData.applicationNum)  // 获取审批历史
          if (resultData.changeProcessAssetsList.length > 0) {
            _this.importFlag = true;
          } else {
            _this.importFlag = false
          }
        }else{
          loading.close();
          this.$message.error(resultData.data.message);
        }
      });

      // 位置编码
      axiosGet("process/changeProcess/getPositionCode").then(result => {
        if (result.code == 200) {
          _this.purchaseOrder = result.data;
        }
      });
      // 使用人
      axiosGet('base/dept/myTree').then(result => {
        console.log(result.data[0].deptNum)
        if (result.code === 200) {
          axiosGet('base/user/list?deptNum=' + result.data[0].deptNum + '&current=0&size=9999').then(res => {
            console.log(res)
            this.nowUsingMan = res.data.records
          })
        }
      }),
        // 获取所有模板地址
        axiosGet("common/file/template-ex/list").then(result => {
          if (result.code == 200) {
            console.log("获取所有模板__________________");
            _this.templateList = result.data;
          }
        })
    },
    mounted() {

    },
  }
</script>
<style lang="scss">
  .bgBian:hover {
    background: #ccc;
  }

  .bgBian {
    padding-left: 10px;
    cursor: pointer;
  }

  .sb-allocation {
    .row-list {
      .el-form-item__content {
        width: 180px;
      }

      .el-form--inline .el-form-item__content,
      .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100% !important;
      }
    }

    .el-date-editor.el-input {
      width: 180px;
    }

    .el-pagination__editor.el-input .el-input__inner {
      width: 40px !important;
    }

    .btn-group {
      display: block;
      text-align: center;
      margin-top: 20px;
    }

    .el-date-editor.el-input {
      width: 180px;
    }

    .el-pagination__editor.el-input .el-input__inner {
      width: 40px !important;
    }

    .btn-group {
      display: block;
      text-align: center;
      margin-top: 20px;

      .el-button.is-disabled {
        opacity: .6;
      }
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

    .primary-btn.el-button.is-disabled,
    .download.el-button.is-disabled {
      opacity: .6;
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
    .common-collapse {
      .el-collapse-item__header {
        background: #eff2f9;
        padding-left: 8px;
        height: 30px;
        line-height: 30px !important;
      }

      .primary-btn.el-button {
        background: #3a8eff;
        color: #fff;
        border-color: #fff !important;
      }

      .primary-btn.el-button.is-disabled,
      .download.el-button.is-disabled {
        opacity: .6;
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

      .pop-participation {
        .el-dialog {
          width: 1000px;
          height: 615px;

          .p-heading {
            .el-col-8 {
              padding-left: 5px;
              box-sizing: border-box;
            }
          }

          .participation-info {
            > div {
              height: 445px;
              box-sizing: border-box;
              border-left: 2px solid #eee;
              overflow: auto;
            }
          }
        }

        .sb-join {
          position: absolute;
          left: 50%;
          bottom: 30px;
          transform: translateX(-50%);
        }
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
          padding-left: 20px;
        }

        .el-collapse-item__arrow {
          margin: 0 0px 0 -97px;
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

      .import-file {
        border-bottom: 1px solid #eee;
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
          // display: none;
        }
      }

      .el-table__body-wrapper {
        max-height: 480px;
        overflow-y: auto;
      }

      .ment-input {
        width: 90%;
        height: 30px;
        position: absolute;
        top: 10px;
      }
    }

    .diaMan {
      .el-tree {
        height: 300px;
        overflow-y: auto;
      }
    }
  }
</style>
