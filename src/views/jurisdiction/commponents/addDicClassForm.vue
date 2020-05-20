<template>
    <div>
      <!-- 添加字典分类-弹窗Form -->
      <el-dialog title="添加字典分类" :visible.sync="dialogAddClasUser" :before-close="hidePanel">
        <el-form :model="addDicForm" :rules="rules" ref="addDicForm">
          <el-form-item label="字典分类名称:" :label-width="formLabelWidth" prop="dicClassName">
            <el-input v-model="addDicForm.dicClassName" ></el-input>
          </el-form-item>
          <el-form-item label="字典分类编码:" :label-width="formLabelWidth" prop="dicClassId">
            <el-input v-model="addDicForm.dicClassId" ></el-input>
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
  //   dialogAddClasUser: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  props: ['dialogAddClasUser'],
  data () {
    // 验证表单
    var validateName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('输入不能为空'))
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5_\-@&=]{2,255}$/
          if (!reg.test(value)) {
            callback(new Error('分类名称长度为2-255位'))
          }
        }
        callback()
      }
    }
    // 验证表单
    var validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('输入不能为空'))
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5_\-@&=]{2,255}$/
          if (!reg.test(value)) {
            callback(new Error('分类编码长度为2-255位'))
          }
        }
        callback()
      }
    }
    return {
      addDicForm: { // 添加用户表单输入
        dicClassId: '',
        dicClassName: ''
      },
      isShow: true,
      rules: { // 添加字典-验证
        dicClassId: [
          { required: true, validator: validateCode, trigger: 'blur' }
        ],
        dicClassName: [
          { required: true, validator: validateName, trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px', // 添加用户输入框宽度
    }
  },
  methods: {
    // 添加字典确定
    addDicSave (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axiosPost('base/dic-category/addOrUpdate', {
            name: this.addDicForm.dicClassName,
            code: this.addDicForm.dicClassId,
          }).then(result => {
            if (result.code === 200) {
              this.$message('添加成功')
              // 关闭弹窗
              this.hidePanel()
            } else {
              this.$message('添加失败，请重新添加！')
            }
          })
        }
      })
    },
    // 取消按钮关闭弹窗
    hidePanel () {
      this.$emit('update:dialogAddClasUser', false)
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
