<template>
    <div>
      <!-- 添加部门-弹窗Form -->
      <el-dialog title="添加部门" :visible.sync="dialogAddUser" :before-close="hidePanel">
        <el-form :model="addDicForm" :rules="rules" ref="addDicForm">
          <el-form-item label="部门名称:" :label-width="formLabelWidth">
            <el-input v-model="addDicForm.name" ></el-input>
          </el-form-item>
          <el-form-item label="父级部门编号:" :label-width="formLabelWidth">
            {{parentDeptNum}}
          </el-form-item>
          <el-form-item label="顶级节点编号:" :label-width="formLabelWidth">
            {{topNodeCode}}
          </el-form-item>
          <el-form-item label="显示名称:" :label-width="formLabelWidth">
            <el-input v-model="addDicForm.displayName" ></el-input>
          </el-form-item>
          <el-form-item label="描述:" :label-width="formLabelWidth">
            <el-input v-model="addDicForm.description" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePanel" size="small">取 消</el-button>
          <el-button type="primary" @click="addDicSave('addDicForm')" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  // props: { // 弹窗显示
  //   dialogAddUser: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  props: ['dialogAddUser', 'parentDeptNum', 'topNodeCode'],
  data () {
    return {
      addDicForm: { // 添加部门表单输入
        name: '',
        deptNum: '',
        parentDeptNum: '',
        topNodeCode: '',
        displayName: '',
        description: ''
      },
      rules: { // 添加部门-验证
        name: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ],
        deptNum: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px', // 输入框宽度
    }
  },
  methods: {
    // 添加部门确定
    addDicSave (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axiosPost('base/dept/addOrUpdateDept', {
            name: this.addDicForm.name,
            parentDeptNum: this.parentDeptNum,
            topNodeCode: this.topNodeCode,
            displayName: this.addDicForm.displayName,
            description: this.addDicForm.description
          }).then(result => {
            if (result.code === 200) {
              this.$message('添加成功')
              // 关闭弹窗
              this.hidePanel()
            } else {
              this.$message(result.message)
            }
            // console.log(result.data)
            // this.tableData = result.data
          })
        }
      })
    },
    // 取消按钮关闭弹窗
    hidePanel () {
      this.$emit('update:dialogAddUser', false)
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-dialog__body {
    padding: 20px 30px;
  }
  .ment-input {
    width: 200px;
    height: 30px;
    position: absolute;
    top: 0;
  }
</style>
