<style lang="scss" scoped>
.jur-dialog /deep/ .el-dialog__body {
  height: 450px;
  overflow: auto;
}

.el-form-item {
  margin-bottom: 15px;
}
</style>
<template>
    <div class="jsadmin">
      <!-- 搜索条件 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="formInline.user"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="onSubmit" icon="el-icon-search" size="mini">搜索</el-button>
          <el-button type="primary" @click.native="addRoleForm" icon="el-icon-edit" size="mini">添加</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <!-- <el-button type="primary" @click="ExportData" icon="el-icon-share" size="mini">导出</el-button> -->
        </el-form-item>
<!--        <el-form-item>-->
<!--          <el-button type="primary" @click.native="addRoleForm" icon="el-icon-edit" size="mini">添加</el-button>-->
<!--          <el-button type="primary" @click="ExportData" icon="el-icon-share" size="mini">导出</el-button>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="ExportData" icon="el-icon-share" size="mini">导出</el-button>-->
<!--        </el-form-item>-->
      </el-form>
      <!-- 用户添加 -->
      <add-rolefrom :dialogAddUser.sync="addVisible"></add-rolefrom>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
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
          prop="Guid"
          label="Guid"
		  width="0"
          sortable>
        </el-table-column>
        <el-table-column
          prop="Name"
          label="姓名"
          sortable>
        </el-table-column>
        <el-table-column
          prop="Company"
          label="公司"
          sortable>
        </el-table-column>
        <el-table-column
          prop="Department"
          label="单位"
          sortable>
        </el-table-column>
        <el-table-column
          prop="Level"
          label="级别"
          sortable>
        </el-table-column>
        <el-table-column
          prop="BrithDate"
          label="出生年月"
		  width="120"
          sortable>
        </el-table-column>
        <el-table-column
          prop="Age"
          label="年龄"
          sortable>
        </el-table-column>
        <el-table-column
          prop="EnlistedDate"
          label="入伍年月"
		  width="120"
          sortable>
        </el-table-column>
        <el-table-column
          prop="PoliticalFace"
          label="政治面貌"
		  width="120"
          sortable>
        </el-table-column>
        <el-table-column
          prop="Education"
          label="文化程度"
		  width="120"
          sortable>
        </el-table-column>
        <el-table-column
          prop="Nation"
          label="民族"
          sortable>
        </el-table-column>
        <el-table-column
          prop="NavtivePlace"
          label="籍贯"
          sortable>
        </el-table-column>
        <el-table-column
          prop="Height"
          label="身高"
          sortable>
        </el-table-column>
        <el-table-column
          prop="Weight"
          label="体重"
          sortable>
        </el-table-column>
        <el-table-column
          prop="Bust"
          label="胸围"
          sortable>
        </el-table-column>
        <el-table-column
          prop="Waist"
          label="腰围"
          sortable>
        </el-table-column>
        <el-table-column
          prop="BMI"
          label="BMI"
          sortable>
        </el-table-column>
        <el-table-column
          prop="PBF"
          label="PBF"
          sortable>
        </el-table-column>

        <el-table-column
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click.native="editRoleForm(scope.row.id, scope.row.roleName, scope.row.roleFlag)">修改</el-button>
            <el-button size="mini" @click="deleteRole(scope.row.id, scope.$index)" type="danger">删除</el-button>
            <!-- <el-button size="mini"  @click="jurisdiction(scope.row.id)" type="primary" plain>权限配置</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- 权限配置-弹窗Form -->
      <el-dialog top="5vh" width="50%" title="权限配置" :visible.sync="dialogVisible" :before-close="hidePanel" class="jur-dialog">
        <el-tree
          :data="department"
          ref="tree"
          show-checkbox
          node-key="id"
          :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePanel" size="small">取 消</el-button>
          <el-button type="primary" @click="departmentOk" size="small">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <div class="text-center">
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
      <edit-rolefrom :dialogEditRole.sync="editVisible" :userId="userId" :roleName="roleName" :roleFlag="roleFlag"></edit-rolefrom>
      <!-- 权限配置 -->
<!--      <role-jurisdiction :dialogAddUser.sync="roleVisible" :id="id" :checkList="checkList"></role-jurisdiction>-->
    </div>
