<template>
    <div>
      <!-- 重置密码-弹窗Form -->
      <el-dialog title="重置密码" :visible.sync="dialogResetPass" :before-close="hidePanel">
        <el-form :model="resetPassForm" :rules="rules" ref="resetPassForm">
          <el-form-item label="原密码:" :required="true" :label-width="formLabelWidth" prop="oldpass">
            <el-input v-model="resetPassForm.oldpass" ></el-input>
          </el-form-item>
          <el-form-item label="新密码:" :required="true" :label-width="formLabelWidth" prop="pass">
            <el-input v-model="resetPassForm.pass" ></el-input>
          </el-form-item>
            <el-form-item label="重复密码:" :required="true" :label-width="formLabelWidth" prop="checkpass">
            <el-input v-model="resetPassForm.checkpass" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePanel" size="small">取 消</el-button>
          <el-button type="primary" @click="resetPass('resetPassForm')" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  props: { // 弹窗显示
    dialogResetPass: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: false,
    }
  },
  data () {
    // 验证表单
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{6,18}$/
          if (!reg.test(value)) {
            callback(new Error('密码长度为6-18位'))
          }
        }
        if (this.resetPassForm.checkpass !== '') {
          this.$refs.resetPassForm.validateField('checkpass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.resetPassForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      resetPassForm: { // 添加用户表单输入
        oldpass: '',
        pass: '',
        checkpass: ''
        // sex: null,
      },
      rules: { // 添加用户验证
        oldpass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkpass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px' // 添加用户输入框宽度
    }
  },
  created () {
    console.log(this.userId)
  },
  methods: {
    // 取消按钮关闭弹窗
    hidePanel () {
      this.$emit('update:dialogResetPass', false)
    },
    resetPass (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 修改密码
          axiosPost('base/user/updatePassword', {
            loginName: this.userId,
            newPassword: this.resetPassForm.checkpass,
            oldPassword: this.resetPassForm.oldpass
          }).then(result => {
            console.log('a')
            if (result.code === 200) {
              this.$message('修改成功')
              this.$router.push({path: '/task'})
              this.isoldTips = false
            } else {
              this.$message(result.message)
              this.isoldTips = true
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="">

</style>
