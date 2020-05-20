<!--
 * @Description:
 * @Version:
 * @Autor: louisyi
 * @Date: 2019-08-27 14:13:11
 * @LastEditors: louisyi
 * @LastEditTime: 2019-08-28 10:09:36
 -->
<template>
  <div class="unsealing-pagesss">
    <div class="form-title">
      <i class="icon"></i>实物资产报废处置申请
    </div>
    <el-form ref="ruleForm"
             :model="formData"
             :inline="true"
             style="width:99%"

             :rules="rules">
      <el-row class="common-row">
        <el-col :span="8">
          <el-form-item label="申请编号"
                        label-width="107px"
                        prop="application">
            <el-input v-model="formData.applicationNum"
                      disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" label-width="107px" prop="tatus">
            <el-input v-model="formData.applicationStatus" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间"
                        label-width="107px"
                        prop="applicationDate">
            <el-input v-model="formData.applyTime"
                      disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row class="common-row"
              style="margin-bottom:12px;">
        <el-col :span="8">
          <el-form-item label="主题"
                        label-width="107px"
                        prop="subject">
            <el-input v-model.trim="formData.subject"
                      :disabled="postAjaxYes || historyLiShi || chehuiOrLiShi"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人" label-width="107px" prop="applicantName">
            <el-input v-model="formData.applicantName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话" label-width="107px" prop="applicantPhone">
            <el-input v-model="formData.applicantPhone" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse class="common-collapse" v-model="currentCollapse">
        <el-collapse-item name="1" class="active">
          <template slot="title">
            <div class="collapse-title">实物资产信息</div>
          </template>


          <div style="margin-bottom: 10px">
            <span>设备报废处置方式：</span>
            <el-select :disabled="historyLiShi || postAjaxYes" v-model="chuZhiFangShi" placeholder="请选择"
                       style="padding-left: 8px" class="tiaoYangShi">
              <el-option
                  v-for="item in chuZhiFangShiData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
              </el-option>
            </el-select>
          </div>


          <div class="operate-btns mb10">
            <el-button
                size="small"
                type="primary"
                @click="addSealEquip"
                :disabled="postAjaxYes || historyLiShi || (callFlag && sealDetailList.length>0)"
                :style="{'opacity':postAjaxYes || historyLiShi ? 0.6 : 1}"
            >新增
            </el-button>
            <el-button
                size="small"
                type="danger"
                :disabled="postAjaxYes || historyLiShi"
                @click="delSealEquip"
                :style="{'opacity':postAjaxYes || historyLiShi ? 0.6 : 1}"
            >删除
            </el-button>
            <p style="float:right;font-weight: 700;margin-right:20px">报废处置总金额：<span
                style="font-weight: 100">{{allQian}}</span></p>
          </div>
          <el-table ref="multipleSealDetail"
                    :data="sealDetailList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                    style="width: 100%"
                    border
                    tooltip-effect="dark"
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
              'font-size':'12px'}"
                    @selection-change="handleSelectionChange"
                    :row-key="sealRowKey"
                    class="Fbaofeichuzhi"
          >
            <el-table-column
                :reserve-selection="true"
                :show-overflow-tooltip="true"
                type="selection"
                width="45"
            ></el-table-column>
            <el-table-column label="序号" width="55" type="index"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="equipNum" width="160" label="设备编码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="equipName" label="设备名称"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="usingManName" label="使用人"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="usingDeptName" label="使用人部门"
                             width="110"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="installLocDesc" label="安装地点"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="purchasePrice" label="采购价格"></el-table-column>
            <el-table-column label="处置金额" width="150">
              <template slot-scope="scope">
                <el-input-number v-model.trim="scope.row.handleAccout"
                                 @change="setAllQian"
                                 :disabled="postAjaxYes || historyLiShi"
                                 controls-position="right"
                                 :precision="2"
                                 :step="0"
                                 :min="0"
                                 :max="999999999.00"
                                 placeholder="0.00">
                </el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="资产回收单位" width="150">
              <template slot-scope="scope">
                <el-input v-model="scope.row.retrieveOrg"
                          :disabled="postAjaxYes || historyLiShi" placeholder="请输入内容"
                          maxlength="20"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="处置日期" width="150">
              <template slot-scope="scope">
                <div class="block Finput" style="width:130px">
                  <el-date-picker :clearable="false" :disabled="postAjaxYes || historyLiShi"
                                  v-model="scope.row.handleDate" type="date" placeholder="选择日期"
                                  value-format="yyyy-MM-dd"></el-date-picker>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination" style="position: relative">
            <el-pagination background
                           layout="total,prev, pager, next,jumper"
                           :page-size="pageSize"
                           :total="sealDetailList.length"
                           :current-page.sync="currentPage"
                           @current-change="handlePaginationChange">
            </el-pagination>
            <span style="position: absolute;top: -10px;left:15px">已选择{{multipleSelection.length}}条</span>
          </div>

        </el-collapse-item>

        <el-collapse-item name="2" disabled>
          <template slot="title">
            <div class="collapse-title">批量导入</div>
          </template>
          <el-row>
            <el-col>
              <!-- :action="importTemplateUrl" -->
              <el-form-item label="选择文件" prop="file" class="select-file">
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
                    :disabled="callFlag || sealDetailList.length>0"
                    :auto-upload="false"
                >
                  <el-button
                      :disabled="callFlag || sealDetailList.length>0"
                      slot="trigger"
                      size="small"
                      height="28px"
                      class="primary-btn"
                      @click="getTemplate"
                  >浏览
                  </el-button>
                  <el-button
                      size="small"
                      height="28px"
                      class="primary-btn template-upload"
                      @click="submitTemplateUpload"
                      :disabled="callFlag || sealDetailList.length>0"
                      :style="{'opacity':callFlag?0.6:1}"
                  >导入
                  </el-button>
                </el-upload>
              </el-form-item>
              <el-button
                  size="small"
                  @click="downMoBan"
                  :disabled="callFlag || sealDetailList.length>0"
                  class="download"
                  :style="{'opacity':callFlag?0.6:1}"
              >下载模板
              </el-button>
            </el-col>
          </el-row>
        </el-collapse-item>

        <el-collapse-item name="3" disabled>
          <template slot="title">
            <div class="collapse-title">添加备注</div>
          </template>
          <el-row>
            <el-col style="position: relative">
              <el-input type="textarea" :disabled="postAjaxYes || historyLiShi" v-model="filterAddComment" :row="2"
                        resize="none"></el-input>
              <span style="position: absolute;right: 15px;bottom: 5px">{{currentWord}}/{{100}}</span>
            </el-col>
          </el-row>
        </el-collapse-item>

        <!-- 审批历史 star-->
        <el-collapse-item name="4" v-if="historyLiShi || chehuiOrLiShi" disabled>
          <template slot="title">
            <div class="collapse-title">审批历史</div>
          </template>
          <el-row>
            <el-table
                :data="approveHistory"
                tooltip-effect="dark"
                style="width: 99.9%;margin-bottom: 25px"
                class="history"
                v-if="historyLiShi || chehuiOrLiShi"
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
            }">
              <el-table-column width="100">
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
              <el-table-column :show-overflow-tooltip="true" prop="name" label="节点" width="160"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="assigneeName" label="操作人"
                               width="120"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="formKey" label="操作" width="120"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="endTime" label="操作时间" width="150"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" label="审批意见">
                <template slot-scope="scope">
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
          </el-row>
        </el-collapse-item>
        <el-collapse-item name="5" v-if="historyLiShi && draftCaoGao" disabled>
          <template slot="title">
            <div class="collapse-title">审批意见</div>
          </template>
          <div style="text-align: right">
            <el-button :disabled="disabled" type="text" icon="el-icon-plus" @click="ideaFill('同意')">同意</el-button>
            <el-button :disabled="disabled" type="text" icon="el-icon-plus" @click="ideaFill('不同意')">不同意</el-button>
            <el-button :disabled="disabled" type="text" icon="el-icon-plus" @click="ideaFill('设备已确认')">设备已确认</el-button>
          </div>
          <el-row v-if="historyLiShi">
            <el-col :span="24" style="position: relative">
              <el-input :disabled="disabled" v-model.trim="approvalOpinion" width="100%" type="textarea"></el-input>
              <span style="position: absolute;right: 15px;bottom: 5px">{{currentWords}}/{{100}}</span>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>

      <div class="btns" v-if="historyLiShi && draftCaoGao && !cheHuiOrTiJiao">
        <el-button
            size="small"
            type="warning"
            @click="confirmSubmit(false,'是否驳回？')"
            :disabled="disabled"
        >驳回
        </el-button>
        <el-button
            type="primary"
            size="small"
            @click="confirmSubmit(true,'是否提交？')"
            :disabled="disabled"
        >提交
        </el-button>
      </div>

      <el-form-item v-if="!historyLiShi && !cheHuiOrTiJiao" class="btn-group">
        <el-button
            @click="submitForm('ruleForm',false,'是否保存？')"
            size="small"
            class="save-btn"
            :disabled="postAjaxYes || historyLiShi"
            :style="{'opacity':postAjaxYes || historyLiShi ? 0.6 : 1}"
        >保存
        </el-button>
        <el-button
            @click="submitForm('ruleForm',true,'是否提交？')"
            size="small"
            class="submit-btn"
            :disabled="postAjaxYes || historyLiShi"
            :style="{'opacity':postAjaxYes || historyLiShi ? 0.6 : 1}"
        >提交
        </el-button>
      </el-form-item>


      <el-form-item v-if="cheHuiOrTiJiao" class="btn-group">
        <el-button
            @click="submitForm('ruleForm',false,'是否撤回？')"
            size="small"
            class="save-btn"
            :disabled="postAjaxYes || historyLiShi"
            :style="{'opacity':postAjaxYes || historyLiShi ? 0.6 : 1}"
            type="danger"
            style="background: #F56C6C"
        >撤回
        </el-button>
        <el-button
            @click="submitForm('ruleForm',true,'是否提交？')"
            size="small"
            class="submit-btn"
            :disabled="postAjaxYes || historyLiShi"
            :style="{'opacity':postAjaxYes || historyLiShi ? 0.6 : 1}"
        >提交
        </el-button>
      </el-form-item>

    </el-form>
    <!-- 新增页面 -->
    <el-dialog :close-on-click-modal='false'
               :close-on-press-escape='false' title="添加设备" :visible.sync="addPopDialog" width="70%">
      <div class="seal-query">
        <el-form :inline="true"
                 label-width="80px">
          <div>
            <el-form-item label="设备名称" label-width="80px">
              <el-input style="width: 202px" v-model="equipNameQuery"></el-input>
            </el-form-item>
            <el-form-item label="设备编码" label-width="80px">
              <el-input
                  style="width:202px"
                  v-if="allOrDanTiao == 0"
                  v-model="equipCodeQuery"
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
                :close-on-click-modal='false'
                :close-on-press-escape='false'
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
            <el-select style="width:202px; !important;" :disabled="!admin" class="yanshiZiJi" v-model="departmentQuery" filterable
                       placeholder="请选择">
              <el-option
                  v-for="item in buMenoptions"
                  :key="item.id"
                  :label="item.deptName"
                  :value="item.deptNum">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用人" label-width="80px">
            <el-input class="style_kuan" v-model="ursData.name" style="width:202px" @focus="setRenDatas"
                      :disabled="!admin || ursData.name == '部门所有人'"></el-input>
            <span @click="allOder" v-if="admin" style="padding-left: 10px;cursor: pointer;color: #409EFF;"
                  class="allOder active">部门所有人</span>
            <!-- 使用人选择 -->
            <el-dialog
                :close-on-click-modal='false'
                :close-on-press-escape='false'
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
                  :data="tableData.slice((popCurrentPage-1)*popPageSize,popCurrentPage*popPageSize)"
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
        <!-- <div>已选择：{{popNumber}}</div> -->
        <!-- 分页 -->
        <div class="pagination" style="position: relative">
          <el-pagination background
                         layout="total, prev, pager, next, jumper"
                         :total="tableData.length"
                         :page-size="popPageSize"
                         @current-change="handlePopPagination">
          </el-pagination>
          <span style="position: absolute;top: 0;left:15px">已选择{{popNumber}}条</span>
        </div>
        <div class="el-form-item btn-group center pt20">
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
import filter from '../../common/filter'
import { axiosPost, axiosGet, constApi } from '@/api/index.js'
import orgstructure from '@/components/orgstructure'

