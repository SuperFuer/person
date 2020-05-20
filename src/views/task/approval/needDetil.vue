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
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        border
        tooltip-effect="dark"
        style="width: 98%"
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
      <el-table-column  :show-overflow-tooltip='true' type="selection"></el-table-column>
      <el-table-column :show-overflow-tooltip='true' label="申请编号">
        <template slot-scope="scope">
          <div @click="getUrl(scope.row)" style="cursor:pointer;color:#409EFF">{{scope.row.sap.businessKey}}</div>
          <!-- <router-link
            :to="{ path: '/approvalDetails', query: { disabled: 'true',finish:'ok', applyformId: scope.row.applyForm.id, sapId: scope.row.sap.id, isProcurementDept: isProcurementDept, formKey: scope.row.sap.formKey }}"
          >{{scope.row.applyForm.applicationNum}}</router-link>-->
        </template>
      </el-table-column>
      <el-table-column  :show-overflow-tooltip='true' prop="sap.processInstanceName" label="主题"></el-table-column>
      <el-table-column  :show-overflow-tooltip='true' prop="sap.processDefinitionKey" label="流程名称"></el-table-column>
      <el-table-column  :show-overflow-tooltip='true' prop="sap.name" label="当前节点"></el-table-column>
      <el-table-column  :show-overflow-tooltip='true' prop="sap.startUser"  width="70" label="申请人"></el-table-column>
      <el-table-column  :show-overflow-tooltip='true' prop="sap.startTime" label="申请时间"></el-table-column>
    </el-table>
    <div class="zhi-pagination" style="text-align:center">
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
      isProcurementDept: "",
      tableData: [],
      pageSize: 10,
      currentPage: 1
    };
  },
  created() {
    this.needList();
  },
  methods: {
    handleCurrentChange(val) {
      console.log(val);
      this.currentPage = val;
    },
    onSubmit() {
      this.needList();
    },
    // 跳转至详情
    getUrl(item) {
      this.$router.push({
        path: item.sap.sapUrl
      });
      localStorage.setItem("sapurl", item.sap.sapUrl);
    },
    // 已办接口
    needList(finished) {
      var _this = this;
      axiosPost("approval/todoList", {
        finished: "true",
        applyformId: _this.formInline.applyformId,
        taskOwner: _this.formInline.taskOwner,
         showLoading:true
      }).then(result => {
        this.tableData = result.data.todoDtos;
        this.isProcurementDept = result.data.isProcurementDept;
        // console.log(result.data.todoDtos)
      });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
