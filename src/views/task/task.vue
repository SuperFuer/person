<template>
  <div>
    <!-- 搜索条件 -->
    <div class="form-title">
      <i class="icon"></i>待办事项
    </div>
    <!-- <el-form :inline="true" :model="formInline">

    </el-form>-->
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      border
      tooltip-effect="dark"
      style="width: 99%"
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
      <el-table-column :show-overflow-tooltip="true" type="selection"></el-table-column>
      <el-table-column class="zijijiade" :show-overflow-tooltip="true" label="申请编号">
        <template slot-scope="scope">
          <span @click="getUrl(scope.row)" style="cursor:pointer;color:#409EFF"
          >{{scope.row.sap.businessKey}}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="sap.processInstanceName" label="主题"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="sap.processDefinitionKey" label="流程名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="sap.name" label="当前节点"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="sap.startUser" width="70" label="申请人"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="sap.startTime" label="申请时间"></el-table-column>
      <el-table-column width="90" :show-overflow-tooltip="true" label="审批历史">
        <template slot-scope="scope">
          <i
            class="history-icon iconfont icon-liucheng1"
            @click="historyIco(scope.row.sap.processInstanceId)"
          ></i>
        </template>
      </el-table-column>
      <!--      <el-table-column prop="sap.processInstanceName" label="主题" width="180"></el-table-column>-->
      <!--      <el-table-column prop="sap.processDefinitionKey" label="流程名称" width="250"></el-table-column>-->
      <!--      <el-table-column prop="sap.name" label="当前节点"></el-table-column>-->
      <!--      <el-table-column prop="sap.assignee" label="申请人"></el-table-column>-->
      <!--      <el-table-column prop="sap.startTime" label="申请时间"></el-table-column>-->
      <!--      <el-table-column label="审批历史">-->
      <!--        <template slot-scope="scope">-->
      <!--          <i class="history-icon iconfont icon-liucheng1" @click="historyIco(scope.row.sap.processDefinitionId)"></i>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>
    <!-- 审批历史流程图 -->
    <el-dialog
      title="审批历史"
      :visible.sync="dialogVisible"
      width="80%"
      height="50%"
      :before-close="handleClose"
      class="historyDia"
    >
      <div class="clearfix imgheight">
        <img :src="img" alt class="img" />
      </div>
    </el-dialog>
    <div class="zhi-pagination" style="text-align:center">
      <el-pagination
        background
        layout="total,prev, pager, next,jumper"
        :page-size="10"
        @current-change="handleCurrentChange"
        :total="tableData.length"
      ></el-pagination>
    </div>

    <div v-if="xiaoShiLiShi" class="form-title">
      <i class="icon"></i>申请历史
    </div>
    <!-- 申请历史 -->
    <el-table
      v-if="xiaoShiLiShi"
      ref="multipleTable"
      :data="historyData"
      tooltip-effect="dark"
      style="width: 99%"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="申请编号" width="180">
        <template slot-scope="scope">
          <div
            @click="goDraftlist(scope.$index, scope.row)"
            style="cursor:pointer"
          >{{scope.row.applicationNum}}</div>
        </template>
      </el-table-column>
      <el-table-column label="主题" width="180">
        <template slot-scope="scope">
          <div
            @click="goDraftlist(scope.$index, scope.row)"
            style="cursor:pointer"
          >{{scope.row.subject}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="processName" label="流程名称" width="250"></el-table-column>
      <el-table-column prop="applicationUserName" label="申请人"></el-table-column>
      <el-table-column prop="applicationDate" label="申请时间"></el-table-column>
    </el-table>
    <div v-if="xiaoShiLiShi" class="pagination" style="text-align:center">
      <el-pagination
        background
        layout="total,prev, pager, next,jumper"
        :page-size="10"
        @current-change="handleHistoryChange"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js"
export default {
  data() {
    return {
      formInline: {
        // 搜索内容
        user: "",
        region: "",
        state: ""
      },
      img: "",
      dialogVisible: false,
      isProcurementDept: "",
      tableData: [],
      historyData: [],
      pageSize: 10,
      currentPage: 1,
      total: 0,
      current: 1,
      size: 10,
      xiaoShiLiShi: "" // 是否显示申请历史
    };
  },

  methods: {
    handleCurrentChange(val) {
      // 分页在前端
      this.currentPage = val;
    },
    handleHistoryChange(val) {
      this.current = val;
      this.getHistory();
    },
    // 待办接口
    needList(finished) {
      axiosPost("approval/todoList", {
        finished: false,
        applyformId: "",
        taskOwner: "",
        showLoding: true
      }).then(result => {
        this.tableData = result.data.todoDtos;
      });
    },
    // 跳转至详情
    getUrl(item) {
      this.$router.push({
        path: item.sap.sapUrl
      });
      localStorage.setItem("sapurl", item.sap.sapUrl);
    },
    getHistory() {
      var _this = this;
      let parmas = {
        isHistory: true,
        current: this.current,
        size: this.size,
        applicationNum: "",
        subject: ""
      };
      axiosPost("process/common/apply-history", parmas).then(result => {
        let code = result.code;
        if (code == 200) {
          _this.historyData = result.data.records;
          _this.total = result.data.total;
        }
      });
    },
    // 审批历史流程图
    historyIco(processInstanceId) {
      this.dialogVisible = true;
      axiosGet(
        "approval/historyImage?processInstanceId=" + processInstanceId
      ).then(result => {
        if (result.code === 200) {
          this.img = "data:image/png;base64," + result.data.bufferedImage;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    // 关闭审批历史弹窗
    handleClose (done) {
      this.dialogVisible = false
    }
  },
  created () {
    this.needList()
    this.getHistory()
  }
}
</script>
<style lang="scss" scoped>
.historyDia {
  .el-dialog {
    height: 615px !important;
    .imgheight {
      min-height: 400px;
      .img {
        width: 100%;
      }
    }
  }
}
.history-icon {
  font-size: 20px;
  color: #409eff;
  font-weight: 600;
}

</style>
