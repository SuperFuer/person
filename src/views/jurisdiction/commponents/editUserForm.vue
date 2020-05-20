<template>
    <div>
      <!-- 添加用户-弹窗Form -->
      <el-dialog title="修改用户" :visible.sync="dialogEditUser" :before-close="hidePanel">
        <el-form :model="addUserForm" :rules="rules" ref="addUserForm">
          <el-form-item label="登录名:" :label-width="formLabelWidth" prop="loginName">
            <el-input v-model="addUserForm.loginName" placeholder="loginName"></el-input>
          </el-form-item>
          <el-form-item label="姓名:" :label-width="formLabelWidth" prop="uname">
            <el-input v-model="addUserForm.uname" :placeholder="name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱:" :label-width="formLabelWidth" prop="mail">
            <el-input v-model="addUserForm.mail" :placeholder="mail"></el-input>
          </el-form-item>
          <el-form-item label="用户英文ID:" :label-width="formLabelWidth" prop="usrId">
            <el-input v-model="addUserForm.usrId" :placeholder="usrId"></el-input>
          </el-form-item>
          <el-form-item label="身份证号:" :label-width="formLabelWidth" prop="mail">
            <el-input v-model="addUserForm.idNum" :placeholder="idNum"></el-input>
          </el-form-item>
          <el-form-item label="部门编号:" :label-width="formLabelWidth" prop="deptNum">
            <el-input v-model="addUserForm.deptNum" @click="innerVisible = true"></el-input>
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
                :props="defaultProps">
              </el-tree>
              <div class="el-dialog__footer">
                <el-button @click="innerVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="departmentOk" size="small">确 定</el-button>
              </div>
          </el-dialog>
          </el-form-item>
          <el-form-item label="职位:" :required="true" :label-width="formLabelWidth" prop="position">
            <el-input v-model="addUserForm.position" @click="positionVisible = true"></el-input>
            <p @click="positionVisible = true" class="ment-input"></p>
            <!-- 部门选择 -->
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
                :props="positionProps">
              </el-tree>
              <div class="el-dialog__footer">
                <el-button @click="positionVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="positionOk" size="small">确 定</el-button>
              </div>
            </el-dialog>
          </el-form-item>
          <el-form-item label="电话:" :required="true" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="addUserForm.mobile" :placeholder="mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePanel" size="small">取 消</el-button>
          <el-button type="primary" @click="editUserSave('addUserForm')" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  props: { // 弹窗显示
    dialogEditUser: {
      type: Boolean,
      default: false
    }
  },
  props: ['dialogEditUser', 'userId', 'name', 'loginName', 'mail', 'mobile', 'idNum', 'usrId', 'deptName'],
  data () {
    // 验证表单
    var validateloginName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('输入不能为空'))
      } else {
        if (value !== '') {
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{4,18}$/
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
          var reg = /^[A-Za-z0-9\u4e00-\u9fa5]{2,50}$/
          if (!reg.test(value)) {
            callback(new Error('姓名长度为2-50位'))
          }
        }
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
        deptNum: null,
        position: null,
        mail: '',
        mobile: '',
        idNum: '',
        usrId: ''
      },
      rules: { // 添加用户验证
        uname: [
          { required: true, validator: validateUname, trigger: 'blur' }
        ],
        loginName: [
          { required: true, validator: validateloginName, trigger: 'blur' }
        ],
        deptNum: [
          { required: true, message: '输入不能为空', trigger: 'blur' }
        ],
        usrId: [
          { required: true, required: true, message: '输入不能为空', trigger: 'blur' }
        ],
        mail: [
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
  mounted () {
    this.addUser()
    this.addPosition()
  },
  methods: {
    // 修改用户保存
    editUserSave (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axiosPost('base/user/addOrUpdate', {
            id : this.userId,
            name: this.addUserForm.uname,
            loginName: this.addUserForm.loginName,
            deptNum: this.addUserForm.deptNum,
            idNum: this.addUserForm.idNum,
            mobile: this.addUserForm.mobile,
            mail: this.addUserForm.mail,
            usrId: this.addUserForm.usrId,
            positionId: this.addUserForm.position
          }).then(result => {
            if (result.code === 200) {
              this.$message('修改成功')
              this.hidePanel()
            } else {
              this.$message('修改失败')
            }
          })
        }
      })
    },
    // 取消按钮关闭弹窗
    hidePanel () {
      
      this.$emit('update:dialogEditUser', false)
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
      this.addUserForm.deptNum = arr[0].deptNum
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .ment-input {
    width: 200px;
    height: 30px;
    position: absolute;
    top: 0;
  }
</style>
