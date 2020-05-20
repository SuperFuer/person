<template>
  <div class="sb-report">
    <object
        id="mytt"
        classid="clsid:5DA436C3-BE51-44B6-BF8A-B314AD55266C"
        style="height: 0;width:0"
    ></object>
    <div>
      <div class="form-title">
        <i class="icon"></i>
        {{pageTitle}}
      </div>
      <el-form
          :model="formData"
          :inline="true"
          :rules="rules"
          label-width="80px"
          ref="ruleForm"
          class="sb-form"
      >
        <el-row :gutter="10" class="common-row">
          <el-col :span="8">
            <el-form-item label="申请编号" prop="applicationNum">
              <el-input v-model="formData.applicationNum" disabled></el-input>
              <!-- <span>{{formData.applicationNum}}</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="applicationStatus">
              <el-input v-model="formData.applicationStatus" disabled></el-input>
              <!-- <span>{{formData.applicationStatus}}</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请时间" prop="applicationDate">
              <el-input v-model="formData.applicationDate" disabled></el-input>
              <!-- <span>{{formData.applicationDate}}</span> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="8">
            <el-form-item label="主题" prop="subject">
              <el-input v-model="formData.subject" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申请人" prop="applicantName">
              <!-- <span>{{formData.applicantName}}</span> -->
              <el-input v-model="formData.applicantName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话" prop="mobile">
              <el-input v-model="formData.mobile" disabled></el-input>
              <!-- <span>{{formData.mobile}}</span> -->
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
                      <el-radio-group
                          v-model="item.flag"
                          @change="handleContentChecked"
                          :disabled="disabled"
                      >
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
              <el-checkbox-group
                  v-model="technicalChecked"
                  @change="handleTechnicalChecked"
                  :disabled="disabled"
              >
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
              <el-radio-group
                  v-model="bindConclusion"
                  @change="handelConclusionChecked"
                  :disabled="disabled"
              >
                <el-col v-for="(item,index) in acceptConclusion" :key="index">
                  <el-radio :label="item.id">{{item.name}}</el-radio>
                </el-col>
              </el-radio-group>
              <div>
                <div>其他意见</div>
                <div>
                  <el-input v-model.trim="otherSuggest" type="textarea" :disabled="disabled"></el-input>
                </div>
              </div>
            </el-row>
          </el-collapse-item>
          <el-collapse-item name="4" class="active">
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
              <el-table-column
                  :show-overflow-tooltip="true"
                  label="序号"
                  type="index"
                  width="55"
                  :disabled="disabled"
              ></el-table-column>
              <el-table-column :show-overflow-tooltip="true" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                      @click="handleviewClick(scope.$index, scope.row)"
                      type="text"
                      size="medium"
                      :disabled="disabled"
                  >修改
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                  :show-overflow-tooltip="true"
                  prop="equipNum"
                  label="设备编码"
                  width="150"
              ></el-table-column>
              <el-table-column
                  :show-overflow-tooltip="true"
                  prop="equipName"
                  label="设备描述"
                  width="200"
              ></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="specification" label="规格型号"></el-table-column>
              <el-table-column
                  :show-overflow-tooltip="true"
                  prop="manufacturNum"
                  label="出厂序号"
                  width="150"
              ></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="purchasePrice" label="采购价格"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="locationCode" label="位置编码"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="locationName" label="位置描述"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="installLocDesc" label="安装地点"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="usingMan" label="使用人"></el-table-column>
              <el-table-column
                  :show-overflow-tooltip="true"
                  prop="usingManName"
                  label="使用人名称"
                  width="100"
              ></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="usingDept" label="使用部门"></el-table-column>
              <el-table-column
                  :show-overflow-tooltip="true"
                  prop="usingDeptName"
                  label="使用部门"
                  width="150"
              ></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="usingModure" label="使用模块"></el-table-column>
              <el-table-column
                  :show-overflow-tooltip="true"
                  prop="usingModureName"
                  label="使用模块名称"
                  width="150"
              ></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="belongSystem" label="所属系统"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="startDate" label="启用日期"></el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="comments" label="验收结果"></el-table-column>
            </el-table>
            <div>
              <div>备品备件明细</div>
              <el-input v-model.trim="productDetail" type="textarea" :disabled="disabled" rows="1"></el-input>
              <!-- <el-input v-model="productDetail" placeholder :disabled="disabled"></el-input> -->
            </div>
            <div class="pagination">
              <el-pagination
                  :disabled="disabled"
                  background
                  layout="total,prev, pager, next,jumper"
                  :page-size="10"
                  @current-change="handleCurrentChange"
                  :total="tableData.length"
              ></el-pagination>
            </div>
          </el-collapse-item>
        </el-collapse>
        <!-- 技术文档资料 -->
        <div class="fileRefs" v-if="fileRefs.length>0">
          <div class="query-title">技术资料文档</div>
          <el-row>
            <el-col v-for="(item,index) in fileRefs" :key="index">{{item.fileName}}</el-col>
          </el-row>
          <div style="text-align:center;">
            <el-button size="small" type="primary" :disabled="disabled" @click="downRileRef">下载文档</el-button>
          </div>
        </div>
        <!-- <div style="margin:0px 0 10px;">审批历史</div> -->
        <history :childId="childId" v-if="DestroyIncomeStatistics == true"></history>
        <el-row v-if="finish=='no'" style="margin-top:30px">
          <div class="query-title" style="margin-bottom:0px;">审批意见</div>
          <el-col :span="24" :offset="0" style="text-align:right;">
            <el-button
                type="text"
                icon="el-icon-plus"
                :disabled="disabled"
                @click="ideaFill('同意')"
            >同意
            </el-button>
            <el-button
                type="text"
                icon="el-icon-plus"
                :disabled="disabled"
                @click="ideaFill('不同意')"
            >不同意
            </el-button>
            <el-button
                type="text"
                icon="el-icon-plus"
                :disabled="disabled"
                @click="ideaFill('设备已确认')"
            >设备已确认
            </el-button>
          </el-col>
        </el-row>
        <el-row v-if="finish=='no'">
          <el-col :span="24">
            <el-input
                v-model.trim="approvalOpinion"
                width="100%"
                type="textarea"
                :disabled="disabled"
                :row="2"
                resize="none"
            ></el-input>
            <span class="current-word">{{currentWord}}/{{100}}</span>
          </el-col>
        </el-row>
        <el-form-item class="btn-group" v-if="finish=='no'">
          <!--          打印标签入口按钮-->
          <el-dropdown @command="handleCommand" style="margin-right: 40px">
            <el-button size="small" type="primary">打印标签</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="00">大标签</el-dropdown-item>
              <el-dropdown-item command="01">小标签</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button
              size="small"
              type="warning"
              @click="confirmSubmit('ruleForm',false)"
              :disabled="disabled"
              :style="{'opacity':disabled?0.6:1}"
          >驳回
          </el-button>
          <el-button
              type="primary"
              size="small"
              @click="confirmSubmit('ruleForm',true)"
              :disabled="disabled"
              :style="{'opacity':disabled?0.6:1}"
          >提交
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 编辑修改 -->
      <el-dialog title="修改" :visible.sync="dialogEdit" width="40%" :before-close="closeEditDialog">
        <el-form
            :model="editData"
            :rules="rules1"
            ref="editData"
            label-width="80px"
            class="demo-ruleForm"
        >
          <el-form-item label="设备描述" prop="equipName">
            <el-input v-model.trim="editData.equipName"></el-input>
          </el-form-item>
          <el-form-item label="规格型号" prop="specification">
            <el-input v-model.trim="editData.specification"></el-input>
          </el-form-item>
          <el-form-item label="出厂序号" prop="manufacturNum">
            <el-input v-model.trim="editData.manufacturNum"></el-input>
          </el-form-item>
          <el-form-item label="采购价格" prop="purchasePrice">
            <el-input v-model.trim="editData.purchasePrice" @keyup.native="getNumber" maxlength="10"></el-input>
          </el-form-item>
          <el-form-item label="位置编码" prop="locationCode">
            <!-- <template slot-scope="scope"> -->
            <el-select
                v-model="editData.locationCode"
                filterable
                @change="changeSelect"
                placeholder="请选择"
                class="setCode"
            >
              <el-option
                  v-for="item in positionCode"
                  :key="item.label"
                  :label="item.locationCode"
                  :value="item.locationCode"
              ></el-option>
            </el-select>
            <!-- </template> -->
            <!-- <el-input v-model.trim="editData.locationCode"></el-input> -->
          </el-form-item>
          <el-form-item label="启用日期" prop="startDate">
            <el-date-picker
                width="120%"
                v-model="editData.startDate"
                type="date"
                placeholder="选择日期"
                :clearable="false"
                :editable="false"
                value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="安装地点" prop="installLocDesc">
            <el-input v-model.trim="editData.installLocDesc"></el-input>
          </el-form-item>
          <el-form-item label="使用人" prop="usingMan">
            <el-input v-model.trim="editData.usingMan" @focus="dialogparticipationPOP" readonly></el-input>
          </el-form-item>
          <el-form-item label="使用模块" prop="usingModureName">
            <!--            <el-input v-model="editData.usingModure"></el-input>-->
            <el-select
                v-model.trim="editData.usingModureName"
                filterable
                placeholder="请选择"
                @change="currentUsingModure"
            >
              <el-option
                  v-for="item in jGTreeMoKuai"
                  :key="item.moduleName"
                  :label="item.moduleName"
                  :value="item.moduleNum"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属系统" prop="belongSystem">
            <el-input v-model.trim="editData.belongSystem"></el-input>
          </el-form-item>

          <el-form-item style="padding-bottom:10px;text-align:right;">
            <el-button @click="editDeviceForm('editData','cancel')" size="small">取 消</el-button>
            <el-button type="primary" @click="editDeviceForm('editData','submit')" size="small">确 定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 详情字段错误操作 -->
      <el-dialog title="提示" :visible.sync="submitErrorShow" width="30%">
        <div>{{submitErrorMessage}}</div>
        <div style="max-height:200px;overflow:auto;color:red">
          <div v-for="(item,index) in submitErrorList" :key="index">{{item}}</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitErrorShow = false" size="small">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 参与人员popup show-checkbox -->
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
    </div>
  </div>
