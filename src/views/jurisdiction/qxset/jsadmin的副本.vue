<template>
    <div>
      <!-- 搜索条件 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="角色名称">
          <el-input v-model="formInline.user"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="el-icon-search" size="mini">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="addRoleForm" icon="el-icon-edit" size="mini">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="ExportData" icon="el-icon-share" size="mini">导出</el-button>
        </el-form-item>
      </el-form>
      <!-- 用户添加 -->
      <add-rolefrom :dialogAddUser.sync="addVisible"></add-rolefrom>
      <!-- 表格 -->
      <el-table
        ref="multipleTable"
        :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
        tooltip-effect="dark"
        style="width: 99.9%"
        >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="roleFlag"
          label="角色标识"
          sortable>
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          sortable>
        </el-table-column>
        <!-- <el-table-column
          prop="superiorName"
          label="上级角色">
        </el-table-column> -->

        <el-table-column
          label="操作"
          width="330">
          <template slot-scope="scope">
            <el-button size="mini" @click.native="editRoleForm(scope.row.id, scope.row.roleName, scope.row.roleFlag)">修改</el-button>
            <el-button size="mini" @click="deleteRole(scope.row.id, scope.$index)" type="danger">删除</el-button>
            <el-button size="mini"  @click="jurisdiction(scope.row.id)" type="primary" plain>权限配置</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 权限配置-弹窗Form -->
      <el-dialog title="权限配置" :visible.sync="dialogVisible" :before-close="hidePanel">
        <el-tree
          :data="department"
          ref="tree"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="data"
          :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePanel" size="small">取 消</el-button>
          <el-button type="primary" @click="departmentOk" size="small">确 定</el-button>
        </div>
      </el-dialog>
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
      tableData: [],
      value: true, // 表格-状态
      // 默认显示第几页
      currentPage: 1,
      // 总条数，根据接口获取数据长度(注意：这里不能为空)
      totalCount: 1,
      // 个数选择器（可修改）
      pageSizes: [10, 20, 30, 40],
      // 默认每页显示的条数（可修改）
      PageSize: 10,
      id: '', // 权限组件传参
      department: [], // 权限结构树
      jurisd: [],
      ment: null, // 权限配置
      department: [], // 权限结构树
      defaultProps: {
        children: 'childMenu',
        label: 'name'
      },
      id: '',
      jurisd: [],
      data: [],
      resourceCheckedKey: []
    }
  },
  created() {
    this.roleList(this.currentPage, this.PageSize)
    this.getMenus()
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
      this.roleList(val, (val) * (this.PageSize))
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
    roleList (current, size) {
      axiosGet('base/role/list?current=' + current + '&size=' + size).then(result => {
        if (result.code === 200) {
          // console.log(result)
          this.tableData = result.data.records
        } else {
          this.$message('网络异常！')
        }
      })
    },
    // 删除角色
    deleteRole (id, index) {
      this.$confirm('确认删除？')
      .then (_ => {
        axiosPost('base/role/deleteRole', {
          id: id
        }).then(result => {
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
    getMenus(context,arg){
      axiosGet('base/api/getMenu').then(res => {
        if (res.code === 200) {
          this.department = res.data
          // console.log(res.data)
        }
      })
    },
    // 获取已勾选权限
    jurisdiction (id) {
      this.data = []
      this.id = id
      console.log(id)
      this.dialogVisible = true
      axiosPost('base/role/getRoleApi', id).then(res => {
        if (res.code === 200) {
          let arr = []
          if (res.data.length > 0) {
            res.data.forEach(item => {
              arr.push(item.apiId)
            })
          }
          this.data = arr
        }
        // console.log(this.data)
      })

    },
    // 选择权限-确定
    departmentOk () {
      let res = this.$refs.tree.getCheckedNodes()
      // console.log(res)
      res.forEach(item => {
        this.jurisd.push(item.id)
      })
      // console.log(this.jurisd)
      // 遍历获取选择子集所属菜单id
      this.department.forEach(v1 => {
        if(v1.childMenu.length > 0) {
          v1.childMenu.forEach(v2 => {
            if(v2.childMenu.length > 0) {
              v2.childMenu.forEach(v3 => {
                if (v3.childMenu.length > 0) {
                  v3.childMenu.forEach(v4 => {
                    res.forEach(item => {
                      if (item.id === v2.id || item.id === v3.id || item.id === v4.id) {
                        this.jurisd.push(v1.id)
                        this.jurisd.push(v2.id)
                        this.jurisd.push(v3.id)
                      }
                    })
                  })
                } else {
                  res.forEach(item => {
                    if (item.id === v2.id) {
                      this.jurisd.push(v1.id)
                    }
                  })
                }
              })
            }
          })
        }
      })
      // 数据去重
      this.jurisd = [...new Set(this.jurisd)]
      axiosPost('base/role/add-apis', {
        roleId: this.id,
        apiIds: this.jurisd
      }).then(result => {
        if (result.code === 200) {
          this.$message('配置成功')
          // 关闭弹窗
          this.hidePanel()
        } else {
          this.$message('配置失败！')
        }
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
