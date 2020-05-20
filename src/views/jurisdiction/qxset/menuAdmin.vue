<template>
  <div class="common-table">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="名称">
        <el-input v-model="formInline.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getDataList(1, 10)" icon="el-icon-search" size="small">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      border
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="index" label="序号" width="60"></el-table-column>
      <el-table-column prop="name" label="菜单名称" show-overflow-tooltip sortable></el-table-column>
      <el-table-column prop="apiUrl" label="web端URL" show-overflow-tooltip sortable></el-table-column>
      <el-table-column prop="mobileUrl" label="移动端URL" show-overflow-tooltip sortable></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="editUrl(scope.row)"
            type="success"
            plain
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="text-center">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="PageSize"
        background
        layout="total, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
    </div>

    <!-- 权限配置-弹窗Form -->
    <el-dialog top="10vh" width="50%" title="编辑" :visible.sync="configDialog" class="jur-dialog">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="移动端URL">
          <el-input v-model="mobileUrl"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="configDialog = false">取 消</el-button>
        <el-button size="small" type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { axiosPost, axiosGet ,constApi} from "@/api/index.js";
export default {
  data() {
    return {
      configDialog: false, // 添加用户弹窗控制
      constApi: constApi,
      mobileUrl: '',
      editRow: '',
      formInline: {
        name: ""  // 搜索内容
      },
      tableData: [], // 表格-内容
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [10, 20, 30, 40],
      // 默认每页显示的条数（可修改）
      PageSize: 10
    };
  },
  components: {
  },
  created() {
    this.getDataList(this.currentPage, this.PageSize);
  },
  methods: {
    handleSizeChange(val) {
      // 改变每页显示的条数
      this.PageSize = val;
    },
    // 当前页码
    handleCurrentChange(val) {
      // 改变默认的页数
      this.getDataList(val, this.PageSize);
    },
    // 用户列表接口
    getDataList(current, size) {
      let name = this.formInline.name;
      axiosGet("base/api/list?name=" + name + "&current=" + current + "&size=" + size).then(
        res => {
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.totalCount = res.data.total;
          } else {
            this.$message.warning(res.message);
          }
        }
      );
    },
    // 搜索
    onSubmit() {
      this.editRow.mobileUrl = this.mobileUrl;
      axiosPost("/base/api/updateApi", this.editRow).then(result => {
        if (result.code === 200) {
          this.configDialog = false;
          this.getDataList(1, 10);
        } else {
          this.$message.warning(result.message);
        }
      });
    },
    editUrl(row) {
      this.editRow = row;
      this.configDialog = true;
      this.mobileUrl = row.mobileUrl;
    }
  }
};
</script>
<style lang="scss" scoped>
.main-left {
  width: 300px;
  float: left;
  border: 1px #ebeef5 solid;
  padding: 10px;
  margin-right: 20px;
}
.main-right {
  width: 80%;
  float: left;
}
.el-dialog {
  width: 30%;
}
.el-form-item {
  margin-bottom: 15px;
}
</style>