</template>
<script>
import { axiosPost, axiosGet, constApi } from '@/api/index.js'
import orgstructure from '@/components/orgstructure'
import history from '../../../../../components/commonHistory'

export default {
  props: {
    params: {
      type: Object
    }
  }, //上个页面传参
  components: {
    orgstructure: orgstructure,
    history: history
  },
  data () {
    return {
      fileRefs: [],
      positionCode: [], //位置编码
      constApi: constApi,
      yesOrNoIsCar: false, // 判断数据是否为车辆信息
      daYinList: {}, // 打印提交的数据
      daYinData: [
        {
          label: '请选择打印机类型',
          children: [
            {
              label: '什么什么打印机'
            }
          ]
        }
      ], // 打印机类型
      daYinDataProps: {
        children: 'children',
        label: 'label'
      },
      command: '', // 打印标签种类
      dialogFormVisible: false, // 控制打印是否显示框
      DestroyIncomeStatistics: true, // 控制子页面刷新
      editData: {
        equipName: ''
      },
      currentCollapse: ['1', '2', '3', '4'],
      loading: true,
      showLandscapeFlag: false, //判断是横向还是纵向
      wrapUrl: '',
      pageTitle: '实物资产验收--技采部资产管理室',
      disabled: false, // 是否编辑页
      finish: 'no',
      formData: {
        applicationNum: '',
        applicationStatus: '',
        applicationDate: '',
        subject: '',
        applicantName: '',
        mobile: ''
      },
      otherFormData: {},
      currentEditIndex: -1,
      dialogEdit: false,
      rules: {
        subject: {
          required: true,
          message: '主题不能为空',
          trigger: 'blur'
        }
      },
      rules1: {
        equipName: {
          required: true,
          message: '使用设备不能为空',
          trigger: 'blur'
        },
        specification: [
          {
            required: true,
            message: '规格型号不能为空',
            trigger: 'blur'
          }
        ],
        manufacturNum: [
          {
            required: true,
            message: '出厂序号不能为空',
            trigger: 'blur'
          }
        ],
        // purchasePrice: [
        //   {
        //     required: false,
        //     type: "number",
        //     message: "采购价格为数字"
        //   }
        // ],
        locationCode: [
          {
            required: true,
            message: '位置编码不能为空',
            trigger: 'blur'
          }
        ],
        installLocDesc: [
          {
            required: true,
            message: '安装地点不能为空',
            trigger: 'blur'
          }
        ],
        usingMan: [
          {
            required: true,
            message: '使用人不能为空',
            trigger: 'blur'
          }
        ],
        usingModure: [
          {
            required: true,
            message: '使用模块不能为空',
            trigger: 'blur'
          }
        ],
        belongSystem: [
          {
            required: true,
            message: '所属系统不能为空',
            trigger: 'blur'
          }
        ],
        startDate: [
          {
            required: true,
            message: '启用日期不能为空',
            trigger: 'blur'
          }
        ]
      },
      acceptContentList: [],
      technicalIInfoList: [],
      technicalChecked: [],
      acceptConclusion: [],
      bindConclusion: '此产品经验收符合采购合同与规定的要求，可以投入使用',
      recordTableData: [],
      tableData: [],
      // approveSuggest: "", //审批意见
      otherSuggest: '', //其他意见
      productDetail: '', //备品备件明细
      currentPage: 1,
      pageSize: 10,
      categoryContentId: '', //验收内容id
      selectedContentList: [],
      categoryTechnologyId: '', //技术资料id
      selectedTechnologyList: [],
      categoryConclusionyId: '', //验收理论id
      selectedConclusionList: [],
      categoryDetailgyId: '', //验收明细id
      applyformId: '',
      formKey: '',
      isProcurementDept: '',
      sapId: '',
      submitErrorMessage: '',
      submitErrorList: [],
      submitErrorShow: false,
      deviceList: [],
      dialogparticipation: false,
      selectedUser: [],
      jGTreeMoKuai: [], // 结构树 => 模块
      currentWord: 0, // 审批意见字节数量
      addComment: ''
    }
  },
  filters: {
    ellipsis (value) {
      if (!value) return ''
      if (value.length <= 60) {
        return value
      } else {
        return value.slice(0, 60) + '...'
      }
    }
  },
  computed: {
    approvalOpinion: {
      get: function () {
        return this.addComment
      },
      set: function (val) {
        this.addComment = val.slice(0, 100)
        this.currentWord = this.addComment.length
      }
    }
  },
  methods: {
    //
    getNumber () {
      if (
        this.editData.purchasePrice != '' &&
        this.editData.purchasePrice.substr(0, 1) == '.'
      ) {
        this.editData.purchasePrice = ''
      }
      this.editData.purchasePrice = this.editData.purchasePrice.replace(
        /^0*(0\.|[1-9])/,
        '$1'
      ) //解决 粘贴不生效
      this.editData.purchasePrice = this.editData.purchasePrice.replace(
        /[^\d.]/g,
        ''
      ) //清除“数字”和“.”以外的字符
      this.editData.purchasePrice = this.editData.purchasePrice.replace(
        /\.{2,}/g,
        '.'
      ) //只保留第一个. 清除多余的
      this.editData.purchasePrice = this.editData.purchasePrice
        .replace('.', '$#$')
        .replace(/\./g, '')
        .replace('$#$', '.')
      this.editData.purchasePrice = this.editData.purchasePrice.replace(
        /^(\-)*(\d+)\.(\d\d).*$/,
        '$1$2.$3'
      ) //只能输入两个小数
      if (
        this.editData.purchasePrice.indexOf('.') < 0 &&
        this.editData.purchasePrice != ''
      ) {
        //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (
          this.editData.purchasePrice.substr(0, 1) == '0' &&
          this.editData.purchasePrice.length == 2
        ) {
          this.editData.purchasePrice = this.editData.purchasePrice.substr(
            1,
            obj.value.length
          )
        }
      }
    },
    // 位置编码对应位置描述
    changeSelect (val) {
      this.editData.locationCode = val
      this.positionCode.forEach(item => {
        if (val == item.locationCode) {
          this.editData.locationName = item.locationDesc
        }
      })
    },
    // 下载
    downRileRef () {
      axiosGet(
        '/process/acceptance/zip-download?applicationNum=' +
        this.formData.applicationNum
      ).then(result => {
        if (result.code == 200) {
          window.location.href = this.constApi + result.data
        } else {
          this.$message({
            message: result.message,
            type: 'error'
          })
        }
      })
    },
    dialogparticipationPOP () {
      this.dialogparticipation = true
      // this.$refs.toChild.parentMsg(this.selectedUser);
    },
    // 结构树选择模块
    getJieGouTree (deptNum) {
      axiosGet('/approval/modules?deptNum=' + deptNum).then(result => {
        if (result.code == 200) {
          this.jGTreeMoKuai = result.data
        } else {
          this.$message.error(resule.message)
        }
      })
    },

    // 修改table参数
    handleviewClick (index, value) {
      this.getJieGouTree(value.usingDept)
      var _this = this
      _this.dialogEdit = true
      _this.editData = value
    },

    // 选择什么打印机
    handleNodeClick (data) {
      this.daYinList.printName = data.label
      this.daYinList.param = this.tableData
    },

    // 打印标签测试
    // daYinGo() {
    //   axiosPost("label/print", this.daYinList).then(result => {
    //     if (result.code == 200) {
    //       console.log(result);
    //       this.dialogFormVisible = false;
    //     } else {
    //       this.$message.error("出错啦！");
    //     }
    //   });
    // },

    // 选择要打印类型
    handleCommand (command) {
      if (command == '00') {
        if (!this.yesOrNoIsCar) {
          for (var i = 0; i < this.tableData.length; i++) {
            var val
            var s = document.getElementById('mytt')
            val = s.XPrnConnectUsbPort('USB', 1000)
            val = s.XPrnSendBuffer('NASC 936\n')
            val = s.XPrnAddImageToLabelEx('BCIB.BMP', 30, 195, 1, 4)
            val = s.XPrnAddTextToLabelEx(
              '北京首都国际机场股份有限公司',
              'MHeiGB18030C-Medium',
              8,
              88,
              180,
              1,
              1
            )
            val = s.XPrnAddBarcodeToLabel(
              this.tableData[i].equipNum,
              'QRCODE',
              320,
              330,
              8,
              1,
              1,
              7
            )
            val = s.XPrnAddTextToLabelEx(
              '名称：' + this.tableData[i].equipName,
              'MHeiGB18030C-Medium',
              8,
              30,
              120,
              1,
              1
            )
            val = s.XPrnAddTextToLabelEx(
              '日期：' + this.tableData[i].startDate,
              'MHeiGB18030C-Medium',
              8,
              30,
              70,
              1,
              1
            )
            val = s.XPrnAddTextToLabelEx(
              '编码：' + this.tableData[i].equipNum,
              'MHeiGB18030C-Medium',
              8,
              30,
              20,
              1,
              1
            )
            val = s.XPrnPrintLabel(1)
            val = s.XPrnClearLabelBuffer()
            val = s.XPrnCloseConnect()
          }
        } else {
          for (var i = 0; i < this.tableData.length; i++) {
            var val
            var s = document.getElementById('mytt')
            val = s.XPrnConnectUsbPort('USB', 1000)
            val = s.XPrnSendBuffer('NASC 936\n')
            val = s.XPrnAddImageToLabelEx('BCIB.BMP', 15, 190, 1, 4)
            val = s.XPrnAddTextToLabelEx(
              '北京首都国际机场股份有限公司',
              'MHeiGB18030C-Medium',
              8,
              88,
              175,
              1,
              1
            )
            val = s.XPrnAddBarcodeToLabel(
              this.tableData[i].equipNum,
              'QRCODE',
              320,
              330,
              8,
              1,
              1,
              7
            )
            val = s.XPrnAddTextToLabelEx(
              '名   称:' + this.tableData[i].equipName,
              'MHeiGB18030C-Medium',
              8,
              15,
              125,
              1,
              1
            )
            val = s.XPrnAddTextToLabelEx(
              '车牌号:京A123456',
              'MHeiGB18030C-Medium',
              8,
              15,
              90,
              1,
              1
            )
            val = s.XPrnAddTextToLabelEx(
              '日   期:' + this.tableData[i].startDate,
              'MHeiGB18030C-Medium',
              8,
              15,
              55,
              1,
              1
            )
            val = s.XPrnAddTextToLabelEx(
              '编   码:' + this.tableData[i].equipNum,
              'MHeiGB18030C-Medium',
              8,
              15,
              20,
              1,
              1
            )
            val = s.XPrnPrintLabel(1)
            val = s.XPrnClearLabelBuffer()
            val = s.XPrnCloseConnect()
          }
        }
      } else {
        for (var i = 0; i < this.tableData.length; i++) {
          var val;
          var s = document.getElementById("mytt");
          val=s.XPrnConnectUsbPort("USB",1000);
          val=s.XPrnAddImageToLabelEx("D:\\aaa.bmp",155,72,1,4);
          val=s.XPrnAddCommand("PP240,120:AN7");
          val=s.XPrnAddCommand("BARSET \"QRCODE\",1,1,5,2,1");
          val=s.XPrnAddCommand("PB \""+this.tableData[i].equipNum+"\"");
          val=s.XPrnPrintLabel(1);
          val=s.XPrnClearLabelBuffer();
          val=s.XPrnCloseConnect();
        }
      }
    },

    handleTechnicalChecked (value) {
      // 技术资料选中
      var _this = this
      _this.selectedTechnologyList = []
      if (value) {
        value.forEach(item => {
          _this.selectedTechnologyList.push({
            dicId: item.id,
            childId: ''
          })
        })
      }
    },
    handelConclusionChecked (value) {
      //验收结论选中处理
      var _this = this
      _this.selectedConclusionList = []
      if (value) {
        _this.acceptConclusion.forEach(item => {
          if (item.id == value) {
            _this.selectedConclusionList.push({
              dicId: item.id,
              childId: ''
            })
          }
        })
      }
    },

    getCheckedNodes (value) {
      let _this = this
      _this.dialogparticipation = false
    },
    handleContentChecked (value) {
      var _this = this
      _this.acceptContentList.forEach((item, index) => {
        item.childList.forEach(child => {
          if (child.id == value) {
            _this.selectedContentList[index].childId = value
          }
        })
      })
    },

    closeEditDialog () {
      this.$refs['editData'].resetFields()
      this.dialogEdit = false
    },
    editDeviceForm (formName, flag) {
      var _this = this
      if (flag == 'submit') {
        let parmas = {
          applyForm: {
            equipInfos: [_this.editData]
          }
        }
        _this.$refs[formName].validate(valid => {
          if (valid) {
            axiosPost('approval/equipvalidate', parmas).then(result => {
              if (result.code == 200) {
                _this.tableData.forEach((item, index) => {
                  if (item.equipNum == _this.editData.equipNum) {
                    _this.tableData.splice(index, 1, _this.editData)
                  }
                })
                sessionStorage.setItem(
                  'recordTableData',
                  JSON.stringify(_this.tableData)
                )
                _this.dialogEdit = false
                // 成功push
                _this.deviceList.push(result.data)
              } else {
                // 详情信息展示
                _this.submitErrorMessage = result.message
                _this.submitErrorList = result.data
                _this.submitErrorShow = true
                _this.updateTableData()
              }
            })
          } else {
            _this.updateTableData()
            return false
          }
        })
      } else {
        // 取消操作
        _this.$refs[formName].resetFields()
        _this.updateTableData()
        _this.dialogEdit = false
      }
    },
    // 使用模块
    currentUsingModure (val) {
      var _this = this
      this.editData.usingModure = val
      this.jGTreeMoKuai.forEach(item => {
        if (val == item.moduleNum) {
          _this.editData.usingModureName = item.moduleName
        }
      })
    },
    // 使用人选择
    childByValue: function (childValue) {
      if (childValue !== '0') {
        let name = []
        let id = []
        for (var i = 0; i < childValue.length; i++) {
          name.push(childValue[i].name)
          id.push(childValue[i].usrId)
        }
        this.editData.usingMan = id[0]
        this.editData.usingManName = name[0]
      }
      this.dialogparticipation = false
    },
    updateTableData () {
      var _this = this
      this.$nextTick(function () {
        _this.tableData = JSON.parse(sessionStorage.getItem('recordTableData'))
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    confirmSubmit (ruleForm, value) {
      var _this = this
      if (!value) {
        if (!_this.approvalOpinion) {
          this.$message({
            message: '审批意见不能为空！',
            type: 'error'
          })
          return
        }
      }
      let params = {
        showLoading: true,
        applyForm: {
          id: _this.otherFormData.id,
          applicationNum: _this.otherFormData.applicationNum,
          applicationStatus: _this.otherFormData.applicationStatus,
          applicationDate: _this.otherFormData.applicationDate,
          subject: _this.formData.subject, //主题可编辑
          applicant: _this.otherFormData.applicant,
          applicantName: _this.otherFormData.applicantName,
          mobile: _this.otherFormData.mobile,
          acceptanceDate: _this.otherFormData.acceptanceDate,
          orderNum: _this.otherFormData.orderNum,
          providerName: _this.otherFormData.providerName,
          projectName: _this.otherFormData.projectName,
          projectNum: _this.otherFormData.projectNum,
          spareDetail: _this.productDetail, //备品备件明细
          equipInfos: _this.tableData, //设备明细传过去
          otherOpinion: _this.otherSuggest //其他意见
        },
        sapResultDto: {
          taskId: this.sapId, //从上个页面获取
          groupTask: 'false', //目前默认是false
          circulationConditions: value ? 'Y' : 'N', //根据按钮判断 是驳回 还是提交
          localVariablesParam: {
            approvalOpinion: _this.approvalOpinion //审批意见
          }
        },
        vDics: [
          {
            category: _this.categoryContentId, //验收内容
            dicIds: _this.selectedContentList
          },
          {
            category: _this.categoryTechnologyId, //技术资料
            dicIds: _this.selectedTechnologyList
          },
          {
            category: _this.categoryConclusionyId, //验收结论
            dicIds: _this.selectedConclusionList
          }
        ]
      }
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          let text = ''
          value ? (text = '是否提交？') : (text = '是否驳回？')
          this.$confirm(text, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.DestroyIncomeStatistics = false
              // 接口chuli
              axiosPost('approval/modifyPass', params).then(result => {
                if (result.code == 200) {
                  _this.$message({
                    type: 'success',
                    message: '操作成功'
                  })
                  this.$nextTick(() => {
                    this.DestroyIncomeStatistics = true
                  })
                  _this.disabled = true
                } else if (result.code === 400) {
                  _this.$message({
                    type: 'error',
                    message: result.message
                  })
                } else {
                  _this.$message({
                    type: 'error',
                    message: result.message
                  })
                }
              })
              // 接口处理end
            })
            .catch(() => {
              _this.$message({
                type: 'info',
                message: '已取消'
              })
            })
        } else {
          _this.$message({
            type: 'error',
            message: '请完善必填信息'
          })
        }
      })
    },
    handleNotEvent () {
      var _this = this
      axiosPost('approval/procurementpage', _this.params).then(result => {
        let data = result.data
        if (result.code == 200) {
          _this.yesOrNoIsCar = result.data.applyForm.vehicle
          _this.loading = false
          _this.pageTitle = result.data.title
            ? result.data.title
            : '实物资产验收--技采部资产管理室'
          // 输入框
          _this.formData.applicationNum = data.applyForm.applicationNum
          _this.formData.applicationStatus = data.applyForm.applicationStatus
          _this.formData.applicationDate = data.applyForm.applicationDate
          _this.formData.subject = data.applyForm.subject
          _this.formData.applicantName = data.applyForm.applicantName
          _this.formData.mobile = data.user.mobile
          _this.fileRefs = data.applyForm.fileRefs || []
          // 保存其他数据
          _this.otherFormData = data.applyForm

          // 技术资料
          _this.technicalIInfoList = data.newDic[1].dics
          _this.categoryTechnologyId = data.newDic[1].categoryId

          // 验收理论
          _this.acceptConclusion = data.newDic[2].dics
          _this.bindConclusion = data.newDic[2].dics[0].id // 默认选中第一个
          _this.categoryConclusionyId = data.newDic[2].categoryId
          _this.selectedConclusionList.push({
            dicId: _this.bindConclusion,
            childId: ''
          })

          // 验收内容
          let contentList = []
          contentList = data.newDic[0].dics
          contentList.forEach(item => {
            item.flag = item.childList[0].id
            _this.acceptContentList.push(item)
            _this.selectedContentList.push({
              dicId: item.id,
              childId: item.flag
            })
          }) //默认选中第一个
          _this.categoryContentId = data.newDic[0].categoryId

          // 验收明细
          _this.tableData = data.applyForm.equipInfos
          sessionStorage.setItem(
            'recordTableData',
            JSON.stringify(_this.tableData)
          )
        } else {
          _this.loading = false
        }
      })
      // 位置编码
      axiosGet('process/changeProcess/getPositionCode').then(result => {
        if (result.code == 200) {
          _this.positionCode = result.data
        }
      })
    },
    handleDoEvent () {
      var _this = this
      axiosPost('approval/procurementpage', _this.params).then(result => {
        let data = result.data
        if (result.code == 200) {
          _this.loading = false
          _this.pageTitle = result.data.title
            ? result.data.title
            : '实物资产验收--技采部资产管理室'
          // 输入框
          _this.formData.applicationNum = data.applyForm.applicationNum
          _this.formData.applicationStatus = data.applyForm.applicationStatus
          _this.formData.applicationDate = data.applyForm.applicationDate
          _this.formData.subject = data.applyForm.subject
          _this.formData.applicantName = data.applyForm.applicantName
          _this.formData.mobile = data.user.mobile
          _this.productDetail = data.applyForm.spareDetail
          _this.otherSuggest = data.applyForm.otherOpinion
          _this.productDetail = data.applyForm.spareDetail
          _this.fileRefs = data.applyForm.fileRefs || []
          // 验收明细
          _this.tableData = data.applyForm.equipInfos
        }
      })
      // _this.params.applyformId
      axiosPost('approval/viewdic', {
        id: _this.params.applyformId
      }).then(result => {
        let data = result.data
        if (result.code == 200) {
          _this.loading = false
          // 技术资料
          _this.technicalIInfoList = data.newDic[1].dics
          _this.categoryTechnologyId = data.newDic[1].categoryId
          _this.technicalIInfoList.forEach(item => {
            if (item.select) {
              _this.technicalChecked.push(item)
            }
          })

          // 验收理论
          _this.acceptConclusion = data.newDic[2].dics
          _this.categoryConclusionyId = data.newDic[2].categoryId
          _this.acceptConclusion.forEach(item => {
            if (item.select) {
              _this.bindConclusion = item.id
            }
          })

          // 验收内容
          let contentList = []
          contentList = data.newDic[0].dics
          contentList.forEach(item => {
            item.childList.forEach(list => {
              if (list.select) {
                item.flag = list.id
              }
            })
            _this.acceptContentList.push(item)
            _this.selectedContentList.push({
              dicId: item.id,
              childId: item.flag
            })
          })
          _this.categoryContentId = data.newDic[0].categoryId ;//验收内容Id
        } else {
          this.$message.console.error();
          ('请求错误')
          _this.loading = false
        }
      })
    },
    // 审批意见填充
    ideaFill (val) {
      this.approvalOpinion += val
    }
  },
  created () {
    var _this = this
    // 页面初始化加载
    _this.sapId = _this.params.sapId
    _this.disabled = _this.params.disabled
    _this.finish = _this.params.finish
    _this.params.showLoading = true
    // 上个页面获取的ture或false 是字符串
    if (_this.disabled === 'true') {
      this.disabled = true
    } else {
      this.disabled = false
    }
    if (_this.disabled) {
      _this.handleDoEvent()
    } else {
      _this.handleNotEvent()
    }
    // _this.handleNotEvent();
    // 审批历史id: this.params.applyformId
    _this.childId = this.params.applyformId
  }
}
</script>

<style lang="scss">
  .sb-report {
    padding-bottom: 0px !important;

    .fileRefs {
      padding-bottom: 10px;

      .el-col {
        padding-left: 15px;
        padding: 5px;
      }
    }

    .el-input__icon {
      line-height: 30px;
    }

    .el-input.is-disabled .el-input__inner {
      color: #555;
    }

    .sb-form {
      .el-form-item {
        .el-input__inner {
          width: 180px !important;
        }
      }
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

    .btn-group {
      display: block;
      text-align: center;
      margin-top: 20px;
      box-sizing: border-box;

      .el-form-item__content {
        width: auto !important;
      }
    }

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

  .pagination
  .el-pagination
  .el-pagination__jump
  .is-in-pagination
  .el-input__inner {
    width: 50px !important;
  }

  .addLook {
    line-height: 42px;
  }

  .wappers .el-dialog__header {
    background: #fff;
  }

  .wappers .el-dialog__body {
    padding: 0;
    margin: 0;
    padding-left: 25px;
  }

  .wappers .wapper > div > p {
    line-height: 25px;
  }
</style>