export default {
  props: {
    paramList: Object
  },
  components: {
    orgstructure
  },
  data: function () {
    return {
      chehuiOrLiShi: false,
      cheHuiOrTiJiao: false,  // 驳回到第一申请人控制撤回按钮
      disabled: false,  // 审批后禁用
      allQian: '00.00',   // 处置总金额
      handleDate: new Date(),
      constApi: constApi,  // 域名
      approveHistory: [],  // 申请历史数据
      postAjaxYes: false,  // 提交成功后控制页面不可操作
      draftCaoGao: false, // 从草稿进入页面度额判断参数
      historyLiShi: false,  // 从历史进入页面的判断参数
      innerVisible: false,  // 选择人弹框控制字段
      buMenList: [],  // 全部部门列表
      buMenRenList: [], // 部门下所有人列表
      xuanZhongRen: [], // 选中的人
      buMenoptions: [], // 的路人管理部门列表
      callFlag: false,
      currentCollapse: ['1', '2', '3', '4', '5'],
      admin: false, //是否是管理员
      saveId: '',
      formData: {
        applicationNum: '',
        applicationStatus: '',
        applicationDate: '',
        subject: '',
        applicant: '',
        applicantName: '',
        tele: ''
      },
      rules: {
        subject: [{
          required: true,
          message: '主题不能为空',
          trigger: ['blur', 'change']
        }, {
          min: 6,
          max: 50,
          message: '申请主题长度为 6 - 50 个字符',
          trigger: ['blur', 'change']
        }]
      },
      addComment: '',
      addComments: '',
      currentWord: 100,
      currentWords: 100,
      addPopDialog: false,
      multipleSelection: [], //选择封存checkbox--list
      sealDetailList: [], //列表
      currentPage: 1,
      pageSize: 10,
      delectDetailList: [],
      tableData: [],
      popMultipleSelect: [],
      popCurrentPage: 1,
      popPageSize: 5,
      popNumber: 0, //已选择
      allOrDanTiao: 0,
      equipCodeQuery: '',
      equipCodeMulitQuery: [],  // 设备编码查询条件数组popRowKey
      dialogVisible: false,
      equipment: [
        {
          // 设备查询 => 设备编码输入框个数
          input: ''
        },
        {
          input: ''
        },
        {
          input: ''
        },
        {
          input: ''
        },
        {
          input: ''
        },
        {
          input: ''
        },
        {
          input: ''
        }
      ],
      equipNameQuery: '',
      departmentQuery: '',
      userQuery: '',
      ursData: {},   // 设备查询默认使用人数据
      importTemplateUrl: constApi + 'process/scraphandle/import', // 导入文件ajax地址
      // importTemplateUrl: constApi + "process/scrap/import", // 导入文件ajax地址
      headers: {   // ajax header中的token
        token: localStorage.getItem('token')
      },
      chuZhiFangShiData: [],
      chuZhiFangShi: ''
    }
  },
  methods: {
    // 下载导入模板
    downMoBan () {
      axiosGet('common/file/template-scrh/scrap_handle.xlsx', { showLoading: true }).then(ret => {
        console.log(ret)
        if (ret.code == 200) {
          window.location.href = this.constApi + ret.data
        } else {
          this.$message.error(ret.message)
        }
      })
    },

    // 确认/驳回 根据value判断
    confirmSubmit (flag, text) {
      let status = flag ? 'Y' : 'N'
      if (status === 'N' && !this.approvalOpinion) {
        this.$message.error('审批意见不能为空！')
        return
      }
      // 全部必填信息完成
      this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.setHeLiuTiJiao(status)
        })
        .catch(() => {
          this.messageTip('已取消')
        })
    },

    // 审批的提交Or驳回
    setHeLiuTiJiao (status) {
      let postList = {
        'taskId': this.$route.query.id,
        'groupTask': false,
        'circulationConditions': status,
        'localVariablesParam': { 'approvalOpinion': this.approvalOpinion },
        'showLoading': true
      }
      axiosPost('process/scraphandle/audit', postList).then(result => {
        if (result.code == 200 && result.data) {
          this.disabled = true
          this.getShenPi(this.$route.query.applicationNum)
          this.$message.success('操作成功！')
        } else {
          this.$message.warning(result.message)
        }
      })
    },

    // 审批意见填充
    ideaFill (val) {
      this.approvalOpinion += val
      console.log(this.approvalOpinion)
    },

    // 设置总处置钱数
    setAllQian () {
      this.allQian = 0
      for (var i = 0; i < this.sealDetailList.length; i++) {
        if (this.sealDetailList[i].handleAccout) {
          this.allQian += this.sealDetailList[i].handleAccout * 1
        }
      }
    },

    // 删除选中人
    handleCloseList (tag) {
      this.xuanZhongRen.splice(this.xuanZhongRen.indexOf(tag), 1)
    },

    // 选择使用人
    setPartments (val) {
      this.xuanZhongRen.push(val)
      this.xuanZhongRen = Array.from(new Set(this.xuanZhongRen))
    },

    // 根据部门获取部门下人员
    getRenYuanList (id) {
      axiosGet('process/scrap/dept/allUser?deptNum=' + id, { showLoading: true }).then(result => {
        if (result.code == 200) {
          this.buMenRenList = result.data.data
          this.xuanZhongRen = []
        }
      })
    },

    // 获取部门列表
    setRenDatas () {
      this.innerVisible = true
      axiosGet('process/scrap/dept/all?prentId=62', { showLoading: true }).then(result => {
        if (result.code == 200) {
          this.buMenList = result.data.data
        }
      })
    },

    // 选择使用人 - 确定
    departmentOk () {
      // this.$refs.getZiZuJianList.
      let name = []
      let id = []
      for (var i = 0; i < this.xuanZhongRen.length; i++) {
        name.push(this.xuanZhongRen[i].name)
        id.push(this.xuanZhongRen[i].applicant)
      }
      this.ursData.name = name.join(',')
      this.ursData.id = id
      console.log(this.ursData)
      this.innerVisible = false
    },

    // 选择使用人-取消
    departmentClose () {
      this.xuanZhongRen = []
      this.innerVisible = false
    },

    // 部门所有人
    allOder () {   // 有问题，待解决
      this.ursData.id = []
      if (this.ursData.name == '部门所有人') {
        // this.$set(this.ursData, 'name', this.formData.applicantName)
        // this.ursData.id.push(this.formData.applicant)
        this.ursData = Object.assign({}, this.ursData, {
          name: this.formData.applicantName,
          id: [this.formData.applicant]
        })
      } else {
        // this.$set(this.ursData, 'name', '部门所有人')
        this.ursData = Object.assign({}, this.ursData, { name: '部门所有人', id: [] })
      }
    },

    // 保存选中的数据equipNum,row-key就是要指定一个key标识这一行的数据
    sealRowKey (row) {
      return row.equipNum
    },
    popRowKey (row) {
      return row.equipNum
    },

    // 输入编码查询条件确定
    btnOk () {
      let arr = []
      for (var i = 0; i < this.equipment.length; i++) {
        if (this.equipment[i].input) {
          if (this.equipment[i].input && this.equipment[i].input.length != 16) {
            this.$message.error(this.equipment[i].input + '信息字数不符')
            return false
          } else {
            arr.push(this.equipment[i].input)
          }
        }
      }
      this.equipCodeMulitQuery = arr
      this.dialogVisible = false
      this.allOrDanTiao = arr.length
    },

    // 编码输入框点击取消
    closeMoble () {
      var that = this
      that.dialogVisible = false
      if (!that.equipCodeQuery) {
        for (var i = 0; i < that.equipment.length; i++) {
          that.equipment[i].input = ''
        }
      }
    },

    // 关闭多条设备查询弹框
    handleClose (done) {
      this.dialogVisible = false
    },

    // 设备编码弹出 新增输入框
    addInput () {
      this.equipment.push({ input: '' })
    },

    // 新增
    addSealEquip () {
      this.addPopDialog = true
      this.getBuMenList()
    },

    // 搜索设备
    getSearchData () {
      let _this = this
      let parmas = {
        equipNum:
          this.allOrDanTiao != 0
            ? this.equipCodeMulitQuery.join(',')
            : this.equipCodeQuery.length > 0
            ? this.equipCodeQuery
            : '',
        equipName: this.equipNameQuery,
        deptNum: this.departmentQuery, // "1906",
        usingMan: this.ursData.id.length ? this.ursData.id.join(',') : '',
        flag: this.admin,
        showLoading: true
      }
      console.log(parmas)
      // process/scrap/getEquip
      axiosPost('process/scraphandle/query-equipment', parmas).then(result => {
        if (result.code == 200) {
          if (result && result.data) {
            _this.tableData = result.data
          } else {
            _this.tableData = []
            _this.messageTip(result.message)
          }
        } else {
          _this.messageTip(result.message)
          _this.tableData = []
        }
      })
    },

    handlePopSelect (val) {
      this.popMultipleSelect = val
      this.popNumber = this.popMultipleSelect.length
    },

    handlePopPagination (val) {
      this.popCurrentPage = val
    },

    submitAdd () {
      this.addPopDialog = false
      this.ursData.id = []
      this.sealDetailList = this.sealDetailList.concat(this.popMultipleSelect)
      for (let i = 0, len = this.sealDetailList.length; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          if (this.sealDetailList[i].equipNum == this.sealDetailList[j].equipNum) {
            this.sealDetailList.splice(j, 1)
            len--
            j--
          }
        }
      }
      this.xuanZhongRen = []
      this.buMenRenList = []
      this.ursData.name = this.formData.applicantName
      this.ursData.id.push(this.formData.applicant)
      this.tableData = []
      this.getNowTime()
      return this.sealDetailList
    },

    // 设备  申请页
    handleSelectionChange (val) {
      this.multipleSelection = val
    },

    // 分页  申请页
    handlePaginationChange (val) {
      this.currentPage = val
    },

    /**
     * 删除查询明细
     */
    delSealEquip () {
      var _this = this
      let arr = []
      if (_this.multipleSelection.length > 0) {
        _this.multipleSelection.forEach(list => {
          _this.sealDetailList.forEach((item, index) => {
            if (item.equipNum == list.equipNum) {
              _this.sealDetailList.splice(index, 1)
            }
          })
        })
        _this.$refs.multipleSealDetail.clearSelection()
      } else {
        this.messageTip('请选择删除选择项!')
      }
      if (_this.sealDetailList.length < 1) {
        _this.callFlag = false
      }
      // this.getNowTime()
    },

    /**
     * 提交表单
     */
    submitForm (ruleForm, flag, text) {
      let _this = this
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (!this.chuZhiFangShi) {
            _this.messageTip('请选择处置方式！')
            return
          }
          if (_this.sealDetailList.length == 0) {
            _this.messageTip('请选择设备！')
            return
          } else {  // 检测是否选择了报废信息
            for (var i = 0; i < _this.sealDetailList.length; i++) {
              if (!_this.sealDetailList[i].handleAccout || !_this.sealDetailList[i].retrieveOrg) {
                if (flag) {
                  _this.messageTip('请完善报废信息！')
                  return
                }
              }
            }
          }
          // 全部必填信息完成
          this.$confirm(text, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              if (this.cheHuiOrTiJiao) {
                this.setTiJiaoOrCheHui(flag)
              } else {
                _this.handleSubmitResult(flag)
              }
            })
            .catch(() => {
              _this.messageTip('已取消')
            })
        }
      })
    },

    // 提交and撤回
    setTiJiaoOrCheHui (flag) {
      let _this = this
      if (!flag) {
        let postList = {
          'id': this.formData.id,  // 申请清单Id
          'processInstanceId': this.$route.query.instanceId,  // 流程实例Id
          'deleteReason': this.chuZhiFangShi,  // 撤回原因
          showLoading: true
        }
        axiosPost('process/scraphandle/recall', postList).then(result => {
          if (result.code == 200) {
            this.getShenPi(this.$route.query.applicationNum)
            this.postAjaxYes = true
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
            this.$router.push({
              path: '/needdealt'
            })
          } else {
            _this.messageTip(result.message)
          }
        })
      } else {
        let postList = {
          'id': this.formData.id,  // 申请清单Id
          'deleteReason': this.chuZhiFangShi,  // 撤回原因
          'taskId': this.$route.query.id,  // 任务id
          'subject': this.formData.subject,   // 流程主题
          'handleWay': this.chuZhiFangShi,   // 处置方式
          'handleSum': this.allQian,   // 处置金额
          'applyComment': this.filterAddComment,  // 申请备注
          'equipments': this.sealDetailList, // 设备信息
          showLoading: true
        }
        axiosPost('process/scraphandle/resubmit', postList).then(result => {
          if (result.code == 200) {
            this.getShenPi(this.$route.query.applicationNum)
            this.postAjaxYes = true
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          } else {
            _this.messageTip(result.message)
          }
        })
      }
    },

    // 提交or保存方法
    handleSubmitResult (flag) {
      let _this = this
      let postList = {
        'id': this.formData.id || '',
        'submit': flag,
        'subject': this.formData.subject,
        'handleWay': this.chuZhiFangShi,
        'handleSum': this.allQian,
        'equipments': this.sealDetailList,
        'applyComment': this.filterAddComment,
        showLoading: true
      }
      axiosPost('process/scraphandle/submit', postList).then(result => {
        if (result.code == 200) {
          _this.$set(_this.formData, 'applicationNum', result.data.applicationNum)  // 提交成功回显申请编号
          _this.$set(_this.formData, 'applicationStatus', result.data.status)   // 提交成功回显状态
          _this.$set(_this.formData, 'id', result.data.id)   // 提交成功主动添加id
          if (flag) {
            this.postAjaxYes = true
          }
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
        } else {
          _this.messageTip(result.message)
        }
      })
    },

    messageTip (tip) {
      this.$message({
        type: 'warning',
        message: tip
      })
    },

    // get设备查询初始化
    getBuMenList () {
      let url = 'process/common/init-query'
      this.ursData.id = []
      axiosGet(url, {}).then(result => {
        if (result.code == 200) {
          this.$refs.multipleTable.clearSelection()
          this.buMenoptions = result.data.depts   // 登陆人管理设备部门列表数据
          this.admin = result.data.isEqMgr //如果为true是管理员
          this.ursData.name = result.data.usingManName   // 登陆人名字
          this.ursData.id.push(result.data.usingMan)   // 登陆人id
          result.data.depts.forEach(e => {
            this.departmentQuery = e.deptNum
            if (e.selected === true) {
              this.departmentQuery = e.deptNum
            }
          })
        }
      })
    },

    // 初始化页面
    getInitData (a) {
      this.ursData.id = []
      let url = ''
      // this.$route.query.applicationNum 申请编号
      if (a == 'history') {  // 申请历史接口
        url = 'process/scraphandle/apply-info?applicationNum=' + this.$route.query.applicationNum
      } else if (a == 'draft') {  // 草稿初始化接口
        url = 'process/scraphandle/apply-info?applicationNum=' + this.$route.query.applicationNum
      } else {  // 申请初始化接口
        url = 'process/common/init-form?processJavaMapping=physicalAssetsScrap'
      }
      axiosGet(url, { showLoading: true }).then(result => {
        if (result.code == 200) {
          if (a == 'history' || a == 'draft') {
            this.formData = result.data   // 基础数据信息
            this.formData.applyTime = result.data.applyDate  // 申请时间
            this.formData.applicantPhone = result.data.applyUserTel  // 申请人电话
            this.formData.applicantName = result.data.applyUserName  // 申请姓名
            this.formData.applicationStatus = result.data.status  // 申请姓名
            this.chuZhiFangShi = result.data.handleWay  // 处置方式
            // this.filterAddComment = '哈哈哈哈';  // 处置备注
            this.filterAddComment = result.data.applyComment  // 处置备注
            // this.admin = result.data.applyForm.flag; //如果为true是管理员
            this.ursData.name = result.data.applyUserName  // 登陆人名字
            this.ursData.id.push(result.data.applyUser)   // 登陆人id
            this.sealDetailList = result.data.equipmentInfos  // 设备已选列表数据
            this.allQian = result.data.handleSum // 报废总金额
          } else {
            this.formData = result.data
          }
          this.getChuZhiFangShiList()  // get报废处置方法
        }
      })
    },

    // get审批历史
    getShenPi (id) {
      // id => 申请编号
      let url = 'approvalHistoryController/history?applicationNum=' + id
      axiosGet(url).then(result => {
        if (result.code == 200) {
          this.approveHistory = result.data // 审批历史数据
        } else {
          alert('获取审批历史失败！')
        }
      })
    },

    // get子组件数据
    childByValue: function (childValue) {
      if (childValue != '0') {
        let name = []
        let id = []
        for (var i = 0; i < childValue.length; i++) {
          name.push(childValue[i].name)
          id.push(childValue[i].usrId)
        }
        this.ursData.name = name.join(',')
        this.ursData.id = id
      }
      this.innerVisible = false
    },

    // 上传模板之前
    beforeTemplateUpload (file) {
      if (file) {
        this.loading = this.$loading({
          lock: true,
          text: '正在上传...',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      }
      this.tableData = []
    },

    handleTemplatePreview (file) {
      console.log('点击文件列表中已上传的文件时的钩子')
    },

    handleTemplateRemove (file, fileList) {
      this.tableData = []
      this.formData.file = []
    },

    templatebeforeRemove (file, fileList) {
      var _this = this
      return this.$confirm(`确定移除 ${file.name}？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.formData.file = []
      })
    },

    // 导入模板成功
    templateImportSuccess (response, file, filelist) {
      var _this = this
      let code = response.code
      this.loading.close()
      if (code === 200) {
        _this.formData.file = filelist
        _this.sealDetailList = response.data
        this.$refs.ruleForm.clearValidate('file')
        _this.callFlag = true
        _this.$message({
          type: 'success',
          message: '导入模板成功!'
        })
      } else if (code == 400) {
        // 模板字段错误
        this.messageTip(response.message)
      }
    },

    templateImportError (response, file, filelist) {
      this.loading.close()
      this.messageTip('模板错误!')
      console.log(response)
    },

    // 点击导入浏览
    getTemplate () {
      this.$refs.template.clearFiles()
      this.tableData = []
      this.formData.file = []
    },

    // 点击导入按钮
    submitTemplateUpload () {
      this.$refs.template.submit()
    },

    // get处置方式list
    getChuZhiFangShiList () {
      axiosGet('process/scraphandle/list-handle-methods').then(result => {
        if (result.code == 200) {
          this.chuZhiFangShiData = result.data
          if (!this.chuZhiFangShi) {
            this.chuZhiFangShi = this.chuZhiFangShiData[0].id
          }
        }
      })
    },

    // 设置设备列表默认当前时间
    getNowTime () {
      let defaultDate = new Date()
      // for (var i = 0; i < this.sealDetailList.length; i++) {
      //   if (!this.sealDetailList[i].handleDate) {
      //     this.sealDetailList[i].handleDate = defaultDate
      //   }
      // }
      this.sealDetailList.forEach(item => {
        // item.handleDate = defaultDate;
        this.$set(item, 'handleDate', defaultDate)
      })
    },
  },
  created () {
    if (this.paramList && this.paramList.type == 'history') {
      this.draftCaoGao = false  // 没啥用，备用字段
      this.historyLiShi = true  // true 不可编辑
      this.getInitData('history')  // get历史详情数据
      this.getShenPi(this.$route.query.applicationNum)
    } else if (this.paramList && this.paramList.type == 'draft') {
      this.draftCaoGao = false    // 没啥用，备用字段
      this.historyLiShi = false  // true 部门不可编辑
      this.getInitData('draft')  // get草稿详情数据
    } else if (this.paramList && this.paramList.formKey == 'formkey_1') {
      this.getShenPi(this.$route.query.applicationNum)
      this.cheHuiOrTiJiao = true
      this.draftCaoGao = false    // 没啥用，备用字段
      this.chehuiOrLiShi = true
      this.historyLiShi = false  // true 部门不可编辑
      this.getInitData('draft')  // get草稿详情数据
    } else if (this.$route.query.disabled == 'false') {
      this.draftCaoGao = true  // 没啥用，备用字段
      this.historyLiShi = true  // true 不可编辑
      this.getInitData('history')  // get历史详情数据
      this.getShenPi(this.$route.query.applicationNum)
    } else if (this.$route.query.formKey == 'formkey_3') {
      this.draftCaoGao = false  // 没啥用，备用字段
      this.historyLiShi = true  // true 不可编辑
      this.getInitData('history')  // get历史详情数据
      this.getShenPi(this.$route.query.applicationNum)
    } else {
      this.draftCaoGao = false   // 没啥用，备用字段
      this.historyLiShi = false  // false 可编辑
      this.getInitData()         // get申请初始化数据
    }
  },
  computed: {
    filterAddComment: {
      get: function () {
        return this.addComment
      },
      set: function (val) {
        // this.addComment = val.slice(0, 100);
        if (val != null) {
          this.addComment = val.slice(0, 100)
        }
        this.currentWord = 100 - this.addComment.length
      }
    },
    approvalOpinion: {
      get: function () {
        return this.addComments
      },
      set: function (val) {
        this.addComments = val.slice(0, 100)
        this.currentWords = 100 - this.addComments.length
      }
    }
  }
}
</script>
<style lang="scss">

  .unsealing-pagesss {
    .Finput .el-date-editor.el-input.el-input--prefix .el-input__inner {
      padding-left: 15px;
    }

    .Finput .el-date-editor.el-input.el-input--prefix .el-input__prefix {
      right: 6px;
    }

    .Fbaofeichuzhi /deep/ .el-input-number .el-input {
      width: 110px;
    }

    .Fbaofeichuzhi /deep/ .el-input-number.is-controls-right .el-input__inner {
      padding: 0 10px;
      margin: 0 10px;
    }

    .tiaoYangShi /deep/ .el-select__caret.el-input__icon.el-icon-arrow-up {
      height: 30px;
      line-height: 35px;
    }

    .primary-btn.el-button {
      background: #3a8eff;
      color: #fff;
      border-color: #fff !important;
    }

    .download.el-button {
      background: #004ea2;
      color: #fff;
    }

    .el-select .el-input--suffix .el-input__inner {
      width: 125px;
      height: 35px;
      line-height: 35px;
    }

    .el-select .el-input--suffix > span {
      height: 35px;
      line-height: 45px;
    }

    .buMenLieBiao {
      cursor: pointer;
      padding-left: 8px;
    }

    .buMenLieBiao:hover {
      background: #ccc;
    }

    .el-form-item .el-form-item__content /deep/ .yanshiZiJi .el-input__inner {
      padding-left: 15px;
      width: 202px;
    }

    .el-form-item .el-form-item__content .yanshiZiJi .el-input .el-input__inner{
      width: 202px;
    }

    .collapse-title {
      flex: 1 0 90%;
      order: 1;
    }

    .el-collapse-item__arrow {
      order: -1;
    }

    // 重置样式
    .setDate {
      .el-input__inner {
        border-color: #fff;
        width: 0px;
        height: 0px;
        overflow: hidden;
      }

      .el-input__icon {
        width: auto;
        line-height: 27px;
      }
    }

    .el-date-editor.el-input {
      width: 130px;
    }

    .el-date-editor.el-input .el-input__inner {
      padding-left: 30px;
    }

    .el-date-editor.el-input span i {
      height: 30px;
      line-height: 30px
    }

    .el-input--prefix .el-input__inner,
    .el-input--suffix .el-input__inner {
      padding-left: 8px;
      padding-right: 0;
    }

    .setInput {
      font-size: 12px;
      padding-left: 0;

      .el-input__inner {
        padding-left: 2px;
        padding-right: 2px;
      }
    }

    .btn-group {
      display: block;
      text-align: center;
      padding-bottom: 20px;
      // margin-top: 20px;
      .save-btn.el-button {
        background: #2fce6a;
        color: #fff;
      }

      .submit-btn.el-button {
        background: #004ea2;
        color: #fff;
      }
    }

    .addDia {
      .el-input {
        display: block;
        width: 230px;
      }

      .el-input__inner {
        margin: 5px 0;
        width: 202px;
      }

      .el-dialog__body {
        height: 330px;
        overflow-y: auto;
      }
    }

    .style_kuan > .el-input__inner {
      width: 202px !important;
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

    .template-upload {
      height: 32px;
      margin-left: 18px;
    }
  }
</style>
