<template>
    <div>
      <!-- 搜索条件 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="菜单名称">
          <el-input v-model="formInline.user"></el-input>
        </el-form-item>
        <el-form-item label="层级">
          <el-input v-model="formInline.user"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="el-icon-search" size="mini">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="addMenuForm" icon="el-icon-edit" size="mini">添加</el-button>
        </el-form-item>
      </el-form>
      <!-- 字典添加 -->
      <add-menufrom :dialogAddMenu.sync="addVisible"></add-menufrom>
      <!-- 表格 -->
      <el-table
        ref="tableData"
        :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
        tooltip-effect="dark"
        style="width: 100%"
        >
        <el-table-column
          prop="roleFlag"
          label="菜单名称">
        </el-table-column>
        <el-table-column
          prop="superiorName"
          label="菜单编码">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="菜单父编号">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="请求地址">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="层级">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="是否是菜单">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="value"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button size="mini" @click.native="editDicForm">修改</el-button>
            <el-button size="mini" @click="itsmTableCountSelect" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
       <!-- 分页 -->
      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="PageSize"
          background
          layout="total, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
      <!-- 角色修改 -->
      <edit-dicfrom :dialogEditDic.sync="editVisible"></edit-dicfrom>
    </div>
</template>
<script>
import addMenuForm from '../commponents/addMenuForm.vue'
import editDicForm from '../commponents/editDicForm.vue'
export default {
  data() {
    return {
      addVisible: false, // 添加用户弹窗控制
      editVisible: false, // 修改用户弹窗控制
      resetVisible: false, // 重置密码弹窗控制
      roleVisible: false, // 角色分配弹窗控制
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      formInline: { // 搜索内容
        user: '',
        date: ''
      },
      tableData: [{ //表 格内容
        roleFlag: '提报人',
        roleName: '发动机损坏',
        superiorName: '消防车辆维修管理流程'
      }],
      value: true, // 表格-状态
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 个数选择器（可修改）
      pageSizes: [10, 20, 30, 40],
      // 默认每页显示的条数（可修改）
      PageSize: 10
    }
  },
  created() {
  },
  components: {
    'add-menufrom' : addMenuForm,
    'edit-dicfrom' : editDicForm
  },
  methods: {
    // 当前页码
    handleCurrentChange(val) {
      // 改变默认的页数
      // this.userGetList(val, (val)*(this.PageSize))
    },
    // 搜索
    onSubmit() {
      
    },
    // 添加字典弹窗显示
    addMenuForm:function(){
      this.addVisible = true
    },
    // 修改字典弹窗显示
    editDicForm:function(){
      this.editVisible = true
    },
    // 获取选中表格的行数据
    itsmTableCountSelect() {
      const selectData = this.$refs.tableData.selection
      console.log(selectData);
      const msg = '你选中了 [ ' + selectData.length + ' ] 条数据.'
      this.$notify.info({
        title: '消息',
        message: msg
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog {
  width: 30%;
}
.el-form-item {
	margin-bottom: 15px;
}
</style>
