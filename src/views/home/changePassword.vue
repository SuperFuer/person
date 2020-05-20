<template>
  <div class="login">
    <div class="middle-wrapper">
      <div class="login-form">
        <el-form ref="loginForm"
                 :model="form"
                 :rules="rules">
          <el-form-item>
            <h3 class="til">修改密码</h3>
          </el-form-item>
          <el-form-item prop="oldpassword">
            <el-input :type="passwordType"
                      v-model="form.oldpassword"
                      placeholder="原密码">
              <i slot="prefix"
                 class="iconfont icon-mima1"></i>
              <i slot="suffix"
                 class="el-input__icon el-icon-view toggle-see"
                 @click="togglePasswordType"></i>
            </el-input>
            <p v-if="isoldTips"
               class="tips">{{oldtips}}</p>
          </el-form-item>
          <el-form-item prop="newpassword">
            <el-input :type="passwordType"
                      v-model="form.newpassword"
                      placeholder="新密码">
              <i slot="prefix"
                 class="iconfont icon-mima1"></i>
              <i slot="suffix"
                 class="el-input__icon el-icon-view toggle-see"
                 @click="togglePasswordType"></i>
            </el-input>
            <p v-if="isnewTips"
               class="tips">{{newtips}}</p>
          </el-form-item>
          <el-form-item prop="conpassword">
            <el-input :type="passwordType"
                      v-model="form.conpassword"
                      placeholder="确认密码">
              <i slot="prefix"
                 class="iconfont icon-mima1"></i>
              <i slot="suffix"
                 class="el-input__icon el-icon-view toggle-see"
                 @click="togglePasswordType"></i>
            </el-input>
            <p v-if="isconTips"
               class="tips">{{contips}}</p>
          </el-form-item>
          <el-form-item style="margin-bottom: 0;">
            <el-col>
              <el-form-item>
                <el-button type="primary"
                           class="login-btn"
                           @click="modify('loginForm')">
                  确认修改
                </el-button>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  data () {
    return {
      user: null,
      passwordType: 'password',
      isoldTips: false,
      isnewTips: false,
      isconTips: false,
      oldtips: '原密码输入错误!',
      newtips: '请输入6-16位数字,大小写字母和特殊符号组成的密码!',
      contips: '新密码两次输入不一致!',
      form: {
        oldpassword: '',
        newpassword: '',
        conpassword: ''
      },
      rules: {
        oldpassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        newpassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        conpassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.user = JSON.parse(localStorage.getItem('user'))
    // console.log(this.user)
    // this.password = user[0].password
  },
  methods: {
    // 密码明文切换
    togglePasswordType () {
      if (this.passwordType === 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    },
    modify (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 判断原密码是否输入正确
          // if(this.form.oldpassword === this.password){
          //     this.isoldTips = false
          //     // 验证新密码 6-16位数字和字母组成
          //     // var reg = /^.{6,10}$/;
          //     let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
          //     if(!reg.test(this.form.newpassword)){
          //       this.isnewTips = true
          //       return false
          //     } else {
          //       this.isnewTips = false
          //     }
          //     // 判断两次密码输入是否相同
          //     if(this.form.newpassword != this.form.conpassword) {
          //       this.isconTips = true
          //     } else {
          //       this.isconTips = false
          //       this.$router.push({path: '/home'})
          //     }
          // } else {
          //   this.isoldTips = true
          // }
          // JS 正则同时验证 大写字母，小写字母，数字，特殊字符
          // var reg = /^.{6,16}$/;
          let reg = /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[\W])(?=.*[\S])^[0-9A-Za-z\S]{6,12}$/g
          if (!reg.test(this.form.newpassword)) {
            this.isnewTips = true
            return false
          } else {
            this.isnewTips = false
          }
          // 判断两次密码输入是否相同
          if (this.form.newpassword !== this.form.conpassword) {
            this.isconTips = true
          } else {
            this.isconTips = false
            // 修改密码
            axiosPost('base/user/updatePassword', {
              loginName: this.user.usrId,
              newPassword: this.form.conpassword,
              oldPassword: this.form.oldpassword
            }).then(result => {
              console.log('a')
              if (result.code === 200) {
                this.$message('修改成功')
                this.$router.push({ path: '/task' })
                this.isoldTips = false
              } else {
                this.$message('修改失败')
                this.isoldTips = true
              }
            })
          }
        } else {
          this.isTips = false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: #f6f9fa;
  .login-form {
    .iconfont {
      font-size: 20px;
    }
    .toggle-see {
      cursor: pointer;
    }
    .til {
      font-size: 18px;
      color: #999;
      text-align: center;
    }
    .tips {
      color: red;
      font-size: 12px;
      position: absolute;
      line-height: 22px;
    }
  }

  .middle-wrapper {
    position: fixed;
    width: 100%;
    margin: 0 auto;
    top: 50%;
    transform: translateY(-60%);

    .title-wrapper {
      margin-top: 50px;
      margin-bottom: 30px;
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      color: #ffffff;
    }
    .login-form {
      position: relative;
      margin: 0 auto;
      width: 520px;
      padding: 30px 50px;
      box-sizing: border-box;
      border-radius: 5px;
      background-color: #ffffff;

      .el-form-item__content {
        &:last-child {
          margin-bottom: 0;
        }
        .login-btn {
          width: 100%;
          font-size: 16px;
        }
      }
      .check-code-wrapper {
        display: flex;
        justify-content: space-between;
        height: 40px;

        .yanzhengma-wrapper {
          flex: 0 1 auto;
        }
        .validate-code-wrapper {
          flex: 0 0 160px;
        }
      }
    }
  }
}
.copy {
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 20px;
  width: 100%;
}
</style>
