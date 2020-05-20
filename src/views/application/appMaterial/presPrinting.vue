<template>
  <div class="zhi-presPrinting common-table">
    <!-- 搜索条件 -->
    <div class="form-title">
      <i class="icon"></i>
      验收报告及明细
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline" ref="ruleForm">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="验收编号" prop="applicationNum">
            <el-input v-model="formInline.applicationNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备编码" prop="equipNum">
            <el-input v-model="formInline.equipNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="采购订单" prop="orderNum">
            <el-input v-model="formInline.orderNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="项目编号" prop="projectNum">
            <el-input v-model="formInline.projectNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="formInline.projectName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item class="btn" style="text-align:right;width:270px;">
            <el-button type="primary" @click="onSubmit"  size="small">查 询</el-button>
            <el-button
             type="warning"
              @click="reset('ruleForm')"
              size="small"
            >重 置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-collapse class="common-collapse" v-model="currentCollapse">
      <el-collapse-item name="1" class="active">
        <template slot="title">
          <div class="collapse-title">验收报告</div>
        </template>
        <el-table
          ref="tableData"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 99%"
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
          @selection-change="handleSelectionChange"
        >
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="goReport(scope.row)" type="text" size="small">打印报告</el-button>
              <el-button @click="goDetail(scope.row)" type="text" size="small">验收明细</el-button>
            </template>
          </el-table-column>-->
          <el-table-column :show-overflow-tooltip='true' width="65" type="index" label="序号">
          </el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="applicationNum" label="验收编号">
            <template slot-scope="scope">
              <div @click="goReport(scope.row)" type="text" size="small" style="cursor:pointer;color:#409EFF">{{scope.row.applicationNum}}</div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="orderNum" label="采购订单"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="projectNum" label="项目编号"></el-table-column>
          <el-table-column :show-overflow-tooltip='true' prop="projectName" label="项目名称"></el-table-column>
        </el-table>
        <div class="pagination" style="text-align:center">
          <el-pagination
            background
            layout="total,prev, pager, next,jumper"
            :page-size="10"
            @current-change="handleCurrentChange"
            :total="total"
          ></el-pagination>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from "@/api/index.js";
export default {
  data() {
    return {
      currentCollapse: ["1"],
      formInline: {
        // 搜索内容
        applicationNum: "",
        equipNum: "",
        orderNum: "",
        projectNum: "",
        projectName: ""
      },
      tableData: [],
      multipleSelection: [],
      pageSize: 10, //每页个数
      currentPage: 1, //当前页面
      total: 0
    };
  },
  methods: {
    goReport(row) {
      this.$router.push({
        path: "/printDetail",
        query: {
          applyformId: row.applicationNum
        }
      });
    },
    goDetail(row) {
      this.$router.push({
        path: "/labelPrinting"
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 查询
    onSubmit() {
      this.getStartData();
      this.currentPage = 1;
    },
    // 重置
    reset(form) {
      this.$refs[form].resetFields();
      this.getStartData();
      this.currentPage = 1;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getStartData();
    },
    getStartData() {
      var _this = this;
      axiosGet(
        "accEquip/report/equipList?applicationNum=" +
          _this.formInline.applicationNum +
          "&equipNum=" +
          _this.formInline.equipNum +
          "&orderNum=" +
          _this.formInline.orderNum +
          "&projectNum=" +
          _this.formInline.projectNum +
          "&projectName=" +
          _this.formInline.projectName +
          "&size=10" +
          "&current=" +
          _this.currentPage,
        {
          showLoading: true
        }
      ).then(result => {
        if (result.code == 200) {
          _this.tableData = result.data.records;
          _this.total = result.data.total;
        }
      });
    }
  },
  created() {
    this.getStartData();
  }
};
</script>
<style lang="scss">
.zhi-presPrinting {
  .btn {
    width: 100%;
    .el-form-item__content {
      text-align: right;
    }
  }
  .sb-title {
    cursor: pointer;
  }
  .common-collapse {
    .collapse-title {
      padding-left: 20px;
    }
    .el-collapse-item__arrow {
      margin: 0 0px 0 -74px;
      // display: none;
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
}
</style>
