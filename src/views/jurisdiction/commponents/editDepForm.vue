<template>
    <div>
      <!-- 修改部门-弹窗Form -->
      <el-dialog title="修改部门" :visible.sync="dialogEditDic" :before-close="hidePanel">
        <el-form :model="addDicForm" :rules="rules" ref="addDicForm">
          <el-form-item label="部门名称:" :required="true" :label-width="formLabelWidth" prop="name">
            <el-input v-model="addDicForm.name" ></el-input>
          </el-form-item>
          <el-form-item label="部门编号:" :required="true" :label-width="formLabelWidth" prop="deptNum">
            <el-input v-model="addDicForm.deptNum" ></el-input>
          </el-form-item>
          <el-form-item label="父级部门ID:" :required="true" :label-width="formLabelWidth" prop="parentDeptNum">
            <el-input v-model="addDicForm.parentDeptNum" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePanel" size="small">取 消</el-button>
          <el-button type="primary" @click="editDicSave('addDicForm')" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  props: { // 弹窗显示
    dialogEditDic: {
      type: Boolean,
      default: false
    }
  },
  props: ['dialogEditDic', 'id', 'name' , 'code'],
  data () {
    return {
      addDicForm: { // 添加用户表单输入
        dicId: '',
        dicName: '',
        dicClassId: '',
        dicClassName: ''
      },
      rules: { // 添加字典-验证
        dicId: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ],
        dicClassId: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ],
        dicClassName: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px', // 添加用户输入框宽度
    }
  },
  methods: {
    // 修改字典保存
    editDicSave (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
         axiosPost('base/dic-category/addOrUpdate', {
            id: this.id,
            name: this.addDicForm.dicClassName,
            code: this.addDicForm.dicClassId,
          }).then(result => {
            if (result.code === 200) {
              this.$message('修改成功')
              // 关闭弹窗
              this.hidePanel()
            } else {
              this.$message('修改失败！')
            }
          })
        }
      })
    },
    // 取消按钮关闭弹窗
    hidePanel () {
      this.$emit('update:dialogEditDic', false)
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
