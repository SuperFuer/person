<template>
  <div class="seal-query">
    <div class="form-title">
      <i class="icon"></i>筛选封存设备
    </div>
    <div class="query-title">查询条件</div>
    <el-form :inline="true" :model="formInline" label-width="80px">
      <div>
        <el-form-item label="设备编码" label-width="80px">
          <el-input v-model="formInline.applyNum"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" label-width="80px">
          <el-input v-model="formInline.applySubject"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="部门" label-width="80px">
        <el-input v-model="formInline.applyNum"></el-input>
      </el-form-item>
      <el-form-item label="使用人" label-width="80px">
        <el-input v-model="formInline.applySubject"></el-input>
      </el-form-item>
      <el-form-item style="padding-left:10px;position:relative;top:-2px;">
        <el-button type="primary" size="mini"  icon="el-icon-search">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="query-title">查询明细</div>
    <el-table
      ref="tableData"
      :data="tableData"
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
      <el-table-column
        :show-overflow-tooltip="true"
        type="selection"
        :reserve-selection="true"
        width="55"
      ></el-table-column>
      <el-table-column :show-overflow-tooltip="true" type="index" label="序号" width="55"></el-table-column>
      <el-table-column
        prop="assetNum"
        label="资产编码">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="equipNum" label="设备编码"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="equipName" label="设备名称"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="installLocDesc" label="安装地点"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="usingMan" label="使用人"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="usingDeptName" label="使用人部门"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="positionCode" label="位置编码"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="installLocDesc" label="位置描述"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination">
      <el-pagination background layout="total, prev, pager, next, jumper" :total="tableData.length"></el-pagination>
    </div>
    <div class="el-form-item btn-group center pt20">
      <el-button type="primary"  size="small" @click="submitAdd">添加</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {},
      tableData:[{
        equipNum:"123"
      },{
        equipNum:"4566"
      }]
    };
  },
  methods: {
    submitAdd() {
      this.$router.push({
        path: "/swSeal"
      });
    }
  },
  created() {
    console.log(this.$route);
  }
};
</script>
<style lang="scss" scoped>
.table-title {
  margin: 30px 0 20px;
}
</style>
