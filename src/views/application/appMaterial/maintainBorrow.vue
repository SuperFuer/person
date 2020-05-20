<style lang="scss" scoped>
  .mt-borrow {
    .el-input {
      width: 180px;
    }
    .el-form-item.select-file {
      .el-form-item__content {
        display: flex;
      }
    }
    .el-form--inline .el-form-item__content {
      display: flex;
    }
    .bluebtn {
      background: #004ea2;
      height: 32px;
      border: 1px solid #004ea2;
      color: #fff;
      margin-top: 2px;
    }

    .collapse-title {
      flex: 1 0 90%;
      order: 1;
    }
    .el-collapse-item__arrow {
      flex: 1 0 auto;
      order: -1;
    }
    .select-file {
      display: block;
      .upload-demo {
        display: flex;
        flex-direction: row;

        /deep/ .el-upload-list {
          order: -1;
          padding-right: 10px;
          border: 1px solid #dcdfe6;
          height: 28px;
          line-height: 28px;
          position: relative;
          border-radius: 4px;
          width: 298px;
          overflow: hidden !important;
          margin-top: 2px;
        }
        /deep/ .el-upload-list__item:first-child {
          margin-top: 2px;
        }
      }
    }
    .btn-group {
      margin-top: 20px;
      text-align: center;
      display: block;
      padding-bottom: 40px;
    }
    .el-button--small, .el-button--small.is-round {
      height: 32px;
      margin-top: 2px;
    }
  }
</style>
<template>
  <div class="mt-borrow common-table">
    <div class="form-title">
      <i class="icon"></i>查询可借用明细
    </div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="设备名称" label-width="107px">
        <el-input v-model="formInline.sbCode"></el-input>
        <el-button type="primary" @click="getEquipData(1)" icon="el-icon-search" size="small" class="ml10">查 询</el-button>
        <el-button type="primary" @click="onReset" icon="el-icon-search" size="small">重 置</el-button>
      </el-form-item>
    </el-form>
    <div class="query-title">可借用设备明细</div>
    <!-- 表格 -->
    <div class="pb10">
      <el-button type="danger" size="small" @click="delList" :disabled="callFlag">删 除</el-button>
    </div>
    <el-table
      ref="multipleTable"
      border
      :data="tableQueryData"
      style="width: 100%"
      tooltip-effect="dark"
      :row-key="getRowKeys"
      @selection-change="selectionChange">
      <el-table-column type="selection" width="55" :selectable='forbiden' :reserve-selection="true"></el-table-column>
      <el-table-column label="序号" width="60" type="index" show-overflow-tooltip></el-table-column>
      <el-table-column prop="equipNum" label="设备编码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="equipName" label="设备名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="installLocDesc" label="安装地点" show-overflow-tooltip></el-table-column>
      <el-table-column prop="usingManName" label="使用人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="usingDeptName" label="所属部门" show-overflow-tooltip></el-table-column>
      <el-table-column prop="moduleName" label="所属模块" show-overflow-tooltip></el-table-column>
      <el-table-column prop="positionCode" label="位置编码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="locationName" label="位置名称" show-overflow-tooltip></el-table-column>
      <el-table-column label="当前借用状态" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
        {{scope.row.status === 1 ? "不可借用" : scope.row.status === 2 ? "可借用" : scope.row.status === 3 ? "已借出" : "流程中"}}
        </template>
      </el-table-column>
      <el-table-column prop="borrowDeptName" label="借用部门" show-overflow-tooltip></el-table-column>
      <el-table-column prop="borrowManName" label="借用人" show-overflow-tooltip></el-table-column>
      <el-table-column prop="borrowDate" label="借用日期" show-overflow-tooltip></el-table-column>
      <el-table-column prop="returnDate" label="归还日期" show-overflow-tooltip></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="z-pages">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        background
        layout="total, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <el-form ref="ruleForm" :inline="true" :rules="rules" style="width:99%">
      <div class="query-title">上传可借用设备明细</div>
      <el-row>
        <el-col>
          <!-- :action="importTemplateUrl" -->
          <el-form-item label="选择文件"  class="select-file">
            <div  class="flex-center">
              <el-upload
                ref="template"
                class="upload-demo"
                :action="importTemplateUrl"
                :before-remove="templatebeforeRemove"
                :on-remove="handleTemplateRemove"
                :file-list="file"
                :on-success="templateImportSuccess"
                :limit="1"
                :on-exceed="handleTemplateExceed"
                :headers="headers"
                accept=".xls"
                :disabled="callFlag"
                :auto-upload="false"
              >
                <el-button class="ml10" :disabled="callFlag" slot="trigger" type="primary" size="small">浏览</el-button>
                <el-button class="ml10 imp" size="small"  @click="submitTemplateUpload" type="primary" :disabled="callFlag">导入</el-button>
              </el-upload>
              <el-button class="bluebtn ml10" size="small" @click="goDownloadUrl" :disabled="callFlag" >下载模板</el-button>
            </div>
          </el-form-item>

        </el-col>
      </el-row>
      <el-collapse class="common-collapse" v-model="currentCollapse">
        <el-collapse-item name="1" class="active">
          <template slot="title">
            <div class="collapse-title">导入数据展示</div>
          </template>
          <el-table
            :data="tableData.slice((currentPageI-1)*pageSize, currentPageI*pageSize)"
            row-key="key"
            >
            <el-table-column label="序号" type="index" show-overflow-tooltip></el-table-column>
            <el-table-column prop="equipNum" label="设备编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="equipName" label="设备名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="installLocDesc" label="安装地点" show-overflow-tooltip></el-table-column>
            <el-table-column prop="usingManName" label="使用人" show-overflow-tooltip></el-table-column>
            <el-table-column prop="usingDeptName" label="所属部门" show-overflow-tooltip></el-table-column>
            <el-table-column prop="moduleName" label="所属模块" show-overflow-tooltip></el-table-column>
            <el-table-column prop="positionCode" label="位置编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="locationName" label="位置名称" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="z-pages">
            <el-pagination
              @current-change="handleCurrentUpload"
              :current-page="currentPageI"
              :page-size="pageSize"
              background
              layout="total, prev, pager, next, jumper"
              :total="tableData.length">
            </el-pagination>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form>
  </div>
