<template>
  <div>
    <!-- 搜索条件 -->
    <el-form :inline="true" :model="formInline">
      <el-form-item label="申请编号">
        <el-input v-model="formInline.applyformId"></el-input>
      </el-form-item>
      <el-form-item label="申请人">
        <el-input v-model="formInline.taskOwner"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态">
          <el-input v-model="formInline.state"></el-input>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      border
      :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
      tooltip-effect="dark"
      style="width: 99%;"
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
      <el-table-column :show-overflow-tooltip='true' type="selection"></el-table-column>
      <el-table-column :show-overflow-tooltip='true' class="zijijiade" label="申请编号" >
        <template slot-scope="scope">
          <div @click="getUrl(scope.row)" style="cursor:pointer;color:#409EFF">{{scope.row.sap.businessKey}}</div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip='true' prop="sap.processInstanceName" label="主题"></el-table-column>
      <el-table-column :show-overflow-tooltip='true' prop="sap.processDefinitionKey" label="流程名称"></el-table-column>
      <el-table-column :show-overflow-tooltip='true' prop="sap.name" label="当前节点"></el-table-column>
      <el-table-column :show-overflow-tooltip='true' prop="sap.startUser" width="70" label="申请人"></el-table-column>
      <el-table-column :show-overflow-tooltip='true' prop="sap.startTime" label="申请时间"></el-table-column>
      <el-table-column width="90" :show-overflow-tooltip='true' label="审批历史">
        <template slot-scope="scope">
          <i class="history-icon iconfont icon-liucheng1" @click="historyIco(scope.row.sap.processInstanceId)"></i>
        </template>
      </el-table-column>
    </el-table>
    <!-- 审批历史流程图 -->
    <el-dialog
      title="审批历史"
      :visible.sync="dialogVisible"
      width="80%"
      height="50%"
      :before-close="handleClose"
      class="historyDia">
      <div class="clearfix imgheight"><img :src="img" alt="" class="img"></div>
    </el-dialog>
    <div class="zhi-pagination">
      <el-pagination
        background
        layout="total,prev, pager, next,jumper"
        :page-size="10"
        @current-change="handleCurrentChange"
        :total="tableData.length"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js";
export default {
  data() {
    return {
      formInline: {
        // 搜索内容
        applyformId: "",
        taskOwner: "",
        state: ""
      },
      dialogVisible: false,
      isProcurementDept: "",
      tableData: [
        // {
        //   applyForm: {
        //     subject: "",
        //     id: "",
        //     applicationNum: ""
        //   },
        //   sap: {
        //     businessKey: "1"
        //   },
        //   isProcurementDept: 1
        // }
      ],
      img: '',
      pageSize: 10,
      currentPage: 1
    };
  },
  filters: {
  },
  methods: {
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
    },
    onSubmit() {
      var _this = this;
      this.needList();
    },
    // 待办接口
    needList(finished) {
      var _this=this;
      axiosPost("approval/todoList", {
        finished: "false",
        applyformId: _this.formInline.applyformId,
        taskOwner: _this.formInline.taskOwner,
        showLoading:true
      }).then(result => {
        this.tableData = result.data.todoDtos;
        console.log(result.data.todoDtos);
      });
    },
    // 跳转至详情
    getUrl(item) {
      console.log(item);
      this.$router.push({
        path: item.sap.sapUrl
      });
      localStorage.setItem("sapurl", item.sap.sapUrl);
    },
    // 审批历史流程图
    historyIco(processInstanceId) {
      console.log(processInstanceId)
      this.dialogVisible = true
      axiosGet("approval/historyImage?processInstanceId=" + processInstanceId).then(result => {
        if (result.code === 200) {
          this.img = 'data:image/png;base64,' + result.data.bufferedImage
        } else {
          this.$message.error(result.message)
        }
      })
    },
    // 关闭审批历史弹窗
    handleClose(done) {
      this.dialogVisible = false
    }
  },
  created() {
    this.needList();
  }
};
</script>
<style lang="scss" scoped>
  .historyDia {
  .el-dialog {
    height: 615px!important;
    .imgheight {
      min-height: 400px;
      .img {
        width: 100%;
      }
    }
  }
}
.zhi-pagination {
  text-align: center;
  padding-bottom: 10px;
}
.history-icon {
  font-size: 20px;
  color: #409EFF;
  font-weight: 600;
}
</style>
