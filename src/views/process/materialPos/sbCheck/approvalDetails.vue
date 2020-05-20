<template>
  <div class="asset-manager">
    <el-form ref="form" :model="formData" :inline="true">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="申请编号" label-width="80px">
            <el-input v-model="formData.card"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" label-width="80px">
            <el-input v-model="formData.status"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请时间" label-width="80px">
            <el-input v-model="formData.time"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="主题" label-width="80px">
            <el-input v-model="formData.theme"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请人" label-width="80px">
            <el-input v-model="formData.applicant"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电话" label-width="80px">
            <el-input v-model="formData.tel"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="form-title"><i class="icon"></i>验收明细</div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="theme" label="设备编码" width="160"></el-table-column>
      <el-table-column prop="name" label="设备描述" width="200"></el-table-column>
      <el-table-column prop="node" label="规格型号"></el-table-column>
      <el-table-column prop="peo" label="出厂序号"></el-table-column>
      <el-table-column prop="date" label="采购价格"></el-table-column>
      <el-table-column prop="date" label="安装地点"></el-table-column>
      <el-table-column prop="date" label="采购价格"></el-table-column>
      <el-table-column prop="date" label="使用人"></el-table-column>
      <el-table-column prop="date" label="使用部门"></el-table-column>
      <el-table-column prop="date" label="使用模块"></el-table-column>
      <el-table-column prop="date" label="所属"></el-table-column>
    </el-table>
    <div>
      <el-input type="textarea" :rows="2" placeholder="备品备件明细" v-model="textarea"></el-input>
    </div>
    <div class="form-title"><i class="icon"></i>审批历史</div>
    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="日期" width="120"></el-table-column>
      <el-table-column prop="name" label="姓名" width="120"></el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {
        card: "",
        status: "",
        time: "",
        theme: "",
        applicant: "",
        tel: ""
      },
      tableData: [
        {
          id: "44"
        }
      ],
      textarea: ''
    };
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.table-title {
  margin: 30px 0 20px;
}
</style>