</template>
<script>
import addRoleForm from '../commponents/addRoleForm.vue'
import editRoleForm from '../commponents/editRoleForm.vue'
// import roleJurisdiction from '../commponents/roleJurisdiction.vue'
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  data() {
    return {
      addVisible: false, // 添加用户弹窗控制
      editVisible: false, // 修改用户弹窗控制
      resetVisible: false, // 重置密码弹窗控制
      roleVisible: false, // 角色分配弹窗控制
      dialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      formInline: { // 搜索内容
        user: '',
        date: ''
      },
      userId: '', // 组件传参
      roleName: '', // 组件传参
      roleFlag: '', // 组件传参
      tableData: [{Name:'测试'},{Name:'测试1'}],
      value: true, // 表格-状态
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 0,
      // 个数选择器（可修改）
      pageSizes: [10, 20, 30, 40],
      // 默认每页显示的条数（可修改）
      PageSize: 10,
      roleId: '', // 权限组件传参
      department: [], // 权限结构树
      jurisd: [],
      ment: null, // 权限配置
      defaultProps: {
        children: 'childMenu',
        label: 'name'
      },
      data: [],
      resourceCheckedKey: []
    }
  },
  created() {
    //this.roleList()
    //this.getMenus()
    // this.data = JSON.parse(localStorage.getItem('jurisd') || '[]')
  },
  components: {
    'add-rolefrom' : addRoleForm,
    'edit-rolefrom' : editRoleForm
    // 'role-jurisdiction' : roleJurisdiction
  },
  methods: {
    // 当前页码
    handleCurrentChange(val) {
      // 改变默认的页数
      this.currentPage = val;
      this.roleList()
    },
    // 搜索
    onSubmit() {
      // console.log(this.formInline.user)
      axiosGet('base/role/list?roleName=' + this.formInline.user).then(result => {
        if (result.code === 200) {
          this.tableData = result.data.records
        } else {
          this.$message('网络异常！')
        }
      })
    },
    // 角色列表
    roleList () {
      axiosGet('base/role/list?current=' + this.currentPage + '&size=' + this.PageSize).then(result => {
        if (result.code === 200) {
          // console.log(result)
          this.tableData = result.data.records
          this.totalCount = result.data.total
        } else {
          this.$message('网络异常！')
        }
      })
    },
    // 删除角色
    deleteRole (id, index) {
      this.$confirm('确认删除？')
      .then (_ => {
        axiosPost('base/role/deleteRole', id).then(result => {
          if (result.code === 200) {
            this.tableData.splice(index, 1)
            this.$message('删除成功！')
          } else {
            this.$message('删除失败')
          }
        })
        done ()
      })
      .catch (_ => {})
    },
    // 导出表格excal
    ExportData() {
      import("@/vendor/Export2Excel").then(excel => {
        // 表格的表头列表
        const tHeader = [ "名称", "别名"]
        // 与表头相对应的数据里边的字段
        const filterVal = ['roleName', 'roleFlag' ]
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        // 这里还是使用export_json_to_excel方法比较好，方便操作数据
        excel.export_json_to_excel(tHeader, data, '角色管理')
      })
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    addRoleForm:function(){
      this.addVisible = true
    },
    editRoleForm:function(id, roleName, roleFlag){
      this.userId = id
      this.roleName = roleName
      this.roleFlag = roleFlag
      this.editVisible = true
    },
    resetPassForm:function(){
      this.resetVisible = true
    },
    // roleForm:function(id){
    //   this.id = id
    //   this.roleVisible = true
    //   this.chedked()
    // },
    // 关闭弹窗
    hidePanel () {
      this.dialogVisible = false
    },
    // 请求接口，获取权限结构数据
    getMenus(context, arg){
      axiosGet('base/api/getRoleApiMenu').then(res => {
        if (res.code === 200) {
          this.department = res.data
          // console.log(res.data)
        }
      })
    },
    // 获取已勾选权限
    jurisdiction (id) {
      var _this = this;
      this.data = []
      this.roleId = id
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([]);
      })
      
      axiosGet('base/role/getRoleApi?roleId='+this.roleId).then(res => {
        if (res.code === 200) {
          let arr = []
          if (res.data.length > 0) {
            res.data.forEach(item => {
              arr.push(item.apiId)
            })
          }
          setTimeout(function(){
            arr.forEach(item => {
              _this.$refs.tree.setChecked(item, true, false);
            })

          }, 500)
          // this.$refs.tree.setCheckedNodes(arr);
          // this.$refs.tree.setCheckedKeys(arr, false)
        }
      })
    },
    // 选择权限-确定
    departmentOk () {
      this.jurisd = [];
      // console.log(this.$refs.tree.getCheckedKeys(), this.$refs.tree.getHalfCheckedKeys())
      let selectedNodes = this.$refs.tree.getCheckedKeys();
      let halfSelectedNodes = this.$refs.tree.getHalfCheckedKeys();
      this.jurisd = [...selectedNodes, ...halfSelectedNodes]
      if (!this.jurisd.length) {
        this.$message.warning('至少需要一个配置项');
        return;
      }
      axiosPost('base/role/add-apis', {
        roleId: this.roleId,
        apiIds: this.jurisd
      }).then(result => {
        if (result.code === 200) {
          this.$message('配置成功')
          // 关闭弹窗
          this.hidePanel()
        } else {
          result.data.length > 0 ? this.$message.warning(result.data[0]) : this.$message.warning(result.message)
        }
      })
    }
  }
}
</script>

