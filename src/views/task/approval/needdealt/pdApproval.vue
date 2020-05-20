<template>
  <div class="pdApproval">
    <div class="form-title">
      <i class="icon"></i>部门盘点情况
    </div>
    <div class="division">
      <div class="division-left">
        <p>申请信息</p>
      </div>
    </div>
    <el-form class="form-decollate">
      <el-row class="common-row row-list el-row">
        <el-col :span="8">
          <el-form-item label="盘点名称" label-width="100px">
            <el-input disabled class="add"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="盘点年度" label-width="100px">
            <el-input disabled class="add"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="使用模块" label-width="100px">
            <el-input disabled class="add"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="使用人" label-width="100px">
            <el-input disabled class="add"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="division">
      <div class="division-left">
        <p>盘点结果</p>
      </div>
    </div>
  </div>
</template>

<script>
import { axiosPost, axiosGet } from "@/api/index.js";
import cgChange from "./components/cgChange";
import ysReport from "./components/ysReport";
import wrapUrl from "./components/wrapUrl";
import nbChange from "./components/nbChange";

export default {
    data() {
      return {
        value: '',
      }
    }
}
</script>

<style lang="scss" scoped>
.pdApproval {
  .division {
    width: auto;
    height: 42px;
    line-height: 40px;
    background-color: #eff2f9;
    border-radius: 4px;
    padding: 0 20px 0 20px;
    overflow: hidden;
    margin-bottom: 16px;
    .division-left {
      float: left;
      p {
        font-weight: 550;
      }
    }
    .division-right {
      float: right;
    }
  }
  .form-decollate {
    .add {
      width: 190px!important;
    }
  }
}
</style>