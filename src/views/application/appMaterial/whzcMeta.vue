<template >
  <div class="zhi-whzcMeta">
    <el-form ref="ruleForm" :model="formData" :inline="true" label-width="80px" class="demo-form-inline">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="设备编码"  prop="eqipmentNum">
            <el-input v-model="formData.eqipmentNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目编码"  prop="projectNum">
            <el-input v-model="formData.projectNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="项目名称"  prop="projectName">
            <el-input v-model="formData.projectName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="使用人"  prop="user">
            <el-input v-model="formData.user"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用部门"  prop="userDepart">
            <el-input v-model="formData.userDepart"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用模板"  prop="userTemplate">
            <el-input v-model="formData.userTemplate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="设备描述" prop="des">
            <el-input v-model="formData.des"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备分类"  prop="sort">
            <el-input v-model="formData.sort"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="验收时间"  prop="time">
            <el-input v-model="formData.time"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="项目依据"  prop="projectBase">
            <el-input v-model="formData.projectBase"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统"  prop="system">
            <el-input v-model="formData.system"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="内部订单"  prop="order">
            <el-input v-model="formData.order"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="产品名称" prop>
            <el-input v-model="formData.theme"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格型号" prop>
            <el-input v-model="formData.applicant"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="生产产商"  prop>
            <el-input v-model="formData.tel"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item class="btn-group">
        <el-button type="primary" size="small" @click="handleSubmit('ruleForm')">提交</el-button>
        <el-button size="small" @click="handleReset('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="form-title">
      <i class="icon"></i>查询结果
    </div>
    <el-table :data="tableData" style="width: 99.9%" height="200" v-loading="loading">
      <el-table-column prop="data" label="日期"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="department" label="使用部门"></el-table-column>
      <el-table-column prop="suggest" label="审批意见"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">打印标签</el-button>
          <el-button type="text" size="small">
            <a class="download" href="https://codeload.github.com/douban/douban-client/legacy.zip/master"  download  title="下载">下载</a>

          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { setTimeout } from "timers";
import {loading} from "../../../common/until"
export default {
  data() {
    return {
      formData: {
        eqipmentNum: "",
        projectNum: ""
      },
      tableData: [],
      loading: false
    };
  },
  methods: {
    handleClick(value) {
      console.log(value);
      var _this=this;
    },
    handleSubmit(form) {
      var _this = this;
      _this.loading = true;
      setTimeout(function() {
        _this.loading = false;
      }, 500);
    },
    handleReset(form) {
      var _this = this;
      _this.loading = true;
      setTimeout(function() {
        _this.loading = false;
      }, 500);
      this.$refs[form].resetFields();
      this.tableData = [];
    }
  }
};
</script>
<style lang="scss" scoped>
.zhi-whzcMeta {
  .btn-group {
    display: block;
    text-align: center;
    margin-top: 20px;
  }
}
</style>
