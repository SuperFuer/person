/*
* @desc: 流程中心-调拨
* @author: zxp
* date:2019-07-20
**/
<style lang="scss" scoped>
  .sb-alloc {
    .sb-el-tree {
      // min-width: 300px;
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

    .primary-btn.el-button.is-disabled,
    .download.el-button.is-disabled {
      opacity: .6;
    }

    .btn-group .el-button.is-disabled {
      opacity: .6;
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
      margin-left: 10px;
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
    .tipError {
      font-size: 12px;
      color: red;
    }
    .addHeighting {
      width: 180px!important;
    }
  }
  .addWidthinged {
    width: 203px!important;
  }
  .goThroughing > span {
    pointer-events: none!important;
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
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" label-width="107px" prop="applicationStatus">
            <el-input v-model="formData.applicationStatus" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间" label-width="107px" prop="applicationDate">
            <el-input v-model="formData.applicationDate" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="主题" label-width="107px" prop="subject">
            <el-input v-model.trim="formData.subject" :disabled="callFlag" class="addHeighting"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人" label-width="107px" prop="applicant">
            <el-input v-model="formData.applicantName" disabled class="addHeighting"></el-input>
            <!-- <el-input v-else v-model="formData.applicant" disabled></el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话" label-width="107px" prop="email">
            <el-input v-model="formData.email" disabled class="addHeighting"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-form-item label="调入部门" label-width="107px" prop="deptName">
        <el-input ref="deptIpt" v-model="formData.deptName" :disabled="callFlag" @focus="dialogParticipation=true"></el-input>
      </el-form-item> -->
      <el-collapse class="common-collapse" v-model="currentCollapse">
        <el-collapse-item name="1" class="active">
          <template slot="title">
            <div class="collapse-title">实物资产信息</div>
          </template>
          <el-form-item label="调入部门" label-width="" :required="true">
            <el-input ref="deptIpt" v-model="formData.deptName" :disabled="callFlag"
                      @focus="dialogParticipation=true"></el-input>
            <p class="tipError" v-show="tipError">调入部门不能为空</p>
          </el-form-item>
          <div class="operate-btns mb10">
            <el-button size="small" type="primary" :disabled="mutual=='import' || callFlag || addFlag" @click="addTable">新增
            </el-button>
            <el-button size="small" type="danger" :disabled="callFlag" @click="deleteTable">删除</el-button>
          </div>
          <!--tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)-->
          <el-table
              ref="multipleSealDetail"
              :data="tableDataList"
              style="width: 100%"
              tooltip-effect="dark"
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
              @selection-change="changeTable"
              class="table-box"
              row-key="sealRowKey"
              v-loading="loading"
          >
            <el-table-column :show-overflow-tooltip='true' type="selection" width="45"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' label="序号" width="55" type="index"></el-table-column>
            <!-- <el-table-column prop="assetNum" label="资产编码" width="120"></el-table-column> -->
            <el-table-column :show-overflow-tooltip='true' prop="equipNum" label="设备编码"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="equipName" label="设备名称"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="installLocDesc" label="原安装地点"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="usingManName"
                             label="原使用人"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="usingDeptName"
                             label="调出部门"></el-table-column>
          </el-table>

          <div class="pagination">
            <el-pagination
                background
                layout="total,prev, pager, next,jumper"
                :page-size="10"
                @current-change="handleCurrentChange"
                :total="tableData.length"
                :current-page.sync="currentPage"
            ></el-pagination>
            <span style="position: absolute;top: 0;left:15px">已选择{{popNumbers}}条</span>
          </div>
        </el-collapse-item>
        <el-collapse-item v-if="!isHistory" name="2" class="active" disabled>
          <template slot="title">
            <div class="collapse-title">批量导入</div>
          </template>
          <el-row>
            <el-col>
              <!-- :action="importTemplateUrl" -->
              <el-form-item label="选择文件" prop="file" class="select-file" ref="templateFile">
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
                    :disabled="callFlag"
                    :auto-upload="false"
                >
                  <el-button
                      :disabled="callFlag || tableDataList.length>0"
                      slot="trigger"
                      size="small"
                      height="28px"
                      class="primary-btn goThroughing"
                      type="primary"
                      @click="getTemplate"
                  >浏览
                  </el-button>
                  <!--                  mutual=='add' ||  || !importFlag-->
                  <el-button
                      size="small"
                      height="28px"
                      class="primary-btn template-upload goThroughing"
                      @click="submitTemplateUpload"
                      :disabled="callFlag || tableDataList.length>0"
                  >导入
                  </el-button>
                </el-upload>
              </el-form-item>
              <el-button
                  size="small"
                  @click="getClickedTemplate()"
                  :disabled="callFlag || tableDataList.length>0"
                  class="download goThroughing"
              >下载模板
              </el-button>
            </el-col>
          </el-row>
        </el-collapse-item>
        <el-collapse-item v-if="isHistory || isTodo" name="2" class="active">
          <template slot="title">
            <div class="collapse-title">审批历史</div>
          </template>
          <el-table
              :data="approveHistory"
              tooltip-effect="dark"
              style="width: 100%"
              class="history"
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
            <el-table-column :show-overflow-tooltip='true' prop="name" label="节点" width="160"></el-table-column>
            <el-table-column  :show-overflow-tooltip='true' prop="assigneeName" label="操作人" width="120"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="formKey" label="操作" width="120"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' prop="endTime" label="操作时间"></el-table-column>
            <el-table-column :show-overflow-tooltip='true' label="审批意见">
<!--              <template slot-scope="scope">-->
<!--                <span>{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion}}</span>-->
<!--              </template>-->
              <template slot-scope="scope" >
                <div v-if="!scope.row.mapVOS[0].approvalOpinion && scope.row.formKey!='待审批'">
                  — —
                </div>
                <a
                    v-else
                    :title="scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion"
                >{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion | ellipsis}}</a>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <el-form-item class="btn-group" v-show="!isHistory">
        <el-button
            @click="subOrClose('ruleForm',false,'是否保存？')"
            size="small"
            class="save-btn"
            :disabled="callFlag"
        >保存
        </el-button>
        <el-button
            @click="subOrClose('ruleForm',true,'是否提交？')"
            size="small"
            class="submit-btn"
            :disabled="callFlag"
        >提交
        </el-button>
      </el-form-item>
      <el-form-item class="btn-group" v-show="isTodo">
        <el-button
            @click="subOrCancel('ruleForm',false,'是否撤回？')"
            size="small"
            type="danger"
            :disabled="callFlag"
        >撤回
        </el-button>
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
        :visible.sync="dialogVisibles"
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
        width="50%"
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
              :filter-node-method="filterNode"
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


    <!-- 新增页面 -->
    <el-dialog title="添加设备" :visible.sync="addPopDialog" width="70%" style="padding-bottom: 20px">
      <div class="seal-query">
        <el-form :inline="true" label-width="80px">
          <div>
            <el-form-item label="设备名称" label-width="80px">
              <el-input v-model="equipNameQuery" class="addWidthinged"></el-input>
            </el-form-item>
            <el-form-item label="设备编码" label-width="80px">
              <el-input
                  style="width:202px"
                  v-if="allOrDanTiao == 0"
                  v-model="equipCodeQuery"
                  class="addWidthinged"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                  placeholder="编码为16位"
              ></el-input>

              <el-button
                  style="width:202px;height:35px;padding:0"
                  @click="dialogVisible = true"
                  v-if="allOrDanTiao > 0"
              >已选择{{allOrDanTiao}}条
              </el-button>

              <span
                  style="padding-left: 10px;cursor: pointer;color: #409EFF;"
                  @click="dialogVisible = true"
                  class="allOder active"
              >批量添加</span>
              <span
                  v-if="allOrDanTiao == 0 && equipCodeQuery.length != 16 && equipCodeQuery.length > 0"
                  style="color:red;font-size: 12px;margin-left: 15px"
              >编码位数错误</span>
            </el-form-item>

            <!-- 弹窗 => 写设备编码 -->
            <el-dialog
                title="添加设备编码"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
                class="addDia"
                append-to-body
            >
              <div v-for="(item,index) in equipment" :key="index">
                <el-input
                    style="display: inline-block;width: 210px"
                    v-model="item.input"
                    placeholder="请输入内容"
                    class="mbinput"
                    onkeyup="value=value.replace(/[^\d]/g,'')"
                ></el-input>
                <span
                    v-if="!item.input || item.input.length==16"
                    style="color:#ccc;font-size: 12px"
                >编码为16位</span>
                <span
                    v-if="item.input && item.input.length!=16"
                    style="color:red;font-size: 12px"
                >编码位数错误</span>
                <i
                    @click="addInput"
                    style="font-size: 25px;margin-left: 15px;vertical-align: middle;color: #409eff;"
                    v-if="index+1 == equipment.length"
                    class="el-icon-circle-plus"
                ></i>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="closeMoble()" size="small">取 消</el-button>
                <el-button type="primary" @click="btnOk" size="small">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <el-form-item label="部门" label-width="80px">
            <el-select :disabled="!admin" class="yanshiZiJi addWidthinged" v-model="departmentQuery"
                       placeholder="请选择">
              <el-option
                  v-for="item in buMenoptions"
                  :key="item.deptNum"
                  :label="item.deptName"
                  :value="item.deptNum">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用人" label-width="80px">
            <el-input class="style_kuan addWidthinged" v-model="ursData.name" @focus="setRenDatas"
                      :disabled="!admin || ursData.name == '部门所有人'"></el-input>
            <span @click="allOder" v-if="admin" style="padding-left: 10px;cursor: pointer;color: #409EFF;"
                  class="allOder active">部门所有人</span>
            <!-- 使用人选择 -->
            <el-dialog
                width="70%"
                title="选择使用人"
                :visible.sync="innerVisible"
                class="pop-participation"
                append-to-body>
              <!--                组织架构组件-->
              <orgstructure ref="getZiZuJianList" v-on:childByValue="childByValue"></orgstructure>
            </el-dialog>
          </el-form-item>
          <el-form-item style="padding-left:10px;position:relative;top:-2px;">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="getSearchData">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="query-title">查询明细</div>
        <el-table ref="multipleTable"
                  :data="tableDatas.slice((popCurrentPage-1)*popPageSize,popCurrentPage*popPageSize)"
                  tooltip-effect="dark"
                  border
                  style="width: 99.9%;"
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
                  @selection-change="handlePopSelect"
                  :row-key="popRowKey"
        >
          <el-table-column
              :show-overflow-tooltip="true"
              type="selection"
              :reserve-selection="true"
              width="55"
          ></el-table-column>
          <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="55"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="equipNum" width="160" label="设备编码"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="equipName" label="设备名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="installLocDesc" label="安装地点"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="usingManName" label="使用人"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="usingDeptName" width="130"
                           label="使用人部门"></el-table-column>
