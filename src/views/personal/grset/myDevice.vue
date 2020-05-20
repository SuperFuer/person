<template>
  <div class="device">
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
            style="display: inline-block;width: 202px"
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
          <el-button type="primary" size="mini" icon="el-icon-search" @click="getSearchData">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="query-title">设备列表</div>
      <div style="text-align:right;margin:10px 2px 10px;">
        <el-button type="primary" size="mini" @click="getImportData">导出</el-button>
      </div>
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
      >
        <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="55"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="equipNum" label="设备编码"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="equipName" label="设备名称"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="processState" label="流转状态"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="useMan" label="使用人"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="useDept" label="使用人部门" width="120px"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="belongModule" label="所属模块">
          <template slot-scope="scope">
            <div v-if="scope.row.belongModule">{{scope.row.belongModule}}</div>
            <div v-else>——</div>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="locationCode" label="位置编码">
          <!-- <template slot-scope="scope">
            <div v-if="scope.row.locationCode">{{scope.row.locationCode}}</div>
            <div v-else>——</div>
          </template>-->
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="locationDesc" label="位置描述">
          <!-- <template slot-scope="scope">
            <div v-if="scope.row.locationDesc">{{scope.row.locationDesc}}</div>
            <div v-else>——</div>
          </template>-->
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" prop="equipState" label="设备状态"></el-table-column>
        <el-table-column :show-overflow-tooltip="true" label="操作">
          <template slot-scope="scope">
            <div @click="handleOperation(scope.row)" class="history">操作历史</div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="common-pagination">
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :total="tableData.length"
          :current-page.sync="popCurrentPage"
          @current-change="handlePopPagination"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js";
import orgstructure from "@/components/orgstructure";
export default {
  components: { orgstructure },
  data() {
    return {
      admin: false,
      innerVisible: false, //选择人弹框
      buMenoptions: [], //部门
      tableData: [],
      allUserList:[],
      popCurrentPage: 1,
      popPageSize: 10,
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
      equipNameQuery: "",
      departmentQuery: "",
      userQuery: ""
    };
  },
  created() {
    var _this = this;
    //获取管理员信息
    axiosGet("process/common/init-query", { showLoading: true }).then(
      result => {
        if (result.code == 200) {
          this.admin = result.data.isEqMgr; //是否是管理员

          this.buMenoptions = result.data.depts;
          this.buMenoptions.forEach(item => {
            if (item.selected) {
              this.departmentQuery = item.deptNum;
            }
          });
          let num = _this.$route.query.num;
          if (num && num == "1") {
            _this.userQuery = "部门所有人";
            this.selectUsrId = [];
          } else {
            _this.userQuery = result.data.usingManName;
            _this.selectUsrId = [result.data.usingMan];
          }
          this.getSearchData();
        }
      }
    );
  },
  methods: {
    handlePopSelect(val) {
      this.popMultipleSelect = val;
    },
    handlePopPagination(val) {
      this.popCurrentPage = val;
    },
    handleOperation(row) {
      this.$router.push({
        path: "/operationHistory",
        query: {
          equipmentNum: row.equipNum
        }
      });
    },
    // 导出
    getImportData() {
      import("@/vendor/Export2Excel").then(excel => {
        // 表格的表头列表
        const tHeader = [
          "设备编码",
          "设备名称",
          "流转状态",
          "使用人",
          "使用人部门",
          "所属模块",
          "位置编码",
          "位置描述",
          "设备状态"
        ];
        // 与表头相对应的数据里边的字段
        const filterVal = [
          "equipNum",
          "equipName",
          "processState",
          "useMan",
          "useDept",
          "belongModule",
          "locationCode",
          "locationDesc",
          "equipState"
        ];
        const list = this.allUserList;
        const data = this.formatJson(filterVal, list);
        // 方便操作数据
        excel.export_json_to_excel(tHeader, data, "设备列表");
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
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
      console.log(this.equipCodeMulitQuery);
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
      console.log(childValue);
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
        useMan: this.selectUsrId,
        pageSize: "",
        pageNum: "",
        flag: false,
        type: "2"
      };
      axiosPost("archive/equipment/list", parmas).then(result => {
        if (result.code == 200 && result.data && result.data.length > 0) {
          _this.tableData = result.data;
          _this.allUserList=result.data;
        } else {
          _this.tableData = [];
           _this.allUserList=[]
          // _this.messageTip(result.message);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
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
.device {
  .el-input {
    width: 202px;
  }
  .history {
    // text-decoration: underline;
    color: #004ea2;
    cursor: pointer;
  }
  .query-title {
    position: relative;
    button {
      position: absolute;
      right: 10px;
    }
  }
}
</style>
