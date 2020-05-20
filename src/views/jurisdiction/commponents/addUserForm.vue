<template>
    <div>
      <!-- 添加用户-弹窗Form -->
      <el-dialog title="添加用户" :visible.sync="dialogAddUser" :before-close="hidePanel">
        <el-form :model="addUserForm" :rules="rules" ref="addUserForm">
          <el-form-item label="登录名:" :label-width="formLabelWidth" prop="loginName">
            <el-input v-model="addUserForm.loginName" ></el-input>
          </el-form-item>
          <el-form-item label="姓名:" :label-width="formLabelWidth" prop="uname">
            <el-input v-model="addUserForm.uname" ></el-input>
          </el-form-item>
          <el-form-item label="用户英文ID:" :label-width="formLabelWidth" prop="uid">
            <el-input v-model="addUserForm.uid" ></el-input>
          </el-form-item>
          <el-form-item label="密码:" :label-width="formLabelWidth" prop="password">
            <el-input v-model="addUserForm.password" ></el-input>
          </el-form-item>
            <el-form-item label="重复密码:" :required="true" :label-width="formLabelWidth" prop="checkpass">
            <el-input v-model="addUserForm.checkpass" ></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="email">
            <el-input v-model="addUserForm.email" ></el-input>
          </el-form-item>
          <el-form-item label="身份证号:" :label-width="formLabelWidth" prop="idNum">
            <el-input v-model="addUserForm.idNum" ></el-input>
          </el-form-item>
          <el-form-item label="部 门:" :label-width="formLabelWidth" prop="ment">
            <el-input v-model="addUserForm.ment" @click="innerVisible = true"></el-input>
            <p @click="innerVisible = true" class="ment-input"></p>
            <!-- 部门选择 -->
            <el-dialog
            width="30%"
            title="部门选择"
            :visible.sync="innerVisible"
            append-to-body>
              <el-tree
                :data="department"
                ref="tree"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]"
                :props="defaultProps"
                @check-change="bumenNodeClick">
              </el-tree>
              <div class="el-dialog__footer">
                <el-button @click="innerVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="departmentOk" size="small">确 定</el-button>
              </div>
          </el-dialog>
          </el-form-item>



          <el-form-item label="模 块:" :label-width="formLabelWidth" prop="ment">
            <el-input v-model="addUserForm.ment" @click="innerVisible = true"></el-input>
            <p @click="innerVisible = true" class="ment-input"></p>
            <!-- 部门选择 -->
            <el-dialog
                    width="30%"
                    title="模块选择"
                    :visible.sync="innerVisible"
                    append-to-body>
              <el-tree
                      :data="department"
                      ref="tree"
                      show-checkbox
                      node-key="id"
                      :default-expanded-keys="[2, 3]"
                      :default-checked-keys="[5]"
                      :props="defaultProps"
                      @check-change="bumenNodeClick">
              </el-tree>
              <div class="el-dialog__footer">
                <el-button @click="innerVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="departmentOk" size="small">确 定</el-button>
              </div>
            </el-dialog>
          </el-form-item>



          <el-form-item label="职位:" :label-width="formLabelWidth" prop="position">
            <el-input v-model="addUserForm.position" @click="positionVisible = true"></el-input>
            <p @click="positionVisible = true" class="ment-input"></p>
            <!-- 职位选择 -->
            <el-dialog
                width="30%"
                title="职位选择"
                :visible.sync="positionVisible"
                append-to-body>
              <el-tree
                :data="positionData"
                ref="treePo"
                show-checkbox
                node-key="id"
                :default-expanded-keys="[2, 3]"
                :default-checked-keys="[5]"
                :props="positionProps"
                @check-change="handleNodeClick">
              </el-tree>
              <div class="el-dialog__footer">
                <el-button @click="positionVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="positionOk" size="small">确 定</el-button>
              </div>
            </el-dialog>
          </el-form-item>
          <el-form-item label="电话:" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="addUserForm.mobile" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePanel" size="small">取 消</el-button>
          <el-button type="primary" @click="addUserSave('addUserForm')" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  props: { // 弹窗显示
    dialogAddUser: {
      type: Boolean,
      default: false
    }
  },
  data () {
    // 验证表单
    var validateloginName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('输入不能为空'))
      } else {
        if (value !== '') {
          var reg = /^[a-zA-Z][0-9a-zA-Z_]{3,17}/
          if (!reg.test(value)) {
            callback(new Error('登录名长度为4-18位'))
          }
        }
        callback()
      }
    }
    var validateUname = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('输入不能为空'))
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,25}$/
          if (!reg.test(value)) {
            callback(new Error('姓名长度为2-25位'))
          }
        }
        callback()
      }
    }
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
        if (this.addUserForm.checkpass !== '') {
          this.$refs.addUserForm.validateField('checkpass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.addUserForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if (!reg.test(value)) {
            callback(new Error('请输入有效的邮箱'))
          }
        }
        callback()
      }
    }
    var validateTel = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入电话'))
      } else {
        if (value !== '') {
          var reg = /^1[3456789]\d{9}$/
            if(!reg.test(value)) {
              callback(new Error('请输入有效的手机号码'))
            }
        }
        callback()
      }
    }
    return {
      innerVisible: false, // 部门选择弹出显示
      positionVisible: false, // 部门选择弹出显示
      addUserForm: { // 添加用户表单输入
        uname: '',
        uid: '',
        loginName: '',
        password: '',
        checkpass: '',
        idNum: '',
        position: '',
        ment: '',
        email: '',
        mobile: ''
      },
      rules: { // 添加用户验证
        uname: [
          { required: true, validator: validateUname, trigger: 'blur' }
        ],
        uid: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ],
        loginName: [
          { required: true, validator: validateloginName, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkpass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ],
        position: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ],
        idNum: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ],
        ment: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validateTel, trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px', // 添加用户输入框宽度
      department: [], // 部门选择
      positionData: [], // 职位选择
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      positionProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created () {
    this.addUser()
    this.addPosition()
  },
  methods: {
    // 添加用户保存
    addUserSave (formName) {
      console.log(this.addUserForm)
      this.$refs[formName].validate(valid => {
        if (valid) {
          axiosPost('base/user/addOrUpdate', {
            name: this.addUserForm.uname,
            loginName: this.addUserForm.loginName,
            deptNum: this.addUserForm.ment,
            idNum: this.addUserForm.idNum,
            mobile: this.addUserForm.mobile,
            mail: this.addUserForm.email,
            password: this.addUserForm.password,
            usrId: this.addUserForm.uid,
            positionId: this.addUserForm.position
          }).then(result => {
            if (result.code === 200) {
              this.$message('添加成功')
              // 关闭弹窗
              this.hidePanel()
            } else {
              this.$message('添加失败，请重新添加！')
            }
            console.log(result.data)
            // this.tableData = result.data
          })
        }
      })
    },
    // 取消按钮关闭弹窗
    hidePanel () {
      this.$emit('update:dialogAddUser', false)
    },
    // 请求接口，获取部门结构数据
    addUser () {
      axiosGet('base/dept/tree').then(res => {
        console.log(res.data)
        this.department = res.data
      })
    },
    // 选择部门-确定
    departmentOk () {
      let res = this.$refs.tree.getCheckedNodes()
      let arr = []
      arr = res
      this.addUserForm.ment = arr[0].deptNum
      // 关闭部门选择
      this.innerVisible = false
    },
    // 请求接口，获取职位结构数据
    addPosition () {
      axiosGet('base/position/tree').then(res => {
        console.log(res.data)
        this.positionData = res.data
      })
    },
    // 选择职位-确定
    positionOk () {
      let res = this.$refs.treePo.getCheckedNodes()
      let arr = []
      arr = res
      console.log(arr)
      this.addUserForm.position = arr[0].id
      // 关闭职位选择
      this.positionVisible = false
    },
    // 部门单选
    bumenNodeClick(data, checked, node) {
      if(checked === true) {
        this.checkedId = data.id;
        this.$refs.tree.setCheckedKeys([data.id]);
      } else {
        if (this.checkedId == data.id) {
          this.$refs.tree.setCheckedKeys([data.id]);
        }
      }
    },
    // 职位单选
    handleNodeClick(data, checked, node) {
      if(checked === true) {
        this.checkedId = data.id;
        this.$refs.treePo.setCheckedKeys([data.id]);
      } else {
        if (this.checkedId == data.id) {
          this.$refs.treePo.setCheckedKeys([data.id]);
        }
      }
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
