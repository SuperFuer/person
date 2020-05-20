
<template>
  <div class="unsealing-pages wocaohaode">
    <div class="form-title">
      <i class="icon"></i>实物资产报废申请
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
          <el-form-item label="状态"
                        label-width="107px"
                        prop="tatus">
            <el-input v-model="formData.applicationStatus"
                      disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间"
                        label-width="107px"
                        prop="applicationDate">
            <el-input v-model="formData.applicationDate"
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
                      :disabled="postAjaxYes || historyLiShi || historyLiShiForm"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人"
                        label-width="107px"
                        prop="applicantName">
            <el-input v-model="formData.applicantName"
                      disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话"
                        label-width="107px"
                        prop="applicantPhone">
            <el-input v-model="formData.tele"
                      disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse class="common-collapse"
                   v-model="currentCollapse">
        <el-collapse-item name="1"
                          class="active">
          <template slot="title">
            <div class="collapse-title">实物资产信息</div>
          </template>
          <div class="operate-btns mb10">
            <el-button size="small"
                       type="primary"
                       @click="addSealEquip"
                       :disabled="postAjaxYes || historyLiShi || (callFlag && sealDetailList.length>0)"
                       :style="{'opacity':postAjaxYes || historyLiShi ? 0.6 : 1}">新增
            </el-button>
            <el-button size="small"
                       type="danger"
                       :disabled="postAjaxYes || historyLiShi"
                       @click="delSealEquip"
                       :style="{'opacity':postAjaxYes || historyLiShi ? 0.6 : 1}">删除
            </el-button>
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
              'font-size':'12px'

            }"
                    @selection-change="handleSelectionChange"
                    :row-key="sealRowKey">
            <el-table-column :reserve-selection="true"
                             :show-overflow-tooltip="true"
                             type="selection"
                             width="45"></el-table-column>
            <el-table-column label="序号"
                             width="55"
                             type="index"></el-table-column>
            <el-table-column :show-overflow-tooltip="true"
                             prop="equipNum"
                             width="160"
                             label="设备编码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true"
                             prop="equipName"
                             label="设备名称"></el-table-column>
            <el-table-column :show-overflow-tooltip="true"
                             prop="usingManName"
                             label="使用人"></el-table-column>
            <el-table-column :show-overflow-tooltip="true"
                             prop="belongDeptText"
                             label="使用人部门"
                             width="110"></el-table-column>
            <el-table-column :show-overflow-tooltip="true"
                             prop="installLocDesc"
                             label="安装地点"></el-table-column>
            <el-table-column :show-overflow-tooltip="true"
                             prop="specification"
                             label="规格型号"></el-table-column>
            <el-table-column :show-overflow-tooltip="true"
                             prop="purchasePrice"
                             label="采购价格"></el-table-column>
            <el-table-column label="报废原因"
                             width="150">
              <template slot-scope="scope">
                <el-select v-model="scope.row.reason"
                           :disabled="postAjaxYes || historyLiShi"
                           @change="changepeoSelect($event,scope.row)"
                           placeholder="请选择报废信息">
                  <el-option v-for="item in baoFeiYuanYinList"
                             :key="item"
                             :label="item"
                             :value="item">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination"
               style="position: relative">
            <el-pagination background
                           layout="total,prev, pager, next,jumper"
                           :page-size="pageSize"
                           :total="sealDetailList.length"
                           :current-page.sync="currentPage"
                           @current-change="handlePaginationChange">
            </el-pagination>
            <span class="Choiceing">已选择{{multipleSelection.length}}条</span>
          </div>
        </el-collapse-item>

        <el-collapse-item name="2"
                          disabled>
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
                      slot="trigger"
                      size="small"
                      height="28px"
                      class="primary-btn hoverClass goThrough"
                      @click="getTemplate"
                      :disabled="callFlag || sealDetailList.length>0"
                  >浏览
                  </el-button>
                  <el-button
                      size="small"
                      height="28px"
                      class="primary-btn template-upload hoverClass"
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

        <el-collapse-item name="3"
                          disabled>
          <template slot="title">
            <div class="collapse-title">添加备注</div>
          </template>
          <!--          style="margin-top:20px;"-->
          <div>
            <!--            <h4 style="margin-bottom: 5px">添加备注</h4>-->
            <el-row>
              <el-col style="position: relative">
                <el-input type="textarea"
                          :disabled="postAjaxYes || historyLiShi"
                          v-model="filterAddComment"
                          :row="2"
                          resize="none"></el-input>
                <span style="position: absolute;right: 15px;bottom: 5px">{{currentWord}}/{{100}}</span>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-form-item v-if="!historyLiShi && !historyLiShiForm"
                    class="btn-group">
        <el-button @click="submitForm('ruleForm',false,'是否保存？')"
                   size="small"
                   class="save-btn"
                   :disabled="postAjaxYes || historyLiShi"
                   :style="{'opacity':postAjaxYes || historyLiShi ? 0.6 : 1}">保存
        </el-button>
        <el-button @click="submitForm('ruleForm',true,'是否提交？')"
                   size="small"
                   class="submit-btn"
                   :disabled="postAjaxYes || historyLiShi"
                   :style="{'opacity':postAjaxYes || historyLiShi ? 0.6 : 1}">提交
        </el-button>
      </el-form-item>

      <!-- 审批历史 star-->
      <div v-if="historyLiShi || historyLiShiForm"
           style="margin-bottom:8px;">审批历史</div>
      <el-table :data="approveHistory"
                tooltip-effect="dark"
                style="width: 99.9%;margin-bottom: 25px"
                class="history"
                v-if="historyLiShi || historyLiShiForm"
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
            <i class="el-icon-success"
               v-if="scope.row.mapVOS[0].circulationConditions=='Y' && scope.row.endTime"></i>
            <i v-else-if="!scope.row.mapVOS[0].circulationConditions && !scope.row.endTime "></i>
            <i v-else-if="scope.row.mapVOS[0].circulationConditions=='N'"
               class="el-icon-error"></i>
            <i v-else
               class="el-icon-s-help"></i>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         prop="name"
                         label="节点"
                         width="160"></el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         prop="assigneeName"
                         label="操作人"
                         width="120"></el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         prop="formKey"
                         label="操作"
                         width="120"></el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         prop="endTime"
                         label="操作时间"
                         width="150"></el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         label="审批意见">
          <!--          <template slot-scope="scope">-->
          <!--            <span>{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion}}</span>-->
          <!--          </template>-->
          <template slot-scope="scope">
            <div v-if="!scope.row.mapVOS[0].approvalOpinion && scope.row.formKey!='待审批'">
              — —
            </div>
            <a v-else
               :title="scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion">{{scope.row.mapVOS[0] && scope.row.mapVOS[0].approvalOpinion | ellipsis}}</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 审批历史 end-->

      <el-form-item v-if="!historyLiShi && historyLiShiForm"
                    class="btn-group">
        <el-button @click="submitForm('ruleForm',false,'是否撤回？')"
                   size="small"
                   class="save-btn"
                   :disabled="postAjaxYes || historyLiShi"
                   :style="{'opacity':postAjaxYes || historyLiShi ? 0.6 : 1}"
                   type="danger"
                   style="background: #F56C6C">撤回
        </el-button>
        <el-button @click="submitForm('ruleForm',true,'是否提交？')"
                   size="small"
                   class="submit-btn"
                   :disabled="postAjaxYes || historyLiShi"
                   :style="{'opacity':postAjaxYes || historyLiShi ? 0.6 : 1}">提交
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 新增页面 -->
    <el-dialog title="添加设备"
               :close-on-click-modal='false'
               :close-on-press-escape='false'
               :visible.sync="addPopDialog"
               width="70%">
      <div class="seal-query">
        <el-form :inline="true"
                 label-width="80px">
          <div>
            <el-form-item label="设备名称"
                          label-width="80px">
              <el-input v-model="equipNameQuery" style="width: 202px"></el-input>
            </el-form-item>
            <el-form-item label="设备编码"
                          label-width="80px">
              <el-input style="width:202px"
                        v-if="allOrDanTiao == 0"
                        v-model="equipCodeQuery"
                        onkeyup="value=value.replace(/[^\d]/g,'')"
                        placeholder="编码为16位"></el-input>

              <el-button style="width:202px;height:35px;padding:0"
                         @click="dialogVisible = true"
                         v-if="allOrDanTiao > 0">已选择{{allOrDanTiao}}条
              </el-button>

              <span style="padding-left: 10px;cursor: pointer;color: #409EFF;"
                    @click="dialogVisible = true"
                    class="allOder active">批量添加</span>
              <span v-if="allOrDanTiao == 0 && equipCodeQuery.length != 16 && equipCodeQuery.length > 0"
                    style="color:red;font-size: 12px;margin-left: 15px">编码位数错误</span>
            </el-form-item>

            <!-- 弹窗 => 写设备编码 -->
            <el-dialog title="添加设备编码"
                       :close-on-click-modal='false'
                       :close-on-press-escape='false'
                       :visible.sync="dialogVisible"
                       width="30%"
                       :before-close="handleClose"
                       class="addDia"
                       append-to-body>
              <div v-for="(item,index) in equipment"
                   :key="index">
                <el-input style="display: inline-block;width: 210px"
                          v-model="item.input"
                          placeholder="请输入内容"
                          class="mbinput"
                          onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
                <span v-if="!item.input || item.input.length==16"
                      style="color:#ccc;font-size: 12px">编码为16位</span>
                <span v-if="item.input && item.input.length!=16"
                      style="color:red;font-size: 12px">编码位数错误</span>
                <i @click="addInput"
                   style="font-size: 25px;margin-left: 15px;vertical-align: middle;color: #409eff;"
                   v-if="index+1 == equipment.length"
                   class="el-icon-circle-plus"></i>
              </div>
              <span slot="footer"
                    class="dialog-footer">
                <el-button @click="closeMoble()"
                           size="small">取 消</el-button>
                <el-button type="primary"
                           @click="btnOk"
                           size="small">确 定</el-button>
              </span>
            </el-dialog>
          </div>
          <el-form-item label="部门"
                        label-width="80px">
            <!--            <el-input v-model="departmentQuery"></el-input>-->
            <el-select style="width:202px;"
                       :disabled="!admin"
                       class="yanshiZiJi"
                       v-model="departmentQuery"
                       filterable
                       placeholder="请选择">
              <el-option v-for="item in buMenoptions"
                         :key="item.deptNum"
                         :label="item.deptName"
                         :value="item.deptNum">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用人"
                        label-width="80px">
            <el-input class="style_kuan"
                      v-model="ursData.name"
                      style="width:202px"
                      @focus="setRenDatas"
                      :disabled="!admin || ursData.name == '部门所有人'"></el-input>
            <span @click="allOder"
                  v-if="admin"
                  style="padding-left: 10px;cursor: pointer;color: #409EFF;"
                  class="allOder active">部门所有人</span>
            <!-- 使用人选择 -->
            <el-dialog width="70%"
                       :close-on-click-modal='false'
                       :close-on-press-escape='false'
                       title="选择使用人"
                       :visible.sync="innerVisible"
                       class="pop-participation"
                       append-to-body>
              <!--                组织架构组件-->
              <orgstructure ref="getZiZuJianList"
                            v-on:childByValue="childByValue"></orgstructure>
            </el-dialog>
          </el-form-item>
          <el-form-item style="padding-left:10px;position:relative;top:-2px;">
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-search"
                       @click="getSearchData">搜索</el-button>
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
                  :row-key="popRowKey">
          <el-table-column :show-overflow-tooltip="true"
                           type="selection"
                           :reserve-selection="true"
                           width="55"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           type="index"
                           label="序号"
                           width="55"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="equipNum"
                           width="160"
                           label="设备编码"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="equipName"
                           label="设备名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="installLocDesc"
                           label="安装地点"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="usingManName"
                           label="使用人"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="belongDeptText"
                           width="130"
                           label="使用人部门"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="locCode"
                           label="位置编码"></el-table-column>
          <el-table-column :show-overflow-tooltip="true"
                           prop="locName"
                           label="位置描述"></el-table-column>
        </el-table>
        <!-- <div>已选择：{{popNumber}}</div> -->
        <!-- 分页 -->
        <div class="pagination"
             style="position: relative">
          <el-pagination background
                         layout="total, prev, pager, next, jumper"
                         :total="tableData.length"
                         :page-size="popPageSize"
                         :current-page.sync="popCurrentPage"
                         @current-change="handlePopPagination">
          </el-pagination>
          <span class="Choiceing">已选择{{popNumber}}条</span>
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
      constApi: constApi, // 域名
      baoFeiYuanYinList: [
        '达到设计使用年限且无法继续使用',
        '耗能过大，无法改造或继续使用得不偿失',
        '国家有关部门明令禁止使用，且不能转让',
        '环境污染严重，无法改造',
        '因工程改造拆除，无法继续使用',
        '未到报废年限但其性能无法达到生产运行或管理需要',
        '因事故及意外灾害等不可抗力原因造成严重损坏，无法修复',
        '其他原因导致设备及车辆需报废的情况'
      ], // 报废原因，前端写死
      approveHistory: [], // 申请历史数据
      postAjaxYes: false, // 提交成功后控制页面不可操作
      draftCaoGao: false, // 从草稿进入页面度额判断参数
      historyLiShi: false, // 从历史进入页面的判断参数
      innerVisible: false, // 选择人弹框控制字段
      buMenList: [], // 全部部门列表
      buMenRenList: [], // 部门下所有人列表
      xuanZhongRen: [], // 选中的人
      buMenoptions: [], // 的路人管理部门列表
      callFlag: false,
      currentCollapse: ['1', '2', '3', '4'],
      admin: false, // 是否是管理员
      saveId: '',
      formData: {
        applicationNum: '',
        applicationStatus: '',
        applicationDate: '',
        subject: '',
        applicant: '',
        applicantName: '',
        tele: '',
        id: ''
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
      currentWord: 100,
      addPopDialog: false,
      multipleSelection: [], // 选择封存checkbox--list
      sealDetailList: [], // 列表
      currentPage: 1,
      pageSize: 10,
      delectDetailList: [],
      tableData: [],
      popMultipleSelect: [],
      popCurrentPage: 1,
      popPageSize: 5,
      popNumber: 0, // 已选择
      allOrDanTiao: 0,
      equipCodeQuery: '',
      equipCodeMulitQuery: [], // 设备编码查询条件数组
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
      historyLiShiForm: false, // 撤回页面为true
      equipCodeShow: '',
      equipNameQuery: '',
      departmentQuery: '',
      userQuery: '',
      ursData: {}, // 设备查询默认使用人数据
      importTemplateUrl: constApi + 'process/scrap/import', // 导入文件ajax地址
      headers: { // ajax header中的token
        token: localStorage.getItem('token')
      }
    }
  },
  methods: {
    // 下载导入模板
    downMoBan () {
      axiosGet('common/file/template-scr/scrap_list.xls', { showLoading: true }).then(ret => {
        console.log(ret)
        if (ret.code == 200) {
          window.location.href = this.constApi + ret.data
        } else {
          this.$message.error(ret.message)
        }
      })
    },

    // get设备查询初始化
    getBuMenList() {
      let url = 'process/common/init-query'
      axiosGet(url, {}).then(result => {
        if (result.code == 200) {
          console.log(result)
          this.$refs.multipleTable.clearSelection();
          this.buMenoptions = result.data.depts   // 登陆人管理设备部门列表数据
          result.data.depts.forEach(e => {
            this.departmentQuery = e.deptNum
            if (e.selected === true) {
              this.departmentQuery = e.deptNum
            }
          })
        }
      })
    },

    // 选择报废原因
    changepeoSelect (event, index) {
      for (var i = 0; i < this.sealDetailList.length; i++) {
        if (!this.sealDetailList[i].reason) {
          this.$set(this.sealDetailList[i], 'reason', event)
          console.log(this.sealDetailList[i].reason)
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
    allOder () { // 有问题，待解决
      this.ursData.id = []
      if (this.ursData.name == '部门所有人') {
        this.$set(this.ursData, 'name', this.formData.applicantName)
        this.ursData.id.push(this.formData.applicant)
      } else {
        this.$set(this.ursData, 'name', '部门所有人')
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
      // this.popMultipleSelect = [];
      // this.popNumber = 0;
    },

    // 搜索设备
    getSearchData () {
      let _this = this
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
      }
      console.log(parmas)
      // archive/equipment/list
      axiosPost('process/scrap/getEquip', parmas).then(result => {
        if (result.code == 200) {
          if (result.data && result.data.list) {
            _this.tableData = result.data.list
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
        _this.$refs.template.clearFiles()
        _this.callFlag = false
      }
    },
    /**
     * 提交表单
     */
    submitForm (ruleForm, flag, text) {
      let _this = this
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (_this.sealDetailList.length == 0) {
            _this.messageTip('请选择设备！')
            return
          } else { // 检测是否选择了报废信息
            for (var i = 0; i < _this.sealDetailList.length; i++) {
              if (!_this.sealDetailList[i].reason && flag && text != '是否撤回？') {
                _this.messageTip("请完善报废原因信息！");
                return
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
              _this.handleSubmitResult(flag, text)
            })
            .catch(() => {
              _this.messageTip('已取消')
            })
        }
      })
    },

    // 提交or保存方法
    handleSubmitResult (flag, text) {
      // /process/scrap/updateStatus
      let _this = this
      if (this.historyLiShiForm && !flag) {
        let postList = {
          id: this.$route.query.applicationNum,
          showLoading: true
        }
        axiosPost('process/scrap/updateStatus', postList).then(result => {
          if (result.code == 200) {
            this.$message({
              message: '撤回成功！',
              type: 'success'
            })
            this.postAjaxYes = true
            this.$router.push({
              path: "/needdealt"
            });
          } else {
            _this.messageTip(result.message)
          }
        })
        return
      }
      let postList = {
        'flag': flag,
        'taskId': this.$route.query.id || '',  // 流程Id
        'scrapApplyForm': {
          'scrapAssetInfos': _this.sealDetailList,
          'subject': this.formData.subject, // 申请主题
          'applicantName': this.formData.applicantName, // 申请人名字
          'tele': this.formData.tele, // 申请人电话
          'applicationDate': this.formData.applicationDate, // 时间
          'applicant': this.formData.applicant, // LIJINLIANG
          'combine': 0,
          'remark': this.filterAddComment, // 审批意见
          'id': this.formData.id,   // 申请Id
          'applicationNum': this.formData.applicationNum,  // 申请编号
        },
        showLoading: true
      }
      console.log(postList)
      axiosPost('process/scrap/submit', postList).then(result => {
        if (result.code == 200) {
          _this.$set(_this.formData, 'applicationNum', result.data.applicationNum) // 提交成功回显申请编号
          _this.$set(_this.formData, 'applicationStatus', result.data.status) // 提交成功回显状态
          _this.$set(_this.formData,"id",result.data.id)
          if (flag) {
            this.postAjaxYes = true
          }
          this.$message({
            type: 'success',
            message: '操作成功!'
          })
          this.getShenPi(this.$route.query.applicationNum)
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

    // 初始化页面
    getInitData (a) {
      this.ursData.id = []
      let url = ''
      // this.$route.query.applicationNum 申请编号
      if (a == 'history') { // 申请历史接口
        url = 'process/scrap/apply-detail/' + this.$route.query.applicationNum
      } else if (a == 'draft') { // 草稿初始化接口
        url = 'process/scrap/apply-detail/' + this.$route.query.applicationNum
      } else { // 申请初始化接口
        url = 'process/scrap/init-form'
      }
      axiosGet(url, { showLoading: true }).then(result => {
        if (result.code == 200) {
          if (a == 'history' || a == 'draft') {
            this.formData = result.data.applyForm // 基础数据信息
            this.admin = result.data.applyForm.flag // 如果为true是管理员
            this.ursData.name = result.data.applyForm.applicantName // 登陆人名字
            this.ursData.id.push(result.data.applyForm.applicant) // 登陆人id
            this.sealDetailList = result.data.applyForm.scrapAssetInfos // 设备已选列表数据
            this.filterAddComment = result.data.applyForm.remark // 备注信息
          } else {
            this.formData = result.data
            this.admin = result.data.flag // 如果为true是管理员
            this.ursData.name = result.data.applicantName // 登陆人名字
            this.ursData.id.push(result.data.applicant) // 登陆人id
          }
        }
      })
    },

    // get审批历史
    getShenPi (id) {
      // id => 申请编号
      let url = 'approvalHistoryController/history?applicationNum=' + id
      axiosGet(url).then(result => {
        console.log(result.data)
        if (result.code == 200) {
          this.approveHistory = result.data // 审批历史数据
        } else {
          alert('获取审批历史失败！')
        }
      })
    },

    // get子组件数据
    childByValue: function (childValue) {
      console.log(childValue)
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
      console.log(response)
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
        const h = this.$createElement
        _this
          .$msgbox({
            title: '提示',
            type: 'error',
            beforeClose: (action, instance, done) => {
              _this.formData.file = []
              instance.confirmButtonLoading = false
              done()
            },
            message: h('p', null, [
              h('span', null, '共有'),
              h(
                'span',
                { style: 'font-size: 16px;padding:0 4px;' },
                response.data.errorCount
              ),
              h('span', null, '条错误,'),
              h(
                'span',
                {
                  style: 'color: teal;text-decoration:underline;cursor:pointer',
                  on: {
                    click () {
                      if (response.data.errorMessageDownloadUrl) {
                        axiosGet(response.data.errorMessageDownloadUrl).then(
                          result => {
                            if (result.code == 200) {
                              window.location.href =
                                _this.constApi + result.data
                            }
                          }
                        )
                      } else {
                        // 没有可用链接
                      }
                    }
                  }
                },
                '点击下载'
              )
            ])
          })
          .then(() => {
            _this.formData.file = []
          })
      } else if (code == 402) {
        // 模板错误
        this.$alert(response.message, '提示', {
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
            _this.formData.file = []
          }
        })
      } else {
      }
    },

    templateImportError (response, file, filelist) {
      this.loading.close()
      this.$alert(response.message, '提示', {
        confirmButtonText: '确定',
        type: 'error'
      })
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
    }
  },
  created () {
    if (this.paramList && this.paramList.type == 'history') {
      this.draftCaoGao = false // 没啥用，备用字段
      this.historyLiShi = true // true 不可编辑
      this.getInitData('history') // get历史详情数据
      this.getShenPi(this.$route.query.applicationNum)
    } else if (this.paramList && this.paramList.type == 'draft') {
      this.draftCaoGao = true // 没啥用，备用字段
      this.historyLiShi = false // true 部门不可编辑
      this.getInitData('draft') // get草稿详情数据
    } else if (this.paramList && this.paramList.formKey == 'formkey_1') {
      this.draftCaoGao = true // 没啥用，备用字段
      this.historyLiShi = false // true 部门不可编辑
      this.getInitData('draft') // get草稿详情数据
      this.getShenPi(this.$route.query.applicationNum)
      this.historyLiShiForm = true // 撤回页面为true
    } else {
      this.draftCaoGao = false // 没啥用，备用字段
      this.historyLiShi = false // false 可编辑
      this.getInitData() // get申请初始化数据
    }
  },
  computed: {
    filterAddComment: {
      get: function () {
        return this.addComment
      },
      set: function (val) {
        this.addComment = val.slice(0, 100)
        this.currentWord = 100 - this.addComment.length
      }
    }
  }
}
</script>
<style lang="scss">
.unsealing-pages {
  .template-upload {
    height: 32px;
    margin-left: 18px;
  }
  .pagination {
    margin-top: -10px!important;
  }
  .pagination .Choiceing{
    position: absolute;
    top: 0px!important;
    left: 15px;
  }
  .hoverClass.el-button.is-disabled:hover{
    background: #3a8eff;
  }
  .goThrough > span {
    pointer-events: none;
  }
  .el-select__caret.el-input__icon.el-icon-arrow-up{
    height: 30px;
    line-height: 34px;
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
    width: 0px;
  }

  .el-input--prefix .el-input__inner,
  .el-input--suffix .el-input__inner {
    padding-left: 0;
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
}


</style>
