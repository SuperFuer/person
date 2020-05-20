<template>
  <div class="zhi-history">
    <!-- 搜索条件 -->
    <el-form :inline="true" :model="formInline">
      <el-form-item label="申请编号">
        <el-input v-model="formInline.applyNum"></el-input>
      </el-form-item>
      <!-- <el-form-item label="申请人">
        <el-input v-model="formInline.region"></el-input>
      </el-form-item>-->
      <el-form-item label="主题">
        <el-input v-model="formInline.applySubject"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="onSubmit" icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
        ref="multipleTable"
        :data="tableData"
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
      }">
      <el-table-column :show-overflow-tooltip='true' width="45" type="selection"></el-table-column>
      <el-table-column :show-overflow-tooltip='true' width="145" label="申请编号">
        <template slot-scope="scope" >
          <div @click="goDraftlist(scope.row, scope.$index)" style="cursor:pointer;color:#409EFF">{{scope.row.applicationNum}}</div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip='true' label="主题" prop="subject">
      </el-table-column>
      <el-table-column :show-overflow-tooltip='true' prop="processName" label="流程名称"></el-table-column>
      <el-table-column :show-overflow-tooltip='true' prop="applicationUserName" width="80" label="申请人"></el-table-column>
      <el-table-column :show-overflow-tooltip='true' prop="applicationDate" width="150" label="申请时间"></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        background
        layout="total,prev, pager, next,jumper"
        :page-size="10"
        @current-change="handleCurrentChange"
        :total="total"
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
        //搜索内容
        applyNum: "",
        applySubject: ""
      },
      tableData: [],
      total: 0,
      current: 1,
      size: 10
    };
  },
  methods: {
    onSubmit() {
      // 搜索
      this.handleStartData();
    },
    goDraftlist(row, index) {
      this.$router.push({
        path: "draftDetails",
        query: {
          applicationType: row.applicationType,
          applicationNum: row.applicationNum,
          applicationSapUrl: row.sapUrl,
          type: "history"
        }
      });
    },
    handleCurrentChange(val) {
      this.current = val;
      this.handleStartData();
    },
    handleStartData() {
      var _this = this;
      let parmas = {
        isHistory: true,
        current: this.current,
        size: this.size,
        applicationNum: _this.formInline.applyNum,
        subject: _this.formInline.applySubject,
        showLoading: true
      };
      console.log(parmas);
      axiosPost("process/common/apply-history", parmas).then(result => {
        let code = result.code;
        if (code == 200) {
          _this.tableData = result.data.records;
          _this.total = result.data.total;
        }
      });
    }
  },
  created() {
    var _this = this;
    _this.handleStartData();
  }
};
</script>
<style lang="scss" scoped>
.zhi-history {
  .pagination {
    text-align: center;
  }
}
</style>
