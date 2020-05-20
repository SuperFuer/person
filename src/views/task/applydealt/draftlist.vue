<template>
  <div class="zhi-draftlist">
    <!-- 搜索条件 -->
    <el-form :inline="true" :model="formInline" label-width="80px">
      <div>
        <el-form-item label="申请编号" label-width="80px">
          <el-input v-model="formInline.applyNum"></el-input>
        </el-form-item>
        <el-form-item label="主题" label-width="80px">
          <el-input v-model="formInline.applySubject"></el-input>
        </el-form-item>
      </div>
      <el-form-item prop="startTime" label="开始日期" label-width="80px">
        <el-date-picker
          v-model="formInline.startTime"
          type="date"
          :picker-options="startTime"
          value-format="yyyy-MM-dd"
          placeholder="开始时间"
          :clearable="clearable"
          :editable='false'
        />
      </el-form-item>
      <el-form-item prop="endTime" label="结束日期" label-width="80px">
        <el-date-picker
          v-model="formInline.endTime"
          type="date"
          :picker-options="endTime"
          value-format="yyyy-MM-dd"
          placeholder="结束时间"
          :clearable="clearable"
          :editable='false'
        />
      </el-form-item>
      <el-form-item style="padding-left:10px;position:relative;top:-2px;">
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
      <el-table-column :show-overflow-tooltip='true' label="申请编号" width="145">
        <template slot-scope="scope">
          <div
            @click="goDraftlist(scope.$index, scope.row)"
            style="cursor:pointer;color:#409EFF"
          >{{scope.row.applicationNum}}</div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip='true' label="主题" prop="subject"></el-table-column>
      <el-table-column :show-overflow-tooltip='true' prop="processName" label="流程名称"></el-table-column>
      <el-table-column :show-overflow-tooltip='true' prop="applicationUserName" width="70" label="申请人"></el-table-column>
      <el-table-column :show-overflow-tooltip='true' prop="applicationDate" width="150" label="申请时间"></el-table-column>
    </el-table>
    <!-- 草稿列表不做分而 -->
    <!-- <div class="pagination">
      <el-pagination
        background
        layout="total,prev, pager, next,jumper"
        :page-size="10"
        @current-change="handleCurrentChange"
        :total="total"
      ></el-pagination>
    </div>-->
  </div>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js";
export default {
  data() {
    return {
      clearable: false,
      startTime: {
        disabledDate: time => {
          let endDateVal = this.formInline.endTime;
          if (endDateVal) {
            return time.getTime() > new Date(endDateVal).getTime();
          } else {
            return time.getTime() > Date.now(); // 大于当前时间禁止选择
          }
        }
      },
      // 结束时间
      endTime: {
        disabledDate: time => {
          let beginDateVal = this.formInline.startTime;
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 8.64e7;
          }
        }
      },
      formInline: {
        applyNum: "",
        applySubject: "",
        //搜索内容
        startTime: "",
        endTime: new Date()
      },
      tableData: [],
      total: 0,
      current: 1,
      size: 10
    };
  },
  methods: {
    onSubmit() {
      this.handleStartData();
    },
    goDraftlist(index, row) {
      this.$router.push({
        path: "/draftDetails",
        query: {
          applicationType: row.applicationType,
          applicationNum: row.applicationNum,
          applicationSapUrl: row.sapUrl,
          type: "draft"
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
        isHistory: false,
        applicationNum: _this.formInline.applyNum,
        subject: _this.formInline.applySubject,
        startDate: this.formInline.startTime,
        endDate: this.formInline.endTime,
        showLoading: true
      };
      console.log(parmas);
      axiosPost("process/common/apply-history", parmas).then(result => {
        let code = result.code;
        if (code == 200) {
          _this.tableData = result.data;
          _this.total = result.data.total;
        }
      });
    }
  },
  created() {
    var _this = this;
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth(); //得到月份
    var date = now.getDate(); //得到日期
    let month2 = month + 1;
    // console.log(date+"date");
    date < 10 ? (date = "0" + date) : (date = date);
    month < 10 ? (month = "0" + month) : (month = month);
    month2 < 10 ? (month2 = "0" + month2) : (month2 = month2);
    this.formInline.startTime = year + "-" + month + "-" + date;
    this.formInline.endTime = year + "-" + month2 + "-" + date;
    _this.handleStartData();
  }
};
</script>
<style lang="scss">
.zhi-draftlist {
  .pagination {
    text-align: center;
  }
  .el-input__icon {
    line-height: 26px;
  }
  .el-date-editor.el-input {
    width: 202px;
  }
  .el-input__inner{
    width:202px !important;
  }
  .el-table {
    padding-bottom: 30px !important;
  }
  .el-input__icon{
    line-height: 36px;
  }
}
</style>