<!--          <el-table-column :show-overflow-tooltip="true" prop="locCode" label="位置编码"></el-table-column>-->
<!--          <el-table-column :show-overflow-tooltip="true" prop="locName" label="位置描述"></el-table-column>-->
        </el-table>
        <!-- 分页 -->
        <div class="pagination" style="position: relative">
          <el-pagination background
                         layout="total, prev, pager, next, jumper"
                         :total="tableDatas.length"
                         :page-size="popPageSize"
                         @current-change="handlePopPagination">
          </el-pagination>
          <span style="position: absolute;top: 0;left:15px">已选择{{popNumber}}条</span>
        </div>
        <div class="el-form-item btn-group center pt20" style="padding-bottom: 30px">
          <el-button type="primary"
                     size="small"
                     @click="submitAdd">添加
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 使用部门弹框 -->
  </div>
</template>
<script>
import {getTime} from "../../common/until";
import {axiosPost, axiosGet, constApi} from "@/api/index.js";
import orgstructure from "@/components/orgstructure"
export default {
  props: {
    paramList: {
      type: Object
    }
  },
  components: {
    orgstructure
  },
  data() {
    return {
      equipCodeMulitQuery: '',
      popNumber: 0, //已选择
      popNumbers: 0, //主页面已选择
      popPageSize: 5,
      popCurrentPage: 1,
      innerVisible: false,  // 选择人弹框控制字段
      ursData: {
        id:[]
      },   // 设备查询默认使用人数据
      departmentQuery: "",
      equipment: [
        {
          // 设备查询 => 设备编码输入框个数
          input: ""
        },
        {
          input: ""
        },
        {
          input: ""
        },
        {
          input: ""
        },
        {
          input: ""
        },
        {
          input: ""
        },
        {
          input: ""
        }
      ],
      dialogVisibles: false,  // 弹框确定 => 下载模板
      dialogVisible: false, // 弹框确定
      allOrDanTiao: 0, // 设备查询 => 设备编码总条数
      equipCodeQuery: '',
      equipNameQuery: "",  // 查询设备名称
      addPopDialog: false, // 添加设备控制弹框页面
      approveHistory: [],  // 审批历史数据
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
        }],
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
      tableDatas: [],
      selection: [],
      checkedtemplates: [],
      templateList: [],
      callFlag: false, //提交之后 所有按钮不可点
      addFlag: false, // 新增 （新增和导入互斥
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
      allotDept: {},
      mutual: '', // 是否互斥
      pageDisabled: false,
      isHistory: false,
      importFlag: false,
      tipError: false,
      isTodo: false,
      applyReason: '',  // 审批意见
      admin: false,
      buMenoptions: [],
      onlyNumber: '',
      filterText: '',  // 树形结构要过滤的节点
    };
  },
  computed:{
    tableDataList () {
      // tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)
      return this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  },
  created() {
    let formkey = this.$route.query.formKey;
    if (localStorage.getItem('allotDept')) this.allotDept = JSON.parse(localStorage.getItem('allotDept'));
    // 如果有参数 说明是从草稿或历史进来 历史 history 禁用 草稿 draft 申请页
    if (this.paramList && this.paramList.type == 'history') {
      this.pageDisabled = true;
      this.isHistory = true;
      this.callFlag = true;
      this.getSaveData();
    } else if (this.paramList && this.paramList.type == 'draft') {
      this.getDeptTree();
      this.mutual = 'add'
      this.isHistory = false;
      this.getSaveData();
      this.getTemplateData(); // 获取所有模板地址
    } else if(formkey && formkey == 'formkey_1') {
      this.getDeptTree();
      this.isHistory = true;
      this.isTodo = true;
      this.getSaveData();
    } else {
      this.getInitData();
      this.getDeptTree();
      this.getTemplateData(); // 获取所有模板地址
      this.mutual = this.$route.query.mutual
    }
    // 获取当前登陆人
    let user = JSON.parse(localStorage.getItem('user'));
    // 当前登陆人所在得模块
    this.filterText = user.deptName;
  },
  methods: {
    // 部门所有人
    allOder() {   // 有问题，待解决
      this.ursData.id = []
      if (this.ursData.name != '部门所有人') {
        // this.$set(this.ursData, 'name', '部门所有人')
        this.ursData = Object.assign({}, this.ursData, { name: '部门所有人', id: [] })
      } else {
        // this.$set(this.ursData, 'name', this.formData.applicantName)
        // this.ursData.id.push(this.formData.applicant);
        this.ursData = Object.assign({}, this.ursData, { name: this.formData.applicantName, id: [this.formData.applicant] })
      }
    },

    submitAdd() {
      this.addPopDialog = false;
      if (this.popMultipleSelect.length < 0) {
        this.$message.error('请勾选查询明细')
      }
      this.ursData.id = []
      this.tableData = this.tableData.concat(this.popMultipleSelect)
      for (let i = 0, len = this.tableData.length; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (this.tableData[i].equipNum == this.tableData[j].equipNum) {
            this.tableData.splice(j, 1);
            len--;
            j--;
          }
        }
      }
      this.xuanZhongRen = []
      this.buMenRenList = []
      this.ursData.name = this.formData.applicantName;
      this.ursData.id.push(this.formData.applicant);
      this.$refs.multipleTable.clearSelection();
      if (this.tableData.length != 0) this.mutual = 'add'
      return this.tableData
    },

    handlePopSelect(val) {
      this.popMultipleSelect = val
      this.popNumber = this.popMultipleSelect.length
    },

    //保存选中的数据equipNum,row-key就是要指定一个key标识这一行的数据
    sealRowKey(row) {
      return row.equipNum;
    },

    popRowKey(row) {
      return row.equipNum;
    },

    handlePopPagination(val) {
      this.popCurrentPage = val;
    },

    addTable() {
      this.addPopDialog = true;
      this.getBuMenList();
    },

    // 搜索设备
    getSearchData() {
      let _this = this;
      let parmas = {
        equipNum:
          this.allOrDanTiao != 0
            ? this.equipCodeMulitQuery
            : this.equipCodeQuery.length > 0
            ? [this.equipCodeQuery]
            : [],
        equipName: this.equipNameQuery,
        deptNum: this.departmentQuery, // "1906",
        usingMan: this.ursData.id,
        flag: this.admin,
        showLoading: true
      };
      // process/scrap/getEquip
      axiosPost("process/changeProcess/getEquip", parmas).then(result => {
        if (result.code == 200) {
          if (result && result.data) {
            _this.tableDatas = result.data;
          } else {
            _this.tableDatas = []
            this.$message.error(result.message);
          }
        } else {
          this.$message.error(result.message);
          _this.tableDatas = [];
        }
      });
    },

    // get子组件数据
    childByValue: function (childValue) {
      if (childValue != '0') {
        let name = [];
        let id = [];
        for (var i = 0; i < childValue.length; i++) {
          name.push(childValue[i].name)
          id.push(childValue[i].usrId)
        }
        this.ursData.name = name.join(',')
        this.ursData.id = id;
      }
      this.innerVisible = false
    },

    // 获取部门列表
    setRenDatas() {
      this.innerVisible = true
      axiosGet("process/scrap/dept/all?prentId=62", {showLoading: true}).then(result => {
        if (result.code == 200) {
          this.buMenList = result.data.data
        }
      })
    },

    // get设备查询初始化
    getBuMenList() {
      let url = 'process/common/init-query'
      axiosGet(url, {}).then(result => {
        if (result.code == 200) {
          this.buMenoptions = result.data.depts   // 登陆人管理设备部门列表数据
          this.admin = result.data.isEqMgr; //如果为true是管理员
          this.ursData.name = result.data.usingManName;   // 登陆人名字
          this.ursData.id.push(result.data.usingMan);   // 登陆人id
          this.buMenoptions.forEach(e => {
            this.departmentQuery = e.deptNum
            // if (e.selected === true) {
            //   this.departmentQuery = e.deptNum
            // }
          })
        }
      })
    },

    // 输入编码查询条件确定
    btnOk() {
      let arr = [];
      for (var i = 0; i < this.equipment.length; i++) {
        if (this.equipment[i].input) {
          if (this.equipment[i].input && this.equipment[i].input.length != 16) {
            this.$message.error(this.equipment[i].input + "信息字数不符");
            return false;
          } else {
            arr.push(this.equipment[i].input);
          }
        }
      }
      this.equipCodeMulitQuery = arr;
      this.dialogVisible = false;
      this.allOrDanTiao = arr.length;
    },

    // 设备编码弹出 新增输入框
    addInput() {
      this.equipment.push({input: ""});
    },

    // 关闭多条设备查询弹框
    handleClose(done) {
      this.dialogVisible = false;
    },

    // 编码输入框点击取消
    closeMoble() {
      var that = this;
      that.dialogVisible = false;
      if (!that.equipCodeQuery) {
        for (var i = 0; i < that.equipment.length; i++) {
          that.equipment[i].input = "";
        }
      }
    },

    // get审批历史
    getShenPi() {
      axiosGet("approvalHistoryController/history?applicationNum=" + this.onlyNumber).then(result => {
        if (result.code === 200) {
          this.approveHistory = result.data;
        } else {
          this.$message.error(result.message)
        }
      });
    },

    //查询保存数据
    getSaveData() {
      var getList = {
        showLoading: true,
      }
      axiosGet("exdept/getApproval?applicationNum=" + this.paramList.applicationNum, getList).then(result => {
        if (result.code == 200) {
          this.onlyNumber = result.data.deptTransferApplyForm.applicationNum;
          this.getShenPi();
          this.formData = result.data.deptTransferApplyForm;
          this.applicationNum = this.formData.applicationNum;
          this.tableData = result.data.deptTransferAssetInfoList;
          this.formData.deptName = result.data.deptTransferApplyForm.inDeptName;
          this.formData.deptNum = result.data.deptTransferApplyForm.inDeptId;
          this.saveId = result.data.deptTransferApplyForm.id;
        } else {
          this.$message.error(result.message)
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
          this.formData = result.data;
          if (this.allotDept && this.allotDept.deptName) {
            this.formData.deptName = this.allotDept.deptName;
            this.deptName = this.allotDept.deptName;
            this.formData.deptNum = this.allotDept.deptNum;
            this.formData.subject = this.allotDept.subject;
          }
          if (this.allotDept.subject) this.formData.subject = this.allotDept.subject;
          // if (localStorage.getItem('equipList')) {
          //   this.tableData = JSON.parse(localStorage.getItem('equipList'))
          // }
          loading.close();
        } else {
          loading.close();
        }
      });
    },
    //获取模板
    getTemplateData() {
      axiosGet("common/file/template-oex/list").then(result => {
        if (result.code == 200) {
          this.templateList = result.data;
        } else {
        }
      });
    },
    //获取部门树结构
    getDeptTree() {
      axiosGet("exdept/dept-tree?dept=true").then(result => {
        if (result.code == 200) {
          console.log(result.data)
          for(var i = 0; i < result.data[0].children.length; i++) {
            var a = result.data[0].children[i];
            if(a.name == this.filterText) {
              result.data[0].children.splice(i, 1);
              break;
            }
          }
          this.participantList = result.data[0].children;
        } else {
        }
      });
    },
    //点击最左侧树结构
    handleNodeClick(data) {
      this.currentDepartment = {
        name: data.name,
        deptNum: data.deptNum
      }
    },
    // 部门选择确定
    getCheckedDept() {
      this.formData.deptNum = this.currentDepartment.deptNum;
      this.formData.deptName = this.currentDepartment.name;
      this.dialogParticipation = false;
      this.tipError = false;
      // localStorage.setItem('deptName', this.formData.deptName);
      // localStorage.setItem('deptNum', this.formData.deptNum);
    },
    changeTable(val) {
      this.selection = val;
      this.popNumbers = this.selection.length;
    },
    deleteTable() {
      if (!this.selection.length) {
        this.$message.warning('请选择删除项！');
        return;
      }
      this.selection.forEach((list) => {
        this.tableData.forEach((item, index) => {
          if (item.equipNum == list.equipNum) {
            this.tableData.splice(index, 1)
          }
        })
      })
        if (this.tableData.length == 0) {
          this.mutual = '',
          this.addFlag = false,
          this.importFlag = false
          this.$refs.template.clearFiles();
        }
        this.$refs.multipleSealDetail.clearSelection();
    },

    // 选择单个模板进行下载
    getClickedTemplate(value) {
      var _this = this;
      if (_this.templateList.length > 0) {
        var url = _this.templateList[0].url;
      }
      var loading = this.$loading({
        lock: true,
        text: '下载中，请稍后...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      axiosGet(url).then(result => {
        if (result.code == 200) {
          window.location.href = _this.constApi + result.data;
          loading.close();
        }
      });
      // if (value == "selected") {
      //   _this.submitTemplate = _this.checkedtemplates;
      //   axiosGet(_this.submitTemplate).then(result => {
      //     if (result.code == 200) {
      //       window.location.href = _this.constApi + result.data;
      //     }
      //   });
      // } else {
      //   _this.checkedtemplates = _this.submitTemplate;
      // }
      // _this.dialogVisible = false;
    },
    // 选择模板
    handleCheckedTemplates(value) {
      var _this = this;
      _this.checkedtemplates = value;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleTemplatePreview(file) {
    },

    /***********分割线*************/
    submitTemplateUpload() {
      this.$refs.template.submit();
      this.tableData = [];
    },
    // 上传模板之前
    beforeTemplateUpload(file) {
      this.tableData = [];
    },
    // 导入模板成功
    templateImportSuccess(response, file, filelist) {
      console.log(this.formData.file)
      var _this = this;
      if (response.code === 200) {
        _this.$message({
          message: '导入成功',
          type: 'success'
        });
        _this.formData.file = filelist;
        _this.mainTemplatecachedId = response.data.cacheId;
        _this.tableData = response.data;
        this.$refs.ruleForm.clearValidate("file");
        this.mutual = 'add';
        this.addFlag = true;
      } else if (response.code == 500) {
        this.$alert(response.data[0], "错误", {
          confirmButtonText: "确定",
          callback: action => {
          }
        });
      } else {
        this.$message.error(response.data);
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
      this.addFlag = false;
      this.$refs.template.clearFiles();
      this.tableData = [];
      // this.mutual = "import";
      if (this.mutual == 'add') return;
      this.importFlag = true;
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
          if (this.formData.deptName) {
            this.tipError = false
            this.formData.inDeptId = _this.formData.deptNum;
            let params = {
              flag: flag,
              deptTransferApplyForm: _this.formData,
              deptTransferAssetInfos: _this.tableData,
              id: _this.saveId,
              applicationNum: _this.applicationNum,
            };
            axiosPost("/exdept/submit", params).then(result => {
              if (result.code === 200) {
                _this.$set(_this.formData, "applicationNum", result.data.applicationNum);
                _this.$set(_this.formData, "applicationStatus", result.data.applicationStatus);
                // _this.formData.applicationNum = result.data.applicationNum;
                // _this.formData.applicationStatus = result.data.applicationStatus;
                _this.$message.success('操作成功！');
                if (flag) {
                  _this.callFlag = true;
                }
                _this.saveId = result.data.id;
                _this.$set(_this, "applicationNum", result.data.applicationNum);
              } else {
                _this.$message(result.message);
              }
            });
          } else {
            this.tipError = true
            this.$message({
              type: 'info',
              message: '请完善必填数据！'
            });
          }
        } else {
          this.$message({
            type: 'info',
            message: '请完善必填数据！'
          });
          return false;
        }
      });
    },

    // 提交确认
    subOrClose(ruleForm, flag, text) {
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
    },
    //文件上传成功
    submitUpload() {
      this.$refs.upload.submit();
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
    /**
     * 撤销、提交
     */
    // 提交或者撤回
    subOrCancel(ruleForm, flag, text) {
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(flag) {
          this.reSubmit();
        } else {
          this.cancelSubmit();
        }
      }).catch(() => {
      });
    },
    // 撤回
    cancelSubmit() {
      var _this = this;
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
          processInstanceId: this.$route.query.instanceId,
          deleteReason: _this.applyReason,
          id: _this.saveId,
          applicationNum: _this.formData.applicationNum,
        }

       axiosPost("exdept/closeProcess", params).then(result => {
        if (result.code === 200) {
          _this.$message.success("操作成功！");
          _this.$router.push({path: 'needdealt'})
          _this.callFlag = true;
        } else {
          _this.$message.warning(result.message);
        }
      })
    },
    // 被驳回之后得提交
    reSubmit() {
      var _this = this;
      let user = JSON.parse(localStorage.getItem('user'))
      let params = {
          taskId: this.$route.query.id,
          deptTransferApplyForm: {
            applicationDate: _this.formData.applicationDate,
            subject: _this.formData.subject,
            applicant: user.id,
            id: _this.saveId,
            applicantName: _this.formData.applicantName,
            applicantPhone: _this.formData.email,
            applicationNum: _this.formData.applicationNum || '',
            reason: _this.applyReason,
            inDeptId: _this.formData.deptNum,
            deptName: _this.formData.deptName
          },
          deptTransferAssetInfos: _this.tableData
        }

       axiosPost("exdept/resubmit", params).then(result => {
        if (result.code === 200 && result.data) {
          this.$message.success("操作成功！");
          // if (flag) _this.callFlag = true;
          // this.$refs.commonHistory.getApprovalHistory();
          _this.submitSuccessId = result.data.id;
          _this.$set(_this.formData, "applicationNum", result.data.applicationNum);
          _this.$set(_this.formData, "applicationStatus", result.data.applicationStatus);
          this.getShenPi();
        } else {
          this.$message.warning(result.message);
        }
      })
    },
    // 树形结构节点过滤
    filterNode:function (value,data) {
      if (value) return true;
      // return data.nodeName.indexOf(value) !== -1;
    },
  },

};

</script>
