
<template>
  <div class="sealing-page">
    <div class="form-title">
      <i class="icon"></i>实物资产封存申请
    </div>
    <el-form ref="ruleForm" :model="formData" :inline="true" style="width:99%" :rules="rules">
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
      <el-row class="common-row" style="margin-bottom:12px;">
        <el-col :span="8">
          <el-form-item label="主题" label-width="107px" prop="subject">
            <el-input v-model.trim="formData.subject" :disabled="callFlag"></el-input>
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
          <div class="operate-btns mb10">
            <el-button
              size="small"
              type="primary"
              @click="addSealEquip"
              :disabled="callFlag"
              :style="{'opacity':callFlag?0.6:1}"
            >新增</el-button>
            <el-button
              size="small"
              type="danger"
              :disabled="callFlag"
              @click="delSealEquip"
              :style="{'opacity':callFlag?0.6:1}"
            >删除</el-button>
          </div>
          <el-table
            ref="multipleSealDetail"
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
            :row-key="sealRowKey"
          >
            <el-table-column
              :reserve-selection="true"
              :show-overflow-tooltip="true"
              type="selection"
              width="45"
              :disabled="callFlag"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="序号" width="55" type="index"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="equipNum" label="设备编码"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="equipName" label="设备名称"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="useMan" label="使用人"></el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="useDept"
              label="使用人部门"
              width="100px"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="installSite" label="安装地点"></el-table-column>
            <el-table-column label="位置编码" width="140">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.locationCode"
                  filterable
                  :disabled="callFlag"
                  @change="changeSelect(scope.row,scope.$index)"
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
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="locationDesc" label="位置描述"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="封存日期" width="170px">
              <template slot-scope="scope">
                <!-- {{scope.row.archiveTime}} -->
                <el-date-picker
                  class="setDate"
                  :disabled="callFlag"
                  v-model="scope.row.archiveTime"
                  type="date"
                  placeholder="选择日期"
                  :clearable="false"
                  :editable="false"
                  value-format="yyyy-MM-dd"
                ></el-date-picker>
              </template>
            </el-table-column>
            <el-table-column
              :show-overflow-tooltip="true"
              prop="archiveSite"
              label="封存地点"
              width="120px"
            >
              <template slot-scope="scope">
                <el-input
                  style="width:100%"
                  :disabled="callFlag"
                  v-model.trim="scope.row.archiveSite"
                  class="setInput"
                  maxlength="20"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <div class="common-pagination">
            <el-pagination
              background
              layout="total,prev, pager, next,jumper"
              :current-page.sync="currentPage"
              :total="sealDetailList.length"
              @current-change="handlePaginationChange"
            ></el-pagination>
            <span class="have-choice">已选择：{{selectNum}}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="add-common-comment">
        <div class="query-title">添加备注</div>
        <div>
          <el-input
            type="textarea"
            v-model.trim="filterAddComment"
            :row="2"
            resize="none"
            :disabled="callFlag"
          ></el-input>
          <span>{{currentWord}}/{{100}}</span>
        </div>
      </div>
      <div v-if="isHistory == true || isReject == true">
        <history :childId="childId" v-if="DestroyIncomeStatistics == true"></history>
      </div>
      <el-form-item class="btn-group" v-if="isHistory == false && isReject == false">
        <el-button
          @click="submitForm('ruleForm',false,'是否保存？')"
          size="small"
          class="save-btn"
          :disabled="callFlag"
          :style="{'opacity':callFlag?0.6:1}"
        >保存</el-button>
        <el-button
          @click="submitForm('ruleForm',true,'是否提交？')"
          size="small"
          class="submit-btn"
          :disabled="callFlag"
          :style="{'opacity':callFlag?0.6:1}"
        >提交</el-button>
      </el-form-item>
      <el-form-item class="btn-group" v-if="isReject == true">
        <el-button
          @click="resetSubmitForm('ruleForm',false,'是否撤回？')"
          size="small"
          class="danger-btn"
          :disabled="callFlag"
          :style="{'opacity':callFlag?0.6:1}"
        >撤回</el-button>
        <el-button
          @click="resetSubmitForm('ruleForm',true,'是否提交？')"
          size="small"
          class="submit-btn"
          :disabled="callFlag"
          :style="{'opacity':callFlag?0.6:1}"
        >提交</el-button>
      </el-form-item>
    </el-form>
    <!-- 新增页面 -->
    <el-dialog title="添加设备" :visible.sync="addPopDialog" width="70%" top="3vh" class="add-Equip">
      <div class="seal-query">
        <el-form :inline="true" label-width="80px">
          <div>
            <el-form-item label="设备名称" label-width="80px">
              <el-input v-model.trim="equipNameQuery"></el-input>
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
              >已选择{{allOrDanTiao}}条</el-button>

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
                  maxlength="16"
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
            <el-select
              :disabled="!admin"
              class="yanshiZiJi"
              @change="switchDepartment"
              v-model="departmentQuery"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="item in buMenoptions"
                :key="item.deptNum"
                :label="item.deptName"
                :value="item.deptNum"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用人" label-width="80px">
            <el-input
              style="width:202px;"
              v-model="userQuery"
              @focus="setRenDatas"
              :disabled="!admin || userQuery=='部门所有人'"
            ></el-input>
            <span
              @click="allOder"
              v-if="admin"
              style="padding-left: 10px;cursor: pointer;color: #409EFF;"
              class="allOder active"
            >部门所有人</span>

            <!-- 使用人选择 -->
            <el-dialog
              width="70%"
              title="选择使用人"
              :visible.sync="innerVisible"
              class="select-participation-pop"
              append-to-body
              top="2vh"
            >
              <orgstructure ref="getZiZuJianList" v-on:childByValue="childByValue"></orgstructure>
            </el-dialog>
          </el-form-item>
          <el-form-item style="padding-left:10px;position:relative;top:-2px;">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="searchEquip">搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="query-title">查询明细</div>
        <el-table
          ref="multipleTable"
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
          <el-table-column :show-overflow-tooltip="true" prop="equipNum" label="设备编码"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="equipName" label="设备名称"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="equipState" label="设备状态"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="installSite" label="安装地点"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="useMan" label="使用人"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="useDept" label="使用人部门" width="120px"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="belongModule" label="所属模块">
            <!-- <template slot-scope="scope">
              <div v-if="scope.row.belongModule">{{scope.row.belongModule}}</div>
              <div v-else>——</div>
            </template>-->
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="locationCode" label="位置编码"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="locationDesc" label="位置描述"></el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="common-pagination">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :total="tableData.length"
            :page-size="popPageSize"
            :current-page.sync="popCurrentPage"
            @current-change="handlePopPagination"
          ></el-pagination>
          <span class="have-choice">已选择：{{popNumber}}</span>
        </div>
        <div class="el-form-item btn-group center">
          <el-button type="primary" size="small" @click="submitAdd">添加</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 使用部门弹框 -->
  </div>
