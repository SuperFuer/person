<template>
  <div class="zhi-labelPrinting">
    <div class="form-title">
      <i class="icon"></i>
      操作历史
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
      <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="54px"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="equipNum" label="申请编号" width="180px">
        <template slot-scope="scope">
          <div @click="goHistory(scope.row)" class="history">{{scope.row.applicationNum}}</div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="applicationName" label="申请流程"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="subject" label="主题"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="applicationDate" label="申请日期"></el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="useDept" label="审批完成时间" width="120px"></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="applicant" label="申请人"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="common-pagination">
      <el-pagination
        background
        layout="total, prev, pager, next, jumper"
        :total="tableData.length"
        @current-change="handlePopPagination"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js";
export default {
  data() {
    return {
      tableData: [],
      popCurrentPage: 1,
      popPageSize: 10
    };
  },
  methods: {
    handleStartData(equipmentNum) {
      var _this = this;
      axiosGet("archive/query-list?equipmentNum=" + equipmentNum, {
        showLoading: true
      }).then(result => {
        console.log(result);
        _this.tableData = result.data;
      });
    },
    handlePopPagination(val) {
      this.popCurrentPage = val;
    },
    goHistory(row) {
      this.$router.push({
        path:"/historyRecord",
        query:{
          equipmentNum:row.applicationNum
        }
      })
    }
  },
  created() {
    this.handleStartData(this.$route.query.equipmentNum);
  }
};
</script>
<style lang="scss">
.zhi-labelPrinting {
  .common-collapse {
    .collapse-title {
      padding-left: 20px;
    }
    .el-collapse-item__arrow {
      margin: 0 0px 0 -74px;
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
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-textarea {
    position: relative;
    display: inline-block;
    width: 100%;
    vertical-align: bottom;
    font-size: 14px;
  }
  .btn-group {
    margin: 20px 0;
  }
  .history {
    // text-decoration: underline;
    color: #004ea2;
    cursor: pointer;
  }
}
</style>
