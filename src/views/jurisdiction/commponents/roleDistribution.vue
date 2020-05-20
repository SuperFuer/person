<template>
    <div>
      <!-- 角色分配-弹窗Form -->
      <el-dialog title="角色分配" :visible.sync="dialogRole" :before-close="hidePanel">
        <el-checkbox-group v-model="checkItem">
          <el-checkbox  v-for="item in checkList" :key="item.id" :label="item.id">{{item.roleName}}</el-checkbox>
        </el-checkbox-group>

        <div slot="footer" class="dialog-footer">
          <el-button @click="hidePanel" size="small">取 消</el-button>
          <el-button type="primary" @click="departmentOk" size="small">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { axiosPost, axiosGet } from '@/api/index.js'
export default {
  // props: { // 弹窗显示
  //   dialogRole: {
  //     type:Boolean,
  //     default: false,
  //   },
  //   userId: {
  //     type: String,
  //     default: false,
  //   }
  // },
  props: ['dialogRole', 'userId'],
  data () {
    return {
      formLabelWidth: '120px', // 添加用户输入框宽度
      checkItem: [], // 部门选择
      // checkId:[],
      checkList: [],
      defaultProps: {
        children: 'children',
        label: 'id'
      }
    }
  },
  created () {
    console.log(this.userId)
    this.roleList()
    this.jsList()
  },
  methods: {
    // 取消按钮关闭弹窗
    hidePanel () {
      this.$emit('update:dialogRole', false)
    },
    // 角色
    roleList () {
      axiosGet('base/role/list?userId='+this.userId).then(result => {
        if (result.code === 200) {
          this.checkList = result.data.records
        } else {
          this.$message('网络异常')
        }
      })
    },
    // 获取勾选列表
    jsList () {
      axiosPost('base/role/getRoleApi?roleId' + this.userId).then(result => {
        if (result.code === 200) {
          console.log(result)
        }
      })
    },
    // 选择部门-确定
    departmentOk () {
      axiosPost('base/user/add-roles', {
        userId: this.userId,
        roleIds: this.checkItem
      }).then(result => {
        if (result.code === 200) {
          this.checkItem = []
          this.$message('分配成功')
          this.hidePanel()
        } else {
          this.$message('分配失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