</template>
<script>
import filter from "../../common/filter";
import { axiosPost, axiosGet } from "@/api/index.js";
import history from "../../components/commonHistory";
import orgstructure from "@/components/orgstructure";
export default {
  props: {
    paramList: Object
  },
  components: { history, orgstructure },
  data() {
    return {
      DestroyIncomeStatistics: true,
      positionCode: [], //位置编码
      innerVisible: false, // 选择人弹框控制字段
      buMenList: [], // 全部部门列表
      buMenRenList: [], // 部门下所有人列表
      xuanZhongRen: [], // 选中的人
      buMenoptions: [], // 的路人管理部门列表
      currentCollapse: ["1"],
      admin: false, //是否是管理员
      buMenoptions: [], // 的路人管理部门列表
      selectUsrId: [],
      saveId: "",
      formData: {
        applicationNum: "",
        applicationStatus: "",
        applicationDate: "",
        subject: "",
        applicantName: "",
        applicantPhone: ""
      },
      rules: {
        subject: [
          {
            required: true,
            message: "主题不能为空",
            trigger: ["blur", "change"]
          },
          {
            min: 5,
            max: 30,
            message: "申请主题长度为 5 - 30 个字符",
            trigger: ["blur", "change"]
          },
          {}
        ]
      },
      addComment: "",
      currentWord: 0,
      addPopDialog: false,
      multipleSelection: [], //选择封存checkbox--list
      sealDetailList: [], //列表
      currentPage: 1,
      // currentPageSize:1,
      pageSize: 10,
      delectDetailList: [],
      tableData: [],
      popMultipleSelect: [],
      popCurrentPage: 1,
      popPageSize: 5,
      popNumber: 0, //已选择
      selectNum: 0, //选择删除
      allOrDanTiao: 0,
      equipCodeQuery: "",
      equipCodeMulitQuery: [],
      dialogVisible: false,
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
      equipCodeShow: "",
      equipNameQuery: "",
      departmentQuery: "",
      userQuery: "",
      callFlag: false,
      isHistory: false, //审批历史为false
      isReject: false, //待办进入
      childId: ""
    };
  },
  computed: {
    filterAddComment: {
      get: function() {
        return this.addComment;
      },
      set: function(val) {
        this.addComment = val.slice(0, 100);
        this.currentWord = this.addComment.length;
      }
    }
  },
  methods: {
    //保存选中的数据equipNum,row-key就是要指定一个key标识这一行的数据
    sealRowKey(row) {
      return row.equipNum;
    },
    popRowKey(row) {
      return row.equipNum;
    },
    // 位置编码
    changeSelect(row, index) {
      this.positionCode.forEach(item => {
        if (item.locationCode == row.locationCode) {
          row.locationDesc = item.locationDesc;
        }
      });
    },
    // 弹窗确定
    btnOk() {
      let arr = [];
      for (var i = 0; i < this.equipment.length; i++) {
        if (this.equipment[i].input) {
          if (this.equipment[i].input && this.equipment[i].input.length != 16) {
            // this.$message.error(this.equipment[i].input + "信息字数不符");
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
    // 编码输入框点击取消
    closeMoble() {
      var that = this;
      that.dialogVisible = false;
      if (that.equipCodeMulitQuery) {
        for (var i = 0; i < that.equipment.length; i++) {
          that.equipment[i].input = this.equipCodeMulitQuery[i];
        }
      }
    },
    // 关闭多条设备查询弹框
    handleClose(done) {
      this.dialogVisible = false;
    },
    // 设备编码弹出 新增输入框
    addInput() {
      this.equipment.push({ input: "" });
    },
    // get子组件数据
    childByValue: function(childValue) {
      if (childValue != "0") {
        let name = [];
        let id = [];
        for (var i = 0; i < childValue.length; i++) {
          name.push(childValue[i].name);
          id.push(childValue[i].usrId);
        }
        this.selectUsrId = id;
        this.userQuery = name.join(",");
      }
      this.innerVisible = false;
    },
    // 更换部门
    switchDepartment(val) {
      this.departmentQuery = val;
    },

    // 根据部门获取部门下人员
    getRenYuanList(id) {
      axiosGet("process/scrap/dept/allUser?deptNum=" + id, {
        showLoading: true
      }).then(result => {
        if (result.code == 200) {
          this.buMenRenList = result.data.data;
        }
      });
    },

    // 获取部门列表
    setRenDatas() {
      this.innerVisible = true;
      axiosGet("process/scrap/dept/all?prentId=62", { showLoading: true }).then(
        result => {
          if (result.code == 200) {
            this.buMenList = result.data.data;
          }
        }
      );
    },
    // 部门所有人
    allOder() {
      let user = JSON.parse(localStorage.getItem("user"));
      if (this.userQuery != "部门所有人") {
        this.userQuery = "部门所有人";
        this.selectUsrId = [];
      } else {
        this.userQuery = user.name;
        this.selectUsrId = [user.usrId];
      }
    },
    searchEquip() {
      this.getSearchData();
    },
    // 新增
    addSealEquip() {
      this.addPopDialog = true;
      // 清除选择checkbox
      if (this.$refs.multipleTable !== undefined) {
        this.$refs.multipleTable.clearSelection();
      }
      this.popCurrentPage = 1;
      this.tableData = [];
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
        department: _this.departmentQuery,
        // department: "1951",
        useMan: this.selectUsrId,
        // useMan: [],
        pageSize: "",
        pageNum: "",
        flag: false
      };
      axiosPost("archive/equipment/list", parmas).then(result => {
        if (result.code == 200 && result.data && result.data.length > 0) {
          _this.tableData = result.data;
        } else {
          _this.tableData = [];
          _this.messageTip(result.message);
        }
      });
    },
    handlePopSelect(val) {
      this.popMultipleSelect = val;
      this.popNumber = this.popMultipleSelect.length;
    },
    handlePopPagination(val) {
      this.popCurrentPage = val;
    },
    submitAdd() {
      this.addPopDialog = false;
      this.sealDetailList = this.sealDetailList.concat(this.popMultipleSelect);
      let hash = {};
      this.sealDetailList = this.sealDetailList.reduce(function(item, next) {
        hash[next.equipNum]
          ? ""
          : (hash[next.equipNum] = true && item.push(next));
        return item;
      }, []);
    },
    // 设备
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectNum = this.multipleSelection.length;
    },
    // 分页
    handlePaginationChange(val) {
      this.currentPage = val;
    },
    /**
     * 删除查询明细
     */
    delSealEquip() {
      var _this = this;

      if (this.multipleSelection.length > 0) {
        _this.multipleSelection.forEach(list => {
          _this.sealDetailList.forEach((item, index) => {
            if (item.equipNum == list.equipNum) {
              _this.sealDetailList.splice(index, 1);
            }
          });
        });
        this.$refs.multipleSealDetail.clearSelection();
        this.multipleSelection = [];
      } else {
        this.messageTip("请选择删除项!");
      }
    },
    /**
     * 提交表单
     */
    submitForm(ruleForm, flag, text) {
      let _this = this;
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (_this.sealDetailList.length == 0) {
            _this.messageTip("请选择设备！");
            return;
          }
          // 判断设备是否选中 或者修改字段为空
          let nullArr = {};
          if (_this.sealDetailList.length > 0 && flag) {
            nullArr = _this.sealDetailList.find(item => {
              return !item.archiveSite || !item.locationCode;
            });
          }
          console.log(nullArr);

          if (
            (flag && nullArr && nullArr.archiveSite == "") ||
            (flag && nullArr && nullArr.locationCode == null)
          ) {
            _this.messageTip("完善设备信息！");
            return;
          }
          // 全部必填信息完成
          this.$confirm(text, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              _this.handleSubmitResult(flag);
            })
            .catch(() => {
              _this.messageTip("已取消");
            });
        }
      });
    },
    handleSubmitResult(flag) {
      var _this = this;
      let user = JSON.parse(localStorage.getItem("user"));
      let params = {
        archiveProcess: {
          applicationNum: _this.formData.applicationNum,
          applicationStatus: _this.formData.applicationStatus,
          applicationDate: _this.formData.applicationDate,
          subject: _this.formData.subject,
          applicant: user.id,
          applicantName: _this.formData.applicantName,
          applicantPhone: _this.formData.applicantPhone,
          archivEquipSate: "1",
          appComment: _this.filterAddComment //备注
          // appOption: ""
        },
        approval: "",
        flag: flag, //true 为提交
        archiveList: _this.sealDetailList, //列表
        comment: "",
        id: _this.saveId,
        applicationNum: _this.formData.applicationNum,
        type: "1", //1为封存,
        showLoading: true
      };
      axiosPost("archive/equipment/submit", params).then(result => {
        if (result.code == 200) {
          _this.formData.applicationNum = result.data.applicationNum;
          _this.formData.applicationStatus = result.data.applicationStatus;
          _this.saveId = result.data.id;
          if (flag) {
            _this.callFlag = true;
          }
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        } else {
          _this.messageTip(result.message);
        }
      });
    },
    // 再次提交和撤回
    resetSubmitForm(ruleForm, flag, text) {
      let _this = this;
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          if (_this.sealDetailList.length == 0) {
            _this.messageTip("请选择设备！");
            return;
          }
          // 判断设备是否选中 或者修改字段为空
          let nullArr = {};
          if (_this.sealDetailList.length > 0) {
            nullArr = _this.sealDetailList.find(item => {
              return !item.archiveSite || !item.locationCode;
            });
          }
          if (
            (flag && nullArr && nullArr.archiveSite == "") ||
            (flag && nullArr && nullArr.locationCode == null)
          ) {
            _this.messageTip("完善设备信息！");
            return;
          }
          // 全部必填信息完成
          this.$confirm(text, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              _this.handleResetSubmitResult(flag);
            })
            .catch(() => {
              _this.messageTip("已取消");
            });
        }
      });
    },
    handleResetSubmitResult(flag) {
      var _this = this;
      if (flag) {
        let user = JSON.parse(localStorage.getItem("user"));
        let params = {
          id: _this.saveId,
          taskId: this.$route.query.id || "",
          applicationNum: _this.formData.applicationNum,
          archiveProcess: {
            applicationNum: _this.formData.applicationNum,
            applicationStatus: _this.formData.applicationStatus,
            applicationDate: _this.formData.applicationDate,
            subject: _this.formData.subject,
            applicant: user.id,
            applicantName: _this.formData.applicantName,
            applicantPhone: _this.formData.applicantPhone,
            archivEquipSate: "1", //1代表封存
            appComment: _this.filterAddComment, //备注
            id: _this.saveId
          },
          archiveList: _this.sealDetailList, //列表
          approval: "",
          flag: true, //true 为提交
          comment: "",
          type: "1", //1为封存,
          showLoading: true
        };
        this.DestroyIncomeStatistics = false;
        axiosPost("archive/resubmit", params).then(result => {
          if (result.code == 200) {
            _this.resetSuccessTip();
          } else {
            _this.messageTip(result.message);
          }
        });
      } else {
        let params = {
          processInstanceId: this.$route.query.instanceId || "",
          deleteReason: "",
          id: _this.saveId,
          applicationNum: _this.formData.applicationNum,
          showLoading: true
        };
        axiosPost("archive/closeProcess", params).then(result => {
          if (result.code == 200) {
            this.$message({
              message: "操作成功！",
              type: "success"
            });
            _this.$router.push({
              path: "/needdealt"
            });
          } else {
            _this.messageTip(result.message);
          }
        });
      }
    },
    resetSuccessTip() {
      this.$message({
        message: "操作成功！",
        type: "success"
      });
      this.callFlag = true;
      this.$nextTick(() => {
        this.DestroyIncomeStatistics = true;
      });
    },
    getInitData() {
      var _this = this;
      // 初始化页面
      axiosGet("archive/init-form?type=1", { showLoading: true }).then(
        result => {
          if (result.code == 200) {
            let data = result.data;
            this.formData.applicantName = data.applicantName;
            this.formData.applicantPhone = data.applicantPhone;
            this.formData.applicationDate = data.applicationDate;
            this.formData.subject = data.subject;
            this.admin = data.flag; //如果为true是管理员
          }
        }
      );
    },
    handleData(applicationNum) {
      // 初始化页面数据
      axiosGet(
        "archive/equipment/pending-approval?applicationNum=" + applicationNum,
        { showLoading: true }
      ).then(result => {
        if (result.code == 200) {
          var data = result.data.ArchiveProcess;
          this.formData.applicationNum = data.applicationNum;
          this.formData.applicationStatus = data.applicationStatus;
          this.formData.applicationDate = data.applicationDate;
          this.formData.subject = data.subject;
          this.formData.applicantName = data.applicantName;
          this.formData.applicantPhone = data.applicantPhone;
          this.filterAddComment = data.appComment ? data.appComment : "";
          this.sealDetailList = result.data.ArchiveProcessAssetsList;
          this.saveId = data.id;
          this.admin = data.flag; //如果为true是管理员
        } else {
          this.$message({
            type: "warning",
            message: result.message
          });
        }
      });
    },
    messageTip(tip) {
      this.$message({
        type: "warning",
        message: tip
      });
    }
  },
  created() {
    var _this = this;
    let formkey = this.$route.query.formKey;
    if (this.paramList && this.paramList.type == "history") {
      _this.callFlag = true;
      _this.childId = this.paramList.applicationNum;
      _this.isHistory = true; //审批历史
      _this.handleData(_this.childId);
    } else if (this.paramList && this.paramList.type == "draft") {
      _this.childId = this.paramList.applicationNum;
      _this.handleData(_this.childId);
    } else if (formkey && formkey == "formkey_1") {
      _this.isReject = true;
      _this.childId = this.$route.query.applicationNum;
      _this.handleData(_this.childId);
    } else {
      this.getInitData();
    }
    // 位置编码
    axiosGet("process/changeProcess/getPositionCode").then(result => {
      if (result.code == 200) {
        _this.positionCode = result.data;
      }
    });
    //获取管理员信息
    axiosGet("process/common/init-query").then(result => {
      if (result.code == 200) {
        this.admin = result.data.isEqMgr; //是否是管理员
        this.selectUsrId = [result.data.usingMan];
        this.userQuery = result.data.usingManName;
        this.buMenoptions = result.data.depts;
        this.buMenoptions.forEach(item => {
          if (item.selected) {
            this.departmentQuery = item.deptNum;
          }
        });
      }
    });
  }
};
</script>
<style lang="scss" scoped>
.sealing-page {
  .add-Equip /deep/ .el-input__inner {
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
  .setCode,
  .setDate {
    .el-input {
      font-size: 12px;
    }
  }
  // .setDate {
  //   .el-input {
  //     font-size: 12px;
  //   }
  // }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .setInput {
    font-size: 12px;
    padding-left: 0;
  }
  .btn-group {
    display: block;
    text-align: center;
    padding-bottom: 20px;
    margin-top: 5px;
    .save-btn.el-button {
      background: #2fce6a;
      color: #fff;
    }
    .submit-btn.el-button {
      background: #004ea2;
      color: #fff;
    }
    .danger-btn.el-button {
      background: #ee5050;
      color: #fff;
    }
  }
  .add-Equip {
    width: 100%;
    height: 100%;
    overflow: hidden;
    // position: relative;
    .el-dialog {
      height: 605px;
    }
  }
}
.select-participation-pop {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .el-dialog {
    height: 630px;
  }
}
.addDia /deep/ {
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
</style>