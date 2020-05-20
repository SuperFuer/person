<template>
    <div>
      <!-- 修改角色-弹窗Form -->
      <el-dialog title="修改角色" :visible.sync="dialogEditRole" :before-close="hidePanel">
        <el-form :model="editRoleForm" :rules="rules" ref="editRoleForm">
          <el-form-item label="角色标识:" :label-width="formLabelWidth" prop="roleFlag">
            <el-input v-model="editRoleForm.roleFlag" :placeholder="roleFlag"></el-input>
          </el-form-item>
          <el-form-item label="角色名称:" :label-width="formLabelWidth" prop="roleName">
            <el-input v-model="editRoleForm.roleName" :placeholder="roleName"></el-input>
          </el-form-item>
          <!-- <el-form-item label="上级名称:" :required="true" :label-width="formLabelWidth" prop="superiorName">
            <el-input v-model="editRoleForm.superiorName" ></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePanel" size="small">取 消</el-button>
          <el-button type="primary" @click="editRoleSave('editRoleForm')" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  // props: { // 弹窗显示
  //   dialogEditRole: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  props: ['dialogEditRole', 'userId', 'roleName', 'roleFlag'],
  data () {
    // 验证表单
    var validateRoleName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('输入不能为空'))
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,18}$/
          if (!reg.test(value)) {
            callback(new Error('角色长度为2-18位'))
          }
        }
        callback()
      }
    }
    var validateRoleFlag = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('输入不能为空'))
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{4,18}$/
          if (!reg.test(value)) {
            callback(new Error('角色长度为4-18位'))
          }
        }
        callback()
      }
    }
    return {
      editRoleForm: { // 添加用户表单输入
        roleName: '',
        superiorName: '',
        roleFlag: ''
      },
      rules: { // 添加用户验证
        roleName: [
          { required: true, validator: validateRoleName, trigger: 'blur' }
        ],
        roleFlag: [
          { required: true, validator: validateRoleFlag, trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px', // 添加用户输入框宽度
    }
  },
  methods: {
    // 修改角色确定
    editRoleSave (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axiosPost('base/role/addOrUpdate', {
            id: this.userId,
            roleFlag: this.editRoleForm.roleFlag,
            roleName: this.editRoleForm.roleName
          }).then(result => {
            if (result.code === 200) {
              this.$message('修改成功！')
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
      this.$emit('update:dialogEditRole', false)
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