</template>
<script>
import { axiosPost, axiosGet, constApi } from "@/api/index.js"
export default {
  data() {
    return {
      formInline: { // 搜索内容
          sbCode: ''
      },
      tableQueryData: [],
      currentPage: 1,  // 默认显示第几页
      totalCount: 0,  // 总条数，根据接口获取数据长度(注意：这里不能为空)
      pageSize: 10, // 默认每页显示的条数（可修改）
      currentCollapse: ["1"],
      selectEquipId: [],
      templateList: [],
      tableData: [],
      isAll: false,
      downloadUrl: 'common/file/template-bor/borrow_detail.xls',
      file: [],
      currentPageI: 1,
      callFlag: false, // 提交之后 所有按钮不可点
      getRowKeys(row) {
        return row.id;
      },
      headers: {
        token: localStorage.getItem("token")
      },
      importTemplateUrl: constApi + "/process/borrowReturn/import",
      rules: {
        file: {
          required: true,
          message: "上传文件不能为空",
          trigger: "change"
        }
      },
    };
  },
  created() {
  },
  methods: {
    // 查询
    getEquipData(currentPage) {
      this.currentPage = currentPage || 1;
      axiosGet("process/borrowReturn/list?current=" + this.currentPage + "&size=" + this.pageSize + "&equipName=" + this.formInline.sbCode).then(result => {
        if (result.code == 200) {
          this.tableQueryData = result.data.records
          this.totalCount = result.data.total
        } else {
          this.$message.error(result.message)
        }
      })
    },
    // 获取下载模板
    getDownloadUrl() {
      axiosGet(this.downloadUrl).then(result => {
        if (result.code == 200) {
          if (result.data) {
            window.location.href = constApi + result.data;
          } else {
            this.$message.warning('链接不存在');
          }
        }
      })
    },
    // 重置
    onReset() {
      this.formInline.sbCode = ''
    },
    // 表格删除
    delList () {
      var _this = this;
      if (!this.selectEquipId.length) {
        this.$message.warning('请先勾选要删除的设备！');
        return;
      }
      this.$alert('确认要删除选中的数据？', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          axiosPost("process/borrowReturn/deleteEquip", {
            ids: _this.selectEquipId,
            isAll: _this.isAll
          }).then(result => {
            _this.getEquipData(1);
          })
        }
      });
    },
    // 分页
    handleCurrentChange(val) {
      this.getEquipData(val)
    },
    // 多选禁用
    forbiden(row, index) {
      return row.status == 2 ? true : false;
    },
    // 勾选的表格
    selectionChange(rows) {
      this.selectEquipId = [];
      if (rows) {
        rows.forEach(row => {
          if (row) {
            this.selectEquipId.push(row.id);
          }
        });
      }
    },
    //导入
    submitTemplateUpload() {
      // if(!this.file.length) {
      //   this.$message.warning('请先选择文件！');
      //   return;
      // }
      this.$refs.template.submit();
    },
    handleCurrentUpload(val) {
      this.currentPageI = val;
    },
    // 导入模板成功
    templateImportSuccess(response, file, filelist) {
      if (response.code === 200) {
        this.$message.success(`导入模板成功！`);
        this.file = filelist;
        this.tableData = response.data;
        this.getEquipData(1);
      } else {
        this.$alert(response.data.messages);
      }
    },
    goDownloadUrl() {
      this.getDownloadUrl();
    },
    handleTemplateExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次已选择了 1 个文件`);
    },
    templatebeforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      });
    },
    handleTemplateRemove(file, fileList) {
      this.file = [];
      this.tableData = [];
    }
  }
}
</script>
