<template>
    <div class="common-table">
      <!-- 搜索条件 -->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="字典分类名称">
          <el-input v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="字典分类编码">
          <el-input v-model="formInline.code"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" icon="el-icon-search" size="mini">搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native="addDicForm" icon="el-icon-edit" size="mini">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="ExportData" icon="el-icon-share" size="mini">导出</el-button>
        </el-form-item>
      </el-form>
      <!-- 字典添加 -->
      <add-dicclassfrom :dialogAddClasUser.sync="addVisible"></add-dicclassfrom>
      <!-- 表格 -->
      <el-table
        :data="tableData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
        style="width: 99.8%"
        row-key="id"
        border
        lazy
        :load="load"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          prop="id"
          label="分类ID"
          sortable
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="200"
          sortable>
        </el-table-column>
        <el-table-column
          prop="code"
          label="字典编码"
          sortable>
        </el-table-column>
        <el-table-column
          label="操作"
          width="210">
          <template slot-scope="scope">
            <el-button size="mini" @click.native="addChildDicForm(scope.row.type, scope.row.id, scope.row.name)" type="success" v-if="scope.row.hasChildren === true ? !isShow : isShow" plain>{{scope.row.type === 1 ? '添加字典' : '添加子字典'}}</el-button>
            <el-button size="mini" @click.native="editDicForm(scope.row.type, scope.row.dicCategoryId, scope.row.id, scope.row.name, scope.row.code, scope.row.dicId)">修改</el-button>
            <el-button size="mini" @click="deleteDic(scope.row.type, scope.row.id, scope.$index, scope.row.dicId)" type="danger">删除</el-button>
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
          :total="totalCount">
        </el-pagination>
      </div>
      <!-- 添加子条目 -->
      <add-dicfrom :dialogAddDic.sync="addChildVisible" :name="name" :id="id" :addType="addType"></add-dicfrom>
      <!-- 修改 -->
      <edit-dicfrom :dialogEditDic.sync="editVisible" :addType="addType" :dicCategoryId="dicCategoryId" :id="id" :name="name" :code="code" :dicId="dicId"></edit-dicfrom>
    </div>
</template>
<script>
import addDicClassForm from '../commponents/addDicClassForm.vue'
import addDicForm from '../commponents/addDicForm.vue'
import editDicForm from '../commponents/editDicForm.vue'
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  data() {
    return {
      addVisible: false, // 添加用户弹窗控制
      addChildVisible: false, // 添加用户弹窗控制
      editVisible: false, // 修改用户弹窗控制
      resetVisible: false, // 重置密码弹窗控制
      roleVisible: false, // 角色分配弹窗控制
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      formInline: { // 搜索内容
        name: '',
        code: ''
      },
      tableData: [], //表 格内容
      isShow: false,
      id: '', // 修改组件传参
      name: '', // 修改组件传参
      code: '', // 修改组件传参
      addType: '', // 添加子类组件传参
      dicId: '',
      dicCategoryId: '',
      childrenData: [], // 子条目
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
    this.zdList(this.currentPage, this.PageSize)
  },
  components: {
    'add-dicclassfrom' : addDicClassForm,
    'add-dicfrom' : addDicForm,
    'edit-dicfrom' : editDicForm
  },
  methods: {
    // 当前页码
    handleCurrentChange(val) {
      // 改变默认的页数
      this.zdList(val, (val) * (this.PageSize))
    },
    // 字典列表
    zdList (current, size) {
      axiosGet('base/dic-category/list?current=' + current + '&size='+size).then(result => {
        console.log(result)
        if (result.code === 200) {
          this.tableData = result.data.records
        } else {
          this.$message('网络异常！')
        }
        console.log(result.data)
        // this.tableData = result.data
      })
    },
    // 搜索
    onSubmit() {
      axiosGet('base/dic-category/list?name=' + this.formInline.name + "&code=" + this.formInline.code).then(result => {
        if (result.code === 200) {
          this.tableData = result.data.records
        } else {
          this.$message('网络异常！')
        }
      })
    },
    // 导出表格excal
    ExportData() {
      import("@/vendor/Export2Excel").then(excel => {
        // 表格的表头列表
        const tHeader = [ "分类ID", "名称", "字典编码"]
        // 与表头相对应的数据里边的字段
        const filterVal = ['id', 'name', 'code' ]
        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        // 这里还是使用export_json_to_excel方法比较好，方便操作数据
        excel.export_json_to_excel(tHeader, data, '字典管理')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    // 添加字典弹窗显示
    addDicForm:function(){
      this.addVisible = true
    },
    // 添加子条目弹窗显示
    addChildDicForm:function(type, id, name){
      this.addType = type
      this.id = id
      this.name = name
      this.addChildVisible = true
    },
    // 修改字典弹窗显示
    editDicForm:function(type, dicCategoryId, id, name, code, dicId){
      console.log(type, id,dicCategoryId)
      this.addType = type
      this.dicCategoryId = dicCategoryId
      this.id = id
      this.name = name
      this.code = code
      this.dicId = dicId
      this.editVisible = true
    },
    // 删除字典
    deleteDic(type, id, index, dicId) {
      this.$confirm('确认删除？')
      .then (_ => {
        if (type === 1) {
          axiosPost('base/dic-category/deleteDicCategory?dicCategoryId=' + id).then(result => {
            if (result.code === 200) {
              this.tableData.splice(index, 1)
              this.$message('删除成功！')
            } else {
              this.$message('删除失败！')
            }
          })
        }
        if (type === 2) {
          axiosPost('base/dicChild/deleteDicChild?dicChildId=' + id).then(result => {
            if (result.code === 200) {
              this.childrenData.splice(index, 1)
              this.$message('删除成功！')
            } else {
              this.$message('删除失败！')
            }
          })
        }
        if (type === 3) {
          axiosPost('base/dicChild/deleteDicChild?dicChildId=' + id).then(result => {
            if (result.code === 200) {
              this.childrenData.splice(index, 1)
              this.$message('删除成功！')
            } else {
              this.$message('删除失败！')
            }
          })
        }
        done ()
      })
      .catch (_ => {})
    },
    load(tree, treeNode, resolve) {
      console.log(tree,treeNode,resolve)
      if (tree.type === 1) {
        axiosGet('base/dic/list?dicCategoryId=' + tree.id).then(result => {
          if (result.code === 200) {
            treeNode.children = result.data.records
            } else {
            this.$message(result.message)
          }
        })
        setTimeout(() => {
          resolve(treeNode.children)
        }, 500)
      }
      if (tree.type === 2) {
        axiosGet('base/dicChild/list?dicCategoryId=' + tree.id).then(result => {
          if (result.code === 200) {
            treeNode.children = result.data.records
            } else {
            this.$message(result.message)
          }
        })
        setTimeout(() => {
          resolve(treeNode.children)
        }, 500)
      }

    }
  }
}
</script>
<style lang="scss" scoped>
.main-left {
  width: 150px;
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
.el-button--mini, .el-button--mini.is-round {
  padding: 7px;
}
</style>
